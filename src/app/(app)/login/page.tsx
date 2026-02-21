import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { LoginForm } from '@/components/forms/LoginForm'
import { redirect } from 'next/navigation'
import { LogInIcon } from 'lucide-react'

export default async function Login() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <RenderParams />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <LogInIcon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">Log in</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Welcome back. Sign in to your account.
                </CardDescription>
              </div>
            </div>
            <Separator className="mt-4" />
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {/* <p className="text-sm text-muted-foreground">
              To create your account,{' '}
              <Link
                href="/create-account"
                className="text-primary hover:no-underline underline-offset-4 underline"
              >
                sign up and create a new account
              </Link>
              .
            </p> */}

            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
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