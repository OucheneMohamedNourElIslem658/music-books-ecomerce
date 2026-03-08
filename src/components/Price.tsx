'use client'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import React, { useMemo } from 'react'

type BaseProps = {
  className?: string
  as?: 'span' | 'p'
}

type PriceFixed = BaseProps & {
  amount: number
  currencyCode?: string
  highestAmount?: never
  lowestAmount?: never
}

type PriceRange = BaseProps & {
  amount?: never
  currencyCode?: string
  highestAmount: number
  lowestAmount: number
}

type Props = PriceFixed | PriceRange

export const Price: React.FC<Props & React.ComponentProps<'p'>> = ({
  amount,
  className,
  highestAmount,
  lowestAmount,
  currencyCode: currencyCodeFromProps,
  as: Element = 'p',
}) => {
  const { formatCurrency, supportedCurrencies } = useCurrency()

  const currency = useMemo(
    () => supportedCurrencies.find((c) => c.code === currencyCodeFromProps),
    [currencyCodeFromProps, supportedCurrencies],
  )

  const fmt = (value: number) => formatCurrency(value, { currency })

  // Fixed price
  if (typeof amount === 'number') {
    return (
      <Element className={className} suppressHydrationWarning>
        {fmt(amount)}
      </Element>
    )
  }

  // Range price
  if (typeof lowestAmount === 'number') {
    const label =
      highestAmount && highestAmount !== lowestAmount
        ? `${fmt(lowestAmount)} – ${fmt(highestAmount)}`
        : fmt(lowestAmount)

    return (
      <Element className={className} suppressHydrationWarning>
        {label}
      </Element>
    )
  }

  return null
}