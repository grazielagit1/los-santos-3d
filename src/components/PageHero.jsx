import { Suspense } from 'react';
import { Intro, SafeBoundary } from './ui';

// Topo das páginas internas: texto à esquerda e cena 3D à direita.
// No celular, a cena fica acima do texto (sem sobrepor).
export default function PageHero({ eyebrow, titulo, texto, children, Scene }) {
  return (
    <section className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden pb-16 pt-20 md:flex-row md:items-center md:pb-10 md:pt-32">
      <div
        className="pointer-events-none absolute right-[-15%] top-[10%] h-[75vh] w-[75vh]"
        style={{ background: 'radial-gradient(closest-side, rgba(201,29,38,.22), transparent)' }}
      />
      <span className="pointer-events-none absolute -left-6 top-24 select-none font-display text-[38vw] leading-none text-white/[0.025] md:text-[22vw]" aria-hidden="true">
        LS
      </span>
      {Scene && (
        <SafeBoundary fallback={<div className="h-[30svh] w-full shrink-0 md:hidden" />}>
          <Suspense fallback={<div className="h-[30svh] w-full shrink-0 md:hidden" />}>
            <Scene className="relative h-[30svh] w-full shrink-0 md:absolute md:inset-0 md:h-full" />
          </Suspense>
        </SafeBoundary>
      )}

      <div className="container-ls relative">
        <div className="md:max-w-[58%] lg:max-w-none">
          <Intro>
            <p className="eyebrow mb-6 sm:mb-8">{eyebrow}</p>
          </Intro>
          <Intro delay={100}>
            <h1 className="titulo max-w-3xl" style={{ fontSize: 'clamp(2.8rem, 8.5vw, 7.5rem)' }}>
              {titulo}
            </h1>
          </Intro>
          <Intro delay={250}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ash">{texto}</p>
            {children && <div className="mt-10 flex flex-wrap gap-4">{children}</div>}
          </Intro>
        </div>
      </div>
    </section>
  );
}
