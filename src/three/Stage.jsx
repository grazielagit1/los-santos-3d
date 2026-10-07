import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveQuality, StudioEnvironment } from './fx';

// Alguns aparelhos/navegadores não têm WebGL (ou está bloqueado). Sem essa checagem, o site inteiro ficava em branco.
let webglCache;
export const webglDisponivel = () => {
  if (webglCache !== undefined) return webglCache;
  try {
    const c = document.createElement('canvas');
    const gl = window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'));
    webglCache = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext(); // libera o contexto de teste
  } catch {
    webglCache = false;
  }
  return webglCache;
};

const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Espera o navegador ficar livre antes de montar o 3D, para o texto aparecer primeiro
const whenIdle = (fn) =>
  'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200);
const cancelIdle = (id) => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id));

/**
 * Palco padrão para as cenas 3D:
 * - só monta quando o navegador está livre e o canvas está perto da tela
 * - pausa quando sai da tela ou quando a aba fica em segundo plano
 * - ajusta a resolução sozinho conforme o desempenho do aparelho
 * - com "reduzir movimento" ligado, desenha um quadro só (imagem parada)
 */
export default function Stage({ children, camera = { position: [0, 0, 7], fov: 35 }, className = '', fallback = null }) {
  const wrap = useRef(null);
  const [montar, setMontar] = useState(false);
  const [naTela, setNaTela] = useState(true);
  const [abaVisivel, setAbaVisivel] = useState(true);
  const [pronto, setPronto] = useState(false);
  const [cfg] = useState(() => {
    const mobile = isMobile();
    return { mobile, maxDpr: mobile ? 1.5 : 2, parado: reducedMotion() };
  });

  useEffect(() => {
    const id = whenIdle(() => setMontar(true));
    return () => cancelIdle(id);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { rootMargin: '150px' });
    io.observe(el);
    const vis = () => setAbaVisivel(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  const ativo = naTela && abaVisivel;

  if (!webglDisponivel()) return <div className={className} aria-hidden="true">{fallback}</div>;

  return (
    <div
      ref={wrap}
      className={`${className} transition-opacity duration-1000 ${pronto ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden="true"
    >
      {montar && (
        <Canvas
          camera={camera}
          dpr={[1, cfg.maxDpr]}
          frameloop={cfg.parado ? 'demand' : ativo ? 'always' : 'never'}
          gl={{ antialias: !cfg.mobile, alpha: true, powerPreference: 'default', stencil: false }}
          eventSource={document.body}
          eventPrefix="client"
          onCreated={() => requestAnimationFrame(() => setPronto(true))}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 6, 5]} intensity={2.2} />
          <pointLight position={[-4, 1, 2]} intensity={40} color="#c91d26" distance={14} />
          <StudioEnvironment />
          {!cfg.parado && <AdaptiveQuality min={0.75} max={cfg.maxDpr} />}
          {children}
        </Canvas>
      )}
    </div>
  );
}
