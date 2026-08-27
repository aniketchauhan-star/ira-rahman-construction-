/**
 * COMPANY DETAILS
 * ---------------------------------------------------------------
 * Edit this file to update contact information across the site.
 * Any field left as an empty string ('') is automatically hidden
 * in the UI — no component edits required.
 */

export const company = {
  name: 'IRHA RAHMAN',
  fullName: 'IRHA RAHMAN CONSTRUCTION COMPANY',
  shortName: 'IRHA RAHMAN',
  tagline: 'Building stronger foundations for tomorrow.',
  logo: '/assets/logo/irha-rahman-logo.png',

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
  { id: 'years', value: 10, suffix: '+', label: 'Years of Experience' },
  { id: 'projects', value: 50, suffix: '+', label: 'Completed Projects' },
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
