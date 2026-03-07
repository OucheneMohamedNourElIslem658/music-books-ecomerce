'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, X, Activity, VolumeX } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'

interface AudioPlayerProps {
  url: string
  title?: string
  thumbnail?: any
  onClose?: () => void
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title, thumbnail, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const onLoadedMetadata = () => {
      setDuration(audio.duration)
      setError(null)
    }

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    const onError = () => {
      setError('Playback interrupted or file not found')
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    // Attempt to play on mount if URL is valid
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Auto-play was prevented or interrupted
        setIsPlaying(false)
      })
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [url])

  const togglePlay = async () => {
    if (!audioRef.current) return
    
    try {
      if (audioRef.current.paused) {
        await audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    } catch (err) {
      console.error('Playback failed:', err)
      setError('Playback failed. Please try again.')
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (audioRef.current && duration) {
      const time = (val / 100) * duration
      audioRef.current.currentTime = time
      setProgress(val)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted
      setIsMuted(newMuteState)
      audioRef.current.muted = newMuteState
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl glow-primary">
      <audio ref={audioRef} src={url} preload="metadata" />
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-muted relative">
            {thumbnail ? (
              <Media resource={thumbnail} fill imgClassName="object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center bg-primary/20">
                <Activity className="size-8 text-primary" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
              {error ? <span className="text-destructive">Error</span> : 'Now Playing Sample'}
            </p>
            <h3 className="text-lg font-bold text-white truncate">{error || title || 'Enchanted Melody'}</h3>
            <div className="flex items-center gap-2 mt-1">
               <div className="flex gap-[2px] items-end h-3 shrink-0">
                {[3, 5, 4, 6, 4].map((h, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-[2px] bg-primary rounded-full transition-all duration-300",
                      isPlaying ? "animate-waveform" : "h-[20%]"
                    )}
                    style={{ 
                      height: isPlaying ? `${h * 15}%` : '20%', 
                      animationDelay: `${i * 0.1}s` 
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium text-white/40 font-mono">
                {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={togglePlay}
              disabled={!!error}
              className="size-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current translate-x-0.5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative group flex items-center h-2">
             <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              disabled={!duration || !!error}
              className="absolute w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary group-hover:h-1.5 transition-all disabled:cursor-default"
              style={{
                background: `linear-gradient(to right, var(--primary) ${progress}%, rgba(255, 255, 255, 0.1) ${progress}%)`
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 w-32 group">
              <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60 group-hover:accent-primary transition-all"
                style={{
                  background: `linear-gradient(to right, ${isMuted ? 'rgba(255, 255, 255, 0.1)' : 'var(--primary)'} ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.1) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>
            
            {onClose && (
               <button 
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1"
              >
                <X className="size-3" />
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid var(--primary);
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .group:hover input[type='range']::-webkit-slider-thumb {
          opacity: 1;
        }
        input[type='range']::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid var(--primary);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .group:hover input[type='range']::-moz-range-thumb {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
