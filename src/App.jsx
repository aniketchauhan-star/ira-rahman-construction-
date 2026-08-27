import { useCallback, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Loader from './components/Loader'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import CustomCursor from './components/CustomCursor'
import WhatsAppButton from './components/WhatsAppButton'
import Footer from './components/Footer'

import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import JourneyGate from './sections/JourneyGate'
import Projects from './sections/Projects'
import Materials from './sections/Materials'
import Machinery from './sections/Machinery'
import Gallery from './sections/Gallery'
import WhyUs from './sections/WhyUs'
import QuoteCTA from './sections/QuoteCTA'
import Contact from './sections/Contact'

import RoadJourney from './three/RoadJourney'

import { useLenis } from './hooks/useLenis'
import { useSectionTracking } from './hooks/useSectionTracking'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useIsTouch } from './hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

/** Sections keyed by surface, so fixed UI can adapt its contrast. */
const LIGHT_SECTIONS = new Set(['about', 'services', 'projects'])

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()

  useLenis(!reduced)
  const { active, completed } = useSectionTracking()

  // Always open at the top: a refresh mid-page would otherwise
  // restore a scroll position before ScrollTrigger has measured.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  // Let the fixed rail know which surface it is sitting on.
  useEffect(() => {
    document.body.dataset.surface = LIGHT_SECTIONS.has(active) ? 'light' : 'dark'
  }, [active])

  // Re-measure once the loader is gone and fonts have settled.
  const onLoaderDone = useCallback(() => {
    setLoaded(true)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [])

  useEffect(() => {
    if (!loaded) return
    const refresh = () => ScrollTrigger.refresh()
    if (document.fonts?.ready) document.fonts.ready.then(refresh)
    const t = setTimeout(refresh, 600)
    window.addEventListener('load', refresh)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
    }
  }, [loaded])

  useEffect(() => () => ScrollTrigger.getAll().forEach((t) => t.kill()), [])

  return (
    <>
      {!loaded && <Loader onComplete={onLoaderDone} />}

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar active={active} />

      <main id="main">
        <Hero ready={loaded} />
        <About />
        <Services />
        <JourneyGate />
        <Projects />
        <Materials />
        <Machinery />
        <Gallery />
        <WhyUs />
        <QuoteCTA />
        <Contact />
      </main>

      <Footer />

      {/* The construction journey — fixed to the bottom of the viewport */}
      <RoadJourney />

      <ScrollProgress active={active} completed={completed} />
      <WhatsAppButton />

      {!isTouch && !reduced && <CustomCursor />}
    </>
  )
}
