import ParallaxCarousel from './ParallaxCarousel';
import './Projects.css';
import checkpointImage from '../assets/images/projects/project4.jpg';
import project1Image from '../assets/images/projects/project1.jpg';
import project2Image from '../assets/images/projects/project2.jpg';
import project3Image from '../assets/images/projects/project3.jpg';

const projects = [
  {
    id: 1,
    title: 'Checkpoint',
    description:
      'Red social para videojuegos con: perfiles públicos, reseñas, listas, backlog, diario de actividad, amigos y noticias gaming.',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'PostgreSQL',
    ],
    image: checkpointImage,
    github: 'https://github.com/diegoesr/Checkpoint',
    demo: 'https://checkpoint-omega.vercel.app/'
  },
  {
    id: 2,
    title: 'SIGEP - iOS',
    description: 'Sistema de gestión para laboratorios iOS que permite administrar equipos, préstamos y usuarios.',
    technologies: ['React', 'Vite', 'Tailwind', 'CSS', 'TypeScript', 'PHP', 'MySQL', 'Docker', 'Adminer'],
    image: project1Image,
    github: 'https://github.com/diegoesr/SIGEP-iOSLab',
    demo: '#'
  },
  {
    id: 3,
    title: 'HorarioFI',
    description: 'Sistema de gestión de horarios para la Facultad de Ingeniería. Permite visualizar y administrar horarios de clases, profesores y salones de manera eficiente.',
    technologies: ['HTML', 'CSS3', 'JavaScript', 'Bootstrap', 'PHP', 'MySQL'],
    image: project2Image,
    github: 'https://github.com/diegoesr/HorarioFI',
    demo: 'https://horariofi.kesug.com/'
  },
  {
    id: 4,
    title: 'Inmobiliaria Crescendolls',
    description: 'Sitio web inmobiliario moderno con catálogo de propiedades, sistema de favoritos y modo oscuro.',
    technologies: ['HTML', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'Docker', 'Adminer'],
    image: project3Image,
    github: 'https://github.com/diegoesr/Inmobiliaria-Crescendolls',
    demo: '#'
  }
];

export default function Projects() {
  const items = projects.map(project => ({
    id: project.id,
    image: project.image,
    alt: `Captura de ${project.title}`,
    content: (
      <>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-technologies">
          {project.technologies.map(tech => (
            <span key={tech} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
        <div className="project-links">
          <a href={project.github} className="project-link" target="_blank" rel="noopener noreferrer">
            <span>GitHub</span>
            <span>→</span>
          </a>
          {project.demo && project.demo !== '#' && (
            <a href={project.demo} className="project-link" target="_blank" rel="noopener noreferrer">
              <span>Demo</span>
              <span>→</span>
            </a>
          )}
        </div>
      </>
    ),
  }));

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Proyectos</h2>
        <ParallaxCarousel items={items} />
      </div>
    </section>
  );
}
