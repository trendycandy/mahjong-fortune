const pad = (n: number) => String(n).padStart(2, '0')

/** 브라우저 로컬 날짜 YYYY-MM-DD (UTC 아님 — 자정에 운세가 바뀌어야 한다) */
export function todayKey(now = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function formatKorean(dateKey: string, withWeekday = true): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const wd = ['일', '월', '화', '수', '목', '금', '토'][new Date(y, m - 1, d).getDay()]
  return `${y}년 ${m}월 ${d}일` + (withWeekday ? ` (${wd})` : '')
}
