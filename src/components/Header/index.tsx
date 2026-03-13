import { getCachedGlobal } from '@/utilities/getGlobals'

import { LocaleType } from '@/types/locale'
import { HeaderClient } from './index.client'
import './index.css'

interface HeaderProps {
  locale: LocaleType
}

export async function Header({ locale }: HeaderProps) {
  const header = await getCachedGlobal('header', locale, 1)()

  return <HeaderClient header={header} />
}
