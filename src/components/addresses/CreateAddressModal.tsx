'use client'

import { AddressForm } from '@/components/forms/AddressForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Address } from '@/payload-types'
import { MapPin, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DefaultDocumentIDType } from 'payload'
import React, { useState } from 'react'

type Props = {
  addressID?: DefaultDocumentIDType
  initialData?: Partial<Omit<Address, 'country'>> & { country?: string }
  buttonText?: string
  modalTitle?: string
  callback?: (address: Partial<Address>) => void
  skipSubmission?: boolean
  disabled?: boolean
  className?: string
}

export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  initialData,
  buttonText = 'Add Address',
  modalTitle,
  callback,
  skipSubmission,
  disabled,
  className,
}) => {
  const [open, setOpen] = useState(false)
  const isEditing = Boolean(addressID)
  const title = modalTitle ?? (isEditing ? 'Edit Address' : 'New Address')

  const t = useTranslations("addresses")

  const handleCallback = (data: Partial<Address>) => {
    setOpen(false)
    if (callback) callback(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {className ? (
          <Button variant="ghost" className={className}>{buttonText}</Button>
        ) : isEditing ? (
          <Button variant="ghost" size="sm"
            className="text-xs text-muted-foreground hover:text-primary rounded-lg h-8 px-3">
            Edit
          </Button>
        ) : (
          <Button variant="outline" size="sm"
            className="rounded-full gap-2 border-dashed hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all">
            <Plus className="size-3.5" />
            <span className="text-xs font-bold">{buttonText}</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl border-border bg-background p-0 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <MapPin className="size-4" />
          </div>
          <div>
            <DialogTitle className="text-sm font-black uppercase tracking-widest text-foreground leading-none">
              {title}
            </DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium mt-0.5">
              {isEditing ? 'Update delivery address' : 'Save a delivery address'}
            </DialogDescription>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
          <AddressForm
            addressID={addressID}
            initialData={initialData}
            callback={handleCallback}
            skipSubmission={skipSubmission}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}