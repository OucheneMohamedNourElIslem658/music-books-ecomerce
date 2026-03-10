'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Address, Config } from '@/payload-types'
import { defaultCountries as supportedCountries, useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { Loader2, Save } from 'lucide-react'
import { deepMergeSimple } from 'payload/shared'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { titles } from './constants'

type AddressFormValues = {
  title?: string | null
  firstName?: string | null
  lastName?: string | null
  company?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  phone?: string | null
}

type Props = {
  addressID?: Config['db']['defaultIDType']
  initialData?: Omit<Address, 'country' | 'id' | 'updatedAt' | 'createdAt'> & { country?: string }
  callback?: (data: Partial<Address>) => void
  skipSubmission?: boolean
}

const L = ({ children }: { children: React.ReactNode }) => (
  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
    {children}
  </Label>
)

export const AddressForm: React.FC<Props> = ({ addressID, initialData, callback, skipSubmission }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } =
    useForm<AddressFormValues>({ defaultValues: initialData })

  const { createAddress, updateAddress } = useAddresses()

  const onSubmit = useCallback(async (data: AddressFormValues) => {
    const newData = deepMergeSimple(initialData || {}, data)
    if (!skipSubmission) {
      if (addressID) await updateAddress(addressID, newData)
      else await createAddress(newData)
    }
    if (callback) callback(newData)
  }, [initialData, skipSubmission, callback, addressID, updateAddress, createAddress])

  const inputCls = "h-9 rounded-lg border-border bg-background/60 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-primary transition-all"
  const selectTriggerCls = "h-9 rounded-lg border-border bg-background/60 text-sm focus:ring-primary transition-all"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* Title */}
      <FormItem>
        <L>Title <span className="text-muted-foreground/50 normal-case font-medium tracking-normal">— optional</span></L>
        <Select onValueChange={(v) => setValue('title', v)} defaultValue={initialData?.title || ''}>
          <SelectTrigger className={selectTriggerCls}>
            <SelectValue placeholder="Select a title" />
          </SelectTrigger>
          <SelectContent>
            {titles.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormItem>

      {/* Name */}
      <div className="grid grid-cols-2 gap-3">
        <FormItem>
          <L>First Name</L>
          <Input id="firstName" autoComplete="given-name" placeholder="First name"
            {...register('firstName', { required: 'Required.' })} className={inputCls} />
          {errors.firstName && <FormError message={errors.firstName.message} />}
        </FormItem>
        <FormItem>
          <L>Last Name</L>
          <Input id="lastName" autoComplete="family-name" placeholder="Last name"
            {...register('lastName', { required: 'Required.' })} className={inputCls} />
          {errors.lastName && <FormError message={errors.lastName.message} />}
        </FormItem>
      </div>

      {/* Phone + Company */}
      <div className="grid grid-cols-2 gap-3">
        <FormItem>
          <L>Phone <span className="text-muted-foreground/50 normal-case font-medium tracking-normal">— optional</span></L>
          <Input type="tel" id="phone" autoComplete="tel" placeholder="+1 555 000 0000"
            {...register('phone')} className={inputCls} />
        </FormItem>
        <FormItem>
          <L>Company <span className="text-muted-foreground/50 normal-case font-medium tracking-normal">— optional</span></L>
          <Input id="company" autoComplete="organization" placeholder="Company name"
            {...register('company')} className={inputCls} />
        </FormItem>
      </div>

      <div className="h-px bg-border" />

      {/* Address Line 1 */}
      <FormItem>
        <L>Address Line 1</L>
        <Input id="addressLine1" autoComplete="address-line1" placeholder="Street address"
          {...register('addressLine1', { required: 'Address is required.' })} className={inputCls} />
        {errors.addressLine1 && <FormError message={errors.addressLine1.message} />}
      </FormItem>

      {/* Address Line 2 */}
      <FormItem>
        <L>Address Line 2 <span className="text-muted-foreground/50 normal-case font-medium tracking-normal">— optional</span></L>
        <Input id="addressLine2" autoComplete="address-line2" placeholder="Apartment, suite, unit…"
          {...register('addressLine2')} className={inputCls} />
      </FormItem>

      {/* City / State / Zip */}
      <div className="grid grid-cols-3 gap-3">
        <FormItem>
          <L>City</L>
          <Input id="city" autoComplete="address-level2" placeholder="City"
            {...register('city', { required: 'Required.' })} className={inputCls} />
          {errors.city && <FormError message={errors.city.message} />}
        </FormItem>
        <FormItem>
          <L>State</L>
          <Input id="state" autoComplete="address-level1" placeholder="State"
            {...register('state')} className={inputCls} />
        </FormItem>
        <FormItem>
          <L>Postal Code</L>
          <Input id="postalCode" placeholder="ZIP"
            {...register('postalCode', { required: 'Required.' })} className={inputCls} />
          {errors.postalCode && <FormError message={errors.postalCode.message} />}
        </FormItem>
      </div>

      {/* Country */}
      <FormItem>
        <L>Country</L>
        <Select onValueChange={(v) => setValue('country', v, { shouldValidate: true })}
          defaultValue={initialData?.country || ''}>
          <SelectTrigger className={selectTriggerCls}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {supportedCountries.map((country) => {
              const value = typeof country === 'string' ? country : country.value
              const label = typeof country === 'string' ? country : typeof country.label === 'string' ? country.label : value
              return <SelectItem key={value} value={value}>{label}</SelectItem>
            })}
          </SelectContent>
        </Select>
        {errors.country && <FormError message={errors.country.message} />}
      </FormItem>

      {/* Submit */}
      <div className="pt-1">
        <Button type="submit" disabled={isSubmitting}
          className="w-full h-10 rounded-full font-black uppercase tracking-widest text-xs shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          {isSubmitting
            ? <><Loader2 className="size-3.5 animate-spin mr-2" /> Saving…</>
            : <><Save className="size-3.5 mr-2" />{addressID ? 'Save Changes' : 'Add Address'}</>
          }
        </Button>
      </div>
    </form>
  )
}