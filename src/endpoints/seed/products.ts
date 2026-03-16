import type { Media, Product } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const richDesc = (text: string, dir: 'ltr' | 'rtl' = 'ltr') => ({
  root: {
    type: 'root' as const, direction: dir, format: '' as const, indent: 0, version: 1,
    children: [{
      type: 'paragraph' as const, direction: dir, format: '' as const, indent: 0, textFormat: 0, version: 1,
      children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 }],
    }],
  },
})

const reviewsLayout = (heading: string) => ([{
  blockType: 'reviewsBlock' as const,
  heading,
  displayMode: 'carousel' as const,
}])

const songGroup = (song: Media, title: string) => ({
  hasSong: true,
  songGroup: { title, song },
})

// ─── Book 1: Crescendo of the Clouds ─────────────────────────────────────────

type BookArgs = {
  coverImage: Media
  categories: any[]
  relatedProducts: any[]
  song?: Media
}

export const book1Data = ({ coverImage, categories, relatedProducts, song }: BookArgs): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'Crescendo of the Clouds',
  slug: 'crescendo-of-the-clouds',
  _status: 'published',
  description: richDesc('A soaring adventure through floating islands where melodies carry you higher than the clouds themselves. Each chapter is accompanied by an orchestral score that evolves with the story.'),
  ...(song ? songGroup(song, 'Crescendo Theme') : {}),
  gallery: [{ image: coverImage }],
  priceInUSDEnabled: true,
  priceInUSD: 2400,
  categories,
  relatedProducts,
  layout: reviewsLayout('What Readers Are Saying'),
  meta: { title: 'Crescendo of the Clouds | Melody & Myth', description: 'A soaring adventure through floating islands. Musical book with orchestral score.', image: coverImage },
})

export const book1AR = (createdProduct: Product) => {
  const layout = createdProduct.layout as any[]
  const reviewsBlockId = layout[0]?.id
  return {
    title: 'صعود الغيوم',
    description: richDesc('مغامرة خيالية عبر الجزر الطافية حيث تحملك الألحان أعلى من الغيوم ذاتها. يرافق كل فصل موسيقى أوركسترالية تتطور مع القصة.', 'rtl'),
    songGroup: { title: 'موضوع الصعود' },
    layout: [{ id: reviewsBlockId, blockType: 'reviewsBlock', heading: 'ما يقوله القراء' }],
  }
}

export const book1PT = (createdProduct: Product) => {
  const layout = createdProduct.layout as any[]
  const reviewsBlockId = layout[0]?.id
  return {
    title: 'Crescendo das Nuvens',
    description: richDesc('Uma aventura elevada através de ilhas flutuantes onde as melodias te levam mais alto do que as próprias nuvens. Cada capítulo é acompanhado por uma partitura orquestral que evolui com a história.'),
    songGroup: { title: 'Tema Crescendo' },
    layout: [{ id: reviewsBlockId, blockType: 'reviewsBlock', heading: 'O Que os Leitores Dizem' }],
  }
}

// ─── Book 2: The Coral Cantata ────────────────────────────────────────────────

export const book2Data = ({ coverImage, categories, relatedProducts, song }: BookArgs): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'The Coral Cantata',
  slug: 'the-coral-cantata',
  _status: 'published',
  description: richDesc('Deep-sea rhythms and hidden treasures await in this underwater musical epic. The story unfolds in an underwater castle made of coral, where ancient cantatas hold the secrets of the ocean.'),
  ...(song ? songGroup(song, 'Underwater Leitmotif') : {}),
  gallery: [{ image: coverImage }],
  priceInUSDEnabled: true,
  priceInUSD: 2200,
  categories,
  relatedProducts,
  layout: reviewsLayout('What Readers Are Saying'),
  meta: { title: 'The Coral Cantata | Melody & Myth', description: 'Deep-sea rhythms and hidden treasures. A musical underwater adventure.', image: coverImage },
})

export const book2AR = (createdProduct: Product) => {
  const layout = createdProduct.layout as any[]
  const reviewsBlockId = layout[0]?.id
  return {
    title: 'كانتاتا المرجان',
    description: richDesc('إيقاعات أعماق البحر وكنوز خفية تنتظرك في هذه الملحمة الموسيقية تحت الماء. تتكشف القصة في قلعة مرجانية تحت الماء، حيث تحتفظ كانتاتا قديمة بأسرار المحيط.', 'rtl'),
    songGroup: { title: 'اللحن تحت الماء' },
    layout: [{ id: reviewsBlockId, blockType: 'reviewsBlock', heading: 'ما يقوله القراء' }],
  }
}

export const book2PT = (createdProduct: Product) => {
  const layout = createdProduct.layout as any[]
  const reviewsBlockId = layout[0]?.id
  return {
    title: 'A Cantata do Coral',
    description: richDesc('Ritmos das profundezas do mar e tesouros escondidos aguardam nesta épica musical subaquática. A história desenrola-se num castelo subaquático de coral, onde antigas cantatas guardam os segredos do oceano.'),
    songGroup: { title: 'Leitmotif Subaquático' },
    layout: [{ id: reviewsBlockId, blockType: 'reviewsBlock', heading: 'O Que os Leitores Dizem' }],
  }
}

// ─── Book 3: Echoes of the Gear ───────────────────────────────────────────────

export const book3Data = ({ coverImage, categories, relatedProducts, song }: BookArgs): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'Echoes of the Gear',
  slug: 'echoes-of-the-gear',
  _status: 'published',
  description: richDesc('Steampunk melodies in a forgotten city where a mechanical bird made of music notes leads the way. A thrilling blend of industrial rhythm and fantasy narrative.'),
  ...(song ? songGroup(song, 'Steampunk Overture') : {}),
  gallery: [{ image: coverImage }],
  priceInUSDEnabled: true,
  priceInUSD: 2600,
  categories,
  relatedProducts,
  layout: reviewsLayout('What Readers Are Saying'),
  meta: { title: 'Echoes of the Gear | Melody & Myth', description: 'Steampunk melodies in a forgotten city. A musical book with original compositions.', image: coverImage },
})

export const book3AR = (createdProduct: Product) => {
  const layout = createdProduct.layout as any[]
  const reviewsBlockId = layout[0]?.id
  return {
    title: 'أصداء التروس',
    description: richDesc('ألحان ستيمبانك في مدينة منسية حيث يقود الطريق طائر ميكانيكي مصنوع من النوتات الموسيقية. مزيج مثير بين إيقاع صناعي وسرد خيالي.', 'rtl'),
    songGroup: { title: 'أوفرتير ستيمبانك' },
    layout: [{ id: reviewsBlockId, blockType: 'reviewsBlock', heading: 'ما يقوله القراء' }],
  }
}

export const book3PT = (createdProduct: Product) => {
  const layout = createdProduct.layout as any[]
  const reviewsBlockId = layout[0]?.id
  return {
    title: 'Ecos da Engrenagem',
    description: richDesc('Melodias steampunk numa cidade esquecida onde um pássaro mecânico feito de notas musicais abre o caminho. Uma combinação emocionante de ritmo industrial e narrativa fantástica.'),
    songGroup: { title: 'Abertura Steampunk' },
    layout: [{ id: reviewsBlockId, blockType: 'reviewsBlock', heading: 'O Que os Leitores Dizem' }],
  }
}