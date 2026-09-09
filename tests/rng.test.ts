import { describe, it, expect } from 'vitest'
import { hash53, Rng } from '../src/engine/rng'

describe('hash53', () => {
  it('is deterministic and differs across inputs', () => {
    expect(hash53('a|2026-09-09')).toBe(hash53('a|2026-09-09'))
    expect(hash53('a|2026-09-09')).not.toBe(hash53('b|2026-09-09'))
    expect(hash53('a|2026-09-09')).not.toBe(hash53('a|2026-09-10'))
  })
})

describe('Rng', () => {
  it('same seed → same sequence, in [0,1)', () => {
    const a = new Rng(123), b = new Rng(123)
    for (let i = 0; i < 100; i++) {
      const x = a.next()
      expect(x).toBe(b.next())
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThan(1)
    }
  })
  it('int(n) covers 0..n-1', () => {
    const r = new Rng(7)
    const seen = new Set<number>()
    for (let i = 0; i < 1000; i++) {
      const v = r.int(5)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(5)
      seen.add(v)
    }
    expect(seen.size).toBe(5)
  })
  it('weighted respects weights', () => {
    const r = new Rng(42)
    const c = { a: 0, b: 0 }
    for (let i = 0; i < 10000; i++) c[r.weighted(['a', 'b'] as const, [9, 1])]++
    expect(c.a / 10000).toBeGreaterThan(0.87)
    expect(c.a / 10000).toBeLessThan(0.93)
  })
})
