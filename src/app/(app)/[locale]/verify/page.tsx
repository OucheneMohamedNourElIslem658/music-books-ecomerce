'use client'

import { AuthLayout } from '@/components/layout/AuthLayout'
import { Link } from '@/i18n/navigation'
import { Loader2, MailCheck, ShieldX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'

function VerifyEmailInner() {
  const t = useTranslations('auth.verify')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const called = useRef(false)

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (called.current) return
    called.current = true

    if (!token) {
      setStatus('error')
      setMessage(t('invalidToken'))
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/verify/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      priority: 'high',
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus('success')
          setMessage(t('verified'))
          setTimeout(() => router.push('/login'), 3000)
        } else {
          const data = await res.json().catch(() => ({}))
          setStatus('error')
          setMessage(data?.errors?.[0]?.message ?? t('expired'))
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage(t('auth.resetPassword.genericError'))
      })
  }, [token, router, t])

  return (
    <div className="w-full space-y-8">
      {/* Icon */}
      <div className="flex justify-center">
        <div
          className={`
          size-20 rounded-full flex items-center justify-center border-2 transition-all duration-500
          ${status === 'loading' ? 'border-primary/30 bg-primary/10' : ''}
          ${status === 'success' ? 'border-primary/40 bg-primary/10' : ''}
          ${status === 'error' ? 'border-destructive/40 bg-destructive/10' : ''}
        `}
        >
          {status === 'loading' && <Loader2 className="size-9 text-primary animate-spin" />}
          {status === 'success' && <MailCheck className="size-9 text-primary" />}
          {status === 'error' && <ShieldX className="size-9 text-destructive" />}
        </div>
      </div>

      {/* Status text */}
      <div className="text-center space-y-2">
        <p
          className={`text-xl font-bold font-display ${status === 'error' ? 'text-destructive' : 'text-[#4a3728]'
            }`}
        >
          {status === 'loading' && t('consultingArchives')}
          {status === 'success' && t('sealConfirmed')}
          {status === 'error' && t('sealRejected')}
        </p>
        <p className="text-sm text-[#6d5b4b] italic font-display leading-relaxed">
          {message || t('waiting')}
        </p>
      </div>

      {/* Loading dots */}
      {status === 'loading' && (
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="size-1.5 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      )}

      {/* Success progress bar */}
      {status === 'success' && (
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7241] text-center font-display">
            {t('redirecting')}
          </p>
          <div className="h-1 rounded-full bg-[#d9cdab] overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-[grow_3s_linear_forwards]" />
          </div>
        </div>
      )}

      {/* Error actions */}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 pt-4 border-t border-[#d9cdab]">
          <Link
            href="/login"
            className="wax-seal group relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white border-4 border-white/20"
          >
            <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-90" />
            <MailCheck className="size-7 group-hover:scale-110 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="text-sm font-bold text-primary magical-glow hover:scale-105 transition-transform font-display"
          >
            {t('returnToPortal')}
          </Link>

        </div>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  const t = useTranslations('auth.verify')
  return (
    <AuthLayout title={t('title')} description={t('description')}>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-[#8a7241]" />
          </div>
        }
      >
        <VerifyEmailInner />
      </Suspense>
    </AuthLayout>
  )
}