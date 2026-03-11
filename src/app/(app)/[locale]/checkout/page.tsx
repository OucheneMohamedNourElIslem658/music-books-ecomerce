import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React, { Fragment } from 'react'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'

import { getTranslations } from 'next-intl/server'

export default async function Checkout() {
  const t = await getTranslations('checkout')

  return (
    <div className="container min-h-[90vh] flex">
      {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
        <div>
          <Fragment>
            {t('stripeError')}{' '}
            <a
              href="https://dashboard.stripe.com/test/apikeys"
              rel="noopener noreferrer"
              target="_blank"
            >
              obtain your Stripe API Keys
            </a>
            {' then set them as environment variables. See the '}
            <a
              href="https://github.com/payloadcms/payload/blob/main/templates/ecommerce/README.md#stripe"
              rel="noopener noreferrer"
              target="_blank"
            >
              README
            </a>
            {' for more details.'}
          </Fragment>
        </div>
      )}

      <h1 className="sr-only">{t('title')}</h1>

      <CheckoutPage />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('checkout')

  return {
    description: t('metadata.description'),
    openGraph: mergeOpenGraph({
      title: t('metadata.title'),
      url: '/checkout',
    }),
    title: t('metadata.title'),
  }
}
