import { useCallback, useEffect, useRef, useState } from 'react';
import './ParallaxCarousel.css';

/*
 * Carrusel horizontal con parallax: al alejarse del centro, la imagen de cada
 * tarjeta se desplaza en sentido contrario dentro de su marco.
 * Implementación propia inspirada en "Parallax Carousel" de React Bits Pro.
 *
 * items: [{ id, image, alt, content }]  -> `content` se muestra debajo de la imagen
 */
export default function ParallaxCarousel({
  items,
  cardWidth = 420,
  imageAspect = '16 / 10', // proporción del área de imagen
  gap = 32,
  parallaxIntensity = 0.4, // 0–1: fuerza del contra-desplazamiento
  uvScale = 0.85, // 0.6–1: cuánto se "acerca" la imagen para dejar espacio al parallax
  lerp = 0.08, // suavizado del movimiento
  dragSensitivity = 1.4,
  wheelSensitivity = 1,
  showProgress = true,
  hint = 'Desliza para ver más →', // texto guía junto a la barra de progreso
  className = '',
}) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const imageRefs = useRef([]);
  const progressRef = useRef(null);
  const motion = useRef({ target: 0, current: 0, max: 0, step: 0, raf: 0 });
  const drag = useRef({ active: false, moved: false, startX: 0, startTarget: 0, id: null });
  const [width, setWidth] = useState(cardWidth);

  const render = useCallback(() => {
    const m = motion.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) {
      m.raf = 0;
      return;
    }

    m.current += (m.target - m.current) * lerp;
    if (Math.abs(m.target - m.current) < 0.05) m.current = m.target;
    track.style.transform = `translate3d(${-m.current}px, 0, 0)`;

    // Parallax: desplazar cada imagen según su distancia al centro visible
    const viewW = viewport.clientWidth;
    const slack = ((1 - uvScale) / 2) * 100; // holgura a cada lado, en % del ancho de la imagen
    imageRefs.current.forEach((img, i) => {
      if (!img) return;
      const center = i * m.step + m.cardW / 2 - m.current;
      const offset = Math.max(-1, Math.min(1, (center - viewW / 2) / viewW));
      // nunca más allá de la holgura, para que no se vean los bordes de la imagen
      const shift = Math.max(-slack, Math.min(slack, -offset * parallaxIntensity * 2.5 * slack));
      img.style.transform = `translate3d(${shift.toFixed(3)}%, 0, 0)`;
    });

    if (progressRef.current) {
      const p = m.max > 0 ? m.current / m.max : 1;
      progressRef.current.style.transform = `scaleX(${Math.max(0.04, p)})`;
    }


    m.raf = m.current !== m.target ? requestAnimationFrame(render) : 0;
  }, [lerp, parallaxIntensity, uvScale]);

  const wake = useCallback(() => {
    const m = motion.current;
    if (!m.raf) m.raf = requestAnimationFrame(render);
  }, [render]);

  const setTarget = useCallback(
    value => {
      const m = motion.current;
      m.target = Math.max(0, Math.min(m.max, value));
      wake();
    },
    [wake]
  );

  // Medidas: ancho de tarjeta adaptable y límite de desplazamiento
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const measure = () => {
      const viewW = viewport.clientWidth;
      const w = Math.min(cardWidth, Math.round(viewW * 0.86));
      const m = motion.current;
      m.cardW = w;
      m.step = w + gap;
      m.max = Math.max(0, items.length * w + (items.length - 1) * gap - viewW);
      m.target = Math.min(m.target, m.max);
      m.current = Math.min(m.current, m.max);
      setWidth(w);
      wake();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [cardWidth, gap, items.length, wake]);

  // Al desmontar (o en el doble montaje de StrictMode) cancelar y marcar la animación como detenida,
  // si no `wake()` creería que sigue activa y el carrusel dejaría de moverse
  useEffect(() => {
    const m = motion.current;
    return () => {
      cancelAnimationFrame(m.raf);
      m.raf = 0;
    };
  }, []);

  // Rueda del mouse o trackpad: el scroll (vertical u horizontal) mueve el carrusel hacia los lados.
  // Al llegar al primer o último proyecto, la rueda vuelve a mover la página.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const onWheel = e => {
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewport.clientWidth : 1;
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const delta = raw * unit * wheelSensitivity;
      const m = motion.current;
      const next = Math.max(0, Math.min(m.max, m.target + delta));
      if (next === m.target) return; // en el extremo: dejar que la página haga scroll
      e.preventDefault();
      setTarget(next);
    };
    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [setTarget, wheelSensitivity]);

  // Arrastre con mouse o dedo
  const onPointerDown = e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startTarget: motion.current.target,
      id: e.pointerId,
    };
  };

  const onPointerMove = e => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.id) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      viewportRef.current?.setPointerCapture(e.pointerId);
    }
    if (d.moved) setTarget(d.startTarget - dx * dragSensitivity);
  };

  const endDrag = e => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.id) return;
    d.active = false;
    if (viewportRef.current?.hasPointerCapture(e.pointerId)) {
      viewportRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Evitar abrir un enlace si el gesto fue un arrastre
  const onClickCapture = e => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const go = direction => {
    const m = motion.current;
    const index = Math.round(m.target / m.step) + direction;
    setTarget(index * m.step);
  };

  const onKeyDown = e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <div className={`parallax-carousel ${className}`}>
      <div
        ref={viewportRef}
        className="pc-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        onDragStart={e => e.preventDefault()}
        tabIndex={0}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Proyectos. Desplázate, arrastra o usa las flechas del teclado para navegar."
      >
        <ul ref={trackRef} className="pc-track" style={{ gap }}>
          {items.map((item, i) => (
            <li key={item.id} className="pc-card" style={{ width }}>
              <div className="pc-media" style={{ aspectRatio: imageAspect }}>
                <img
                  ref={el => {
                    imageRefs.current[i] = el;
                  }}
                  src={item.image}
                  alt={item.alt ?? ''}
                  className="pc-image"
                  style={{ width: `${100 / uvScale}%`, height: `${100 / uvScale}%` }}
                  draggable="false"
                  loading="lazy"
                />
              </div>
              <div className="pc-content">{item.content}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="pc-controls">
        {showProgress && (
          <div className="pc-progress" aria-hidden="true">
            <span ref={progressRef} className="pc-progress-fill" />
          </div>
        )}
        {hint && <span className="pc-hint">{hint}</span>}
      </div>
    </div>
  );
}
