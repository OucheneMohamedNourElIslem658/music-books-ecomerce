import { routing } from '@/i18n/routing';
import { revalidatePath } from 'next/cache';

export function revalidateLocalizedPath(path: string, type?: 'page' | 'layout') {
    routing.locales.forEach((locale) => {
        revalidatePath(`/${locale}${path}`, type);
    });
}