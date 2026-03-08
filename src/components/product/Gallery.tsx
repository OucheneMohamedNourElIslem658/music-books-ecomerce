'use client'

import type { Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Play } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { DefaultDocumentIDType } from 'payload'
import React, { useEffect, useState } from 'react'
import { AudioPlayer } from '../AudioPlayer'

type Props = {
  gallery: NonNullable<Product['gallery']>
  song?: Product['song']
}

export const Gallery: React.FC<Props> = ({ gallery, song }) => {
  const searchParams = useSearchParams()
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()
  const [audioOpen, setAudioOpen] = useState(false)

  const songData = song && typeof song === 'object' ? (song as MediaType) : null
  const audioUrl = songData?.url || null

  useEffect(() => {
    if (!api) return
  }, [api])

  useEffect(() => {
    const values = Array.from(searchParams.values())

    if (values && api) {
      const index = gallery.findIndex((item) => {
        if (!item.variantOption) return false

        let variantID: DefaultDocumentIDType

        if (typeof item.variantOption === 'object') {
          variantID = item.variantOption.id
        } else variantID = item.variantOption

        return Boolean(values.find((value) => value === String(variantID)))
      })
      if (index !== -1) {
        setCurrent(index)
        api.scrollTo(index, true)
      }
    }
  }, [searchParams, api, gallery])

  return (
    <div className="flex flex-col gap-8">
      {/* Main image + song button */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 -z-10"></div>
        <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/5] bg-muted transition-transform duration-500 group-hover:scale-[1.02]">
          <Media
            resource={gallery[current].image}
            fill
            imgClassName="object-cover"
          />
        </div>

        {audioUrl && (
          <div className="absolute bottom-8 right-8">
            <Button
              size="lg"
              className="flex items-center gap-4 bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group/btn"
              onClick={() => setAudioOpen(true)}
            >
              <Play className="size-5 fill-current" />
              <span>Magic Play (Listen to Score)</span>
            </Button>
          </div>
        )}
      </div>

      {/* Thumbnail carousel */}
      {gallery.length > 1 && (
        <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-4">
            {gallery.map((item, i) => {
              if (typeof item.image !== 'object') return null

              return (
                <CarouselItem
                  className="basis-1/4 sm:basis-1/5 pl-4 cursor-pointer"
                  key={`${item.image.id}-${i}`}
                  onClick={() => setCurrent(i)}
                >
                  <div className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === current ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}>
                    <Media resource={item.image} fill imgClassName="object-cover" />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      )}

      {/* Audio player dialog */}
      {audioUrl && (
        <Dialog open={audioOpen} onOpenChange={setAudioOpen}>
          <DialogContent className="p-0 bg-transparent border-none shadow-none">
            <DialogTitle className="sr-only">Song Player</DialogTitle>
            <AudioPlayer
              url={audioUrl}
              title={songData?.filename || 'Enchanted Melody'}
              thumbnail={gallery[0].image}
              onClose={() => setAudioOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}