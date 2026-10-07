// Pré-carrega as outras páginas (e suas cenas 3D) antes do clique,
// para a troca de página ser instantânea.
const paginas = {
  '/servicos': [() => import('../pages/Servicos'), () => import('../three/Scissors')],
  '/produtos': [() => import('../pages/Produtos'), () => import('../three/Bottle')],
};

const feitos = new Set();

export function prefetch(caminho) {
  const p = caminho.split('#')[0];
  if (feitos.has(p) || !paginas[p]) return;
  feitos.add(p);
  paginas[p].forEach((carregar) => carregar().catch(() => feitos.delete(p)));
}

// Quando o navegador fica ocioso, baixa o código (leve) das páginas internas
export function prefetchQuandoLivre() {
  const conexao = navigator.connection;
  if (conexao?.saveData || /2g/.test(conexao?.effectiveType || '')) return; // respeita economia de dados
  const run = () => Object.keys(paginas).forEach((p) => paginas[p][0]());
  'requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 4000 }) : setTimeout(run, 3000);
}
