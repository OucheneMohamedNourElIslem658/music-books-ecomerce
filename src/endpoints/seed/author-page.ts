import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type AuthorPageArgs = {
  authorFullImage: Media
}

// ─── Shared layout builders ───────────────────────────────────────────────────

const questMapBlock = (
  title: string,
  items: { icon: string; isActive: boolean; title: string; year: string; tag: string; description: string }[],
) => ({ blockType: 'questMap' as const, title, items })

const highlightsBlock = (
  title: string,
  icon: string,
  items: { icon: string; title: string; description: string }[],
) => ({ blockType: 'authorHighlights' as const, title, icon, items })

const ctaBlock = (
  title: string,
  description: string,
  inputPlaceholder: string,
  label: string,
) => ({
  blockType: 'linkToContact' as const,
  title,
  description,
  inputPlaceholder,
  link: { type: 'custom' as const, appearance: 'default' as const, label, url: '/contact' },
})

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

// ─── Arabic translation ───────────────────────────────────────────────────────

export const authorPageAR = () => ({
  title: 'حكاية المؤرخ',
  hero: {
    type: 'authorHeader' as const,
    eyebrow: 'مخطوطة المؤلف',
    title: 'هوية المؤرخ',
    quote: 'حياة أمضيتها بين الأحبار والآلات الموسيقية، أنسج الألحان في نسيج الكلمة المكتوبة. مرحباً في مكتبتي، حيث لكل كتاب إيقاع وكل أغنية تحكي قصة.',
  },
  layout: [
    questMapBlock('خريطة المهام', [
      { icon: 'music', isActive: false, title: 'التعويذة الأولى: الكتاب الأول', year: '٢٠١٥', tag: 'الاكتشاف', description: 'العام الذي كُتبت فيه السيمفونية الأولى رواية. بداية متواضعة في غرفة علوية مليئة بالموسيقى والمخطوطات القديمة.' },
      { icon: 'book', isActive: false, title: 'الصحوة الأوركسترالية', year: '٢٠١٨', tag: 'التأليف', description: 'اختراق كبير حيث اقترنت الموضوعات الأدبية رسمياً بجناح أوركسترالي كامل، عُزف حياً في المكتبة الكبرى.' },
      { icon: 'map', isActive: false, title: 'أسطورة الشاعر', year: '٢٠٢١', tag: 'الرحلة', description: 'جولة عالمية لأحداث رواية القصص، تدمج سحر الرسوم المتحركة مع عمق السرد الأوبرالي.' },
      { icon: 'star', isActive: true, title: 'السجل الحالي', year: '٢٠٢٤', tag: 'الحاضر', description: 'العمل الجاري: تجربة رقمية غامرة حيث يمكن للقراء التأثير على موسيقى القصة أثناء قراءتها.' },
    ]),
    highlightsBlock('المصنع الموسيقي', 'star', [
      { icon: 'pen', title: 'الحبر والإلهام', description: 'كل فصل يبدأ بلحن. أكتب بينما أستمع إلى الدوافع الموسيقية الخاصة بشخصياتي.' },
      { icon: 'piano', title: 'حكاية العود', description: 'أستخدم الآلات الموسيقية القديمة للعثور على الصوت الأصيل لموسيقى عالم الخيال الشعبية.' },
      { icon: 'mic', title: 'أصداء السحر', description: 'الطبقات الصوتية والترتيبات الكورالية توفر العمق الروحي للتعاويذ المُلقاة في النص.' },
    ]),
    ctaBlock('هل أنت مستعد لبدء رحلتك؟', 'اشترك في نشرتي الإخبارية لتلقي فصول حصرية ونوتات موسيقية ولقطات من الكواليس.', 'أدخل عنوان بريدك الإلكتروني...', 'أرسل حمامة زاجلة'),
  ],
})

// ─── Portuguese translation ───────────────────────────────────────────────────

export const authorPagePT = () => ({
  title: 'O Conto do Cronista',
  hero: {
    type: 'authorHeader' as const,
    eyebrow: 'O MANUSCRITO DO AUTOR',
    title: 'A Identidade do Cronista',
    quote: 'Uma vida passada entre tinteiros e instrumentos, tecendo melodias nas fibras da palavra escrita. Bem-vindo ao meu estúdio, onde cada livro tem um ritmo e cada canção conta uma história.',
  },
  layout: [
    questMapBlock('O Mapa das Missões', [
      { icon: 'music', isActive: false, title: 'Primeira Incantação: Livro Um', year: '2015', tag: 'A DESCOBERTA', description: 'O ano em que a primeira sinfonia foi escrita como romance. Um início humilde num sótão cheio de partituras e pergaminhos antigos.' },
      { icon: 'book', isActive: false, title: 'O Despertar Orquestral', year: '2018', tag: 'COMPOSIÇÃO', description: 'Um grande avanço onde os temas literários foram formalmente emparelhados com uma suite orquestral completa, interpretada ao vivo na Grande Biblioteca.' },
      { icon: 'map', isActive: false, title: 'A Lenda do Letrista', year: '2021', tag: 'JORNADA', description: 'Uma digressão mundial de eventos de narração, fundindo a magia da animação com a profundidade da narrativa operática.' },
      { icon: 'star', isActive: true, title: 'A Crónica Atual', year: '2024', tag: 'O PRESENTE', description: 'Trabalho em curso: Uma experiência digital imersiva onde os leitores podem influenciar a partitura da história enquanto leem.' },
    ]),
    highlightsBlock('A Forja Harmónica', 'star', [
      { icon: 'pen', title: 'Tinta e Inspiração', description: 'Cada capítulo começa com uma melodia. Escrevo enquanto ouço os motivos específicos dos meus personagens.' },
      { icon: 'piano', title: 'A Lenda do Alaúde', description: 'Uso instrumentos antigos para encontrar a voz autêntica da música folclórica do mundo fantástico.' },
      { icon: 'mic', title: 'Ecos da Magia', description: 'Camadas vocais e arranjos corais fornecem a profundidade espiritual dos feitiços lançados no texto.' },
    ]),
    ctaBlock('Pronto para Começar a Sua Jornada?', 'Subscreva a minha newsletter para receber capítulos exclusivos, partituras e vislumbres dos bastidores da Crónica.', 'Introduza o seu endereço de email...', 'Enviar Pombo-Correio'),
  ],
})