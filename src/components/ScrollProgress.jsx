import { useEffect, useRef } from 'react'
import { journeyNodes } from '../data/sections'
import { scrollToId } from '../hooks/useLenis'
import { scrollState, damp } from '../lib/scrollStore'
import './ScrollProgress.css'

/**
 * A miniature vertical construction track pinned to the right edge.
 * The dashed centre line fills as you descend and a small marker
 * rides down it — the 2D echo of the 3D road journey.
 */
export default function ScrollProgress({ active, completed = [] }) {
  const fillRef = useRef(null)
  const markerRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    let smooth = scrollState.progress
    let last = performance.now()

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      smooth = damp(smooth, scrollState.progress, 9, dt)

      if (fillRef.current) fillRef.current.style.transform = `scaleY(${smooth.toFixed(4)})`
      if (markerRef.current) {
        markerRef.current.style.top = `${(smooth * 100).toFixed(3)}%`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const activeIndex = journeyNodes.findIndex((n) => n.id === active)

  return (
    <aside className="rail" aria-label="Page progress">
      <div className="rail__track" aria-hidden="true">
        <span className="rail__dashes" />
        <span ref={fillRef} className="rail__fill" />
        <span ref={markerRef} className="rail__marker">
          <span className="rail__marker-body" />
        </span>
      </div>

      <ul className="rail__nodes">
        {journeyNodes.map((node, i) => {
          const state =
            node.id === active ? 'active' : completed.includes(node.id) || i < activeIndex ? 'done' : 'next'
          return (
            <li key={node.id} className={`rail__node rail__node--${state}`}>
              <button
                type="button"
                onClick={() => scrollToId(node.id, -70)}
                aria-label={`Go to ${node.label} section`}
                aria-current={node.id === active ? 'true' : undefined}
                data-cursor="hover"
              >
                <span className="rail__dot" aria-hidden="true" />
                <span className="rail__label">{node.node}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
