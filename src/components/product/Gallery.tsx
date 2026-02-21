'use client'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { GridTileImage } from '@/components/Grid/tile'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { DefaultDocumentIDType } from 'payload'
import { Music2Icon } from 'lucide-react'

type Props = {
  gallery: NonNullable<Product['gallery']>
  song?: Product['song']
}

export const Gallery: React.FC<Props> = ({ gallery, song }) => {
  const searchParams = useSearchParams()
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()
  const [audioOpen, setAudioOpen] = useState(false)

  const audioUrl =
    song && typeof song === 'object' && song.url ? song.url : null

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
    <div>
      {/* Main image + song button */}
      <div className="relative w-full overflow-hidden mb-8">
        <Media
          resource={gallery[current].image}
          className="w-full"
          imgClassName="w-full rounded-lg"
        />

        {audioUrl && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute bottom-3 right-3 rounded-full gap-2 shadow-md backdrop-blur-sm bg-background/80 hover:bg-background"
            onClick={() => setAudioOpen(true)}
          >
            <Music2Icon className="size-4" />
            Play Song
          </Button>
        )}
      </div>

      {/* Thumbnail carousel */}
      <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: false }}>
        <CarouselContent>
          {gallery.map((item, i) => {
            if (typeof item.image !== 'object') return null

            return (
              <CarouselItem
                className="basis-1/5"
                key={`${item.image.id}-${i}`}
                onClick={() => setCurrent(i)}
              >
                <GridTileImage active={i === current} media={item.image} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* Audio player dialog */}
      {audioUrl && (
        <Dialog open={audioOpen} onOpenChange={setAudioOpen}>
          <DialogContent className="sm:max-w-sm flex items-center justify-center">
            <DialogTitle className="sr-only">Song Player</DialogTitle>
            <audio
              src={audioUrl}
              controls
              autoPlay
              className="w-full"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}