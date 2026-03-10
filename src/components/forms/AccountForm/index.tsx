'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { Save, ShieldBan, X } from 'lucide-react'
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
          toast.success('Successfully updated the eternal ledger.')
          setChangePassword(false)
          reset({
            name: json.doc.name,
            email: json.doc.email,
            password: '',
            passwordConfirm: '',
          })
        } else {
          toast.error('The ritual encountered an error.')
        }
      }
    },
    [user, setUser, reset],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          'You must be logged in to view this page.',
        )}&redirect=${encodeURIComponent('/account')}`,
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
  }, [user, router, reset])

  return (
    <form className="w-full space-y-8" onSubmit={handleSubmit(onSubmit)}>
      {!changePassword ? (
        <Fragment>
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border/50 pb-6 mb-8">
            <p className="text-muted-foreground text-sm font-medium">
              Update your chronicle details or access the sanctum to change your wards.
            </p>
            <Button
              className="rounded-full text-xs font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/20"
              onClick={() => setChangePassword(true)}
              type="button"
              variant="secondary"
            >
              <ShieldBan size={14} className="mr-2" />
              Change Passwords
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormItem className="space-y-3">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Chronicle Name
              </Label>
              <Input
                id="name"
                {...register('name', { required: 'Please provide a name.' })}
                type="text"
                className="w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 transition-all font-medium"
                placeholder="Name your legend..."
              />
              {errors.name && <FormError message={errors.name.message} />}
            </FormItem>

            <FormItem className="space-y-3">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Communication Beacon (Email)
              </Label>
              <Input
                id="email"
                {...register('email', { required: 'Please provide an email.' })}
                type="email"
                className="w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 transition-all font-medium"
                placeholder="adventurer@tales.com"
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
              <p className="text-foreground font-bold">Reinforce Security Wards</p>
            </div>
            <Button
              className="rounded-full text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() => setChangePassword(false)}
              type="button"
              variant="ghost"
            >
              <X size={14} className="mr-2" />
              Cancel Ritual
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormItem className="space-y-3">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                New Security Key
              </Label>
              <Input
                id="password"
                {...register('password', { required: 'Please provide a new password.' })}
                type="password"
                className="w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus-visible:ring-primary transition-all font-medium"
                placeholder="Enter new ward..."
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem className="space-y-3">
              <Label htmlFor="passwordConfirm" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Confirm Security Key
              </Label>
              <Input
                id="passwordConfirm"
                {...register('passwordConfirm', {
                  required: 'Please confirm your new password.',
                  validate: (value) => value === password.current || 'The passwords do not match',
                })}
                type="password"
                className="w-full bg-secondary/30 border-border/50 rounded-xl px-6 py-6 text-foreground focus-visible:ring-primary transition-all font-medium"
                placeholder="Re-enter ward..."
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
            'Processing...'
          ) : (
            <>
              <Save size={18} />
              {changePassword ? 'Reinforce Wards' : 'Update Ledger'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
