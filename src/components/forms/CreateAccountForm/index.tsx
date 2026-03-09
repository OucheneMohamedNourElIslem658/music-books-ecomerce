'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
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
    <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Message error={error} />

      <div className="flex flex-col gap-6">
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
              {...register('email', { required: 'Email is required.' })}
              type="email"
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
              {...register('password', { required: 'Password is required.' })}
              type="password"
              className="w-full bg-white/50 border-2 border-[#d9cdab] rounded-xl py-4 pl-12 pr-4 text-[#4a3728] placeholder-[#a69671] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-sans"
              placeholder="Create your secret key"
            />
          </div>
          {errors.password && <FormError message={errors.password.message} />}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#4a3728] text-sm font-bold uppercase tracking-wider pl-1 font-display" htmlFor="passwordConfirm">
            Confirm Secret Key
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7241]">
              enhanced_encryption
            </span>
            <input
              id="passwordConfirm"
              {...register('passwordConfirm', {
                required: 'Please confirm your password.',
                validate: (value) => value === password.current || 'The passwords do not match',
              })}
              type="password"
              className="w-full bg-white/50 border-2 border-[#d9cdab] rounded-xl py-4 pl-12 pr-4 text-[#4a3728] placeholder-[#a69671] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-sans"
              placeholder="Confirm your secret key"
            />
          </div>
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </div>
      </div>

      <div className="flex justify-center pt-8 pb-10">
        <button
          className="wax-seal group relative flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white border-4 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-90"></div>
          <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
            {loading ? 'hourglass_empty' : 'person_add'}
          </span>
          {/* Button Label */}
          <div className="absolute -bottom-8 whitespace-nowrap text-[#4a3728] font-bold text-sm tracking-[0.2em] uppercase font-display">
            {loading ? 'Enlisting...' : 'Join Guild'}
          </div>
        </button>
      </div>

      <div className="mt-8 w-full text-center border-t border-[#d9cdab] pt-6">
        <p className="text-[#6d5b4b] text-sm font-display">Already a member of our world?</p>
        <Link
          className="inline-block mt-2 text-primary font-bold magical-glow hover:scale-105 transition-transform font-display"
          href={`/login${allParams}`}
        >
          Return to Portal <span className="ml-1">→</span>
        </Link>
      </div>
    </form>
  )
}