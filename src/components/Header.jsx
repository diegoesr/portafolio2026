import { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Cerrar menú móvil al hacer scroll
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
      // Cerrar menú móvil si se cambia a desktop
      if (window.innerWidth > 900) {
        setIsMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Cerrar menú al hacer clic fuera
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.nav')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToHome = (e) => {
    e.preventDefault();
    scrollToSection('home');
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="nav">
        <a href="#home" onClick={scrollToHome} className="nav-brand">
          <img src="/bear.png" alt="Logo" className="brand-logo" />
        </a>
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="mobile-menu-header">
            <h2 className="menu-title">Menú</h2>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="close-menu-btn"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </li>
          <li className="nav-menu-item">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
              <span className="menu-text">Inicio</span>
            </a>
          </li>
          <li className="nav-menu-item">
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
              <span className="menu-text">Sobre Mí</span>
            </a>
          </li>
          <li className="nav-menu-item">
            <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>
              <span className="menu-text">Proyectos</span>
            </a>
          </li>
          <li className="nav-menu-item">
            <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>
              <span className="menu-text">Habilidades</span>
            </a>
          </li>
          <li className="nav-menu-item">
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
              <span className="menu-text">Contacto</span>
            </a>
          </li>
        </ul>
        {isMobile && (
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </nav>
    </header>
  );
}
