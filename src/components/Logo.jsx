import './Logo.css'
import { company } from '../data/company'

/**
 * The company logo is a polished-steel lockup on a transparent
 * background, so it reads on dark ground and all but disappears on
 * light ground. Two things follow:
 *
 *  - `surface="plate"` seats it on a dark panel, which is what light
 *    sections use. It is a deliberate brand block, not a patch.
 *  - `variant` picks the artwork. The full lockup carries the name
 *    but its type turns to mush below ~90px tall, so anywhere small
 *    (navbar, floating controls) uses the cropped building mark and
 *    lets real type carry the name instead.
 *
 * The artwork is never recoloured, cropped further or stretched —
 * both files keep their own aspect ratio via `aspect-ratio`.
 */
export default function Logo({
  height = 40,
  variant = 'mark', // 'mark' (buildings only) | 'full' (with wordmark)
  surface = 'auto', // 'auto' | 'plate'
  withWordmark = false,
  className = '',
}) {
  const full = variant === 'full'
  const src = full ? company.logo : company.logoMark
  const ratio = full ? company.logoRatio : company.logoMarkRatio

  return (
    <span
      className={[
        'logo',
        `logo--${variant}`,
        surface === 'plate' ? 'logo--plate' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--logo-h': `${height}px`, '--logo-ratio': ratio }}
    >
      <span className="logo__frame">
        <img
          src={src}
          alt={`${company.fullName} logo`}
          className="logo__img"
          decoding="async"
        />
      </span>

      {withWordmark && (
        <span className="logo__wordmark">
          <span className="logo__name">{company.name}</span>
          <span className="logo__sub">{company.tagLabel}</span>
        </span>
      )}
    </span>
  )
}
