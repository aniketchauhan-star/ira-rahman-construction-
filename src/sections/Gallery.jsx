import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitle from '../components/SectionTitle'
import ImageReveal from '../components/ImageReveal'
import { siteGallery } from '../data/gallery'
import { useIsMobile } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './Gallery.css'
import { content } from '../data/content'
import Lines from '../components/Copy'

gsap.registerPlugin(ScrollTrigger)

/**
 * ON SITE
 * Desktop: the strip moves sideways while the section is pinned —
 * capped at roughly 1.2 viewports so the visitor is never trapped.
 * Mobile / reduced motion: a normal swipeable, snapping strip.
 */
export default function Gallery() {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track || isMobile || reduced) return

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80)

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${Math.min(getDistance() * 1.05, window.innerHeight * 1.25)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      return () => tween.kill()
    }, root)

    return () => ctx.revert()
  }, [isMobile, reduced])

  return (
    <section
      ref={rootRef}
      className="gallery section--no-road-pad"
      aria-label={content.a11y.galleryRegion}
    >
      <div className="shell gallery__head">
        <SectionTitle eyebrow={content.gallery.eyebrow} size="h2">
          <Lines lines={content.gallery.heading} />
        </SectionTitle>
        <p className="gallery__hint">
          {isMobile || reduced ? content.gallery.hintMobile : content.gallery.hintDesktop}
        </p>
      </div>

      <div className={`gallery__viewport ${isMobile || reduced ? 'gallery__viewport--native' : ''}`}>
        <div ref={trackRef} className="gallery__track no-scrollbar">
          {siteGallery.map((shot, i) => (
            <figure key={shot.id} className={`shot shot--${shot.ratio}`}>
              <ImageReveal
                className="shot__media"
                src={shot.image}
                alt={shot.caption}
                folderLabel="/assets/site/"
                kindLabel={content.placeholders.site}
                delay={i * 0.04}
              />
              <figcaption className="shot__cap">
                <span className="shot__num mono-num">{String(i + 1).padStart(2, '0')}</span>
                {shot.caption}
              </figcaption>
            </figure>
          ))}

          <div className="gallery__end" aria-hidden="true">
            <span className="gallery__end-rule" />
            <span className="gallery__end-text">
              <Lines lines={content.gallery.endText} />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
