'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowDown,
	ArrowUp,
	Check,
	CheckCircle2,
	ChevronDown,
	Copy,
	Search,
	X
} from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { ANIMATION_VARIANTS, COPY_VARIANTS, TOAST_VARIANTS } from './animations'
import { Button } from './button'
import { cn } from './cn'
import { customTheme } from './custom-theme'
import * as Icons from './icons'

export interface CodeBlockProps {
  code: string
  fileName: string
  language: string
  badges?: string[]
  showLineNumbers?: boolean
  enableLineHighlight?: boolean
  showMetaInfo?: boolean
  maxHeight?: string
  className?: string
  onCopy?: (code: string) => void
  onLineClick?: (lineNumber: number) => void
  onSearch?: (query: string, results: number[]) => void
}


function getLanguageIcon(language: string) {
  const IconComponent = Icons[`${language.charAt(0).toUpperCase() + language.slice(1)}Icon`] || Icons.CodeIcon
  return <IconComponent size={16} />
}

function calculateCodeStats(code: string) {
  const lines = code.split('\n').length
  const chars = code.length
  const words = code.trim().split(/\s+/).length
  return { lines, chars, words }
}

function CodeBlock({
  code,
  fileName,
  language,
  badges = [],
  showLineNumbers = true,
  enableLineHighlight = true,
  showMetaInfo = true,
  maxHeight = "60vh",
  className,
  onCopy,
  onLineClick,
  onSearch
}: CodeBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [highlightedLines, setHighlightedLines] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentResultIndex, setCurrentResultIndex] = useState<number>(0)
  const codeRef = useRef<HTMLDivElement>(null)

  const stats = calculateCodeStats(code)

  const handleLineClick = useCallback((lineNumber: number) => {
    if (!enableLineHighlight) return
    
    setHighlightedLines(prev => {
      const newLines = prev.includes(lineNumber)
        ? prev.filter(n => n !== lineNumber)
        : [...prev, lineNumber].sort((a, b) => a - b)
      
      onLineClick?.(lineNumber)
      return newLines
    })
  }, [enableLineHighlight, onLineClick])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (!query) {
      setSearchResults([])
      setCurrentResultIndex(0)
      setHighlightedLines([])
      onSearch?.("", [])
      return
    }
    
    const lines = code.split('\n')
    const matches = lines.reduce((acc, line, index) => {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        acc.push(index + 1)
      }
      return acc
    }, [] as number[])
    
    setSearchResults(matches)
    setCurrentResultIndex(matches.length > 0 ? 0 : -1)
    setHighlightedLines(matches)
    onSearch?.(query, matches)

    if (matches.length > 0) {
      scrollToLine(matches[0])
    }
  }, [code, onSearch])

  const scrollToLine = useCallback((lineNumber: number) => {
    if (!codeRef.current) return

    const lineElement = codeRef.current.querySelector(`[data-line-number="${lineNumber}"]`)
    if (lineElement) {
      lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      onCopy?.(code)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [code, onCopy])

  const goToNextResult = useCallback(() => {
    if (searchResults.length === 0) return
    const nextIndex = (currentResultIndex + 1) % searchResults.length
    setCurrentResultIndex(nextIndex)
    scrollToLine(searchResults[nextIndex])
  }, [searchResults, currentResultIndex, scrollToLine])

  const goToPreviousResult = useCallback(() => {
    if (searchResults.length === 0) return
    const prevIndex = currentResultIndex - 1 < 0 ? searchResults.length - 1 : currentResultIndex - 1
    setCurrentResultIndex(prevIndex)
    scrollToLine(searchResults[prevIndex])
  }, [searchResults, currentResultIndex, scrollToLine])

  useEffect(() => {
    function handleKeyboard(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        copyToClipboard()
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'f' && !isCollapsed) {
        e.preventDefault()
        setIsSearching(true)
      }

      if (isSearching && searchResults.length > 0) {
        if (e.key === 'Enter') {
          if (e.shiftKey) {
            goToPreviousResult()
          } else {
            goToNextResult()
          }
        }
      }

      if (e.key === 'Escape') {
        setHighlightedLines([])
        setIsSearching(false)
        setSearchQuery("")
        setSearchResults([])
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [isCollapsed, isSearching, searchResults, currentResultIndex, copyToClipboard, goToNextResult, goToPreviousResult])

  function renderSearchUI() {
    if (!isSearching) return null

    return (
      <div className="flex items-center gap-2 bg-[#111111] rounded-lg border border-[#333333] p-1">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="w-40 px-2 py-1.5 text-sm bg-transparent text-zinc-300 focus:outline-none placeholder:text-zinc-600"
            autoFocus
          />
          {searchQuery && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
              {searchResults.length > 0 ? (
                <span>{currentResultIndex + 1}/{searchResults.length}</span>
              ) : (
                <span>No results</span>
              )}
            </div>
          )}
        </div>
        
        {searchResults.length > 0 && (
          <>
            <div className="h-4 w-[1px] bg-[#333333]" />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousResult}
                className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
              >
                <ArrowUp size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextResult}
                className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
              >
                <ArrowDown size={14} />
              </Button>
            </div>
          </>
        )}
        
        <div className="h-4 w-[1px] bg-[#333333]" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsSearching(false)
            setSearchQuery("")
            setSearchResults([])
            setHighlightedLines([])
          }}
          className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
        >
          <X size={14} />
        </Button>
      </div>
    )
  }

  function renderKeyboardHints() {
    return (
      <div className="flex items-center gap-2 px-2 py-1 text-xs text-zinc-500 border-t border-[#333333] bg-[#0A0A0A]">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 text-xs font-medium rounded bg-[#111111] border border-[#333333] text-zinc-400">
            ⌘/Ctrl + F
          </kbd>
          <span>search</span>
        </div>

        <div className="h-3 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 text-xs font-medium rounded bg-[#111111] border border-[#333333] text-zinc-400">
            ⌘/Ctrl + C
          </kbd>
          <span>copy</span>
        </div>

        {isSearching && (
          <>
            <div className="h-3 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 text-xs font-medium rounded bg-[#111111] border border-[#333333] text-zinc-400">
                ↵
              </kbd>
              <span>next</span>
            </div>

            <div className="h-3 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 text-xs font-medium rounded bg-[#111111] border border-[#333333] text-zinc-400">
                ⇧ + ↵
              </kbd>
              <span>previous</span>
            </div>
          </>
        )}

        <div className="h-3 w-[1px] bg-zinc-800" />
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 text-xs font-medium rounded bg-[#111111] border border-[#333333] text-zinc-400">
            Esc
          </kbd>
          <span>clear</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <div 
        className="group relative rounded-xl overflow-hidden bg-black dark:bg-black border border-[#333333] dark:border-[#333333] w-full transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-center px-4 py-2.5 bg-[#0A0A0A] dark:bg-[#0A0A0A] border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 dark:text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400">
              {getLanguageIcon(language)}
            </span>
            <div className="bg-[#111111] rounded-full px-3 py-1 border border-[#333333] group-hover:border-[#444444] transition-all duration-200">
              <span className="text-sm font-medium text-zinc-400 dark:text-zinc-400 transition-colors duration-200 group-hover:text-zinc-300">
                {fileName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs font-medium rounded-full border border-[#333333] bg-[#111111] text-zinc-400 transition-all duration-200 group-hover:border-[#444444] group-hover:text-zinc-300"
                >
                  {badge}
                </span>
              ))}
              {showMetaInfo && (
                <span className="px-2 py-0.5 text-xs font-medium text-zinc-500">
                  {stats.lines} lines • {stats.words} words
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {renderSearchUI()}

            {!isSearching && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearching(true)}
                className="relative h-8 w-8 text-zinc-500 hover:text-zinc-200 rounded-lg transition-all duration-200 hover:bg-white/5"
                title="Search (⌘/Ctrl + F)"
              >
                <Search size={16} />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="relative h-8 w-8 text-zinc-500 hover:text-zinc-200 rounded-lg transition-all duration-200 hover:bg-white/5"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isCollapsed ? 0 : 180 }}
             transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="relative h-8 w-8 text-zinc-500 hover:text-zinc-200 rounded-lg transition-all duration-200 hover:bg-white/5"
              title="Copy code (⌘/Ctrl + C)"
            >
              <AnimatePresence mode="wait">
                {isCopied ? (
                  <motion.div
                    key="check"
                    variants={COPY_VARIANTS}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-emerald-400"
                  >
                    <Check size={16} />
                  </motion.div>
                ) : (
                  <Copy size={16} />
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderKeyboardHints()}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={ANIMATION_VARIANTS}
              className="overflow-hidden"
            >
              <div className="relative" ref={codeRef}>
                {showLineNumbers && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3.5rem] bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none z-10" />
                )}
                
                <div className="p-4 overflow-y-auto" style={{ maxHeight }}>
                  <SyntaxHighlighter
                    language={language.toLowerCase()}
                    style={customTheme}
                    customStyle={{
                      margin: 0,
                      padding: 0,
                      background: 'transparent',
                      fontSize: '0.875rem',
                    }}
                    showLineNumbers={showLineNumbers}
                    lineNumberStyle={{
                      color: '#666666',
                      minWidth: '2.5em',
                      paddingRight: '1em',
                      textAlign: 'right',
                      userSelect: 'none',
                      opacity: isHovered ? 1 : 0.5,
                      transition: 'opacity 0.2s ease'
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                    lineProps={(lineNumber) => ({
                      style: {
                        cursor: enableLineHighlight ? 'pointer' : 'default',
                        background: highlightedLines.includes(lineNumber) 
                          ? searchResults.length > 0 && lineNumber === searchResults[currentResultIndex]
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(255, 255, 255, 0.05)'
                          : 'transparent',
                        display: 'block',
                        transition: 'background-color 0.15s ease',
                        '&:hover': enableLineHighlight ? {
                          background: 'rgba(255, 255, 255, 0.02)'
                        } : {}
                      },
                      onClick: () => handleLineClick(lineNumber),
                      'data-line-number': lineNumber
                    })}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isCopied && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={TOAST_VARIANTS}
            className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#333333] shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-zinc-200">
              Copied to clipboard
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

CodeBlock.displayName = 'CodeBlock'

export default memo(CodeBlock)
