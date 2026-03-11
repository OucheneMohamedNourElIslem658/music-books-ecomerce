import type { Metadata } from 'next'

import { LoginForm } from '@/components/forms/LoginForm'
import { RenderParams } from '@/components/RenderParams'
import { redirect } from '@/i18n/navigation'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { AuthLayout } from '@/components/layout/AuthLayout'

import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Login({ params }: Props) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { locale } = await params
  const t = await getTranslations('auth.login')

  if (user) {
    redirect({
      href: `/account?warning=${encodeURIComponent(t('alreadyLoggedIn'))}`,
      locale,
    })
  }

  return (
    <AuthLayout title={t('title')} description={t('description')}>
      <RenderParams />
      <LoginForm />
    </AuthLayout>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.login')

  return {
    description: t('metadata.description'),
    openGraph: {
      title: t('metadata.title'),
      url: '/login',
    },
    title: t('metadata.title'),
  }
}
