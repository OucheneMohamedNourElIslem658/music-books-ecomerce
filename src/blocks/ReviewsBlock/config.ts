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
      localized: true,
    },
  ],
}