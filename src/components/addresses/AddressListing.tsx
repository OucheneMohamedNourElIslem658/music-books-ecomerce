'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { MapIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

export const AddressListing: React.FC = () => {
  const { addresses } = useAddresses()
  const t = useTranslations('addresses')

  if (!addresses || addresses.length === 0) {
    return (
      <div className="bg-card/20 p-16 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-center gap-4">
        <div className="p-4 bg-secondary rounded-full">
          <MapIcon size={48} className="text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-bold uppercase tracking-widest">
          {t('noAddresses')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {addresses.map((address) => (
        <AddressItem key={address.id} address={address} />
      ))}
    </div>
  )
}
