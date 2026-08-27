import './Logo.css'
import { company } from '../data/company'

/**
 * The supplied logo artwork has a transparent background and uses
 * graphite linework, so on dark surfaces it is placed on an
 * off-white plate. The artwork itself is never recoloured, cropped
 * or stretched — aspect ratio is locked at 1:1.
 *
 * @param {'auto'|'plate'|'bare'} surface  plate = force the light disc
 */
export default function Logo({
  size = 46,
  surface = 'auto',
  withWordmark = false,
  className = '',
}) {
  const plated = surface === 'plate'

  return (
    <span
      className={`logo ${plated ? 'logo--plate' : ''} ${className}`}
      style={{ '--logo-size': `${size}px` }}
    >
      <span className="logo__disc">
        <img
          src={company.logo}
          alt={`${company.fullName} logo`}
          width={size}
          height={size}
          className="logo__img"
          decoding="async"
        />
      </span>

      {withWordmark && (
        <span className="logo__wordmark">
          <span className="logo__name">IRHA RAHMAN</span>
          <span className="logo__sub">Construction Company</span>
        </span>
      )}
    </span>
  )
}
