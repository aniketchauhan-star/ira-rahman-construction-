import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sections } from '../data/sections'
import { scrollState, clamp } from '../lib/scrollStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * Watches every registered section and keeps both React state (for
 * the progress rail) and the shared scroll store (for Three.js) in
 * sync. Also derives `journey` — progress along the road, which
 * ends at the contact section rather than the bottom of the footer.
 */
export function useSectionTracking() {
  const [active, setActive] = useState('home')
  const [completed, setCompleted] = useState([])

  useEffect(() => {
    const triggers = []

    sections.forEach((section, i) => {
      const el = document.getElementById(section.id)
      if (!el) return

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (!self.isActive) return
            setActive(section.id)
            scrollState.active = section.id
            setCompleted(sections.slice(0, i).map((s) => s.id))
          },
        })
      )
    })

    // Road journey: from the top of the page to the end of Contact.
    const contact = document.getElementById('contact')
    if (contact) {
      triggers.push(
        ScrollTrigger.create({
          trigger: document.body,
          start: 'top top',
          endTrigger: contact,
          end: 'bottom bottom',
          onUpdate: (self) => {
            scrollState.journey = clamp(self.progress)
          },
        })
      )
    }

    ScrollTrigger.refresh()

    return () => triggers.forEach((t) => t.kill())
  }, [])

  return { active, completed }
}

export default useSectionTracking
