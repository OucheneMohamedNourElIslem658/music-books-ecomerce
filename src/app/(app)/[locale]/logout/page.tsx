import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'

import { LogoutPage } from './LogoutPage'

import { getTranslations } from 'next-intl/server'

export default async function Logout() {
  return <LogoutPage />
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.logout')

  return {
    description: t('metadata.description'),
    openGraph: mergeOpenGraph({
      title: t('metadata.title'),
      url: '/logout',
    }),
    title: t('metadata.title'),
  }
}
