import type { Field } from 'payload'

import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  StrikethroughFeature,
  TextStateFeature,
  UnderlineFeature
} from '@payloadcms/richtext-lexical'

import { linkGroup } from './linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  label: false,
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
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Author Header',
          value: 'authorHeader',
        },
      ],
      required: true,
    },

    // ─── Normal / Blog hero fields ────────────────────────────────────────────
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      label: false,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type !== 'authorHeader' && siblingData?.type !== 'none',
      },
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
                  primary: { label: 'Blue', css: { color: '#154eec' } },
                },
              },
            }),
          ]
        },
      }),
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'hasSong',
      type: 'checkbox',
      label: 'Add Song',
      defaultValue: false,
      admin: {
        description: 'Toggle to attach a song to this content',
        // condition: (_, siblingData) => siblingData?.type !== 'authorHeader',
      },
    },
    {
      name: 'songGroup',
      type: 'group',
      label: 'Song',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.hasSong),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Song Title',
          localized: true,
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

    // ─── Author Header fields (mirrors AuthorOverviewBlock schema) ────────────
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
      localized: true,
      admin: {
        description: "Small label above the title e.g. \"THE AUTHOR'S MANUSCRIPT\"",
        // condition: (_, siblingData) => siblingData?.type === 'authorHeader',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'authorHeader',
      },
    },
    {
      name: 'quote',
      type: 'richText',
      localized: true,
      label: 'Quote',
      editor: lexicalEditor({
        features: [
          FixedToolbarFeature(),
          BoldFeature(),
          ItalicFeature(),
          LinkFeature(),
          UnderlineFeature(),
          StrikethroughFeature()
        ],
      }),
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'authorHeader',
      },
    },
  ],
}