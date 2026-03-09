'use client'

import { FormError } from '@/components/forms/FormError'
import { Message } from '@/components/Message'
import { Link } from '@/i18n/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

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
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-5xl">mail</span>
        </div>
        <div>
          <p className="text-xl font-bold text-[#4a3728] font-display">Messenger Sent</p>
          <p className="text-sm text-[#6d5b4b] mt-2 italic font-display">
            Check your parchment for the instructions to reset your secret key.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className="w-full space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <Message error={error} />

      <div className="flex flex-col gap-2">
        <label className="text-[#4a3728] text-sm font-bold uppercase tracking-wider pl-1 font-display" htmlFor="email">
          Chronicler Email
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7241]">
            mail
          </span>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Please provide your email.' })}
            className="w-full bg-white/50 border-2 border-[#d9cdab] rounded-xl py-4 pl-12 pr-4 text-[#4a3728] placeholder-[#a69671] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-sans"
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <FormError message={errors.email.message} />}
      </div>

      <div className="flex justify-center pt-4 pb-10">
        <button
          className="wax-seal group relative flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white border-4 border-white/20"
          type="submit"
        >
          <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-90"></div>
          <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
            send
          </span>
          {/* Button Label */}
          <div className="absolute -bottom-8 whitespace-nowrap text-[#4a3728] font-bold text-sm tracking-[0.2em] uppercase font-display">
            Send Messenger
          </div>
        </button>
      </div>

      <div className="mt-8 w-full text-center border-t border-[#d9cdab] pt-6">
        <Link
          className="inline-block text-primary font-bold magical-glow hover:scale-105 transition-transform font-display"
          href="/login"
        >
          Return to Portal
        </Link>
      </div>
    </form>
  )
}