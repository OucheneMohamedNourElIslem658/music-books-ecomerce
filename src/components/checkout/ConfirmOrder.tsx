'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const ConfirmOrder: React.FC = () => {
  const t = useTranslations('confirmOrder')
  const { confirmOrder } = usePayments()
  const { cart } = useCart()

  const searchParams = useSearchParams()
  const router = useRouter()
  // Ensure we only confirm the order once, even if the component re-renders
  const isConfirming = useRef(false)

  useEffect(() => {
    if (!cart || !cart.items || cart.items?.length === 0) {
      return
    }

    const paymentIntentID = searchParams.get('payment_intent')
    const email = searchParams.get('email')

    if (paymentIntentID) {
      if (!isConfirming.current) {
        isConfirming.current = true

        confirmOrder('stripe', {
          additionalData: {
            paymentIntentID,
          },
        }).then((result) => {
          if (result && typeof result === 'object' && 'orderID' in result && result.orderID) {
            router.push(`/shop/order/${result.orderID}?email=${email}`)
          }
        })
      }
    } else {
      // If no payment intent ID is found, redirect to the home
      router.push('/')
    }
  }, [cart, searchParams, confirmOrder, router])

  return (
    <div className="text-center w-full flex flex-col items-center justify-center gap-8 py-24 bg-card/30 rounded-3xl border border-border mt-12">
      <div className="p-4 bg-primary/10 rounded-full animate-pulse">
        <Sparkles size={48} className="text-primary" />
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-black uppercase tracking-widest">{t('title')}</h1>
        <p className="text-muted-foreground font-medium">{t('note')}</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner className="w-16 h-8" />
        <p className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
          {t('invokingWards')}
        </p>
      </div>
    </div>
  )
}
