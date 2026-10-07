import { Component, useEffect, useRef } from 'react';

// Aparece suavemente quando entra na tela
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-visible');
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

// Animação de entrada que começa assim que a página abre (usada no topo, sem esperar a rolagem)
export function Intro({ as: Tag = 'div', delay = 0, className = '', children }) {
  return (
    <Tag className={`intro ${className}`} style={{ '--delay': `${delay}ms` }}>
      {children}
    </Tag>
  );
}

// Faixa de texto rolando sem parar
export function Marquee({ itens }) {
  const linha = [...itens, ...itens];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-blood py-4" aria-hidden="true">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-10">
            {linha.map((t, i) => (
              <span key={i} className="flex items-center gap-10 font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
                {t}
                <span className="text-black/60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Cartão que inclina em 3D seguindo o mouse (CSS perspective)
export function TiltCard({ className = '', children }) {
  const ref = useRef(null);
  const st = useRef({ rect: null, raf: 0, x: 0, y: 0 });
  // mede o cartão uma vez ao entrar (medir a cada movimento força o navegador a recalcular a página)
  const enter = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    st.current.rect = ref.current.getBoundingClientRect();
  };
  const move = (e) => {
    const s = st.current;
    if (e.pointerType !== 'mouse' || !s.rect) return;
    s.x = (e.clientX - s.rect.left) / s.rect.width - 0.5;
    s.y = (e.clientY - s.rect.top) / s.rect.height - 0.5;
    if (s.raf) return;
    // aplica no máximo uma vez por quadro
    s.raf = requestAnimationFrame(() => {
      s.raf = 0;
      const el = ref.current;
      if (!el) return;
      el.style.transform = `perspective(900px) rotateY(${s.x * 10}deg) rotateX(${-s.y * 10}deg)`;
      el.style.setProperty('--mx', `${(s.x + 0.5) * 100}%`);
      el.style.setProperty('--my', `${(s.y + 0.5) * 100}%`);
    });
  };
  const leave = () => {
    const s = st.current;
    cancelAnimationFrame(s.raf);
    s.raf = 0;
    s.rect = null;
    if (ref.current) ref.current.style.transform = '';
  };
  return (
    <div
      ref={ref}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-coal transition-transform duration-300 ease-out ${className}`}
    >
      {/* brilho que acompanha o mouse */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(201,29,38,.18), transparent 60%)' }}
      />
      {children}
    </div>
  );
}

export function SectionHead({ numero, rotulo, children, texto, className = '' }) {
  return (
    <div className={`grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end ${className}`}>
      <Reveal>
        <p className="eyebrow mb-6">
          {numero} — {rotulo}
        </p>
        <h2 className="titulo">{children}</h2>
      </Reveal>
      {texto && (
        <Reveal delay={150}>
          <p className="max-w-md text-lg leading-relaxed text-ash">{texto}</p>
        </Reveal>
      )}
    </div>
  );
}

export const Stars = () => (
  <span className="tracking-[0.2em] text-blood" aria-label="5 estrelas">
    ★★★★★
  </span>
);

export const IconWhats = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.42 1.32-1.96 1.36-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.92-4.64-4.1-.13-.18-1.1-1.47-1.1-2.8 0-1.34.7-1.99.95-2.27.24-.27.53-.34.71-.34l.51.01c.16.01.38-.06.6.46.23.54.77 1.87.84 2 .07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.28-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.23.6-.14.25.09 1.57.74 1.84.88.27.14.45.2.52.32.07.11.07.66-.17 1.33Z" />
  </svg>
);

export const Arrow = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// Se uma parte falhar (ex.: 3D sem suporte, internet caiu ao baixar um arquivo),
// só aquela parte some. O resto do site continua funcionando.
export class SafeBoundary extends Component {
  state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  componentDidCatch(e) {
    console.warn('[Los Santos] parte da página não carregou:', e?.message);
  }
  render() {
    return this.state.erro ? this.props.fallback ?? null : this.props.children;
  }
}
