'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Review } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'
import { StarIcon } from 'lucide-react'

type ReviewFormValues = {
  rating: number
  comment: string
}

type Props = {
  reviewID?: DefaultDocumentIDType
  productID: DefaultDocumentIDType
  initialData?: Partial<ReviewFormValues>
  callback?: (data: Partial<Review>) => void
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1
        const filled = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
            aria-label={`Rate ${star} out of 5`}
          >
            <StarIcon
              className={`h-7 w-7 transition-colors ${filled ? 'text-amber-400' : 'text-muted-foreground/30'}`}
              fill="currentColor"
            />
          </button>
        )
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">{value} / 5</span>
      )}
    </div>
  )
}

export const ReviewForm: React.FC<Props> = ({ reviewID, productID, initialData, callback }) => {
  const form = useForm<ReviewFormValues>({
    defaultValues: {
      rating: initialData?.rating ?? 0,
      comment: initialData?.comment ?? '',
    },
  })

  const onSubmit = useCallback(
    async (data: ReviewFormValues) => {
      const method = reviewID ? 'PATCH' : 'POST'
      const url = reviewID ? `/api/reviews/${reviewID}` : '/api/reviews'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...data, product: productID }),
      })

      const json = await res.json()
      if (callback) callback(json.doc ?? json)
    },
    [reviewID, productID, callback],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="rating"
          rules={{ required: 'Please select a rating.', min: { value: 1, message: 'Please select a rating.' } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating*</FormLabel>
              <FormControl>
                <StarPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          rules={{ required: 'Please write a review.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review*</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Share your experience with this product..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button type="submit" className="rounded-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Submitting...'
              : reviewID
                ? 'Update Review'
                : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Form>
  )
}