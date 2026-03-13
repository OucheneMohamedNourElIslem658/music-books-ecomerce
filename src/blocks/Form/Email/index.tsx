import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Width } from '../Width'
import { FormItem } from '@/components/forms/FormItem'
import { FormError } from '@/components/forms/FormError'
import { capitaliseFirstLetter } from '@/utilities/capitaliseFirstLetter'
import { useTranslations } from 'next-intl'

export const Email: React.FC<
  EmailField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required: requiredFromProps, width }) => {
  const t = useTranslations('blocks.form')
  return (
    <Width width={width}>
      <FormItem>
        <Label htmlFor={name}>{label}</Label>
        <Input
          defaultValue={defaultValue}
          id={name}
          type="text"
          {...register(name, {
            pattern: /^\S[^\s@]*@\S+$/,
            required: requiredFromProps
              ? t('required', { label: capitaliseFirstLetter(label || name) })
              : undefined,
          })}
        />

        {errors?.[name]?.message && typeof errors?.[name]?.message === 'string' && (
          <FormError message={errors?.[name]?.message} />
        )}
      </FormItem>
    </Width>
  )
}
