'use client'

import type { Media } from '@/payload-types'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PinnedSong = {
    url: string
    title: string        // songGroup.title
    description: string  // songGroup.description
    sourceTitle: string  // product.title or page.title
    sourceSlug?: string  // for the thumbnail link
    thumbnail?: Media | null
}

type AudioContextType = {
    // Global pinned player state
    pinned: PinnedSong | null
    isPinnedPlaying: boolean
    pinnedProgress: number  // 0–100
    pinnedDuration: number
    volume: number
    isMuted: boolean
    pin: (song: PinnedSong) => void
    unpin: () => void
    togglePinnedPlay: () => void
    seekPinned: (pct: number) => void
    setVolume: (v: number) => void
    toggleMute: () => void
    // Helper to check if a url is currently pinned
    isPinned: (url: string) => boolean
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AudioContext = createContext<AudioContextType | null>(null)

export function useAudio() {
    const ctx = useContext(AudioContext)
    if (!ctx) throw new Error('useAudio must be used inside AudioProvider')
    return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [pinned, setPinned] = useState<PinnedSong | null>(null)
    const [isPinnedPlaying, setIsPinnedPlaying] = useState(false)
    const [pinnedProgress, setPinnedProgress] = useState(0)
    const [pinnedDuration, setPinnedDuration] = useState(0)
    const [volume, setVolumeState] = useState(0.7)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        const audio = new Audio()
        audio.volume = 0.7
        audioRef.current = audio

        const onTimeUpdate = () => {
            if (audio.duration) setPinnedProgress((audio.currentTime / audio.duration) * 100)
        }
        const onLoadedMetadata = () => setPinnedDuration(audio.duration)
        const onPlay = () => setIsPinnedPlaying(true)
        const onPause = () => setIsPinnedPlaying(false)
        const onEnded = () => { setIsPinnedPlaying(false); setPinnedProgress(0) }

        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('loadedmetadata', onLoadedMetadata)
        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause)
        audio.addEventListener('ended', onEnded)

        return () => {
            audio.pause()
            audio.removeEventListener('timeupdate', onTimeUpdate)
            audio.removeEventListener('loadedmetadata', onLoadedMetadata)
            audio.removeEventListener('play', onPlay)
            audio.removeEventListener('pause', onPause)
            audio.removeEventListener('ended', onEnded)
        }
    }, [])

    const pin = useCallback((newSong: PinnedSong) => {
        const audio = audioRef.current
        if (!audio) return
        setPinned(newSong)
        setPinnedProgress(0)
        setPinnedDuration(0)
        audio.src = newSong.url
        audio.load()
        audio.play().catch(() => setIsPinnedPlaying(false))
    }, [])

    const unpin = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        audio.pause()
        audio.src = ''
        setPinned(null)
        setIsPinnedPlaying(false)
        setPinnedProgress(0)
        setPinnedDuration(0)
    }, [])

    const togglePinnedPlay = useCallback(async () => {
        const audio = audioRef.current
        if (!audio || !pinned) return
        if (audio.paused) await audio.play().catch(() => { })
        else audio.pause()
    }, [pinned])

    const seekPinned = useCallback((pct: number) => {
        const audio = audioRef.current
        if (!audio || !pinnedDuration) return
        audio.currentTime = (pct / 100) * pinnedDuration
        setPinnedProgress(pct)
    }, [pinnedDuration])

    const setVolume = useCallback((v: number) => {
        const audio = audioRef.current
        if (!audio) return
        audio.volume = v
        setVolumeState(v)
        setIsMuted(v === 0)
    }, [])

    const toggleMute = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        const next = !isMuted
        audio.muted = next
        setIsMuted(next)
    }, [isMuted])

    const isPinned = useCallback((url: string) => pinned?.url === url, [pinned])

    return (
        <AudioContext.Provider value={{
            pinned, isPinnedPlaying, pinnedProgress, pinnedDuration,
            volume, isMuted,
            pin, unpin, togglePinnedPlay, seekPinned,
            setVolume, toggleMute, isPinned,
        }}>
            {children}
        </AudioContext.Provider>
    )
}