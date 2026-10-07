import { lazy } from 'react';
import PageHero from '../components/PageHero';
import { Arrow, Reveal, SectionHead, TiltCard } from '../components/ui';
import { produtos, whatsapp } from '../data/site';

const Bottle = lazy(() => import('../three/Bottle'));

export default function Produtos() {
  return (
    <>
      <PageHero
        eyebrow="Aprenda a se cuidar"
        titulo={<>Cuidado <em>pessoal.</em></>}
        texto="Guias para o dia a dia e a linha Los Santos para levar o cuidado da barbearia para casa."
        Scene={Bottle}
      >
        <a href={whatsapp('Olá! Quero saber mais sobre os produtos Los Santos.')} target="_blank" rel="noreferrer" className="btn-red">
          Falar com a equipe
        </a>
      </PageHero>

      <section className="border-t border-white/10 bg-coal py-28 sm:py-36">
        <div className="container-ls">
          <SectionHead
            numero="01"
            rotulo="Cuidado pessoal"
            texto="Selecione um tema para aprender mais ou conheça os produtos da linha Los Santos."
          >
            Escolha seu <em>próximo passo.</em>
          </SectionHead>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {produtos.map((p, i) => (
              <Reveal key={p.nome} delay={(i % 3) * 120} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
                <TiltCard className={`flex h-full flex-col p-8 ${p.destaque ? '!border-blood/50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <span className="grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-ink font-display text-3xl transition group-hover:border-blood group-hover:bg-blood">
                      {p.sigla}
                    </span>
                    <span className="font-display text-xl text-white/20">0{i + 1}</span>
                  </div>
                  <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.3em] text-blood">{p.tipo}</p>
                  <h3 className="mt-2 font-display text-3xl uppercase">{p.nome}</h3>
                  <p className="mt-2 text-ash">{p.descricao}</p>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-10">
                    <span className="whitespace-nowrap font-display text-3xl">{p.preco ?? <span className="text-base font-sans font-semibold uppercase tracking-[0.2em] text-ash">Guia</span>}</span>
                    <a
                      href={whatsapp(`Olá, Los Santos! Tenho interesse em: ${p.nome}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] transition hover:border-blood hover:bg-blood"
                    >
                      {p.preco ? 'Comprar' : 'Ver guia'} <Arrow />
                    </a>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-ls grid items-center gap-10 md:grid-cols-[auto_1fr]">
          <Reveal>
            <p className="font-display text-[7rem] leading-none text-blood sm:text-[10rem]">100%</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">Compra segura</p>
            <p className="mt-4 font-display text-4xl uppercase sm:text-5xl">
              Você escolhe. <span className="font-serif font-extrabold normal-case italic text-blood">A Los Santos entrega.</span>
            </p>
            <p className="mt-3 max-w-xl text-ash">
              Ao clicar em um produto, você fala direto com a equipe da barbearia, que confirma os detalhes e finaliza a sua compra.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
