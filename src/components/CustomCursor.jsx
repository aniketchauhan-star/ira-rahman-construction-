import { useEffect, useRef } from 'react'
import { damp } from '../lib/scrollStore'
import './CustomCursor.css'

/**
 * Desktop-only cursor. A small graphite/bronze ring that expands on
 * interactive elements and shows "VIEW" over project imagery.
 * Never mounted on touch devices or under reduced motion.
 */
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const state = useRef({ x: 0, y: 0, rx: 0, ry: 0, visible: false })

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const s = state.current
    s.x = s.rx = window.innerWidth / 2
    s.y = s.ry = window.innerHeight / 2

    const onMove = (e) => {
      s.x = e.clientX
      s.y = e.clientY
      if (!s.visible) {
        s.visible = true
        dot.classList.add('is-visible')
        ring.classList.add('is-visible')
      }
    }

    const onLeave = () => {
      s.visible = false
      dot.classList.remove('is-visible')
      ring.classList.remove('is-visible')
    }

    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      const mode = target?.getAttribute('data-cursor')
      ring.dataset.mode = mode || 'default'
    }

    const onDown = () => ring.classList.add('is-down')
    const onUp = () => ring.classList.remove('is-down')

    let last = performance.now()
    let raf = 0
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      s.rx = damp(s.rx, s.x, 14, dt)
      s.ry = damp(s.ry, s.y, 14, dt)
      dot.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    document.documentElement.classList.add('has-custom-cursor')

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <span ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <span ref={ringRef} className="cursor-ring" data-mode="default" aria-hidden="true">
        <span className="cursor-ring__label">View</span>
      </span>
    </>
  )
}
