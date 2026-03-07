import type { Block } from 'payload'

export const PopularProducts: Block = {
  slug: 'threeItemGrid',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
    },
    {
      name: 'products',
      type: 'relationship',
      admin: {
        isSortable: true,
      },
      hasMany: true,
      label: 'Products to show',
      maxRows: 8,
      minRows: 1,
      relationTo: 'products',
    },
  ],
  interfaceName: 'PopularProductsBlock',
  labels: {
    plural: 'Popular Products',
    singular: 'Popular Product',
  },
}
