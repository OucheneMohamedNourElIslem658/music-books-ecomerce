'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { AddressForm } from '@/components/forms/AddressForm'
import { Address } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'
import { PlusIcon, MapPinIcon } from 'lucide-react'

type Props = {
  addressID?: DefaultDocumentIDType
  initialData?: Partial<Omit<Address, 'country'>> & { country?: string }
  buttonText?: string
  modalTitle?: string
  callback?: (address: Partial<Address>) => void
  skipSubmission?: boolean
  disabled?: boolean
}

export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  initialData,
  buttonText = 'Add a new address',
  modalTitle = 'Add a new address',
  callback,
  skipSubmission,
  disabled,
}) => {
  const [open, setOpen] = useState(false)

  const closeModal = () => setOpen(false)

  const handleCallback = (data: Partial<Address>) => {
    closeModal()
    if (callback) callback(data)
  }

  const isEditing = Boolean(addressID)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        <Button
          variant={isEditing ? 'outline' : 'default'}
          className="rounded-full gap-2"
        >
          {!isEditing && <PlusIcon className="size-4" />}
          {buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <MapPinIcon className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground">
                {modalTitle}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                This address will be connected to your account.
              </DialogDescription>
            </div>
          </div>
          <Separator />
        </DialogHeader>

        <AddressForm
          addressID={addressID}
          initialData={initialData}
          callback={handleCallback}
          skipSubmission={skipSubmission}
        />
      </DialogContent>
    </Dialog>
  )
}