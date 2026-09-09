import type { Star } from '../engine/fortune'

export function Stars({ value, label }: { value: Star; label: string }) {
  return (
    <span className="tracking-wide text-lg" role="img" aria-label={`${label} ${value}점`}>
      <span className="text-amber-400">{'★'.repeat(value)}</span>
      <span className="text-slate-300">{'☆'.repeat(5 - value)}</span>
    </span>
  )
}
