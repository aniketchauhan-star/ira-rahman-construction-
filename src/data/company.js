/**
 * COMPANY DETAILS
 * ---------------------------------------------------------------
 * Edit this file to update contact information across the site.
 * Any field left as an empty string ('') is automatically hidden
 * in the UI — no component edits required.
 */

export const company = {
  name: 'IRHA',
  fullName: 'IRHA CONSTRUCTION COMPANY',
  shortName: 'IRHA Construction',
  monogram: 'I & I',
  /* Small line under the wordmark in the navbar lockup */
  tagLabel: 'Construction Company',
  tagline: 'Building stronger foundations for tomorrow.',

  /* Logo artwork.
     `logo`     — the full lockup, including the wordmark.
     `logoMark` — the buildings cropped out of that lockup, for use
                  anywhere too small for the wordmark to be legible.
     Both are chrome on a transparent background, so they need a
     dark ground; the Logo component handles that. Ratios are stored
     here so the markup can reserve space without a layout shift. */
  logo: '/assets/logo/irha-construction-logo.png',
  logoRatio: '1536 / 1024',
  logoMark: '/assets/logo/irha-construction-mark-sm.png',
  logoMarkRatio: '1482 / 640',

  // --- Contact -------------------------------------------------
  // Replace the placeholders below with your real details.
  address: {
    line1: 'Add your office address here',
    line2: 'City, State — PIN',
    country: 'India',
  },

  // Leave '' to hide the phone row.
  phone: '',
  phoneDisplay: '',

  // Leave '' to hide the email row.
  email: '',

  // WhatsApp number in international format WITHOUT '+' or spaces,
  // e.g. '919999999999'. Leave '' to hide the floating button.
  whatsapp: '',

  workingHours: [
    { days: 'Monday – Saturday', time: '9:00 AM – 7:00 PM' },
    { days: 'Sunday', time: 'On-site coordination only' },
  ],

  // --- Social --------------------------------------------------
  // Leave url as '' to hide an individual icon.
  socials: [
    { id: 'instagram', label: 'Instagram', url: '' },
    { id: 'facebook', label: 'Facebook', url: '' },
    { id: 'linkedin', label: 'LinkedIn', url: '' },
  ],
}

export const stats = [
  { id: 'years', value: 1, suffix: '+', label: 'Years of Experience' },
  { id: 'projects', value: 1, suffix: '+', label: 'Completed Projects' },
  { id: 'quality', value: 100, suffix: '%', label: 'Commitment to Quality' },
  { id: 'support', value: 24, suffix: '/7', label: 'Site Coordination' },
]

export const projectTypes = [
  'Building Construction',
  'Civil Infrastructure',
  'Structural Work',
  'Construction Materials',
  'Earthwork & Site Development',
  'Other',
]

export const whatsappLink = () => {
  if (!company.whatsapp) return ''
  const text = encodeURIComponent(
    `Hello ${company.fullName}, I would like to discuss a construction project.`
  )
  return `https://wa.me/${company.whatsapp}?text=${text}`
}
