import { routing } from '@/i18n/routing';
import { createNavigation } from 'next-intl/navigation';

export const { Link, redirect, useRouter, usePathname, getPathname } =
    createNavigation(routing);