export type Suit = 'm' | 'p' | 's' | 'z'

export interface Tile {
  id: string
  name: string
  file: string
  suit: Suit
  /** 수패 1~9, 자패는 동1 남2 서3 북4 백5 발6 중7 */
  rank: number
}

const suits: [string, string, Suit][] = [
  ['Man', '만', 'm'],
  ['Pin', '통', 'p'],
  ['Sou', '삭', 's'],
]
const honors: [string, string][] = [
  ['Ton', '동'],
  ['Nan', '남'],
  ['Shaa', '서'],
  ['Pei', '북'],
  ['Haku', '백'],
  ['Hatsu', '발'],
  ['Chun', '중'],
]

export const TILES: readonly Tile[] = [
  ...suits.flatMap(([id, name, suit]) =>
    Array.from({ length: 9 }, (_, i) => ({
      id: `${id}${i + 1}`,
      name: `${i + 1}${name}`,
      file: `${id}${i + 1}.svg`,
      suit,
      rank: i + 1,
    })),
  ),
  ...honors.map(([id, name], i) => ({ id, name, file: `${id}.svg`, suit: 'z' as Suit, rank: i + 1 })),
]

export const isHonor = (t: Tile) => t.suit === 'z'
/** 노두패: 수패 1·9 */
export const isTerminal = (t: Tile) => !isHonor(t) && (t.rank === 1 || t.rank === 9)
/** 요구패: 노두패 + 자패 */
export const isYaochu = (t: Tile) => isHonor(t) || isTerminal(t)
