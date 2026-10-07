# Los Santos Barbearia — site com 3D

Site da Los Santos refeito com **React + Vite**, **Three.js** (via React Three Fiber), **Tailwind CSS v4** e **Lenis** (rolagem suave).

## Como rodar

```bash
npm install
npm run dev        # abre em http://localhost:5173
npm run build      # gera a pasta dist/ para publicar
```

Para publicar na Vercel, suba a pasta do projeto (ou conecte o repositório). O `vercel.json` já faz as rotas `/servicos` e `/produtos` funcionarem.

`npm run build:preview` gera um único HTML em `dist-preview/`, que abre direto no navegador (usa rotas com `#`).

## Estrutura

```
src/
  data/site.js          ← textos, preços, avaliações e contatos (edite aqui)
  index.css             ← cores e fontes da marca (@theme do Tailwind)
  lib/scroll.jsx        ← Lenis + estado de rolagem usado pelas cenas 3D
  components/
    Layout.jsx          ← cabeçalho, menu mobile, CTA, rodapé, botão do WhatsApp
    PageHero.jsx        ← topo das páginas internas
    ui.jsx              ← Reveal (aparecer ao rolar), TiltCard (cartão 3D), Marquee...
  three/
    Stage.jsx           ← Canvas, luzes e reflexos (pausa quando sai da tela)
    BarberPole.jsx      ← poste de barbeiro (Início)
    Scissors.jsx        ← tesoura que corta (Serviços)
    Bottle.jsx          ← frasco de shampoo com rótulo (Produtos)
  pages/                ← Home, Servicos, Produtos
```

## Animações

- **Poste de barbeiro**: as listras sobem sem parar e aceleram quando você rola; o poste inclina com o mouse e sobe girando ao sair do topo.
- **Tesoura**: abre e fecha como se estivesse cortando, segue o mouse e gira com a rolagem.
- **Frasco**: gira devagar, reage ao mouse e tem um anel cromado orbitando.
- **Cartões**: inclinam em 3D e ganham um brilho vermelho que acompanha o cursor.
- Textos aparecem ao entrar na tela, faixa vermelha rolando, carrossel de avaliações.
- Quem ativou "reduzir movimento" no sistema recebe a versão sem rolagem suave e sem animações contínuas.

## Desempenho e estabilidade

- **Carregamento:** o Three.js (≈240 KB comprimido) fica num arquivo separado que só baixa depois que o texto já apareceu. Na primeira visita o navegador baixa ≈100 KB de JavaScript em vez de ≈360 KB.
- **3D inteligente** (`src/three/Stage.jsx`): monta quando o navegador está livre, pausa fora da tela e com a aba em segundo plano, e baixa a resolução sozinho se o FPS cair (`AdaptiveQuality` em `src/three/fx.jsx`).
- **Sem 3D no aparelho?** O site continua funcionando: o poste vira uma versão em CSS e as outras cenas somem sem quebrar nada.
- **Fontes** hospedadas no próprio site (pacotes `@fontsource`) e pré-carregadas.
- **Mapa do Google** só carrega quando a pessoa toca em "Ver mapa interativo".
- **Páginas internas** são pré-carregadas quando o navegador fica ocioso ou ao passar o mouse no menu.
- **Cache:** o `vercel.json` manda o navegador guardar os arquivos de `/assets` por 1 ano (eles mudam de nome a cada build).
- **SEO:** `robots.txt`, `sitemap.xml`, dados estruturados da barbearia (Google) e prévia de link para WhatsApp. Se o domínio mudar, troque o endereço em `public/robots.txt` e `public/sitemap.xml`.

## Para trocar

- **Logo**: `src/assets/logo-los-santos.webp`
- **Link de compra dos produtos**: hoje os botões abrem o WhatsApp com o nome do produto. Se houver uma loja, troque o link em `src/pages/Produtos.jsx`.
