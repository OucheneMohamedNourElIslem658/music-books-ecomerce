import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const text = (t: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text: t,
  version: 1,
})

const paragraph = (t: string) => ({
  type: 'paragraph' as const,
  children: [text(t)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const heading = (t: string, tag: 'h1' | 'h2' | 'h3' = 'h1') => ({
  type: 'heading' as const,
  tag,
  children: [text(t)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
})

const richText = (...nodes: any[]) => ({
  root: {
    type: 'root' as const,
    children: nodes,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

// ─── Blog 1: The Orchestral Heart ────────────────────────────────────────────

type Blog1Args = {
  heroImage: Media
  imageCello: Media
  imageFlute: Media
  imageHarp: Media
  imageViolin: Media
  imageMixer: Media
  imageConductor: Media
  imageMics: Media
}

export const blogOrchestralHeartData = ({
  heroImage,
  imageCello,
  imageFlute,
  imageHarp,
  imageViolin,
  imageMixer,
  imageConductor,
  imageMics,
}: Blog1Args): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'the-orchestral-heart',
  _status: 'published',
  isBlog: true,
  title: 'The Orchestral Heart',
  publishedOn: new Date('2024-03-15').toISOString(),
  hero: {
    type: 'lowImpact',
    media: heroImage,
    richText: richText(
      heading('The Orchestral Heart'),
      paragraph(
        'Experience the behind-the-scenes magic of our recording sessions. From the first whispered note to the final thundering crescendo.',
      ),
    ),
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'Watch the Feature',
          url: '/shop',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'Gallery',
          url: '/author',
        },
      },
    ],
  },
  layout: [
    // The Enchanted Armory — instrument gallery as AuthorHighlights
    {
      blockType: 'authorHighlights',
      title: 'The Enchanted Armory',
      icon: 'music',
      items: [
        {
          icon: 'music',
          title: 'The Elder Cello',
          description:
            'String Section — Represents the voice of the Great Dragon Kings. Deep, resonant tones that shake the very foundations of the ancient halls.',
        },
        {
          icon: 'music',
          title: 'Silver-Wound Flute',
          description:
            'Woodwind Section — The whimsical melody of the Forest Nymphs. Each trill carries the memory of sunlit glades and dancing spirits.',
        },
        {
          icon: 'music',
          title: 'Celestial Harp',
          description:
            'Celestial Section — Evoking the starlit skies of the Astral Plains. Its crystalline arpeggios accompany every moment of wonder.',
        },
        {
          icon: 'music',
          title: 'Midnight Violin',
          description:
            'Lead Section — The mournful theme of the Fallen Kingdom. Its dark, soaring lines tell the story of loss and redemption.',
        },
      ],
    },

    // Beyond the Score — FeatureShowcase
    {
      blockType: 'featureShowcase',
      reverse: false,
      content: richText(
        heading('Beyond the Score:', 'h2'),
        heading('Capturing the Magic', 'h3'),
        paragraph(
          'Our recording sessions at Abbey Wood Studios involved over 80 musicians from the Royal Philharmonic. Each note was captured in 96kHz High Definition to ensure every emotional nuance of the story translates into your ears.',
        ),
        paragraph('✓ Dolby Atmos Spatial Mix'),
        paragraph('✓ 14-piece Percussion Ensemble'),
        paragraph('✓ Live Gospel Choir in Chapter 12'),
      ),
      images: [
        { image: imageMixer, alt: 'Sound mixing board with glowing lights' },
        { image: imageConductor, alt: 'Conductor leading the Royal Philharmonic' },
        { image: imageMics, alt: 'Microphones placed around studio instruments' },
      ],
    },
  ],
  meta: {
    title: 'The Orchestral Heart | Musical Journey',
    description:
      'Experience the behind-the-scenes magic of our recording sessions. From the first whispered note to the final thundering crescendo.',
    image: heroImage,
  },
})

// ─── Blog 2: The Dragon's Lullaby — Making of the Signature Theme ─────────────

export const blogDragonsLullabyData = ({
  heroImage,
  imageCello,
  imageConductor,
}: {
  heroImage: Media
  imageCello: Media
  imageConductor: Media
}): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'the-dragons-lullaby',
  _status: 'published',
  isBlog: true,
  title: "The Dragon's Lullaby: Composing the Official Book Theme",
  publishedOn: new Date('2024-02-01').toISOString(),
  hero: {
    type: 'lowImpact',
    media: heroImage,
    richText: richText(
      heading("The Dragon's Lullaby"),
      paragraph(
        "How we composed the haunting official theme that plays at the opening of every chapter. A journey through motif, melody, and myth.",
      ),
    ),
    links: [],
  },
  layout: [
    {
      blockType: 'featureShowcase',
      reverse: true,
      content: richText(
        heading('From Sketch to Symphony', 'h2'),
        paragraph(
          "The Dragon's Lullaby began as a four-bar piano sketch written at 2am after finishing the first draft of Chapter 1. It captures the duality of the Great Dragon — ancient and tender, fearsome and protective.",
        ),
        paragraph(
          'We worked with a 60-piece string section to build out the full orchestration, layering the motif across 12 variations that each correspond to a different emotional arc in the story.',
        ),
      ),
      images: [
        { image: imageCello, alt: 'The Elder Cello — the heart of the Dragon theme' },
        { image: imageConductor, alt: 'Conductor shaping the emotional arc of the lullaby' },
      ],
    },

    {
      blockType: 'authorHighlights',
      title: 'The Three Motifs',
      icon: 'music',
      items: [
        {
          icon: 'music',
          title: 'The Awakening',
          description:
            'The opening four bars — a gentle, rising phrase in D minor that introduces the Dragon before it is ever seen on the page.',
        },
        {
          icon: 'fire',
          title: 'The Fury',
          description:
            'A thundering variation in the brass and low strings, reserved for the climactic battle scenes of Part III.',
        },
        {
          icon: 'star',
          title: 'The Farewell',
          description:
            'The closing reprise — the same four bars, now in D major, played solo on the Midnight Violin. A moment of pure catharsis.',
        },
      ],
    },

    {
      blockType: 'linkToContact',
      title: 'Want the Sheet Music?',
      description:
        "Subscribe to receive the official sheet music for The Dragon's Lullaby, plus exclusive audio commentary from the composer.",
      inputPlaceholder: 'Enter your email address...',
      link: {
        type: 'custom',
        appearance: 'default',
        label: 'Send Me the Score',
        url: '/contact',
      },
    },
  ],
  meta: {
    title: "The Dragon's Lullaby | Behind the Score",
    description:
      "How we composed the haunting official theme for The Symphony of Stories. A journey through motif, melody, and myth.",
    image: heroImage,
  },
})

// ─── Blog 3: Writing with Music — The Author's Process ───────────────────────

export const blogWritingWithMusicData = ({
  heroImage,
  imageHarp,
  imageFlute,
}: {
  heroImage: Media
  imageHarp: Media
  imageFlute: Media
}): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'writing-with-music',
  _status: 'published',
  isBlog: true,
  title: 'Writing with Music: My Creative Process',
  publishedOn: new Date('2024-01-10').toISOString(),
  hero: {
    type: 'lowImpact',
    media: heroImage,
    richText: richText(
      heading('Writing with Music: My Creative Process'),
      paragraph(
        'Every word I write is shaped by sound. Here is how I use music not just as inspiration, but as a structural tool for storytelling.',
      ),
    ),
    links: [],
  },
  layout: [
    {
      blockType: 'featureShowcase',
      reverse: false,
      content: richText(
        heading('The Score Comes First', 'h2'),
        paragraph(
          'Most authors outline their chapters before writing. I compose the music first. Each character has a leitmotif — a short musical phrase that evolves as the character grows. When I hear the motif change, I know the character has changed too.',
        ),
        paragraph(
          'The Celestial Harp represents the protagonist\'s wonder and innocence. As the story darkens, the harp is gradually replaced by the Midnight Violin — the same melody, but in a minor key, played slower and with more weight.',
        ),
      ),
      images: [
        { image: imageHarp, alt: 'The Celestial Harp — voice of the protagonist' },
        { image: imageFlute, alt: 'The Silver-Wound Flute — melody of the Forest Nymphs' },
      ],
    },

    {
      blockType: 'questMap',
      title: 'My Writing & Composing Rhythm',
      items: [
        {
          icon: 'music',
          isActive: false,
          title: 'Compose the Leitmotifs',
          year: 'Week 1',
          tag: 'MUSIC FIRST',
          description:
            'Before a single word, I sketch the main musical themes for each character and location on solo piano.',
        },
        {
          icon: 'book',
          isActive: false,
          title: 'Write the First Draft',
          year: 'Weeks 2–8',
          tag: 'WRITING',
          description:
            'I write with the piano sketches on loop. The music dictates the pacing — fast passages for action, slow harmonics for reflection.',
        },
        {
          icon: 'sparkles',
          isActive: false,
          title: 'Full Orchestration',
          year: 'Months 3–6',
          tag: 'ARRANGEMENT',
          description:
            'Once the draft is locked, the sketches are expanded into full orchestral arrangements that mirror the final narrative arc.',
        },
        {
          icon: 'star',
          isActive: true,
          title: 'Release Together',
          year: 'Launch Day',
          tag: 'THE MOMENT',
          description:
            'The book and its full score are released simultaneously — two versions of the same story, in two different languages.',
        },
      ],
    },

    {
      blockType: 'linkToContact',
      title: 'Curious About the Process?',
      description:
        'Join the newsletter to receive writing and composing tips, exclusive behind-the-scenes content, and early access to new releases.',
      inputPlaceholder: 'Your email address',
      link: {
        type: 'custom',
        appearance: 'default',
        label: 'Join the Fellowship',
        url: '/contact',
      },
    },
  ],
  meta: {
    title: 'Writing with Music: My Creative Process',
    description:
      'Every word is shaped by sound. How I use music as a structural storytelling tool.',
    image: heroImage,
  },
})
