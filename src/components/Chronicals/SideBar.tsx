import { Link } from '@/i18n/navigation'
import { LocaleType } from '@/types/locale'
import configPromise from '@payload-config'
import { Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'

interface ChroniclesSidebarProps {
    locale: LocaleType
}

export const ChroniclesSidebar = async ({ locale }: ChroniclesSidebarProps) => {
    const payload = await getPayload({ config: configPromise })
    const t = await getTranslations('chronicles.sidebar')

    const recent = await payload.find({
        collection: 'pages',
        limit: 3,
        draft: false,
        overrideAccess: false,
        locale,
        select: { title: true, slug: true, publishedOn: true, hero: true },
        where: {
            and: [
                { _status: { equals: 'published' } },
                { isBlog: { equals: true } },
            ],
        },
        sort: '-publishedOn',
    })

    return (
        <div className="flex flex-col gap-10">

            {/* Newsletter */}
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-8 rounded-2xl relative overflow-hidden shadow-2xl shadow-primary/5">
                <div className="absolute -top-4 -right-4 size-24 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white mb-6 shadow-lg shadow-primary/20">
                        <Mail className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-3 italic">{t('messengerTitle')}</h3>
                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium">
                        {t('messengerDescription')}
                    </p>
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            className="w-full bg-white dark:bg-slate-800 border border-border rounded-full py-3.5 px-6 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                        />
                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-full transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                            {t('joinService')} <span className="material-symbols-outlined text-sm rtl:rotate-180">send</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 mt-6 text-center font-bold uppercase tracking-tighter">
                        {t('privacyNote')}
                    </p>
                </div>
            </div>

            {/* Recently inscribed */}
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-3">
                    <span className="size-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_oklch(var(--primary))]"></span>
                    {t('recentlyInscribed')}
                </h3>
                <div className="space-y-8">
                    {recent.docs.map((post, i) => (
                        <Link
                            key={post.id}
                            href={`/${post.slug}`}
                            className="group flex flex-col gap-2 transition-all"
                        >
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest">{t('archiveEntry')} #{421 - i}</p>
                            <h4 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 italic">
                                {post.title}
                            </h4>
                            {post.publishedOn && (
                                <p className="text-xs text-muted-foreground font-medium">
                                    {new Date(post.publishedOn).toLocaleDateString(locale, {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
