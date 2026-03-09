import type { Metadata } from 'next'

import { LoginForm } from '@/components/forms/LoginForm'
import { RenderParams } from '@/components/RenderParams'
import { redirect } from '@/i18n/navigation'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { AuthLayout } from '@/components/layout/AuthLayout'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Login({ params }: Props) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { locale } = await params

  if (user) {
    redirect({
      href: `/account?warning=${encodeURIComponent('You are already logged in.')}`,
      locale,
    })
  }

  return (
    <AuthLayout
      title="The Gatekeeper's Portal"
      description="Whisper your credentials to enter the ancient library of melodies."
    >
      <RenderParams />
      <LoginForm />
    </AuthLayout>
  )
}

export const metadata: Metadata = {
  description: 'Login or create an account to get started.',
  openGraph: {
    title: 'Login',
    url: '/login',
  },
  title: 'Login',
}
