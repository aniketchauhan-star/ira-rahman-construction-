import SectionTitle from '../components/SectionTitle'
import ImageReveal from '../components/ImageReveal'
import Stats from './Stats'
import './About.css'

const POINTS = [
  { k: 'Experience', v: 'A decade of site-proven construction and civil work delivery.' },
  { k: 'Quality', v: 'Specified materials, checked mixes and finishes built to last.' },
  { k: 'Safety', v: 'Protected work zones and trained supervision at every stage.' },
  { k: 'Execution', v: 'Programmes planned, resourced and met without excuses.' },
]

export default function About() {
  return (
    <section id="about" className="section section--light about">
      <div className="shell about__inner">
        <div className="about__copy">
          <SectionTitle eyebrow="About the company" size="h1">
            Built on
            <br />
            Strength.
          </SectionTitle>

          <p className="lead about__lead">
            IRHA RAHMAN Construction Company works across building construction, civil
            infrastructure and construction materials. We take on structural work, earthwork and
            complete project execution — and we run each site with the same discipline, whatever its
            scale.
          </p>

          <p className="about__body">
            Modern construction is a coordination problem as much as a technical one. Our teams plan
            sequencing, keep material supply ahead of the programme and hold the standard at every
            pour, every level and every handover.
          </p>

          <dl className="about__points">
            {POINTS.map((p, i) => (
              <div key={p.k} className="about__point" style={{ '--i': i }}>
                <dt>
                  <span className="about__point-num mono-num">{String(i + 1).padStart(2, '0')}</span>
                  {p.k}
                </dt>
                <dd>{p.v}</dd>
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
              alt="IRHA RAHMAN Construction Company site works in progress"
              folderLabel="/assets/site/"
              kindLabel="Site Image"
            />
          </div>

          <figcaption className="about__caption">
            <span className="about__caption-k">On site</span>
            Active construction works
          </figcaption>
        </figure>
      </div>

      <Stats />
    </section>
  )
}
