import { CustomTranslationsKeys } from '@/utilities/translations'
import { TFunction } from 'node_modules/@payloadcms/translations/dist/types'
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    plural: ({ t: defaultT }) => {
      const t = defaultT as TFunction<CustomTranslationsKeys>
      return t('general:categories:label:plural')
    },
    singular: ({ t: defaultT }) => {
      const t = defaultT as TFunction<CustomTranslationsKeys>
      return t('general:categories:label:singular')
    },
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
