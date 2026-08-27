/**
 * ENQUIRY SUBMISSION
 * ---------------------------------------------------------------
 * Deliberately isolated from the form component so a backend can be
 * added later without touching any UI code.
 *
 * To connect a real endpoint, set VITE_ENQUIRY_ENDPOINT in a .env
 * file at the project root:
 *
 *   VITE_ENQUIRY_ENDPOINT=https://your-api.example.com/enquiries
 *
 * With no endpoint configured the enquiry is logged to the console
 * and resolves successfully, so the form and its success state stay
 * fully testable during development.
 */

const ENDPOINT = import.meta.env?.VITE_ENQUIRY_ENDPOINT || ''

export const hasBackend = Boolean(ENDPOINT)

export async function submitEnquiry(payload) {
  if (!ENDPOINT) {
    // eslint-disable-next-line no-console
    console.info('[irha] Enquiry captured (no backend configured yet):', payload)
    await new Promise((r) => setTimeout(r, 700))
    return { ok: true, delivered: false }
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
  })

  if (!res.ok) {
    throw new Error(`Enquiry failed with status ${res.status}`)
  }

  return { ok: true, delivered: true }
}

/* ---------------------------------------------------------------
   Validation
--------------------------------------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+()\-\s\d]{7,20}$/

export function validateEnquiry(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'Please enter your full name.'
  else if (values.name.trim().length < 2) errors.name = 'That name looks too short.'

  if (!values.phone.trim()) errors.phone = 'Please enter a phone number.'
  else if (!PHONE_RE.test(values.phone.trim())) errors.phone = 'Please check this phone number.'

  if (!values.email.trim()) errors.email = 'Please enter an email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please check this email address.'

  if (!values.projectType) errors.projectType = 'Please choose a project type.'

  if (!values.location.trim()) errors.location = 'Please enter the project location.'

  if (!values.message.trim()) errors.message = 'Please tell us about the project.'
  else if (values.message.trim().length < 12) errors.message = 'A little more detail would help.'

  return errors
}
