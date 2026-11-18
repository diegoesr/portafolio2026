import TerminalReplay from './TerminalReplay';
import './About.css';

// Fuera del componente para que la referencia sea estable entre renders
const ABOUT_SCRIPT = [
  { type: 'command', text: 'aboutme' },
  { type: 'output', text: '[bold]Diego Esparza Rodríguez[/bold] [muted]— Desarrollador Full Stack[/muted]' },
  { type: 'pause', ms: 400 },

  { type: 'command', text: 'cat sobre-mi.txt' },
  {
    type: 'output',
    text: 'Soy desarrollador Full Stack. Me gusta llevar una idea desde la base de datos hasta la interfaz y dejarla funcionando en producción.',
  },
  { type: 'output', text: '' },
  {
    type: 'output',
    text: 'He construido una red social para videojuegos con Next.js y Supabase (Checkpoint), sistemas de gestión para laboratorios y horarios universitarios, y sitios web con PHP y MySQL.',
  },
  { type: 'output', text: '' },
  {
    type: 'output',
    text: 'Trabajo principalmente con React, TypeScript, Node.js y PHP, y uso Docker y AWS para desplegar. Busco un equipo donde pueda seguir creciendo y construir productos que la gente realmente use.',
  },
];

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">Sobre Mí</h2>
        <div className="about-content">
          {/* hold: 20 s con el texto completo en pantalla antes de reiniciar */}
          <TerminalReplay script={ABOUT_SCRIPT} title="diego@portafolio — zsh" hold={20000} />
        </div>
      </div>
    </section>
  );
}
