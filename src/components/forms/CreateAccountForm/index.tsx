'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { create } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true)
      setError(null)

      try {
        await create(data)
        const redirect = searchParams.get('redirect')
        router.push(
          redirect ?? `/account?success=${encodeURIComponent('Account created successfully')}`,
        )
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : 'There was an error creating the account. Please try again.'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [create, router, searchParams],
  )

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

      {/* <p className="text-sm text-muted-foreground">
        If you already have an account,{' '}
        <Link
          href="/login"
          className="text-primary hover:no-underline underline-offset-4 underline"
        >
          log in instead
        </Link>
        .
      </p> */}

      <Message error={error} />

      <div className="flex flex-col gap-4">
        <FormItem>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            {...register('email', { required: 'Email is required.' })}
            type="email"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            {...register('password', { required: 'Password is required.' })}
            type="password"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="passwordConfirm">Confirm Password</Label>
          <Input
            id="passwordConfirm"
            {...register('passwordConfirm', {
              required: 'Please confirm your password.',
              validate: (value) => value === password.current || 'The passwords do not match',
            })}
            type="password"
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <Separator />

      <div className="flex gap-3">
        <Button asChild variant="outline" className="flex-1 rounded-full">
          <Link href={`/login${allParams}`}>Log in instead</Link>
        </Button>
        <Button
          disabled={loading}
          type="submit"
          className="flex-1 rounded-full"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </div>

    </form>
  )
}