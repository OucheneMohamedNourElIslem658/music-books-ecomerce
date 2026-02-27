import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { AuthorHighlightsBlock } from '@/blocks/AuthorHighlights/config'
import { AuthorOverviewBlock } from '@/blocks/AuthorOverviewBlock/config'
import { Banner } from '@/blocks/Banner/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Carousel } from '@/blocks/Carousel/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { LinkToContactBlock } from '@/blocks/LinkToContact/config'
import { LinkToPageBlock } from '@/blocks/LinkToPage/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { PopularProducts } from '@/blocks/PopularProducts/config'
import { QuestMapBlock } from '@/blocks/QuestMapBlock/config'
import { hero } from '@/fields/hero'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CustomTranslationsKeys } from '@/utilities/translations'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { TFunction } from 'node_modules/@payloadcms/translations/dist/types'
import { slugField } from 'payload'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    plural: ({ t: defaultT }) => {
      const t = defaultT as TFunction<CustomTranslationsKeys>
      return t('general:pages:label:plural')
    },
    singular: ({ t: defaultT }) => {
      const t = defaultT as TFunction<CustomTranslationsKeys>
      return t('general:pages:label:singular')
    },
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOnly,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                Carousel,
                PopularProducts,
                Banner,
                FormBlock,
                LinkToPageBlock,
                AuthorOverviewBlock,
                QuestMapBlock,
                AuthorHighlightsBlock,
                LinkToContactBlock
              ],
              required: true,
            },
            {
              name: 'hasSong',
              type: 'checkbox',
              label: 'Add Song',
              defaultValue: false,
              admin: {
                description: 'Toggle to attach a song to this content',
              },
            },
            {
              name: 'songGroup',
              type: 'group',
              label: 'Song',
              admin: {
                condition: (data, siblingData) => Boolean(siblingData?.hasSong),
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Song Title',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Song Description',
                },
                {
                  label: 'Song',
                  name: 'song',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: {
                    mimeType: {
                      contains: 'audio',
                    },
                  },
                },
              ],
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
}
