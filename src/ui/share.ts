import type { Fortune } from '../engine/fortune'
import { formatKorean } from './date'

export function buildShareText(f: Fortune, dateKey: string, url: string): string {
  const s = f.stars
  const star = (v: number) => '★'.repeat(v) + '☆'.repeat(5 - v)
  return [
    `🀄 ${formatKorean(dateKey, false)} 마작 운세 — ${f.grade}`,
    `💬 ${f.headline}`,
    `공격운 ${star(s.attack)}  수비운 ${star(s.defense)}`,
    `도라운 ${star(s.dora)}  흐름운 ${star(s.flow)}`,
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

/** 터치 기기(폰/태블릿)에서만 공유 시트를 쓴다. 데스크톱 Chrome 도 navigator.share 가 있어서
 *  Windows 공유 시트가 먼저 뜨고, 취소하면 클릭 권한이 만료돼 클립보드 복사까지 실패했다. */
function isTouchDevice(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
}

/** 모바일: Web Share → 실패 시 복사. 데스크톱: clipboard API → execCommand 폴백. */
export async function shareFortune(text: string): Promise<ShareResult> {
  if (isTouchDevice() && typeof navigator.share === 'function') {
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
