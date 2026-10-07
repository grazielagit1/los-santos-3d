// Todo o conteúdo do site num só lugar: edite aqui para mudar textos, preços e contatos.

export const contato = {
  telefone: '(19) 98995-0363',
  telefoneLink: 'tel:+5519989950363',
  endereco: 'Rua Álvaro Gomes Vilela, 121',
  cidade: 'Valinhos — SP · CEP 13274-540',
  mapa: 'https://www.google.com/maps/search/?api=1&query=Rua+Alvaro+Gomes+Vilela+121+Valinhos+SP+13274-540',
  avaliarGoogle: 'https://g.page/r/CZW8p9DpFxldEAE/review',
  horario: '24 horas • Todos os dias',
};

export const whatsapp = (texto = 'Olá, Los Santos! Quero agendar um horário.') =>
  `https://wa.me/5519989950363?text=${encodeURIComponent(texto)}`;

export const navegacao = [
  { rotulo: 'Início', para: '/' },
  { rotulo: 'Serviços', para: '/servicos' },
  { rotulo: 'Produtos', para: '/produtos' },
  { rotulo: 'Contato', para: '/#contato' },
];

export const pilares = [
  { titulo: 'Técnica old school', texto: 'Tradição no corte, precisão nos detalhes e domínio da tesoura, da máquina e da navalha.' },
  { titulo: 'Ambiente clássico', texto: 'Uma atmosfera urbana e confortável, feita para desacelerar enquanto cuidamos de você.' },
  { titulo: 'Sempre disponível', texto: 'Portas abertas 24 horas, todos os dias, para o seu cuidado caber na sua rotina.' },
];

export const servicos = [
  { nome: 'Cabelo', detalhe: 'Cortes clássicos', descricao: 'Tesoura, máquina e acabamento na navalha. Do social ao degradê.' },
  { nome: 'Barba', detalhe: 'Barbas tradicionais', descricao: 'Toalha quente, navalha e finalização com produtos da linha LS.' },
  { nome: 'Sobrancelha', detalhe: 'Design natural', descricao: 'Limpeza e alinhamento sem perder a naturalidade do rosto.' },
  { nome: 'Limpeza facial', detalhe: 'Cuidado da pele', descricao: 'Remove impurezas, hidrata e deixa a pele pronta para o dia.' },
  { nome: 'Massagem capilar', detalhe: 'Tratamento indiano', descricao: 'Relaxa, estimula o couro cabeludo e fortalece os fios.' },
  { nome: 'Combo Los Santos', detalhe: 'Monte o combo do seu jeito', descricao: 'Escolha os serviços que quiser e pague um valor fechado.', preco: 'R$ 99,90', destaque: true },
];

export const produtos = [
  { sigla: 'C', tipo: 'Guia Los Santos', nome: 'Cuide do cabelo', descricao: 'Práticas para lavar, cuidar e finalizar.' },
  { sigla: 'B', tipo: 'Guia Los Santos', nome: 'Cuide da barba', descricao: 'Orientações para lavar, cuidar e finalizar.' },
  { sigla: 'S', tipo: 'Linha Los Santos', nome: 'Shampoo LS', descricao: '100% orgânico.', preco: 'R$ 90,00' },
  { sigla: 'SC', tipo: 'Linha Los Santos', nome: 'Shampoo e Condicionador', descricao: 'Ideal para cabelo e barba.', preco: 'R$ 160,00' },
  { sigla: 'K', tipo: 'Linha Los Santos', nome: 'Kit Los Santos', descricao: 'Shampoo, condicionador e colônia.', preco: 'R$ 270,00', destaque: true },
];

export const avaliacoes = [
  { nome: 'Luis Mesquita', texto: 'Cheguei 06h30 e saí às 08h na primeira e única barbearia 24h de Valinhos. Levei meu filho também para fazer o primeiro corte e ficou impecável, sem falar do ambiente que é leve e descontraído.' },
  { nome: 'Pedro Gabriel', texto: 'Muito bom, o pessoal é super simpático, cortam bem e o lugar é bem bonito. O mais surpreendente é que é realmente 24 horas.' },
  { nome: 'Nicholas Constantinov', texto: 'Excelente atendimento, diferencial no acabamento e em entender o que o cliente quer.' },
  { nome: 'Jonatas Silva', texto: 'Recepção incrível, lugar top, atendimento super atencioso, recomendo.' },
  { nome: 'Vick Tuckmantel', texto: 'Atendimento 24 horas que funciona. Simplesmente excelente!' },
  { nome: 'Zynko', texto: 'Excelente experiência! O atendimento foi impecável, com profissionais atenciosos e muito bem preparados. O ambiente é moderno, limpo e super aconchegante, com um clima descontraído que faz toda a diferença.' },
];
