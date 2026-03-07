'use client'
import { cn } from '@/utilities/cn'
import {
  BookOpen,
  CloudLightning,
  Flame,
  Lightbulb,
  Map,
  Mic,
  Mic2,
  Music,
  Pen,
  PenTool,
  Piano,
  Settings,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type HighlightItem = {
  id?: string
  icon?: string
  title: string
  description?: string
}

export type AuthorHighlightsBlockProps = {
  id?: DefaultDocumentIDType
  className?: string
  title: string
  icon?: string
  items?: HighlightItem[]
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  settings: ({ className }) => <Settings className={className} />,
  music: ({ className }) => <Music className={className} />,
  book: ({ className }) => <BookOpen className={className} />,
  star: ({ className }) => <Star className={className} />,
  map: ({ className }) => <Map className={className} />,
  target: ({ className }) => <Target className={className} />,
  pen: ({ className }) => <PenTool className={className} />,
  piano: ({ className }) => <Piano className={className} />,
  mic: ({ className }) => <Mic2 className={className} />,
  fire: ({ className }) => <Flame className={className} />,
  lightbulb: ({ className }) => <Lightbulb className={className} />,
  trophy: ({ className }) => <Trophy className={className} />,
  storm: ({ className }) => <CloudLightning className={className} />,
  zap: ({ className }) => <Zap className={className} />,
  ink_pen: ({ className }) => <Pen className={className} />,
  settings_voice: ({ className }) => <Mic className={className} />,
}

export const AuthorHighlightsBlock: React.FC<AuthorHighlightsBlockProps> = ({
  title,
  icon = 'storm',
  items,
  className,
}) => {
  if (!items || items.length === 0) return null

  const SectionIcon = iconMap[icon] || CloudLightning

  return (
    <div className={cn('container py-12', className)}>
      <section className="w-full">
        {/* Section Header */}
        <div className="flex items-center gap-4 px-4 pb-8">
          <SectionIcon className="size-8 text-primary" />
          <h2 className="text-foreground text-3xl font-bold leading-tight tracking-tight">
            {title}
          </h2>
        </div>

        {/* Harmonic Forge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {items.map((item, index) => {
            const CardIcon = iconMap[item.icon ?? 'star'] || Star

            return (
              <div
                key={item.id ?? index}
                className="bg-muted border border-border p-8 rounded-[2.5rem] hover:bg-muted/30 transition-all duration-500 group"
              >
                {/* Icon Container with large radius */}
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                  <CardIcon className="size-7" />
                </div>

                {/* Content */}
                <h3 className="text-foreground text-xl font-bold mb-3">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
