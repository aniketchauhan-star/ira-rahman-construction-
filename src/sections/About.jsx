import SectionTitle from '../components/SectionTitle'
import ImageReveal from '../components/ImageReveal'
import Stats from './Stats'
import './About.css'
import { content } from '../data/content'
import Lines from '../components/Copy'

export default function About() {
  return (
    <section id="about" className="section section--light about">
      <div className="shell about__inner">
        <div className="about__copy">
          <SectionTitle eyebrow={content.about.eyebrow} size="h1">
            <Lines lines={content.about.heading} />
          </SectionTitle>

          <p className="lead about__lead">{content.about.lead}</p>

          <p className="about__body">{content.about.body}</p>

          <dl className="about__points">
            {content.about.points.map((p, i) => (
              <div key={p.title} className="about__point" style={{ '--i': i }}>
                <dt>
                  <span className="about__point-num mono-num">{String(i + 1).padStart(2, '0')}</span>
                  {p.title}
                </dt>
                <dd>{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Architectural image frame — clipped corner, drawn rule, offset plate */}
        <figure className="about__figure">
          <span className="about__frame-line" aria-hidden="true" />
          <span className="about__frame-plate" aria-hidden="true" />

          {/* The clip lives on a wrapper: ImageReveal animates the
              element's own clip-path, which would erase the cut corners. */}
          <div className="about__image-clip clip-corner">
            <ImageReveal
              className="about__image"
              src="/assets/site/site-01.jpg"
              alt={content.about.imageAlt}
              folderLabel="/assets/site/"
              kindLabel={content.placeholders.site}
            />
          </div>

          <figcaption className="about__caption">
            <span className="about__caption-k">{content.about.captionKicker}</span>
            {content.about.caption}
          </figcaption>
        </figure>
      </div>

      <Stats />
    </section>
  )
}
