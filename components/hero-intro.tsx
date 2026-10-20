import type { ReactNode } from 'react'
import Image from 'next/image'

export function HeroIntro({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100svh-65px)] flex-col overflow-hidden md:min-h-[calc(100svh-61px)]">
      <div className="absolute inset-0 bg-background" aria-hidden="true">
        <Image
          src="/images/journey/landing-1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] md:object-center"
        />
      </div>
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/60 to-transparent md:h-1/2" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-10 md:py-16">
        {children}
      </div>
    </div>
  )
}
