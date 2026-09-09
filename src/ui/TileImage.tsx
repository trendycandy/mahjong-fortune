import type { Tile } from '../data/tiles'

// 에셋 경로는 항상 BASE_URL 기준 (GitHub Pages 프로젝트 경로 대응)
export function TileImage({ tile, className = '' }: { tile: Tile; className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}tiles/${tile.file}`}
      alt={tile.name}
      draggable={false}
      className={`select-none rounded-md ring-1 ring-black/20 drop-shadow-md ${className}`}
    />
  )
}
