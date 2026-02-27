import { RichText } from '@/components/RichText'
import type { Media } from '@/payload-types'
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
    const getUrl = (img: Media | string) =>
        typeof img === 'string' ? img : (img?.url ?? '')
    const getAlt = (item: ImageItem) =>
        item.alt ?? (typeof item.image === 'object' ? item.image?.alt : '') ?? ''

    if (images.length === 2) {
        return (
            <div className="grid grid-cols-2 gap-3">
                {images.map((item, i) => (
                    <div key={item.id ?? i} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image src={getUrl(item.image)} alt={getAlt(item)} fill className="object-cover" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={getUrl(images[0].image)} alt={getAlt(images[0])} fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={getUrl(images[1].image)} alt={getAlt(images[1])} fill className="object-cover" />
            </div>
            <div className="relative col-span-2 aspect-[16/7] overflow-hidden rounded-2xl">
                <Image src={getUrl(images[2].image)} alt={getAlt(images[2])} fill className="object-cover" />
            </div>
        </div>
    )
}

export const FeatureShowcaseBlock: React.FC<FeatureShowcaseBlockProps> = ({
    reverse,
    content,
    images,
}) => {
    return (
        <div className='container'>
            <section className="w-full py-8">
                <div
                    className={`flex flex-col gap-12 md:flex-row md:items-center md:gap-16 ${reverse ? 'md:flex-row-reverse' : ''
                        }`}
                >
                    {/* Text side */}
                    <div className="md:w-1/2">
                        <RichText
                            data={content}
                            enableGutter={false}
                            enableProse={false}
                            className="text-white/80"
                        />
                    </div>

                    {/* Images side */}
                    {images && images.length > 0 && (
                        <div className="md:w-1/2">
                            <ImageGrid images={images} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}