'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MailCheckIcon } from 'lucide-react'

type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      },
    )

    if (response.ok) {
      setSuccess(true)
      setError('')
    } else {
      setError(
        'There was a problem sending a password reset email. Please try again.',
      )
    }
  }, [])

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <MailCheckIcon className="size-6" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Check your email</p>
          <p className="text-sm text-muted-foreground mt-1">
            We sent you a link to securely reset your password.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-sm text-muted-foreground">
        Enter your email below and we&apos;ll send you reset instructions. 
        {/* To manage all users,{' '}
        <Link
          href="/admin/collections/users"
          className="text-primary hover:no-underline underline-offset-4 underline"
        >
          login to the admin dashboard
        </Link> */}
        .
      </p>

      <Message error={error} />

      <FormItem>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          {...register('email', { required: 'Please provide your email.' })}
          type="email"
        />
        {errors.email && <FormError message={errors.email.message} />}
      </FormItem>

      <Separator />

      <Button type="submit" className="rounded-full w-full">
        Send Reset Link
      </Button>
    </form>
  )
}