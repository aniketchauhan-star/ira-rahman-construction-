/**
 * Brand colours shared by every Three.js scene.
 *
 * Sampled from the company logo, which is polished steel: mean
 * saturation 0.07 with a consistent cool cast. Emphasis in these
 * scenes therefore comes from luminance separation — near-black
 * undercarriage, mid steel structure, bright silver bodywork —
 * rather than from hue.
 */
export const C = {
  /* ---- Chrome ramp ---- */
  specular: '#fdfeff',
  platinum: '#eef1f5',
  silver: '#c4c9d1',
  steelLight: '#9aa0a8',
  steel: '#72767e',
  steelDark: '#4a4e54',

  /* ---- Structure ---- */
  graphite2: '#1e2226',
  graphite: '#14171a',
  dark: '#0a0b0d',
  black: '#050507',
  offwhite: '#f2f3f5',

  /* ---- Ground ---- */
  asphalt: '#131619',
  asphaltLight: '#1c2024',
  rubber: '#0c0e10',
  ground: '#2b2f33',

  /* ---- Site materials, held to the same cool neutral range ---- */
  concrete: '#8a8e94',
  concreteDark: '#65696f',
  aggregate: '#5c6065',
  sand: '#9aa0a8',

  /* ---- Emphasis ----
     The bright end of the ramp replaces the old orange: road edges,
     markings, beacons and highlights all read as polished metal. */
  accent: '#eef1f5',
  accentDim: '#c4c9d1',
}
