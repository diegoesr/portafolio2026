import './Contact.css';
import { SiLinkedin, SiGithub } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Contacto</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3 className="contact-title">¡Hablemos!</h3>
            <p>
              Estoy siempre abierto a discutir nuevos proyectos, ideas creativas
              o oportunidades para ser parte de tus visiones.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <MdEmail className="contact-icon" style={{ color: '#0078D4' }} />
                <div>
                  <strong>Email</strong>
                  <a href="mailto:diego_esparza02@outlook.com" className="contact-link">
                    diego_esparza02@outlook.com
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <SiLinkedin className="contact-icon" style={{ color: '#0077B5' }} />
                <div>
                  <strong>LinkedIn</strong>
                  <a href="https://www.linkedin.com/in/diegoesr" target="_blank" rel="noopener noreferrer" className="contact-link">
                    www.linkedin.com/in/diegoesr
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <SiGithub className="contact-icon" style={{ color: '#6e5494' }} />
                <div>
                  <strong>GitHub</strong>
                  <a href="https://github.com/diegoesr" target="_blank" rel="noopener noreferrer" className="contact-link">
                    github.com/diegoesr
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
