import React from 'react'
import { BookOpenText } from 'lucide-react'
import { cn } from '@/utilities/cn'

export function LogoIcon({ className, ...props }: React.ComponentProps<'svg'> & { className?: string }) {
  return (
    <BookOpenText 
      className={cn("size-8 text-primary", className)} 
      {...props as any}
    />
  )
}
