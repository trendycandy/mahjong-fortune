import { useEffect, useMemo, useState } from 'react'
import { generateFortune } from '../engine/fortune'
import { GRADE_COLORS, STAR_KEYS, STAR_LABELS } from '../data/grades'
import { formatKorean } from './date'
import { resolveIdentity } from './identity'
import { buildShareText, shareFortune, type ShareResult } from './share'
import { Stars } from './Stars'
import { TileImage } from './TileImage'

const TOAST: Record<ShareResult, string> = {
  shared: '공유했습니다!',
  copied: '운세가 클립보드에 복사되었습니다! 📋',
  failed: '복사에 실패했습니다. 화면을 캡처해 주세요.',
}

function Card({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <section
      className={`animate-fadeUp rounded-2xl bg-white p-5 shadow-lg ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  )
}

export default function App() {
  const identity = useMemo(() => resolveIdentity(), [])
  const fortune = useMemo(() => generateFortune(identity.userId, identity.dateKey), [identity])
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const onShare = async () => {
    const url = `${location.origin}${location.pathname}`
    const result = await shareFortune(buildShareText(fortune, identity.dateKey, url))
    setToast(TOAST[result])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-felt-dark to-felt text-slate-800">
      <main className="mx-auto max-w-xl px-4 py-6 sm:py-10">
        <header className="mb-6 text-center text-white">
          <h1 className="text-3xl font-bold drop-shadow sm:text-4xl">🀄 오늘의 마작 운세</h1>
          <p className="mt-2 text-sm opacity-90 sm:text-base">매일 접속하여 오늘의 마작 운을 확인하세요</p>
          <p className="mt-1 text-sm font-medium text-yellow-300 drop-shadow">※ 재미로만 봐주세요 ※</p>
          <p className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1.5 text-base font-bold">
            {formatKorean(identity.dateKey)}
          </p>
          {identity.preview && (
            <p className="mt-2 text-xs opacity-70">
              미리보기 · u={identity.userId} · d={identity.dateKey}
            </p>
          )}
        </header>

        <div className="flex flex-col gap-4">
          <Card className="border-4 border-felt text-center">
            <p className="text-sm font-medium text-slate-500">오늘의 운세</p>
            <p className={`my-2 text-5xl font-black sm:text-6xl ${GRADE_COLORS[fortune.grade]}`}>{fortune.grade}</p>
            <p className="text-lg font-medium leading-relaxed">{fortune.headline}</p>
          </Card>

          <Card delay={80}>
            <h2 className="mb-3 text-lg font-bold text-felt">⭐ 오늘의 별점</h2>
            <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5">
              {STAR_KEYS.map((k) => (
                <div key={k} className="contents">
                  <dt className="font-medium text-slate-600">{STAR_LABELS[k]}</dt>
                  <dd>
                    <Stars value={fortune.stars[k]} label={STAR_LABELS[k]} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 border-t border-slate-100 pt-3 text-slate-700">{fortune.comment}</p>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card delay={160} className="flex flex-col items-center text-center">
              <h3 className="text-base font-bold text-felt">🀄 행운의 패</h3>
              <TileImage tile={fortune.luckyTile} className="my-3 w-16 sm:w-20" />
              <p className="text-2xl font-bold text-accent">{fortune.luckyTile.name}</p>
            </Card>
            <Card delay={240} className="flex flex-col items-center justify-center text-center">
              <h3 className="text-base font-bold text-felt">🎯 행운의 역</h3>
              <p className="mt-4 break-keep text-2xl font-bold text-accent">{fortune.luckyYaku}</p>
            </Card>
          </div>

          <Card delay={320}>
            <h2 className="mb-2 text-lg font-bold text-felt">💡 오늘의 팁</h2>
            <p className="leading-relaxed text-slate-700">{fortune.tip}</p>
          </Card>
        </div>

        <footer className="mt-8 text-center text-white">
          <button
            type="button"
            onClick={onShare}
            className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-felt shadow-lg transition active:scale-95"
          >
            📤 운세 공유하기
          </button>
          <div className="h-8 pt-2 text-sm" aria-live="polite">
            {toast}
          </div>
          <p className="text-sm opacity-80">매일 자정에 새로운 운세가 업데이트됩니다</p>
          <p className="mt-3 border-t border-white/20 pt-3 text-xs opacity-70">제작자: 설탕과자냥 (치지직)</p>
        </footer>
      </main>
    </div>
  )
}
