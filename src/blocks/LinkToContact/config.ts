import { link } from '@/fields/link'
import type { Block } from 'payload'

export const LinkToContactBlock: Block = {
    slug: 'linkToContact',
    labels: { singular: 'Link To Contact', plural: 'Link To Contact Blocks' },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Title',
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Description',
        },
        {
            name: 'inputPlaceholder',
            type: 'text',
            label: 'Input Placeholder',
            defaultValue: 'Enter your email address...',
        },
        link({
            appearances: ['default', 'outline'],
        }),
    ],
}
