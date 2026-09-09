// cyrb53 — 문자열 → 53비트 정수 해시 (결정론적)
export function hash53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

// mulberry32 — 32비트 시드 PRNG, [0, 1)
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class Rng {
  private readonly f: () => number

  /** 53비트 해시를 받아도 상위 비트를 접어 넣어 32비트 시드로 만든다. */
  constructor(seed: number) {
    const hi = Math.floor(seed / 4294967296)
    this.f = mulberry32((seed ^ hi) >>> 0)
  }

  next(): number {
    return this.f()
  }

  int(n: number): number {
    return Math.floor(this.next() * n)
  }

  /** 후보가 1개여도 항상 rng 를 1회 소비한다 (소비 순서 고정 계약). */
  pick<T>(arr: readonly T[]): T {
    return arr[this.int(arr.length)]
  }

  weighted<T>(items: readonly T[], weights: readonly number[]): T {
    const total = weights.reduce((s, w) => s + w, 0)
    let x = this.next() * total
    for (let i = 0; i < items.length; i++) {
      x -= weights[i]
      if (x < 0) return items[i]
    }
    return items[items.length - 1]
  }
}
