import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type HomePageArgs = {
  heroImage: Media
  book1: Media
  book2: Media
  book3: Media
  authorImage: Media
  product1Id: number
  product2Id: number
  product3Id: number
  heroSong: Media
}

export const homePageData = ({
  heroImage,
  authorImage,
  product1Id,
  product2Id,
  product3Id,
  heroSong,
}: HomePageArgs): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'home',
  _status: 'published',
  title: 'Home',
  hero: {
    type: 'highImpact',
    media: heroImage,
    hasSong: true,
    songGroup: {
      title: 'The Midnight Symphony',
      description: 'Official Book Theme · 3:42',
      song: heroSong,
    },
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h1',
            children: [
              { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Step into the Song: ', version: 1 },
              { type: 'text', detail: 0, format: 2, mode: 'normal', style: 'color-primary', text: 'The Midnight Symphony', version: 1 },
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
      icon: 'music' as const,
      items: [
        {
          icon: 'pen' as const,
          title: 'Ink & Inspiration',
          description: 'Every chapter begins with a melody. I write while listening to the specific motifs of my characters.',
        },
        {
          icon: 'piano' as const,
          title: 'The Lute\'s Lore',
          description: 'I use antique instruments to find the authentic voice of a fantasy world\'s folk music.',
        },
        {
          icon: 'mic' as const,
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

// ─── Arabic translation ───────────────────────────────────────────────────────

export const homePageAR = ({
  heroImage,
  authorImage,
  heroSong,
  product1Id,
  product2Id,
  product3Id,
}: {
  heroImage: Media
  authorImage: Media
  heroSong: Media
  product1Id: number
  product2Id: number
  product3Id: number
}) => ({
  title: 'الرئيسية',
  hero: {
    type: 'highImpact' as const,
    media: heroImage,
    hasSong: true,
    songGroup: {
      title: 'السيمفونية المنتصف الليل',
      description: 'الموضوع الرسمي · ٣:٤٢',
      song: heroSong,
    },
    richText: {
      root: {
        type: 'root' as const, direction: 'rtl' as const, format: '' as const, indent: 0, version: 1,
        children: [
          {
            type: 'heading' as const, tag: 'h1' as const, direction: 'rtl' as const, format: '' as const, indent: 0, version: 1,
            children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'ادخل إلى اللحن: السيمفونية المنتصف الليل', version: 1 }]
          },
          {
            type: 'paragraph' as const, direction: 'rtl' as const, format: '' as const, indent: 0, textFormat: 0, version: 1,
            children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'تجربة رحلة سحرية حيث لكل فصل لحنه الخاص. اكتشف أحدث تحفة موسيقية من أكثر رواة العالم غرابةً وجمالاً.', version: 1 }]
          },
        ],
      },
    },
    links: [
      { link: { type: 'custom' as const, appearance: 'default' as const, label: 'استكشف الكتاب', url: '/shop' } },
      { link: { type: 'custom' as const, appearance: 'outline' as const, label: 'عن المؤلف', url: '/author' } },
    ],
  },
  layout: [
    { blockType: 'threeItemGrid' as const, products: [product1Id, product2Id, product3Id] },
    {
      blockType: 'authorOverview' as const,
      eyebrow: 'مخطوطة المؤلف',
      title: 'تعرف على المؤلف الموسيقي',
      quote: 'حياة أمضيتها بين الأحبار والآلات الموسيقية، أنسج الألحان في نسيج الكلمة المكتوبة. كل قصة تُؤلَّف مرتين: مرة بالكلمات، ومرة بالنوتات.',
      image: authorImage,
      links: [
        { link: { type: 'custom' as const, appearance: 'default' as const, label: 'اقرأ الرسالة', url: '/author' } },
        { link: { type: 'custom' as const, appearance: 'outline' as const, label: 'اسمع لحني', url: '/shop' } },
      ],
    },
    {
      blockType: 'authorHighlights' as const,
      title: 'المصنع الموسيقي',
      icon: 'music' as const,
      items: [
        { icon: 'pen' as const, title: 'الحبر والإلهام', description: 'كل فصل يبدأ بلحن. أكتب بينما أستمع إلى الدوافع الموسيقية لشخصياتي.' },
        { icon: 'piano' as const, title: 'حكاية العود', description: 'أستخدم الآلات الموسيقية القديمة للعثور على الصوت الأصيل لموسيقى عالم الخيال الشعبية.' },
        { icon: 'mic' as const, title: 'أصداء السحر', description: 'الطبقات الصوتية والترتيبات الكورالية توفر العمق الروحي للتعاويذ المُلقاة في النص.' },
      ],
    },
    {
      blockType: 'linkToContact' as const,
      title: 'لا تفوت أي نغمة',
      description: 'انضم إلى القائمة البريدية السرية لتلقي معاينات حصرية للمقطوعات القادمة والتحديثات السحرية.',
      inputPlaceholder: 'عنوان بريدك الإلكتروني',
      link: { type: 'custom' as const, appearance: 'default' as const, label: 'انضم إلى المغامرة', url: '/contact' },
    },
  ],
  meta: {
    title: 'لحن وأسطورة | مغامرات موسيقية ساحرة',
    description: 'تجربة رحلة سحرية حيث لكل فصل لحنه الخاص. كتب موسيقية للصغار والكبار.',
    image: heroImage,
  },
})

// ─── Portuguese translation ───────────────────────────────────────────────────

export const homePagePT = ({
  heroImage,
  authorImage,
  heroSong,
  product1Id,
  product2Id,
  product3Id,
}: {
  heroImage: Media
  authorImage: Media
  heroSong: Media
  product1Id: number
  product2Id: number
  product3Id: number
}) => ({
  title: 'Início',
  hero: {
    type: 'highImpact' as const,
    media: heroImage,
    hasSong: true,
    songGroup: {
      title: 'A Sinfonia da Meia-Noite',
      description: 'Tema oficial · 3:42',
      song: heroSong,
    },
    richText: {
      root: {
        type: 'root' as const, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
        children: [
          {
            type: 'heading' as const, tag: 'h1' as const, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
            children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'Entre na Canção: A Sinfonia da Meia-Noite', version: 1 }]
          },
          {
            type: 'paragraph' as const, direction: 'ltr' as const, format: '' as const, indent: 0, textFormat: 0, version: 1,
            children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'Experiencie uma jornada mágica onde cada capítulo tem a sua própria melodia. Descubra a mais recente obra-prima do contador de histórias mais encantador do mundo.', version: 1 }]
          },
        ],
      },
    },
    links: [
      { link: { type: 'custom' as const, appearance: 'default' as const, label: 'Explorar o Livro', url: '/shop' } },
      { link: { type: 'custom' as const, appearance: 'outline' as const, label: 'Sobre o Autor', url: '/author' } },
    ],
  },
  layout: [
    { blockType: 'threeItemGrid' as const, products: [product1Id, product2Id, product3Id] },
    {
      blockType: 'authorOverview' as const,
      eyebrow: 'O Manuscrito do Autor',
      title: 'Conheça o Autor-Compositor',
      quote: 'Uma vida passada entre tinteiros e instrumentos, tecendo melodias nas fibras da palavra escrita. Cada história é composta duas vezes: uma em palavras e outra em notas.',
      image: authorImage,
      links: [
        { link: { type: 'custom' as const, appearance: 'default' as const, label: 'Ler a Carta', url: '/author' } },
        { link: { type: 'custom' as const, appearance: 'outline' as const, label: 'Ouvir o Meu Tema', url: '/shop' } },
      ],
    },
    {
      blockType: 'authorHighlights' as const,
      title: 'A Forja Harmónica',
      icon: 'music' as const,
      items: [
        { icon: 'pen' as const, title: 'Tinta e Inspiração', description: 'Cada capítulo começa com uma melodia. Escrevo enquanto ouço os motivos específicos dos meus personagens.' },
        { icon: 'piano' as const, title: 'A Lenda do Alaúde', description: 'Uso instrumentos antigos para encontrar a voz autêntica da música folclórica do mundo fantástico.' },
        { icon: 'mic' as const, title: 'Ecos da Magia', description: 'Camadas vocais e arranjos corais fornecem a profundidade espiritual dos feitiços lançados no texto.' },
      ],
    },
    {
      blockType: 'linkToContact' as const,
      title: 'Nunca Perca uma Nota',
      description: 'Junte-se à lista de correio secreta para receber pré-visualizações exclusivas de partituras e atualizações mágicas.',
      inputPlaceholder: 'O seu endereço de email',
      link: { type: 'custom' as const, appearance: 'default' as const, label: 'Juntar-me à Aventura', url: '/contact' },
    },
  ],
  meta: {
    title: 'Melodia & Mito | Aventuras Musicais Encantadas',
    description: 'Experiencie uma jornada mágica onde cada capítulo tem a sua própria melodia. Livros musicais para jovens e jovens de coração.',
    image: heroImage,
  },
})