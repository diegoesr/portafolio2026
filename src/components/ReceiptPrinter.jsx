import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './ReceiptPrinter.css';

/*
 * Impresora de tickets animada: la impresora aparece, se enciende su luz e imprime
 * un ticket que sale por la ranura. El ticket se arranca arrastrándolo hacia arriba
 * (o con un movimiento rápido) y se imprime uno nuevo.
 * Implementación propia inspirada en "Receipt Printer" de React Bits Pro.
 *
 * lines: [
 *   { type: 'title', text }
 *   { type: 'text', text, align?: 'left' | 'center' | 'right', muted? }
 *   { type: 'row', left, right, href? }          -> fila con valor alineado a la derecha (opcionalmente enlace)
 *   { type: 'divider' }
 *   { type: 'barcode', value }
 *   { type: 'space' }
 * ]
 */

const TEAR_DISTANCE = 90; // px hacia arriba para arrancar
const FLICK_SPEED = 0.9; // px/ms para arrancar con un movimiento rápido

function Barcode({ value }) {
  // Barras deterministas a partir del texto
  const bars = [];
  Array.from(value).forEach((ch, i) => {
    const code = ch.charCodeAt(0) + i * 7;
    for (let b = 0; b < 4; b++) {
      bars.push({ w: ((code >> b) & 3) + 1, gap: ((code >> (b + 2)) & 1) + 1 });
    }
  });
  return (
    <div className="rp-barcode" aria-hidden="true">
      {bars.map((bar, i) => (
        <span key={i} style={{ width: bar.w, marginRight: bar.gap }} />
      ))}
    </div>
  );
}

function Line({ line }) {
  switch (line.type) {
    case 'title':
      return <div className="rp-title">{line.text}</div>;
    case 'divider':
      return <div className="rp-divider" aria-hidden="true" />;
    case 'space':
      return <div className="rp-space" aria-hidden="true" />;
    case 'barcode':
      return (
        <>
          <Barcode value={line.value} />
          <div className="rp-text rp-center rp-muted">{line.value}</div>
        </>
      );
    case 'row': {
      const right = line.href ? (
        <a
          href={line.href}
          className="rp-link"
          target={line.href.startsWith('http') ? '_blank' : undefined}
          rel={line.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {line.right}
        </a>
      ) : (
        <span>{line.right}</span>
      );
      return (
        <div className="rp-row">
          <span className="rp-row-left">{line.left}</span>
          <span className="rp-row-dots" aria-hidden="true" />
          {right}
        </div>
      );
    }
    default:
      return (
        <div className={`rp-text rp-${line.align ?? 'left'} ${line.muted ? 'rp-muted' : ''}`}>{line.text}</div>
      );
  }
}

export default function ReceiptPrinter({
  lines,
  width = 300, // ancho del papel en px
  speed = 1, // velocidad de impresión
  hold = 2600, // espera antes de arrancar el ticket en modo automático
  autoplay = false, // imprimir, arrancar y reimprimir solo
  intro = true, // la impresora aparece y enciende su luz antes de imprimir
  curl = 0.5, // inclinación del papel hacia atrás (0–1)
  tearable = true,
  className = '',
}) {
  const rootRef = useRef(null);
  const paperRef = useRef(null);
  const timers = useRef([]);
  const dragRef = useRef(null);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  // off -> rising -> ready -> printing -> printed -> tearing -> (printing ...)
  const [phase, setPhase] = useState(reduced ? 'printed' : 'off');
  const [paperH, setPaperH] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [receiptKey, setReceiptKey] = useState(0);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Medir el alto del ticket para saber cuánto debe salir
  useLayoutEffect(() => {
    const paper = paperRef.current;
    if (!paper) return undefined;
    const measure = () => setPaperH(paper.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(paper);
    return () => ro.disconnect();
  }, [receiptKey]);

  const feedMs = Math.max(600, (paperH / 0.32) / speed); // ~320 px/s

  // Encender e imprimir la primera vez que entra en pantalla
  useEffect(() => {
    if (reduced) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (intro) {
          setPhase('rising');
          later(() => setPhase('ready'), 700);
          later(() => setPhase('printing'), 1300);
        } else {
          setPhase('printing');
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, intro, later]);

  // Al imprimir: esperar a que termine de salir el papel
  useEffect(() => {
    if (phase !== 'printing') return undefined;
    const t = setTimeout(() => setPhase('printed'), feedMs + 120);
    return () => clearTimeout(t);
  }, [phase, feedMs]);

  const tear = useCallback(() => {
    setPhase('tearing');
    later(() => {
      setDragY(0);
      setReceiptKey(k => k + 1);
      if (reduced) {
        setPhase('printed');
        return;
      }
      // el ticket nuevo empieza escondido dentro de la impresora y luego sale
      setPhase('ready');
      later(() => setPhase('printing'), 250);
    }, 650);
  }, [later, reduced]);

  // Modo automático: arrancar y reimprimir tras `hold`
  useEffect(() => {
    if (!autoplay || phase !== 'printed') return undefined;
    const t = setTimeout(tear, hold);
    return () => clearTimeout(t);
  }, [autoplay, phase, hold, tear]);

  // Arrastrar el ticket hacia arriba para arrancarlo
  const onPointerDown = e => {
    if (!tearable || phase !== 'printed') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragRef.current = { id: e.pointerId, startY: e.clientY, lastY: e.clientY, lastT: e.timeStamp, v: 0, moved: false };
  };

  const onPointerMove = e => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    const dy = Math.min(0, e.clientY - d.startY);
    if (!d.moved && Math.abs(dy) > 6) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = (d.lastY - e.clientY) / dt;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
    // resistencia: cuesta un poco arrancarlo
    setDragY(dy * 0.6);
  };

  const onPointerUp = e => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    dragRef.current = d.moved ? { ...d, done: true } : null;
    if (!d.moved) return;
    if (-dragY > TEAR_DISTANCE * 0.6 || d.v > FLICK_SPEED) tear();
    else setDragY(0);
  };

  // No abrir un enlace si el gesto fue un arrastre
  const onClickCapture = e => {
    if (dragRef.current?.done) {
      e.preventDefault();
      e.stopPropagation();
    }
    dragRef.current = null;
  };

  const printing = phase === 'printing';
  const fed = phase === 'printed' || phase === 'tearing';
  const paperOffset = fed || printing ? 0 : paperH + 8;
  const powered = phase !== 'off' && phase !== 'rising';

  return (
    <div
      ref={rootRef}
      className={`receipt-printer is-${phase} ${className}`}
      style={{ '--rp-width': `${width}px`, '--rp-curl': `${curl * 10}deg` }}
    >
      {/* Zona donde sale el papel (recorta lo que aún está dentro de la impresora) */}
      <div className="rp-feed" style={{ height: paperH + 24 }}>
        <div
          key={receiptKey}
          ref={paperRef}
          className={`rp-paper ${phase === 'tearing' ? 'is-torn' : ''} ${dragY ? 'is-dragging' : ''}`}
          style={{
            transform: `translateY(${paperOffset + dragY}px) rotateX(var(--rp-curl))`,
            transitionDuration: printing ? `${feedMs}ms` : undefined,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
        >
          <div className="rp-edge" aria-hidden="true" />
          <div className="rp-body">
            {lines.map((line, i) => (
              <Line key={i} line={line} />
            ))}
          </div>
        </div>
      </div>

      <div className={`rp-printer ${printing ? 'is-working' : ''}`} aria-hidden="true">
        <div className="rp-slot" />
        <div className="rp-panel">
          <span className={`rp-led ${powered ? 'is-on' : ''} ${printing ? 'is-busy' : ''}`} />
          <span className="rp-grill">
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>

      {tearable && (
        <p className={`rp-hint ${phase === 'printed' ? 'is-visible' : ''}`}>
          Arrastra el ticket hacia arriba para arrancarlo
        </p>
      )}
    </div>
  );
}
