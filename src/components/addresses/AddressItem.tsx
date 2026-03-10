'use client'

import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import type { Address } from '@/payload-types'
import { MapPin, User } from 'lucide-react'
import React from 'react'

type Props = {
  address: Partial<Omit<Address, 'country'>> & { country?: string }
  actions?: React.ReactNode
  beforeActions?: React.ReactNode
  afterActions?: React.ReactNode
  hideActions?: boolean
}

export const AddressItem: React.FC<Props> = ({
  address,
  actions,
  hideActions = false,
  beforeActions,
  afterActions,
}) => {
  if (!address) {
    return null
  }

  return (
    <div className="bg-card/30 rounded-2xl border border-border/50 overflow-hidden group hover:border-primary/30 transition-all flex flex-col shadow-sm">
      <div className="flex w-full grow flex-col justify-center gap-4 lg:gap-6 p-6 lg:p-8 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-accent-gold text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] mb-2">Waypoint Sanctuary</p>
            <h3 className="text-xl lg:text-2xl font-black tracking-tight text-foreground">
              {address.title || 'Nameless Outpost'}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:gap-3 border-l-2 border-accent-gold/20 pl-4 lg:pl-6 py-1">
          <div className="flex items-start gap-3 text-muted-foreground">
            <MapPin size={14} className="text-primary lg:size-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs lg:text-sm font-medium leading-relaxed">
              {address.addressLine1}
              {address.addressLine2 && <>, {address.addressLine2}</>}
              {address.city}, {address.state} {address.postalCode}
              {address.country}
            </p>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground/80 italic">
            <User size={12} className="lg:size-[14px] flex-shrink-0" />
            <p className="text-xs font-medium">
              Recipient: {address.firstName} {address.lastName}
            </p>
          </div>
        </div>

        {!hideActions && address.id && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4 mt-2">
            {actions ? (
              actions
            ) : (
              <>
                {beforeActions}
                <CreateAddressModal
                  addressID={address.id}
                  initialData={address}
                  buttonText="Edit Coordinates"
                  modalTitle="Revise the Map"
                  className="w-full sm:w-auto px-6 lg:px-8 py-2 lg:py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all border-none h-auto"
                />
                {afterActions}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
