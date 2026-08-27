/**
 * Minimal single-weight line icons drawn on a 40×40 grid so every
 * service panel shares the same drafting language.
 */
const PATHS = {
  building: (
    <>
      <path d="M6 34h28M11 34V10h11v24M22 34V17h7v17" />
      <path d="M14.5 14h4M14.5 20h4M14.5 26h4M25 21h1.5M25 27h1.5" />
    </>
  ),
  road: (
    <>
      <path d="M11 34 16 8h8l5 26" />
      <path d="M20 11v4M20 20v4M20 29v4" />
    </>
  ),
  frame: (
    <>
      <path d="M8 32V9h24v23" />
      <path d="M8 20h24M20 9v23M8 9l12 11M32 9 20 20" />
    </>
  ),
  stone: (
    <>
      <path d="M6 32h28" />
      <path d="m14 32-4-7 5-5 5 5-2 7M22 32l-1-6 5-4 5 5-2 5" />
      <path d="m15 20 4-6 6 4" />
    </>
  ),
  excavator: (
    <>
      <path d="M6 30h13a4 4 0 0 1 0 4H10a4 4 0 0 1-4-4Z" />
      <path d="M10 30v-7h9v7" />
      <path d="m19 24 7-13 5 3-4 12" />
      <path d="m27 26 6 2-2 5-6-2Z" />
    </>
  ),
  helmet: (
    <>
      <path d="M6 27h28v3H6z" />
      <path d="M9 27v-4a11 11 0 0 1 22 0v4" />
      <path d="M17 8v6M23 8v6M15 7h10" />
    </>
  ),
}

export default function ServiceIcon({ name = 'building', className = '' }) {
  return (
    <svg
      className={`svc-icon ${className}`}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {PATHS[name] || PATHS.building}
    </svg>
  )
}
