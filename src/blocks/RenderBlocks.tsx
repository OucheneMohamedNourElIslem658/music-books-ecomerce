import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page, Product } from '../payload-types'
import { AuthorHighlightsBlock } from './AuthorHighlights/Component'
import { AuthorOverviewBlock } from './AuthorOverviewBlock/Component'
import { FeatureShowcaseBlock } from './FeatureShowcase/Component'
import { LinkToContactBlock } from './LinkToContact/Component'
import { LinkToPageBlock } from './LinkToPage/Component'
import { PopularProductsBlock } from './PopularProducts/Component'
import { QuestMapBlock } from './QuestMapBlock/Component'
import { ReviewsBlock } from './ReviewsBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  popularProducts: PopularProductsBlock,
  reviewsBlock: ReviewsBlock,
  linkToPageBlock: LinkToPageBlock,
  authorOverview: AuthorOverviewBlock,
  questMap: QuestMapBlock,
  authorHighlights: AuthorHighlightsBlock,
  linkToContact: LinkToContactBlock,
  featureShowcase: FeatureShowcaseBlock
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  product?: Product
}> = (props) => {
  const { blocks, product } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} product={product} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
