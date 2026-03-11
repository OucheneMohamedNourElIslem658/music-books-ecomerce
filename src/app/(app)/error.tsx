'use client'

import { AlertCircle, Castle, Sparkles, Star, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 min-h-[80vh] w-full">
      <div className="layout-content-container flex flex-col max-w-200 w-full items-center text-center">
        {/* Hero Illustration Section */}
        <div className="relative w-full aspect-video md:aspect-21/9 rounded-3xl overflow-hidden mb-12 bg-linear-to-br from-[#1a2333] to-background border border-border shadow-2xl">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(43,108,238,0.2),transparent_70%)]"></div>
          <div className="flex h-full w-full items-center justify-center relative z-10">
            {/* Visual Representation: Wizard's familiar among spilled ink and sparks */}
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCj63FIt1Vx2vbEvxtzlqfAsdJjELzH7mz-eFMnhBWuqtJscdUq2n6Nca2B9gsdbE4D24EPQUz-a30Kb8HhxzNZNUdPHOaHLcL6TQ-LCgKVrg4RCpZRQDEwCNiB6cVrBypVIIPZdQtdX0VUm8OCwiv37WUeSq5zeOuScSZ7dawGYLEL4VN7MuqWyunTqaEcmuzFA7alumuSvrnexfznCJvU8o2SBrnHqIdUSvjxgHYfTog4ssfXO3hnZnQXoYsCo5ZtnoJGpzFK2ICf")' }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent"></div>
              {/* Floating sparkles */}
              <div className="absolute top-1/4 left-1/4 text-primary opacity-60 animate-pulse">
                <Sparkles size={24} />
              </div>
              <div className="absolute top-1/3 right-1/4 text-primary opacity-40">
                <Wand2 size={20} />
              </div>
              <div className="absolute bottom-1/4 right-1/3 text-primary opacity-50">
                <Star size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-150 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
            <AlertCircle size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Spell Interrupted</span>
          </div>
          <h1 className="text-foreground tracking-tight text-4xl md:text-5xl font-black leading-tight mb-6 uppercase italic">
            A Magical Mishap
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-12">
            The winds of magic are turbulent. We couldn&apos;t cast that spell. It seems your destination has vanished into thin air like a wizard&apos;s smoke.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
            <button
              onClick={() => window.location.reload()}
              className="flex h-14 w-full sm:flex-1 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 group"
            >
              <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="truncate">Retry Incantation</span>
            </button>
            <Link
              href="/"
              className="flex h-14 w-full sm:flex-1 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-secondary text-foreground text-sm font-black uppercase tracking-widest transition-all hover:bg-secondary/80 border border-border shadow-sm active:scale-95 group"
            >
              <Castle size={20} className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="truncate">Back to Safety</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
