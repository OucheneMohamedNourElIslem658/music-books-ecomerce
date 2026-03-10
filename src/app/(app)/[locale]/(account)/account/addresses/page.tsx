import type { Metadata } from 'next'

import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { redirect } from '@/i18n/navigation'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { Compass, Plus, Sparkles, Map as MapIcon, Shield } from 'lucide-react'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

interface AddressesPageProps {
  params: Promise<{ locale: string }>
}

export default async function AddressesPage(
  { params }: AddressesPageProps
) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { locale } = await params

  if (!user) {
    redirect({
      href: `/login?warning=${encodeURIComponent('Please login to access your account settings.')}`,
      locale,
    })
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">Mystical Addresses</h1>
          <p className="text-muted-foreground text-lg font-medium">Manage your teleportation and delivery waypoints across the known realms.</p>
        </div>
        
        <CreateAddressModal 
          buttonText="Add a new address"
          className="group"
        />
      </div>

      {/* Main Content Area - Sidebar is handled in layout.tsx, so we just focus on the list here */}
      <div className="flex flex-col gap-8">
        <AddressListing />
      </div>

      {/* Quick Teleport Selection - Decorative Section */}
      <div className="mt-8 flex flex-col gap-6 px-2">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <Sparkles className="text-primary" size={24} />
          Recent Teleports
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Blue Lagoon', icon: 'waves' },
            { name: 'Stone Peaks', icon: 'landscape' },
            { name: 'Sun Citadel', icon: 'brightness_high' },
            { name: 'Ice Vault', icon: 'ac_unit' }
          ].map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group">
              <div className="size-14 rounded-full bg-secondary flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform shadow-sm">
                <Compass size={28} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <footer className="mt-12 border-t border-border pt-10 pb-6 flex flex-wrap justify-between items-center gap-8">
        <div className="flex items-center gap-12">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Total Realms</span>
            <span className="text-2xl font-black">12 Discovery</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Active Waypoints</span>
            <span className="text-2xl font-black">42 Portal Keys</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm italic font-medium">
          &quot;The star is your compass, the heart is your map.&quot;
        </p>
      </footer>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Manage your addresses.',
  openGraph: mergeOpenGraph({
    title: 'Addresses',
    url: '/account/addresses',
  }),
  title: 'Addresses',
}
