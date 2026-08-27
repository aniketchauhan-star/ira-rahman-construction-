import { useCallback, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import { projects } from '../data/projects'
import { getLenis } from '../hooks/useLenis'
import './Projects.css'

export default function Projects() {
  const [openIndex, setOpenIndex] = useState(null)

  const open = useCallback((i) => {
    setOpenIndex(i)
    getLenis()?.stop()
  }, [])

  const close = useCallback(() => {
    setOpenIndex(null)
    getLenis()?.start()
  }, [])

  return (
    <section id="projects" className="section section--light projects">
      <div className="shell">
        <div className="projects__head">
          <SectionTitle eyebrow="Selected work" size="h1">
            Projects built
            <br />
            with purpose.
          </SectionTitle>

          <p className="lead projects__intro">
            Commercial, residential, infrastructure and material supply — each one delivered against
            a real programme, on a real site.
          </p>
        </div>

        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onOpen={open} />
          ))}
        </div>
      </div>

      <ProjectModal
        projects={projects}
        index={openIndex}
        onClose={close}
        onNavigate={setOpenIndex}
      />
    </section>
  )
}
