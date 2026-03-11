'use client'
import { RichText } from '@/components/RichText'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from 'next/image'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type ImageItem = {
  image: Media | string
  alt?: string
  id?: string
}

export type FeatureShowcaseBlockProps = {
  id?: DefaultDocumentIDType
  className?: string
  reverse?: boolean
  content: SerializedEditorState
  images?: ImageItem[]
}

const ImageGrid: React.FC<{ images: ImageItem[] }> = ({ images }) => {
  const getUrl = (img: Media | string) => (typeof img === 'object' ? img?.url : img) || ''
  const getAlt = (item: ImageItem) =>
    item.alt || (typeof item.image === 'object' ? item.image?.alt : '') || ''

  if (images.length <= 2) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {images.map((item, i) => (
          <div key={item.id ?? i} className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
            <Image src={getUrl(item.image)} alt={getAlt(item)} fill className="object-cover" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
        <Image src={getUrl(images[0].image)} alt={getAlt(images[0])} fill className="object-cover" />
      </div>
      <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
        <Image src={getUrl(images[1].image)} alt={getAlt(images[1])} fill className="object-cover" />
      </div>
      {images[2] && (
        <div className="relative col-span-2 aspect-21/9 overflow-hidden rounded-xl shadow-lg">
          <Image src={getUrl(images[2].image)} alt={getAlt(images[2])} fill className="object-cover" />
        </div>
      )}
    </div>
  )
}

export const FeatureShowcaseBlock: React.FC<FeatureShowcaseBlockProps> = ({
  reverse,
  content,
  images,
  className,
}) => {
  return (
    <div className={cn('bg-primary/5 py-20 transition-colors', className)}>
      <div className="container">
        <div
          className={cn(
            'flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20',
            reverse && 'lg:flex-row-reverse',
          )}
        >
          {/* Text side */}
          <div className="lg:w-1/2">
            <RichText
              data={content}
              enableGutter={false}
              enableProse={false}
              className={cn(
                'space-y-6',
                // Heading Styling
                '[&_h2]:text-foreground [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:leading-tight',
                '[&_h2_span]:text-primary',
                // Paragraph Styling
                '[&_p]:text-muted-foreground [&_p]:text-lg [&_p]:leading-relaxed',
                // List Styling with Checkmark Icons
                '[&_ul]:space-y-4 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:pt-4',
                '[&_li]:flex [&_li]:items-center [&_li]:gap-3 [&_li]:text-foreground/80 [&_li]:font-medium',
                "[&_li]:before:content-[''] [&_li]:before:size-5 [&_li]:before:shrink-0 [&_li]:before:bg-primary [&_li]:before:mask-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCA2TDEwIDE3IDQgMTIiLz48L3N2Zz4=')] [&_li]:before:mask-no-repeat [&_li]:before:mask-contain",
              )}
            />
          </div>

          {/* Images side */}
          {images && images.length > 0 && (
            <div className="lg:w-1/2">
              <ImageGrid images={images} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
