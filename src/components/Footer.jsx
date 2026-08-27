import Logo from './Logo'
import { company } from '../data/company'
import { navLinks } from '../data/sections'
import { services } from '../data/services'
import { scrollToId } from '../hooks/useLenis'
import './Footer.css'

const SOCIAL_PATHS = {
  instagram:
    'M12 2.9c3 0 3.3 0 4.5.07 1.1.05 1.7.24 2.1.4.5.2.9.45 1.3.85.4.4.65.8.85 1.3.16.4.35 1 .4 2.1.06 1.2.07 1.5.07 4.5s0 3.3-.07 4.5c-.05 1.1-.24 1.7-.4 2.1-.2.5-.45.9-.85 1.3-.4.4-.8.65-1.3.85-.4.16-1 .35-2.1.4-1.2.06-1.5.07-4.5.07s-3.3 0-4.5-.07c-1.1-.05-1.7-.24-2.1-.4a3.5 3.5 0 0 1-1.3-.85 3.5 3.5 0 0 1-.85-1.3c-.16-.4-.35-1-.4-2.1C2.9 15.3 2.9 15 2.9 12s0-3.3.07-4.5c.05-1.1.24-1.7.4-2.1.2-.5.45-.9.85-1.3.4-.4.8-.65 1.3-.85.4-.16 1-.35 2.1-.4C8.7 2.9 9 2.9 12 2.9Zm0 5.1a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Zm5.1-6.8a.94.94 0 1 1-1.9 0 .94.94 0 0 1 1.9 0Z',
  facebook:
    'M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.63c-.29-.04-1.28-.13-2.43-.13-2.4 0-4.05 1.47-4.05 4.17v2.33H7.5V13h2.72v8h3.28Z',
  linkedin:
    'M6.94 8.5H3.9V21h3.04V8.5ZM5.42 3a1.76 1.76 0 1 0 0 3.52 1.76 1.76 0 0 0 0-3.52ZM21 21h-3.03v-6.1c0-1.45-.03-3.32-2.02-3.32-2.03 0-2.34 1.58-2.34 3.21V21H10.6V8.5h2.9v1.71h.04a3.2 3.2 0 0 1 2.88-1.58c3.08 0 3.65 2.03 3.65 4.66V21Z',
}

export default function Footer() {
  const year = new Date().getFullYear()
  const socials = company.socials.filter((s) => s.url)

  const go = (e, id) => {
    e.preventDefault()
    scrollToId(id, -70)
  }

  return (
    <footer className="foot" id="footer">
      <span className="foot__ghost" aria-hidden="true">
        IRHA RAHMAN
      </span>

      <div className="shell foot__inner">
        <div className="foot__brand">
          <Logo size={64} surface="plate" withWordmark />
          <p className="foot__tag">
            Building construction, civil infrastructure and construction materials — delivered with
            strength, precision and reliability.
          </p>

          {socials.length > 0 && (
            <ul className="foot__socials">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    data-cursor="hover"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={SOCIAL_PATHS[s.id] || SOCIAL_PATHS.linkedin} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav className="foot__col" aria-label="Footer navigation">
          <h2 className="foot__h">Navigate</h2>
          <ul>
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={(e) => go(e, l.id)} data-cursor="hover">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="foot__col">
          <h2 className="foot__h">Services</h2>
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <a href="#services" onClick={(e) => go(e, 'services')} data-cursor="hover">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <address className="foot__col foot__contact">
          <h2 className="foot__h">Contact</h2>
          <ul>
            <li>
              <span className="foot__k">Office</span>
              <span>
                {company.address.line1}
                <br />
                {company.address.line2}
                {company.address.country ? <>, {company.address.country}</> : null}
              </span>
            </li>

            {company.phone && (
              <li>
                <span className="foot__k">Phone</span>
                <a href={`tel:${company.phone}`} data-cursor="hover">
                  {company.phoneDisplay || company.phone}
                </a>
              </li>
            )}

            {company.email && (
              <li>
                <span className="foot__k">Email</span>
                <a href={`mailto:${company.email}`} data-cursor="hover">
                  {company.email}
                </a>
              </li>
            )}

            {company.workingHours.map((h) => (
              <li key={h.days}>
                <span className="foot__k">{h.days}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </address>
      </div>

      <div className="shell foot__base">
        <p>© {year} {company.fullName}</p>
        <p className="foot__base-note">All rights reserved.</p>
      </div>
    </footer>
  )
}
