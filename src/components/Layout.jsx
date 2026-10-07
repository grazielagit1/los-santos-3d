import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/logo-96.webp';
import { contato, navegacao, whatsapp } from '../data/site';
import { useLenis } from '../lib/scroll';
import { prefetch } from '../lib/prefetch';
import { IconWhats, Reveal, SafeBoundary } from './ui';

const toLink = (para) => {
  const [pathname, hash] = para.split('#');
  return hash ? { pathname, hash: `#${hash}` } : para;
};

function Header() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const lenis = useLenis();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // trava a rolagem com o menu aberto
  useEffect(() => {
    aberto ? lenis?.stop() : lenis?.start();
    document.body.style.overflow = aberto ? 'hidden' : '';
  }, [aberto, lenis]);

  useEffect(() => setAberto(false), [pathname]);
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        rolou || aberto ? 'bg-ink/85 py-3 backdrop-blur-md border-b border-white/5' : 'py-6'
      }`}
    >
      <div className="container-ls flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-10 object-contain" />
          <span className="whitespace-nowrap leading-none">
            <span className="block font-display text-lg tracking-wide">LOS SANTOS</span>
            <span className="block text-[10px] font-semibold tracking-[0.35em] text-ash">BARBEARIA</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-9" aria-label="Principal">
          {navegacao.map((item) => (
            <NavLink
              key={item.para}
              to={toLink(item.para)}
              end
              onMouseEnter={() => prefetch(item.para)}
              onFocus={() => prefetch(item.para)}
              className={({ isActive }) =>
                `group relative py-3 text-xs font-semibold uppercase tracking-[0.25em] transition-colors hover:text-white ${
                  isActive && !item.para.includes('#') ? 'text-white' : 'text-ash'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.rotulo}
                  <span
                    className={`absolute bottom-1 left-0 h-px bg-blood transition-all duration-300 group-hover:w-full ${
                      isActive && !item.para.includes('#') ? 'w-full' : 'w-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={whatsapp()} target="_blank" rel="noreferrer" className="btn-red hidden whitespace-nowrap !px-5 !py-3 lg:inline-flex">
            Agendar agora
          </a>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 md:hidden"
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className={`absolute h-px w-5 bg-white transition ${aberto ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-px w-5 bg-white transition ${aberto ? 'opacity-0' : ''}`} />
            <span className={`absolute h-px w-5 bg-white transition ${aberto ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </div>

    </header>
      {/* menu do celular */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-40 bg-ink pt-[68px] transition-all duration-500 md:hidden ${
          aberto ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="container-ls flex flex-col gap-2 pt-10" aria-label="Menu">
          {navegacao.map((item, i) => (
            <Link
              key={item.para}
              to={toLink(item.para)}
              onTouchStart={() => prefetch(item.para)}
              onClick={() => setAberto(false)}
              className="border-b border-white/10 py-5 font-display text-5xl uppercase transition-all duration-500"
              style={{ transform: aberto ? 'none' : 'translateY(20px)', opacity: aberto ? 1 : 0, transitionDelay: `${i * 60}ms` }}
            >
              {item.rotulo}
            </Link>
          ))}
          <a href={whatsapp()} target="_blank" rel="noreferrer" className="btn-red mt-8">
            Agendar pelo WhatsApp
          </a>
        </nav>
      </div>
    </>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] max-w-[200vw] -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(closest-side, rgba(201,29,38,.25), transparent)' }} />
      <div className="container-ls relative text-center">
        <Reveal>
          <p className="eyebrow mb-8 justify-center">A poltrona está pronta</p>
          <h2 className="titulo mx-auto max-w-4xl">
            Chegue como você é. <em>Saia como você quer.</em>
          </h2>
          <a href={whatsapp()} target="_blank" rel="noreferrer" className="btn-red mt-12">
            <IconWhats className="h-4 w-4" /> Agendar agora
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="container-ls flex flex-col items-center justify-between gap-6 text-center text-xs uppercase tracking-[0.2em] text-ash lg:flex-row lg:text-left">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-8 w-8 object-contain opacity-80" />
          <span>
            <span className="text-bone">Los Santos</span> Barbearia • Valinhos
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6">
          <span className="py-3">Atendimento 24h</span>
          <a href={whatsapp()} target="_blank" rel="noreferrer" className="py-3 hover:text-blood">WhatsApp</a>
          <a href={contato.telefoneLink} className="py-3 hover:text-blood">{contato.telefone}</a>
        </div>
        <span>© {new Date().getFullYear()} Los Santos Barbearia</span>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href={whatsapp()}
      target="_blank"
      rel="noreferrer"
      aria-label="Agendar pelo WhatsApp"
      className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-blood text-white shadow-[0_10px_40px_-5px_rgba(201,29,38,.7)] transition hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-blood/40 motion-reduce:hidden" />
      <IconWhats className="relative h-6 w-6" />
    </a>
  );
}

// Aparece se a página não conseguir carregar (ex.: internet caiu no meio)
function PaginaComErro() {
  return (
    <section className="container-ls flex min-h-[70svh] flex-col items-start justify-center gap-6 pt-32">
      <p className="eyebrow">Ops</p>
      <h1 className="titulo">Não carregou. <em>Tente de novo.</em></h1>
      <button type="button" onClick={() => window.location.reload()} className="btn-red">Recarregar a página</button>
    </section>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="grain">
      <Header />
      <main>
        <SafeBoundary key={pathname} fallback={<PaginaComErro />}>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Outlet />
          </Suspense>
        </SafeBoundary>
      </main>
      <CTA />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
