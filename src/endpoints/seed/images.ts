import { RequiredDataFromCollectionSlug } from 'payload'

export const imageHeroData: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'A magical book cover with glowing blue musical notes floating in a dark forest',
}

export const imageBook1Data: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'Crescendo of the Clouds - a soaring adventure through floating islands with golden clock',
}

export const imageBook2Data: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'The Coral Cantata - an underwater castle made of coral and musical instruments',
}

export const imageBook3Data: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'Echoes of the Gear - a steam-powered mechanical bird with music notes for wings',
}

export const imageAuthorData: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'Portrait of the author playing a golden flute in a study filled with books',
}

export const imageAuthorFullData: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'Author sitting in a study filled with antique books and musical instruments',
}

// ─── Audio / song media entries ───────────────────────────────────────────────
// These are uploaded as media with mimeType audio/mpeg so the hero songGroup
// upload filter (mimeType contains 'audio') will accept them.

export const songMidnightSymphonyData: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'The Midnight Symphony - official book theme',
}

export const songCrescendoThemeData: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'Crescendo of the Clouds - main orchestral theme',
}

export const songCoralCantataData: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'The Coral Cantata - underwater leitmotif',
}

export const songEchoesThemeData: RequiredDataFromCollectionSlug<'media'> = {
  alt: 'Echoes of the Gear - steampunk overture',
}

export const songDragonsLullabyData: RequiredDataFromCollectionSlug<'media'> = {
  alt: "The Dragon's Lullaby - official book theme for the blog feature",
}