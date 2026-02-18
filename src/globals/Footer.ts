import type { GlobalConfig } from 'payload'


import { link } from '@/fields/link'
import { CustomTranslationsKeys } from '@/utilities/translations'
import { TFunction } from 'node_modules/@payloadcms/translations/dist/types'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: ({ t: defaultT }) => {
    const t = defaultT as TFunction<CustomTranslationsKeys>
    return t('general:footer:label')
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
