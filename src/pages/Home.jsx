import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { avaliacoes, contato, pilares, servicos, whatsapp } from '../data/site';
import { Arrow, IconWhats, Intro, Marquee, Reveal, SafeBoundary, SectionHead, Stars, TiltCard } from '../components/ui';

const BarberPole = lazy(() => import('../three/BarberPole'));

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-20 md:flex-row md:items-center md:pb-0 md:pt-32">
      {/* brilho vermelho de fundo */}
      <div className="pointer-events-none absolute right-[-15%] top-[10%] h-[80vh] w-[80vh]" style={{ background: 'radial-gradient(closest-side, rgba(201,29,38,.22), transparent)' }} />
      <SafeBoundary fallback={<div className="h-[34svh] w-full shrink-0 md:hidden" />}>
        <Suspense fallback={<div className="h-[34svh] w-full shrink-0 md:hidden" />}>
          <BarberPole className="relative h-[34svh] w-full shrink-0 md:absolute md:inset-0 md:h-full" />
        </Suspense>
      </SafeBoundary>
      <div className="container-ls relative">
        <div className="md:max-w-[56%] lg:max-w-none">
        <Intro>
          <p className="mb-8 inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ash sm:px-4 sm:text-[11px] sm:tracking-[0.3em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blood opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blood" />
            </span>
            Aberto 24 horas • Valinhos
          </p>
        </Intro>
        <Intro delay={100}>
          <h1 className="font-display uppercase leading-[0.88] tracking-tight" style={{ fontSize: 'clamp(3.6rem, 11vw, 10rem)' }}>
            Seu estilo.
            <span className="block font-serif font-extrabold normal-case italic text-blood" style={{ letterSpacing: '-0.03em' }}>
              Suas regras.
            </span>
          </h1>
        </Intro>
        <Intro delay={250}>
          <p className="mt-6 max-w-md text-lg text-ash">Nós criamos a beleza que move o Brasil.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={whatsapp()} target="_blank" rel="noreferrer" className="btn-red">
              <IconWhats className="h-4 w-4" /> Agende pelo WhatsApp
            </a>
            <Link to={{ pathname: '/', hash: '#sobre' }} className="btn-ghost">
              Conheça a Los Santos ↓
            </Link>
          </div>
        </Intro>
        <Intro delay={400}>
          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              ['24h', 'Todos os dias'],
              ['R$99', 'Combo LS'],
              ['5,0★', 'No Google'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl sm:text-4xl">{n}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ash">{l}</dd>
              </div>
            ))}
          </dl>
        </Intro>
        </div>
      </div>
    </section>
  );
}

function Essencia() {
  return (
    <section id="sobre" className="py-28 sm:py-36">
      <div className="container-ls">
        <SectionHead
          numero="01"
          rotulo="A essência"
          texto="A Los Santos nasceu para transformar o cuidado pessoal em rotina. Aqui, técnica e ambiente se encontram para entregar experiência e resultado."
        >
          Uma parada obrigatória <em>para quem tem presença.</em>
        </SectionHead>

        <div className="mt-20 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Reveal>
            <TiltCard className="h-full !border-blood/40 !bg-gradient-to-br from-blood to-blood-dark p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">• Combo Los Santos</p>
              <p className="mt-10 whitespace-nowrap font-display text-5xl sm:text-6xl">R$99,90</p>
              <p className="mt-3 text-white/85">Monte o combo do seu jeito.</p>
              <a href={whatsapp('Olá! Quero montar meu Combo Los Santos.')} target="_blank" rel="noreferrer" className="-my-3 mt-7 inline-flex items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.2em]">
                Montar combo <Arrow />
              </a>
            </TiltCard>
          </Reveal>
          {pilares.map((p, i) => (
            <Reveal key={p.titulo} delay={(i + 1) * 120}>
              <TiltCard className="h-full p-8">
                <span className="font-display text-5xl text-white/10 transition-colors group-hover:text-blood">0{i + 1}</span>
                <h3 className="mt-8 font-display text-2xl uppercase tracking-wide">{p.titulo}</h3>
                <p className="mt-3 leading-relaxed text-ash">{p.texto}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicosPreview() {
  const lista = servicos.filter((s) => ['Cabelo', 'Barba', 'Limpeza facial'].includes(s.nome));
  return (
    <section className="border-t border-white/10 bg-coal py-28 sm:py-36">
      <div className="container-ls">
        <SectionHead
          numero="02"
          rotulo="Serviços"
          texto="Cuidados completos para cabelo, barba e bem-estar. Escolha o seu e agende pelo WhatsApp."
        >
          Escolha sua <em>próxima versão.</em>
        </SectionHead>

        <ul className="mt-16 border-t border-white/10">
          {lista.map((s, i) => (
            <Reveal as="li" key={s.nome} delay={i * 100}>
              <Link
                to="/servicos"
                className="group relative flex items-center gap-6 overflow-hidden border-b border-white/10 py-8 sm:gap-10 sm:py-10"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-blood transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="relative font-display text-xl text-ash transition-colors group-hover:text-white/70 sm:pl-6">0{i + 1}</span>
                <span className="relative flex-1 font-display text-4xl uppercase transition-transform duration-500 group-hover:translate-x-3 sm:text-7xl">
                  {s.nome}
                </span>
                <span className="relative hidden font-serif text-lg italic text-ash group-hover:text-white sm:block">{s.detalhe}</span>
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 transition group-hover:rotate-[-45deg] group-hover:border-white sm:mr-6">
                  <Arrow />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12">
          <Link to="/servicos" className="btn-ghost">Ver todos os serviços <Arrow /></Link>
        </Reveal>
      </div>
    </section>
  );
}

// O mapa do Google pesa ~1 MB e deixa a rolagem pesada no celular.
// Aqui ele só carrega quando a pessoa toca no botão.
function MapaSobDemanda({ src }) {
  const [ativo, setAtivo] = useState(false);
  return (
    <div className="relative h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-coal lg:h-full lg:min-h-[460px]">
      {ativo ? (
        <iframe
          title="Mapa da Los Santos Barbearia"
          src={src}
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full"
          style={{ filter: 'grayscale(1) invert(.92) contrast(.9)' }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAtivo(true)}
          className="group absolute inset-0 grid place-items-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px), radial-gradient(circle at 50% 45%, rgba(201,29,38,.25), transparent 55%)',
            backgroundSize: '40px 40px, 40px 40px, 100% 100%',
          }}
        >
          <span className="flex flex-col items-center gap-5">
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-blood shadow-[0_10px_40px_-5px_rgba(201,29,38,.8)] transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
            </span>
            <span className="rounded-full border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] transition group-hover:border-white">
              Ver mapa interativo
            </span>
          </span>
        </button>
      )}
      <div className="pointer-events-none absolute bottom-4 left-4 whitespace-nowrap rounded-full bg-blood px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] sm:bottom-5 sm:left-5 sm:px-4 sm:text-[11px] sm:tracking-[0.25em]">
        Los Santos • Você chegou
      </div>
    </div>
  );
}

function Localizacao() {
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(`${contato.endereco}, Valinhos SP`)}&output=embed`;
  return (
    <section id="contato" className="py-28 sm:py-36">
      <div className="container-ls">
        <SectionHead numero="03" rotulo="Onde estamos">
          No coração <em>de Valinhos.</em>
        </SectionHead>

        <div className="mt-16 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <TiltCard className="flex h-full flex-col p-8 sm:p-10">
              <p className="eyebrow">Endereço</p>
              <p className="mt-5 font-display text-3xl uppercase leading-tight sm:text-4xl">{contato.endereco}</p>
              <p className="mt-2 text-ash">{contato.cidade}</p>

              <p className="eyebrow mt-10">Funcionamento</p>
              <p className="mt-4 font-display text-2xl uppercase">{contato.horario}</p>

              <div className="mt-auto flex flex-wrap gap-3 pt-10">
                <a href={contato.mapa} target="_blank" rel="noreferrer" className="btn-red">Abrir no mapa</a>
                <a href={contato.telefoneLink} className="btn-ghost">{contato.telefone}</a>
              </div>
            </TiltCard>
          </Reveal>
          <Reveal delay={150}>
            <MapaSobDemanda src={mapa} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Avaliacoes() {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const caixa = useRef(null);
  const toque = useRef(null);
  const total = avaliacoes.length;
  const ir = useCallback((i) => setAtual((i + total) % total), [total]);

  // só troca sozinho quando está na tela
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // o tempo recomeça a cada troca (inclusive quando a pessoa clica)
  useEffect(() => {
    if (pausado || !visivel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => setAtual((a) => (a + 1) % total), 6000);
    return () => clearTimeout(id);
  }, [pausado, visivel, atual, total]);

  // arrastar para os lados no celular
  const onTouchStart = (e) => { toque.current = e.touches[0].clientX; setPausado(true); };
  const onTouchEnd = (e) => {
    const ini = toque.current;
    toque.current = null;
    setPausado(false);
    if (ini == null) return;
    const dx = e.changedTouches[0].clientX - ini;
    if (Math.abs(dx) > 50) ir(atual + (dx < 0 ? 1 : -1));
  };

  return (
    <section className="border-t border-white/10 bg-coal py-28 sm:py-36">
      <div className="container-ls">
        <SectionHead
          numero="04"
          rotulo="Avaliações"
          texto="Conte como foi sua experiência e ajude outras pessoas a conhecerem a barbearia. Sua avaliação faz parte da nossa história."
        >
          Já passou <em>pela Los Santos?</em>
        </SectionHead>

        <Reveal className="mt-16">
          <div
            ref={caixa}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink p-6 sm:p-14"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carrossel"
            aria-label="Avaliações de clientes"
          >
            <span className="pointer-events-none absolute -top-10 right-6 font-serif text-[16rem] leading-none text-blood/15">”</span>
            <div className="relative grid" aria-live="polite">
              {avaliacoes.map((a, i) => (
                <figure
                  key={a.nome}
                  aria-hidden={i !== atual}
                  className={`col-start-1 row-start-1 transition-[opacity,transform] ${
                    i === atual
                      ? 'translate-y-0 opacity-100 delay-200 duration-700'
                      : 'pointer-events-none invisible translate-y-4 opacity-0 duration-200'
                  }`}
                >
                  <Stars />
                  <blockquote className="mt-6 max-w-4xl font-serif text-xl italic leading-snug sm:text-3xl">“{a.texto}”</blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-blood font-display text-xl">{a.nome[0]}</span>
                    <span>
                      <span className="block font-semibold uppercase tracking-wider">{a.nome}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-ash">Avaliação no Google</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="relative mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 sm:mt-10">
              <div className="-ml-2 flex">
                {avaliacoes.map((a, i) => (
                  <button
                    key={a.nome}
                    type="button"
                    onClick={() => ir(i)}
                    aria-label={`Mostrar avaliação ${i + 1}`}
                    aria-current={i === atual}
                    className="group grid h-11 place-items-center px-1.5"
                  >
                    <span className={`block h-1.5 rounded-full transition-all ${i === atual ? 'w-10 bg-blood' : 'w-4 bg-white/20 group-hover:bg-white/40'}`} />
                  </button>
                ))}
              </div>
              <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                <button type="button" onClick={() => ir(atual - 1)} aria-label="Avaliação anterior" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 transition hover:border-blood hover:bg-blood">
                  <Arrow className="h-4 w-4 rotate-180" />
                </button>
                <button type="button" onClick={() => ir(atual + 1)} aria-label="Próxima avaliação" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 transition hover:border-blood hover:bg-blood">
                  <Arrow />
                </button>
                <a href={contato.avaliarGoogle} target="_blank" rel="noreferrer" className="btn-ghost flex-1 whitespace-nowrap sm:flex-none">Avaliar no Google</a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee itens={['Cabelo', 'Barba', 'Sobrancelha', 'Limpeza facial', 'Aberto 24h', 'Valinhos']} />
      <Essencia />
      <ServicosPreview />
      <Localizacao />
      <Avaliacoes />
    </>
  );
}
