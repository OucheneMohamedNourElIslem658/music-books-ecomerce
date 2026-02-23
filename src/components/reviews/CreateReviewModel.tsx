'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ReviewForm } from '../forms/ReviewsForm'
import { Review } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'
import { PlusIcon, StarIcon } from 'lucide-react'

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
  buttonText = 'Write a Review',
  modalTitle = 'Write a Review',
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
        <Button variant={isEditing ? 'outline' : 'default'} className="rounded-full gap-2 cursor-pointer">
          {!isEditing && <PlusIcon className="size-4" />}
          {buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <StarIcon className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground">
                {modalTitle}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Your review will be visible after approval.
              </DialogDescription>
            </div>
          </div>
          <Separator />
        </DialogHeader>

        <ReviewForm
          reviewID={reviewID}
          productID={productID}
          initialData={initialData}
          callback={handleCallback}
        />
      </DialogContent>
    </Dialog>
  )
}