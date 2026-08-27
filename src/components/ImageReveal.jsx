import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmartImage from './SmartImage'
import { DUR, EASE } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './ImageReveal.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Photographs wipe in from the left (clip-path inset 0 100% 0 0 → 0)
 * while the picture itself settles from 1.08 back to 1.
 */
export default function ImageReveal({
  src,
  alt,
  folderLabel,
  kindLabel,
  className = '',
  direction = 'left',
  delay = 0,
  eager = false,
  children,
}) {
  const maskRef = useRef(null)
  const innerRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const mask = maskRef.current
    if (!mask) return

    const ctx = gsap.context(() => {
      const from =
        direction === 'right'
          ? 'inset(0 0 0 100%)'
          : direction === 'up'
            ? 'inset(100% 0 0 0)'
            : 'inset(0 100% 0 0)'

      if (reduced) {
        gsap.set(mask, { clipPath: 'inset(0 0 0 0)' })
        gsap.set(innerRef.current, { scale: 1 })
        return
      }

      gsap.set(mask, { clipPath: from })
      gsap.set(innerRef.current, { scale: 1.08 })

      ScrollTrigger.create({
        trigger: mask,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ delay })
          tl.to(mask, { clipPath: 'inset(0 0 0 0)', duration: DUR.revealSlow, ease: EASE.reveal })
          tl.to(innerRef.current, { scale: 1, duration: DUR.settle, ease: EASE.soft }, 0)
        },
      })
    }, mask)

    return () => ctx.revert()
  }, [reduced, direction, delay])

  return (
    <div ref={maskRef} className={`image-reveal ${className}`}>
      <div ref={innerRef} className="image-reveal__inner">
        <SmartImage
          src={src}
          alt={alt}
          folderLabel={folderLabel}
          kindLabel={kindLabel}
          eager={eager}
        />
      </div>
      {children}
    </div>
  )
}
