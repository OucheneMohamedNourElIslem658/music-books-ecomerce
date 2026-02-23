import type { Block } from 'payload'

export const ReviewsBlock: Block = {
  slug: 'reviewsBlock',
  interfaceName: 'ReviewsBlock',
  labels: {
    singular: 'Reviews Block',
    plural: 'Reviews Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Customer Reviews',
    },
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
  ],
}