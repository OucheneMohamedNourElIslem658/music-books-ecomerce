import type { CollectionSlug, File, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { authorPageAR, authorPageData, authorPagePT } from './author-page'
import {
  blogDragonsLullabyAR,
  blogDragonsLullabyData,
  blogDragonsLullabyPT,
  blogOrchestralHeartAR,
  blogOrchestralHeartData,
  blogOrchestralHeartPT,
  blogWritingWithMusicAR,
  blogWritingWithMusicData,
  blogWritingWithMusicPT,
} from './blog-pages'
import { contactFormData, contactPageAR, contactPageData, contactPagePT } from './contact-page'
import { homePageAR, homePageData, homePagePT } from './home-page'
import {
  imageAuthorData,
  imageAuthorFullData,
  imageBook1Data,
  imageBook2Data,
  imageBook3Data,
  imageHeroData,
  songCoralCantataData,
  songCrescendoThemeData,
  songDragonsLullabyData,
  songEchoesThemeData,
  songMidnightSymphonyData,
} from './images'
import {
  imageBlogHeroData,
  imageInstrumentCelloData,
  imageInstrumentFluteData,
  imageInstrumentHarpData,
  imageInstrumentViolinData,
  imageStudioConductorData,
  imageStudioMicsData,
  imageStudioMixerData,
  songOrchestralHeartData,
} from './images-blog'
import { book1AR, book1Data, book1PT, book2AR, book2Data, book2PT, book3AR, book3Data, book3PT } from './products'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'products',
  'forms',
  'form-submissions',
  'variants',
  'variantOptions',
  'variantTypes',
  'carts',
  'transactions',
  'addresses',
  'orders',
  'reviews',
]

const globals: GlobalSlug[] = ['header', 'footer']

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding Melody & Myth database...')

  // ─── Clear ────────────────────────────────────────────────────────────────
  payload.logger.info('— Clearing collections and globals...')

  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: { navItems: [] },
        depth: 0,
        context: { disableRevalidate: true },
      }),
    ),
  )

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection]?.config?.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  await Promise.all([
    payload.delete({ collection: 'users', depth: 0, where: { email: { equals: 'customer@example.com' } } }),
    payload.delete({ collection: 'users', depth: 0, where: { email: { equals: 'aria@example.com' } } }),
    payload.delete({ collection: 'users', depth: 0, where: { email: { equals: 'bastien@example.com' } } }),
  ])

  // ─── Media — Images ───────────────────────────────────────────────────────
  payload.logger.info('— Seeding media (images)...')

  const [
    heroBuffer, book1Buffer, book2Buffer, book3Buffer,
    authorBuffer, authorFullBuffer,
    blogHeroBuffer, celloBuffer, fluteBuffer, harpBuffer,
    violinBuffer, mixerBuffer, conductorBuffer, micsBuffer,
  ] = await Promise.all([
    fetchFileByPath('images', 'hero-midnight-symphony.jpg'),
    fetchFileByPath('images', 'book-cover-crescendo.jpg'),
    fetchFileByPath('images', 'book-cover-coral-cantata.jpg'),
    fetchFileByPath('images', 'book-cover-echoes-gear.jpg'),
    fetchFileByPath('images', 'author-portrait.jpg'),
    fetchFileByPath('images', 'author-full.jpg'),
    fetchFileByPath('images', 'blog-hero-orchestra.jpg'),
    fetchFileByPath('images', 'instrument-cello.jpg'),
    fetchFileByPath('images', 'instrument-flute.jpg'),
    fetchFileByPath('images', 'instrument-harp.jpg'),
    fetchFileByPath('images', 'instrument-violin.jpg'),
    fetchFileByPath('images', 'studio-mixer.jpg'),
    fetchFileByPath('images', 'studio-conductor.jpg'),
    fetchFileByPath('images', 'studio-mics.jpg'),
  ])

  const [
    imageHero, imageBook1, imageBook2, imageBook3,
    imageAuthor, imageAuthorFull,
    imageBlogHero, imageCello, imageFlute, imageHarp,
    imageViolin, imageMixer, imageConductor, imageMics,
  ] = await Promise.all([
    payload.create({ collection: 'media', data: imageHeroData, file: heroBuffer }),
    payload.create({ collection: 'media', data: imageBook1Data, file: book1Buffer }),
    payload.create({ collection: 'media', data: imageBook2Data, file: book2Buffer }),
    payload.create({ collection: 'media', data: imageBook3Data, file: book3Buffer }),
    payload.create({ collection: 'media', data: imageAuthorData, file: authorBuffer }),
    payload.create({ collection: 'media', data: imageAuthorFullData, file: authorFullBuffer }),
    payload.create({ collection: 'media', data: imageBlogHeroData, file: blogHeroBuffer }),
    payload.create({ collection: 'media', data: imageInstrumentCelloData, file: celloBuffer }),
    payload.create({ collection: 'media', data: imageInstrumentFluteData, file: fluteBuffer }),
    payload.create({ collection: 'media', data: imageInstrumentHarpData, file: harpBuffer }),
    payload.create({ collection: 'media', data: imageInstrumentViolinData, file: violinBuffer }),
    payload.create({ collection: 'media', data: imageStudioMixerData, file: mixerBuffer }),
    payload.create({ collection: 'media', data: imageStudioConductorData, file: conductorBuffer }),
    payload.create({ collection: 'media', data: imageStudioMicsData, file: micsBuffer }),
  ])

  // ─── Media — Audio ────────────────────────────────────────────────────────
  payload.logger.info('— Seeding media (audio)...')

  const [
    audioMidnightBuffer,
    audioCrescendoBuffer,
    audioCoralBuffer,
    audioEchoesBuffer,
    audioDragonsBuffer,
    audioOrchestralBuffer,
  ] = await Promise.all([
    fetchFileByPath('audios', 'theme-midnight-symphony.mp3'),
    fetchFileByPath('audios', 'theme-crescendo-of-the-clouds.mp3'),
    fetchFileByPath('audios', 'theme-coral-cantata.mp3'),
    fetchFileByPath('audios', 'theme-echoes-of-the-gear.mp3'),
    fetchFileByPath('audios', 'theme-dragons-lullaby.mp3'),
    fetchFileByPath('audios', 'theme-orchestral-heart.mp3'),
  ])

  const [
    songMidnightSymphony,
    songCrescendoTheme,
    songCoralCantata,
    songEchoesTheme,
    songDragonsLullaby,
    songOrchestralHeart,
  ] = await Promise.all([
    payload.create({ collection: 'media', data: songMidnightSymphonyData, file: audioMidnightBuffer }),
    payload.create({ collection: 'media', data: songCrescendoThemeData, file: audioCrescendoBuffer }),
    payload.create({ collection: 'media', data: songCoralCantataData, file: audioCoralBuffer }),
    payload.create({ collection: 'media', data: songEchoesThemeData, file: audioEchoesBuffer }),
    payload.create({ collection: 'media', data: songDragonsLullabyData, file: audioDragonsBuffer }),
    payload.create({ collection: 'media', data: songOrchestralHeartData, file: audioOrchestralBuffer }),
  ])

  // ─── Categories ───────────────────────────────────────────────────────────
  payload.logger.info('— Seeding categories...')

  const [fantasyCategory, orchestralCategory, steampunkCategory, childrenCategory] =
    await Promise.all([
      payload.create({ collection: 'categories', data: { title: 'Fantasy', slug: 'fantasy' } }),
      payload.create({ collection: 'categories', data: { title: 'Orchestral', slug: 'orchestral' } }),
      payload.create({ collection: 'categories', data: { title: 'Steampunk', slug: 'steampunk' } }),
      payload.create({ collection: 'categories', data: { title: 'Children', slug: 'children' } }),
    ])

  // ─── Customers ────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding customers...')

  const [customer, customer2, customer3] = await Promise.all([
    payload.create({ collection: 'users', data: { name: 'Melody Seeker', email: 'customer@example.com', password: 'password', roles: ['customer'] } }),
    payload.create({ collection: 'users', data: { name: 'Aria Nightingale', email: 'aria@example.com', password: 'password', roles: ['customer'] } }),
    payload.create({ collection: 'users', data: { name: 'Bastien Leclair', email: 'bastien@example.com', password: 'password', roles: ['customer'] } }),
  ])

  // ─── Products ─────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding products...')

  const [product1, product2, product3] = await Promise.all([
    payload.create({
      collection: 'products',
      data: book1Data({ coverImage: imageBook1, categories: [fantasyCategory, orchestralCategory, childrenCategory], relatedProducts: [] }),
    }),
    payload.create({
      collection: 'products',
      data: book2Data({ coverImage: imageBook2, categories: [fantasyCategory, orchestralCategory], relatedProducts: [] }),
    }),
    payload.create({
      collection: 'products',
      data: book3Data({ coverImage: imageBook3, categories: [steampunkCategory, orchestralCategory], relatedProducts: [] }),
    }),
  ])

  // ─── Reviews ──────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding reviews...')

  const [review1a, review1b, review2a, review2b, review3a, review3b] = await Promise.all([
    payload.create({ collection: 'reviews', data: { product: product1.id, author: customer.id, rating: 5, comment: 'Soaring through the clouds has never felt so real.', status: 'approved' } }),
    payload.create({ collection: 'reviews', data: { product: product1.id, author: customer2.id, rating: 4, comment: 'The orchestral score made every chapter feel cinematic.', status: 'approved' } }),
    payload.create({ collection: 'reviews', data: { product: product2.id, author: customer.id, rating: 5, comment: 'The Coral Cantata is breathtaking.', status: 'approved' } }),
    payload.create({ collection: 'reviews', data: { product: product2.id, author: customer3.id, rating: 5, comment: 'I read it twice. The music made the second read completely different.', status: 'approved' } }),
    payload.create({ collection: 'reviews', data: { product: product3.id, author: customer2.id, rating: 4, comment: 'Echoes of the Gear surprised me with its depth.', status: 'approved' } }),
    payload.create({ collection: 'reviews', data: { product: product3.id, author: customer3.id, rating: 5, comment: 'The steampunk setting with orchestral music is a combination I never knew I needed.', status: 'approved' } }),
  ])

  // ─── Attach reviews + related products ───────────────────────────────────
  await Promise.all([
    payload.update({ collection: 'products', id: product1.id, data: { popularReviews: [review1a.id, review1b.id], relatedProducts: [product2.id, product3.id] } }),
    payload.update({ collection: 'products', id: product2.id, data: { popularReviews: [review2a.id, review2b.id], relatedProducts: [product1.id, product3.id] } }),
    payload.update({ collection: 'products', id: product3.id, data: { popularReviews: [review3a.id, review3b.id], relatedProducts: [product1.id, product2.id] } }),
  ])

  // ─── Variant types ────────────────────────────────────────────────────────
  payload.logger.info('— Seeding variants...')

  const langVariantType = await payload.create({ collection: 'variantTypes', data: { name: 'language', label: 'Language' } })
  const sizeVariantType = await payload.create({ collection: 'variantTypes', data: { name: 'size', label: 'Edition' } })

  const [langEN, langAR, langPT] = await Promise.all([
    payload.create({ collection: 'variantOptions', data: { label: 'English', value: 'en', variantType: langVariantType.id } }),
    payload.create({ collection: 'variantOptions', data: { label: 'Arabic', value: 'ar', variantType: langVariantType.id } }),
    payload.create({ collection: 'variantOptions', data: { label: 'Portuguese', value: 'pt', variantType: langVariantType.id } }),
  ])

  const [sizeStandard, sizeDeluxe] = await Promise.all([
    payload.create({ collection: 'variantOptions', data: { label: 'Standard (200 pages)', value: 'standard', variantType: sizeVariantType.id } }),
    payload.create({ collection: 'variantOptions', data: { label: 'Deluxe (350 pages + Sheet Music)', value: 'deluxe', variantType: sizeVariantType.id } }),
  ])

  await Promise.all([
    payload.create({ collection: 'variants', data: { product: product1, options: [langEN, sizeStandard], priceInUSD: 2400, priceInUSDEnabled: true, inventory: 100, _status: 'published' } }),
    payload.create({ collection: 'variants', data: { product: product1, options: [langEN, sizeDeluxe], priceInUSD: 3800, priceInUSDEnabled: true, inventory: 50, _status: 'published' } }),
    payload.create({ collection: 'variants', data: { product: product1, options: [langAR, sizeStandard], priceInUSD: 2200, priceInUSDEnabled: true, inventory: 80, _status: 'published' } }),
    payload.create({ collection: 'variants', data: { product: product1, options: [langPT, sizeDeluxe], priceInUSD: 3600, priceInUSDEnabled: true, inventory: 40, _status: 'published' } }),
  ])

  await payload.update({
    collection: 'products',
    id: product1.id,
    data: { enableVariants: true, variantTypes: [langVariantType.id, sizeVariantType.id] },
  })

  // ─── Contact form ─────────────────────────────────────────────────────────
  payload.logger.info('— Seeding contact form...')

  const contactForm = await payload.create({ collection: 'forms', depth: 0, data: contactFormData() as any })

  // ─── Pages (EN) — created as the default locale ───────────────────────────
  // IMPORTANT: EN must be created first so we get the document IDs, but then
  // we re-apply it LAST after all other locales have been written.
  // Payload writes the last locale update over any un-localised (shared) fields,
  // so whichever locale is written last "wins" for those fields. By re-applying
  // EN at the end every page is fully populated in the default locale.
  payload.logger.info('— Seeding pages (EN — initial create for IDs)...')

  const [homePage, authorPage, contactPage, blogOrchestral, blogDragons, blogWriting] =
    await Promise.all([
      payload.create({
        collection: 'pages', depth: 0, locale: 'en',
        data: homePageData({
          heroImage: imageHero, book1: imageBook1, book2: imageBook2, book3: imageBook3,
          authorImage: imageAuthor, product1Id: product1.id, product2Id: product2.id, product3Id: product3.id,
          heroSong: songMidnightSymphony,
        }),
      }),
      payload.create({ collection: 'pages', depth: 0, locale: 'en', data: authorPageData({ authorFullImage: imageAuthorFull }) }),
      payload.create({ collection: 'pages', depth: 0, locale: 'en', data: contactPageData({ contactForm }) }),
      payload.create({
        collection: 'pages', depth: 0, locale: 'en',
        data: blogOrchestralHeartData({
          heroImage: imageBlogHero, imageCello, imageFlute, imageHarp,
          imageViolin, imageMixer, imageConductor, imageMics,
          heroSong: songOrchestralHeart,
        }),
      }),
      payload.create({
        collection: 'pages', depth: 0, locale: 'en',
        data: blogDragonsLullabyData({
          heroImage: imageBlogHero, imageCello, imageConductor,
          heroSong: songDragonsLullaby,
        }),
      }),
      payload.create({
        collection: 'pages', depth: 0, locale: 'en',
        data: blogWritingWithMusicData({ heroImage: imageBlogHero, imageHarp, imageFlute }),
      }),
    ])

  // ─── Pages — Arabic translations ──────────────────────────────────────────
  payload.logger.info('— Seeding translations (AR)...')

  await payload.update({ collection: 'pages', id: homePage.id, locale: 'ar', data: homePageAR({ heroImage: imageHero, authorImage: imageAuthor, heroSong: songMidnightSymphony, product1Id: product1.id, product2Id: product2.id, product3Id: product3.id }) })
  await payload.update({ collection: 'pages', id: authorPage.id, locale: 'ar', data: authorPageAR({ authorFullImage: imageAuthorFull }) })
  await payload.update({ collection: 'pages', id: contactPage.id, locale: 'ar', data: contactPageAR({ contactForm }) })
  await payload.update({ collection: 'pages', id: blogOrchestral.id, locale: 'ar', data: blogOrchestralHeartAR({ heroImage: imageBlogHero, imageMixer, imageConductor, imageMics, heroSong: songOrchestralHeart }) })
  await payload.update({ collection: 'pages', id: blogDragons.id, locale: 'ar', data: blogDragonsLullabyAR({ heroImage: imageBlogHero, imageCello, imageConductor, heroSong: songDragonsLullaby }) })
  await payload.update({ collection: 'pages', id: blogWriting.id, locale: 'ar', data: blogWritingWithMusicAR({ heroImage: imageBlogHero, imageHarp, imageFlute }) })

  // ─── Products — Arabic translations ───────────────────────────────────────
  await payload.update({ collection: 'products', id: product1.id, locale: 'ar', data: book1AR() })
  await payload.update({ collection: 'products', id: product2.id, locale: 'ar', data: book2AR() })
  await payload.update({ collection: 'products', id: product3.id, locale: 'ar', data: book3AR() })

  // ─── Pages — Portuguese translations ──────────────────────────────────────
  payload.logger.info('— Seeding translations (PT)...')

  await payload.update({ collection: 'pages', id: homePage.id, locale: 'pt', data: homePagePT({ heroImage: imageHero, authorImage: imageAuthor, heroSong: songMidnightSymphony, product1Id: product1.id, product2Id: product2.id, product3Id: product3.id }) })
  await payload.update({ collection: 'pages', id: authorPage.id, locale: 'pt', data: authorPagePT({ authorFullImage: imageAuthorFull }) })
  await payload.update({ collection: 'pages', id: contactPage.id, locale: 'pt', data: contactPagePT({ contactForm }) })
  await payload.update({ collection: 'pages', id: blogOrchestral.id, locale: 'pt', data: blogOrchestralHeartPT({ heroImage: imageBlogHero, imageMixer, imageConductor, imageMics, heroSong: songOrchestralHeart }) })
  await payload.update({ collection: 'pages', id: blogDragons.id, locale: 'pt', data: blogDragonsLullabyPT({ heroImage: imageBlogHero, imageCello, imageConductor, heroSong: songDragonsLullaby }) })
  await payload.update({ collection: 'pages', id: blogWriting.id, locale: 'pt', data: blogWritingWithMusicPT({ heroImage: imageBlogHero, imageHarp, imageFlute }) })

  // ─── Products — Portuguese translations ────────────────────────────────────
  await payload.update({ collection: 'products', id: product1.id, locale: 'pt', data: book1PT() })
  await payload.update({ collection: 'products', id: product2.id, locale: 'pt', data: book2PT() })
  await payload.update({ collection: 'products', id: product3.id, locale: 'pt', data: book3PT() })

  // ─── Pages — English re-apply (must be LAST) ──────────────────────────────
  // Re-writing EN after all other locales ensures the default locale is never
  // left with empty strings from a subsequent locale update overwriting shared
  // (non-localised) fields.
  payload.logger.info('— Re-seeding pages (EN — final write to lock in default locale)...')

  await payload.update({
    collection: 'pages', id: homePage.id, locale: 'en',
    data: homePageData({
      heroImage: imageHero, book1: imageBook1, book2: imageBook2, book3: imageBook3,
      authorImage: imageAuthor, product1Id: product1.id, product2Id: product2.id, product3Id: product3.id,
      heroSong: songMidnightSymphony,
    }),
  })
  await payload.update({ collection: 'pages', id: authorPage.id, locale: 'en', data: authorPageData({ authorFullImage: imageAuthorFull }) })
  await payload.update({ collection: 'pages', id: contactPage.id, locale: 'en', data: contactPageData({ contactForm }) })
  await payload.update({
    collection: 'pages', id: blogOrchestral.id, locale: 'en',
    data: blogOrchestralHeartData({
      heroImage: imageBlogHero, imageCello, imageFlute, imageHarp,
      imageViolin, imageMixer, imageConductor, imageMics,
      heroSong: songOrchestralHeart,
    }),
  })
  await payload.update({
    collection: 'pages', id: blogDragons.id, locale: 'en',
    data: blogDragonsLullabyData({
      heroImage: imageBlogHero, imageCello, imageConductor,
      heroSong: songDragonsLullaby,
    }),
  })
  await payload.update({ collection: 'pages', id: blogWriting.id, locale: 'en', data: blogWritingWithMusicData({ heroImage: imageBlogHero, imageHarp, imageFlute }) })

  // ─── Products — English re-apply ──────────────────────────────────────────
  await payload.update({ collection: 'products', id: product1.id, locale: 'en', data: book1Data({ coverImage: imageBook1, categories: [fantasyCategory, orchestralCategory, childrenCategory], relatedProducts: [product2.id, product3.id], song: songCrescendoTheme }) })
  await payload.update({ collection: 'products', id: product2.id, locale: 'en', data: book2Data({ coverImage: imageBook2, categories: [fantasyCategory, orchestralCategory], relatedProducts: [product1.id, product3.id], song: songCoralCantata }) })
  await payload.update({ collection: 'products', id: product3.id, locale: 'en', data: book3Data({ coverImage: imageBook3, categories: [steampunkCategory, orchestralCategory], relatedProducts: [product1.id, product2.id], song: songEchoesTheme }) })

  payload.logger.info('— Seeding globals...')

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          { link: { type: 'custom', label: 'The Library', url: '/shop' } },
          { link: { type: 'custom', label: 'Musical Journey', url: '/the-orchestral-heart' } },
          { link: { type: 'custom', label: 'About the Author', url: '/author' } },
          { link: { type: 'custom', label: 'Contact', url: '/contact' } },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          { link: { type: 'custom', label: 'The Library', url: '/shop' } },
          { link: { type: 'custom', label: 'Author', url: '/author' } },
          { link: { type: 'custom', label: 'Find My Order', url: '/find-order' } },
          { link: { type: 'custom', label: 'Contact', url: '/contact' } },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

// ─── File loader ──────────────────────────────────────────────────────────────
// Looks in src/endpoints/seed/{folder}/{filename}
// Falls back to a silent placeholder so the seed never crashes on missing files.

async function fetchFileByPath(folder: 'images' | 'audios', filename: string): Promise<File> {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const { fileURLToPath } = await import('url')
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const filePath = path.resolve(__dirname, folder, filename)

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath)
      const ext = filename.split('.').pop() ?? ''
      const mimeMap: Record<string, string> = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg',
        png: 'image/png', webp: 'image/webp',
        mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg',
      }
      return { name: filename, data: Buffer.from(data), mimetype: mimeMap[ext] ?? 'application/octet-stream', size: data.byteLength }
    }
  } catch { /* fall through */ }

  // Silent placeholder — 1x1 PNG for images, empty buffer for audio
  const isAudio = folder === 'audios'
  const placeholder = isAudio
    ? Buffer.alloc(0)
    : Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
  return {
    name: filename,
    data: placeholder,
    mimetype: isAudio ? 'audio/mpeg' : 'image/png',
    size: placeholder.byteLength,
  }
}