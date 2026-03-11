import { link } from '@/fields/link'
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    // Brand blurb shown in footer
    {
      name: 'tagline',
      type: 'textarea',
      label: 'Brand Tagline',
      admin: {
        description: 'Short description shown under the logo.',
      },
    },

    // Dynamic link groups
    {
      name: 'groups',
      type: 'array',
      label: 'Link Groups',
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Group',
        plural: 'Groups',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          label: 'Group Label',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          minRows: 1,
          maxRows: 8,
          fields: [
            link({ appearances: false }),
          ],
        },
      ],
    },

    // Social links
    {
      name: 'socials',
      type: 'array',
      label: 'Social Links',
      maxRows: 8,
      labels: {
        singular: 'Social',
        plural: 'Socials',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Discord', value: 'discord' },
            { label: 'Pinterest', value: 'pinterest' },
            { label: 'LinkedIn', value: 'linkedin' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },

    // Newsletter
    {
      name: 'newsletter',
      type: 'group',
      label: 'Newsletter',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show newsletter signup',
          defaultValue: true,
        },
        {
          name: 'heading',
          type: 'text',
          localized: true,
          label: 'Heading',
          defaultValue: 'Join the Mythos',
        },
        {
          name: 'subheading',
          type: 'text',
          localized: true,
          label: 'Subheading',
          defaultValue: 'Receive lore, releases and rare scrolls directly to your sanctum.',
        },
      ],
    },

    // Bottom bar
    {
      name: 'copyright',
      type: 'text',
      localized: true,
      label: 'Copyright text',
      defaultValue: '© Melody & Myth. All rights reserved.',
    },
  ],
}