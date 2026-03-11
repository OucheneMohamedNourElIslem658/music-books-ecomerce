'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { Save, ShieldBan, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormData = {
  email: string
  name: User['name']
  password: string
  passwordConfirm: string
}

export const AccountForm: React.FC = () => {
  const t = useTranslations('account.form')
  const { setUser, user } = useAuth()
  const [changePassword, setChangePassword] = useState(false)

  const {
    formState: { errors, isLoading, isSubmitting, isDirty },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
          body: JSON.stringify(data),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        })

        if (response.ok) {
          const json = await response.json()
          setUser(json.doc)
          toast.success(t('updateSuccess'))
          setChangePassword(false)
          reset({
            name: json.doc.name,
            email: json.doc.email,
            password: '',
            passwordConfirm: '',
          })
        } else {
          toast.error(t('updateError'))
        }
      }
    },
    [user, setUser, reset, t],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(t('loginError'))}&redirect=${encodeURIComponent(
          '/account',
        )}`,
      )
    }

    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, router, reset, t])

  return (
    <form className="w-full space-y-8" onSubmit={handleSubmit(onSubmit)}>
      {!changePassword ? (
        <Fragment>
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border/50 pb-6 mb-8">
            <p className="text-muted-foreground text-sm font-medium">{t('description')}</p>
            <Button
              className="rounded-full text-xs font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/20"
              onClick={() => setChangePassword(true)}
              type="button"
              variant="secondary"
            >
              <ShieldBan size={14} className="mr-2" />
              {t('changePassword')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormItem className="space-y-3">
              <Label
                htmlFor="name"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
              >
                {t('chronicleName')}
              </Label>
              <Input
                id="name"
                {...register('name', { required: t('nameRequired') })}
                type="text"
                className="w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 transition-all font-medium"
                placeholder={t('namePlaceholder')}
              />
              {errors.name && <FormError message={errors.name.message} />}
            </FormItem>

            <FormItem className="space-y-3">
              <Label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
              >
                {t('emailLabel')}
              </Label>
              <Input
                id="email"
                {...register('email', { required: t('emailRequired') })}
                type="email"
                className="w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 transition-all font-medium"
                placeholder={t('emailPlaceholder')}
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border/50 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <ShieldBan className="text-primary" size={20} />
              <p className="text-foreground font-bold">{t('securityWards')}</p>
            </div>
            <Button
              className="rounded-full text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() => setChangePassword(false)}
              type="button"
              variant="ghost"
            >
              <X size={14} className="mr-2" />
              {t('cancelRitual')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormItem className="space-y-3">
              <Label
                htmlFor="password"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
              >
                {t('newSecurityKey')}
              </Label>
              <Input
                id="password"
                {...register('password', { required: t('passwordRequired') })}
                type="password"
                className="w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus-visible:ring-primary transition-all font-medium"
                placeholder={t('newWardPlaceholder')}
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem className="space-y-3">
              <Label
                htmlFor="passwordConfirm"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
              >
                {t('confirmSecurityKey')}
              </Label>
              <Input
                id="passwordConfirm"
                {...register('passwordConfirm', {
                  required: t('confirmPasswordRequired'),
                  validate: (value) => value === password.current || t('passwordMismatch'),
                })}
                type="password"
                className="w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus-visible:ring-primary transition-all font-medium"
                placeholder={t('confirmWardPlaceholder')}
              />
              {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
            </FormItem>
          </div>
        </Fragment>
      )}

      <div className="flex justify-end pt-6">
        <Button
          disabled={isLoading || isSubmitting || !isDirty}
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
        >
          {isLoading || isSubmitting ? (
            t('processing')
          ) : (
            <>
              <Save size={18} />
              {changePassword ? t('reinforceWards') : t('updateLedger')}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
