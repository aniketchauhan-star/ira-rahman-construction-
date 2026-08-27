import { useRef, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import Button from '../components/Button'
import { company, projectTypes, whatsappLink } from '../data/company'
import { submitEnquiry, validateEnquiry } from '../lib/submitEnquiry'
import './Contact.css'

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  projectType: '',
  location: '',
  message: '',
}

const FIELDS = [
  { id: 'name', label: 'Full name', type: 'text', autoComplete: 'name', span: 1 },
  { id: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', span: 1 },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', span: 1 },
  { id: 'projectType', label: 'Project type', type: 'select', span: 1 },
  { id: 'location', label: 'Location', type: 'text', autoComplete: 'address-level2', span: 2 },
  { id: 'message', label: 'Message', type: 'textarea', span: 2 },
]

export default function Contact() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const formRef = useRef(null)

  const set = (id, v) => {
    setValues((prev) => ({ ...prev, [id]: v }))
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validateEnquiry(values)
    setErrors(found)

    const firstError = Object.keys(found)[0]
    if (firstError) {
      formRef.current?.querySelector(`[name="${firstError}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      await submitEnquiry(values)
      setStatus('sent')
      setValues(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  const wa = whatsappLink()

  return (
    <section id="contact" className="section section--dark contact">
      <div className="shell contact__inner">
        {/* ---- Details ---- */}
        <div className="contact__aside">
          <SectionTitle eyebrow="Get in touch" size="h1">
            Start your
            <br />
            project.
          </SectionTitle>

          <p className="lead contact__lead">
            Send us the scope, the site and the timeline. We will come back with a clear, costed
            approach — not a vague estimate.
          </p>

          <dl className="contact__details">
            <div>
              <dt>Office</dt>
              <dd>
                {company.address.line1}
                <br />
                {company.address.line2}
                {company.address.country ? <>, {company.address.country}</> : null}
              </dd>
            </div>

            {company.phone && (
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${company.phone}`} data-cursor="hover">
                    {company.phoneDisplay || company.phone}
                  </a>
                </dd>
              </div>
            )}

            {company.email && (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${company.email}`} data-cursor="hover">
                    {company.email}
                  </a>
                </dd>
              </div>
            )}

            {wa && (
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={wa} target="_blank" rel="noopener noreferrer" data-cursor="hover">
                    Message us directly
                  </a>
                </dd>
              </div>
            )}

            <div>
              <dt>Working hours</dt>
              <dd>
                {company.workingHours.map((h) => (
                  <span key={h.days} className="contact__hours">
                    {h.days} — {h.time}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        {/* ---- Form ---- */}
        <div className="contact__form-wrap">
          {status === 'sent' ? (
            <div className="contact__success" role="status" aria-live="polite">
              <span className="contact__success-mark" aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <path d="M8 18l6 6 12-14" stroke="currentColor" strokeWidth="2.4" />
                </svg>
              </span>
              <h3 className="h3">Enquiry received.</h3>
              <p>
                Thank you. Your project details are with our team and we will respond during working
                hours.
              </p>
              <Button variant="ghost" onClick={() => setStatus('idle')}>
                Send another enquiry
              </Button>
            </div>
          ) : (
            <form ref={formRef} className="contact__form" onSubmit={onSubmit} noValidate>
              <div className="contact__grid">
                {FIELDS.map((f) => {
                  const err = errors[f.id]
                  const describedBy = err ? `${f.id}-error` : undefined

                  return (
                    <div
                      key={f.id}
                      className={`field field--span-${f.span} ${err ? 'field--error' : ''}`}
                    >
                      <label htmlFor={f.id}>{f.label}</label>

                      {f.type === 'select' ? (
                        <select
                          id={f.id}
                          name={f.id}
                          value={values[f.id]}
                          onChange={(e) => set(f.id, e.target.value)}
                          aria-invalid={Boolean(err)}
                          aria-describedby={describedBy}
                          required
                        >
                          <option value="">Select a project type</option>
                          {projectTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      ) : f.type === 'textarea' ? (
                        <textarea
                          id={f.id}
                          name={f.id}
                          rows={5}
                          value={values[f.id]}
                          onChange={(e) => set(f.id, e.target.value)}
                          placeholder="Scope, site conditions, timeline…"
                          aria-invalid={Boolean(err)}
                          aria-describedby={describedBy}
                          required
                        />
                      ) : (
                        <input
                          id={f.id}
                          name={f.id}
                          type={f.type}
                          autoComplete={f.autoComplete}
                          value={values[f.id]}
                          onChange={(e) => set(f.id, e.target.value)}
                          aria-invalid={Boolean(err)}
                          aria-describedby={describedBy}
                          required
                        />
                      )}

                      <span className="field__line" aria-hidden="true" />

                      {err && (
                        <span className="field__error" id={`${f.id}-error`} role="alert">
                          {err}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {status === 'error' && (
                <p className="contact__failed" role="alert">
                  Something went wrong sending your enquiry. Please try again, or contact us
                  directly.
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                arrow
                disabled={status === 'sending'}
                className="contact__submit"
              >
                {status === 'sending' ? 'Sending…' : 'Send project enquiry'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
