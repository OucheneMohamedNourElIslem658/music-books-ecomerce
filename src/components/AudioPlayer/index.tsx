'use client'

import { Media } from '@/components/Media'
import { Media as MediaType } from '@/payload-types'
import { useAudio } from '@/providers/AudioProvider'
import { cn } from '@/utilities/cn'
import { Activity, Pause, Pin, PinOff, Play, Volume2, VolumeX, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface AudioPlayerProps {
  title?: string | null
  description?: string | null
  audio: MediaType
  sourceTitle?: string
  sourceSlug?: string
  thumbnail?: MediaType | null
  onClose?: () => void
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audio, onClose, title, description, sourceTitle, sourceSlug, thumbnail,
}) => {
  const { pin, unpin, isPinned } = useAudio()
  const pinned = isPinned(audio.url ?? '')

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const updateProgress = () => { if (el.duration) setProgress((el.currentTime / el.duration) * 100) }
    const onLoadedMetadata = () => { setDuration(el.duration); setError(null) }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    const onError = () => { setError('Playback interrupted or file not found'); setIsPlaying(false) }
    el.addEventListener('timeupdate', updateProgress)
    el.addEventListener('loadedmetadata', onLoadedMetadata)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)
    el.addEventListener('error', onError)
    el.play().catch(() => setIsPlaying(false))
    return () => {
      el.removeEventListener('timeupdate', updateProgress)
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('error', onError)
    }
  }, [])

  const togglePlay = async () => {
    if (!audioRef.current) return
    try {
      if (audioRef.current.paused) await audioRef.current.play()
      else audioRef.current.pause()
    } catch { setError('Playback failed. Please try again.') }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (val / 100) * duration
      setProgress(val)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    setVolume(v)
    if (audioRef.current) { audioRef.current.volume = v; setIsMuted(v === 0) }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const next = !isMuted
    setIsMuted(next)
    audioRef.current.muted = next
  }

  const handlePin = () => {
    if (!audio.url) return
    if (pinned) {
      unpin()
    } else {
      audioRef.current?.pause()
      pin({
        url: audio.url,
        title: title || audio.filename || 'Enchanted Melody',
        description: description || '',
        sourceTitle: sourceTitle || '',
        sourceSlug,
        thumbnail: thumbnail ?? null,
      })
    }
  }

  const fmt = (t: number) => {
    if (isNaN(t)) return '0:00'
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
  }

  return (
    <div className="w-full min-w-0 rounded-3xl p-4 shadow-2xl backdrop-blur-xl bg-white/90 dark:bg-slate-900/95 border border-black/10 dark:border-white/10 glow-primary">
      {audio.url && <audio ref={audioRef} src={audio.url} preload="metadata" />}

      <div className="flex flex-col gap-4">

        {/* Top row: thumbnail + info + play */}
        <div className="flex items-center gap-3 min-w-0">

          <div className="size-14 shrink-0 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-muted relative">
            {thumbnail ? (
              <Media resource={thumbnail} fill imgClassName="object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center bg-primary/10">
                <Activity className="size-6 text-primary" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5 truncate">
              {error ? <span className="text-destructive">Error</span> : 'Now Playing'}
            </p>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {error || title || 'Enchanted Melody'}
            </h3>
            {description && (
              <p className="text-[10px] text-slate-500 dark:text-white/40 truncate">{description}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5 items-end h-3 shrink-0">
                {[3, 5, 4, 6, 4].map((h, i) => (
                  <div
                    key={i}
                    className={cn('w-0.5 bg-primary rounded-full', isPlaying ? 'animate-waveform' : 'opacity-20')}
                    style={{ height: `${h * 15}%`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-white/40 tabular-nums">
                {fmt(audioRef.current?.currentTime || 0)} / {fmt(duration)}
              </span>
            </div>
          </div>

          <button
            onClick={togglePlay}
            disabled={!!error}
            className="size-11 shrink-0 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying
              ? <Pause className="size-5 fill-current" />
              : <Play className="size-5 fill-current translate-x-0.5" />}
          </button>
        </div>

        {/* Seek bar */}
        <div className="relative h-1 rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range" min="0" max="100" value={progress}
            onChange={handleSeek}
            disabled={!duration || !!error}
            className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-default"
          />
        </div>

        {/* Volume + pin + close */}
        <div className="flex items-center justify-between gap-4">

          {/* Volume */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={toggleMute}
              className="text-slate-400 dark:text-white/50 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
            >
              {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <div className="relative h-1 rounded-full bg-black/10 dark:bg-white/10 w-full max-w-24">
              <div
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
              <input
                type="range" min="0" max="1" step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Pin + Close */}
          <div className="flex items-center gap-3 shrink-0">
            {audio.url && (
              <button
                onClick={handlePin}
                title={pinned ? 'Unpin' : 'Keep playing while browsing'}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors',
                  pinned ? 'text-accent-gold' : 'text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white',
                )}
              >
                {pinned ? <PinOff className="size-3" /> : <Pin className="size-3" />}
                {pinned ? 'Pinned' : 'Pin'}
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="size-3" /> Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}