import { Fragment } from 'react'
import { parseAccents } from '../data/content'

/**
 * Renders copy written in `src/data/content.js`.
 *
 * Headings there are arrays of lines with `[brackets]` marking the
 * highlighted word, which keeps the content file plain text instead
 * of markup:
 *
 *     heading: ['Have a project', 'in [mind?]']
 *
 * becomes
 *
 *     Have a project<br />in <span class="accent">mind?</span>
 */
export function Lines({ lines }) {
  const arr = Array.isArray(lines) ? lines : [lines]

  return arr.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      <Rich text={line} />
    </Fragment>
  ))
}

/** A single string, with `[bracketed]` words drawn in the accent colour. */
export function Rich({ text }) {
  return parseAccents(text).map((part, i) =>
    part.accent ? (
      <span key={i} className="accent">
        {part.text}
      </span>
    ) : (
      <Fragment key={i}>{part.text}</Fragment>
    )
  )
}

/**
 * A list joined by dot separators, used for the hero eyebrow.
 * The dots are decorative, so they are hidden from screen readers.
 */
export function DotList({ items }) {
  return items.map((item, i) => (
    <Fragment key={item}>
      {i > 0 && (
        <>
          {' '}
          <span aria-hidden="true">•</span>{' '}
        </>
      )}
      {item}
    </Fragment>
  ))
}

export default Lines
