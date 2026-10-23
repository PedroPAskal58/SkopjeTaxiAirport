'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { Leaf } from 'lucide-react'

const LEAF_COUNT = 22
const VISIBLE_MS = 4200

type LeafStyle = CSSProperties & Record<`--${string}`, string>

function createLeaves() {
  return Array.from({ length: LEAF_COUNT }, (_, index) => {
    const style: LeafStyle = {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 0.9}s`,
      animationDuration: `${2.4 + Math.random() * 1.4}s`,
      '--leaf-drift': `${(Math.random() - 0.5) * 220}px`,
      '--leaf-spin': `${(Math.random() > 0.5 ? 1 : -1) * (240 + Math.random() * 360)}deg`,
      '--leaf-size': `${18 + Math.random() * 16}px`,
    }
    return { id: index, style, tone: index % 3 }
  })
}

export function FallingLeaves() {
  const [leaves] = useState(createLeaves)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), VISIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="falling-leaves" aria-hidden="true">
      {leaves.map((leaf) => (
        <span key={leaf.id} className="falling-leaf" data-tone={leaf.tone} style={leaf.style}>
          <Leaf className="size-full" fill="currentColor" strokeWidth={1.25} />
        </span>
      ))}
    </div>
  )
}
