'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Laptop, Moon, Sun } from 'lucide-react'
import React, { useState } from 'react'
import { useTheme } from '..'
import { themeLocalStorageKey } from '../shared'
import type { Theme } from '../types'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger aria-label="Change theme" className="w-auto bg-primary/5 hover:bg-primary/10 transition-colors gap-2 px-4 h-8 rounded-full border-none text-muted-foreground hover:text-primary">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="bg-background/95 backdrop-blur-md border-border rounded-xl">
        <SelectItem value="auto" className="cursor-pointer focus:bg-primary focus:text-primary-foreground">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
            <Laptop className="size-3" />
            Auto
          </div>
        </SelectItem>
        <SelectItem value="light" className="cursor-pointer focus:bg-primary focus:text-primary-foreground">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
            <Sun className="size-3" />
            Light
          </div>
        </SelectItem>
        <SelectItem value="dark" className="cursor-pointer focus:bg-primary focus:text-primary-foreground">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
            <Moon className="size-3" />
            Dark
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
