import { useEffect, useRef, useState } from 'react';
import './TerminalReplay.css';

/*
 * Terminal que reproduce una sesión de comandos guionizada.
 * Implementación propia inspirada en "Terminal Replay" de React Bits Pro.
 *
 * script: arreglo de pasos
 *   { type: 'command', text }  -> se escribe letra por letra después del prompt
 *   { type: 'output', text }   -> aparece de inmediato (admite etiquetas de estilo)
 *   { type: 'pause', ms }      -> espera
 *
 * Etiquetas de estilo en el texto: [bold]..[/bold], [muted]..[/muted]
 * La terminal toma la altura del texto final completo, así que nunca se corta.
 */

const TAG_RE = /\[(muted|bold)\]([\s\S]*?)\[\/\1\]/g;

function renderRich(text) {
  const parts = [];
  let last = 0;
  let match;
  TAG_RE.lastIndex = 0;
  while ((match = TAG_RE.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <span key={match.index} className={`tr-${match[1]}`}>
        {match[2]}
      </span>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const stripTags = text => text.replace(TAG_RE, '$2');

// Todas las líneas en su estado final
const finalLines = script =>
  script.filter(step => step.type !== 'pause').map(step => ({ type: step.type, text: step.text, done: true }));

export default function TerminalReplay({
  script,
  title = 'zsh',
  prompt = '❯',
  directory = '~',
  typingSpeed = 26,
  variance = 0.5,
  lineDelay = 70,
  startDelay = 700,
  hold = 3200,
  loop = true,
  className = '',
}) {
  const rootRef = useRef(null);
  const ctrlRef = useRef({ visible: false, skip: false });
  const [lines, setLinesState] = useState([]);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  // Reproducir solo mientras la terminal está en pantalla
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      ctrlRef.current.visible = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Motor de reproducción
  useEffect(() => {
    if (reduced) {
      setLinesState(finalLines(script));
      return undefined;
    }

    const ctrl = ctrlRef.current;
    let cancelled = false;

    // Espera `ms` de tiempo visible; se corta antes si se pidió adelantar
    const wait = ms =>
      new Promise(resolve => {
        let left = ms;
        const tick = () => {
          if (cancelled) return resolve(false);
          if (ctrl.skip) return resolve(true);
          if (ctrl.visible && !document.hidden) left -= 40;
          if (left <= 0) return resolve(true);
          setTimeout(tick, 40);
        };
        tick();
      });

    // Ignorar escrituras de una reproducción ya cancelada
    const setLines = updater => {
      if (!cancelled) setLinesState(updater);
    };

    const update = (index, patch) =>
      setLines(prev => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));

    const run = async () => {
      while (!cancelled) {
        setLines([]);
        ctrl.skip = false;
        await wait(startDelay);

        let index = 0;
        for (const step of script) {
          if (cancelled) return;
          ctrl.skip = false;

          if (step.type === 'pause') {
            await wait(step.ms ?? 600);
            continue;
          }

          if (step.type === 'command') {
            const i = index++;
            setLines(prev => [...prev, { type: 'command', text: '', done: false }]);
            const chars = Array.from(step.text);
            for (let c = 1; c <= chars.length; c++) {
              if (cancelled) return;
              if (ctrl.skip) break;
              update(i, { text: chars.slice(0, c).join('') });
              const jitter = 1 + variance * (Math.random() * 2 - 1);
              await wait((1000 / typingSpeed) * jitter);
            }
            update(i, { text: step.text, done: true });
            ctrl.skip = false;
            await wait(lineDelay * 4);
            continue;
          }

          // output
          index++;
          setLines(prev => [...prev, { type: 'output', text: step.text }]);
          await wait(lineDelay);
        }

        if (!loop) return;
        ctrl.skip = false;
        await wait(hold);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [script, reduced, typingSpeed, variance, lineDelay, startDelay, hold, loop]);

  const skip = () => {
    ctrlRef.current.skip = true;
  };

  const onKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      skip();
    }
  };

  const last = lines.length - 1;
  const typing = lines[last]?.type === 'command' && !lines[last]?.done;

  return (
    <div
      ref={rootRef}
      className={`terminal-replay ${className}`}
      onClick={skip}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Terminal animada. Haz clic o presiona Enter para avanzar."
    >
      <div className="tr-bar">
        <span className="tr-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="tr-title">{title}</span>
      </div>

      <div className="tr-screen">
        {/* Copia invisible del resultado final: reserva el espacio para que la caja no cambie de tamaño */}
        <div className="tr-body tr-ghost" aria-hidden="true">
          {finalLines(script).map((line, i) =>
            line.type === 'command' ? (
              <div key={i} className="tr-line">
                {directory} {prompt} {line.text}
              </div>
            ) : (
              <div key={i} className="tr-line">
                {line.text ? renderRich(line.text) : ' '}
              </div>
            )
          )}
          <div className="tr-line">&nbsp;</div>
        </div>

        <div className="tr-body" aria-hidden="true">
          {lines.map((line, i) =>
            line.type === 'command' ? (
              <div key={i} className="tr-line">
                <span className="tr-dir">{directory}</span> <span className="tr-prompt">{prompt}</span>{' '}
                <span className="tr-cmd">{line.text}</span>
                {i === last && typing && <span className="tr-caret" />}
              </div>
            ) : (
              <div key={i} className="tr-line tr-output">
                {line.text ? renderRich(line.text) : ' '}
              </div>
            )
          )}
          {!typing && (
            <div className="tr-line">
              <span className="tr-dir">{directory}</span> <span className="tr-prompt">{prompt}</span>{' '}
              <span className="tr-caret tr-caret--idle" />
            </div>
          )}
        </div>
      </div>

      {/* Texto completo para lectores de pantalla */}
      <div className="tr-sr-only">
        {script
          .filter(step => step.type !== 'pause')
          .map((step, i) => (
            <p key={i}>{stripTags(step.text)}</p>
          ))}
      </div>
    </div>
  );
}
