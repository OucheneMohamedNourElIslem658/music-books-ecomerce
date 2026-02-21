import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import { KeyRoundIcon } from 'lucide-react'
import React from 'react'

export default async function ForgotPasswordPage() {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <KeyRoundIcon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Forgot Password
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enter your email to receive a reset link.
                </CardDescription>
              </div>
            </div>
            <Separator className="mt-4" />
          </CardHeader>

          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
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