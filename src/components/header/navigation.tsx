'use client';

import { Menu, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { COLORS, getNavItems } from './constants';
import NavLink from './nav-link';

const guides = [
  { label: 'Kanban Guide', href: '/guides/kanban' },
];

export default function Navigation(): JSX.Element {
  const navItems = getNavItems();

  return (
    <header className="w-fit max-h-[70px] mt-[24px] shadow-xl mx-auto">
      <nav 
        className={`flex flex-wrap gap-8 items-center py-3 pr-3 pl-6 mx-auto bg-neutral-900 border-neutral-500 leading-7 rounded-xl border border-solid ${COLORS.BACKGROUND} ${COLORS.BORDER} ${COLORS.TEXT} max-md:pl-5 px-4 py-2`}
        role="navigation" 
        aria-label="Main navigation"
      >
        <div 
          className="flex shrink-0 self-stretch my-auto w-6 h-[18px]" 
        >
          <svg width="24" height="auto" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2 fill-neutral-50"><path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" stop-color="#000000" className=""></path><path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" stop-color="#000000" className=""></path></svg>
        </div>
        
        <div role="menu" className="flex flex-wrap gap-4 items-center justify-center">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              label={item.label}
              href={item.href}
              isButton={item.isButton}
            />
          ))}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-50 bg-neutral-900 rounded-md hover:bg-neutral-800 focus:outline-none">
              Guides
              <ChevronDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
            </Menu.Button>
            <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-neutral-800 divide-y divide-neutral-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {guides.map((guide) => (
                <MenuItem key={guide.label}>
                  <NavLink
                    label={guide.label}
                    href={guide.href}
                    isButton={false}
                    className="flex items-center w-full px-2 py-2 text-sm rounded-md text-neutral-300 hover:bg-neutral-700 hover:text-neutral-50"
                  />
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </nav>
    </header>
  );
}
