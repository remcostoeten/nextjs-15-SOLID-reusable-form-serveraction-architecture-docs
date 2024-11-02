'use client'

import mermaid from 'mermaid'
import { useEffect, useRef } from 'react'

type MermaidProps = {
  chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: 'dark' })
    mermaid.run({ nodes: [mermaidRef.current as HTMLElement as HTMLElement as HTMLElement] })
  }, [chart])

  return <div ref={mermaidRef} className="mermaid">{chart}</div>
}
