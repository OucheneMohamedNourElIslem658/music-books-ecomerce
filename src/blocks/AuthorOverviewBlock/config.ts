import { linkGroup } from '@/fields/linkGroup'
import { BoldFeature, FixedToolbarFeature, ItalicFeature, lexicalEditor, LinkFeature, StrikethroughFeature, UnderlineFeature } from '@payloadcms/richtext-lexical'
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
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: 'Author Image',
        },
        {
            name: 'hasSong',
            type: 'checkbox',
            label: 'Attach a Song',
            defaultValue: false,
            admin: {
                description: 'Toggle to attach a song to this block',
            },
        },
        {
            name: 'songGroup',
            type: 'group',
            label: 'Song Details',
            admin: {
                condition: (_, siblingData) => siblingData.hasSong,
            },
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Song Title',
                    localized: true,
                },
                {
                    name: 'song',
                    type: 'upload',
                    relationTo: 'media',
                    label: 'Audio File',
                    filterOptions: {
                        mimeType: {
                            contains: 'audio',
                        },
                    },
                },
            ],
        },
        linkGroup({
            overrides: {
                maxRows: 2,
            },
        }),
    ],
}