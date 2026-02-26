import { linkGroup } from '@/fields/linkGroup'
import type { Block } from 'payload'

export const LinkToPageBlock: Block = {
    slug: 'linkToPageBlock',
    labels: { singular: 'Link To Page', plural: 'Link To Page Blocks' },
    fields: [
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: 'Portrait Image',
        },
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
        linkGroup({
            overrides: {
                maxRows: 2,
            },
        }),
    ],
}