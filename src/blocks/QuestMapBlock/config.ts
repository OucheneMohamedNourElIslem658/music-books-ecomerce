import type { Block } from 'payload'

export const QuestMapBlock: Block = {
    slug: 'questMap',
    labels: { singular: 'Quest Map', plural: 'Quest Map Blocks' },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Section Title',
        },
        {
            name: 'items',
            type: 'array',
            label: 'Timeline Items',
            minRows: 1,
            fields: [
                {
                    name: 'icon',
                    type: 'select',
                    label: 'Icon',
                    defaultValue: 'music',
                    options: [
                        { label: '🎵 Music', value: 'music' },
                        { label: '📋 Clipboard', value: 'clipboard' },
                        { label: '✨ Sparkles', value: 'sparkles' },
                        { label: '⭐ Star', value: 'star' },
                        { label: '📖 Book', value: 'book' },
                        { label: '🗺️ Map', value: 'map' },
                        { label: '🎯 Target', value: 'target' },
                        { label: '🏆 Trophy', value: 'trophy' },
                    ],
                },
                {
                    name: 'isActive',
                    type: 'checkbox',
                    label: 'Active (highlighted in primary color)',
                    defaultValue: false,
                },
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                    label: 'Title',
                },
                {
                    name: 'year',
                    type: 'text',
                    required: true,
                    label: 'Year',
                    admin: { placeholder: '2024' },
                },
                {
                    name: 'tag',
                    type: 'text',
                    required: true,
                    label: 'Tag',
                    admin: { placeholder: 'THE PRESENT' },
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                },
            ],
        },
    ],
}