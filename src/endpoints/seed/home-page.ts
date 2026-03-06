import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type HomePageArgs = {
  heroImage: Media
  book1: Media
  book2: Media
  book3: Media
  authorImage: Media
  product1Id: number | string
  product2Id: number | string
  product3Id: number | string
}

const makeRichText = (text: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const makeHeading = (text: string, tag: 'h1' | 'h2' | 'h3' = 'h1') => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'heading' as const,
        tag,
        children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

export const homePageData = ({
  heroImage,
  book1,
  book2,
  book3,
  authorImage,
  product1Id,
  product2Id,
  product3Id,
}: HomePageArgs): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'home',
  _status: 'published',
  title: 'Home',
  hero: {
    type: 'highImpact',
    media: heroImage,
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h1',
            children: [
              { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Step into the Song: ', version: 1 },
              { type: 'text', detail: 0, format: 2, mode: 'normal', style: '', text: 'The Midnight Symphony', version: 1 },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Experience a magical journey where every chapter has its own melody. Discover the latest musical masterpiece from the world\'s most whimsical storyteller.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'Explore the Book',
          url: '/shop',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'About the Author',
          url: '/author',
        },
      },
    ],
  },
  layout: [
    // 1. Popular Products (The Enchanted Library)
    {
      blockType: 'threeItemGrid',
      products: [product1Id, product2Id, product3Id],
    },

    // 2. Author Overview (Bio section)
    {
      blockType: 'authorOverview',
      eyebrow: 'The Author\'s Manuscript',
      title: 'Meet the Composer-Author',
      quote: 'A life spent between inkwells and instruments, weaving melodies into the very fibers of the written word. Each story is composed twice: once in words, and once in notes.',
      image: authorImage,
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Read the Letter',
            url: '/author',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Hear My Theme',
            url: '/shop',
          },
        },
      ],
    },

    // 3. Author Highlights (Harmonic Forge / features)
    {
      blockType: 'authorHighlights',
      title: 'The Harmonic Forge',
      icon: 'music',
      items: [
        {
          icon: 'pen',
          title: 'Ink & Inspiration',
          description: 'Every chapter begins with a melody. I write while listening to the specific motifs of my characters.',
        },
        {
          icon: 'piano',
          title: 'The Lute\'s Lore',
          description: 'I use antique instruments to find the authentic voice of a fantasy world\'s folk music.',
        },
        {
          icon: 'mic',
          title: 'Echoes of Magic',
          description: 'Vocal layers and choral arrangements provide the spiritual depth of the magical spells cast in-text.',
        },
      ],
    },

    // 4. Newsletter / CTA
    {
      blockType: 'linkToContact',
      title: 'Never Miss a Note',
      description: 'Join the secret mailing list to receive early previews of upcoming scores, exclusive concept art, and magical updates. Join 15,000+ Seekers of Magic.',
      inputPlaceholder: 'Your email address',
      link: {
        type: 'custom',
        appearance: 'default',
        label: 'Join the Adventure',
        url: '/contact',
      },
    },
  ],
  meta: {
    title: 'Melody & Myth | Whimsical Musical Adventures',
    description: 'Experience a magical journey where every chapter has its own melody. Musical books for the young and young at heart.',
    image: heroImage,
  },
})
