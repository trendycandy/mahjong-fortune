import { Rng, hash53 } from './rng'
import { GRADES, GRADE_WEIGHTS, STAR_BASE, STAR_KEYS, type Grade, type StarKey } from '../data/grades'
import { TILES, type Tile } from '../data/tiles'
import { YAKU, YAKU_WEIGHTS, YAKU_TILE_FILTER } from '../data/yaku'
import { HEADLINES } from '../data/headlines'
import { COMMENTS, LOW_COMMENTS } from '../data/comments'
import { TIPS, COMMON_TIPS } from '../data/tips'

export type Star = 1 | 2 | 3 | 4 | 5

export interface Fortune {
  grade: Grade
  headline: string
  stars: Record<StarKey, Star>
  comment: string
  luckyTile: Tile
  luckyYaku: string
  tip: string
  /** 별점 최고 항목 (comment 의 출처) */
  topKey: StarKey
  /** 별점 최저 항목 (tip 의 출처 후보) */
  lowKey: StarKey
}

const clampStar = (x: number): Star => Math.min(5, Math.max(1, Math.round(x))) as Star

/**
 * 사용자ID + 날짜 → 결정론적 운세.
 * rng 소비 순서 고정: 등급 → 별점4 → 한줄 → 코멘트(tie) → 역(가중) → 패(역 제약) → 팁(풀선택, tie, 문장).
 * 순서를 바꾸면 모든 사용자의 결과가 바뀐다.
 */
export function generateFortune(userId: string, dateKey: string): Fortune {
  const rng = new Rng(hash53(`${userId}|${dateKey}`))

  const grade = rng.weighted(GRADES, GRADE_WEIGHTS)

  const stars = {} as Record<StarKey, Star>
  for (const k of STAR_KEYS) stars[k] = clampStar(STAR_BASE[grade] + (rng.next() * 2.4 - 1.2))

  const headline = rng.pick(HEADLINES[grade])

  const max = Math.max(...STAR_KEYS.map((k) => stars[k]))
  const topKey = rng.pick(STAR_KEYS.filter((k) => stars[k] === max))
  // 최고 별점이 2 이하면 긍정 코멘트가 어색하므로 낮은 톤 풀에서 뽑는다 (rng 소비 횟수는 동일).
  const comment = rng.pick(max <= 2 ? LOW_COMMENTS[topKey] : COMMENTS[topKey])

  // 역을 먼저 뽑고, 역에 맞는 패 집합에서 행운의 패를 뽑는다 (찬타→요구패, 녹일색→삭수·발 등).
  const luckyYaku = rng.weighted(YAKU, YAKU_WEIGHTS)
  const filter = YAKU_TILE_FILTER[luckyYaku]
  const luckyTile = rng.pick(filter ? TILES.filter(filter) : TILES)

  const useSpecific = rng.next() < 0.7
  const min = Math.min(...STAR_KEYS.map((k) => stars[k]))
  const lowKey = rng.pick(STAR_KEYS.filter((k) => stars[k] === min))
  const tip = rng.pick(useSpecific ? TIPS[lowKey] : COMMON_TIPS)

  return { grade, headline, stars, comment, luckyTile, luckyYaku, tip, topKey, lowKey }
}
