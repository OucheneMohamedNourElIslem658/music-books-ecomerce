import type { Block } from 'payload'

export const AuthorHighlightsBlock: Block = {
    slug: 'authorHighlights',
    labels: { singular: 'Author Highlights', plural: 'Author Highlights Blocks' },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Section Title',
        },
        {
            name: 'icon',
            type: 'select',
            label: 'Section Icon',
            defaultValue: 'settings',
            options: [
                { label: '⚙️ Settings', value: 'settings' },
                { label: '🎵 Music', value: 'music' },
                { label: '📖 Book', value: 'book' },
                { label: '⭐ Star', value: 'star' },
                { label: '🗺️ Map', value: 'map' },
                { label: '🎯 Target', value: 'target' },
            ],
        },
        {
            name: 'items',
            type: 'array',
            label: 'Highlight Cards',
            minRows: 1,
            maxRows: 6,
            fields: [
                {
                    name: 'icon',
                    type: 'select',
                    label: 'Card Icon',
                    defaultValue: 'pen',
                    options: [
                        { label: '✏️ Pen', value: 'pen' },
                        { label: '🎹 Piano', value: 'piano' },
                        { label: '🎤 Mic', value: 'mic' },
                        { label: '🎵 Music', value: 'music' },
                        { label: '📖 Book', value: 'book' },
                        { label: '⭐ Star', value: 'star' },
                        { label: '🔥 Fire', value: 'fire' },
                        { label: '💡 Lightbulb', value: 'lightbulb' },
                        { label: '🎯 Target', value: 'target' },
                        { label: '🏆 Trophy', value: 'trophy' },
                    ],
                },
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                    label: 'Card Title',
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Card Description',
                },
            ],
        },
    ],
}