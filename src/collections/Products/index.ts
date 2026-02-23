import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { ReviewsBlock } from '@/blocks/ReviewsBlock/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { DefaultDocumentIDType, slugField, Where } from 'payload'

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: ['title', 'enableVariants', '_status', 'variants.variants'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    ...defaultCollection?.defaultPopulate,
    title: true,
    slug: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    priceInUSD: true,
    inventory: true,
    meta: true,
  },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'description',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: false,
            },
            {
              label: 'Song',
              name: 'song',
              type: 'upload',
              relationTo: 'media',
              filterOptions: {
                mimeType: {
                  contains: 'audio',
                },
              },
            },
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'variantOption',
                  type: 'relationship',
                  relationTo: 'variantOptions',
                  admin: {
                    condition: (data) => {
                      return data?.enableVariants === true && data?.variantTypes?.length > 0
                    },
                  },
                  filterOptions: ({ data }) => {
                    if (data?.enableVariants && data?.variantTypes?.length) {
                      const variantTypeIDs = data.variantTypes.map((item: any) => {
                        if (typeof item === 'object' && item?.id) {
                          return item.id
                        }
                        return item
                      }) as DefaultDocumentIDType[]

                      if (variantTypeIDs.length === 0)
                        return {
                          variantType: {
                            in: [],
                          },
                        }

                      const query: Where = {
                        variantType: {
                          in: variantTypeIDs,
                        },
                      }

                      return query
                    }

                    return {
                      variantType: {
                        in: [],
                      },
                    }
                  },
                },
              ],
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, ReviewsBlock],
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            ...defaultCollection.fields,
            {
              name: 'relatedProducts',
              type: 'relationship',
              filterOptions: ({ id }) => {
                if (id) {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                }
                return {
                  id: {
                    exists: true,
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
            {
              name: 'popularReviews',
              type: 'relationship',
              relationTo: 'reviews',
              hasMany: true,
              filterOptions: ({ id }): Where => {
                if (!id) return { status: { equals: 'approved' } }
                return {
                  and: [
                    { product: { equals: id } },
                    { status: { equals: 'approved' } },
                  ],
                }
              },
            }
          ],
          label: 'Product Details',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'categories',
    },

    // Virtual fields — never stored in DB, computed on read
    {
      name: 'reviewCount',
      type: 'number',
      virtual: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Total number of approved reviews',
      },
      hooks: {
        afterRead: [
          async ({ req, data }) => {
            if (!data?.id) return 0
            try {
              const result = await req.payload.find({
                collection: 'reviews',
                where: {
                  and: [
                    { product: { equals: data.id } },
                    { status: { equals: 'approved' } },
                  ],
                },
                pagination: false,
                depth: 0,
              })
              return result.totalDocs
            } catch {
              return 0
            }
          },
        ],
      },
    },
    {
      name: 'averageRating',
      type: 'number',
      virtual: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Average rating out of 5',
      },
      hooks: {
        afterRead: [
          async ({ req, data }) => {
            if (!data?.id) return null
            try {
              const result = await req.payload.find({
                collection: 'reviews',
                where: {
                  and: [
                    { product: { equals: data.id } },
                    { status: { equals: 'approved' } },
                  ],
                },
                pagination: false,
                depth: 0,
              })

              const reviews = result.docs
              if (!reviews.length) return null

              const average =
                reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length

              return Math.round(average * 10) / 10
            } catch {
              return null
            }
          },
        ],
      },
    },
    slugField(),
  ],
})