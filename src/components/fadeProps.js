// Configuración compartida del efecto FadeContent

// threshold 0.3: la animación inicia cuando el bloque ya entró ~30% en la pantalla
export const fadeProps = {
  blur: 16,
  duration: 1800,
  ease: 'power3.out',
  initialOpacity: 0,
  threshold: 0.3,
  // Repetir la animación en ambas direcciones del scroll:
  // once=false -> se oculta al salir por abajo (scroll hacia arriba) y reaparece al volver a bajar
  // exit=true  -> se oculta al salir por arriba (scroll hacia abajo) y reaparece al volver a subir
  once: false,
  exit: true,
};

// Para bloques pequeños dentro de secciones altas: solo se ocultan cuando ya casi salieron de la pantalla
export const fadeItemProps = {
  ...fadeProps,
  duration: 1200,
  threshold: 0.08,
};
