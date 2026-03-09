'use client'

import { FormError } from '@/components/forms/FormError'
import { Message } from '@/components/Message'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <Message error={error} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[#4a3728] text-sm font-bold uppercase tracking-wider pl-1 font-display" htmlFor="email">
            Chronicler Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7241]">
              person_book
            </span>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required.' })}
              className="w-full bg-white/50 border-2 border-[#d9cdab] rounded-xl py-4 pl-12 pr-4 text-[#4a3728] placeholder-[#a69671] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-sans"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && <FormError message={errors.email.message} />}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#4a3728] text-sm font-bold uppercase tracking-wider pl-1 font-display" htmlFor="password">
            Secret Key
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7241]">
              key
            </span>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Please provide a password.' })}
              className="w-full bg-white/50 border-2 border-[#d9cdab] rounded-xl py-4 pl-12 pr-12 text-[#4a3728] placeholder-[#a69671] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-sans"
              placeholder="Enter your secret key"
            />
          </div>
          {errors.password && <FormError message={errors.password.message} />}
        </div>
      </div>

      <Link
        href={`/forgot-password${allParams}`}
        className="text-xs font-bold shrink-0 text-primary uppercase tracking-tighter hover:underline font-display flex justify-end"
      >
        Lost the Key?
      </Link>

      {/* Login Button - The Wax Seal */}
      <div className="flex justify-center pt-8 pb-10">
        <button
          className="wax-seal group relative flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white border-4 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-90"></div>
          <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
            {isSubmitting ? 'hourglass_empty' : 'lock_open'}
          </span>
          {/* Button Label */}
          <div className="absolute -bottom-8 whitespace-nowrap text-[#4a3728] font-bold text-sm tracking-[0.2em] uppercase font-display">
            {isSubmitting ? 'Unsealing...' : 'Unseal Portal'}
          </div>
        </button>
      </div>

      <div className="mt-8 w-full text-center border-t border-[#d9cdab] pt-6">
        <p className="text-[#6d5b4b] text-sm font-display">Not yet a member of our world?</p>
        <Link
          className="inline-block mt-2 text-primary font-bold magical-glow hover:scale-105 transition-transform font-display"
          href={`/create-account${allParams}`}
        >
          Join the Guild <span className="ml-1">→</span>
        </Link>
      </div>
    </form>
  )
}