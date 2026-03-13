import { routing } from "@/i18n/routing";

export type LocaleType = (typeof routing.locales)[number]

export const RTL_LOCALES: LocaleType[] = ['ar']

export const isRTL = (locale: LocaleType): boolean => RTL_LOCALES.includes(locale)