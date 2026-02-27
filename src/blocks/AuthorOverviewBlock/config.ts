import { linkGroup } from '@/fields/linkGroup'
import type { Block } from 'payload'

export const AuthorOverviewBlock: Block = {
    slug: 'authorOverview',
    labels: { singular: 'Author Overview', plural: 'Author Overview Blocks' },
    fields: [
        {
            name: 'eyebrow',
            type: 'text',
            label: 'Eyebrow Text',
            admin: {
                description: 'Small label above the title e.g. "THE AUTHOR\'S MANUSCRIPT"',
            },
        },
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Title',
        },
        {
            name: 'quote',
            type: 'textarea',
            label: 'Quote',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: 'Author Image',
        },
        linkGroup({
            overrides: {
                maxRows: 2,
            },
        }),
    ],
}