'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Address } from '@/payload-types'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { Package } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = {
  selectedAddress?: Address
  setAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
  heading?: string
  description?: string
  setSubmit?: React.Dispatch<React.SetStateAction<() => void | Promise<void>>>
}

export const CheckoutAddresses: React.FC<Props> = ({
  setAddress,
  heading,
  description,
}) => {
  const t = useTranslations('checkoutAddresses')
  const { addresses } = useAddresses()

  const displayHeading = heading ?? t('defaultHeading')
  const displayDescription = description ?? t('defaultDescription')

  if (!addresses || addresses.length === 0) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-secondary/10">
        <p className="text-muted-foreground font-medium text-center">
          {t('noAddresses')}
        </p>

        <CreateAddressModal />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {displayHeading && (
        <div>
          <h3 className="text-xl font-bold mb-2">{displayHeading}</h3>
          <p className="text-muted-foreground text-sm">{displayDescription}</p>
        </div>
      )}
      <AddressesModal setAddress={setAddress} />
    </div>
  )
}

const AddressesModal: React.FC<Props> = ({ setAddress }) => {
  const t = useTranslations('checkoutAddresses')
  const [open, setOpen] = useState(false)
  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return <p className="text-muted-foreground">{t('noAddressesFound')}</p>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="rounded-full px-8 py-6 font-bold border-primary/20 hover:bg-primary/5 transition-all"
        >
          {t('selectAnAddress')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl border-border bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Package className="text-primary" size={24} />
            {t('selectAnAddress')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-10 mt-6">
          <ul className="flex flex-col gap-6">
            {addresses.map((address) => (
              <li
                key={address.id}
                className="p-6 rounded-xl border border-border bg-secondary/20 hover:border-primary/50 transition-colors"
              >
                <AddressItem
                  address={address}
                  beforeActions={
                    <Button
                      className="rounded-full px-6 font-bold"
                      onClick={(e) => {
                        e.preventDefault()
                        setAddress(address)
                        closeModal()
                      }}
                    >
                      {t('select')}
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-border">
            <CreateAddressModal />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
