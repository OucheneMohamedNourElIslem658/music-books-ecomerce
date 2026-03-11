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
import { cn } from '@/utilities/cn'
import { useTranslations } from 'next-intl'

type ReviewFormValues = {
  rating: number
  comment: string
}

type Props = {
  reviewID?: DefaultDocumentIDType
  productID: DefaultDocumentIDType
  initialData?: Partial<ReviewFormValues>
  callback?: (data: Partial<Review>) => void
  thematic?: boolean
}

function StarPicker({ value, onChange, thematic }: { value: number; onChange: (v: number) => void; thematic?: boolean }) {
  const t = useTranslations('productReviews.form')
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
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
              className="focus:outline-none group relative"
              aria-label={t('ratingAriaLabel', { star })}
            >
              <span className={cn(
                "material-symbols-outlined transition-all text-5xl",
                filled ? "text-accent-gold scale-125" : "text-royal-blue/20",
                thematic && filled && "font-variation-fill"
              )}
              style={thematic && filled ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                grade
              </span>
              {thematic && filled && (
                <div className="absolute inset-0 bg-accent-gold/20 blur-xl rounded-full scale-150 -z-10" />
              )}
            </button>
          )
        })}
      </div>
      <p className="text-xs uppercase tracking-widest font-bold opacity-60 text-royal-blue">
        {value > 0 ? t('starsSelected', { count: value }) : t('divineRating')}
      </p>
    </div>
  )
}

export const ReviewForm: React.FC<Props> = ({ reviewID, productID, initialData, callback, thematic }) => {
  const t = useTranslations('productReviews.form')
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <FormField
          control={form.control}
          name="rating"
          rules={{ required: t('ratingRequired'), min: { value: 1, message: t('ratingRequired') } }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormControl>
                <StarPicker value={field.value} onChange={field.onChange} thematic={thematic} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          rules={{ required: t('commentRequired') }}
          render={({ field }) => (
            <FormItem className="relative group">
              <FormLabel className={cn(
                "text-xs uppercase tracking-[0.2em] font-bold opacity-70 mb-2 block",
                thematic ? "text-royal-blue" : "text-foreground"
              )}>
                {t('commentLabel')}
              </FormLabel>
              {thematic && (
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-gold/0 via-accent-gold/10 to-accent-gold/0 opacity-0 group-focus-within:opacity-100 transition-opacity" />
              )}
              <FormControl>
                <div className="relative">
                  <Textarea
                    rows={6}
                    placeholder={t('commentPlaceholder')}
                    className={cn(
                      "w-full bg-transparent border-x-0 border-t-0 border-b-2 focus:ring-0 text-xl font-medium placeholder:italic transition-all py-4 px-2",
                      thematic 
                        ? "border-royal-blue/20 text-royal-blue focus:border-accent-gold placeholder:text-royal-blue/30 resize-none"
                        : "border-border text-foreground focus:border-primary"
                    )}
                    {...field}
                  />
                  {thematic && (
                    <>
                      {/* Decorative Ink Wash Corners */}
                      <div className="absolute -bottom-6 -left-6 w-20 h-20 opacity-10 pointer-events-none">
                        <img className="grayscale brightness-0" alt="Ink splash" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4AypY2PwmCVXwOuvgKmyZ0zVUukLI4kQdeHYsMEvQ0K8qIosT9_Bd4W1lXnGSwB1NMGQ5AT2QkM3zmLBDXHa4l2nZFLqMsSbNvGf720RLdhmXuhED3pq6HYzrjIzqBSksRRvU8qjblVefEBRCRvvGU-0bfMmwDSJxXljVetWzH1oly6iTgWJh5UVJPgA884GTSw7FQEthum-oNSt5Ytpxz_TgX4yKmOhP2dS7cU4KyIe2nA-bLEXgPft3nSS6EXVMqMVc2J0IuYTB"/>
                      </div>
                      <div className="absolute -top-6 -right-6 w-20 h-20 opacity-10 pointer-events-none rotate-180">
                        <img className="grayscale brightness-0" alt="Ink splash" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4AypY2PwmCVXwOuvgKmyZ0zVUukLI4kQdeHYsMEvQ0K8qIosT9_Bd4W1lXnGSwB1NMGQ5AT2QkM3zmLBDXHa4l2nZFLqMsSbNvGf720RLdhmXuhED3pq6HYzrjIzqBSksRRvU8qjblVefEBRCRvvGU-0bfMmwDSJxXljVetWzH1oly6iTgWJh5UVJPgA884GTSw7FQEthum-oNSt5Ytpxz_TgX4yKmOhP2dS7cU4KyIe2nA-bLEXgPft3nSS6EXVMqMVc2J0IuYTB"/>
                      </div>
                    </>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center mt-8">
          {thematic ? (
            <div className="relative">
              <button 
                type="submit"
                disabled={form.formState.isSubmitting}
                className="royal-seal w-32 h-32 rounded-full flex flex-col items-center justify-center text-white group cursor-pointer border-4 border-[#8a6800] disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-4xl mb-1 group-hover:scale-110 transition-transform">history_edu</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  {form.formState.isSubmitting ? t('sealing') : t('sealScroll')}
                </span>
                <div className="absolute inset-0 rounded-full border border-white/20 m-2"></div>
              </button>
              <div className="absolute -top-2 -right-2 text-accent-gold animate-pulse">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
            </div>
          ) : (
            <Button type="submit" className="rounded-full px-8 py-6 h-auto text-lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? t('submitting')
                : reviewID
                  ? t('updateReview')
                  : t('submitReview')}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}