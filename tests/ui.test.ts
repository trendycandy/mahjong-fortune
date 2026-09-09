import { describe, it, expect } from 'vitest'
import { todayKey, formatKorean } from '../src/ui/date'
import { buildShareText } from '../src/ui/share'
import { generateFortune } from '../src/engine/fortune'

describe('date', () => {
  it('todayKey uses local date, zero-padded', () => {
    expect(todayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(todayKey(new Date(2026, 11, 31, 0, 0))).toBe('2026-12-31')
  })
  it('formatKorean', () => {
    expect(formatKorean('2026-09-09')).toBe('2026년 9월 9일 (수)')
    expect(formatKorean('2026-09-09', false)).toBe('2026년 9월 9일')
  })
})

describe('share text', () => {
  it('contains every field and no 🎴', () => {
    const f = generateFortune('u', '2026-09-09')
    const t = buildShareText(f, '2026-09-09', 'https://example.test/')
    for (const s of [f.grade, f.headline, f.luckyTile.name, f.luckyYaku, f.tip, 'https://example.test/', '#마작운세']) expect(t).toContain(s)
    expect(t.startsWith('🀄 2026년 9월 9일 마작 운세')).toBe(true)
    expect(t.includes('🎴')).toBe(false)
  })
})
