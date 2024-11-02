'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'project-setup', title: 'Project Setup' },
  { id: 'project-structure', title: 'Project Structure' },
  { id: 'database-setup', title: 'Database Setup' },
  { id: 'authentication-setup', title: 'Authentication Setup' },
  { id: 'form-components', title: 'Form Components' },
  { id: 'auth-actions', title: 'Auth Actions' },
  { id: 'auth-components', title: 'Auth Components' },
  { id: 'auth-pages', title: 'Auth Pages' },
  { id: 'dashboard', title: 'Dashboard' },
  { id: 'settings-page', title: 'Settings Page' },
  { id: 'layout', title: 'Layout and Navigation' },
  { id: 'conclusion', title: 'Conclusion' },
]

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean) as HTMLElement[]

      const currentSection = sectionElements.find(element => {
        const rect = element.getBoundingClientRect()
        return rect.top >= 0 && rect.top <= window.innerHeight / 2
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return (
    <nav className="w-64 h-screen overflow-y-auto fixed left-0 top-0 p-4 bg-vercel-dark-gray text-vercel-light-gray border-r border-vercel-dark-gray-hover shadow">
      <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
      <ul>
        {sections.map(section => (
          <li key={section.id} className="mb-2">
            <a
              href={`#${section.id}`}
              className={`block p-2 rounded ${
                activeSection === section.id
                  ? 'bg-vercel-blue text-vercel-white'
                  : 'hover:bg-vercel-dark-gray-hover'
              }`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
