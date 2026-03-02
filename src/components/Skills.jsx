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
  SiDocker 
} from 'react-icons/si';
import { FaCode, FaJava, FaLaptopCode } from 'react-icons/fa';

const skills = [
  { name: 'HTML', Icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS', Icon: SiCss3, color: '#1572B6' },
  { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Bootstrap', Icon: SiBootstrap, color: '#7952B3' },
  { name: 'PHP', Icon: SiPhp, color: '#777BB4' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#339933' },
  { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
  { name: 'Python', Icon: SiPython, color: '#3776AB' },
  { name: 'Java', Icon: FaJava, color: '#ED8B00' },
  { name: 'C', Icon: FaCode, color: '#A8B9CC' },
  { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
  { name: 'Git', Icon: SiGit, color: '#F05032' },
  { name: 'GitHub', Icon: SiGithub, color: '#6e5494' },
  { name: 'VS Code', Icon: FaLaptopCode, color: '#007ACC' },
  { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
  { name: 'Cursor', Icon: FaCode, color: '#4524c6' }
];

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">Habilidades</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => {
            const IconComponent = skill.Icon;
            return (
              <div key={index} className="skill-card">
                <div className="skill-header">
                  <IconComponent 
                    className="skill-icon" 
                    style={{ color: skill.color }}
                  />
                  <span className="skill-name">{skill.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
