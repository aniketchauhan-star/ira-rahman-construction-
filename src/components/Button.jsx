import './Button.css'

function Arrow({ diagonal = false }) {
  return (
    <svg
      className={`btn__arrow ${diagonal ? 'btn__arrow--diag' : ''}`}
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 6h16M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/**
 * Primary   — burnt orange fill, off-white text
 * Secondary — transparent, graphite border
 * Ghost     — transparent, light border (for dark surfaces)
 * Fill      — orange sweeps in from the left on hover (CTA sections)
 */
export default function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  arrow = false,
  children,
  className = '',
  ...rest
}) {
  const Tag = as
  return (
    <Tag className={`btn btn--${variant} btn--${size} ${className}`} data-cursor="hover" {...rest}>
      <span className="btn__sweep" aria-hidden="true" />
      <span className="btn__label">{children}</span>
      {arrow && <Arrow />}
    </Tag>
  )
}
