'use client'

import { memo } from 'react'

interface IconProps {
  className?: string
  size?: number
}

const DEFAULT_ICON_SIZE = 16

export const JavascriptIcon = memo(({ className, size = DEFAULT_ICON_SIZE }: IconProps) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" fill="#f7df1e" />
    <path 
      d="M9 18.5v1c.8 1.5 2.1 2.4 4 2.4 2.3 0 3.8-1.3 3.8-3.2 0-2-1.3-2.8-3.5-3.7l-.8-.3c-1.2-.5-1.7-.8-1.7-1.6 0-.7.5-1.2 1.3-1.2.8 0 1.3.3 1.8 1.1l2.1-1.3c-.9-1.6-2.1-2.2-3.9-2.2-2.4 0-4 1.5-4 3.4 0 2.1 1.3 3.1 3.2 3.9l.8.3c1.2.6 2 .9 2 1.8 0 .8-.7 1.3-1.9 1.3-1.4 0-2.2-.7-2.8-1.7L9 18.5zm9.9 3.8V13h-2.6v9.3h2.6z" 
      fill="#000000"
    />
  </svg>
))

export const TypescriptIcon = memo(({ className, size = DEFAULT_ICON_SIZE }: IconProps) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 32 32"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="3" fill="#3178c6"/>
    <path 
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.646 25.484v3.128c.509.261 1.11.456 1.804.587.694.13 1.424.196 2.19.196.75 0 1.462-.072 2.137-.215.675-.144 1.267-.38 1.776-.71.509-.329.911-.759 1.208-1.29.297-.532.445-.999.445-1.766 0-.567-.085-1.064-.254-1.491-.17-.428-.414-.807-.734-1.14-.32-.332-.703-.63-1.149-.894-.446-.264-.95-.513-1.511-.748-.41-.17-.78-.334-1.105-.494a4.047 4.047 0 01-.832-.489 2.224 2.224 0 01-.528-.528c-.124-.186-.186-.396-.186-.631 0-.215.055-.409.166-.582a1.41 1.41 0 01.47-.445c.202-.124.45-.22.743-.289.293-.068.62-.103.978-.103.26 0 .536.02.826.059.29.039.582.1.876.181a6.094 6.094 0 01.856.308c.277.124.533.267.768.43v-2.922c-.476-.183-.997-.318-1.56-.406a9.455 9.455 0 00-1.713-.132c-.743 0-1.447.08-2.112.24-.665.159-1.25.409-1.756.747-.505.339-.904.771-1.198 1.296-.293.525-.44 1.152-.44 1.882 0 .932.269 1.727.807 2.385.538.658 1.354 1.216 2.45 1.672.43.176.83.349 1.203.518.373.17.693.346.963.528.27.183.484.382.64.597.157.215.235.46.235.733 0 .202-.049.39-.147.562-.098.173-.246.323-.445.45-.2.127-.447.22-.743.298-.297.072-.644.108-1.042.108-.678 0-1.35-.119-2.015-.357-.665-.237-1.281-.595-1.848-1.07zm-13.047-6.137h4.014v-2.566H.62v2.566h3.992V28.4h3.178v-9.053h-3.19z" 
      fill="#fff"
    />
  </svg>
))

export const PythonIcon = memo(({ className, size = DEFAULT_ICON_SIZE }: IconProps) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M15.885 2.1c-7.1 0-6.651 3.07-6.651 3.07v3.19h6.752v1H6.545S2 8.8 2 16.005s4.013 6.912 4.013 6.912h2.396v-3.326s-.13-4.013 3.95-4.013h6.83s3.835.063 3.835-3.703V6.406s.232-4.306-7.139-4.306zm-3.703 2.539a1.21 1.21 0 1 1 0 2.42 1.21 1.21 0 0 1 0-2.42z" 
      fill="#3871A3"
    />
    <path 
      d="M16.115 29.9c7.1 0 6.651-3.07 6.651-3.07v-3.19H16.014v-1h9.441S30 23.2 30 15.995s-4.013-6.912-4.013-6.912h-2.396v3.326s.13 4.013-3.95 4.013h-6.83s-3.835-.063-3.835 3.703v5.469s-.232 4.306 7.139 4.306zm3.703-2.539a1.21 1.21 0 1 1 0-2.42 1.21 1.21 0 0 1 0 2.42z" 
      fill="#FDD748"
    />
  </svg>
))

export const ReactIcon = memo(({ className, size = DEFAULT_ICON_SIZE }: IconProps) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="2.05" fill="#61dafb"/>
    <path 
      d="M16 11.8c5.859 0 10.607 1.882 10.607 4.2S21.859 20.2 16 20.2 5.393 18.318 5.393 16 10.141 11.8 16 11.8z" 
      stroke="#61dafb" 
      strokeWidth="1" 
      fill="none"
    />
    <path 
      d="M13.196 13.9c2.93-5.077 6.758-8.477 8.564-7.586 1.806.89 0.895 5.723-2.034 10.8-2.93 5.077-6.758 8.477-8.564 7.586-1.806-.89-0.895-5.723 2.034-10.8z" 
      stroke="#61dafb" 
      strokeWidth="1" 
      fill="none"
    />
    <path 
      d="M13.196 18.1c-2.93-5.077-3.84-9.91-2.034-10.8 1.806-.891 5.634 2.509 8.564 7.586 2.929 5.077 3.84 9.91 2.034 10.8-1.806.891-5.634-2.509-8.564-7.586z" 
      stroke="#61dafb" 
      strokeWidth="1" 
      fill="none"
    />
  </svg>
))

export const MarkdownIcon = memo(({ className, size = DEFAULT_ICON_SIZE }: IconProps) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="30" height="22" x="1" y="5" rx="2" fill="#ffffff" stroke="#000000" strokeWidth="2"/>
    <path d="M6 10v12h4l4-4 4 4h4V10h-4v8l-4-4-4 4v-8H6z" fill="#000000"/>
  </svg>
))

export const TerminalIcon = memo(({ className, size = DEFAULT_ICON_SIZE }: IconProps) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="28" height="22" x="2" y="5" rx="2" fill="#2F3A3E"/>
    <path d="M6 11l5 5-5 5" stroke="#3AB14A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 21h10" stroke="#3AB14A" strokeWidth="2" strokeLinecap="round"/>
  </svg>
))

export const CodeIcon = memo(({ className, size = DEFAULT_ICON_SIZE }: IconProps) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M11 8L3 16L11 24M21 8L29 16L21 24" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
))

JavascriptIcon.displayName = 'JavascriptIcon'
TypescriptIcon.displayName = 'TypescriptIcon'
PythonIcon.displayName = 'PythonIcon'
ReactIcon.displayName = 'ReactIcon'
MarkdownIcon.displayName = 'MarkdownIcon'
TerminalIcon.displayName = 'TerminalIcon'
CodeIcon.displayName = 'CodeIcon'
