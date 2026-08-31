import { useCallback, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import { projects } from '../data/projects'
import { getLenis } from '../hooks/useLenis'
import './Projects.css'
import { content } from '../data/content'
import Lines from '../components/Copy'

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
          <SectionTitle eyebrow={content.projects.eyebrow} size="h1">
            <Lines lines={content.projects.heading} />
          </SectionTitle>

          <p className="lead projects__intro">{content.projects.intro}</p>
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
