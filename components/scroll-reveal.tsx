'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const TARGETS = 'main section > *, main > section, footer > *'

export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let pending: HTMLElement[] = []
    let ticking = false

    // Only the vertical position matters: IntersectionObserver misses tall sections
    // and cards inside horizontal scrollers on mobile, leaving them invisible.
    const check = () => {
      ticking = false
      const trigger = window.innerHeight * 0.92
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top >= trigger) return true
        el.classList.remove('reveal-pending')
        el.classList.add('reveal-shown')
        return false
      })
      if (pending.length === 0) detach()
    }

    const schedule = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(check)
    }

    const detach = () => {
      document.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }

    const frame = requestAnimationFrame(() => {
      const seen = new Set<Element>()
      document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
        if (seen.has(el) || el.closest('.reveal-pending, .reveal-shown')) return
        seen.add(el)
        // Content already on screen at load stays put so the page never flashes empty.
        if (el.getBoundingClientRect().top < window.innerHeight) return
        const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0
        el.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 90}ms`)
        el.classList.add('reveal-pending')
        pending.push(el)
      })
      if (pending.length === 0) return
      document.addEventListener('scroll', schedule, { capture: true, passive: true })
      window.addEventListener('resize', schedule, { passive: true })
      check()
    })

    return () => {
      cancelAnimationFrame(frame)
      detach()
      document.querySelectorAll('.reveal-pending').forEach((el) => el.classList.remove('reveal-pending'))
    }
  }, [pathname])

  return null
}
