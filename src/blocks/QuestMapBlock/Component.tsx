'use client'
import {
  BookOpen,
  ClipboardList,
  Map,
  Music,
  Sparkles,
  Star,
  Target,
  Trophy,
  History,
  ScrollText,
  Wand2,
} from 'lucide-react'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'
import { cn } from '@/utilities/cn'

type TimelineItem = {
  id?: string
  icon?: string
  isActive?: boolean
  title: string
  year: string
  tag: string
  description?: string
}

export type QuestMapBlockProps = {
  id?: DefaultDocumentIDType
  className?: string
  title: string
  items?: TimelineItem[]
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  music: ({ className }) => <Music className={className} />,
  clipboard: ({ className }) => <ClipboardList className={className} />,
  sparkles: ({ className }) => <Sparkles className={className} />,
  star: ({ className }) => <Star className={className} />,
  book: ({ className }) => <BookOpen className={className} />,
  map: ({ className }) => <Map className={className} />,
  target: ({ className }) => <Target className={className} />,
  trophy: ({ className }) => <Trophy className={className} />,
  history: ({ className }) => <History className={className} />,
  scroll: ({ className }) => <ScrollText className={className} />,
  magic: ({ className }) => <Wand2 className={className} />,
}

export const QuestMapBlock: React.FC<QuestMapBlockProps> = ({ title, items, className }) => {
  if (!items || items.length === 0) return null

  return (
    <div className={cn('container py-12', className)}>
      <section className="w-full">
        {/* Section Header - Styled like previous blocks */}
        <div className="flex items-center gap-4 px-4 pb-8">
          <Map className="size-8 text-primary" />
          <h2 className="text-foreground text-3xl font-bold leading-tight tracking-tight">
            {title}
          </h2>
        </div>

        {/* Timeline Container - Matching the open tome/card style */}
        <div className="relative bg-card/50 border border-border rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-lg backdrop-blur-md">
          {/* Background Texture Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none" />
          
          <div className="relative flex flex-col gap-0">
            {items.map((item, index) => {
              const Icon = iconMap[item.icon ?? 'star'] || Star
              const isLast = index === items.length - 1

              return (
                <div key={item.id ?? index} className="grid grid-cols-[60px_1fr] gap-x-6">
                  
                  {/* Left Column: Icon + Connector Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "relative z-10 size-12 rounded-full border flex items-center justify-center transition-all duration-500 shadow-xl",
                        item.isActive 
                          ? "bg-primary/20 border-primary text-primary glow-primary" 
                          : "bg-muted/20 border-border text-muted-foreground"
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    
                    {!isLast && (
                      <div className={cn(
                        "w-[2px] grow min-h-[80px]",
                        item.isActive 
                          ? "bg-gradient-to-b from-primary to-border" 
                          : "bg-border/50"
                      )} />
                    )}
                  </div>

                  {/* Right Column: Content */}
                  <div className={cn("flex flex-col pb-12", isLast && "pb-4")}>
                    <h3 className="text-foreground text-xl font-bold leading-normal mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        item.isActive ? "text-primary" : "text-muted-foreground/60"
                      )}>
                        {item.year} — {item.tag}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
