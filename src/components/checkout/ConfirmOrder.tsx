'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Sparkles, Wand2, Bird, History, ShoppingBag } from 'lucide-react'

export const ConfirmOrder: React.FC = () => {
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
  }, [cart, searchParams])

  return (
    <div className="max-w-3xl mx-auto py-24 px-6 w-full flex flex-col items-center justify-center text-center gap-8">
      <div className="relative">
        <div className="p-8 bg-primary/10 rounded-full animate-pulse">
          <Sparkles size={64} className="text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 p-3 bg-card rounded-full shadow-lg border border-border">
          <Wand2 size={24} className="text-primary" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Casting Order Wards</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Our mystical owls are preparing your artifacts and finalizing the quest log. Please wait while the magic completes.
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-progress-indeterminate glow-primary" />
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1"><Bird size={12} /> Courier Assigned</span>
          <span className="flex items-center gap-1"><History size={12} /> Log Recorded</span>
          <span className="flex items-center gap-1"><ShoppingBag size={12} /> Satchel Sealed</span>
        </div>
      </div>

      <LoadingSpinner className="w-12 h-6 text-primary" />
    </div>
  )
}
