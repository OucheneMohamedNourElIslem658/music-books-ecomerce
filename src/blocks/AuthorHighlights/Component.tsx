import {
    BookOpen,
    Flame, Lightbulb,
    Map,
    Mic,
    Music,
    Pen, Piano,
    Settings,
    Star,
    Target,
    Trophy,
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
    pen: ({ className }) => <Pen className={className} />,
    piano: ({ className }) => <Piano className={className} />,
    mic: ({ className }) => <Mic className={className} />,
    fire: ({ className }) => <Flame className={className} />,
    lightbulb: ({ className }) => <Lightbulb className={className} />,
    trophy: ({ className }) => <Trophy className={className} />,
}

export const AuthorHighlightsBlock: React.FC<AuthorHighlightsBlockProps> = ({
    title,
    icon = 'settings',
    items,
}) => {
    if (!items || items.length === 0) return null

    const SectionIcon = iconMap[icon]

    return (
        <div className='container'>
            <section className="w-full py-4">

                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                    {SectionIcon && <SectionIcon className="h-5 w-5 text-primary" />}
                    <h2 className="text-xl font-extrabold text-white">{title}</h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => {
                        const CardIcon = iconMap[item.icon ?? 'star']

                        return (
                            <div
                                key={item.id ?? index}
                                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0f1623] p-6 transition-all duration-300 hover:border-primary/30 hover:bg-[#111827]"
                            >
                                {/* Icon */}
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                    {CardIcon && <CardIcon className="h-5 w-5 text-primary" />}
                                </div>

                                {/* Text */}
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-sm leading-relaxed text-white/50">{item.description}</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}