import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { TFunction } from '@payloadcms/translations'
import { CustomTranslationsKeys } from '@/utilities/translations'

export const Header: GlobalConfig = {
  slug: 'header',
  label: ({ t: defaultT }) => {
    const t = defaultT as TFunction<CustomTranslationsKeys>
    return t('general:header:label')
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
}
