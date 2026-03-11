
type Props = {
  date: string
  locale?: string
  format?: Intl.DateTimeFormatOptions
}

export const formatDateTime = ({ date, locale, format: formatOptions }: Props): string => {
  if (!date) return ''

  return new Intl.DateTimeFormat(locale, formatOptions ?? {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}