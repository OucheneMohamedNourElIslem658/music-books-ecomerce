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
import {
  defaultCountries as supportedCountries,
  useAddresses,
} from '@payloadcms/plugin-ecommerce/client/react'
import { Loader2, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('addresses.form')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AddressFormValues>({ defaultValues: initialData })

  const { createAddress, updateAddress } = useAddresses()

  const onSubmit = useCallback(
    async (data: AddressFormValues) => {
      const newData = deepMergeSimple(initialData || {}, data)
      if (!skipSubmission) {
        if (addressID) await updateAddress(addressID, newData)
        else await createAddress(newData)
      }
      if (callback) callback(newData)
    },
    [initialData, skipSubmission, callback, addressID, updateAddress, createAddress],
  )

  const inputCls =
    'h-9 rounded-lg border-border bg-background/60 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-primary transition-all'
  const selectTriggerCls =
    'h-9 rounded-lg border-border bg-background/60 text-sm focus:ring-primary transition-all'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Title */}
      <FormItem>
        <L>
          {t('title')}{' '}
          <span className="text-muted-foreground/50 normal-case font-medium tracking-normal">
            — {t('optional')}
          </span>
        </L>
        <Select
          onValueChange={(v) => setValue('title', v)}
          defaultValue={initialData?.title || ''}
        >
          <SelectTrigger className={selectTriggerCls}>
            <SelectValue placeholder={t('selectTitle')} />
          </SelectTrigger>
          <SelectContent>
            {titles.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>

      {/* Name */}
      <div className="grid grid-cols-2 gap-3">
        <FormItem>
          <L>{t('firstName')}</L>
          <Input
            id="firstName"
            autoComplete="given-name"
            placeholder={t('firstNamePlaceholder')}
            {...register('firstName', { required: t('required') })}
            className={inputCls}
          />
          {errors.firstName && <FormError message={errors.firstName.message} />}
        </FormItem>
        <FormItem>
          <L>{t('lastName')}</L>
          <Input
            id="lastName"
            autoComplete="family-name"
            placeholder={t('lastNamePlaceholder')}
            {...register('lastName', { required: t('required') })}
            className={inputCls}
          />
          {errors.lastName && <FormError message={errors.lastName.message} />}
        </FormItem>
      </div>

      {/* Phone + Company */}
      <div className="grid grid-cols-2 gap-3">
        <FormItem>
          <L>
            {t('phone')}{' '}
            <span className="text-muted-foreground/50 normal-case font-medium tracking-normal">
              — {t('optional')}
            </span>
          </L>
          <Input
            type="tel"
            id="phone"
            autoComplete="tel"
            placeholder="+1 555 000 0000"
            {...register('phone')}
            className={inputCls}
          />
        </FormItem>
        <FormItem>
          <L>
            {t('company')}{' '}
            <span className="text-muted-foreground/50 normal-case font-medium tracking-normal">
              — {t('optional')}
            </span>
          </L>
          <Input
            id="company"
            autoComplete="organization"
            placeholder={t('companyPlaceholder')}
            {...register('company')}
            className={inputCls}
          />
        </FormItem>
      </div>

      <div className="h-px bg-border" />

      {/* Address Line 1 */}
      <FormItem>
        <L>{t('addressLine1')}</L>
        <Input
          id="addressLine1"
          autoComplete="address-line1"
          placeholder={t('streetAddressPlaceholder')}
          {...register('addressLine1', { required: t('addressRequired') })}
          className={inputCls}
        />
        {errors.addressLine1 && <FormError message={errors.addressLine1.message} />}
      </FormItem>

      {/* Address Line 2 */}
      <FormItem>
        <L>
          {t('addressLine2')}{' '}
          <span className="text-muted-foreground/50 normal-case font-medium tracking-normal">
            — {t('optional')}
          </span>
        </L>
        <Input
          id="addressLine2"
          autoComplete="address-line2"
          placeholder={t('apartmentPlaceholder')}
          {...register('addressLine2')}
          className={inputCls}
        />
      </FormItem>

      {/* City / State / Zip */}
      <div className="grid grid-cols-3 gap-3">
        <FormItem>
          <L>{t('city')}</L>
          <Input
            id="city"
            autoComplete="address-level2"
            placeholder={t('city')}
            {...register('city', { required: t('required') })}
            className={inputCls}
          />
          {errors.city && <FormError message={errors.city.message} />}
        </FormItem>
        <FormItem>
          <L>{t('state')}</L>
          <Input
            id="state"
            autoComplete="address-level1"
            placeholder={t('state')}
            {...register('state')}
            className={inputCls}
          />
        </FormItem>
        <FormItem>
          <L>{t('postalCode')}</L>
          <Input
            id="postalCode"
            placeholder={t('zip')}
            {...register('postalCode', { required: t('required') })}
            className={inputCls}
          />
          {errors.postalCode && <FormError message={errors.postalCode.message} />}
        </FormItem>
      </div>

      {/* Country */}
      <FormItem>
        <L>{t('country')}</L>
        <Select
          onValueChange={(v) => setValue('country', v, { shouldValidate: true })}
          defaultValue={initialData?.country || ''}
        >
          <SelectTrigger className={selectTriggerCls}>
            <SelectValue placeholder={t('selectCountry')} />
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
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        {errors.country && <FormError message={errors.country.message} />}
      </FormItem>

      {/* Submit */}
      <div className="pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 rounded-full font-black uppercase tracking-widest text-xs shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin mr-2" /> {t('saving')}
            </>
          ) : (
            <>
              <Save className="size-3.5 mr-2" />
              {addressID ? t('saveChanges') : t('addAddress')}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}