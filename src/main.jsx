import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
// Fontes hospedadas junto com o site (sem depender do Google Fonts)
import '@fontsource/anton/latin-400.css';
import '@fontsource/playfair-display/latin-800-italic.css';
import '@fontsource-variable/inter/wght.css';
import './index.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import { ScrollManager, SmoothScroll } from './lib/scroll';
import { prefetchQuandoLivre } from './lib/prefetch';

const Servicos = lazy(() => import('./pages/Servicos'));
const Produtos = lazy(() => import('./pages/Produtos'));

// A prévia em arquivo único usa HashRouter; o site publicado usa URLs normais (/servicos)
const Router = import.meta.env.MODE === 'preview' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <SmoothScroll>
        <ScrollManager />
        <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="servicos" element={<Servicos />} />
              <Route path="produtos" element={<Produtos />} />
              <Route path="*" element={<Home />} />
            </Route>
        </Routes>
      </SmoothScroll>
    </Router>
  </StrictMode>
);

window.addEventListener('load', prefetchQuandoLivre, { once: true });
