'use client'
import React, { useState } from 'react'
import { Activity } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { Waveform } from '@/components/ui/waveform'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AudioPlayer } from '@/components/AudioPlayer'
import type { Media } from '@/payload-types'

interface SongPreviewProps {
  song?: Media | number | null
  title?: string | null
  thumbnail?: Media | number | null
  className?: string
}

export const SongPreview: React.FC<SongPreviewProps> = ({ 
  song, 
  title, 
  thumbnail,
  className 
}) => {
  const [isAudioOpen, setIsAudioOpen] = useState(false)
  
  const audioUrl = song && typeof song === 'object' && song.url ? song.url : null
  if (!audioUrl) return null

  return (
    <>
      <div 
        onClick={() => setIsAudioOpen(true)}
        className={cn(
          "p-3 rounded-2xl bg-card/30 border border-border backdrop-blur-md flex items-center gap-4 group cursor-pointer hover:bg-card/50 transition-all shadow-xl shadow-primary/5 active:scale-95",
          className
        )}
      >
        <div className="size-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
          <Activity className="size-5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Now Previewing</p>
          <p className="text-sm font-semibold truncate">{title || (typeof song === 'object' ? song.filename : 'Magical Score')}</p>
        </div>
        <Waveform isPlaying={true} className="pr-1" />
      </div>

      <Dialog open={isAudioOpen} onOpenChange={setIsAudioOpen}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md sm:max-w-xl" showCloseButton={false}>
          <DialogTitle className="sr-only">Audio Player</DialogTitle>
          <AudioPlayer 
            url={audioUrl} 
            title={title || (typeof song === 'object' ? song.filename : 'Enchanted Melody')} 
            thumbnail={thumbnail}
            onClose={() => setIsAudioOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
