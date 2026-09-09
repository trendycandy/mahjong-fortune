import { describe, it, expect } from 'vitest'
import { GRADES, GRADE_WEIGHTS, STAR_KEYS } from '../src/data/grades'
import { TILES } from '../src/data/tiles'
import { YAKU, YAKU_ENTRIES, YAKUMAN, YAKU_TILE_FILTER } from '../src/data/yaku'
import { HEADLINES } from '../src/data/headlines'
import { COMMENTS, LOW_COMMENTS } from '../src/data/comments'
import { TIPS, COMMON_TIPS } from '../src/data/tips'

function checkPool(name: string, pool: readonly string[], min: number) {
  it(`${name}: >=${min}, no dup, no empty`, () => {
    expect(pool.length).toBeGreaterThanOrEqual(min)
    expect(new Set(pool.map((s) => s.trim())).size).toBe(pool.length)
    for (const s of pool) expect(s.trim().length).toBeGreaterThan(0)
  })
}

describe('data pools', () => {
  it('grades/weights aligned', () => {
    expect(GRADES.length).toBe(5)
    expect(GRADE_WEIGHTS.length).toBe(5)
  })
  it('34 tiles, unique ids', () => {
    expect(TILES.length).toBe(34)
    expect(new Set(TILES.map((t) => t.id)).size).toBe(34)
  })
  checkPool('yaku', YAKU, 30)
  it('yaku weights positive; every yakuman and constrained yaku exists in the list', () => {
    for (const e of YAKU_ENTRIES) expect(e.weight).toBeGreaterThan(0)
    for (const y of [...YAKUMAN, ...Object.keys(YAKU_TILE_FILTER)]) expect(YAKU, y).toContain(y)
    expect(YAKUMAN.length).toBe(12)
  })
  it('tile filters are non-empty', () => {
    for (const [y, f] of Object.entries(YAKU_TILE_FILTER)) expect(TILES.filter(f).length, y).toBeGreaterThan(0)
  })
  it('tiles carry suit/rank', () => {
    expect(TILES.find((t) => t.id === 'Pin5')).toMatchObject({ suit: 'p', rank: 5 })
    expect(TILES.find((t) => t.id === 'Hatsu')).toMatchObject({ suit: 'z', rank: 6 })
  })
  for (const g of GRADES) checkPool(`headline ${g}`, HEADLINES[g], 40)
  for (const k of STAR_KEYS) checkPool(`comment ${k}`, COMMENTS[k], 20)
  for (const k of STAR_KEYS) checkPool(`low comment ${k}`, LOW_COMMENTS[k], 20)
  for (const k of STAR_KEYS) checkPool(`tip ${k}`, TIPS[k], 20)
  checkPool('common tips', COMMON_TIPS, 30)
  it('yaku names use 또이또이 (never 도이도이) — regression: a full-file rewrite once reverted the rename', () => {
    const all = [...YAKU, ...Object.values(HEADLINES).flat(), ...Object.values(COMMENTS).flat(), ...Object.values(TIPS).flat(), ...COMMON_TIPS]
    expect(YAKU).toContain('또이또이')
    expect(all.some((s) => s.includes('도이도이'))).toBe(false)
    expect(all.some((s) => s.includes('하테이') || s.includes('호테이'))).toBe(false)
  })
  it('dragon/honor constraints', () => {
    const names = (y: string) => TILES.filter(YAKU_TILE_FILTER[y]).map((t) => t.name)
    expect(names('소삼원')).toEqual(['백', '발', '중'])
    expect(names('대삼원')).toEqual(['백', '발', '중'])
    expect(names('역패')).toEqual(['동', '남', '서', '북', '백', '발', '중'])
    expect(names('자일색')).toEqual(['동', '남', '서', '북', '백', '발', '중'])
    expect(names('소사희')).toEqual(['동', '남', '서', '북'])
    expect(names('탕야오')).toHaveLength(21)
    expect(names('탕야오').some((n) => /^[19]|^[동남서북백발중]$/.test(n))).toBe(false)
    expect(names('대사희')).toEqual(['동', '남', '서', '북'])
    expect(YAKU).toContain('해저로월')
    expect(YAKU).toContain('하저로어')
  })
  it('no 🎴 anywhere', () => {
    const all = [
      ...YAKU,
      ...Object.values(HEADLINES).flat(),
      ...Object.values(COMMENTS).flat(),
      ...Object.values(LOW_COMMENTS).flat(),
      ...Object.values(TIPS).flat(),
      ...COMMON_TIPS,
    ]
    expect(all.some((s) => s.includes('🎴'))).toBe(false)
  })
})
