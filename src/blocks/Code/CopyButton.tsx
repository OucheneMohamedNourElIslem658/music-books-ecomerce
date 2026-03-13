'use client'
import { Button } from '@/components/ui/button'
import { CopyIcon } from '@payloadcms/ui/icons/Copy'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const t = useTranslations('blocks.code')
  const [text, setText] = useState('copy')

  function updateCopyStatus() {
    if (text === 'copy') {
      setText(() => 'copied')
      setTimeout(() => {
        setText(() => 'copy')
      }, 1000)
    }
  }

  return (
    <div className="flex justify-end align-middle">
      <Button
        className="flex gap-1"
        variant={'secondary'}
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          updateCopyStatus()
        }}
      >
        <p>{t(text)}</p>
        <CopyIcon />
      </Button>
    </div>
  )
}
