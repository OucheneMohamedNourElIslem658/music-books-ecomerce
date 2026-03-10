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
import { AddressForm } from '@/components/forms/AddressForm'
import { Address } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'
import { Plus, BookOpen, X } from 'lucide-react'
import { cn } from '@/utilities/cn'

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
  buttonText = 'Add a new address',
  modalTitle = 'Chart a New Course',
  callback,
  skipSubmission,
  disabled,
  className,
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
        {className ? (
          <Button variant="ghost" className={className}>
            {buttonText}
          </Button>
        ) : (
          <button className="flex items-center gap-4 px-8 py-4 rounded-full bg-secondary/80 border border-primary/20 text-foreground hover:bg-secondary transition-all group shadow-sm active:scale-95">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_15px_rgba(43,108,238,0.2)]">
              <Plus size={20} />
            </div>
            <span className="font-black text-xs uppercase tracking-widest">{buttonText}</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl bg-background border-border/50 p-0 overflow-hidden rounded-3xl shadow-2xl">
        {/* Themed Header */}
        <div className="border-b border-border/50 px-10 py-8 bg-secondary/20 relative">
          <div className="flex items-center gap-5 relative z-10">
            <div className="size-14 flex items-center justify-center bg-primary/10 rounded-2xl text-accent-gold shadow-sm">
              <BookOpen size={28} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground uppercase italic leading-none mb-2">
                {modalTitle}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm font-medium">
                Where shall the magical winds carry your artifacts?
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="px-10 py-10 max-h-[80vh] overflow-y-auto no-scrollbar">
          <AddressForm
            addressID={addressID}
            initialData={initialData}
            callback={handleCallback}
            skipSubmission={skipSubmission}
          />
        </div>

        {/* Footer Decoration */}
        <div className="h-2 bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
      </DialogContent>
    </Dialog>
  )
}
