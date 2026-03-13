'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { ArrowRight, Bird, BookOpen, Package, PackageSearch } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { Fragment, useCallback } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  orderID: string
}

type Props = {
  initialEmail?: string
}

export const FindOrderForm: React.FC<Props> = ({ initialEmail }) => {
  const router = useRouter()
  const { user } = useAuth()
  const t = useTranslations('findOrder')

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormData>({
    defaultValues: {
      email: initialEmail || user?.email,
    },
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      router.push(`/orders/${data.orderID}?email=${data.email}`)
    },
    [router],
  )

  return (
    <Fragment>
      <div className="max-w-2xl mx-auto w-full py-10">
        {/* Page header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <PackageSearch size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('header.title')}</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            {t('header.description')}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-card/50 p-8 rounded-2xl border border-border flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">
              1
            </span>
            <BookOpen size={24} className="text-primary" />
            <h3 className="text-xl font-bold">{t('form.title')}</h3>
          </div>

          <form className="flex flex-col gap-6 px-2" onSubmit={handleSubmit(onSubmit)}>
            <FormItem>
              <Label
                htmlFor="email"
                className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
              >
                {t('form.emailLabel')}
              </Label>
              <Input
                id="email"
                {...register('email', { required: t('form.emailRequired') })}
                type="email"
                placeholder={t('form.emailPlaceholder')}
                className="mt-2 rounded-full px-6 py-6 bg-secondary/50 border-none focus-visible:ring-primary"
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <FormItem>
              <Label
                htmlFor="orderID"
                className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
              >
                {t('form.orderIdLabel')}
              </Label>
              <Input
                id="orderID"
                {...register('orderID', {
                  required: t('form.orderIdRequired'),
                })}
                type="text"
                placeholder={t('form.orderIdPlaceholder')}
                className="mt-2 rounded-full px-6 py-6 bg-secondary/50 border-none focus-visible:ring-primary"
              />
              {errors.orderID && <FormError message={errors.orderID.message} />}
            </FormItem>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-8 rounded-full flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] glow-primary uppercase tracking-widest mt-2"
            >
              <Package size={18} />
              {t('form.submit')}
              <ArrowRight size={18} className='rtl:rotate-180' />
            </Button>
          </form>
        </div>

        {/* Helper note */}
        <div className="mt-8 bg-primary/10 p-6 rounded-2xl border border-primary/20 flex items-start gap-4">
          <Bird className="text-primary shrink-0 mt-0.5" size={28} />
          <div>
            <h4 className="font-bold text-sm">{t('helper.title')}</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {t('helper.description')}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  )
}