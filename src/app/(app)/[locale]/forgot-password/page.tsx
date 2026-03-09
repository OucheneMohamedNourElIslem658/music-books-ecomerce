import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import React from 'react'
import { AuthLayout } from '@/components/layout/AuthLayout'

export default async function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="The Lost Key"
      description="Tell us your chronicler email, and we shall send a messenger with a new key."
      sealText="Messenger's Seal"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}

export const metadata: Metadata = {
  description: 'Enter your email address to recover your password.',
  openGraph: mergeOpenGraph({
    title: 'Forgot Password',
    url: '/forgot-password',
  }),
  title: 'Forgot Password',
}
