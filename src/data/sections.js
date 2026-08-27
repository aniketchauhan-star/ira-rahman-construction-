/**
 * SECTION MAP
 * ---------------------------------------------------------------
 * Single source of truth for navigation, the scroll progress rail
 * and the 3D journey. `journey` marks which sections appear as a
 * node on the vertical construction track.
 */

export const sections = [
  { id: 'home', label: 'Home', nav: true, journey: true, node: 'Start' },
  { id: 'about', label: 'About', nav: true, journey: true, node: 'About' },
  { id: 'services', label: 'Services', nav: true, journey: true, node: 'Services' },
  { id: 'projects', label: 'Projects', nav: true, journey: true, node: 'Projects' },
  { id: 'materials', label: 'Materials', nav: true, journey: true, node: 'Materials' },
  { id: 'machinery', label: 'Machinery', nav: false, journey: false, node: 'Machinery' },
  { id: 'contact', label: 'Contact', nav: true, journey: true, node: 'Contact' },
]

export const navLinks = sections.filter((s) => s.nav)
export const journeyNodes = sections.filter((s) => s.journey)
