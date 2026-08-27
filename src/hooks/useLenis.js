import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setScroll, scrollState } from '../lib/scrollStore'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export const getLenis = () => lenisInstance

/**
 * Smooth scrolling wired into GSAP's ticker so Lenis and
 * ScrollTrigger stay perfectly in sync (no jitter, no double rAF).
 * Disabled entirely when the user prefers reduced motion.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      lenisInstance = null
      const onNativeScroll = () => setScroll(window.scrollY, document.body.scrollHeight)
      window.addEventListener('scroll', onNativeScroll, { passive: true })
      onNativeScroll()
      return () => window.removeEventListener('scroll', onNativeScroll)
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      infinite: false,
    })
    lenisInstance = lenis

    lenis.on('scroll', (e) => {
      setScroll(e.scroll, e.limit + window.innerHeight)
      ScrollTrigger.update()
    })

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(500, 33)

    const onResize = () => {
      scrollState.vh = window.innerHeight
      lenis.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}

/** Scroll to an element id, honouring whichever scroller is active. */
export function scrollToId(id, offset = -1) {
  const el = document.getElementById(id)
  if (!el) return

  // Re-measure before moving. The document may have just changed
  // height — closing the mobile menu releases `overflow: hidden` on
  // the body — and a stale scroll limit would clamp the target to 0.
  if (lenisInstance) lenisInstance.resize()

  const top = el.getBoundingClientRect().top + window.scrollY + offset

  if (lenisInstance) {
    lenisInstance.scrollTo(top, { duration: 1.25 })
  } else {
    window.scrollTo({ top, behavior: 'auto' })
  }
}

export default useLenis
