import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Pede ao navegador para baixar as fontes do título logo no início (o texto aparece mais rápido)
const preloadFontes = () => ({
  name: 'preload-fontes',
  transformIndexHtml(html, ctx) {
    if (!ctx.bundle) return html;
    const alvos = [/anton-latin-400-normal.*\.woff2$/, /playfair-display-latin-800-italic.*\.woff2$/, /inter-latin-wght-normal.*\.woff2$/];
    const tags = Object.keys(ctx.bundle)
      .filter((f) => alvos.some((r) => r.test(f)))
      .map((f) => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: '/' + f, crossorigin: '' }, injectTo: 'head' }));
    return { html, tags };
  },
});

// `npm run build`            -> site normal para publicar (Vercel)
// `npm run build -- --mode preview` -> um único HTML para pré-visualizar
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'preview' ? [viteSingleFile()] : [preloadFontes()])],
  build: mode === 'preview'
    ? { outDir: 'dist-preview', assetsInlineLimit: 100_000_000 }
    : {
        // o Three.js fica num arquivo separado que só carrega quando uma cena 3D aparece
        chunkSizeWarningLimit: 1000,
      },
}));
