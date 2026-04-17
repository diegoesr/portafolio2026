import LiquidEther from './LiquidEther';
import TextType from './TextType';
import profileImage from '../assets/images/profile.jpg';
import './Hero.css';

export default function Hero() {
  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/CV_DEVELOPMENT.pdf';
    link.download = 'CV_DEVELOPMENT.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <LiquidEther
          colors={['#4524c6', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={80}
          isViscous
          viscous={30}
          iterationsViscous={16}
          iterationsPoisson={16}
          resolution={0.4}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="greeting">Hola, soy</span>
            <TextType
              text={["Diego Esparza Rodríguez"]}
              as="span"
              className="name"
              typingSpeed={75}
              pauseDuration={3000}
              deletingSpeed={50}
              showCursor={true}
              cursorCharacter="|"
              loop={true}
            />
            <span className="role">Desarrollador Full Stack</span>
          </h1>
          <p className="hero-description">
            Creo experiencias web modernas y funcionales usando las últimas tecnologías.
            Especializado en React, Node.js y desarrollo de aplicaciones escalables.
          </p>
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
