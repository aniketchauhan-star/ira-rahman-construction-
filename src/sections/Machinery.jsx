import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import SmartImage from '../components/SmartImage'
import { machinery } from '../data/machinery'
import { useIsMobile } from '../hooks/useMediaQuery'
import './Machinery.css'
import { content } from '../data/content'
import Lines from '../components/Copy'

/**
 * Nothing auto-advances — the visitor drives this.
 *
 * Desktop gets a tabbed showcase: select a machine and its use on
 * site is revealed below, lit by a soft orange spotlight.
 *
 * On a phone a tab panel would hide four short lines of copy behind
 * four taps, so the same content is laid out as a plain list with
 * every machine's use already on screen. Real list semantics, no
 * tab roles — the markup matches what the layout actually is.
 */
export default function Machinery() {
  const [activeId, setActiveId] = useState(machinery[0].id)
  const isMobile = useIsMobile()
  const active = machinery.find((m) => m.id === activeId) || machinery[0]

  const Media = ({ m }) => (
    <span className="mach__media">
      <SmartImage
        src={m.image}
        alt={m.title}
        folderLabel="/assets/machinery/"
        kindLabel={content.placeholders.machine}
        imgClassName="mach__img"
      />
    </span>
  )

  return (
    <section id="machinery" className="section section--dark mach">
      <div className="shell">
        <div className="mach__head">
          <SectionTitle eyebrow={content.machinery.eyebrow} size="h1">
            <Lines lines={content.machinery.heading} />
          </SectionTitle>

          <p className="lead mach__intro">
            {content.machinery.intro}
            {!isMobile && content.machinery.introDesktopSuffix}
          </p>
        </div>

        {isMobile ? (
          <ul className="mach__rows">
            {machinery.map((m) => (
              <li key={m.id} className="mach__row">
                <span className="mach__spot" aria-hidden="true" />
                <Media m={m} />
                <span className="mach__row-body">
                  <span className="mach__spec">{m.spec}</span>
                  <h3 className="mach__name">{m.title}</h3>
                  <p className="mach__usage">{m.usage}</p>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mach__stage">
            <ul className="mach__list" role="tablist" aria-label={content.a11y.machineryTabs}>
              {machinery.map((m, i) => {
                const isActive = m.id === activeId
                return (
                  <li key={m.id} className={`mach__item ${isActive ? 'is-active' : ''}`}>
                    <button
                      type="button"
                      role="tab"
                      id={`mach-tab-${m.id}`}
                      aria-selected={isActive}
                      aria-controls={`mach-panel-${m.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActiveId(m.id)}
                      onMouseEnter={() => setActiveId(m.id)}
                      onFocus={() => setActiveId(m.id)}
                      onKeyDown={(e) => {
                        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
                        e.preventDefault()
                        const dir = e.key === 'ArrowRight' ? 1 : -1
                        const next = machinery[(i + dir + machinery.length) % machinery.length]
                        setActiveId(next.id)
                        document.getElementById(`mach-tab-${next.id}`)?.focus()
                      }}
                      data-cursor="hover"
                    >
                      <span className="mach__spot" aria-hidden="true" />
                      <Media m={m} />
                      <span className="mach__meta">
                        <span className="mach__spec">{m.spec}</span>
                        <span className="mach__name">{m.title}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div
              className="mach__detail"
              role="tabpanel"
              id={`mach-panel-${active.id}`}
              aria-labelledby={`mach-tab-${active.id}`}
            >
              <span className="mach__detail-rule" aria-hidden="true" />
              <h3 className="mach__detail-title h3" key={active.id}>
                {active.title}
              </h3>
              <p className="mach__detail-usage">{active.usage}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
