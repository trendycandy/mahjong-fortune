import { describe, it, expect } from 'vitest'
import { GRADES, GRADE_WEIGHTS, STAR_KEYS } from '../src/data/grades'
import { TILES } from '../src/data/tiles'
import { YAKU } from '../src/data/yaku'
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
  for (const g of GRADES) checkPool(`headline ${g}`, HEADLINES[g], 40)
  for (const k of STAR_KEYS) checkPool(`comment ${k}`, COMMENTS[k], 20)
  for (const k of STAR_KEYS) checkPool(`low comment ${k}`, LOW_COMMENTS[k], 20)
  for (const k of STAR_KEYS) checkPool(`tip ${k}`, TIPS[k], 20)
  checkPool('common tips', COMMON_TIPS, 30)
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
