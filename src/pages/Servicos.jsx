import { lazy } from 'react';
import PageHero from '../components/PageHero';
import { Arrow, IconWhats, Reveal, SectionHead, TiltCard } from '../components/ui';
import { servicos, whatsapp } from '../data/site';

const Scissors = lazy(() => import('../three/Scissors'));

export default function Servicos() {
  return (
    <>
      <PageHero
        eyebrow="Serviços Los Santos"
        titulo={<>Experiência para <em>marcar presença.</em></>}
        texto="Escolha seu cuidado, confira o valor e agende seu horário com atendimento pelo WhatsApp."
        Scene={Scissors}
      >
        <a href={whatsapp()} target="_blank" rel="noreferrer" className="btn-red">
          <IconWhats className="h-4 w-4" /> Agendar agora
        </a>
      </PageHero>

      <section className="border-t border-white/10 bg-coal py-28 sm:py-36">
        <div className="container-ls">
          <SectionHead
            numero="01"
            rotulo="Catálogo"
            texto="Escolha o serviço ideal e fale com a equipe para confirmar a disponibilidade do seu horário."
          >
            Escolha o <em>seu ritual.</em>
          </SectionHead>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicos.map((s, i) => (
              <Reveal key={s.nome} delay={(i % 3) * 120}>
                <TiltCard
                  className={`flex h-full flex-col p-8 ${s.destaque ? '!border-blood/50 !bg-gradient-to-br from-blood/90 to-blood-dark' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`font-display text-6xl transition-colors ${s.destaque ? 'text-white/30' : 'text-white/10 group-hover:text-blood'}`}>
                      0{i + 1}
                    </span>
                    {s.preco && (
                      <span className="rounded-full bg-black/30 px-4 py-2 font-display text-xl">{s.preco}</span>
                    )}
                  </div>
                  <h3 className="mt-10 font-display text-4xl uppercase">{s.nome}</h3>
                  <p className={`mt-1 font-serif text-lg italic ${s.destaque ? 'text-white/85' : 'text-blood'}`}>{s.detalhe}</p>
                  <p className={`mt-4 leading-relaxed ${s.destaque ? 'text-white/80' : 'text-ash'}`}>{s.descricao}</p>
                  <a
                    href={whatsapp(`Olá, Los Santos! Quero agendar: ${s.nome}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex items-center gap-3 self-start pt-10 text-xs font-bold uppercase tracking-[0.25em]"
                  >
                    Agende!
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/25 transition group-hover:rotate-[-45deg] group-hover:border-white group-hover:bg-white group-hover:text-ink">
                      <Arrow />
                    </span>
                  </a>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-ls grid items-center gap-x-10 gap-y-8 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto]">
          <Reveal>
            <p className="font-display text-[7rem] leading-none text-blood sm:text-[10rem]">24/7</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">Sem complicação</p>
            <p className="mt-4 font-display text-4xl uppercase sm:text-5xl">
              Seu horário. <span className="font-serif font-extrabold normal-case italic text-blood">Seu estilo.</span>
            </p>
            <p className="mt-3 text-ash">A Los Santos funciona 24 horas, todos os dias.</p>
          </Reveal>
          <Reveal delay={200} className="md:col-start-2 lg:col-start-auto">
            <a href={whatsapp()} target="_blank" rel="noreferrer" className="btn-ghost whitespace-nowrap">Falar com a equipe</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
