import type { Metadata } from 'next'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { RenderParams } from '@/components/RenderParams'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { redirect } from '@/i18n/navigation'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { UserPlusIcon } from 'lucide-react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

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