import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
    TextStateFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const FeatureShowcaseBlock: Block = {
    slug: 'featureShowcase',
    labels: { singular: 'Feature Showcase', plural: 'Feature Showcase Blocks' },
    fields: [
        {
            name: 'reverse',
            type: 'checkbox',
            label: 'Reverse Layout (images on left, text on right)',
            defaultValue: false,
        },
        {
            name: 'content',
            type: 'richText',
            label: 'Content',
            required: true,
            localized: true,
            editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    TextStateFeature({
                        state: {
                            color: {
                                primary: { label: 'Primary', css: { color: '#154eec' } },
                            },
                        },
                    }),
                ],
            }),
        },
        {
            name: 'images',
            type: 'array',
            label: 'Images (2 or 3 recommended)',
            minRows: 2,
            maxRows: 3,
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                    label: 'Image',
                },
                {
                    name: 'alt',
                    type: 'text',
                    label: 'Alt Text',
                    localized: true,
                },
            ],
        },
    ],
}