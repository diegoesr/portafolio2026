import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-text">
            <p>&copy; {currentYear} Diego Esparza Rodríguez. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
