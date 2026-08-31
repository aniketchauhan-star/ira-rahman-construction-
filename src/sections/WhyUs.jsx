import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitle from '../components/SectionTitle'
import { reasons } from '../data/whyus'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './WhyUs.css'
import { content } from '../data/content'
import Lines from '../components/Copy'

gsap.registerPlugin(ScrollTrigger)

/**
 * Large typography instead of card clutter. Each keyword arrives
 * behind a structural line that draws across it — the same
 * "setting out" gesture used throughout the site.
 */
export default function WhyUs() {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.why__row')

      rows.forEach((row) => {
        const word = row.querySelector('.why__word')
        const line = row.querySelector('.why__draw')
        const meta = row.querySelectorAll('.why__num, .why__text')

        if (reduced) {
          gsap.set([word, ...meta], { opacity: 1, y: 0 })
          gsap.set(line, { scaleX: 1 })
          return
        }

        gsap.set(word, { opacity: 0, y: 46 })
        gsap.set(meta, { opacity: 0, y: 20 })
        gsap.set(line, { scaleX: 0 })

        ScrollTrigger.create({
          trigger: row,
          start: 'top 84%',
          once: true,
          onEnter: () => {
            gsap
              .timeline({ defaults: { ease: EASE.ui } })
              .to(line, { scaleX: 1, duration: 0.75, ease: EASE.reveal })
              .to(word, { opacity: 1, y: 0, duration: DUR.reveal }, '-=0.5')
              .to(meta, { opacity: 1, y: 0, duration: 0.7, stagger: STAGGER.base }, '-=0.55')
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="section section--light why">
      <div className="shell">
        <SectionTitle eyebrow={content.whyUs.eyebrow} size="h1" className="why__title">
          <Lines lines={content.whyUs.heading} />
        </SectionTitle>

        <ol className="why__list">
          {reasons.map((r) => (
            <li key={r.id} className="why__row">
              <span className="why__draw" aria-hidden="true" />
              <span className="why__num mono-num">{r.number}</span>
              <h3 className="why__word">{r.title}</h3>
              <p className="why__text">{r.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
