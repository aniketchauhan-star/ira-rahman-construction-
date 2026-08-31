import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Logo from './Logo'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { EASE } from '../lib/motion'
import './Loader.css'

/**
 * Short opening sequence: the logo settles, then a small orange
 * marker travels along a thin construction line — as if the bar is
 * being built — before the site is revealed. 1.6s at most.
 */
export default function Loader({ onComplete }) {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (reduced) {
      const t = setTimeout(() => onComplete?.(), 260)
      return () => clearTimeout(t)
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: EASE.ui },
        onComplete: () => onComplete?.(),
      })

      tl.fromTo(
        '.loader__logo',
        { opacity: 0, y: 18, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55 }
      )
        .fromTo('.loader__track', { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, '-=0.3')
        .fromTo(
          '.loader__fill',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.72, ease: EASE.reveal },
          '-=0.12'
        )
        .fromTo(
          '.loader__marker',
          { xPercent: -50, left: '0%' },
          { left: '100%', duration: 0.72, ease: EASE.reveal },
          '<'
        )
        .fromTo(
          '.loader__word span',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.028 },
          '-=0.6'
        )
        .to('.loader__marker', { opacity: 0, duration: 0.2 }, '-=0.05')
        .to('.loader__inner', { opacity: 0, y: -14, duration: 0.34 }, '+=0.06')
        .to(root, { yPercent: -100, duration: 0.66, ease: EASE.exit }, '-=0.16')
    }, root)

    return () => ctx.revert()
  }, [onComplete, reduced])

  const word = 'BUILDING SOMETHING STRONG'

  return (
    <div ref={rootRef} className="loader" role="status" aria-live="polite">
      <span className="sr-only">Loading IRHA Construction Company</span>
      <div className="loader__inner">
        <div className="loader__logo">
          <Logo height={190} variant="full" />
        </div>

        <div className="loader__bar" aria-hidden="true">
          <span className="loader__track" />
          <span className="loader__fill" />
          <span className="loader__marker" />
        </div>

        <p className="loader__word" aria-hidden="true">
          {word.split('').map((c, i) => (
            <span key={i}>{c === ' ' ? ' ' : c}</span>
          ))}
        </p>
      </div>
    </div>
  )
}
