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

export const authorPageData = ({
  authorFullImage,
}: {
  authorFullImage: Media
}): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'author',
  _status: 'published',
  title: "The Chronicler's Tale",
  hero: {
    type: 'authorHeader',
    eyebrow: "THE AUTHOR'S MANUSCRIPT",
    title: "The Chronicler's Identity",
    quote: rt('A life spent between inkwells and instruments, weaving melodies into the very fibers of the written word. Welcome to my study, where every book has a rhythm and every song tells a tale.'),
    media: authorFullImage,
  },
  layout: [
    {
      blockType: 'questMap',
      title: 'The Map of Quests',
      items: [
        { icon: 'music' as const, isActive: false, title: 'First Incantation: Book One', year: '2015', tag: 'THE DISCOVERY', description: 'The year the first symphony was penned into a novel. A humble beginning in an attic room filled with sheet music and old scrolls.' },
        { icon: 'book' as const, isActive: false, title: 'The Orchestral Awakening', year: '2018', tag: 'COMPOSITION', description: 'A major breakthrough where literary themes were formally paired with a full orchestral suite, performed live at the Grand Library.' },
        { icon: 'map' as const, isActive: false, title: 'Legend of the Lyricist', year: '2021', tag: 'JOURNEY', description: 'A worldwide tour of storytelling events, merging the magic of animation with the depth of operatic narrative.' },
        { icon: 'star' as const, isActive: true, title: 'The Current Chronicle', year: '2024', tag: 'THE PRESENT', description: 'Current work-in-progress: An immersive digital experience where readers can influence the score of the story as they read.' },
      ],
    },
    {
      blockType: 'authorHighlights',
      title: 'The Harmonic Forge',
      icon: 'star' as const,
      items: [
        { icon: 'pen' as const, title: 'Ink & Inspiration', description: 'Every chapter begins with a melody. I write while listening to the specific motifs of my characters.' },
        { icon: 'piano' as const, title: "The Lute's Lore", description: "I use antique instruments to find the authentic voice of a fantasy world's folk music." },
        { icon: 'mic' as const, title: 'Echoes of Magic', description: 'Vocal layers and choral arrangements provide the spiritual depth of the magical spells cast in-text.' },
      ],
    },
    {
      blockType: 'linkToContact',
      title: 'Ready to Start Your Journey?',
      description: 'Subscribe to my newsletter to receive exclusive chapters, sheet music, and behind-the-scenes glimpses into the Chronicle.',
      inputPlaceholder: 'Enter your email address...',
      link: { type: 'custom', appearance: 'default', label: 'Send Messenger Pigeon', url: '/contact' },
    },
  ],
  meta: {
    title: "The Chronicler's Tale - About the Author",
    description: 'Discover the story behind the Composer-Author who weaves melodies into every word.',
    image: authorFullImage,
  },
})

// ─── AR translation ───────────────────────────────────────────────────────────

export const authorPageAR = (createdPage: Page) => {
  const layout = createdPage.layout as any[]
  const questMapId = layout[0]?.id
  const questMapItems = (layout[0] as any)?.items ?? []
  const highlightsId = layout[1]?.id
  const highlightsItems = (layout[1] as any)?.items ?? []
  const ctaId = layout[2]?.id

  return {
    title: 'حكاية المؤرخ',
    hero: {
      eyebrow: 'مخطوطة المؤلف',
      title: 'هوية المؤرخ',
      quote: rt('حياة أمضيتها بين الأحبار والآلات الموسيقية، أنسج الألحان في نسيج الكلمة المكتوبة. مرحباً في مكتبتي، حيث لكل كتاب إيقاع وكل أغنية تحكي قصة.', 'rtl'),
    },
    layout: [
      {
        id: questMapId,
        blockType: 'questMap',
        title: 'خريطة المهام',
        items: questMapItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['التعويذة الأولى: الكتاب الأول', 'الصحوة الأوركسترالية', 'أسطورة الشاعر', 'السجل الحالي'][i],
          year: ['٢٠١٥', '٢٠١٨', '٢٠٢١', '٢٠٢٤'][i],
          tag: ['الاكتشاف', 'التأليف', 'الرحلة', 'الحاضر'][i],
          description: [
            'العام الذي كُتبت فيه السيمفونية الأولى رواية. بداية متواضعة في غرفة علوية مليئة بالموسيقى والمخطوطات القديمة.',
            'اختراق كبير حيث اقترنت الموضوعات الأدبية رسمياً بجناح أوركسترالي كامل، عُزف حياً في المكتبة الكبرى.',
            'جولة عالمية لأحداث رواية القصص، تدمج سحر الرسوم المتحركة مع عمق السرد الأوبرالي.',
            'العمل الجاري: تجربة رقمية غامرة حيث يمكن للقراء التأثير على موسيقى القصة أثناء قراءتها.',
          ][i],
        })),
      },
      {
        id: highlightsId,
        blockType: 'authorHighlights',
        title: 'المصنع الموسيقي',
        items: highlightsItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['الحبر والإلهام', 'حكاية العود', 'أصداء السحر'][i],
          description: [
            'كل فصل يبدأ بلحن. أكتب بينما أستمع إلى الدوافع الموسيقية الخاصة بشخصياتي.',
            'أستخدم الآلات الموسيقية القديمة للعثور على الصوت الأصيل لموسيقى عالم الخيال الشعبية.',
            'الطبقات الصوتية والترتيبات الكورالية توفر العمق الروحي للتعاويذ المُلقاة في النص.',
          ][i],
        })),
      },
      {
        id: ctaId,
        blockType: 'linkToContact',
        title: 'هل أنت مستعد لبدء رحلتك؟',
        description: 'اشترك في نشرتي الإخبارية لتلقي فصول حصرية ونوتات موسيقية ولقطات من الكواليس.',
        inputPlaceholder: 'أدخل عنوان بريدك الإلكتروني...',
        link: { type: 'custom', appearance: 'default', label: 'أرسل حمامة زاجلة', url: '/contact' },
      },
    ],
    meta: {
      title: 'حكاية المؤرخ - عن المؤلف',
      description: 'اكتشف قصة المؤلف-الموسيقي الذي ينسج الألحان في كل كلمة.',
    },
  }
}

// ─── PT translation ───────────────────────────────────────────────────────────

export const authorPagePT = (createdPage: Page) => {
  const layout = createdPage.layout as any[]
  const questMapId = layout[0]?.id
  const questMapItems = (layout[0] as any)?.items ?? []
  const highlightsId = layout[1]?.id
  const highlightsItems = (layout[1] as any)?.items ?? []
  const ctaId = layout[2]?.id

  return {
    title: 'O Conto do Cronista',
    hero: {
      eyebrow: 'O MANUSCRITO DO AUTOR',
      title: 'A Identidade do Cronista',
      quote: rt('Uma vida passada entre tinteiros e instrumentos, tecendo melodias nas fibras da palavra escrita. Bem-vindo ao meu estúdio, onde cada livro tem um ritmo e cada canção conta uma história.'),
    },
    layout: [
      {
        id: questMapId,
        blockType: 'questMap',
        title: 'O Mapa das Missões',
        items: questMapItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['Primeira Incantação: Livro Um', 'O Despertar Orquestral', 'A Lenda do Letrista', 'A Crónica Atual'][i],
          year: ['2015', '2018', '2021', '2024'][i],
          tag: ['A DESCOBERTA', 'COMPOSIÇÃO', 'JORNADA', 'O PRESENTE'][i],
          description: [
            'O ano em que a primeira sinfonia foi escrita como romance. Um início humilde num sótão cheio de partituras e pergaminhos antigos.',
            'Um grande avanço onde os temas literários foram formalmente emparelhados com uma suite orquestral completa, interpretada ao vivo na Grande Biblioteca.',
            'Uma digressão mundial de eventos de narração, fundindo a magia da animação com a profundidade da narrativa operática.',
            'Trabalho em curso: Uma experiência digital imersiva onde os leitores podem influenciar a partitura da história enquanto leem.',
          ][i],
        })),
      },
      {
        id: highlightsId,
        blockType: 'authorHighlights',
        title: 'A Forja Harmónica',
        items: highlightsItems.map((item: any, i: number) => ({
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
        id: ctaId,
        blockType: 'linkToContact',
        title: 'Pronto para Começar a Sua Jornada?',
        description: 'Subscreva a minha newsletter para receber capítulos exclusivos, partituras e vislumbres dos bastidores da Crónica.',
        inputPlaceholder: 'Introduza o seu endereço de email...',
        link: { type: 'custom', appearance: 'default', label: 'Enviar Pombo-Correio', url: '/contact' },
      },
    ],
    meta: {
      title: 'O Conto do Cronista - Sobre o Autor',
      description: 'Descubra a história por trás do Autor-Compositor que tece melodias em cada palavra.',
    },
  }
}