'use client'

import { AuthLayout } from '@/components/layout/AuthLayout'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

// ─── Inner form (uses useSearchParams so needs Suspense boundary) ─────────────

function ResetPasswordForm() {
  const t = useTranslations('auth.resetPassword')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setStatus('error')
      setMessage(t('invalidToken'))
      return
    }

    if (password !== confirm) {
      setStatus('error')
      setMessage(t('passwordMismatch'))
      return
    }

    if (password.length < 8) {
      setStatus('error')
      setMessage(t('passwordLength'))
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
        priority: 'high',
      })

      if (res.ok) {
        setStatus('success')
        setMessage(t('redirecting'))
        setTimeout(() => router.push('/login'), 2500)
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setMessage(data?.errors?.[0]?.message || t('expired'))
      }
    } catch {
      setStatus('error')
      setMessage(t('genericError'))
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-5xl">shield_check</span>
        </div>
        <div>
          <p className="text-xl font-bold text-[#4a3728] font-display">{t('success')}</p>
          <p className="text-sm text-[#6d5b4b] mt-2 italic font-display">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Password field */}
      <div className="flex flex-col gap-2">
        <label className="text-[#4a3728] text-sm font-bold uppercase tracking-wider pl-1 font-display">
          {t('newSecretKey')}
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7241]">
            key
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('keyPlaceholder')}
            required
            minLength={8}
            className="w-full bg-white/50 border-2 border-[#d9cdab] rounded-xl py-4 pl-12 pr-4 text-[#4a3728] placeholder-[#a69671] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-sans"
          />
        </div>
      </div>

      {/* Confirm field */}
      <div className="flex flex-col gap-2">
        <label className="text-[#4a3728] text-sm font-bold uppercase tracking-wider pl-1 font-display">
          {t('confirmSecretKey')}
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7241]">
            enhanced_encryptions
          </span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t('confirmPlaceholder')}
            required
            className="w-full bg-white/50 border-2 border-[#d9cdab] rounded-xl py-4 pl-12 pr-4 text-[#4a3728] placeholder-[#a69671] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-sans"
          />
        </div>
      </div>

      {/* Status message */}
      {message && status === 'error' && (
        <p className="text-sm font-medium px-4 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 font-display italic">
          {message}
        </p>
      )}

      {/* Submit */}
      <div className="flex justify-center pt-8 pb-10">
        <button
          className="wax-seal group relative flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white border-4 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={status === 'loading'}
        >
          <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-90"></div>
          <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
            {status === 'loading' ? 'hourglass_empty' : 'lock_reset'}
          </span>
          {/* Button Label */}
          <div className="absolute -bottom-8 whitespace-nowrap text-[#4a3728] font-bold text-sm tracking-[0.2em] uppercase font-display">
            {status === 'loading' ? t('resetting') : t('updateKey')}
          </div>
        </button>
      </div>

      <div className="mt-8 w-full text-center border-t border-[#d9cdab] pt-6">
        <Link
          className="inline-block text-primary font-bold magical-glow hover:scale-105 transition-transform font-display"
          href="/login"
        >
          {t('returnToPortal')}
        </Link>
      </div>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword')
  return (
    <AuthLayout title={t('title')} description={t('description')} sealText={t('sealText')}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-40">
            <span className="material-symbols-outlined text-4xl animate-spin text-[#8a7241]">
              progress_activity
            </span>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
