import configPromise from '@payload-config'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

export const ChroniclesSidebar: React.FC = async () => {
    const payload = await getPayload({ config: configPromise })

    const recent = await payload.find({
        collection: 'pages',
        limit: 3,
        draft: false,
        overrideAccess: false,
        select: { title: true, slug: true, publishedOn: true, categories: true },
        where: {
            and: [
                { _status: { equals: 'published' } },
                // { template: { equals: 'chronicle' } },
            ],
        },
        sort: '-publishedOn',
    })

    const tagColors: Record<string, string> = {
        'new-release': 'text-emerald-400',
        'royal-tour': 'text-blue-400',
        'signing': 'text-amber-400',
    }

    const tagLabels: Record<string, string> = {
        'new-release': 'Archive Entry',
        'royal-tour': 'Travel Log',
        'signing': 'Fan Works',
    }

    return (
        <div className="flex flex-col gap-5">

            {/* Newsletter */}
            <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-foreground">The Royal Messenger</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Be the first to receive proclamations of tours, secret chapters, and magical giveaways.
                    </p>
                </div>
                <input
                    type="email"
                    placeholder="Your herald address (Email)"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
                <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-between rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/80 transition-colors"
                >
                    Join the Service
                    <span>›</span>
                </Link>
                <p className="text-[10px] text-muted-foreground text-center">
                    By joining, you agree to the Kingdom&apos;s Scrolls of Privacy.
                </p>
            </div>

            {/* Recently inscribed */}
            <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Recently Inscribed
                    </span>
                </div>

                <div className="flex flex-col divide-y divide-border">
                    {recent.docs.map((post) => {

                        return (
                            <Link
                                key={post.id}
                                href={`/${post.slug}`}
                                className="group flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0"
                            >
                                <h4 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                                {post.publishedOn && (
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(post.publishedOn).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}