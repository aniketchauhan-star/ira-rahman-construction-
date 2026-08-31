import Button from '../components/Button'
import { scrollToId } from '../hooks/useLenis'
import './QuoteCTA.css'
import { content } from '../data/content'
import Lines from '../components/Copy'

/** Full-width closing statement with a crane structure reaching in. */
export default function QuoteCTA() {
  return (
    <section className="cta section--no-road-pad" aria-label={content.a11y.ctaRegion}>
      {/* Crane structure extending from the right */}
      <svg className="cta__crane" viewBox="0 0 420 300" fill="none" aria-hidden="true">
        <path d="M360 300V44" stroke="currentColor" strokeWidth="7" />
        <path d="M348 300V44M372 300V44" stroke="currentColor" strokeWidth="2" opacity=".55" />
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M348 ${72 + i * 26} 372 ${58 + i * 26}M372 ${72 + i * 26} 348 ${58 + i * 26}`}
            stroke="currentColor"
            strokeWidth="1.6"
            opacity=".45"
          />
        ))}
        <path d="M60 44h340" stroke="currentColor" strokeWidth="6" />
        <path d="M60 44 360 18M60 44l300 0" stroke="currentColor" strokeWidth="1.6" opacity=".5" />
        <path d="M360 18V44" stroke="currentColor" strokeWidth="3" />
        <path d="M410 44h10M400 30h20v14h-20z" stroke="currentColor" strokeWidth="2" />
        <path d="M140 44v92" stroke="currentColor" strokeWidth="1.6" opacity=".7" />
        <rect x="128" y="136" width="24" height="20" stroke="currentColor" strokeWidth="2" />
      </svg>

      <div className="shell cta__inner">
        <h2 className="cta__title h1">
          <Lines lines={content.quoteCta.heading} />
        </h2>

        <p className="cta__text">{content.quoteCta.text}</p>

        <Button
          as="a"
          href="#contact"
          variant="fill"
          size="lg"
          arrow
          className="cta__btn"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('contact', -60)
          }}
        >
          {content.quoteCta.button}
        </Button>
      </div>
    </section>
  )
}
