import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import React from 'react'
import { AuthLayout } from '@/components/layout/AuthLayout'

import { getTranslations } from 'next-intl/server'

export default async function ForgotPasswordPage() {
  const t = await getTranslations('auth.forgotPassword')

  return (
    <AuthLayout title={t('title')} description={t('description')} sealText={t('sealText')}>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.forgotPassword')

  return {
    description: t('metadata.description'),
    openGraph: mergeOpenGraph({
      title: t('metadata.title'),
      url: '/forgot-password',
    }),
    title: t('metadata.title'),
  }
}
