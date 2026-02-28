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
            localized: true,
            admin: {
                description: 'Small label above the title e.g. "THE AUTHOR\'S MANUSCRIPT"',
            },
        },
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Title',
            localized: true,
        },
        {
            name: 'quote',
            type: 'textarea',
            label: 'Quote',
            localized: true,
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