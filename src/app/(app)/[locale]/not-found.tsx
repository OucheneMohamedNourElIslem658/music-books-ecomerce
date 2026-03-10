import { Link } from '@/i18n/navigation'
import { BookOpen, Castle, HelpCircle, Map, Search } from 'lucide-react'
import Image from 'next/image'

export default function NotFound() {
  return (
    <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden min-h-screen bg-background text-foreground">
      {/* Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full flex flex-col items-center text-center gap-8 relative z-10">

        {/* Image */}
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/40 rounded-3xl z-10" />
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBslfNsCwFUuF354Jry31ZFNYW4zz8OykR1OBbLoQcoY29cgASadWD4CgGcjLvMmmheluLli1H4HfeoCIlY8CDJql_QK13p1GaUKGQBPkb9tbrZKKSQW5FobEUwSp9KGH2VIzEQmwFCa5KJKyiyr0U1vPBX8VCdmbw0xm3Ow5HYVAtaGQ5EFBOjI9ywPZR-69CZjW0i8h0BcNGtvvj3XgqrSP5xU2DwY2Ey8Y1FbObaeLYa_Ii--mkjazQx09EBUi81v1BVUmz2-xLh"
            alt="Lost in the Ether"
            fill
            className="object-cover rounded-3xl shadow-2xl"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="w-20 h-24 border-2 border-dashed border-primary/40 rounded-xl flex items-center justify-center animate-pulse bg-background/20 backdrop-blur-sm">
              <BookOpen className="text-primary/40" size={36} />
            </div>
            <div className="mt-4 w-24 h-2.5 bg-primary/20 rounded-full blur-md animate-bounce" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            Lost in the <span className="text-primary italic">Ether</span>
          </h1>
          <p className="text-base text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
            It seems this chapter has vanished into the mist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/"
            className="royal-seal group flex items-center gap-3 px-8 py-4 rounded-full text-white font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest"
          >
            <Castle size={18} />
            <span>Return to the Kingdom</span>
          </Link>

          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Perhaps these scrolls will help?</p>
            <div className="flex gap-4">
              <Link href="/search" className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-border shadow-sm active:scale-90">
                <Search size={18} />
              </Link>
              <Link href="/shop" className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-border shadow-sm active:scale-90">
                <Map size={18} />
              </Link>
              <Link href="/contact" className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-border shadow-sm active:scale-90">
                <HelpCircle size={18} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}