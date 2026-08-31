import { content } from '../data/content'
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
  const m = content.contact.validation

  if (!values.name.trim()) errors.name = m.nameRequired
  else if (values.name.trim().length < 2) errors.name = m.nameShort

  if (!values.phone.trim()) errors.phone = m.phoneRequired
  else if (!PHONE_RE.test(values.phone.trim())) errors.phone = m.phoneInvalid

  if (!values.email.trim()) errors.email = m.emailRequired
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = m.emailInvalid

  if (!values.projectType) errors.projectType = m.projectTypeRequired

  if (!values.location.trim()) errors.location = m.locationRequired

  if (!values.message.trim()) errors.message = m.messageRequired
  else if (values.message.trim().length < 12) errors.message = m.messageShort

  return errors
}
