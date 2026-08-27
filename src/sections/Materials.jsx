import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitle from '../components/SectionTitle'
import SmartImage from '../components/SmartImage'
import MaterialsScene from '../three/MaterialsScene'
import { materials } from '../data/materials'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scrollState } from '../lib/scrollStore'
import './Materials.css'

gsap.registerPlugin(ScrollTrigger)

export default function Materials() {
  const rootRef = useRef(null)
  const [sceneRef, sceneInView] = useInView({ threshold: 0, rootMargin: '15%' })
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      // Feed the 3D scene: raw material → strong foundation.
      ScrollTrigger.create({
        trigger: root,
        start: 'top 70%',
        end: 'bottom 75%',
        onUpdate: (self) => {
          scrollState.materials = self.progress
        },
      })

      const cards = gsap.utils.toArray('.mat-card')
      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0 })
        return
      }

      gsap.set(cards, { opacity: 0, y: 40 })
      ScrollTrigger.create({
        trigger: '.materials__grid',
        start: 'top 84%',
        once: true,
        onEnter: () =>
          gsap.to(cards, { opacity: 1, y: 0, duration: DUR.reveal, ease: EASE.ui, stagger: STAGGER.base }),
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="materials" ref={rootRef} className="section section--graphite materials">
      {/* Drifting material particles — deliberately sparse. */}
      <div className="materials__particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>

      <div className="shell materials__inner">
        <div className="materials__head">
          <SectionTitle eyebrow="Supply" size="h1">
            Materials that
            <br />
            build strength.
          </SectionTitle>

          <p className="lead materials__intro">
            We supply and place the materials our own sites depend on. Graded, checked and delivered
            against the programme — because a structure is only as good as what goes into it.
          </p>
        </div>

        <ul className="materials__grid">
          {materials.map((m, i) => (
            <li key={m.id} className="mat-card" style={{ '--tone': m.tone, '--i': i }}>
              <div className="mat-card__media">
                <SmartImage
                  src={m.image}
                  alt={m.title}
                  folderLabel="/assets/materials/"
                  kindLabel="Material"
                />
              </div>

              <div className="mat-card__body">
                <span className="mat-card__num mono-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mat-card__title h3">{m.title}</h3>
                <p className="mat-card__desc">{m.description}</p>
              </div>

              <span className="mat-card__edge" aria-hidden="true" />
            </li>
          ))}
        </ul>

        <p className="materials__caption">
          <span className="materials__caption-k">Raw material</span>
          <span className="materials__caption-arrow" aria-hidden="true">
            →
          </span>
          <span className="materials__caption-k materials__caption-k--accent">
            Strong foundation
          </span>
        </p>
      </div>

      {/* 3D: scattered aggregate assembles into a level foundation. */}
      <div ref={sceneRef} className="materials__scene-holder">
        <MaterialsScene active={sceneInView} />
      </div>
    </section>
  )
}
