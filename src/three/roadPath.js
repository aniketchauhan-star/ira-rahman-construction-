/**
 * THE ROAD
 * ---------------------------------------------------------------
 * The journey is a single straight run along +X with a very gentle
 * lateral drift and a slight undulation, so the vehicle reads as
 * travelling over real ground rather than sliding on a rail.
 *
 * Everything (road geometry, scenery placement, vehicle transform)
 * samples these two functions, which is what keeps the vehicle
 * perfectly aligned with the surface at any scroll position.
 */

/** Total length of the journey in world units. */
export const ROAD_LENGTH = 260

/** Extra road built before the start and after the end of the journey. */
export const ROAD_PAD = 14

/** Road width in world units. */
export const ROAD_WIDTH = 3.1

/** Lateral drift (depth) of the road centreline at distance d. */
export function roadZ(d) {
  return Math.sin(d * 0.031) * 0.9 + Math.sin(d * 0.0093) * 0.55
}

/** Surface height of the road centreline at distance d. */
export function roadY(d) {
  return Math.sin(d * 0.047) * 0.075 + Math.sin(d * 0.017) * 0.05
}

/** Heading (yaw) of the road at distance d — used to steer the vehicle. */
export function roadYaw(d, e = 0.6) {
  return -Math.atan2(roadZ(d + e) - roadZ(d - e), e * 2)
}

/** Pitch of the road at distance d — used to tilt the vehicle. */
export function roadPitch(d, e = 0.6) {
  return -Math.atan2(roadY(d + e) - roadY(d - e), e * 2)
}

/**
 * Journey zones. `at` is normalised 0 → 1 along the road and lines
 * up with the section the visitor is reading, so the scenery
 * outside the window matches the story on the page.
 */
export const ZONES = [
  { id: 'home', at: 0.02, kind: 'gate' },
  { id: 'about', at: 0.17, kind: 'sign' },
  { id: 'services', at: 0.34, kind: 'machinery' },
  { id: 'barrier', at: 0.46, kind: 'barrier' },
  { id: 'projects', at: 0.6, kind: 'structures' },
  { id: 'materials', at: 0.75, kind: 'yard' },
  { id: 'machinery', at: 0.86, kind: 'crane' },
  { id: 'contact', at: 0.97, kind: 'finished' },
]
