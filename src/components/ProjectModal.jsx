import { useCallback, useEffect, useRef } from 'react'
import SmartImage from './SmartImage'
import './ProjectModal.css'
import { content } from '../data/content'

/**
 * Full-screen project viewer.
 * Closes on ESC or backdrop click, restores focus to the opener,
 * supports arrow-key and swipe navigation.
 */
export default function ProjectModal({ projects, index, onClose, onNavigate }) {
  const open = index !== null && index >= 0
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const openerRef = useRef(null)
  const touch = useRef({ x: 0, y: 0, active: false })

  const project = open ? projects[index] : null

  const next = useCallback(() => onNavigate((index + 1) % projects.length), [index, projects.length, onNavigate])
  const prev = useCallback(
    () => onNavigate((index - 1 + projects.length) % projects.length),
    [index, projects.length, onNavigate]
  )

  useEffect(() => {
    if (!open) return

    openerRef.current = document.activeElement
    document.body.classList.add('is-locked')
    closeRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll('button, a[href]')
        if (!nodes?.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus()
    }
  }, [open, onClose, next, prev])

  if (!open || !project) return null

  const onTouchStart = (e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true }
  }

  const onTouchEnd = (e) => {
    if (!touch.current.active) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    touch.current.active = false
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev()
    }
  }

  return (
    <div className="pmodal" role="presentation" onClick={onClose}>
      <div className="pmodal__backdrop" />

      <div
        ref={dialogRef}
        className="pmodal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pmodal-title"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          ref={closeRef}
          type="button"
          className="pmodal__close"
          onClick={onClose}
          aria-label={content.projects.viewer.close}
          data-cursor="hover"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>

        <figure className="pmodal__media" key={project.id}>
          <SmartImage
            src={project.image}
            alt={`${project.title} — ${project.category}`}
            folderLabel="/assets/projects/"
            kindLabel={content.placeholders.project}
            eager
          />
        </figure>

        <div className="pmodal__body">
          <span className="eyebrow">{project.category}</span>
          <h2 id="pmodal-title" className="pmodal__title h2">
            {project.title}
          </h2>
          <p className="pmodal__desc">{project.description}</p>

          <dl className="pmodal__facts">
            <div>
              <dt>{content.projects.viewer.location}</dt>
              <dd>{project.location}</dd>
            </div>
            <div>
              <dt>{content.projects.viewer.year}</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>{content.projects.viewer.scope}</dt>
              <dd>{project.category}</dd>
            </div>
          </dl>

          <div className="pmodal__nav">
            <button type="button" onClick={prev} aria-label={content.a11y.prevProject} data-cursor="hover">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                <path d="M18 6H2M7 1 2 6l5 5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              {content.projects.viewer.prev}
            </button>

            <span className="pmodal__count mono-num">
              {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>

            <button type="button" onClick={next} aria-label={content.a11y.nextProject} data-cursor="hover">
              {content.projects.viewer.next}
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                <path d="M0 6h16M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
