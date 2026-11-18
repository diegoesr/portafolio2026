import Pipeline from './Pipeline';
import FadeContent from './FadeContent';
import { fadeItemProps } from './fadeProps';
import './Skills.css';
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiBootstrap,
  SiPhp,
  SiNodedotjs,
  SiMysql,
  SiPython,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiDocker,
  SiClaude,
} from 'react-icons/si';
import { FaAws, FaCode, FaJava, FaLaptopCode } from 'react-icons/fa';

const categories = [
  {
    id: 'frontend',
    title: 'Frontend',
    nodes: [
      { id: 'html', title: 'HTML', Icon: SiHtml5, color: '#E34F26' },
      { id: 'css', title: 'CSS', Icon: SiCss3, color: '#1572B6' },
      { id: 'js', title: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
      { id: 'ts', title: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
      { id: 'react', title: 'React', Icon: SiReact, color: '#61DAFB' },
      { id: 'tailwind', title: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
      { id: 'bootstrap', title: 'Bootstrap', Icon: SiBootstrap, color: '#7952B3' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend y lenguajes',
    nodes: [
      { id: 'node', title: 'Node.js', Icon: SiNodedotjs, color: '#339933' },
      { id: 'php', title: 'PHP', Icon: SiPhp, color: '#777BB4' },
      { id: 'python', title: 'Python', Icon: SiPython, color: '#3776AB' },
      { id: 'java', title: 'Java', Icon: FaJava, color: '#ED8B00' },
      { id: 'c', title: 'C', Icon: FaCode, color: '#A8B9CC' },
    ],
  },
  {
    id: 'databases',
    title: 'Bases de datos',
    nodes: [
      { id: 'mysql', title: 'MySQL', Icon: SiMysql, color: '#4479A1' },
      { id: 'postgres', title: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps y Cloud',
    nodes: [
      { id: 'docker', title: 'Docker', Icon: SiDocker, color: '#2496ED' },
      { id: 'aws', title: 'AWS', Icon: FaAws, color: '#FF9900' },
    ],
  },
  {
    id: 'tools',
    title: 'Herramientas',
    nodes: [
      { id: 'git', title: 'Git', Icon: SiGit, color: '#F05032' },
      { id: 'github', title: 'GitHub', Icon: SiGithub, color: '#ffffff' },
      { id: 'vscode', title: 'VS Code', Icon: FaLaptopCode, color: '#007ACC' },
      { id: 'claude', title: 'Claude', Icon: SiClaude, color: '#D97757' },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <FadeContent {...fadeItemProps}>
          <h2 className="section-title">Habilidades</h2>
        </FadeContent>
        <div className="skills-pipelines">
          {categories.map((category, index) => (
            <FadeContent key={category.id} {...fadeItemProps} className="skills-category">
              <div className="skills-category-header">
                <h3 className="skills-category-title">{category.title}</h3>
                <span className="skills-category-count">
                  {String(category.nodes.length).padStart(2, '0')}
                </span>
              </div>
              {/* startDelay escalonado para que los pipelines no avancen todos al mismo tiempo */}
              <Pipeline nodes={category.nodes} startDelay={400 + index * 250} />
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
