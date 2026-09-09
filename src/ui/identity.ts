import { todayKey } from './date'

const KEY = 'mf_user_id'

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export interface Identity {
  userId: string
  dateKey: string
  /** ?u= / ?d= 쿼리로 들어온 미리보기 (localStorage 를 건드리지 않음) */
  preview: boolean
}

export function resolveIdentity(search = window.location.search): Identity {
  const q = new URLSearchParams(search)
  const u = q.get('u')
  const d = q.get('d')
  if (u || d) {
    const dateKey = d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : todayKey()
    return { userId: u ?? 'preview', dateKey, preview: true }
  }
  let id: string | null = null
  try {
    id = localStorage.getItem(KEY)
    if (!id) {
      id = newId()
      localStorage.setItem(KEY, id)
    }
  } catch {
    id = newId()
  }
  return { userId: id, dateKey: todayKey(), preview: false }
}
