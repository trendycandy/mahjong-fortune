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
    expect(t.startsWith('🀄 9월 9일 마작 운세')).toBe(true)
    expect(t.includes('🎴')).toBe(false)
    // 별점 줄은 트위터 글자수 제한 때문에 뺐다 (링크·태그는 유지)
    expect(t).not.toMatch(/공격운|수비운|도라운|흐름운|★|☆/)
    expect(t.trim().endsWith('#마작운세 #마작')).toBe(true)
  })

  it('fits in a tweet (280 weighted: URL=23, non-ASCII=2) for every fortune in a 30k sample', () => {
    const url = 'https://trendycandy.github.io/mahjong-fortune/'
    const weight = (t: string) => {
      let n = 0
      for (const ch of t.replace(url, 'x'.repeat(23))) n += ch.charCodeAt(0) < 128 ? 1 : 2
      return n
    }
    let max = 0
    for (let i = 0; i < 30_000; i++) {
      max = Math.max(max, weight(buildShareText(generateFortune(`L${i}`, '2026-12-31'), '2026-12-31', url)))
    }
    expect(max).toBeLessThanOrEqual(280)
  })
})
