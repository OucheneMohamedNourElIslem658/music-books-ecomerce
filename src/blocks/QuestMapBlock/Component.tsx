import {
    BookOpen,
    ClipboardList,
    Map,
    Music,
    Sparkles,
    Star,
    Target,
    Trophy,
} from 'lucide-react'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

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
}

export const QuestMapBlock: React.FC<QuestMapBlockProps> = ({ title, items }) => {
    if (!items || items.length === 0) return null

    return (
        <div className='container'>
            <section className="w-full py-4">

                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Map className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-extrabold text-white">{title}</h2>
                </div>

                {/* Timeline Container */}
                <div className="relative rounded-2xl border border-white/10 bg-[#0f1623] px-8 py-6">
                    <div className="relative flex flex-col">
                        {items.map((item, index) => {
                            const Icon = iconMap[item.icon ?? 'star']
                            const isLast = index === items.length - 1

                            return (
                                <div key={item.id ?? index} className="relative flex gap-6">

                                    {/* Icon + Line */}
                                    <div className="relative flex flex-col items-center">
                                        <div
                                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${item.isActive
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-white/20 bg-[#1a2236] text-white/40'
                                                }`}
                                        >
                                            {Icon && <Icon className="h-4 w-4" />}
                                        </div>
                                        {/* Vertical line */}
                                        {!isLast && (
                                            <div className="mt-1 w-px flex-1 bg-white/10" style={{ minHeight: '2rem' }} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className={`pb-10 ${isLast ? 'pb-2' : ''}`}>
                                        <h3 className="text-base font-bold text-white leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className={`mt-0.5 mb-2 text-xs font-bold uppercase tracking-widest ${item.isActive ? 'text-primary' : 'text-white/30'}`}>
                                            {item.year} · {item.tag}
                                        </p>
                                        {item.description && (
                                            <p className="text-sm leading-relaxed text-white/50">
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