import type { Metadata } from 'next'

import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { redirect } from '@/i18n/navigation'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

interface AddressesPageProps {
  params: Promise<{ locale: string }>
}

export default async function AddressesPage({ params }: AddressesPageProps) {
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
      <div className="flex flex-wrap items-center justify-between gap-6 px-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">Mystical Addresses</h1>
          <p className="text-muted-foreground text-lg font-medium">
            Manage your teleportation and delivery waypoints across the known realms.
          </p>
        </div>

        <CreateAddressModal
          buttonText="Add a new address"
          className="px-6 lg:px-8 py-2 lg:py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all border-none h-auto"
        />
      </div>

      <div className="flex flex-col gap-8">
        <AddressListing />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Manage your addresses.',
  openGraph: mergeOpenGraph({ title: 'Addresses', url: '/account/addresses' }),
  title: 'Addresses',
}