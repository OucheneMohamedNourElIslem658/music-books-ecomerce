import type { Media, Page } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

// ─── Rich text helpers ────────────────────────────────────────────────────────

const rt = (text: string, dir: 'ltr' | 'rtl' = 'ltr') => ({
  root: {
    type: 'root' as const,
    direction: dir,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph' as const,
        direction: dir,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
        children: [
          { type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 },
        ],
      },
    ],
  },
})

// ─── EN data ──────────────────────────────────────────────────────────────────

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
      song: heroSong,
    },
    richText: {
      root: {
        type: 'root',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h1',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            children: [
              { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Step into the Song: ', version: 1 },
              { type: 'text', detail: 0, format: 2, mode: 'normal', style: 'color-primary', text: 'The Midnight Symphony', version: 1 },
            ],
          },
          {
            type: 'paragraph',
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
            children: [
              { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: "Experience a magical journey where every chapter has its own melody. Discover the latest musical masterpiece from the world's most whimsical storyteller.", version: 1 },
            ],
          },
        ],
      },
    },
    links: [
      { link: { type: 'custom', appearance: 'default', label: 'Explore the Book', url: '/shop' } },
      { link: { type: 'custom', appearance: 'outline', label: 'About the Author', url: '/author' } },
    ],
  },
  layout: [
    {
      // PopularProducts block — Payload slug is 'threeItemGrid'
      blockType: 'threeItemGrid',
      title: 'The Enchanted Library',
      description: 'Discover our most beloved musical adventures — each book comes with its own original orchestral score.',
      products: [product1Id, product2Id, product3Id],
    },
    {
      blockType: 'authorOverview',
      eyebrow: "The Author's Manuscript",
      title: 'Meet the Composer-Author',
      quote: rt('A life spent between inkwells and instruments, weaving melodies into the very fibers of the written word. Each story is composed twice: once in words, and once in notes.'),
      image: authorImage,
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Read the Letter', url: '/author' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Hear My Theme', url: '/shop' } },
      ],
    },
    {
      blockType: 'authorHighlights',
      title: 'The Harmonic Forge',
      icon: 'music' as const,
      items: [
        { icon: 'pen' as const, title: 'Ink & Inspiration', description: 'Every chapter begins with a melody. I write while listening to the specific motifs of my characters.' },
        { icon: 'piano' as const, title: "The Lute's Lore", description: "I use antique instruments to find the authentic voice of a fantasy world's folk music." },
        { icon: 'mic' as const, title: 'Echoes of Magic', description: 'Vocal layers and choral arrangements provide the spiritual depth of the magical spells cast in-text.' },
      ],
    },
    {
      blockType: 'linkToContact',
      title: 'Never Miss a Note',
      description: 'Join the secret mailing list to receive early previews of upcoming scores, exclusive concept art, and magical updates. Join 15,000+ Seekers of Magic.',
      inputPlaceholder: 'Your email address',
      link: { type: 'custom', appearance: 'default', label: 'Join the Adventure', url: '/contact' },
    },
  ],
  meta: {
    title: 'Melody & Myth | Whimsical Musical Adventures',
    description: 'Experience a magical journey where every chapter has its own melody. Musical books for the young and young at heart.',
    image: heroImage,
  },
})

// ─── AR translation ───────────────────────────────────────────────────────────

export const homePageAR = (createdPage: Page, heroSong: Media) => {
  const layout = createdPage.layout as any[]
  const threeItemGridId = layout[0]?.id
  const authorOverviewId = layout[1]?.id
  const authorOverviewLinks = (layout[1] as any)?.links ?? []
  const authorHighlightsId = layout[2]?.id
  const authorHighlightsItems = (layout[2] as any)?.items ?? []
  const linkToContactId = layout[3]?.id
  const heroLinks = (createdPage.hero as any)?.links ?? []

  return {
    title: 'الرئيسية',
    hero: {
      richText: {
        root: {
          type: 'root' as const,
          direction: 'rtl' as const,
          format: '' as const,
          indent: 0,
          version: 1,
          children: [
            {
              type: 'heading' as const,
              tag: 'h1' as const,
              direction: 'rtl' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                { type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'ادخل إلى اللحن: ', version: 1 },
                { type: 'text' as const, detail: 0, format: 2, mode: 'normal' as const, style: 'color-primary', text: 'سيمفونية منتصف الليل', version: 1 },
              ],
            },
            {
              type: 'paragraph' as const,
              direction: 'rtl' as const,
              format: '' as const,
              indent: 0,
              textFormat: 0,
              version: 1,
              children: [
                { type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'تجربة رحلة سحرية حيث لكل فصل لحنه الخاص. اكتشف أحدث تحفة موسيقية من أكثر رواة العالم غرابةً وجمالاً.', version: 1 },
              ],
            },
          ],
        },
      },
      songGroup: { title: 'سيمفونية منتصف الليل' },
      links: heroLinks.map((l: any, i: number) => ({
        id: l.id,
        link: { ...l.link, label: i === 0 ? 'استكشف الكتاب' : 'عن المؤلف' },
      })),
    },
    layout: [
      {
        id: threeItemGridId,
        blockType: 'threeItemGrid',
        title: 'المكتبة المسحورة',
        description: 'اكتشف أكثر مغامراتنا الموسيقية حباً — يأتي كل كتاب مع موسيقى أوركسترالية أصلية خاصة به.',
      },
      {
        id: authorOverviewId,
        blockType: 'authorOverview',
        eyebrow: 'مخطوطة المؤلف',
        title: 'تعرف على المؤلف الموسيقي',
        quote: rt('حياة أمضيتها بين الأحبار والآلات الموسيقية، أنسج الألحان في نسيج الكلمة المكتوبة. كل قصة تُؤلَّف مرتين: مرة بالكلمات، ومرة بالنوتات.', 'rtl'),
        links: authorOverviewLinks.map((l: any, i: number) => ({
          id: l.id,
          link: { ...l.link, label: i === 0 ? 'اقرأ الرسالة' : 'اسمع لحني' },
        })),
      },
      {
        id: authorHighlightsId,
        blockType: 'authorHighlights',
        title: 'المصنع الموسيقي',
        items: authorHighlightsItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['الحبر والإلهام', 'حكاية العود', 'أصداء السحر'][i],
          description: [
            'كل فصل يبدأ بلحن. أكتب بينما أستمع إلى الدوافع الموسيقية لشخصياتي.',
            'أستخدم الآلات الموسيقية القديمة للعثور على الصوت الأصيل لموسيقى عالم الخيال الشعبية.',
            'الطبقات الصوتية والترتيبات الكورالية توفر العمق الروحي للتعاويذ المُلقاة في النص.',
          ][i],
        })),
      },
      {
        id: linkToContactId,
        blockType: 'linkToContact',
        title: 'لا تفوت أي نغمة',
        description: 'انضم إلى القائمة البريدية السرية لتلقي معاينات حصرية للمقطوعات القادمة والتحديثات السحرية.',
        inputPlaceholder: 'عنوان بريدك الإلكتروني',
        link: { type: 'custom', appearance: 'default', label: 'انضم إلى المغامرة', url: '/contact' },
      },
    ],
    meta: {
      title: 'لحن وأسطورة | مغامرات موسيقية ساحرة',
      description: 'تجربة رحلة سحرية حيث لكل فصل لحنه الخاص. كتب موسيقية للصغار والكبار.',
    },
  }
}

// ─── PT translation ───────────────────────────────────────────────────────────

export const homePagePT = (createdPage: Page, heroSong: Media) => {
  const layout = createdPage.layout as any[]
  const threeItemGridId = layout[0]?.id
  const authorOverviewId = layout[1]?.id
  const authorOverviewLinks = (layout[1] as any)?.links ?? []
  const authorHighlightsId = layout[2]?.id
  const authorHighlightsItems = (layout[2] as any)?.items ?? []
  const linkToContactId = layout[3]?.id
  const heroLinks = (createdPage.hero as any)?.links ?? []

  return {
    title: 'Início',
    hero: {
      richText: {
        root: {
          type: 'root' as const,
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
          children: [
            {
              type: 'heading' as const,
              tag: 'h1' as const,
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                { type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'Entre na Canção: ', version: 1 },
                { type: 'text' as const, detail: 0, format: 2, mode: 'normal' as const, style: 'color-primary', text: 'A Sinfonia da Meia-Noite', version: 1 },
              ],
            },
            {
              type: 'paragraph' as const,
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              textFormat: 0,
              version: 1,
              children: [
                { type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'Experiencie uma jornada mágica onde cada capítulo tem a sua própria melodia. Descubra a mais recente obra-prima do contador de histórias mais encantador do mundo.', version: 1 },
              ],
            },
          ],
        },
      },
      songGroup: { title: 'A Sinfonia da Meia-Noite' },
      links: heroLinks.map((l: any, i: number) => ({
        id: l.id,
        link: { ...l.link, label: i === 0 ? 'Explorar o Livro' : 'Sobre o Autor' },
      })),
    },
    layout: [
      {
        id: threeItemGridId,
        blockType: 'threeItemGrid',
        title: 'A Biblioteca Encantada',
        description: 'Descubra as nossas aventuras musicais mais amadas — cada livro vem com a sua própria partitura orquestral original.',
      },
      {
        id: authorOverviewId,
        blockType: 'authorOverview',
        eyebrow: 'O Manuscrito do Autor',
        title: 'Conheça o Autor-Compositor',
        quote: rt('Uma vida passada entre tinteiros e instrumentos, tecendo melodias nas fibras da palavra escrita. Cada história é composta duas vezes: uma em palavras e outra em notas.'),
        links: authorOverviewLinks.map((l: any, i: number) => ({
          id: l.id,
          link: { ...l.link, label: i === 0 ? 'Ler a Carta' : 'Ouvir o Meu Tema' },
        })),
      },
      {
        id: authorHighlightsId,
        blockType: 'authorHighlights',
        title: 'A Forja Harmónica',
        items: authorHighlightsItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['Tinta e Inspiração', 'A Lenda do Alaúde', 'Ecos da Magia'][i],
          description: [
            'Cada capítulo começa com uma melodia. Escrevo enquanto ouço os motivos específicos dos meus personagens.',
            'Uso instrumentos antigos para encontrar a voz autêntica da música folclórica do mundo fantástico.',
            'Camadas vocais e arranjos corais fornecem a profundidade espiritual dos feitiços lançados no texto.',
          ][i],
        })),
      },
      {
        id: linkToContactId,
        blockType: 'linkToContact',
        title: 'Nunca Perca uma Nota',
        description: 'Junte-se à lista de correio secreta para receber pré-visualizações exclusivas de partituras e atualizações mágicas.',
        inputPlaceholder: 'O seu endereço de email',
        link: { type: 'custom', appearance: 'default', label: 'Juntar-me à Aventura', url: '/contact' },
      },
    ],
    meta: {
      title: 'Melodia & Mito | Aventuras Musicais Encantadas',
      description: 'Experiencie uma jornada mágica onde cada capítulo tem a sua própria melodia. Livros musicais para jovens e jovens de coração.',
    },
  }
}