import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Section heading that rises into place and then draws a thin
 * orange construction rule beneath itself — the recurring
 * "setting out a line" motif used across the whole site.
 */
export default function SectionTitle({
  eyebrow,
  children,
  as: Tag = 'h2',
  size = 'h2',
  align = 'left',
  rule = true,
  className = '',
}) {
  const wrapRef = useRef(null)
  const headRef = useRef(null)
  const ruleRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const ctx = gsap.context(() => {
      const targets = [wrap.querySelector('.eyebrow'), headRef.current].filter(Boolean)

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 })
        if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 1 })
        return
      }

      gsap.set(targets, { opacity: 0, y: 50 })
      if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 0 })

      ScrollTrigger.create({
        trigger: wrap,
        start: 'top 84%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.ui } })
          tl.to(targets, { opacity: 1, y: 0, duration: DUR.reveal, stagger: STAGGER.base })
          if (ruleRef.current) {
            tl.to(ruleRef.current, { scaleX: 1, duration: 0.7, ease: EASE.reveal }, '-=0.5')
          }
        },
      })
    }, wrap)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div
      ref={wrapRef}
      className={`section-title section-title--${align} ${className}`}
      data-title-block
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag ref={headRef} className={size}>
        {children}
      </Tag>
      {rule && <span ref={ruleRef} className="section-title__rule" aria-hidden="true" />}
    </div>
  )
}
