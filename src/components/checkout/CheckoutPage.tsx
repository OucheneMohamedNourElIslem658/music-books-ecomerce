/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useTheme } from '@/providers/Theme'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { FormItem } from '@/components/forms/FormItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Checkbox } from '@/components/ui/checkbox'
import { cssVariables } from '@/cssVariables'
import { Address } from '@/payload-types'
import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { PaymentAdapterClient } from '@payloadcms/plugin-ecommerce/types'
import { toast } from 'sonner'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

// Step indicator
const STEPS = ['Contact', 'Address', 'Payment'] as const
type Step = typeof STEPS[number]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < current
                  ? 'bg-foreground text-background'
                  : i === current
                  ? 'bg-foreground text-background ring-4 ring-foreground/20'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                i <= current ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-px flex-1 mx-3 transition-all duration-500 ${
                i < current ? 'bg-foreground' : 'bg-border'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// Section wrapper with subtle animation
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card/50 p-6 ${className}`}>
      {children}
    </div>
  )
}

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { cart } = useCart()
  const [error, setError] = useState<null | string>(null)
  const { theme } = useTheme()

  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const { initiatePayment, paymentMethods } = usePayments()
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  // Use the hook's paymentMethods as source of truth — never a hardcoded list
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentAdapterClient | null>(null)

  // Guard against double-initiate: track the in-flight request
  const initiatingRef = useRef(false)

  // Set default payment method once paymentMethods loads
  useEffect(() => {
    if (paymentMethods?.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0])
    }
  }, [paymentMethods, selectedPaymentMethod])

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  const contactComplete = Boolean(user || (email && !emailEditable))
  const addressComplete = Boolean(billingAddress && (billingAddressSameAsShipping || shippingAddress))
  const canGoToPayment = contactComplete && addressComplete

  const currentStep = !contactComplete ? 0 : !addressComplete ? 1 : 2

  // Prefill default address
  useEffect(() => {
    if (!billingAddress && addresses && addresses.length > 0) {
      setBillingAddress(addresses[0])
    }
  }, [addresses])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
    }
  }, [])

  const deletePendingTransactions = useCallback(async () => {
    if (!cart?.id) return
    try {
      // Find all pending transactions for this cart and delete them.
      // Stripe reuses the same transactions_items.id derived from cart item IDs,
      // so calling initiatePayment twice hits a UNIQUE constraint. Deleting
      // pending transactions first keeps the DB clean for a fresh insert.
      const res = await fetch(
        `/api/transactions?where[cart][equals]=${cart.id}&where[status][equals]=pending&limit=20`,
      )
      if (!res.ok) return
      const { docs } = await res.json()
      await Promise.all(
        (docs ?? []).map((tx: { id: string | number }) =>
          fetch(`/api/transactions/${tx.id}`, { method: 'DELETE' }),
        ),
      )
    } catch {
      // Non-fatal — worst case the initiate call will fail with a visible error
    }
  }, [cart?.id])

  const initiatePaymentIntent = useCallback(
    async (paymentMethodName: string) => {
      if (initiatingRef.current || paymentData) return
      initiatingRef.current = true

      try {
        setProcessingPayment(true)
        setError(null)

        // Clean up stale pending transactions before re-initiating so Stripe
        // doesn't hit a UNIQUE constraint on transactions_items.id
        await deletePendingTransactions()

        const result = (await initiatePayment(paymentMethodName, {
          additionalData: {
            ...(email ? { customerEmail: email } : {}),
            billingAddress,
            shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          },
        })) as Record<string, unknown>

        if (result) {
          setPaymentData(result)
        }
      } catch (err) {
        const errorData = err instanceof Error ? (() => {
          try { return JSON.parse(err.message) } catch { return {} }
        })() : {}

        let errorMessage = 'An error occurred while initiating payment.'
        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = 'One or more items in your cart are out of stock.'
        }

        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setProcessingPayment(false)
        initiatingRef.current = false
      }
    },
    [billingAddress, billingAddressSameAsShipping, shippingAddress, email, paymentData, initiatePayment, deletePendingTransactions],
  )

  const handlePaymentMethodSelect = (method: PaymentAdapterClient) => {
    if (isProcessingPayment) return
    setSelectedPaymentMethod(method)
    // Clear stale payment data so user can re-initiate cleanly
    setPaymentData(null)
    setError(null)
    initiatingRef.current = false
  }

  const handleGoToPayment = () => {
    if (!selectedPaymentMethod || isProcessingPayment || paymentData) return
    void initiatePaymentIntent(selectedPaymentMethod.name)
  }

  const handleCancelPayment = () => {
    setPaymentData(null)
    setError(null)
    initiatingRef.current = false
  }

  if (!stripe) return null

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-24 w-full flex flex-col items-center justify-center gap-6">
        <LoadingSpinner />
        <p className="text-muted-foreground text-sm tracking-wide">Processing your payment…</p>
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="py-24 w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-medium">Your cart is empty</p>
        <Link href="/search" className="text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row my-8 gap-8 lg:gap-12 grow items-start">

      {/* ── Left column ─────────────────────────────────────────────────────── */}
      <div className="basis-full lg:basis-2/3 flex flex-col gap-6">

        <StepIndicator current={currentStep} />

        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <Section>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-bold">1</span>
            Contact
          </h2>

          {user ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">Signed in</p>
              </div>
              <Link href="/logout" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
                Log out
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/create-account">Create account</Link>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or continue as guest</span>
                </div>
              </div>

              <FormItem>
                <Label htmlFor="email">Email address</Label>
                <div className="flex gap-2">
                  <Input
                    disabled={!emailEditable}
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    className="flex-1"
                  />
                  {emailEditable ? (
                    <Button
                      disabled={!email}
                      onClick={(e) => { e.preventDefault(); setEmailEditable(false) }}
                      variant="default"
                      size="sm"
                      className="shrink-0"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setEmailEditable(true)}
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </FormItem>
            </div>
          )}
        </Section>

        {/* ── Address ─────────────────────────────────────────────────────── */}
        <Section>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${contactComplete ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>2</span>
            Address
          </h2>

          {/* Billing */}
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Billing address</p>
            {billingAddress ? (
              <div className="flex items-start justify-between gap-4">
                <AddressItem address={billingAddress} />
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={Boolean(paymentData)}
                  onClick={(e) => { e.preventDefault(); setBillingAddress(undefined) }}
                  className="shrink-0 text-muted-foreground"
                >
                  Change
                </Button>
              </div>
            ) : user ? (
              <CheckoutAddresses heading="" setAddress={setBillingAddress} />
            ) : (
              <CreateAddressModal
                disabled={!email || Boolean(emailEditable)}
                callback={(address) => setBillingAddress(address)}
                skipSubmission={true}
              />
            )}
          </div>

          {/* Shipping same as billing toggle */}
          <div className="flex gap-3 items-center py-3 border-t border-border">
            <Checkbox
              id="shippingTheSameAsBilling"
              checked={billingAddressSameAsShipping}
              disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
              onCheckedChange={(state) => setBillingAddressSameAsShipping(state as boolean)}
            />
            <Label htmlFor="shippingTheSameAsBilling" className="cursor-pointer text-sm">
              Shipping address is the same as billing
            </Label>
          </div>

          {/* Shipping (if different) */}
          {!billingAddressSameAsShipping && (
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Shipping address</p>
              {shippingAddress ? (
                <div className="flex items-start justify-between gap-4">
                  <AddressItem address={shippingAddress} />
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={Boolean(paymentData)}
                    onClick={(e) => { e.preventDefault(); setShippingAddress(undefined) }}
                    className="shrink-0 text-muted-foreground"
                  >
                    Change
                  </Button>
                </div>
              ) : user ? (
                <CheckoutAddresses heading="" description="Select a shipping address." setAddress={setShippingAddress} />
              ) : (
                <CreateAddressModal
                  callback={(address) => setShippingAddress(address)}
                  disabled={!email || Boolean(emailEditable)}
                  skipSubmission={true}
                />
              )}
            </div>
          )}
        </Section>

        {/* ── Payment ─────────────────────────────────────────────────────── */}
        <Section>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${canGoToPayment ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>3</span>
            Payment
          </h2>

          {!paymentData && (
            <>
              {/* Method selector */}
              {paymentMethods.length > 1 && (
                <div className="flex flex-col gap-2 mb-5">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.name}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedPaymentMethod?.name === method.name
                          ? 'border-foreground bg-foreground/5'
                          : 'border-border hover:border-foreground/40'
                      } ${!canGoToPayment ? 'opacity-40 pointer-events-none' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.name}
                        checked={selectedPaymentMethod?.name === method.name}
                        onChange={() => handlePaymentMethodSelect(method)}
                        disabled={!canGoToPayment}
                        className="accent-foreground"
                      />
                      <span className="font-medium text-sm">{method.label ?? method.name}</span>
                    </label>
                  ))}
                </div>
              )}

              <Button
                className="w-full"
                disabled={!canGoToPayment || isProcessingPayment || !selectedPaymentMethod}
                onClick={handleGoToPayment}
                size="lg"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner className="h-4 w-4" />
                    Processing…
                  </span>
                ) : (
                  `Continue with ${selectedPaymentMethod?.label ?? selectedPaymentMethod?.name ?? 'Payment'}`
                )}
              </Button>
            </>
          )}

          {/* Error */}
          {error && !paymentData?.['clientSecret'] && (
            <div className="mt-4 flex flex-col gap-3">
              <Message error={error} />
              <Button
                variant="outline"
                size="sm"
                className="self-start"
                onClick={(e) => {
                  e.preventDefault()
                  setError(null)
                  initiatingRef.current = false
                  router.refresh()
                }}
              >
                Try again
              </Button>
            </div>
          )}

          {/* ── Stripe Elements ────────────────────────────────────────────── */}
          <Suspense fallback={<React.Fragment />}>
            {/* @ts-expect-error */}
            {paymentData?.['clientSecret'] && selectedPaymentMethod?.name === 'stripe' && (
              <div>
                {error && <p className="text-sm text-destructive mb-4">{error}</p>}
                <Elements
                  options={{
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        borderRadius: '8px',
                        colorPrimary: '#858585',
                        gridColumnSpacing: '20px',
                        gridRowSpacing: '20px',
                        colorBackground: theme === 'dark' ? '#0a0a0a' : cssVariables.colors.base0,
                        colorDanger: cssVariables.colors.error500,
                        colorDangerText: cssVariables.colors.error500,
                        colorIcon: theme === 'dark' ? cssVariables.colors.base0 : cssVariables.colors.base1000,
                        colorText: theme === 'dark' ? '#858585' : cssVariables.colors.base1000,
                        colorTextPlaceholder: '#858585',
                        fontFamily: 'Geist, sans-serif',
                        fontSizeBase: '16px',
                        fontWeightBold: '600',
                        fontWeightNormal: '500',
                        spacingUnit: '4px',
                      },
                    },
                    clientSecret: paymentData['clientSecret'] as string,
                  }}
                  stripe={stripe}
                >
                  <CheckoutForm
                    customerEmail={email}
                    billingAddress={billingAddress}
                    setProcessingPayment={setProcessingPayment}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-muted-foreground"
                    onClick={handleCancelPayment}
                  >
                    ← Choose a different payment method
                  </Button>
                </Elements>
              </div>
            )}

            {/* ── PayPal redirect ─────────────────────────────────────────── */}
            {paymentData && selectedPaymentMethod?.name === 'paypal' && !paymentData['clientSecret'] && (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  Your order is ready. You'll be redirected to PayPal to complete payment securely.
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    if (paymentData.approvalUrl) {
                      window.location.href = paymentData.approvalUrl as string
                    }
                  }}
                >
                  Continue to PayPal →
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={handleCancelPayment}
                >
                  ← Choose a different payment method
                </Button>
              </div>
            )}
          </Suspense>
        </Section>
      </div>

      {/* ── Right column: Order summary ──────────────────────────────────────── */}
      {!cartIsEmpty && (
        <div className="basis-full lg:basis-1/3 lg:sticky lg:top-8">
          <div className="rounded-xl border border-border bg-card/50 p-6 flex flex-col gap-5">
            <h2 className="font-semibold text-lg">Order summary</h2>

            <div className="flex flex-col gap-4">
              {cart?.items?.map((item, index) => {
                if (typeof item.product !== 'object' || !item.product) return null

                const { product, quantity, variant } = item
                if (!quantity) return null

                let image = product.gallery?.[0]?.image || product.meta?.image
                let price = product?.priceInUSD

                const isVariant = Boolean(variant) && typeof variant === 'object'
                if (isVariant) {
                  price = variant?.priceInUSD
                  const imageVariant = product.gallery?.find((g: any) => {
                    if (!g.variantOption) return false
                    const optId = typeof g.variantOption === 'object' ? g.variantOption.id : g.variantOption
                    return variant?.options?.some((o: any) =>
                      typeof o === 'object' ? o.id === optId : o === optId
                    )
                  })
                  if (imageVariant && typeof imageVariant.image !== 'string') {
                    image = imageVariant.image
                  }
                }

                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg border border-border overflow-hidden shrink-0 bg-muted/30">
                      {image && typeof image !== 'string' && (
                        <Media fill imgClassName="object-cover" resource={image} />
                      )}
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-bold">
                        {quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.title}</p>
                      {isVariant && typeof variant === 'object' && (
                        <p className="text-xs text-muted-foreground truncate">
                          {variant.options?.map((o: any) => typeof o === 'object' ? o.label : null).filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                    {typeof price === 'number' && (
                      <Price amount={price * quantity} className="text-sm font-medium shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <Price amount={cart.subtotal || 0} />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                <span>Total</span>
                <Price amount={cart.subtotal || 0} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}