'use client'

import React from 'react'
import type { Address } from '@/payload-types'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { MapPin, User, Star, Trash2, Map as MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { toast } from 'sonner'

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
  const { deleteAddress } = useAddresses()

  if (!address) {
    return null
  }

  const handleDelete = async () => {
    if (address.id) {
      try {
        await deleteAddress(address.id)
        toast.success('Coordinate struck from the records.')
      } catch (err) {
        toast.error('Failed to remove coordinate.')
      }
    }
  }

  return (
    <div className="bg-card/30 rounded-2xl border border-border/50 overflow-hidden group hover:border-primary/30 transition-all flex flex-col md:flex-row shadow-sm">
      {/* Decorative Image/Map Placeholder */}
      <div className="w-full md:w-64 h-48 md:h-auto bg-secondary/50 relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-border/50">
        <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <MapIcon size={120} className="text-primary" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r" />
      </div>

      <div className="flex w-full grow flex-col justify-center gap-6 p-8 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] mb-2">Waypoint Sanctuary</p>
            <h3 className="text-2xl font-black tracking-tight text-foreground">
              {address.title || 'Nameless Outpost'}
            </h3>
          </div>
          <div className="size-10 rounded-full bg-secondary flex items-center justify-center border border-border/50 shadow-sm transition-colors group-hover:border-accent-gold/30">
            <Star className="text-accent-gold" size={18} />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-l-2 border-accent-gold/20 pl-6 py-1">
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin size={16} className="text-primary" />
            <p className="text-sm font-medium">
              {address.addressLine1}
              {address.addressLine2 && <>, {address.addressLine2}</>}
              <br />
              {address.city}, {address.state} {address.postalCode}
              <br />
              {address.country}
            </p>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground/80 italic">
            <User size={14} />
            <p className="text-xs font-medium">
              Recipient: {address.firstName} {address.lastName}
            </p>
          </div>
        </div>

        {!hideActions && address.id && (
          <div className="flex items-center gap-4 mt-2">
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
                  className="px-8 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all border-none h-auto"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDelete}
                  className="size-10 rounded-full bg-secondary/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-border/50"
                >
                  <Trash2 size={18} />
                </Button>
                {afterActions}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
