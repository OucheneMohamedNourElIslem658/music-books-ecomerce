import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type AuthorPageArgs = {
  authorFullImage: Media
}

export const authorPageData = ({
  authorFullImage,
}: AuthorPageArgs): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'author',
  _status: 'published',
  title: 'The Chronicler\'s Tale',
  hero: {
    type: 'authorHeader',
    eyebrow: 'THE AUTHOR\'S MANUSCRIPT',
    title: 'The Chronicler\'s Identity',
    quote: 'A life spent between inkwells and instruments, weaving melodies into the very fibers of the written word. Welcome to my study, where every book has a rhythm and every song tells a tale.',
    media: authorFullImage,
  },
  layout: [
    // Quest Map / Timeline
    {
      blockType: 'questMap',
      title: 'The Map of Quests',
      items: [
        {
          icon: 'music',
          isActive: false,
          title: 'First Incantation: Book One',
          year: '2015',
          tag: 'THE DISCOVERY',
          description: 'The year the first symphony was penned into a novel. A humble beginning in an attic room filled with sheet music and old scrolls.',
        },
        {
          icon: 'book',
          isActive: false,
          title: 'The Orchestral Awakening',
          year: '2018',
          tag: 'COMPOSITION',
          description: 'A major breakthrough where literary themes were formally paired with a full orchestral suite, performed live at the Grand Library.',
        },
        {
          icon: 'map',
          isActive: false,
          title: 'Legend of the Lyricist',
          year: '2021',
          tag: 'JOURNEY',
          description: 'A worldwide tour of storytelling events, merging the magic of animation with the depth of operatic narrative.',
        },
        {
          icon: 'star',
          isActive: true,
          title: 'The Current Chronicle',
          year: '2024',
          tag: 'THE PRESENT',
          description: 'Current work-in-progress: An immersive digital experience where readers can influence the score of the story as they read.',
        },
      ],
    },

    // Harmonic Forge highlights
    {
      blockType: 'authorHighlights',
      title: 'The Harmonic Forge',
      icon: 'star',
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

    // Newsletter CTA at bottom
    {
      blockType: 'linkToContact',
      title: 'Ready to Start Your Journey?',
      description: 'Subscribe to my newsletter to receive exclusive chapters, sheet music, and behind-the-scenes glimpses into the Chronicle.',
      inputPlaceholder: 'Enter your email address...',
      link: {
        type: 'custom',
        appearance: 'default',
        label: 'Send Messenger Pigeon',
        url: '/contact',
      },
    },
  ],
  meta: {
    title: 'The Chronicler\'s Tale - About the Author',
    description: 'Discover the story behind the Composer-Author who weaves melodies into every word.',
    image: authorFullImage,
  },
})
