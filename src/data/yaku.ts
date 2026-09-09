import { isHonor, isTerminal, isYaochu, type Tile } from './tiles'

export interface YakuEntry {
  name: string
  /** 추첨 가중치. 일반 역 100, 역만 2 → 역만 12종 합계 ≈ 0.9% */
  weight: number
}

const NORMAL = 100
const RARE = 2

export const YAKUMAN: readonly string[] = [
  '국사무쌍', '대삼원', '스안커', '소사희', '대사희', '자일색',
  '녹일색', '청노두', '구련보등', '사깡즈', '천화', '지화',
]

const NORMAL_YAKU: readonly string[] = [
  '리치', '일발', '멘젠쯔모', '탕야오', '핑후', '역패', '이페코', '해저로월', '하저로어', '영상개화',
  '창깡', '더블리치', '치또이츠', '삼색동순', '삼색동각', '일기통관', '찬타', '준찬타', '혼노두', '산안커',
  '산깡즈', '소삼원', '또이또이', '량페코', '혼일색', '청일색',
]

export const YAKU_ENTRIES: readonly YakuEntry[] = [
  ...NORMAL_YAKU.map((name) => ({ name, weight: NORMAL })),
  ...YAKUMAN.map((name) => ({ name, weight: RARE })),
]

export const YAKU: readonly string[] = YAKU_ENTRIES.map((e) => e.name)
export const YAKU_WEIGHTS: readonly number[] = YAKU_ENTRIES.map((e) => e.weight)

/** 삼원패: 백·발·중 (자패 rank 5·6·7) */
const isDragon = (t: Tile) => t.suit === 'z' && t.rank >= 5
/** 바람패: 동·남·서·북 (자패 rank 1~4) */
const isWind = (t: Tile) => t.suit === 'z' && t.rank <= 4

/** 역별 행운의 패 제약. 없으면 34종 전체. */
export const YAKU_TILE_FILTER: Record<string, (t: Tile) => boolean> = {
  찬타: isYaochu,
  혼노두: isYaochu,
  준찬타: isTerminal,
  청노두: isTerminal,
  녹일색: (t) => (t.suit === 's' && [2, 3, 4, 6, 8].includes(t.rank)) || (t.suit === 'z' && t.rank === 6),
  소삼원: isDragon,
  대삼원: isDragon,
  역패: isHonor,
  자일색: isHonor,
  탕야오: (t) => !isYaochu(t),
  소사희: isWind,
  대사희: isWind,
}
