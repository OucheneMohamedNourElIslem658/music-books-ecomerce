'use client'
import React from 'react'
import { cn } from '@/utilities/cn'

interface WaveformProps {
  isPlaying?: boolean
  className?: string
  barCount?: number
  color?: string
}

export const Waveform: React.FC<WaveformProps> = ({ 
  isPlaying = false, 
  className, 
  barCount = 7,
  color = 'bg-primary'
}) => {
  const heights = [3, 5, 4, 6, 4, 5, 3, 4, 6, 2]
  
  return (
    <div className={cn("flex gap-[2px] items-end h-4", className)}>
      {Array.from({ length: Math.min(barCount, heights.length) }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "w-[2px] rounded-full transition-all duration-300",
            color,
            isPlaying ? "animate-waveform" : "h-[20%]"
          )}
          style={{ 
            height: isPlaying ? `${heights[i % heights.length] * 15}%` : '20%', 
            animationDelay: `${i * 0.1}s` 
          }}
        />
      ))}
    </div>
  )
}
