import { Colors, NavItem } from "./types.";

export const COLORS: Colors = {
  BACKGROUND: 'bg-neutral-900',
  BORDER: 'border-neutral-700',
  TEXT: 'text-neutral-500',
  TEXT_HIGHLIGHT: 'text-neutral-300',
  HAS_SEPARATOR: 'border-r border-red-700'
} as const;

export function getNavItems(): NavItem[] {
  return [

    { label: 'SOLID in Next.js', href: '/', hasSeparator: true },
    { label: 'Next auth v5', href: '/next-auth', hasSeparator: true },
    { label: 'Auth', href: '/auth', hasSeparator: true },
    { label: 'Advanced actions', href: '/server-actions', hasSeparator: true },
  ];
}
