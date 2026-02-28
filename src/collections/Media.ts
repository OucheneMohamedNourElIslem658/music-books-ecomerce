import type { CollectionConfig } from 'payload'

import { CustomTranslationsKeys } from '@/utilities/translations'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { TFunction } from 'node_modules/@payloadcms/translations/dist/types'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  admin: {
    group: 'Content',
  },
  slug: 'media',
  labels: {
    plural: ({ t: defaultT }) => {
      const t = defaultT as TFunction<CustomTranslationsKeys>
      return t('general:media:label:plural')
    },
    singular: ({ t: defaultT }) => {
      const t = defaultT as TFunction<CustomTranslationsKeys>
      return t('general:media:label:singular')
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
  },
}
