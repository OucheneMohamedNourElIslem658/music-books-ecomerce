import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { cn } from '@/utilities/cn'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <div className="relative inline-flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full transition-colors text-muted-foreground hover:text-primary hover:bg-primary/10",
          className
        )}
        {...rest}
      >
        <ShoppingCart className="size-6" />
        <span className="sr-only">Open Cart</span>
      </Button>
      
      {quantity ? (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {quantity}
        </span>
      ) : null}
    </div>
  )
}
