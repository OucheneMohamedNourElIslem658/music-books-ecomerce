import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { redirect } from 'next/navigation'
import { UserPlusIcon } from 'lucide-react'

export default async function CreateAccount() {
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
                <UserPlusIcon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Create Account
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign up to start shopping and track your orders.
                </CardDescription>
              </div>
            </div>
            <Separator className="mt-4" />
          </CardHeader>

          <CardContent>
            <CreateAccountForm />
          </CardContent>
        </Card>
      </div>
    </div>
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