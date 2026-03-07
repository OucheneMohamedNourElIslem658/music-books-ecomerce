import React from 'react'
import { LogoIcon } from '../icons/logo'

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <LogoIcon className="size-8" />
      <span className="text-lg font-black tracking-tight uppercase text-foreground">
        The Enchanted Bookshop
      </span>
    </div>
  )
}
