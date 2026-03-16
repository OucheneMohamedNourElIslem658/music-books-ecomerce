import type { File, Payload, PayloadRequest } from 'payload'

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
import {
  book1AR, book1Data, book1PT,
  book2AR, book2Data, book2PT,
  book3AR, book3Data, book3PT,
} from './products'


export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding Melody & Myth database...')

  // ─── Targeted cleanup (delete only seed-owned docs by slug/email/slug) ───────
  // This lets you re-seed without wiping the whole DB — user accounts, orders,
  // carts, and any other non-seed data are left untouched.
  payload.logger.info('— Removing existing seed documents...')

  // Pages — by slug
  for (const slug of [
    'home', 'author', 'contact',
    'the-orchestral-heart', 'the-dragons-lullaby', 'writing-with-music',
  ]) {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, depth: 0, limit: 1 })
    if (existing.docs.length > 0) {
      await payload.delete({ collection: 'pages', id: existing.docs[0]!.id, depth: 0 })
    }
  }

  // Products — by slug
  for (const slug of ['crescendo-of-the-clouds', 'the-coral-cantata', 'echoes-of-the-gear']) {
    const existing = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, depth: 0, limit: 1 })
    if (existing.docs.length > 0) {
      await payload.delete({ collection: 'products', id: existing.docs[0]!.id, depth: 0 })
    }
  }

  // Seed customers — by email
  for (const email of ['customer@example.com', 'aria@example.com', 'bastien@example.com']) {
    const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, depth: 0, limit: 1 })
    if (existing.docs.length > 0) {
      await payload.delete({ collection: 'users', id: existing.docs[0]!.id, depth: 0 })
    }
  }

  // Contact form — by title
  const existingForm = await payload.find({ collection: 'forms', where: { title: { equals: 'Contact Form' } }, depth: 0, limit: 1 })
  if (existingForm.docs.length > 0) {
    await payload.delete({ collection: 'forms', id: existingForm.docs[0]!.id, depth: 0 })
  }

  // Reset globals — clear ALL locales so stale AR/PT data from a previous seed
  // doesn't linger with old IDs that would conflict with the fresh EN write.
  for (const locale of ['en', 'ar', 'pt'] as const) {
    await payload.updateGlobal({ slug: 'header', locale, data: { navItems: [] }, depth: 0, context: { disableRevalidate: true } })
    await payload.updateGlobal({ slug: 'footer', locale, data: { groups: [], socials: [] }, depth: 0, context: { disableRevalidate: true } })
  }

  // Categories — delete seed-owned ones by slug so they get re-created fresh
  for (const slug of ['fantasy', 'orchestral', 'steampunk', 'children']) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, depth: 0, limit: 1 })
    if (existing.docs.length > 0) {
      await payload.delete({ collection: 'categories', id: existing.docs[0]!.id, depth: 0 })
    }
  }

  // ─── Media ─────────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding media...')

  const [
    heroBuffer, book1Buffer, book2Buffer, book3Buffer,
    authorBuffer, authorFullBuffer, blogHeroBuffer,
    celloBuffer, fluteBuffer, harpBuffer, violinBuffer,
    mixerBuffer, conductorBuffer, micsBuffer,
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
    audioMidnightBuffer, audioCrescendoBuffer, audioCoralBuffer,
    audioEchoesBuffer, audioDragonsBuffer, audioOrchestralBuffer,
  ] = await Promise.all([
    fetchFileByPath('audios', 'theme-midnight-symphony.mp3'),
    fetchFileByPath('audios', 'theme-crescendo-of-the-clouds.mp3'),
    fetchFileByPath('audios', 'theme-coral-cantata.mp3'),
    fetchFileByPath('audios', 'theme-echoes-of-the-gear.mp3'),
    fetchFileByPath('audios', 'theme-dragons-lullaby.mp3'),
    fetchFileByPath('audios', 'theme-orchestral-heart.mp3'),
  ])

  const imageHero = await payload.create({ collection: 'media', data: imageHeroData, file: heroBuffer })
  const imageBook1 = await payload.create({ collection: 'media', data: imageBook1Data, file: book1Buffer })
  const imageBook2 = await payload.create({ collection: 'media', data: imageBook2Data, file: book2Buffer })
  const imageBook3 = await payload.create({ collection: 'media', data: imageBook3Data, file: book3Buffer })
  const imageAuthor = await payload.create({ collection: 'media', data: imageAuthorData, file: authorBuffer })
  const imageAuthorFull = await payload.create({ collection: 'media', data: imageAuthorFullData, file: authorFullBuffer })
  const imageBlogHero = await payload.create({ collection: 'media', data: imageBlogHeroData, file: blogHeroBuffer })
  const imageCello = await payload.create({ collection: 'media', data: imageInstrumentCelloData, file: celloBuffer })
  const imageFlute = await payload.create({ collection: 'media', data: imageInstrumentFluteData, file: fluteBuffer })
  const imageHarp = await payload.create({ collection: 'media', data: imageInstrumentHarpData, file: harpBuffer })
  const imageViolin = await payload.create({ collection: 'media', data: imageInstrumentViolinData, file: violinBuffer })
  const imageMixer = await payload.create({ collection: 'media', data: imageStudioMixerData, file: mixerBuffer })
  const imageConductor = await payload.create({ collection: 'media', data: imageStudioConductorData, file: conductorBuffer })
  const imageMics = await payload.create({ collection: 'media', data: imageStudioMicsData, file: micsBuffer })

  const songMidnightSymphony = await payload.create({ collection: 'media', data: songMidnightSymphonyData, file: audioMidnightBuffer })
  const songCrescendoTheme = await payload.create({ collection: 'media', data: songCrescendoThemeData, file: audioCrescendoBuffer })
  const songCoralCantata = await payload.create({ collection: 'media', data: songCoralCantataData, file: audioCoralBuffer })
  const songEchoesTheme = await payload.create({ collection: 'media', data: songEchoesThemeData, file: audioEchoesBuffer })
  const songDragonsLullaby = await payload.create({ collection: 'media', data: songDragonsLullabyData, file: audioDragonsBuffer })
  const songOrchestralHeart = await payload.create({ collection: 'media', data: songOrchestralHeartData, file: audioOrchestralBuffer })

  // ─── Categories ────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding categories...')

  const fantasyCategory = await payload.create({ collection: 'categories', data: { title: 'Fantasy', slug: 'fantasy' } })
  const orchestralCategory = await payload.create({ collection: 'categories', data: { title: 'Orchestral', slug: 'orchestral' } })
  const steampunkCategory = await payload.create({ collection: 'categories', data: { title: 'Steampunk', slug: 'steampunk' } })
  const childrenCategory = await payload.create({ collection: 'categories', data: { title: 'Children', slug: 'children' } })

  // ─── Customers ─────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding customers...')

  const customer = await payload.create({ collection: 'users', data: { name: 'Melody Seeker', email: 'customer@example.com', password: 'password', roles: ['customer'] } })
  const customer2 = await payload.create({ collection: 'users', data: { name: 'Aria Nightingale', email: 'aria@example.com', password: 'password', roles: ['customer'] } })
  const customer3 = await payload.create({ collection: 'users', data: { name: 'Bastien Leclair', email: 'bastien@example.com', password: 'password', roles: ['customer'] } })

  // ─── Products — EN (create, then read back block IDs) ──────────────────────
  payload.logger.info('— Seeding products (EN)...')

  // Create with empty relatedProducts first so we have IDs to cross-reference
  const product1 = await payload.create({ collection: 'products', locale: 'en', data: book1Data({ coverImage: imageBook1, categories: [fantasyCategory, orchestralCategory, childrenCategory], relatedProducts: [], song: songCrescendoTheme }) })
  const product2 = await payload.create({ collection: 'products', locale: 'en', data: book2Data({ coverImage: imageBook2, categories: [fantasyCategory, orchestralCategory], relatedProducts: [], song: songCoralCantata }) })
  const product3 = await payload.create({ collection: 'products', locale: 'en', data: book3Data({ coverImage: imageBook3, categories: [steampunkCategory, orchestralCategory], relatedProducts: [], song: songEchoesTheme }) })

  // Now update with actual related products cross-links
  await payload.update({ collection: 'products', id: product1.id, data: { relatedProducts: [product2.id, product3.id] } })
  await payload.update({ collection: 'products', id: product2.id, data: { relatedProducts: [product1.id, product3.id] } })
  await payload.update({ collection: 'products', id: product3.id, data: { relatedProducts: [product1.id, product2.id] } })

  // ─── Reviews ───────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding reviews...')

  const review1a = await payload.create({ collection: 'reviews', data: { product: product1.id, author: customer.id, rating: 5, comment: 'Soaring through the clouds has never felt so real.', status: 'approved' } })
  const review1b = await payload.create({ collection: 'reviews', data: { product: product1.id, author: customer2.id, rating: 4, comment: 'The orchestral score made every chapter feel cinematic.', status: 'approved' } })
  const review2a = await payload.create({ collection: 'reviews', data: { product: product2.id, author: customer.id, rating: 5, comment: 'The Coral Cantata is breathtaking.', status: 'approved' } })
  const review2b = await payload.create({ collection: 'reviews', data: { product: product2.id, author: customer3.id, rating: 5, comment: 'I read it twice. The music made the second read completely different.', status: 'approved' } })
  const review3a = await payload.create({ collection: 'reviews', data: { product: product3.id, author: customer2.id, rating: 4, comment: 'Echoes of the Gear surprised me with its depth.', status: 'approved' } })
  const review3b = await payload.create({ collection: 'reviews', data: { product: product3.id, author: customer3.id, rating: 5, comment: 'The steampunk setting with orchestral music is a combination I never knew I needed.', status: 'approved' } })

  await payload.update({ collection: 'products', id: product1.id, data: { popularReviews: [review1a.id, review1b.id] } })
  await payload.update({ collection: 'products', id: product2.id, data: { popularReviews: [review2a.id, review2b.id] } })
  await payload.update({ collection: 'products', id: product3.id, data: { popularReviews: [review3a.id, review3b.id] } })

  // ─── Variants ──────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding variants...')

  const langVariantType = await payload.create({ collection: 'variantTypes', data: { name: 'language', label: 'Language' } })
  const sizeVariantType = await payload.create({ collection: 'variantTypes', data: { name: 'size', label: 'Edition' } })

  const langEN = await payload.create({ collection: 'variantOptions', data: { label: 'English', value: 'en', variantType: langVariantType.id } })
  const langAR = await payload.create({ collection: 'variantOptions', data: { label: 'Arabic', value: 'ar', variantType: langVariantType.id } })
  const langPT = await payload.create({ collection: 'variantOptions', data: { label: 'Portuguese', value: 'pt', variantType: langVariantType.id } })
  const sizeStandard = await payload.create({ collection: 'variantOptions', data: { label: 'Standard (200 pages)', value: 'standard', variantType: sizeVariantType.id } })
  const sizeDeluxe = await payload.create({ collection: 'variantOptions', data: { label: 'Deluxe (350 pages + Sheet Music)', value: 'deluxe', variantType: sizeVariantType.id } })

  await payload.create({ collection: 'variants', data: { product: product1, options: [langEN, sizeStandard], priceInUSD: 2400, priceInUSDEnabled: true, inventory: 100, _status: 'published' } })
  await payload.create({ collection: 'variants', data: { product: product1, options: [langEN, sizeDeluxe], priceInUSD: 3800, priceInUSDEnabled: true, inventory: 50, _status: 'published' } })
  await payload.create({ collection: 'variants', data: { product: product1, options: [langAR, sizeStandard], priceInUSD: 2200, priceInUSDEnabled: true, inventory: 80, _status: 'published' } })
  await payload.create({ collection: 'variants', data: { product: product1, options: [langPT, sizeDeluxe], priceInUSD: 3600, priceInUSDEnabled: true, inventory: 40, _status: 'published' } })

  await payload.update({ collection: 'products', id: product1.id, data: { enableVariants: true, variantTypes: [langVariantType.id, sizeVariantType.id] } })

  // ─── Products — AR/PT translations (use block IDs from created EN docs) ────
  // IMPORTANT: We pass the created EN product document to each translation
  // function. The function reads block IDs from it and sends back only the
  // localized leaf fields with those IDs. Payload then writes the translated
  // text into the correct locale slot for each block, leaving all non-localized
  // fields (images, icon selects, booleans, relationships) untouched.
  payload.logger.info('— Seeding product translations (AR/PT)...')

  await payload.update({ collection: 'products', id: product1.id, locale: 'ar', data: book1AR(product1) as any })
  await payload.update({ collection: 'products', id: product2.id, locale: 'ar', data: book2AR(product2) as any })
  await payload.update({ collection: 'products', id: product3.id, locale: 'ar', data: book3AR(product3) as any })

  await payload.update({ collection: 'products', id: product1.id, locale: 'pt', data: book1PT(product1) as any })
  await payload.update({ collection: 'products', id: product2.id, locale: 'pt', data: book2PT(product2) as any })
  await payload.update({ collection: 'products', id: product3.id, locale: 'pt', data: book3PT(product3) as any })

  // ─── Contact form ───────────────────────────────────────────────────────────
  payload.logger.info('— Seeding contact form...')

  const contactForm = await payload.create({ collection: 'forms', depth: 0, data: contactFormData() as any })

  // ─── Pages ─────────────────────────────────────────────────────────────────
  // THE CORRECT APPROACH:
  //
  // 1. payload.create() in EN  → Payload assigns block IDs and returns the full doc
  // 2. Pass that doc to the AR/PT translation functions → they extract the block
  //    IDs and return a patch containing ONLY localized leaf fields, each keyed
  //    by the correct block ID.
  // 3. payload.update() in AR / PT with that patch → Payload writes translated
  //    text into the locale-specific slot for each block field. Non-localized
  //    fields (upload refs, select icons, booleans, product IDs) are ignored by
  //    Payload because they have no locale variant to write into.
  //
  // There is NO "EN re-apply at the end" — that was overwriting everything.
  // The EN doc from create() is already correct and stays untouched.

  // ── Home page ───────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding home page...')

  const homePage = await payload.create({
    collection: 'pages',
    depth: 1, // depth:1 so we get block IDs and link IDs back in the response
    locale: 'en',
    data: homePageData({
      heroImage: imageHero,
      book1: imageBook1, book2: imageBook2, book3: imageBook3,
      authorImage: imageAuthor,
      product1Id: product1.id, product2Id: product2.id, product3Id: product3.id,
      heroSong: songMidnightSymphony,
    }),
  })

  await payload.update({ collection: 'pages', id: homePage.id, locale: 'ar', data: homePageAR(homePage, songMidnightSymphony) as any })
  await payload.update({ collection: 'pages', id: homePage.id, locale: 'pt', data: homePagePT(homePage, songMidnightSymphony) as any })

  // ── Author page ─────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding author page...')

  const authorPage = await payload.create({
    collection: 'pages',
    depth: 1,
    locale: 'en',
    data: authorPageData({ authorFullImage: imageAuthorFull }),
  })

  await payload.update({ collection: 'pages', id: authorPage.id, locale: 'ar', data: authorPageAR(authorPage) as any })
  await payload.update({ collection: 'pages', id: authorPage.id, locale: 'pt', data: authorPagePT(authorPage) as any })

  // ── Contact page ────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding contact page...')

  const contactPage = await payload.create({
    collection: 'pages',
    depth: 1,
    locale: 'en',
    data: contactPageData({ contactForm }),
  })

  await payload.update({ collection: 'pages', id: contactPage.id, locale: 'ar', data: contactPageAR(contactPage) as any })
  await payload.update({ collection: 'pages', id: contactPage.id, locale: 'pt', data: contactPagePT(contactPage) as any })

  // ── Blog: The Orchestral Heart ──────────────────────────────────────────────
  payload.logger.info('— Seeding blog: The Orchestral Heart...')

  const blogOrchestral = await payload.create({
    collection: 'pages',
    depth: 1,
    locale: 'en',
    data: blogOrchestralHeartData({
      heroImage: imageBlogHero,
      imageCello, imageFlute, imageHarp, imageViolin,
      imageMixer, imageConductor, imageMics,
      heroSong: songOrchestralHeart,
    }),
  })

  await payload.update({ collection: 'pages', id: blogOrchestral.id, locale: 'ar', data: blogOrchestralHeartAR(blogOrchestral) as any })
  await payload.update({ collection: 'pages', id: blogOrchestral.id, locale: 'pt', data: blogOrchestralHeartPT(blogOrchestral) as any })

  // ── Blog: The Dragon's Lullaby ──────────────────────────────────────────────
  payload.logger.info("— Seeding blog: The Dragon's Lullaby...")

  const blogDragons = await payload.create({
    collection: 'pages',
    depth: 1,
    locale: 'en',
    data: blogDragonsLullabyData({
      heroImage: imageBlogHero,
      imageCello, imageConductor,
      heroSong: songDragonsLullaby,
    }),
  })

  await payload.update({ collection: 'pages', id: blogDragons.id, locale: 'ar', data: blogDragonsLullabyAR(blogDragons) as any })
  await payload.update({ collection: 'pages', id: blogDragons.id, locale: 'pt', data: blogDragonsLullabyPT(blogDragons) as any })

  // ── Blog: Writing with Music ────────────────────────────────────────────────
  payload.logger.info('— Seeding blog: Writing with Music...')

  const blogWriting = await payload.create({
    collection: 'pages',
    depth: 1,
    locale: 'en',
    data: blogWritingWithMusicData({
      heroImage: imageBlogHero,
      imageHarp, imageFlute,
    }),
  })

  await payload.update({ collection: 'pages', id: blogWriting.id, locale: 'ar', data: blogWritingWithMusicAR(blogWriting) as any })
  await payload.update({ collection: 'pages', id: blogWriting.id, locale: 'pt', data: blogWritingWithMusicPT(blogWriting) as any })

  // ─── Globals — Header ───────────────────────────────────────────────────────
  payload.logger.info('— Seeding header...')

  await payload.updateGlobal({
    slug: 'header', locale: 'en',
    data: {
      navItems: [
        { link: { type: 'custom', label: 'The Library', url: '/shop' } },
        { link: { type: 'custom', label: 'Musical Journey', url: '/the-orchestral-heart' } },
        { link: { type: 'custom', label: 'About the Author', url: '/author' } },
        { link: { type: 'custom', label: 'Contact', url: '/contact' } },
      ],
    },
  })

  // Read back EN header to get navItem IDs — only link.label is localized
  const headerEN = await payload.findGlobal({ slug: 'header', locale: 'en', depth: 0 })
  const navItems = (headerEN as any).navItems ?? []

  await payload.updateGlobal({
    slug: 'header', locale: 'ar',
    data: {
      navItems: navItems.map((item: any, i: number) => ({
        id: item.id,
        link: { type: item.link.type, url: item.link.url, label: ['المكتبة', 'الرحلة الموسيقية', 'عن المؤلف', 'تواصل معنا'][i] },
      })),
    },
  })

  await payload.updateGlobal({
    slug: 'header', locale: 'pt',
    data: {
      navItems: navItems.map((item: any, i: number) => ({
        id: item.id,
        link: { type: item.link.type, url: item.link.url, label: ['A Biblioteca', 'Jornada Musical', 'Sobre o Autor', 'Contacto'][i] },
      })),
    },
  })

  // ─── Globals — Footer ───────────────────────────────────────────────────────
  payload.logger.info('— Seeding footer...')

  await payload.updateGlobal({
    slug: 'footer', locale: 'en',
    data: {
      tagline: 'Creating immersive musical experiences that bring stories to life through the power of symphonic orchestration.',
      groups: [
        {
          label: 'The Archive',
          links: [
            { link: { type: 'custom', label: 'All Books', url: '/shop' } },
            { link: { type: 'custom', label: 'Crescendo of the Clouds', url: '/products/crescendo-of-the-clouds' } },
            { link: { type: 'custom', label: 'The Coral Cantata', url: '/products/the-coral-cantata' } },
            { link: { type: 'custom', label: 'Echoes of the Gear', url: '/products/echoes-of-the-gear' } },
          ],
        },
        {
          label: 'The Chronicler',
          links: [
            { link: { type: 'custom', label: 'About the Author', url: '/author' } },
            { link: { type: 'custom', label: 'Musical Journey', url: '/the-orchestral-heart' } },
            { link: { type: 'custom', label: 'Blog', url: '/blog' } },
            { link: { type: 'custom', label: 'Contact', url: '/contact' } },
          ],
        },
        {
          label: 'Your Account',
          links: [
            { link: { type: 'custom', label: 'Account Settings', url: '/account' } },
            { link: { type: 'custom', label: 'Orders', url: '/orders' } },
            { link: { type: 'custom', label: 'Addresses', url: '/account/addresses' } },
            { link: { type: 'custom', label: 'Find My Order', url: '/find-order' } },
          ],
        },
        {
          label: 'Legal',
          links: [
            { link: { type: 'custom', label: 'Privacy Policy', url: '/privacy' } },
            { link: { type: 'custom', label: 'Terms of Service', url: '/terms' } },
            { link: { type: 'custom', label: 'Refund Policy', url: '/refunds' } },
          ],
        },
      ],
      socials: [
        { platform: 'instagram', url: 'https://instagram.com/melodymyth' },
        { platform: 'twitter', url: 'https://twitter.com/melodymyth' },
        { platform: 'youtube', url: 'https://youtube.com/@melodymyth' },
        { platform: 'discord', url: 'https://discord.gg/melodymyth' },
      ],
      newsletter: {
        enabled: true,
        heading: 'Join the Mythos',
        subheading: 'Receive lore, releases and rare scrolls directly to your sanctum. Join 15,000+ Seekers of Magic.',
      },
      copyright: `© ${new Date().getFullYear()} Melody & Myth. All Spells Reserved by the Guild of Musical Bards.`,
    },
  })

  // Read back EN footer to get group/link IDs for AR/PT label updates
  const footerEN = await payload.findGlobal({ slug: 'footer', locale: 'en', depth: 0 })
  const groups = (footerEN as any).groups ?? []

  const arGroupLabels = ['الأرشيف', 'المؤرخ', 'حسابك', 'القانونية']
  const arLinkLabels = [
    ['جميع الكتب', 'صعود الغيوم', 'كانتاتا المرجان', 'أصداء التروس'],
    ['عن المؤلف', 'الرحلة الموسيقية', 'المدونة', 'تواصل معنا'],
    ['إعدادات الحساب', 'الطلبات', 'العناوين', 'تتبع طلبي'],
    ['سياسة الخصوصية', 'شروط الخدمة', 'سياسة الاسترداد'],
  ]

  const ptGroupLabels = ['O Arquivo', 'O Cronista', 'A Sua Conta', 'Legal']
  const ptLinkLabels = [
    ['Todos os Livros', 'Crescendo das Nuvens', 'A Cantata do Coral', 'Ecos da Engrenagem'],
    ['Sobre o Autor', 'Jornada Musical', 'Blogue', 'Contacto'],
    ['Definições da Conta', 'Encomendas', 'Moradas', 'Encontrar Encomenda'],
    ['Política de Privacidade', 'Termos de Serviço', 'Política de Reembolso'],
  ]

  await payload.updateGlobal({
    slug: 'footer', locale: 'ar',
    data: {
      tagline: 'نخلق تجارب موسيقية غامرة تُحيي القصص من خلال قوة التوزيع السيمفوني.',
      newsletter: {
        heading: 'انضم إلى الأسطورة',
        subheading: 'تلقّ الأخبار والإصدارات والمخطوطات النادرة مباشرةً. انضم إلى أكثر من ١٥٬٠٠٠ باحث عن السحر.',
      },
      copyright: `© ${new Date().getFullYear()} لحن وأسطورة. جميع التعاويذ محفوظة لنقابة الشعراء الموسيقيين.`,
      groups: groups.map((group: any, gi: number) => ({
        id: group.id,
        label: arGroupLabels[gi],
        links: (group.links ?? []).map((l: any, li: number) => ({
          id: l.id,
          link: { type: l.link?.type, url: l.link?.url, label: arLinkLabels[gi]?.[li] ?? l.link?.label },
        })),
      })),
    },
  })

  await payload.updateGlobal({
    slug: 'footer', locale: 'pt',
    data: {
      tagline: 'Criando experiências musicais imersivas que dão vida às histórias através do poder da orquestração sinfónica.',
      newsletter: {
        heading: 'Junte-se ao Mythos',
        subheading: 'Receba lore, lançamentos e pergaminhos raros diretamente no seu santuário. Junte-se a mais de 15.000 Buscadores de Magia.',
      },
      copyright: `© ${new Date().getFullYear()} Melodia & Mito. Todos os Feitiços Reservados pela Guilda dos Bardos Musicais.`,
      groups: groups.map((group: any, gi: number) => ({
        id: group.id,
        label: ptGroupLabels[gi],
        links: (group.links ?? []).map((l: any, li: number) => ({
          id: l.id,
          link: { type: l.link?.type, url: l.link?.url, label: ptLinkLabels[gi]?.[li] ?? l.link?.label },
        })),
      })),
    },
  })

  payload.logger.info('Seeded database successfully!')
}

// ─── File loader ───────────────────────────────────────────────────────────────

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