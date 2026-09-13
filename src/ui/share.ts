import type { Fortune } from '../engine/fortune'

/** 트위터 280자(한글·이모지 2자 가중, URL 23) 안에 들어가도록 별점 줄은 빼고 짧게 구성한다. 링크·태그는 유지. */
export function buildShareText(f: Fortune, dateKey: string, url: string): string {
  const [, m, d] = dateKey.split('-').map(Number)
  return [
    `🀄 ${m}월 ${d}일 마작 운세: ${f.grade}`,
    `💬 ${f.headline}`,
    `🀄 행운의 패 ${f.luckyTile.name} · 🎯 행운의 역 ${f.luckyYaku}`,
    `💡 ${f.tip}`,
    `${url} #마작운세 #마작`,
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
