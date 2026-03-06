import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactFormData, contactPageData } from './contact-page'
import { homePageData } from './home-page'
import { authorPageData } from './author-page'
import { book1Data, book2Data, book3Data } from './products'
import {
  imageHeroData,
  imageBook1Data,
  imageBook2Data,
  imageBook3Data,
  imageAuthorData,
  imageAuthorFullData,
} from './images'
import {
  imageBlogHeroData,
  imageInstrumentCelloData,
  imageInstrumentFluteData,
  imageInstrumentHarpData,
  imageInstrumentViolinData,
  imageStudioMixerData,
  imageStudioConductorData,
  imageStudioMicsData,
} from './images-blog'
import {
  blogOrchestralHeartData,
  blogDragonsLullabyData,
  blogWritingWithMusicData,
} from './blog-pages'

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

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: { email: { equals: 'customer@example.com' } },
  })

  // ─── Media ────────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding media...')

  const [
    heroBuffer, book1Buffer, book2Buffer, book3Buffer,
    authorBuffer, authorFullBuffer,
    blogHeroBuffer, celloBuffer, fluteBuffer, harpBuffer,
    violinBuffer, mixerBuffer, conductorBuffer, micsBuffer,
  ] = await Promise.all([
    fetchFileByPath('hero-midnight-symphony.jpg'),
    fetchFileByPath('book-cover-crescendo.jpg'),
    fetchFileByPath('book-cover-coral-cantata.jpg'),
    fetchFileByPath('book-cover-echoes-gear.jpg'),
    fetchFileByPath('author-portrait.jpg'),
    fetchFileByPath('author-full.jpg'),
    fetchFileByPath('blog-hero-orchestra.jpg'),
    fetchFileByPath('instrument-cello.jpg'),
    fetchFileByPath('instrument-flute.jpg'),
    fetchFileByPath('instrument-harp.jpg'),
    fetchFileByPath('instrument-violin.jpg'),
    fetchFileByPath('studio-mixer.jpg'),
    fetchFileByPath('studio-conductor.jpg'),
    fetchFileByPath('studio-mics.jpg'),
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

  // ─── Categories ───────────────────────────────────────────────────────────
  payload.logger.info('— Seeding categories...')

  const [fantasyCategory, orchestralCategory, steampunkCategory, childrenCategory] =
    await Promise.all([
      payload.create({ collection: 'categories', data: { title: 'Fantasy', slug: 'fantasy' } }),
      payload.create({ collection: 'categories', data: { title: 'Orchestral', slug: 'orchestral' } }),
      payload.create({ collection: 'categories', data: { title: 'Steampunk', slug: 'steampunk' } }),
      payload.create({ collection: 'categories', data: { title: 'Children', slug: 'children' } }),
    ])

  // ─── Customer ─────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding customer...')

  const customer = await payload.create({
    collection: 'users',
    data: {
      name: 'Melody Seeker',
      email: 'customer@example.com',
      password: 'password',
      roles: ['customer'],
    },
  })

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

  await Promise.all([
    payload.update({ collection: 'products', id: product1.id, data: { relatedProducts: [product2.id, product3.id] } }),
    payload.update({ collection: 'products', id: product2.id, data: { relatedProducts: [product1.id, product3.id] } }),
    payload.update({ collection: 'products', id: product3.id, data: { relatedProducts: [product1.id, product2.id] } }),
  ])

  // ─── Reviews ──────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding reviews...')

  await Promise.all([
    payload.create({ collection: 'reviews', data: { product: product1.id, author: customer.id, rating: 5, comment: 'An absolutely magical journey! The melodies that accompany each chapter made me feel like I was truly soaring through the clouds.', status: 'approved' } }),
    payload.create({ collection: 'reviews', data: { product: product2.id, author: customer.id, rating: 5, comment: 'The Coral Cantata is breathtaking. The underwater world feels so alive and the music perfectly captures the mystery of the deep.', status: 'approved' } }),
    payload.create({ collection: 'reviews', data: { product: product3.id, author: customer.id, rating: 4, comment: 'Echoes of the Gear surprised me with its depth. The steampunk setting paired with orchestral music is a combination I never knew I needed.', status: 'approved' } }),
  ])

  // ─── Contact form ─────────────────────────────────────────────────────────
  payload.logger.info('— Seeding contact form...')

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData() as any,
  })

  // ─── Pages ────────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding pages...')

  await Promise.all([
    payload.create({
      collection: 'pages', depth: 0,
      data: homePageData({ heroImage: imageHero, book1: imageBook1, book2: imageBook2, book3: imageBook3, authorImage: imageAuthor, product1Id: product1.id, product2Id: product2.id, product3Id: product3.id }),
    }),
    payload.create({ collection: 'pages', depth: 0, data: authorPageData({ authorFullImage: imageAuthorFull }) }),
    payload.create({ collection: 'pages', depth: 0, data: contactPageData({ contactForm }) }),

    // Blog posts
    payload.create({
      collection: 'pages', depth: 0,
      data: blogOrchestralHeartData({ heroImage: imageBlogHero, imageCello, imageFlute, imageHarp, imageViolin, imageMixer, imageConductor, imageMics }),
    }),
    payload.create({
      collection: 'pages', depth: 0,
      data: blogDragonsLullabyData({ heroImage: imageBlogHero, imageCello, imageConductor }),
    }),
    payload.create({
      collection: 'pages', depth: 0,
      data: blogWritingWithMusicData({ heroImage: imageBlogHero, imageHarp, imageFlute }),
    }),
  ])

  // ─── Globals ──────────────────────────────────────────────────────────────
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

async function fetchFileByPath(filename: string): Promise<File> {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const { fileURLToPath } = await import('url')
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const filePath = path.resolve(__dirname, 'images', filename)

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath)
      const ext = filename.split('.').pop() ?? 'jpg'
      const mimeMap: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
      return { name: filename, data: Buffer.from(data), mimetype: mimeMap[ext] ?? 'image/jpeg', size: data.byteLength }
    }
  } catch { /* fall through */ }

  // 1x1 transparent PNG placeholder
  const placeholder = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
  return { name: filename, data: placeholder, mimetype: 'image/png', size: placeholder.byteLength }
}
