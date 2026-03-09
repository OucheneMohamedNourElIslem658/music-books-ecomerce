'use client'

import { Media } from '@/components/Media'
import { Link } from '@/i18n/navigation'
import { useAudio } from '@/providers/AudioProvider'
import { cn } from '@/utilities/cn'
import { Activity, Pause, Play, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function GlobalAudioPlayer() {
    const {
        pinned, isPinnedPlaying, pinnedProgress, pinnedDuration,
        unpin, togglePinnedPlay, seekPinned,
    } = useAudio()

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (pinned) requestAnimationFrame(() => setVisible(true))
        else setVisible(false)
    }, [!!pinned])

    if (!pinned) return null

    const fmt = (t: number) => {
        if (!t || isNaN(t)) return '0:00'
        return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
    }

    const currentTime = pinnedDuration ? (pinnedProgress / 100) * pinnedDuration : 0

    return (
        <div className={cn(
            'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl transition-all duration-500',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}>
            {/* Pill */}
            <div className="
        bg-white/90 dark:bg-slate-900/90
        border border-black/10 dark:border-white/10
        backdrop-blur-xl rounded-full
        shadow-2xl shadow-black/10 dark:shadow-black/40
        overflow-hidden
        [box-shadow:0_0_20px_rgba(var(--primary-rgb,43,108,238),0.2)]
      ">
                {/* Progress bar */}
                <div className="h-[2px] w-full bg-black/10 dark:bg-white/10">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${pinnedProgress}%` }}
                    />
                </div>

                <div className="flex items-center gap-4 p-2 pr-5">

                    {/* Thumbnail */}
                    {pinned.sourceSlug ? (
                        <Link
                            href={`/products/${pinned.sourceSlug}`}
                            className="size-12 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10 relative block"
                        >
                            {pinned.thumbnail ? (
                                <Media resource={pinned.thumbnail} fill imgClassName="object-cover" />
                            ) : (
                                <div className="size-full bg-primary/20 flex items-center justify-center">
                                    <Activity className="size-5 text-primary" />
                                </div>
                            )}
                        </Link>
                    ) : (
                        <div className="size-12 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10 relative">
                            {pinned.thumbnail ? (
                                <Media resource={pinned.thumbnail} fill imgClassName="object-cover" />
                            ) : (
                                <div className="size-full bg-primary/20 flex items-center justify-center">
                                    <Activity className="size-5 text-primary" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-tighter truncate">
                            Now Playing
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {pinned.title}
                            {pinned.sourceTitle && (
                                <span className="text-slate-500 dark:text-white/40 font-normal"> — {pinned.sourceTitle}</span>
                            )}
                        </p>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-4 shrink-0">

                        {/* Waveform */}
                        <div className="hidden md:flex items-end gap-[3px] h-5">
                            {[3, 5, 4, 6, 3].map((h, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        'w-[3px] bg-primary rounded-full',
                                        isPinnedPlaying ? 'animate-waveform' : 'opacity-30',
                                    )}
                                    style={{ height: `${h * 16}%`, animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </div>

                        {/* Time */}
                        <span className="hidden md:block text-[10px] font-mono text-slate-400 dark:text-white/40 tabular-nums">
                            {fmt(currentTime)} / {fmt(pinnedDuration)}
                        </span>

                        {/* Play / Pause */}
                        <button
                            onClick={togglePinnedPlay}
                            className="size-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
                        >
                            {isPinnedPlaying
                                ? <Pause className="size-4 fill-current" />
                                : <Play className="size-4 fill-current translate-x-0.5" />}
                        </button>

                        {/* Unpin */}
                        <button
                            onClick={unpin}
                            className="text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Seek range */}
            <input
                type="range"
                min="0" max="100"
                value={pinnedProgress}
                onChange={e => seekPinned(Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-[6px] opacity-0 cursor-pointer"
                style={{ margin: 0 }}
            />
        </div>
    )
}