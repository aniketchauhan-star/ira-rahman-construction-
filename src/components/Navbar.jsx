import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import Button from './Button'
import { navLinks } from '../data/sections'
import { scrollToId } from '../hooks/useLenis'
import './Navbar.css'
import { content } from '../data/content'

export default function Navbar({ active = 'home' }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page and trap focus while the mobile panel is open.
  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = panelRef.current?.querySelectorAll('a, button')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => () => document.body.classList.remove('is-locked'), [])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    // Release the scroll lock synchronously: React would otherwise
    // remove it in an effect that runs after the scroll is requested,
    // and the request would be swallowed by `overflow: hidden`.
    document.body.classList.remove('is-locked')
    requestAnimationFrame(() => scrollToId(id, -70))
  }

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner shell">
        <a href="#home" className="nav__brand" onClick={(e) => go(e, 'home')} data-cursor="hover">
          <Logo height={30} variant="mark" withWordmark />
        </a>

        <nav className="nav__links" aria-label={content.a11y.primaryNav}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`nav__link ${active === link.id ? 'is-active' : ''}`}
                  aria-current={active === link.id ? 'page' : undefined}
                  onClick={(e) => go(e, link.id)}
                  data-cursor="hover"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <Button
            as="a"
            href="#contact"
            variant="nav"
            className="nav__cta"
            arrow
            onClick={(e) => go(e, 'contact')}
          >
            {content.nav.cta}
          </Button>

          <button
            ref={toggleRef}
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="nav-panel"
            aria-label={open ? content.nav.closeMenu : content.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="nav__line" aria-hidden="true" />

      {/* ---- Mobile panel ---- */}
      <div
        id="nav-panel"
        ref={panelRef}
        className="nav__panel"
        hidden={!open}
        aria-hidden={!open}
      >
        <ul className="nav__panel-list">
          {navLinks.map((link, i) => (
            <li key={link.id} style={{ '--i': i }}>
              <a
                href={`#${link.id}`}
                className={active === link.id ? 'is-active' : ''}
                onClick={(e) => go(e, link.id)}
              >
                <span className="nav__panel-num">{String(i + 1).padStart(2, '0')}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="nav__panel-cta" onClick={(e) => go(e, 'contact')}>
          {content.nav.cta}
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
            <path d="M0 6h16M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </a>
      </div>
    </header>
  )
}
