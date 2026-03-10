/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { useTheme } from '@/providers/Theme'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { FormItem } from '@/components/forms/FormItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Checkbox } from '@/components/ui/checkbox'
import { Address } from '@/payload-types'
import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { PaymentAdapterClient } from '@payloadcms/plugin-ecommerce/types'
import { ArrowRight, Bird, BookOpen, History, Lock, Package, Plus, ShoppingBag, Sparkles, Wand2 } from 'lucide-react'
import { toast } from 'sonner'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

// Step indicator
const STEPS = [
  { label: 'Packing', icon: Package },
  { label: 'Owl Delivery', icon: Wand2 },
  { label: 'The Finale', icon: Sparkles },
] as const

function StepIndicator({ current }: { current: number }) {
  const progress = ((current + 1) / STEPS.length) * 100
  const stepTitles = ['Packing the Satchel', 'Preparing for Owl Delivery', 'The Grand Finale']

  return (
    <div className="mb-12">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto mb-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold">Finalizing the Quest</h2>
            <p className="text-muted-foreground text-sm mt-1">Current Step: {stepTitles[current]}</p>
          </div>
          <p className="text-primary font-bold text-lg">{Math.round(progress)}%</p>
        </div>
        <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000 glow-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-center border-b border-border">
        <div className="flex gap-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const isCurrent = i <= current

            return (
              <div
                key={step.label}
                className={`flex flex-col items-center gap-2 pb-4 border-b-2 transition-all duration-300 ${isCurrent ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
                  }`}
              >
                <Icon size={24} className={isCurrent && i === current ? 'animate-pulse' : ''} />
                <span className="text-xs font-bold uppercase tracking-widest">{step.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Section wrapper
function Section({ children, title, icon: Icon, className = '', stepNumber }: { children: React.ReactNode; title: string; icon?: any; className?: string; stepNumber?: number }) {
  return (
    <div className={`bg-card/50 p-8 rounded-2xl border border-border flex flex-col gap-6 ${className}`}>
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold flex items-center gap-3">
          {stepNumber && (
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">
              {stepNumber}
            </span>
          )}
          {Icon && <Icon size={24} className="text-primary" />}
          {title}
        </h3>
      </div>
      <div className="px-2">
        {children}
      </div>
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
  const [paymentData, setPaymentData] = useState<null | Record<string, any>>(null)
  const { initiatePayment, paymentMethods } = usePayments()
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentAdapterClient | null>(null)
  const initiatingRef = useRef(false)

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

  useEffect(() => {
    if (!billingAddress && addresses && addresses.length > 0) {
      setBillingAddress(addresses[0])
    }
  }, [addresses])

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
    } catch { }
  }, [cart?.id])

  const initiatePaymentIntent = useCallback(
    async (paymentMethodName: string) => {
      if (initiatingRef.current || paymentData) return
      initiatingRef.current = true

      try {
        setProcessingPayment(true)
        setError(null)
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
        <p className="text-muted-foreground text-sm tracking-wide animate-pulse">Processing your payment…</p>
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="py-24 w-full flex flex-col items-center justify-center gap-4 text-center">
        <div className="p-4 bg-secondary rounded-full">
          <ShoppingBag size={48} className="text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold">Your Satchel is Empty</p>
        <p className="text-muted-foreground max-w-xs">It seems you haven&apos;t added any enchanted artifacts to your satchel yet.</p>
        <Button asChild variant="outline" className="mt-4 rounded-full px-8">
          <Link href="/shop">Continue the Quest</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      <StepIndicator current={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* ── Left Column: Items & Forms ───────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-10">

          {/* Enchanted Items Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-bold">Your Enchanted Items</h3>
              <span className="text-muted-foreground text-sm">{cart.items?.length} Artifacts Found</span>
            </div>

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
                  <div key={index} className="bg-card/50 p-6 rounded-xl border border-border flex flex-wrap md:flex-nowrap items-center gap-6 group hover:border-primary/50 transition-colors">
                    <div className="relative size-24 shrink-0 rounded-lg overflow-hidden border border-border">
                      {image && typeof image !== 'string' && (
                        <Media fill imgClassName="object-cover" resource={image} />
                      )}
                      <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <h4 className="text-lg font-bold leading-tight">{product.title}</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        {isVariant ? variant.options?.map((o: any) => typeof o === 'object' ? o.label : null).filter(Boolean).join(', ') : 'Standard Edition'}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-primary text-sm font-medium">
                        <Wand2 size={16} />
                        Enchanted Artifact
                      </div>
                    </div>
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center gap-3 bg-secondary p-1.5 rounded-full">
                        <span className="text-sm font-bold px-4">Qty: {quantity}</span>
                      </div>
                      {typeof price === 'number' && (
                        <Price amount={price * quantity} className="text-xl font-bold" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <Button asChild variant="ghost" className="flex items-center justify-center gap-2 py-8 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 transition-all h-auto">
              <Link href="/shop" className="flex items-center gap-2">
                <Plus size={20} />
                <span className="font-bold">Add another Artifact to the Satchel</span>
              </Link>
            </Button>
          </div>

          {/* ── Contact Section ───────────────────────────────────────────── */}
          <Section title="Contact Info" stepNumber={1} icon={BookOpen}>
            {user ? (
              <div className="flex items-center justify-between p-6 bg-secondary/30 rounded-xl border border-border/50">
                <div>
                  <p className="font-bold text-lg">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Signed in as Adventurer</p>
                </div>
                <Link href="/logout" className="text-sm text-primary font-bold hover:underline">
                  Log out
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <Button asChild variant="outline" className="flex-1 rounded-full py-6 font-bold">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild variant="ghost" className="flex-1 rounded-full py-6 font-bold">
                    <Link href="/create-account">Create account</Link>
                  </Button>
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="bg-background px-4 text-muted-foreground uppercase tracking-widest font-black">or continue as guest</span>
                  </div>
                </div>

                <FormItem>
                  <Label htmlFor="email" className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email address</Label>
                  <div className="flex gap-3 mt-2">
                    <Input
                      disabled={!emailEditable}
                      id="email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="adventurer@tales.com"
                      required
                      type="email"
                      className="rounded-full px-6 py-6 bg-secondary/50 border-none focus-visible:ring-primary"
                    />
                    {emailEditable ? (
                      <Button
                        disabled={!email}
                        onClick={(e) => { e.preventDefault(); setEmailEditable(false) }}
                        className="rounded-full px-8 shrink-0 h-auto font-bold"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setEmailEditable(true)}
                        variant="ghost"
                        className="rounded-full shrink-0 text-muted-foreground font-bold"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </FormItem>
              </div>
            )}
          </Section>

          {/* ── Address Section ───────────────────────────────────────────── */}
          <Section title="Delivery Details" stepNumber={2} icon={Bird} className={!contactComplete ? 'opacity-50 pointer-events-none' : ''}>
            {/* Billing */}
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 ml-1">Billing Address</p>
              {billingAddress ? (
                <div className="flex items-start justify-between gap-4 p-5 bg-secondary/30 rounded-xl border border-border/50">
                  <AddressItem address={billingAddress} />
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={Boolean(paymentData)}
                    onClick={(e) => { e.preventDefault(); setBillingAddress(undefined) }}
                    className="text-primary font-bold"
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

            {/* Shipping Toggle */}
            <div className="flex gap-3 items-center py-6 border-t border-border">
              <Checkbox
                id="shippingTheSameAsBilling"
                checked={billingAddressSameAsShipping}
                disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
                onCheckedChange={(state) => setBillingAddressSameAsShipping(state as boolean)}
                className="rounded-md size-5"
              />
              <Label htmlFor="shippingTheSameAsBilling" className="cursor-pointer text-sm font-bold">
                Our owls should deliver to the same address
              </Label>
            </div>

            {/* Shipping (if different) */}
            {!billingAddressSameAsShipping && (
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 ml-1">Shipping Address</p>
                {shippingAddress ? (
                  <div className="flex items-start justify-between gap-4 p-5 bg-secondary/30 rounded-xl border border-border/50">
                    <AddressItem address={shippingAddress} />
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={Boolean(paymentData)}
                      onClick={(e) => { e.preventDefault(); setShippingAddress(undefined) }}
                      className="text-primary font-bold"
                    >
                      Change
                    </Button>
                  </div>
                ) : user ? (
                  <CheckoutAddresses heading="" description="Where shall the owls fly?" setAddress={setShippingAddress} />
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

          {/* ── Payment Section ───────────────────────────────────────────── */}
          <Section title="The Finale" stepNumber={3} icon={Sparkles} className={!canGoToPayment ? 'opacity-50 pointer-events-none' : ''}>
            {!paymentData && (
              <div className="flex flex-col gap-6">
                {/* Method selector */}
                {paymentMethods.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.name}
                        className={`flex items-center gap-4 p-6 rounded-xl border cursor-pointer transition-all duration-300 ${selectedPaymentMethod?.name === method.name
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/40 hover:bg-secondary/50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.name}
                          checked={selectedPaymentMethod?.name === method.name}
                          onChange={() => handlePaymentMethodSelect(method)}
                          disabled={!canGoToPayment}
                          className="accent-primary size-5"
                        />
                        <div className="flex flex-col">
                          <span className="font-black text-xs uppercase tracking-widest">{method.label ?? method.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Secure Portal</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* <Button
                  className="w-full py-8 rounded-full text-lg font-black glow-primary transform hover:scale-[1.01] transition-all uppercase tracking-widest"
                  disabled={!canGoToPayment || isProcessingPayment || !selectedPaymentMethod}
                  onClick={handleGoToPayment}
                  size="lg"
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center gap-3">
                      <LoadingSpinner className="h-5 w-5" />
                      Invoking Payment…
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      Prepare for {selectedPaymentMethod?.label ?? selectedPaymentMethod?.name ?? 'Payment'}
                      <ArrowRight size={20} />
                    </span>
                  )}
                </Button> */}
              </div>
            )}

            {/* Error */}
            {error && !paymentData?.['clientSecret'] && (
              <div className="mt-6 flex flex-col gap-4">
                <Message error={error} />
                <Button
                  variant="outline"
                  className="rounded-full self-start px-8 py-6 font-bold"
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

            {/* ── Stripe/PayPal Elements ─────────────────────────────────────── */}
            <Suspense fallback={<LoadingSpinner />}>
              {paymentData?.['clientSecret'] && selectedPaymentMethod?.name === 'stripe' && (
                <div className="mt-2">
                  {error && <p className="text-sm text-destructive mb-6 font-bold bg-destructive/10 p-5 rounded-xl border border-destructive/20">{error}</p>}
                  <Elements
                    options={{
                      appearance: {
                        theme: theme === 'dark' ? 'night' : 'stripe',
                        variables: {
                          borderRadius: '16px',
                          colorPrimary: '#2b6cee',
                          colorBackground: theme === 'dark' ? '#1a1f2e' : '#ffffff',
                          colorText: theme === 'dark' ? '#ffffff' : '#101622',
                          fontFamily: 'Spline Sans, sans-serif',
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
                      className="mt-8 text-muted-foreground rounded-full w-full font-bold"
                      onClick={handleCancelPayment}
                    >
                      ← Choose a different payment method
                    </Button>
                  </Elements>
                </div>
              )}

              {paymentData && selectedPaymentMethod?.name === 'paypal' && !paymentData['clientSecret'] && (
                <div className="flex flex-col gap-6 mt-2">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-sm text-primary font-bold flex gap-4 items-center">
                    <Sparkles className="shrink-0" size={24} />
                    The portal is ready. You&apos;ll be redirected to PayPal to complete your tribute securely.
                  </div>
                  <Button
                    size="lg"
                    className="w-full py-8 rounded-full font-black text-lg uppercase tracking-widest"
                    onClick={() => {
                      if (paymentData.approvalUrl) {
                        window.location.href = paymentData.approvalUrl as string
                      }
                    }}
                  >
                    Continue to PayPal <ArrowRight className="ml-2" size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground rounded-full font-bold"
                    onClick={handleCancelPayment}
                  >
                    ← Choose a different payment method
                  </Button>
                </div>
              )}
            </Suspense>
          </Section>
        </div>

        {/* ── Right Column: Quest Summary ──────────────────────────────────── */}
        <div className="lg:col-span-1 lg:sticky lg:top-28">
          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <History className="text-primary" size={24} />
              Quest Log
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span className="text-sm font-medium">Artifact Subtotal</span>
                <Price amount={cart.subtotal || 0} className="text-foreground font-bold" />
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="text-sm font-medium">Owl Delivery (Priority)</span>
                <span className="text-foreground font-bold uppercase text-xs tracking-widest">Gratis</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="text-sm font-medium">Kingdom Tax</span>
                <Price amount={0} className="text-foreground font-bold" />
              </div>
              <div className="pt-6 border-t border-border flex justify-between items-end">
                <span className="text-lg font-black uppercase tracking-widest">Total Tribute</span>
                <div className="text-right">
                  <Price amount={cart.subtotal || 0} className="text-3xl font-black text-primary" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-black">Due at Finale</p>
                </div>
              </div>
            </div>

            {/* Promo Scroll */}
            {/* <div className="mt-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 ml-1">Promo Scroll</label>
              <div className="relative">
                <Input 
                  className="w-full bg-secondary/50 border-none rounded-full py-6 px-6 focus-visible:ring-primary text-sm font-medium placeholder:text-muted-foreground/50" 
                  placeholder="Enter ancient code..." 
                />
                <Button className="absolute right-2 top-1.5 h-auto text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors">
                  Apply
                </Button>
              </div>
            </div> */}

            {!paymentData && (
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-8 rounded-full flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] glow-primary mt-2 uppercase tracking-widest"
                onClick={handleGoToPayment}
                disabled={!canGoToPayment || isProcessingPayment || !!paymentData}
              >
                <span>Embark on Checkout</span>
                <ArrowRight size={20} />
              </Button>)}

            <div className="flex flex-col items-center gap-3 mt-2">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                <Lock size={12} className="text-primary" />
                Secure Magic Encryption
              </div>
              <p className="text-center text-[10px] text-muted-foreground/60 px-6 leading-relaxed uppercase tracking-tighter">
                Your quest is protected by 256-bit mystical wards.
              </p>
            </div>
          </div>

          {/* Owl Delivery Note */}
          <div className="mt-6 bg-primary/10 p-6 rounded-2xl border border-primary/20 flex items-start gap-4">
            <Bird className="text-primary shrink-0" size={32} />
            <div>
              <h4 className="font-bold text-sm">Owl Delivery Note</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Our swiftest owls are currently resting for the night. Deliveries will commence at the first light of dawn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
