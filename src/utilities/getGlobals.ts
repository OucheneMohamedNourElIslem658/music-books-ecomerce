import type { Config } from 'src/payload-types'

import { LocaleType } from '@/types/locale'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, locale: LocaleType, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, locale: LocaleType, depth = 0) =>
  unstable_cache(async () => getGlobal<T>(slug, locale, depth), [slug, locale], {
    tags: [`global_${slug}`],
  })
