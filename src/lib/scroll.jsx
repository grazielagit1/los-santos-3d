import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

// Estado de rolagem compartilhado com as cenas 3D (lido a cada frame, sem re-render)
export const scrollState = { y: 0, velocity: 0, progress: 0 };

const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ duration: 1.15, smoothWheel: true, anchors: false });
    instance.on('scroll', ({ scroll, velocity, progress }) => {
      scrollState.y = scroll;
      scrollState.velocity = velocity;
      scrollState.progress = progress;
    });
    let raf;
    const loop = (time) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    setLenis(instance);
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
    };
  }, []);

  // Sem Lenis (movimento reduzido): mantém o estado atualizado pelo scroll nativo
  useEffect(() => {
    if (lenis) return;
    const onScroll = () => {
      scrollState.y = window.scrollY;
      scrollState.progress = window.scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

// Ao trocar de página: vai para o topo ou para a âncora (#contato)
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();
  const first = useRef(true);

  useEffect(() => {
    const go = () => {
      // a página nova pode ser bem mais alta que a anterior: o Lenis precisa medir de novo,
      // senão ele "trava" no tamanho antigo e para no meio do caminho
      lenis?.resize();
      const alvo = hash ? document.querySelector(hash) : null;
      if (alvo) {
        lenis ? lenis.scrollTo(alvo, { offset: -80, force: true }) : alvo.scrollIntoView({ behavior: 'smooth' });
      } else {
        lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0);
      }
    };
    // espera a nova página renderizar
    const id = setTimeout(go, first.current ? 0 : 120);
    first.current = false;
    return () => clearTimeout(id);
  }, [pathname, hash, lenis]);

  return null;
}
