import type { Metadata } from 'next'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { RenderParams } from '@/components/RenderParams'
import { redirect } from '@/i18n/navigation'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { AuthLayout } from '@/components/layout/AuthLayout'

import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function CreateAccount({ params }: Props) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { locale } = await params
  const t = await getTranslations('auth.createAccount')

  if (user) {
    redirect({
      href: `/account?warning=${encodeURIComponent(t('alreadyLoggedIn' as any))}`, // assuming we add this if not present or use a common one
      locale,
    })
  }

  return (
    <AuthLayout title={t('title')} description={t('description')} sealText={t('sealText')}>
      <RenderParams />
      <CreateAccountForm />
    </AuthLayout>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.createAccount')

  return {
    description: t('metadata.description'),
    openGraph: mergeOpenGraph({
      title: t('metadata.title'),
      url: '/account',
    }),
    title: t('metadata.title'),
  }
}
