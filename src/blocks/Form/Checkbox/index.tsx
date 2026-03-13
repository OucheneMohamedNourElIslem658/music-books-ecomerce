import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Width } from '../Width'
import { capitaliseFirstLetter } from '@/utilities/capitaliseFirstLetter'
import { FormError } from '@/components/forms/FormError'
import { useTranslations } from 'next-intl'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    getValues: any
    register: UseFormRegister<FieldValues>
    setValue: any
  }
> = ({ name, defaultValue, errors, label, register, required: requiredFromProps, width }) => {
  const t = useTranslations('blocks.form')
  const props = register(name, {
    required: requiredFromProps
      ? t('required', { label: capitaliseFirstLetter(label || name) })
      : undefined,
  })
  const { setValue } = useFormContext()

  return (
    <Width width={width}>
      <div className="flex items-center gap-2">
        <CheckboxUi
          defaultChecked={defaultValue}
          id={name}
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked)
          }}
        />
        <Label htmlFor={name}>{label}</Label>
      </div>
      {errors?.[name]?.message && typeof errors?.[name]?.message === 'string' && (
        <FormError message={errors?.[name]?.message} />
      )}
    </Width>
  )
}
