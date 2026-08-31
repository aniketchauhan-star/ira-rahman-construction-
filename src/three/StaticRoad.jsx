import { useEffect, useRef } from 'react'
import { scrollState } from '../lib/scrollStore'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './RoadJourney.css'

/**
 * Non-WebGL / reduced-motion road.
 *
 * The journey concept is preserved — a road runs along the bottom of
 * every section with the machine positioned at the visitor's place
 * in the page. Under reduced motion the vehicle is placed once and
 * left static; without WebGL it still tracks scroll, since a simple
 * CSS transform is not "heavy 3D motion".
 */
export default function StaticRoad({ hidden = false, reason = 'no-webgl' }) {
  const vehicleRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const tick = () => {
      if (vehicleRef.current) {
        const p = scrollState.progress
        vehicleRef.current.style.left = `${(8 + p * 74).toFixed(2)}%`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <div
      className={`road-static ${hidden ? 'road-static--hidden' : ''}`}
      aria-hidden="true"
      data-reason={reason}
    >
      <div className="road-static__ground" />
      <div className="road-static__dashes" />

      <div ref={vehicleRef} className="road-static__vehicle">
        <svg viewBox="0 0 92 52" fill="none" aria-hidden="true">
          {/* tracks */}
          <rect x="4" y="38" width="52" height="12" rx="6" fill="#15171a" />
          <circle cx="12" cy="44" r="4" fill="#5b6064" />
          <circle cx="48" cy="44" r="4" fill="#5b6064" />
          {/* body */}
          <rect x="10" y="22" width="40" height="15" fill="currentColor" />
          <rect x="10" y="35" width="40" height="3" fill="#c4820f" />
          <rect x="34" y="10" width="16" height="14" fill="#14171a" />
          <rect x="46" y="13" width="3" height="9" fill="#33474f" />
          {/* arm */}
          <path d="M50 24 76 14" stroke="#f2a81d" strokeWidth="5" />
          <path d="M76 14 84 26" stroke="#f2a81d" strokeWidth="4" />
          <path d="M80 24h9v8h-9z" fill="#1a1c1e" />
        </svg>
      </div>
    </div>
  )
}
