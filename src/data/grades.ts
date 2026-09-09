export type Grade = '대길' | '중길' | '소길' | '말길' | '흉'

export const GRADES: readonly Grade[] = ['대길', '중길', '소길', '말길', '흉']
export const GRADE_WEIGHTS: readonly number[] = [10, 25, 35, 20, 10]

/** 별점 기준값 — 여기에 ±1.2 잡음을 더해 반올림 */
export const STAR_BASE: Record<Grade, number> = { 대길: 4.3, 중길: 3.6, 소길: 3.0, 말길: 2.4, 흉: 1.7 }

export const GRADE_COLORS: Record<Grade, string> = {
  대길: 'text-accent',
  중길: 'text-orange-600',
  소길: 'text-felt',
  말길: 'text-slate-600',
  흉: 'text-indigo-700',
}

export type StarKey = 'attack' | 'defense' | 'dora' | 'flow'
export const STAR_KEYS: readonly StarKey[] = ['attack', 'defense', 'dora', 'flow']
export const STAR_LABELS: Record<StarKey, string> = {
  attack: '공격운',
  defense: '수비운',
  dora: '도라운',
  flow: '흐름운',
}
