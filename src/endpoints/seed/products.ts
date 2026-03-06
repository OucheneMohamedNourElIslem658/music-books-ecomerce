import type { Category, Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

// ─── Book 1: Crescendo of the Clouds ─────────────────────────────────────────
export const book1Data = ({
  coverImage,
  categories,
  relatedProducts,
}: {
  coverImage: Media
  categories: any[]
  relatedProducts: any[]
}): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'Crescendo of the Clouds',
  slug: 'crescendo-of-the-clouds',
  _status: 'published',
  description: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'A soaring adventure through floating islands where melodies carry you higher than the clouds themselves. Each chapter is accompanied by an orchestral score that evolves with the story.', version: 1 }],
          direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1,
        },
      ],
      direction: 'ltr', format: '', indent: 0, version: 1,
    },
  },
  gallery: [{ image: coverImage }],
  priceInUSDEnabled: true,
  priceInUSD: 2400,
  categories,
  relatedProducts,
  layout: [],
  meta: {
    title: 'Crescendo of the Clouds | Melody & Myth',
    description: 'A soaring adventure through floating islands. Musical book with orchestral score.',
    image: coverImage,
  },
})

// ─── Book 2: The Coral Cantata ────────────────────────────────────────────────
export const book2Data = ({
  coverImage,
  categories,
  relatedProducts,
}: {
  coverImage: Media
  categories: any[]
  relatedProducts: any[]
}): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'The Coral Cantata',
  slug: 'the-coral-cantata',
  _status: 'published',
  description: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Deep-sea rhythms and hidden treasures await in this underwater musical epic. The story unfolds in an underwater castle made of coral, where ancient cantatas hold the secrets of the ocean.', version: 1 }],
          direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1,
        },
      ],
      direction: 'ltr', format: '', indent: 0, version: 1,
    },
  },
  gallery: [{ image: coverImage }],
  priceInUSDEnabled: true,
  priceInUSD: 2200,
  categories,
  relatedProducts,
  layout: [],
  meta: {
    title: 'The Coral Cantata | Melody & Myth',
    description: 'Deep-sea rhythms and hidden treasures. A musical underwater adventure.',
    image: coverImage,
  },
})

// ─── Book 3: Echoes of the Gear ───────────────────────────────────────────────
export const book3Data = ({
  coverImage,
  categories,
  relatedProducts,
}: {
  coverImage: Media
  categories: any[]
  relatedProducts: any[]
}): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'Echoes of the Gear',
  slug: 'echoes-of-the-gear',
  _status: 'published',
  description: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Steampunk melodies in a forgotten city where a mechanical bird made of music notes leads the way. A thrilling blend of industrial rhythm and fantasy narrative.', version: 1 }],
          direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1,
        },
      ],
      direction: 'ltr', format: '', indent: 0, version: 1,
    },
  },
  gallery: [{ image: coverImage }],
  priceInUSDEnabled: true,
  priceInUSD: 2600,
  categories,
  relatedProducts,
  layout: [],
  meta: {
    title: 'Echoes of the Gear | Melody & Myth',
    description: 'Steampunk melodies in a forgotten city. A musical book with original compositions.',
    image: coverImage,
  },
})
