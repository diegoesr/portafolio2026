import FluxLines from './FluxLines';
import TextPressure from './TextPressure';
import RotatingText from './RotatingText';
import profileImage from '../assets/images/profileCV.jpg';
import './Hero.css';

export default function Hero() {
  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/RESUME.pdf';
    link.download = 'RESUME.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <FluxLines glow={2.6} scale={1.7} />
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-title">
            <span className="greeting">Hola, soy</span>
            <div className="name">
              <TextPressure
                text="Diego Esparza Rodríguez"
                textColor="#FFFFFF"
                minFontSize={24}
              />
            </div>
            <div className="role">
              <span>Desarrollador</span>
              <RotatingText
                texts={['Full Stack', 'Frontend', 'Backend', 'Web']}
                highlight
                highlightColor="#ffffff"
                staggerDuration={0.025}
                rotationInterval={2500}
              />
            </div>
          </div>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleDownloadCV}>
              Descargar CV
            </button>
            <a href="#projects" className="btn btn-secondary">
              Ver Proyectos
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-avatar">
            <img src={profileImage} alt="Diego Esparza" className="profile-image" />
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
    </section>
  );
}
