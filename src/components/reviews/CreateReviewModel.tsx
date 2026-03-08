'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Review } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'
import React, { useState } from 'react'
import { ReviewForm } from '../forms/ReviewsForm'

type Props = {
  reviewID?: DefaultDocumentIDType
  productID: DefaultDocumentIDType
  initialData?: { rating?: number; comment?: string }
  buttonText?: string
  modalTitle?: string
  callback?: (review: Partial<Review>) => void
  disabled?: boolean
}

export const CreateReviewModal: React.FC<Props> = ({
  reviewID,
  productID,
  initialData,
  buttonText = 'Write a Testimony',
  modalTitle = "The Reader's Testimony",
  callback,
  disabled,
}) => {
  const [open, setOpen] = useState(false)
  const isEditing = Boolean(reviewID)

  const handleCallback = (data: Partial<Review>) => {
    setOpen(false)
    if (callback) callback(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        <Button
          variant="default"
          className="flex items-center gap-2 px-8 py-6 bg-accent-gold text-background rounded-full font-bold shadow-xl hover:bg-accent-gold/90 transition-all border-2 border-accent-gold/20 text-lg"
        >
          <span className="material-symbols-outlined">
            {isEditing ? 'edit_note' : 'history_edu'}
          </span>
          {buttonText}
        </Button>
      </DialogTrigger>

      {/* Full-screen on mobile, centered max-w on desktop */}
      <DialogContent className="
        w-full max-w-none h-dvh rounded-none p-0 border-none bg-card overflow-y-auto
        sm:h-auto sm:max-w-2xl sm:rounded-2xl sm:max-h-[90dvh]
        flex flex-col
      ">
        <DialogTitle className="hidden" />
        {/* Parchment inner wrapper — scrolls as a unit */}
        <div className="flex flex-col flex-1 p-6 sm:p-10">

          <header className="text-center mb-8 shrink-0">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter italic font-display text-foreground mb-3">
              {modalTitle}
            </h2>
            <div className="w-16 h-0.5 bg-accent-gold mx-auto mb-4" />
            <p className="text-base font-medium italic text-muted-foreground">
              &quot;Cast your light upon this tale, traveler...&quot;
            </p>
          </header>

          <div className="flex-1 w-full">
            <ReviewForm
              reviewID={reviewID}
              productID={productID}
              initialData={initialData}
              callback={handleCallback}
              thematic
            />
          </div>

          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-black shrink-0">
            This testimony will be archived in the King&apos;s Vault
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}