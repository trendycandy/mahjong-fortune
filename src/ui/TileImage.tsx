import type { Tile } from '../data/tiles'

// FluffyStuff 타일셋: 각 패 SVG 는 투명 배경 글리프라 Front.svg(흰 본체) 위에 겹쳐 그린다.
// 에셋 경로는 항상 BASE_URL 기준 (GitHub Pages 프로젝트 경로 대응). 본체 비율 3:4.
const TILE_DIR = `${import.meta.env.BASE_URL}tiles/`

export function TileImage({ tile, className = '' }: { tile: Tile; className?: string }) {
  return (
    <span
      role="img"
      aria-label={tile.name}
      className={`relative block aspect-[3/4] overflow-hidden rounded-md ring-1 ring-slate-300 shadow-md ${className}`}
    >
      <img src={`${TILE_DIR}Front.svg`} alt="" draggable={false} className="absolute inset-0 h-full w-full" />
      <img src={`${TILE_DIR}${tile.file}`} alt="" draggable={false} className="absolute inset-0 h-full w-full" />
    </span>
  )
}
