'use client'

import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { defaultCountries as supportedCountries } from '@payloadcms/plugin-ecommerce/client/react'
import { Address, Config } from '@/payload-types'
import { titles } from './constants'
import { deepMergeSimple } from 'payload/shared'
import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Shield, Phone, Building, Compass, Send, Trash2 } from 'lucide-react'

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

export const AddressForm: React.FC<Props> = ({
  addressID,
  initialData,
  callback,
  skipSubmission,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AddressFormValues>({
    defaultValues: initialData,
  })

  const { createAddress, updateAddress } = useAddresses()

  const onSubmit = useCallback(
    async (data: AddressFormValues) => {
      const newData = deepMergeSimple(initialData || {}, data)

      if (!skipSubmission) {
        if (addressID) {
          await updateAddress(addressID, newData)
        } else {
          await createAddress(newData)
        }
      }

      if (callback) callback(newData)
    },
    [initialData, skipSubmission, callback, addressID, updateAddress, createAddress],
  )

  const labelClasses = "text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] px-1 mb-2 block"
  const inputClasses = "w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 transition-all font-medium placeholder:text-muted-foreground/50"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">

      {/* Identity Row */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className={labelClasses}>Identity & Title</Label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
              <Shield size={18} />
            </div>
            <Select
              onValueChange={(value) => setValue('title', value, { shouldValidate: true })}
              defaultValue={initialData?.title || ''}
            >
              <SelectTrigger id="title" className="w-full bg-secondary/30 border-border/50 rounded-xl pl-14 pr-6 py-6 text-foreground focus:ring-primary focus:ring-offset-0 transition-all font-medium h-auto">
                <SelectValue placeholder="e.g. Archmage, Grand Traveler" />
              </SelectTrigger>
              <SelectContent>
                {titles.map((title) => (
                  <SelectItem key={title} value={title}>{title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.title && <FormError message={errors.title.message} />}
        </div>

        {/* Name Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName" className={labelClasses}>First Name</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              {...register('firstName', { required: 'First name is required.' })}
              className={inputClasses}
              placeholder="Given Name"
            />
            {errors.firstName && <FormError message={errors.firstName.message} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName" className={labelClasses}>Last Name</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              {...register('lastName', { required: 'Last name is required.' })}
              className={inputClasses}
              placeholder="House / Surname"
            />
            {errors.lastName && <FormError message={errors.lastName.message} />}
          </div>
        </div>

        {/* Contact & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className={labelClasses}>Magical Frequency (Phone)</Label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                <Phone size={18} />
              </div>
              <Input 
                type="tel" 
                id="phone" 
                autoComplete="mobile tel" 
                {...register('phone')} 
                className={`${inputClasses} pl-14`}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            {errors.phone && <FormError message={errors.phone.message} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="company" className={labelClasses}>Guild / Company</Label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                <Building size={18} />
              </div>
              <Input 
                id="company" 
                autoComplete="organization" 
                {...register('company')} 
                className={`${inputClasses} pl-14`}
                placeholder="Arcane Institution"
              />
            </div>
            {errors.company && <FormError message={errors.company.message} />}
          </div>
        </div>
      </div>

      <Separator className="bg-border/30" />

      {/* Address fields */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="addressLine1" className={labelClasses}>Destination Coordinates (Address Line 1)</Label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
              <Compass size={18} />
            </div>
            <Input
              id="addressLine1"
              autoComplete="address-line1"
              {...register('addressLine1', { required: 'Address line 1 is required.' })}
              className={`${inputClasses} pl-14`}
              placeholder="Street name and number"
            />
          </div>
          {errors.addressLine1 && <FormError message={errors.addressLine1.message} />}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="addressLine2" className={labelClasses}>Suite / Tower / Chamber (Address Line 2)</Label>
          <Input 
            id="addressLine2" 
            autoComplete="address-line2" 
            {...register('addressLine2')} 
            className={inputClasses}
            placeholder="Apartment, suite, unit, etc."
          />
          {errors.addressLine2 && <FormError message={errors.addressLine2.message} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="city" className={labelClasses}>City</Label>
            <Input
              id="city"
              autoComplete="address-level2"
              {...register('city', { required: 'City is required.' })}
              className={inputClasses}
              placeholder="City"
            />
            {errors.city && <FormError message={errors.city.message} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="state" className={labelClasses}>State / Realm</Label>
            <Input 
              id="state" 
              autoComplete="address-level1" 
              {...register('state')} 
              className={inputClasses}
              placeholder="State"
            />
            {errors.state && <FormError message={errors.state.message} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="postalCode" className={labelClasses}>Zip Code</Label>
            <Input
              id="postalCode"
              {...register('postalCode', { required: 'Postal code is required.' })}
              className={inputClasses}
              placeholder="Postal Code"
            />
            {errors.postalCode && <FormError message={errors.postalCode.message} />}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="country" className={labelClasses}>Universal Domain (Country)</Label>
          <Select
            onValueChange={(value) => setValue('country', value, { shouldValidate: true })}
            defaultValue={initialData?.country || ''}
          >
            <SelectTrigger id="country" className="w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus:ring-primary focus:ring-offset-0 transition-all font-medium h-auto">
              <SelectValue placeholder="Select Domain" />
            </SelectTrigger>
            <SelectContent>
              {supportedCountries.map((country) => {
                const value = typeof country === 'string' ? country : country.value
                const label =
                  typeof country === 'string'
                    ? country
                    : typeof country.label === 'string'
                      ? country.label
                      : value
                return (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {errors.country && <FormError message={errors.country.message} />}
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-black py-8 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 uppercase tracking-widest text-sm"
        >
          <Send size={18} />
          {isSubmitting ? 'Finalizing...' : addressID ? 'CONFIRM REVISIONS' : 'CONFIRM DESTINATION'}
        </Button>
      </div>

    </form>
  )
}
