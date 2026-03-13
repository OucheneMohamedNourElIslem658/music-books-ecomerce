'use client'
import { useTranslations } from 'next-intl'
import * as React from 'react'

export const Error: React.FC = () => {
  const t = useTranslations('blocks.form')
  return <div className="mt-2 text-red-500 text-sm">{t('fieldRequired')}</div>
}
