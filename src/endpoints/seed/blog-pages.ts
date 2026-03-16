import type { Media, Page } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const text = (t: string) => ({
  type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: t, version: 1,
})

const paragraph = (t: string, dir: 'ltr' | 'rtl' = 'ltr') => ({
  type: 'paragraph' as const, children: [text(t)], direction: dir, format: '' as const, indent: 0, textFormat: 0, version: 1,
})

const heading = (t: string, tag: 'h1' | 'h2' | 'h3' = 'h1', dir: 'ltr' | 'rtl' = 'ltr') => ({
  type: 'heading' as const, tag, children: [text(t)], direction: dir, format: '' as const, indent: 0, version: 1,
})

const richText = (dir: 'ltr' | 'rtl' = 'ltr', ...nodes: any[]) => ({
  root: { type: 'root' as const, children: nodes, direction: dir, format: '' as const, indent: 0, version: 1 },
})

// ─── Blog 1: The Orchestral Heart — EN ───────────────────────────────────────

type Blog1Args = {
  heroImage: Media
  imageCello: Media
  imageFlute: Media
  imageHarp: Media
  imageViolin: Media
  imageMixer: Media
  imageConductor: Media
  imageMics: Media
  heroSong: Media
}

export const blogOrchestralHeartData = ({
  heroImage, imageMixer, imageConductor, imageMics, heroSong,
}: Blog1Args): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'the-orchestral-heart',
  _status: 'published',
  isBlog: true,
  title: 'The Orchestral Heart',
  publishedOn: new Date('2024-03-15').toISOString(),
  hero: {
    type: 'lowImpact',
    media: heroImage,
    hasSong: true,
    songGroup: { title: 'The Orchestral Heart — Recording Session', song: heroSong },
    richText: richText('ltr',
      heading('The Orchestral Heart'),
      paragraph('Experience the behind-the-scenes magic of our recording sessions. From the first whispered note to the final thundering crescendo.'),
    ),
    links: [
      { link: { type: 'custom', appearance: 'default', label: 'Watch the Feature', url: '/shop' } },
      { link: { type: 'custom', appearance: 'outline', label: 'Gallery', url: '/author' } },
    ],
  },
  layout: [
    {
      blockType: 'authorHighlights',
      title: 'The Enchanted Armory',
      icon: 'music' as const,
      items: [
        { icon: 'music' as const, title: 'The Elder Cello', description: 'String Section — Represents the voice of the Great Dragon Kings. Deep, resonant tones that shake the very foundations of the ancient halls.' },
        { icon: 'music' as const, title: 'Silver-Wound Flute', description: 'Woodwind Section — The whimsical melody of the Forest Nymphs. Each trill carries the memory of sunlit glades and dancing spirits.' },
        { icon: 'music' as const, title: 'Celestial Harp', description: 'Celestial Section — Evoking the starlit skies of the Astral Plains. Its crystalline arpeggios accompany every moment of wonder.' },
        { icon: 'music' as const, title: 'Midnight Violin', description: 'Lead Section — The mournful theme of the Fallen Kingdom. Its dark, soaring lines tell the story of loss and redemption.' },
      ],
    },
    {
      blockType: 'featureShowcase',
      reverse: false,
      content: richText('ltr',
        heading('Beyond the Score:', 'h2'),
        heading('Capturing the Magic', 'h3'),
        paragraph('Our recording sessions at Abbey Wood Studios involved over 80 musicians from the Royal Philharmonic. Each note was captured in 96kHz High Definition to ensure every emotional nuance of the story translates into your ears.'),
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
    description: 'Experience the behind-the-scenes magic of our recording sessions. From the first whispered note to the final thundering crescendo.',
    image: heroImage,
  },
})

// Blog 1 — AR

export const blogOrchestralHeartAR = (createdPage: Page) => {
  const layout = createdPage.layout as any[]
  const highlightsId = layout[0]?.id
  const highlightsItems = (layout[0] as any)?.items ?? []
  const showcaseId = layout[1]?.id
  const showcaseImages = (layout[1] as any)?.images ?? []
  const heroLinks = (createdPage.hero as any)?.links ?? []

  return {
    title: 'القلب الأوركسترالي',
    hero: {
      richText: richText('rtl', heading('القلب الأوركسترالي', 'h1', 'rtl'), paragraph('عيش سحر الكواليس في جلسات التسجيل. من الملاحظة الأولى المهموسة إلى الذروة الأخيرة الرعدية.', 'rtl')),
      songGroup: { title: 'جلسة تسجيل أبي وود' },
      links: heroLinks.map((l: any, i: number) => ({
        id: l.id,
        link: { ...l.link, label: i === 0 ? 'شاهد الميزة' : 'المعرض' },
      })),
    },
    layout: [
      {
        id: highlightsId,
        blockType: 'authorHighlights',
        title: 'المعرض السحري',
        items: highlightsItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['التشيلو العتيق', 'الناي المجدول بالفضة', 'القيثارة السماوية', 'الكمان الليلي'][i],
          description: [
            'قسم الوتريات — يمثل صوت ملوك التنانين العظام. نغمات عميقة رنانة تهز أسس القاعات القديمة.',
            'قسم آلات النفخ — اللحن الرشيق لحوريات الغابة. كل ترديد يحمل ذكرى المروج المشمسة والأرواح الراقصة.',
            'القسم السماوي — تستحضر السماوات المرصعة بالنجوم. أرپيجياتها البلورية ترافق كل لحظة دهشة.',
            'القسم الرئيسي — الموضوع الحزين للمملكة الساقطة. خطوطه المظلمة المحلقة تحكي قصة الخسارة والفداء.',
          ][i],
        })),
      },
      {
        id: showcaseId,
        blockType: 'featureShowcase',
        content: richText('rtl',
          heading('ما وراء الموسيقى:', 'h2', 'rtl'),
          heading('التقاط السحر', 'h3', 'rtl'),
          paragraph('تضمنت جلسات التسجيل في استوديوهات أبي وود أكثر من ٨٠ موسيقياً من الفيلهارمونية الملكية. كل نغمة سُجلت بدقة ٩٦ كيلوهرتز لضمان نقل كل فارق عاطفي.', 'rtl'),
          paragraph('✓ مزج مكاني Dolby Atmos', 'rtl'),
          paragraph('✓ فرقة إيقاع من ١٤ عازفاً', 'rtl'),
          paragraph('✓ جوقة إنجيل حية في الفصل ١٢', 'rtl'),
        ),
        images: showcaseImages.map((img: any, i: number) => ({
          id: img.id,
          alt: ['لوحة المزج الصوتي بأضواء متوهجة', 'قائد الأوركسترا يوجه الفيلهارمونية الملكية', 'ميكروفونات موضوعة حول آلات الاستوديو'][i],
        })),
      },
    ],
    meta: {
      title: 'القلب الأوركسترالي | الرحلة الموسيقية',
      description: 'عيش سحر الكواليس في جلسات التسجيل. من الملاحظة الأولى المهموسة إلى الذروة الأخيرة الرعدية.',
    },
  }
}

// Blog 1 — PT

export const blogOrchestralHeartPT = (createdPage: Page) => {
  const layout = createdPage.layout as any[]
  const highlightsId = layout[0]?.id
  const highlightsItems = (layout[0] as any)?.items ?? []
  const showcaseId = layout[1]?.id
  const showcaseImages = (layout[1] as any)?.images ?? []
  const heroLinks = (createdPage.hero as any)?.links ?? []

  return {
    title: 'O Coração Orquestral',
    hero: {
      richText: richText('ltr', heading('O Coração Orquestral'), paragraph('Experiencie a magia dos bastidores das nossas sessões de gravação. Da primeira nota sussurrada ao último crescendo atronador.')),
      songGroup: { title: 'Sessão de gravação Abbey Wood' },
      links: heroLinks.map((l: any, i: number) => ({
        id: l.id,
        link: { ...l.link, label: i === 0 ? 'Ver o Documentário' : 'Galeria' },
      })),
    },
    layout: [
      {
        id: highlightsId,
        blockType: 'authorHighlights',
        title: 'O Arsenal Encantado',
        items: highlightsItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['O Violoncelo Ancião', 'Flauta de Prata Enrolada', 'Harpa Celestial', 'Violino da Meia-Noite'][i],
          description: [
            'Secção de Cordas — Representa a voz dos Grandes Reis Dragão. Tons profundos e ressonantes que abalaram as fundações das salas antigas.',
            'Secção de Sopros — A melodia caprichosa das Ninfas da Floresta. Cada trinado carrega a memória de clareiras ensolaradas e espíritos dançantes.',
            'Secção Celestial — Evocando os céus estrelados das Planícies Astrais. Os seus arpejos cristalinos acompanham cada momento de maravilha.',
            'Secção Principal — O tema melancólico do Reino Caído. As suas linhas sombrias e soarantes contam a história da perda e da redenção.',
          ][i],
        })),
      },
      {
        id: showcaseId,
        blockType: 'featureShowcase',
        content: richText('ltr',
          heading('Para Além da Partitura:', 'h2'),
          heading('Capturar a Magia', 'h3'),
          paragraph('As nossas sessões de gravação nos Estúdios Abbey Wood envolveram mais de 80 músicos da Filarmónica Real. Cada nota foi capturada em alta definição de 96kHz para garantir que cada nuance emocional se traduz nos seus ouvidos.'),
          paragraph('✓ Mistura Espacial Dolby Atmos'),
          paragraph('✓ Conjunto de Percussão de 14 peças'),
          paragraph('✓ Coro Gospel ao Vivo no Capítulo 12'),
        ),
        images: showcaseImages.map((img: any, i: number) => ({
          id: img.id,
          alt: ['Mesa de mistura de som com luzes brilhantes', 'Maestro a dirigir a Filarmónica Real', 'Microfones colocados em redor dos instrumentos do estúdio'][i],
        })),
      },
    ],
    meta: {
      title: 'O Coração Orquestral | Jornada Musical',
      description: 'Experiencie a magia dos bastidores das nossas sessões de gravação. Da primeira nota sussurrada ao último crescendo atronador.',
    },
  }
}

// ─── Blog 2: The Dragon's Lullaby — EN ───────────────────────────────────────

export const blogDragonsLullabyData = ({
  heroImage, imageCello, imageConductor, heroSong,
}: {
  heroImage: Media; imageCello: Media; imageConductor: Media; heroSong: Media
}): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'the-dragons-lullaby',
  _status: 'published',
  isBlog: true,
  title: "The Dragon's Lullaby: Composing the Official Book Theme",
  publishedOn: new Date('2024-02-01').toISOString(),
  hero: {
    type: 'lowImpact',
    media: heroImage,
    hasSong: true,
    songGroup: { title: "The Dragon's Lullaby", song: heroSong },
    richText: richText('ltr',
      heading("The Dragon's Lullaby"),
      paragraph("How we composed the haunting official theme that plays at the opening of every chapter. A journey through motif, melody, and myth."),
    ),
    links: [],
  },
  layout: [
    {
      blockType: 'featureShowcase',
      reverse: true,
      content: richText('ltr',
        heading('From Sketch to Symphony', 'h2'),
        paragraph("The Dragon's Lullaby began as a four-bar piano sketch written at 2am after finishing the first draft of Chapter 1. It captures the duality of the Great Dragon — ancient and tender, fearsome and protective."),
        paragraph('We worked with a 60-piece string section to build out the full orchestration, layering the motif across 12 variations that each correspond to a different emotional arc in the story.'),
      ),
      images: [
        { image: imageCello, alt: 'The Elder Cello — the heart of the Dragon theme' },
        { image: imageConductor, alt: 'Conductor shaping the emotional arc of the lullaby' },
      ],
    },
    {
      blockType: 'authorHighlights',
      title: 'The Three Motifs',
      icon: 'music' as const,
      items: [
        { icon: 'music' as const, title: 'The Awakening', description: 'The opening four bars — a gentle, rising phrase in D minor that introduces the Dragon before it is ever seen on the page.' },
        { icon: 'fire' as const, title: 'The Fury', description: 'A thundering variation in the brass and low strings, reserved for the climactic battle scenes of Part III.' },
        { icon: 'star' as const, title: 'The Farewell', description: 'The closing reprise — the same four bars, now in D major, played solo on the Midnight Violin. A moment of pure catharsis.' },
      ],
    },
    {
      blockType: 'linkToContact',
      title: 'Want the Sheet Music?',
      description: "Subscribe to receive the official sheet music for The Dragon's Lullaby, plus exclusive audio commentary from the composer.",
      inputPlaceholder: 'Enter your email address...',
      link: { type: 'custom', appearance: 'default', label: 'Send Me the Score', url: '/contact' },
    },
  ],
  meta: {
    title: "The Dragon's Lullaby | Behind the Score",
    description: "How we composed the haunting official theme for The Symphony of Stories. A journey through motif, melody, and myth.",
    image: heroImage,
  },
})

// Blog 2 — AR

export const blogDragonsLullabyAR = (createdPage: Page) => {
  const layout = createdPage.layout as any[]
  const showcaseId = layout[0]?.id
  const showcaseImages = (layout[0] as any)?.images ?? []
  const highlightsId = layout[1]?.id
  const highlightsItems = (layout[1] as any)?.items ?? []
  const ctaId = layout[2]?.id

  return {
    title: 'تهويدة التنين: تأليف الموضوع الرسمي للكتاب',
    hero: {
      richText: richText('rtl', heading('تهويدة التنين', 'h1', 'rtl'), paragraph('كيف ألّفنا الموضوع الرسمي المبهج الذي يُعزف في مطلع كل فصل. رحلة عبر الدوافع اللحنية والأسطورة.', 'rtl')),
      songGroup: { title: 'تهويدة التنين' },
    },
    layout: [
      {
        id: showcaseId,
        blockType: 'featureShowcase',
        content: richText('rtl',
          heading('من الرسم إلى السيمفونية', 'h2', 'rtl'),
          paragraph('بدأت تهويدة التنين كمقطع بيانو من أربعة أشرطة كُتب في الساعة الثانية صباحاً. يجسّد ازدواجية التنين العظيم — العتيق والرقيق، المرعب والحامي.', 'rtl'),
          paragraph('عملنا مع قسم وتريات من ٦٠ عازفاً لبناء التوزيع الأوركسترالي الكامل، مع تطبيق الدافع عبر ١٢ تنويعاً يقابل كل منها قوساً عاطفياً مختلفاً في القصة.', 'rtl'),
        ),
        images: showcaseImages.map((img: any, i: number) => ({
          id: img.id,
          alt: ['التشيلو العتيق — قلب موضوع التنين', 'قائد الأوركسترا يشكّل القوس العاطفي للتهويدة'][i],
        })),
      },
      {
        id: highlightsId,
        blockType: 'authorHighlights',
        title: 'الدوافع الثلاثة',
        items: highlightsItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['الصحوة', 'الغضب', 'الوداع'][i],
          description: [
            'الأشرطة الأربعة الافتتاحية — عبارة هادئة صاعدة في ري الصغير تُقدّم التنين قبل رؤيته في الصفحة.',
            'تنويع رعدي في آلات النحاس والوتريات السفلى، مخصص لمشاهد المعركة الختامية في الجزء الثالث.',
            'الإعادة الختامية — نفس الأشرطة الأربعة، الآن في ري الكبير، تُعزف منفردة على الكمان الليلي.',
          ][i],
        })),
      },
      {
        id: ctaId,
        blockType: 'linkToContact',
        title: 'تريد النوتة الموسيقية؟',
        description: 'اشترك لتلقي النوتة الرسمية لتهويدة التنين، بالإضافة إلى تعليق صوتي حصري من المؤلف.',
        inputPlaceholder: 'أدخل عنوان بريدك الإلكتروني...',
        link: { type: 'custom', appearance: 'default', label: 'أرسل لي النوتة', url: '/contact' },
      },
    ],
    meta: {
      title: 'تهويدة التنين | خلف الموسيقى',
      description: 'كيف ألّفنا الموضوع الرسمي المبهج للكتاب. رحلة عبر الدوافع اللحنية والأسطورة.',
    },
  }
}

// Blog 2 — PT

export const blogDragonsLullabyPT = (createdPage: Page) => {
  const layout = createdPage.layout as any[]
  const showcaseId = layout[0]?.id
  const showcaseImages = (layout[0] as any)?.images ?? []
  const highlightsId = layout[1]?.id
  const highlightsItems = (layout[1] as any)?.items ?? []
  const ctaId = layout[2]?.id

  return {
    title: 'A Cantiga do Dragão: Compondo o Tema Oficial do Livro',
    hero: {
      richText: richText('ltr', heading('A Cantiga do Dragão'), paragraph('Como compusemos o tema oficial assombrado que toca no início de cada capítulo. Uma jornada pelo motivo, melodia e mito.')),
      songGroup: { title: 'A Cantiga do Dragão' },
    },
    layout: [
      {
        id: showcaseId,
        blockType: 'featureShowcase',
        content: richText('ltr',
          heading('Do Esboço à Sinfonia', 'h2'),
          paragraph("A Cantiga do Dragão começou como um esboço de piano de quatro compassos escrito às 2h da manhã. Captura a dualidade do Grande Dragão — antigo e ternurento, assustador e protetor."),
          paragraph('Trabalhámos com uma secção de cordas de 60 peças para construir a orquestração completa, sobrepondo o motivo em 12 variações que correspondem cada uma a um arco emocional diferente.'),
        ),
        images: showcaseImages.map((img: any, i: number) => ({
          id: img.id,
          alt: ['O Violoncelo Ancião — o coração do tema do Dragão', 'Maestro a moldar o arco emocional da cantiga'][i],
        })),
      },
      {
        id: highlightsId,
        blockType: 'authorHighlights',
        title: 'Os Três Motivos',
        items: highlightsItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['O Despertar', 'A Fúria', 'A Despedida'][i],
          description: [
            'Os quatro compassos iniciais — uma frase suave e ascendente em ré menor que apresenta o Dragão antes de ser visto na página.',
            'Uma variação atronadora nos metais e cordas graves, reservada para as cenas de batalha climáticas da Parte III.',
            'A reexposição final — os mesmos quatro compassos, agora em ré maior, tocados a solo no Violino da Meia-Noite.',
          ][i],
        })),
      },
      {
        id: ctaId,
        blockType: 'linkToContact',
        title: 'Quer a Partitura?',
        description: 'Subscreva para receber a partitura oficial da Cantiga do Dragão, mais comentário áudio exclusivo do compositor.',
        inputPlaceholder: 'Introduza o seu endereço de email...',
        link: { type: 'custom', appearance: 'default', label: 'Enviar-me a Partitura', url: '/contact' },
      },
    ],
    meta: {
      title: 'A Cantiga do Dragão | Por Trás da Partitura',
      description: 'Como compusemos o tema oficial assombrado do livro. Uma jornada pelo motivo, melodia e mito.',
    },
  }
}

// ─── Blog 3: Writing with Music — EN ─────────────────────────────────────────

export const blogWritingWithMusicData = ({
  heroImage, imageHarp, imageFlute,
}: {
  heroImage: Media; imageHarp: Media; imageFlute: Media
}): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'writing-with-music',
  _status: 'published',
  isBlog: true,
  title: 'Writing with Music: My Creative Process',
  publishedOn: new Date('2024-01-10').toISOString(),
  hero: {
    type: 'lowImpact',
    media: heroImage,
    richText: richText('ltr',
      heading('Writing with Music: My Creative Process'),
      paragraph('Every word I write is shaped by sound. Here is how I use music not just as inspiration, but as a structural tool for storytelling.'),
    ),
    links: [],
  },
  layout: [
    {
      blockType: 'featureShowcase',
      reverse: false,
      content: richText('ltr',
        heading('The Score Comes First', 'h2'),
        paragraph("Most authors outline their chapters before writing. I compose the music first. Each character has a leitmotif — a short musical phrase that evolves as the character grows. When I hear the motif change, I know the character has changed too."),
        paragraph("The Celestial Harp represents the protagonist's wonder and innocence. As the story darkens, the harp is gradually replaced by the Midnight Violin — the same melody, but in a minor key, played slower and with more weight."),
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
        { icon: 'music' as const, isActive: false, title: 'Compose the Leitmotifs', year: 'Week 1', tag: 'MUSIC FIRST', description: 'Before a single word, I sketch the main musical themes for each character and location on solo piano.' },
        { icon: 'book' as const, isActive: false, title: 'Write the First Draft', year: 'Weeks 2–8', tag: 'WRITING', description: 'I write with the piano sketches on loop. The music dictates the pacing — fast passages for action, slow harmonics for reflection.' },
        { icon: 'sparkles' as const, isActive: false, title: 'Full Orchestration', year: 'Months 3–6', tag: 'ARRANGEMENT', description: 'Once the draft is locked, the sketches are expanded into full orchestral arrangements that mirror the final narrative arc.' },
        { icon: 'star' as const, isActive: true, title: 'Release Together', year: 'Launch Day', tag: 'THE MOMENT', description: 'The book and its full score are released simultaneously — two versions of the same story, in two different languages.' },
      ],
    },
    {
      blockType: 'linkToContact',
      title: 'Curious About the Process?',
      description: 'Join the newsletter to receive writing and composing tips, exclusive behind-the-scenes content, and early access to new releases.',
      inputPlaceholder: 'Your email address',
      link: { type: 'custom', appearance: 'default', label: 'Join the Fellowship', url: '/contact' },
    },
  ],
  meta: {
    title: 'Writing with Music: My Creative Process',
    description: 'Every word is shaped by sound. How I use music as a structural storytelling tool.',
    image: heroImage,
  },
})

// Blog 3 — AR

export const blogWritingWithMusicAR = (createdPage: Page) => {
  const layout = createdPage.layout as any[]
  const showcaseId = layout[0]?.id
  const showcaseImages = (layout[0] as any)?.images ?? []
  const questMapId = layout[1]?.id
  const questMapItems = (layout[1] as any)?.items ?? []
  const ctaId = layout[2]?.id

  return {
    title: 'الكتابة بالموسيقى: عمليتي الإبداعية',
    hero: {
      richText: richText('rtl', heading('الكتابة بالموسيقى: عمليتي الإبداعية', 'h1', 'rtl'), paragraph('كل كلمة أكتبها مشكّلة بالصوت. كيف أستخدم الموسيقى أداةً هيكليةً للسرد وليس مجرد إلهام.', 'rtl')),
    },
    layout: [
      {
        id: showcaseId,
        blockType: 'featureShowcase',
        content: richText('rtl',
          heading('الموسيقى تأتي أولاً', 'h2', 'rtl'),
          paragraph('معظم المؤلفين يرسمون مخططاً لفصولهم قبل الكتابة. أنا أؤلف الموسيقى أولاً. لكل شخصية دافع لحني — عبارة موسيقية قصيرة تتطور مع نمو الشخصية.', 'rtl'),
          paragraph('القيثارة السماوية تمثل دهشة البطل وبراءته. مع تحول القصة إلى الظلام، تُستبدل القيثارة تدريجياً بالكمان الليلي — نفس اللحن، لكن في سلّم صغير، أبطأ وأثقل.', 'rtl'),
        ),
        images: showcaseImages.map((img: any, i: number) => ({
          id: img.id,
          alt: ['القيثارة السماوية — صوت البطل', 'الناي المجدول بالفضة — لحن حوريات الغابة'][i],
        })),
      },
      {
        id: questMapId,
        blockType: 'questMap',
        title: 'إيقاع الكتابة والتأليف لديّ',
        items: questMapItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['تأليف الدوافع اللحنية', 'كتابة المسودة الأولى', 'التوزيع الأوركسترالي الكامل', 'الإصدار معاً'][i],
          year: ['الأسبوع ١', 'الأسابيع ٢-٨', 'الأشهر ٣-٦', 'يوم الإطلاق'][i],
          tag: ['الموسيقى أولاً', 'الكتابة', 'الترتيب', 'اللحظة'][i],
          description: [
            'قبل كلمة واحدة، أرسم الموضوعات الموسيقية الرئيسية لكل شخصية وموقع على البيانو المنفرد.',
            'أكتب مع مقاطع البيانو على التكرار. الموسيقى تحدد الإيقاع — مقاطع سريعة للحركة، توافقيات بطيئة للتأمل.',
            'بمجرد اكتمال المسودة، تُوسَّع المقاطع إلى توزيعات أوركسترالية كاملة تعكس القوس السردي النهائي.',
            'يصدر الكتاب وموسيقاه الكاملة في وقت واحد — نسختان من نفس القصة، بلغتين مختلفتين.',
          ][i],
        })),
      },
      {
        id: ctaId,
        blockType: 'linkToContact',
        title: 'فضولي حول العملية؟',
        description: 'انضم إلى النشرة الإخبارية لتلقي نصائح الكتابة والتأليف ومحتوى حصري من الكواليس وصول مبكر للإصدارات الجديدة.',
        inputPlaceholder: 'عنوان بريدك الإلكتروني',
        link: { type: 'custom', appearance: 'default', label: 'انضم إلى الزمالة', url: '/contact' },
      },
    ],
    meta: {
      title: 'الكتابة بالموسيقى: عمليتي الإبداعية',
      description: 'كل كلمة أكتبها مشكّلة بالصوت. كيف أستخدم الموسيقى أداةً هيكليةً للسرد.',
    },
  }
}

// Blog 3 — PT

export const blogWritingWithMusicPT = (createdPage: Page) => {
  const layout = createdPage.layout as any[]
  const showcaseId = layout[0]?.id
  const showcaseImages = (layout[0] as any)?.images ?? []
  const questMapId = layout[1]?.id
  const questMapItems = (layout[1] as any)?.items ?? []
  const ctaId = layout[2]?.id

  return {
    title: 'Escrever com Música: O Meu Processo Criativo',
    hero: {
      richText: richText('ltr', heading('Escrever com Música: O Meu Processo Criativo'), paragraph('Cada palavra que escrevo é moldada pelo som. Como uso a música não apenas como inspiração, mas como ferramenta estrutural de narrativa.')),
    },
    layout: [
      {
        id: showcaseId,
        blockType: 'featureShowcase',
        content: richText('ltr',
          heading('A Partitura Vem Primeiro', 'h2'),
          paragraph('A maioria dos autores esboça os capítulos antes de escrever. Eu componho a música primeiro. Cada personagem tem um leitmotiv — uma frase musical curta que evolui à medida que a personagem cresce.'),
          paragraph("A Harpa Celestial representa a maravilha e inocência da protagonista. À medida que a história escurece, a harpa é gradualmente substituída pelo Violino da Meia-Noite — a mesma melodia, numa tonalidade menor, mais lenta e pesada."),
        ),
        images: showcaseImages.map((img: any, i: number) => ({
          id: img.id,
          alt: ['A Harpa Celestial — voz da protagonista', 'A Flauta de Prata Enrolada — melodia das Ninfas da Floresta'][i],
        })),
      },
      {
        id: questMapId,
        blockType: 'questMap',
        title: 'O Meu Ritmo de Escrita e Composição',
        items: questMapItems.map((item: any, i: number) => ({
          id: item.id,
          title: ['Compor os Leitmotivs', 'Escrever o Primeiro Rascunho', 'Orquestração Completa', 'Lançar Juntos'][i],
          year: ['Semana 1', 'Semanas 2–8', 'Meses 3–6', 'Dia de Lançamento'][i],
          tag: ['MÚSICA PRIMEIRO', 'ESCRITA', 'ARRANJO', 'O MOMENTO'][i],
          description: [
            'Antes de uma única palavra, esboço os temas musicais principais para cada personagem e localização no piano solo.',
            'Escrevo com os esboços de piano em loop. A música dita o ritmo — passagens rápidas para a ação, harmónicos lentos para a reflexão.',
            'Uma vez bloqueado o rascunho, os esboços são expandidos em arranjos orquestrais completos que espelham o arco narrativo final.',
            'O livro e a sua partitura completa são lançados simultaneamente — duas versões da mesma história, em dois idiomas diferentes.',
          ][i],
        })),
      },
      {
        id: ctaId,
        blockType: 'linkToContact',
        title: 'Curioso Sobre o Processo?',
        description: 'Junte-se à newsletter para receber dicas de escrita e composição, conteúdo exclusivo dos bastidores e acesso antecipado a novos lançamentos.',
        inputPlaceholder: 'O seu endereço de email',
        link: { type: 'custom', appearance: 'default', label: 'Juntar-me à Confraria', url: '/contact' },
      },
    ],
    meta: {
      title: 'Escrever com Música: O Meu Processo Criativo',
      description: 'Cada palavra é moldada pelo som. Como uso a música como ferramenta estrutural de narrativa.',
    },
  }
}