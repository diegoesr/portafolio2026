import { useEffect, useRef, useState } from 'react';
import './Pipeline.css';

/*
 * Pipeline lineal animado: los nodos se ejecutan uno tras otro y la conexión
 * hacia el siguiente se llena al terminar cada uno.
 * Implementación propia inspirada en "Pipeline" de React Bits Pro.
 *
 * nodes: [{ id, title, Icon?, color? }]
 */
export default function Pipeline({
  nodes,
  stepMs = 750, // duración de cada paso
  startDelay = 500, // espera antes de iniciar cada recorrido
  rest = 2600, // tiempo que el recorrido completo queda visible
  loop = true,
  className = '',
}) {
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  // -1: en espera · 0..n-1: nodo en ejecución · n: recorrido terminado
  const [step, setStep] = useState(-1);
  const total = nodes.length;
  const current = reduced ? total : step;

  // Ejecutar solo mientras está en pantalla
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !inView) return undefined;
    let timer;
    if (step < 0) timer = setTimeout(() => setStep(0), startDelay);
    else if (step < total) timer = setTimeout(() => setStep(s => s + 1), stepMs);
    else if (loop) timer = setTimeout(() => setStep(-1), rest);
    return () => clearTimeout(timer);
  }, [step, inView, reduced, total, stepMs, startDelay, rest, loop]);

  return (
    <div ref={rootRef} className={`pipeline ${className}`} style={{ '--pl-step': `${stepMs}ms` }}>
      <ol className="pl-track">
        {nodes.map((node, i) => {
          const state = i < current ? 'done' : i === current ? 'running' : 'idle';
          const { Icon } = node;
          return (
            <li key={node.id} className="pl-item">
              <div className={`pl-node is-${state}`} style={{ '--pl-color': node.color ?? '#ffffff' }}>
                {Icon && <Icon className="pl-icon" aria-hidden="true" />}
                <span className="pl-title">{node.title}</span>
                <span className="pl-check" aria-hidden="true">
                  ✓
                </span>
              </div>
              {i < total - 1 && (
                <span className={`pl-edge ${i < current ? 'is-filled' : ''}`} aria-hidden="true">
                  <span className="pl-edge-fill" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
