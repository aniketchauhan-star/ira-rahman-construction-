import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Button from '../components/Button'
import HeroScene from '../three/HeroScene'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scrollToId } from '../hooks/useLenis'
import { EASE, STAGGER } from '../lib/motion'
import './Hero.css'
import { content } from '../data/content'
import Lines, { DotList } from '../components/Copy'

export default function Hero({ ready = true }) {
  const rootRef = useRef(null)
  const cueRef = useRef(null)
  const [sceneRef, sceneInView] = useInView({ threshold: 0, rootMargin: '10%' })
  const reduced = useReducedMotion()

  // Entry animation, held back until the loader has finished.
  useEffect(() => {
    if (!ready) return
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('[data-hero-in]')

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 })
        gsap.set('.hero__rule', { scaleX: 1 })
        return
      }

      gsap
        .timeline({ defaults: { ease: EASE.ui } })
        .fromTo(targets, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 1, stagger: STAGGER.base })
        .fromTo('.hero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: EASE.reveal }, '-=0.7')
    }, root)

    return () => ctx.revert()
  }, [ready, reduced])

  // The scroll cue fades as soon as the visitor starts moving.
  useEffect(() => {
    const el = cueRef.current
    if (!el) return
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.35))
      el.style.opacity = String(1 - p)
      el.style.pointerEvents = p > 0.6 ? 'none' : 'auto'
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="home"
      ref={rootRef}
      className="hero section--no-road-pad"
      aria-label={content.a11y.heroRegion}
    >
      <div ref={sceneRef} className="hero__scene-holder">
        <HeroScene active={sceneInView} />
      </div>

      <div className="hero__scrim" aria-hidden="true" />

      <div className="shell hero__inner">
        <p className="eyebrow hero__eyebrow" data-hero-in>
          <DotList items={content.hero.eyebrow} />
        </p>

        <h1 className="hero__title h-display" data-hero-in>
          <Lines lines={content.hero.heading} />
        </h1>

        <span className="hero__rule" aria-hidden="true" />

        <p className="hero__copy lead" data-hero-in>
          {content.hero.copy}
        </p>

        <div className="hero__actions" data-hero-in>
          <Button
            as="a"
            href="#projects"
            variant="primary"
            size="lg"
            arrow
            onClick={(e) => {
              e.preventDefault()
              scrollToId('projects', -60)
            }}
          >
            {content.hero.primaryCta}
          </Button>

          <Button
            as="a"
            href="#contact"
            variant="ghost"
            size="lg"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('contact', -60)
            }}
          >
            {content.hero.secondaryCta}
          </Button>
        </div>
      </div>

      {/* ---- Scroll cue: a miniature road with a vehicle marker ---- */}
      <button
        ref={cueRef}
        type="button"
        className="hero__cue"
        onClick={() => scrollToId('about', -60)}
        aria-label={content.a11y.scrollCueButton}
      >
        <span className="hero__cue-label">{content.hero.scrollCue}</span>
        <span className="hero__cue-road" aria-hidden="true">
          <span className="hero__cue-dashes" />
          <span className="hero__cue-vehicle" />
        </span>
      </button>
    </section>
  )
}
