import type { Fortune } from '../engine/fortune'
import { formatKorean } from './date'

export function buildShareText(f: Fortune, dateKey: string, url: string): string {
  const s = f.stars
  return [
    `🀄 ${formatKorean(dateKey, false)} 마작 운세 — ${f.grade}`,
    `💬 ${f.headline}`,
    `⭐ 공격 ${s.attack} · 수비 ${s.defense} · 도라 ${s.dora} · 흐름 ${s.flow}`,
    `🀄 행운의 패: ${f.luckyTile.name}   🎯 행운의 역: ${f.luckyYaku}`,
    `💡 ${f.tip}`,
    '',
    `${url}  #마작운세 #마작`,
  ].join('\n')
}

export type ShareResult = 'shared' | 'copied' | 'failed'

/** 구형 브라우저·권한 거부 시 폴백: 숨은 textarea + execCommand('copy') */
function legacyCopy(text: string): boolean {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(ta)
  return ok
}

/** Web Share 가능하면 share → clipboard API → execCommand 폴백. */
export async function shareFortune(text: string): Promise<ShareResult> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch {
      // 사용자가 공유 시트를 닫은 경우 등 → 복사로 폴백
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return legacyCopy(text) ? 'copied' : 'failed'
  }
}
