import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitle from '../components/SectionTitle'
import ServiceCard from '../components/ServiceCard'
import { services } from '../data/services'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './Services.css'
import { content } from '../data/content'
import Lines from '../components/Copy'

gsap.registerPlugin(ScrollTrigger)

export default function Services() {
  const gridRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.svc')

      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0 })
        return
      }

      gsap.set(cards, { opacity: 0, y: 44 })

      ScrollTrigger.create({
        trigger: grid,
        start: 'top 82%',
        once: true,
        onEnter: () =>
          gsap.to(cards, { opacity: 1, y: 0, duration: DUR.reveal, ease: EASE.ui, stagger: STAGGER.tight }),
      })
    }, grid)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="services" className="section section--light services">
      <div className="shell">
        <div className="services__head">
          <SectionTitle eyebrow={content.services.eyebrow} size="h1">
            <Lines lines={content.services.heading} />
          </SectionTitle>

          <p className="lead services__intro">{content.services.intro}</p>
        </div>

        <div ref={gridRef} className="services__grid">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
