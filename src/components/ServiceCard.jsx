import ServiceIcon from './ServiceIcon'
import { scrollToId } from '../hooks/useLenis'
import './ServiceCard.css'

/**
 * Architectural panel rather than a rounded card: the number sits
 * top-right like a drawing reference, and an orange structural line
 * draws down the left edge on hover as the panel inverts to graphite.
 *
 * The panel is a link to the enquiry form — the arrow is a promise,
 * so it has to lead somewhere.
 */
export default function ServiceCard({ service, index = 0 }) {
  return (
    <a
      className="svc"
      href="#contact"
      style={{ '--i': index }}
      data-cursor="hover"
      aria-label={`${service.title} — send us an enquiry`}
      onClick={(e) => {
        e.preventDefault()
        scrollToId('contact', -60)
      }}
    >
      <span className="svc__edge" aria-hidden="true" />

      <span className="svc__head">
        <ServiceIcon name={service.icon} className="svc__icon" />
        <span className="svc__num mono-num">{service.number}</span>
      </span>

      <h3 className="svc__title h3">{service.title}</h3>
      <p className="svc__desc">{service.description}</p>

      <span className="svc__arrow" aria-hidden="true">
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
          <path d="M0 6h17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </a>
  )
}
