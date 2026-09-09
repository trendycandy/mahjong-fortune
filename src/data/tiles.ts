export interface Tile {
  id: string
  name: string
  file: string
}

const suits: [string, string][] = [
  ['Man', '만'],
  ['Pin', '통'],
  ['Sou', '삭'],
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
  ...suits.flatMap(([id, name]) =>
    Array.from({ length: 9 }, (_, i) => ({ id: `${id}${i + 1}`, name: `${i + 1}${name}`, file: `${id}${i + 1}.svg` })),
  ),
  ...honors.map(([id, name]) => ({ id, name, file: `${id}.svg` })),
]
