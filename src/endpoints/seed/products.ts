import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type BookArgs = {
  coverImage: Media
  categories: any[]
  relatedProducts: any[]
  song?: Media
}

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

// ─── Book 1: Crescendo of the Clouds ─────────────────────────────────────────

export const book1Data = ({ coverImage, categories, relatedProducts, song }: BookArgs): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'Crescendo of the Clouds',
  slug: 'crescendo-of-the-clouds',
  _status: 'published',
  description: richDesc('A soaring adventure through floating islands where melodies carry you higher than the clouds themselves. Each chapter is accompanied by an orchestral score that evolves with the story.'),
  ...(song ? { song } : {}),
  gallery: [{ image: coverImage }],
  priceInUSDEnabled: true,
  priceInUSD: 2400,
  categories,
  relatedProducts,
  layout: reviewsLayout('What Readers Are Saying'),
  meta: { title: 'Crescendo of the Clouds | Melody & Myth', description: 'A soaring adventure through floating islands. Musical book with orchestral score.', image: coverImage },
})

export const book1AR = () => ({
  title: 'صعود الغيوم',
  description: richDesc('مغامرة خيالية عبر الجزر الطافية حيث تحملك الألحان أعلى من الغيوم ذاتها. يرافق كل فصل موسيقى أوركسترالية تتطور مع القصة.', 'rtl'),
  layout: reviewsLayout('ما يقوله القراء'),
})

export const book1PT = () => ({
  title: 'Crescendo das Nuvens',
  description: richDesc('Uma aventura elevada através de ilhas flutuantes onde as melodias te levam mais alto do que as próprias nuvens. Cada capítulo é acompanhado por uma partitura orquestral que evolui com a história.'),
  layout: reviewsLayout('O Que os Leitores Dizem'),
})

// ─── Book 2: The Coral Cantata ────────────────────────────────────────────────

export const book2Data = ({ coverImage, categories, relatedProducts, song }: BookArgs): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'The Coral Cantata',
  slug: 'the-coral-cantata',
  _status: 'published',
  description: richDesc('Deep-sea rhythms and hidden treasures await in this underwater musical epic. The story unfolds in an underwater castle made of coral, where ancient cantatas hold the secrets of the ocean.'),
  ...(song ? { song } : {}),
  gallery: [{ image: coverImage }],
  priceInUSDEnabled: true,
  priceInUSD: 2200,
  categories,
  relatedProducts,
  layout: reviewsLayout('What Readers Are Saying'),
  meta: { title: 'The Coral Cantata | Melody & Myth', description: 'Deep-sea rhythms and hidden treasures. A musical underwater adventure.', image: coverImage },
})

export const book2AR = () => ({
  title: 'كانتاتا المرجان',
  description: richDesc('إيقاعات أعماق البحر وكنوز خفية تنتظرك في هذه الملحمة الموسيقية تحت الماء. تتكشف القصة في قلعة مرجانية تحت الماء، حيث تحتفظ كانتاتا قديمة بأسرار المحيط.', 'rtl'),
  layout: reviewsLayout('ما يقوله القراء'),
})

export const book2PT = () => ({
  title: 'A Cantata do Coral',
  description: richDesc('Ritmos das profundezas do mar e tesouros escondidos aguardam nesta épica musical subaquática. A história desenrola-se num castelo subaquático de coral, onde antigas cantatas guardam os segredos do oceano.'),
  layout: reviewsLayout('O Que os Leitores Dizem'),
})

// ─── Book 3: Echoes of the Gear ───────────────────────────────────────────────

export const book3Data = ({ coverImage, categories, relatedProducts, song }: BookArgs): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'Echoes of the Gear',
  slug: 'echoes-of-the-gear',
  _status: 'published',
  description: richDesc('Steampunk melodies in a forgotten city where a mechanical bird made of music notes leads the way. A thrilling blend of industrial rhythm and fantasy narrative.'),
  ...(song ? { song } : {}),
  gallery: [{ image: coverImage }],
  priceInUSDEnabled: true,
  priceInUSD: 2600,
  categories,
  relatedProducts,
  layout: reviewsLayout('What Readers Are Saying'),
  meta: { title: 'Echoes of the Gear | Melody & Myth', description: 'Steampunk melodies in a forgotten city. A musical book with original compositions.', image: coverImage },
})

export const book3AR = () => ({
  title: 'أصداء التروس',
  description: richDesc('ألحان ستيمبانك في مدينة منسية حيث يقود الطريق طائر ميكانيكي مصنوع من النوتات الموسيقية. مزيج مثير بين إيقاع صناعي وسرد خيالي.', 'rtl'),
  layout: reviewsLayout('ما يقوله القراء'),
})

export const book3PT = () => ({
  title: 'Ecos da Engrenagem',
  description: richDesc('Melodias steampunk numa cidade esquecida onde um pássaro mecânico feito de notas musicais abre o caminho. Uma combinação emocionante de ritmo industrial e narrativa fantástica.'),
  layout: reviewsLayout('O Que os Leitores Dizem'),
})