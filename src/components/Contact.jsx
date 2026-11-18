import ReceiptPrinter from './ReceiptPrinter';
import './Contact.css';

const RECEIPT_LINES = [
  { type: 'title', text: 'DIEGO ESPARZA' },
  { type: 'text', text: 'Desarrollador Full Stack', align: 'center', muted: true },
  { type: 'divider' },
  { type: 'row', left: 'PEDIDO', right: 'Portafolio 2026' },
  { type: 'row', left: 'ESTADO', right: 'Disponible' },
  { type: 'divider' },
  { type: 'row', left: 'EMAIL', right: 'diego_esparza02@outlook.com', href: 'mailto:diego_esparza02@outlook.com' },
  { type: 'row', left: 'LINKEDIN', right: 'in/diegoesr', href: 'https://www.linkedin.com/in/diegoesr' },
  { type: 'row', left: 'GITHUB', right: 'diegoesr', href: 'https://github.com/diegoesr' },
  { type: 'divider' },
  { type: 'row', left: 'TOTAL', right: '¡Hablemos!' },
  { type: 'barcode', value: 'DIEGOESR-2026' },
  { type: 'space' },
  { type: 'text', text: 'Gracias por tu visita.', align: 'center' },
];

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Contacto</h2>
        <div className="contact-content">
          <div className="contact-printer">
            <ReceiptPrinter lines={RECEIPT_LINES} width={300} />
          </div>
        </div>
      </div>
    </section>
  );
}
