/**
 * SCROLL STORE
 * ---------------------------------------------------------------
 * A single mutable object shared between the DOM (Lenis + GSAP)
 * and the Three.js scenes.
 *
 * Three.js reads this inside useFrame — it never triggers a React
 * re-render, which is what keeps the 3D journey at a stable frame
 * rate while the page scrolls.
 */

export const scrollState = {
  /** 0 → 1 across the whole document */
  progress: 0,
  /** damped copy of `progress`, used by the vehicle so it eases */
  smoothProgress: 0,
  /** signed progress delta per second — drives tracks + dust */
  velocity: 0,
  /** absolute scroll offset in px */
  y: 0,
  /** viewport height in px */
  vh: typeof window !== 'undefined' ? window.innerHeight : 900,
  /** true while the user is actively scrolling */
  moving: false,
  /** id of the section currently in view */
  active: 'home',
  /** 0 → 1 progress within the road journey (excludes the footer) */
  journey: 0,
  /** 0 → 1 progress through the Materials section — drives the
      raw-material-to-foundation assembly in MaterialsScene */
  materials: 0,
}

let lastY = 0
let lastT = 0
let idleTimer = null

export function setScroll(y, docHeight) {
  const now = performance.now()
  const max = Math.max(1, docHeight - window.innerHeight)
  const p = Math.min(1, Math.max(0, y / max))

  if (lastT) {
    const dt = Math.max(1, now - lastT) / 1000
    // px/s normalised into progress/s
    scrollState.velocity = (y - lastY) / max / dt
  }

  scrollState.progress = p
  scrollState.y = y
  scrollState.vh = window.innerHeight
  lastY = y
  lastT = now

  scrollState.moving = true
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    scrollState.moving = false
    scrollState.velocity = 0
  }, 110)
}

/** Linear interpolation helper used across the 3D layer. */
export const lerp = (a, b, t) => a + (b - a) * t

/** Frame-rate independent damping. */
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt))

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Remap a value from one range into another, clamped. */
export function mapRange(v, inMin, inMax, outMin, outMax) {
  const t = clamp((v - inMin) / (inMax - inMin))
  return outMin + (outMax - outMin) * t
}
