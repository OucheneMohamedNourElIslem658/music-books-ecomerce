import type { Metadata } from 'next'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { RenderParams } from '@/components/RenderParams'
import { redirect } from '@/i18n/navigation'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { AuthLayout } from '@/components/layout/AuthLayout'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function CreateAccount(
  { params }: Props
) {
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
      title="Enlist in the Guild"
      description="Join our fellowship of readers and melodiists to unlock the full library of wonders."
      sealText="Guild Seal"
    >
      <RenderParams />
      <CreateAccountForm />
    </AuthLayout>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
  title: 'Account',
}
