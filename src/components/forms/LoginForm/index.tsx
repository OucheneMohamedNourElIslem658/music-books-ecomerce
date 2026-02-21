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
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      setError(null)
      try {
        await login(data)
        router.push(redirect.current ?? '/account')
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : 'There was an error with the credentials provided. Please try again.'
        setError(message)
      }
    },
    [login, router],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Message error={error} />

      <div className="flex flex-col gap-4">
        <FormItem>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password', { required: 'Please provide a password.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>
      </div>

      <p className="text-sm text-muted-foreground">
        Forgot your password?{' '}
        <Link
          href={`/forgot-password${allParams}`}
          className="text-primary hover:no-underline underline-offset-4 underline"
        >
          Click here to reset it
        </Link>
      </p>

      <Separator />

      <div className="flex gap-3">
        <Button asChild variant="outline" size="lg" className="flex-1 rounded-full">
          <Link href={`/create-account${allParams}`}>
            Create account
          </Link>
        </Button>
        <Button
          className="flex-1 rounded-full"
          disabled={isSubmitting}
          size="lg"
          type="submit"
        >
          {isSubmitting ? 'Signing in…' : 'Continue'}
        </Button>
      </div>
    </form>
  )
}