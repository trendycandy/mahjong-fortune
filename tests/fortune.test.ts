import { describe, it, expect } from 'vitest'
import { generateFortune } from '../src/engine/fortune'
import { GRADES, GRADE_WEIGHTS, STAR_KEYS } from '../src/data/grades'
import { HEADLINES } from '../src/data/headlines'
import { COMMENTS, LOW_COMMENTS } from '../src/data/comments'
import { TIPS, COMMON_TIPS } from '../src/data/tips'
import { YAKUMAN, YAKU_TILE_FILTER } from '../src/data/yaku'

describe('generateFortune', () => {
  it('deterministic', () => {
    expect(generateFortune('u1', '2026-09-09')).toEqual(generateFortune('u1', '2026-09-09'))
  })

  it('differs across users and dates', () => {
    let diffUser = 0
    let diffDate = 0
    for (let i = 0; i < 100; i++) {
      const a = generateFortune(`u${i}`, '2026-09-09')
      if (a.headline !== generateFortune(`v${i}`, '2026-09-09').headline) diffUser++
      if (a.headline !== generateFortune(`u${i}`, '2026-09-10').headline) diffDate++
    }
    expect(diffUser).toBeGreaterThanOrEqual(95)
    expect(diffDate).toBeGreaterThanOrEqual(95)
  })

  it('grade distribution matches weights (±1.5%p over 100k)', () => {
    const n = 100_000
    const count: Record<string, number> = {}
    for (let i = 0; i < n; i++) {
      const g = generateFortune(`user-${i}`, '2026-01-01').grade
      count[g] = (count[g] ?? 0) + 1
    }
    const total = GRADE_WEIGHTS.reduce((a, b) => a + b, 0)
    GRADES.forEach((g, i) => expect(Math.abs(count[g] / n - GRADE_WEIGHTS[i] / total)).toBeLessThan(0.015))
  })

  it('stars are ints 1..5; 대길 mean > 흉 mean; content consistent', () => {
    const sums: Record<string, number[]> = { 대길: [0, 0], 흉: [0, 0] }
    let lowCount = 0
    for (let i = 0; i < 20_000; i++) {
      const f = generateFortune(`s${i}`, '2026-03-03')
      const vals = STAR_KEYS.map((k) => f.stars[k])
      if (Math.max(...vals) <= 2) lowCount++
      for (const v of vals) {
        expect(Number.isInteger(v)).toBe(true)
        expect(v).toBeGreaterThanOrEqual(1)
        expect(v).toBeLessThanOrEqual(5)
      }
      if (sums[f.grade]) {
        sums[f.grade][0] += vals.reduce((s, v) => s + v, 0)
        sums[f.grade][1]++
      }
      expect(HEADLINES[f.grade]).toContain(f.headline)
      const pool = Math.max(...vals) <= 2 ? LOW_COMMENTS[f.topKey] : COMMENTS[f.topKey]
      expect(pool).toContain(f.comment)
      expect(Math.max(...vals) <= 2 ? COMMENTS[f.topKey] : LOW_COMMENTS[f.topKey]).not.toContain(f.comment)
      expect(f.stars[f.topKey]).toBe(Math.max(...vals))
      expect(f.stars[f.lowKey]).toBe(Math.min(...vals))
      expect([...TIPS[f.lowKey], ...COMMON_TIPS]).toContain(f.tip)
    }
    expect(sums['대길'][0] / sums['대길'][1]).toBeGreaterThan(sums['흉'][0] / sums['흉'][1])
    expect(lowCount).toBeGreaterThan(100)
  })

  it('yakuman appear but rarely (<1% combined over 100k), and tiles obey yaku constraints', () => {
    const n = 100_000
    let yakuman = 0
    const seen: Record<string, number> = {}
    for (let i = 0; i < n; i++) {
      const f = generateFortune(`y${i}`, '2026-05-05')
      if (YAKUMAN.includes(f.luckyYaku)) yakuman++
      const filter = YAKU_TILE_FILTER[f.luckyYaku]
      if (filter) {
        seen[f.luckyYaku] = (seen[f.luckyYaku] ?? 0) + 1
        expect(filter(f.luckyTile), `${f.luckyYaku} → ${f.luckyTile.name}`).toBe(true)
      }
    }
    expect(yakuman).toBeGreaterThan(0)
    expect(yakuman / n).toBeLessThan(0.01)
    for (const y of Object.keys(YAKU_TILE_FILTER)) expect(seen[y], y).toBeGreaterThan(0)
  })
})
