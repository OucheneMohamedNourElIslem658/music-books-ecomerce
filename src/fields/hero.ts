import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  TextStateFeature
} from '@payloadcms/richtext-lexical'

import { linkGroup } from './linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  admin: {
    condition: (data, siblingData) => siblingData?.template === 'author',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            TextStateFeature({
              state: {
                color: {
                  // custom primary
                  primary: { label: 'Blue', css: { color: '#154eec' } },
                },
              },
            }),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
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
  label: false,
}
