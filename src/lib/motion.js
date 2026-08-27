/**
 * ANIMATION VOCABULARY
 * ---------------------------------------------------------------
 * One easing and duration set for the whole site, so nothing moves
 * with a character it did not earn.
 *
 *   ui      → hover states, buttons, small UI transitions
 *   reveal  → scroll-triggered entrances and drawn lines
 *   soft    → settling motion (images easing back to scale 1)
 */

export const EASE = {
  ui: 'power3.out',
  reveal: 'power2.inOut',
  soft: 'power2.out',
  exit: 'power4.inOut',
}

export const DUR = {
  /** 250–450ms band: hover and small UI */
  ui: 0.34,
  uiSlow: 0.46,
  /** 700–1100ms band: scroll reveals */
  reveal: 0.85,
  revealSlow: 1.05,
  /** image settle, deliberately a touch longer than its wipe */
  settle: 1.3,
}

/** Stagger steps, so grids of different sizes still feel related. */
export const STAGGER = {
  tight: 0.055,
  base: 0.08,
  loose: 0.12,
}
