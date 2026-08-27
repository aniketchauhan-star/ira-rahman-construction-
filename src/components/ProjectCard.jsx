import ImageReveal from './ImageReveal'
import './ProjectCard.css'

export default function ProjectCard({ project, index = 0, onOpen }) {
  return (
    <article className={`proj proj--${project.size}`} style={{ '--i': index }}>
      <button
        type="button"
        className="proj__btn"
        onClick={() => onOpen(index)}
        data-cursor="view"
        aria-label={`View project: ${project.title}`}
      >
        <ImageReveal
          className="proj__media"
          src={project.image}
          alt={`${project.title} — ${project.category}`}
          folderLabel="/assets/projects/"
          kindLabel="Project Image"
          delay={index * 0.05}
        />

        <span className="proj__overlay" aria-hidden="true" />
        <span className="proj__line" aria-hidden="true" />

        <span className="proj__meta">
          <span className="proj__cat">{project.category}</span>
          <span className="proj__title h3">{project.title}</span>
          <span className="proj__loc">
            <svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true">
              <path
                d="M5.5.75c2.35 0 4.25 1.9 4.25 4.25 0 3.1-4.25 8.25-4.25 8.25S1.25 8.1 1.25 5C1.25 2.65 3.15.75 5.5.75Z"
                stroke="currentColor"
                strokeWidth="1.1"
              />
              <circle cx="5.5" cy="5" r="1.4" fill="currentColor" />
            </svg>
            {project.location}
          </span>
        </span>

        <span className="proj__arrow" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>

        <span className="proj__index mono-num" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </button>
    </article>
  )
}
