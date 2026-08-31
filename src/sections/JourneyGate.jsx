import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { EASE, STAGGER } from '../lib/motion'
import './JourneyGate.css'
import { content } from '../data/content'
import { Rich } from '../components/Copy'

gsap.registerPlugin(ScrollTrigger)

/**
 * The moment between Services and Projects.
 *
 * As the visitor scrolls, the temporary construction barrier the
 * vehicle has been approaching swings open and the heading is
 * revealed behind it. Scrubbed, not pinned — the page keeps moving.
 */
export default function JourneyGate() {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.gate__leaf--l', { xPercent: -100 })
        gsap.set('.gate__leaf--r', { xPercent: 100 })
        gsap.set('.gate__line', { opacity: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          end: 'bottom 62%',
          scrub: 0.7,
        },
      })

      tl.to('.gate__leaf--l', { xPercent: -104, ease: EASE.reveal }, 0)
        .to('.gate__leaf--r', { xPercent: 104, ease: EASE.reveal }, 0)
        .fromTo(
          '.gate__line',
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, ease: EASE.ui, stagger: STAGGER.loose },
          0.18
        )
        .fromTo('.gate__rule', { scaleX: 0 }, { scaleX: 1, ease: EASE.reveal }, 0.4)
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="gate section--no-road-pad" aria-label={content.a11y.gateRegion}>
      <div className="gate__leaf gate__leaf--l" aria-hidden="true">
        <span className="gate__hazard" />
      </div>
      <div className="gate__leaf gate__leaf--r" aria-hidden="true">
        <span className="gate__hazard" />
      </div>

      <div className="shell gate__inner">
        <h2 className="gate__title h1">
          {content.journeyGate.heading.map((line) => (
            <span key={line} className="gate__line">
              <Rich text={line} />
            </span>
          ))}
        </h2>
        <span className="gate__rule" aria-hidden="true" />
      </div>
    </section>
  )
}
