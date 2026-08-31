import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats } from '../data/company'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './Stats.css'
import { content } from '../data/content'

gsap.registerPlugin(ScrollTrigger)

/** Figures count up once, the first time they enter the viewport. */
export default function Stats() {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray('.stat__value-num')

      if (reduced) {
        nums.forEach((el) => {
          el.textContent = el.dataset.value
        })
        gsap.set('.stat', { opacity: 1, y: 0 })
        return
      }

      gsap.set('.stat', { opacity: 0, y: 34 })

      ScrollTrigger.create({
        trigger: root,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to('.stat', { opacity: 1, y: 0, duration: DUR.reveal, ease: EASE.ui, stagger: STAGGER.base })

          nums.forEach((el) => {
            const target = Number(el.dataset.value)
            const obj = { v: 0 }
            gsap.to(obj, {
              v: target,
              duration: 1.5,
              ease: EASE.soft,
              onUpdate: () => {
                el.textContent = String(Math.round(obj.v))
              },
            })
          })

          gsap.fromTo(
            '.stat__rule',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.7, ease: EASE.reveal, stagger: STAGGER.base, delay: 0.2 }
          )
        },
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={rootRef} className="shell stats" aria-label={content.a11y.statsRegion}>
      <ul className="stats__grid">
        {stats.map((s) => (
          <li key={s.id} className="stat">
            <span className="stat__value mono-num">
              <span className="stat__value-num" data-value={s.value}>
                0
              </span>
              <span className="stat__suffix">{s.suffix}</span>
            </span>
            <span className="stat__rule" aria-hidden="true" />
            <span className="stat__label">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
