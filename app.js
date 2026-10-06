if(window.top!==window.self){try{window.top.location=window.self.location}catch(e){}document.documentElement.style.display='none'}
(function(){
/* ================= dados fixos ================= */
const CATS_G=[
  {id:'moradia',nome:'Moradia',em:'🏠'},{id:'contas',nome:'Contas da casa',em:'💡'},{id:'mercado',nome:'Mercado',em:'🛒'},
  {id:'restaurantes',nome:'Alimentação fora de casa',em:'🍽️'},{id:'transporte',nome:'Transporte',em:'🚗'},{id:'farmacia',nome:'Farmácia',em:'💊'},
  {id:'saude',nome:'Saúde',em:'🩺'},{id:'educacao',nome:'Educação',em:'🎓'},{id:'dividas',nome:'Dívidas e empréstimos',em:'🏦'},
  {id:'assinaturas',nome:'Assinaturas',em:'📺'},{id:'lazer',nome:'Lazer',em:'🎬'},{id:'compras',nome:'Compras pessoais',em:'🛍️'},
  {id:'roupas',nome:'Roupas e acessórios',em:'👕'},{id:'beleza',nome:'Beleza',em:'💈'},{id:'viagens',nome:'Viagens',em:'✈️'},
  {id:'presentes',nome:'Presentes',em:'🎁'},{id:'impostos',nome:'Impostos e taxas',em:'🧾'},{id:'pets',nome:'Pets',em:'🐶'},
  {id:'manutencao',nome:'Casa e manutenção',em:'🔧'},{id:'outros',nome:'Outros',em:'📦'}];
const CATS_E=[{id:'salario',nome:'Salário',em:'💼'},{id:'extra',nome:'Renda extra',em:'✨'},{id:'outros-in',nome:'Outras entradas',em:'➕'}];
const CAT=Object.fromEntries([...CATS_G,...CATS_E,{id:'meta',nome:'Metas',em:'🎯'},{id:'livre',nome:'Dinheiro pessoal',em:'💸'},{id:'investimentos',nome:'Investimentos',em:'📈'}].map(c=>[c.id,c]));
const EMOJIS_META=['💍','🏡','🛟','✈️','🚗','🎓','👶','🐶','🛋️','🎯'];
const EMOJIS_DESEJO=['✨','✈️','🛋️','📱','💻','🚗','🏖️','🎮','👗','🍽️','🎁','🏠'];
const INV=[
  {id:'renda_fixa',nome:'Renda fixa',curto:'Renda fixa',cor:'#3b82f6',campo:'Produto',produtos:['CDB','Tesouro','LCI','LCA','Poupança','Debênture','Outro'],lbl:'Descrição (opcional)',ph:'Ex.: 110% do CDI, vence em 2028'},
  {id:'acoes',nome:'Ações',curto:'Ações',cor:'#facc15',lbl:'Ticker ou empresa',ph:'Ex.: ITSA4'},
  {id:'fundos',nome:'Fundos',curto:'Fundos',cor:'#a855f7',campo:'Tipo do fundo',produtos:['Renda fixa','Multimercado','Ações','Cambial','Previdência','Outro'],lbl:'Nome do fundo (opcional)',ph:'Ex.: Fundo XP Multimercado'},
  {id:'fiis',nome:'Fundos imobiliários',curto:'FIIs',cor:'#f97316',campo:'Tipo do FII',produtos:['Tijolo','Papel','Fundo de fundos','Híbrido'],lbl:'Ticker',ph:'Ex.: MXRF11'},
  {id:'etfs',nome:'ETFs',curto:'ETFs',cor:'#22d3ee',lbl:'Ticker',ph:'Ex.: IVVB11'},
  {id:'bdrs',nome:'BDRs',curto:'BDRs',cor:'#ec4899',lbl:'Ticker',ph:'Ex.: AAPL34'},
  {id:'cripto',nome:'Criptomoedas',curto:'Cripto',cor:'#14b8a6',campo:'Moeda',produtos:['Bitcoin','Ethereum','Stablecoin','Outra'],lbl:'Descrição (opcional)',ph:'Ex.: carteira na corretora'}];
/* formato antigo (antes do schema-v7) convertido na hora de exibir */
const NOME_MEIO={pix:'Pix',debito:'Débito',credito:'Crédito',dinheiro:'Dinheiro',transferencia:'Transferência',boleto:'Boleto'};
const INV_ANTIGO={poupanca:'Poupança',tesouro:'Tesouro',cdb:'CDB',lci_lca:'LCI',cri_cra:'CRI/CRA',lc:'LC',debentures:'Debênture',lf:'LF'};
const INVT=Object.fromEntries(INV.map(t=>[t.id,t]));
const CORES_CARTAO=['#7c3aed','#0ea5e9','#f97316','#ef4444','#10b981','#ec4899','#64748b','#111827'];

const ICON={
  geral:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  calendario:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2"/>',
  gastos:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8.5 12.5L12 16l3.5-3.5"/>',
  entradas:'<circle cx="12" cy="12" r="9"/><path d="M12 16V8M8.5 11.5L12 8l3.5 3.5"/>',
  cartoes:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>',
  recorrentes:'<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
  orcamento:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  contas:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  dividas:'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
  metas:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  desejos:'<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
  livre:'<circle cx="12" cy="9" r="6"/><path d="M12 15v6M9.5 21h5"/>',
  retro:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  investimentos:'<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
  mov:'<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
  nosso:'<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9.5" r="2.6"/><path d="M3 19c.6-3.4 3-5 6-5s5.4 1.6 6 5M14.5 14.6c2.8-.4 5.6.9 6.5 4.4"/>',
  mais:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  olho:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  olhoF:'<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  baixar:'<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
  instalar:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3M10 18.5h4"/>',
  sair:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"/>',
  escudo:'<path d="M12 3l8 3v6c0 4.5-3.2 8.3-8 9-4.8-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  del:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  plus:'<path d="M12 5v14M5 12h14"/>'
};
const svg=(k)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`;
const VIEWS=[
  {id:'geral',nome:'Visão geral'},
  {id:'gastos',nome:'Gastos'},{id:'entradas',nome:'Entradas'},{id:'transf',nome:'Transferências'},
  {id:'calendario',nome:'Calendário'},{id:'orcamento',nome:'Orçamento'},{id:'contas',nome:'Contas'},
  {id:'cartoes',nome:'Cartões'},{id:'dividas',nome:'Dívidas'},{id:'investimentos',nome:'Investimentos'},
  {id:'metas',nome:'Metas'},{id:'desejos',nome:'Desejos'},{id:'reserva',nome:'Reserva'},
  {id:'livre',nome:'Dinheiro pessoal'},
  {id:'relmes',nome:'Resumo mensal'},{id:'patrimonio',nome:'Patrimônio'},
  {id:'retro',nome:'Relatório anual'}
];
const GRUPOS=[
  {id:'g-geral',nome:'Visão geral',curto:'Geral',ic:'geral',views:['geral']},
  {id:'g-mov',nome:'Movimentações',curto:'Movimentos',ic:'mov',views:['gastos','entradas','transf']},
  {id:'g-plan',nome:'Planejamento',curto:'Planejar',ic:'calendario',views:['calendario','orcamento','contas']},
  {id:'g-fin',nome:'Finanças',curto:'Finanças',ic:'cartoes',views:['cartoes','dividas','investimentos']},
  {id:'g-obj',nome:'Objetivos',curto:'Objetivos',ic:'metas',views:['metas','desejos','reserva']},
  {id:'g-nosso',nome:'Nosso dinheiro',curto:'Nosso',ic:'nosso',views:['livre']},
  {id:'g-rel',nome:'Relatórios',curto:'Relatórios',ic:'retro',views:['relmes','patrimonio','retro']}
];
const grupoDe=v=>GRUPOS.find(g=>g.views.includes(v))||GRUPOS[0];
const ALIAS={limites:'orcamento',recorrentes:'contas'};
const AVATARES={enzo:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24.5 44h15v22h-15z" fill="#9c5f3b"/><path d="M24.5 46c2.5 2.2 12.5 2.2 15 0v3c-3 2-12 2-15 0z" fill="#86502f"/><ellipse cx="17" cy="33" rx="3.2" ry="4.6" fill="#b5764c"/><ellipse cx="47" cy="33" rx="3.2" ry="4.6" fill="#b5764c"/><ellipse cx="32" cy="31" rx="15" ry="17.5" fill="#b9794f"/><path d="M17 30C15.5 16 23.5 10 32 10s16.5 6 15 20c-1.2-6-3.8-9.2-8.5-10.4-4.8 1.8-13 2-18.3.6C18.6 22.4 17.6 25.6 17 30z" fill="#16120f"/><path d="M22.4 26.6q3.6-2.2 7.2-.3M34.4 26.3q3.6-1.9 7.2.3" stroke="#16120f" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="26" cy="31.2" rx="1.9" ry="2.3" fill="#24150e"/><ellipse cx="38" cy="31.2" rx="1.9" ry="2.3" fill="#24150e"/><path d="M32 32.5q-2.2 4.6.2 5.8" stroke="#8a5032" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M26 41.4c2.6-1.7 9.4-1.7 12 0-1.4.7-3.4.5-6 .5s-4.6.2-6-.5z" fill="#16120f"/><path d="M26.1 41.7c-.3 2.4.6 4.4 2.3 5.6M37.9 41.7c.3 2.4-.6 4.4-2.3 5.6" stroke="#16120f" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M28.6 43.4q3.4 2.2 6.8 0" stroke="#fff" stroke-width="1.2" fill="#f4efe9" stroke-linecap="round"/><path d="M28.6 43.4q3.4 2.6 6.8 0" stroke="#6b3220" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M28.6 47c1.1 2 2 3 3.4 3s2.3-1 3.4-3c-2 1-4.8 1-6.8 0z" fill="#16120f"/></svg>',mariana:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 31C13 15 22 9 32 9s19 6 18 22l1 21c0 4-3.6 6.2-7 5.6H20c-3.4.6-7-1.6-7-5.6z" fill="#d9a63c"/><path d="M25.5 44h13v22h-13z" fill="#ecc4a8"/><path d="M25.5 46c2.4 2 10.6 2 13 0v3c-3 1.8-10 1.8-13 0z" fill="#dfb194"/><ellipse cx="32" cy="31" rx="14" ry="16.5" fill="#f8dbc6"/><path d="M18 31C16.6 17 25 12 33 12c9 0 14.4 6 13.6 17.6-2.6-6-6.6-9.8-12.8-10.8-3 4-9.6 8-15.8 12.2z" fill="#f3c95e"/><path d="M18.2 28.5c-2 10-1.2 20 3 28H15.8c-3.4-9-2.6-19.6 2.4-28zM46.2 27.6c2 10.4 1.2 20.6-3 28.9h5.4c3.4-9.2 2.6-20-2.4-28.9z" fill="#f3c95e"/><path d="M23.4 27q3.4-1.8 6.6-.2M34.2 26.8q3.4-1.6 6.6.2" stroke="#b8893a" stroke-width="1.7" fill="none" stroke-linecap="round"/><ellipse cx="26.6" cy="31.6" rx="1.8" ry="2.2" fill="#3b2a20"/><ellipse cx="37.4" cy="31.6" rx="1.8" ry="2.2" fill="#3b2a20"/><path d="M24.4 29.6l-1.2-1M39.6 29.6l1.2-1" stroke="#3b2a20" stroke-width="1.1" stroke-linecap="round"/><circle cx="23.6" cy="37" r="2.4" fill="#f2a29a" opacity=".45"/><circle cx="40.4" cy="37" r="2.4" fill="#f2a29a" opacity=".45"/><path d="M32 33q-1.6 3.4.4 4.2" stroke="#d9a58c" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M28.4 41.2q3.6 2.8 7.2 0" stroke="#d0686a" stroke-width="1.9" fill="none" stroke-linecap="round"/></svg>'};
const AVATARES_TRISTES={enzo:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24.5 44h15v22h-15z" fill="#9c5f3b"/><path d="M24.5 46c2.5 2.2 12.5 2.2 15 0v3c-3 2-12 2-15 0z" fill="#86502f"/><ellipse cx="17" cy="33" rx="3.2" ry="4.6" fill="#b5764c"/><ellipse cx="47" cy="33" rx="3.2" ry="4.6" fill="#b5764c"/><ellipse cx="32" cy="31" rx="15" ry="17.5" fill="#b9794f"/><path d="M17 30C15.5 16 23.5 10 32 10s16.5 6 15 20c-1.2-6-3.8-9.2-8.5-10.4-4.8 1.8-13 2-18.3.6C18.6 22.4 17.6 25.6 17 30z" fill="#16120f"/><path d="M22.4 27.4q3.8-.6 7.2-2.6M34.4 24.8q3.4 2 7.2 2.6" stroke="#16120f" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="26" cy="31.2" rx="1.9" ry="2.3" fill="#24150e"/><ellipse cx="38" cy="31.2" rx="1.9" ry="2.3" fill="#24150e"/><path d="M32 32.5q-2.2 4.6.2 5.8" stroke="#8a5032" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M26 41.4c2.6-1.7 9.4-1.7 12 0-1.4.7-3.4.5-6 .5s-4.6.2-6-.5z" fill="#16120f"/><path d="M26.1 41.7c-.3 2.4.6 4.4 2.3 5.6M37.9 41.7c.3 2.4-.6 4.4-2.3 5.6" stroke="#16120f" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M29 45.2q3-2.6 6 0" stroke="#6b3220" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M28.6 47c1.1 2 2 3 3.4 3s2.3-1 3.4-3c-2 1-4.8 1-6.8 0z" fill="#16120f"/></svg>',mariana:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 31C13 15 22 9 32 9s19 6 18 22l1 21c0 4-3.6 6.2-7 5.6H20c-3.4.6-7-1.6-7-5.6z" fill="#d9a63c"/><path d="M25.5 44h13v22h-13z" fill="#ecc4a8"/><path d="M25.5 46c2.4 2 10.6 2 13 0v3c-3 1.8-10 1.8-13 0z" fill="#dfb194"/><ellipse cx="32" cy="31" rx="14" ry="16.5" fill="#f8dbc6"/><path d="M18 31C16.6 17 25 12 33 12c9 0 14.4 6 13.6 17.6-2.6-6-6.6-9.8-12.8-10.8-3 4-9.6 8-15.8 12.2z" fill="#f3c95e"/><path d="M18.2 28.5c-2 10-1.2 20 3 28H15.8c-3.4-9-2.6-19.6 2.4-28zM46.2 27.6c2 10.4 1.2 20.6-3 28.9h5.4c3.4-9.2 2.6-20-2.4-28.9z" fill="#f3c95e"/><path d="M23.4 27.6q3.4-.6 6.6-2.4M34.2 25.2q3.2 1.8 6.6 2.4" stroke="#b8893a" stroke-width="1.7" fill="none" stroke-linecap="round"/><ellipse cx="26.6" cy="31.6" rx="1.8" ry="2.2" fill="#3b2a20"/><ellipse cx="37.4" cy="31.6" rx="1.8" ry="2.2" fill="#3b2a20"/><path d="M24.4 29.6l-1.2-1M39.6 29.6l1.2-1" stroke="#3b2a20" stroke-width="1.1" stroke-linecap="round"/><circle cx="23.6" cy="37" r="2.4" fill="#f2a29a" opacity=".45"/><circle cx="40.4" cy="37" r="2.4" fill="#f2a29a" opacity=".45"/><path d="M32 33q-1.6 3.4.4 4.2" stroke="#d9a58c" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M28.8 43.4q3.2-2.8 6.4 0" stroke="#d0686a" stroke-width="1.9" fill="none" stroke-linecap="round"/></svg>'};
const TABS=['g-geral','g-mov','g-plan','g-obj'];

/* ================= utilidades ================= */
const $=id=>document.getElementById(id);
const brl=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const brl0=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
const R=v=>brl.format(v||0);
const R0=v=>brl.format(v||0);
const K=v=>{const a=Math.abs(v);return a>=1000?(a/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mil':Math.round(a).toLocaleString('pt-BR')};
const KS=v=>{const a=Math.abs(v);return a>=1000?(a/1000).toLocaleString('pt-BR',{maximumFractionDigits:a>=10000?0:1})+'k':Math.round(a)};
/* regra de cores: entrada verde, saída vermelha, saldo pelo sinal, referência dourada */
const cS=v=>v>0.004?'pos':v<-0.004?'neg':'zero';
const RF=t=>`<span class="ref">${t}</span>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const hojeD=new Date();
const HOJE=`${hojeD.getFullYear()}-${pad(hojeD.getMonth()+1)}-${pad(hojeD.getDate())}`;
const MES_ATUAL=HOJE.slice(0,7);
const ANO_ATUAL=hojeD.getFullYear();
function addMes(m,d){const [y,mm]=m.split('-').map(Number);const x=new Date(y,mm-1+d,1);return `${x.getFullYear()}-${pad(x.getMonth()+1)}`}
function difMes(a,b){const [y1,m1]=a.split('-').map(Number),[y2,m2]=b.split('-').map(Number);return (y2-y1)*12+(m2-m1)}
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function nomeMes(m,curto){const [y,mm]=m.split('-').map(Number);return cap(new Date(y,mm-1,1).toLocaleDateString('pt-BR',curto?{month:'short'}:{month:'long',year:'numeric'}).replace('.',''))}
function mesAno(m){const [y,mm]=m.split('-').map(Number);return new Date(y,mm-1,1).toLocaleDateString('pt-BR',{month:'short'}).replace('.','')+'/'+y}
function soMes(m){return nomeMes(m).split(' de ')[0].toLowerCase()}
function ultimoDia(m){const [y,mm]=m.split('-').map(Number);return new Date(y,mm,0).getDate()}
function diaNoMes(m,dia){return `${m}-${pad(Math.min(dia,ultimoDia(m)))}`}
function dataBR(iso){if(!iso)return '';const [y,m,d]=iso.split('-');return `${d}/${m}`}
function dataLonga(iso){const [y,m,d]=iso.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString('pt-BR',{day:'numeric',month:'short',year:'numeric'}).replace('.','')}
function diaSemana(iso){const [y,m,d]=iso.split('-').map(Number);return cap(new Date(y,m-1,d).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}))}
function diasEntre(a,b){const p=s=>{const [y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d)};return Math.round((p(b)-p(a))/864e5)}
function normNum(s){if(s.includes(','))return s.replace(/\./g,'').replace(',','.');if(/^\d{1,3}(\.\d{3})+$/.test(s))return s.replace(/\./g,'');return s}
function parseValor(s){s=String(s||'').trim().replace(/\s|R\$/g,'');if(!s)return null;s=normNum(s);const n=Number(s);return isFinite(n)&&n>0?Math.round(n*100)/100:null}
function parseLivre(s){s=String(s||'').trim().replace(/\s|R\$/g,'');if(!s)return null;const neg=s.startsWith('-');s=normNum(s.replace('-',''));const n=Number(s);return isFinite(n)?Math.round((neg?-n:n)*100)/100:null}
function fmtInput(v){return v||v===0?String(v).replace('.',','):''}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),t.length>60?4200:2600)}
/* aviso com botão "Desfazer" por alguns segundos */
function toastDesfazer(t,desfazer){
  document.querySelectorAll('.toast-undo').forEach(x=>x.remove());
  const d=document.createElement('div');d.className='toast toast-undo';
  const sp=document.createElement('span');sp.textContent=t;
  const b=document.createElement('button');b.type='button';b.textContent='Desfazer';
  b.addEventListener('click',async()=>{b.disabled=true;try{await desfazer();d.remove();toast('Desfeito')}catch(e){b.disabled=false;toast('Não deu para desfazer agora.')}});
  d.append(sp,b);document.body.append(d);setTimeout(()=>d.remove(),9000);
}
const cent=v=>Math.round((v+Number.EPSILON)*100)/100;
const soma=arr=>cent(arr.reduce((s,i)=>s+Math.round(i.valor*100),0)/100);
const uuid=()=>(crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16)));
const plural=(n,s,p)=>n+' '+(n===1?s:p);

/* ================= estado ================= */
const CFG=window.CAIXA_CONFIG||{};
let sb=null,canal=null,timer=null,gerando=false,instalarEvt=null;
const S={fTag:'',ultima:{},mes:MES_ATUAL,ano:ANO_ATUAL,view:'geral',itens:[],movMetas:[],metas:[],contas:[],limites:{},mesadas:{},nomes:{},me:'',
  ordDes:(()=>{try{return localStorage.getItem('pf-ord-des')||'prioridade'}catch(e){return 'prioridade'}})(),fCat:'',fOrd:(()=>{try{return localStorage.getItem('pf-ord')||'recente'}catch(e){return 'recente'}})(),fBusca:'',temV2:true,temV4:true,saldoInicial:0,movCaixa:0,base:[],cartoes:[],recorrentes:[],dividas:[],desejos:[],orc:{},
  pagPrev:{},temV12:false,patrIni:'',temPatr:false,rendaMedia:0,temRenda:false,fut:[],card:[],fech:{},ccF:{cartao:'',mes:'',ano:''},pagDiv:[],invest:[],temV5:true,invAtivo:null,retro:{},calDia:null,abaDesejos:'aberto',sim:{nome:'',valor:'',forma:'vista',n:10},priv:false};
try{S.priv=localStorage.getItem('pf-priv')==='1'}catch(e){}

/* ================= carregamento ================= */
function deLinha(r){return {id:r.id,tipo:r.tipo,valor:Number(r.valor),descricao:r.descricao||'',categoria:r.categoria,data:r.data,mes:r.data.slice(0,7),autor:r.autor_email,
  criadoEm:Date.parse(r.criado_em)||0,meta_id:r.meta_id||null,conta_id:r.conta_id||null,cartao_id:r.cartao_id||null,compra_id:r.compra_id||null,
  parcela:r.parcela||null,parcelas:r.parcelas||null,recorrente_id:r.recorrente_id||null,divida_id:r.divida_id||null,livre:!!r.livre||r.categoria==='livre',
  status:r.status||'pago',data_caixa:r.data_caixa||null,fatura_mes:r.fatura_mes||null,meio:r.meio||'',ref_mes:r.ref_mes||null,investimento_id:r.investimento_id||null,editado:!!r.editado,tags:Array.isArray(r.tags)?r.tags:[],nota:r.nota||'',anexo:r.anexo||null,dono:r.dono||null}}
async function carregarItens(){
  const alvo=S.mes,menor=S.mes<MES_ATUAL?S.mes:MES_ATUAL,maior=S.mes>MES_ATUAL?S.mes:addMes(MES_ATUAL,1);
  const ini=addMes(menor,-5)+'-01',fim=addMes(maior,1)+'-01';
  const {data,error}=await sb.from('lancamentos').select('*').gte('data',ini).lt('data',fim);
  if(alvo!==S.mes)return;
  if(error){toast('Não deu para carregar os lançamentos.');return}
  S.itens=(data||[]).map(deLinha);
}
async function carregarResto(){
  const q=t=>sb.from(t);
  const ini3=addMes(MES_ATUAL,-3)+'-01',fimAt=addMes(MES_ATUAL,1)+'-01';
  const r=await Promise.all([
    q('metas').select('*').order('criado_em'),
    q('config').select('*').eq('id','casal').maybeSingle(),
    q('lancamentos').select('meta_id,tipo,valor,data').in('tipo',['aporte','resgate']).not('meta_id','is',null).eq('status','pago'),
    q('lancamentos').select('id,tipo,valor,data_caixa').eq('status','pago').lte('data_caixa',HOJE),
    q('lancamentos').select('tipo,valor,data,categoria,livre,status').in('status',['pago','comprometido']).gte('data',ini3).lt('data',fimAt),
    q('cartoes').select('*').order('criado_em'),
    q('recorrentes').select('*').order('dia'),
    q('dividas').select('*').order('criado_em'),
    q('desejos').select('*').order('criado_em'),
    q('orcamentos').select('*'),
    q('lancamentos').select('*').not('cartao_id','is',null),
    q('lancamentos').select('divida_id,data,tipo').eq('tipo','divida').not('divida_id','is',null),
    q('investimentos').select('*').order('data',{ascending:false}),
    q('lancamentos').select('status,fatura_mes').limit(1),
    q('fechamentos').select('*'),
    q('lancamentos').select('tags').limit(1),
    q('recorrentes').select('dono,fim').limit(1)
  ]);
  const [mt,cf,mv,tot,base,cc,rc,dv,ds,orc,card,pd,inv,v9,fc,v10,v11]=r;
  S.temV10=!v10.error;S.temV11=!v11.error;S.fech=Object.fromEntries((fc.data||[]).map(f=>[f.mes,f]));
  S.temV9=!v9.error;S.temV2=!mt.error;S.temV4=!cc.error;S.temV5=!inv.error;S.temV6=true;S.temV8=true;
  S.metas=(mt.data||[]).filter(m=>!m.arquivada).map(m=>({...m,alvo:Number(m.alvo)}));
  S.limites=(cf.data&&cf.data.limites)||{};
  S.mesadas=(cf.data&&cf.data.mesadas)||{};
  S.temV12=!!(cf.data&&'pag_previstos' in cf.data);S.pagPrev=(cf.data&&cf.data.pag_previstos)||{};
  S.temRenda=!!(cf.data&&'renda_media' in cf.data);S.rendaMedia=Number(cf.data&&cf.data.renda_media)||0;
  S.temPatr=!!(cf.data&&'patr_inicial' in cf.data);S.patrIni=(cf.data&&cf.data.patr_inicial)||'';
  S.saldoInicial=Number(cf.data&&cf.data.saldo_inicial)||0;
  S.movMetas=(mv.data||[]).map(x=>({meta_id:x.meta_id,tipo:x.tipo,valor:Number(x.valor),mes:(x.data||'').slice(0,7)}));
  S.movCaixa=(tot.data||[]).reduce((s,x)=>{const v=Number(x.valor);return s+(x.tipo==='entrada'||x.tipo==='resgate'?v:-v)},0);
  S.base=(base.data||[]).map(x=>({tipo:x.tipo,valor:Number(x.valor),mes:x.data.slice(0,7),categoria:x.categoria,livre:!!x.livre}));
  S.cartoes=(cc.data||[]).map(c=>({...c,limite:Number(c.limite)}));
  S.recorrentes=(rc.data||[]).map(x=>({...x,valor:Number(x.valor),auto:x.auto!==false}));
  S.contas=[];
  S.dividas=(dv.data||[]).map(x=>({...x,parcela:Number(x.parcela),juros:Number(x.juros)||0}));
  S.desejos=(ds.data||[]).map(x=>({...x,valor:Number(x.valor)}));
  {const novo=Object.fromEntries((orc.data||[]).map(o=>[o.mes,{gastos:o.gastos||{},entradas:Number(o.entradas)||0}]));if((S._orcPend||0)>0&&S.orc[S.mes])novo[S.mes]=S.orc[S.mes];S.orc=novo;}
  S.card=(card.data||[]).map(deLinha).filter(x=>x.status!=='cancelado');
  S.pagDiv=(pd.data||[]).map(x=>({divida_id:x.divida_id,mes:x.data.slice(0,7)}));
  if(!tot.error&&!card.error)S.assMov=JSON.stringify([...(tot.data||[]).filter(x=>['gasto','entrada'].includes(x.tipo)).map(x=>[x.id,x.tipo,Number(x.valor),x.data_caixa]),...(card.data||[]).filter(x=>x.tipo==='gasto'&&x.status==='comprometido'&&x.data<=HOJE).map(x=>[x.id,x.tipo,Number(x.valor),x.data,x.status])].sort((a,b)=>String(a[0]).localeCompare(String(b[0]))));
  S.invest=(inv.data||[]).map(x=>{const v={...x,valor:Number(x.valor),aplicado:x.aplicado==null?Number(x.valor):Number(x.aplicado),produto:x.produto||''};if(INV_ANTIGO[v.tipo]){v.produto=v.produto||INV_ANTIGO[v.tipo];v.tipo='renda_fixa'}return v});
}
async function recarregar(){
  const permitirMovimento=!!S._movCarregado;
  S.hist=null;S._histV=(S._histV||0)+1;S._histC=false;
  await Promise.all([carregarItens(),carregarResto()]);
  const mudou=permitirMovimento&&S.assMov!==S._ultimaAssMov;
  if(S.assMov!==undefined){S._movCarregado=true;S._ultimaAssMov=S.assMov}
  render(mudou);
  if(!gerando&&S.temV9){gerando=true;try{if(await gerarOcorrencias()>0){await Promise.all([carregarItens(),carregarResto()]);const mudou=permitirMovimento&&S.assMov!==S._ultimaAssMov;S._ultimaAssMov=S.assMov;render(mudou)}}finally{gerando=false}}
}
function agendar(){clearTimeout(timer);timer=setTimeout(()=>{if((S._orcEditando||0)>0||(S._orcPend||0)>0)return agendar();recarregar()},350)}
function assinar(){
  if(canal)return;
  canal=sb.channel('caixa');
  ['lancamentos','config','metas','contas_fixas','cartoes','recorrentes','dividas','desejos','orcamentos','investimentos','fechamentos'].forEach(t=>canal.on('postgres_changes',{event:'*',schema:'public',table:t},agendar));
  canal.subscribe();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)agendar()});
}
/* lança sozinho as recorrências que chegaram no dia (sem duplicar entre os dois celulares) */
/* regras de contas e recorrências geram uma ocorrência por mês (mês atual e o próximo).
   A ocorrência nasce prevista; as automáticas são confirmadas sozinhas no dia.
   Tudo é idempotente: rodar de novo não duplica nada. */
/* regras de contas e recorrências geram uma ocorrência por mês (mês atual e o próximo).
   A ocorrência nasce prevista; as automáticas se realizam sozinhas no dia.
   Paga no Pix/débito/dinheiro: realizada = paga (sai do caixa).
   Paga no crédito: realizada = compra na fatura do cartão (o caixa só muda ao pagar a fatura).
   Tudo é idempotente: rodar de novo não duplica nada. */
async function gerarOcorrencias(){
  let n=0;const novos=[];
  for(const r of S.recorrentes){
    if(!r.ativa)continue;const card=r.cartao_id&&S.cartoes.find(c=>c.id===r.cartao_id);
    for(const m of [MES_ATUAL,addMes(MES_ATUAL,1)]){
      if(r.inicio>m||(r.fim&&m>r.fim))continue;const d=diaNoMes(m,r.dia);
      const o={tipo:r.tipo,valor:r.valor,descricao:r.descricao,categoria:r.categoria,data:d,recorrente_id:r.id,ref_mes:m,status:'previsto'};
      if(S.temV10&&r.meio)o.meio=r.meio;
      if(S.temV11&&r.dono)o.dono=r.dono;
      if(card){o.cartao_id=card.id;o.fatura_mes=mesFatura(card,d);o.meio='credito'}
      novos.push(o);
    }
  }
  if(novos.length){const {data,error}=await sb.from('lancamentos').upsert(novos,{onConflict:'recorrente_id,ref_mes',ignoreDuplicates:true}).select('id');if(!error&&data)n+=data.length}
  const autos=S.recorrentes.filter(r=>r.ativa&&r.auto);
  const caixa=autos.filter(r=>!r.cartao_id).map(r=>r.id),cred=autos.filter(r=>r.cartao_id).map(r=>r.id);
  if(caixa.length){const {data,error}=await sb.from('lancamentos').update({status:'pago'}).eq('status','previsto').in('recorrente_id',caixa).lte('data',HOJE).select('id');if(!error&&data)n+=data.length}
  if(cred.length){const {data,error}=await sb.from('lancamentos').update({status:'comprometido'}).eq('status','previsto').in('recorrente_id',cred).lte('data',HOJE).select('id');if(!error&&data)n+=data.length}
  /* cobranças recorrentes no cartão sempre seguem a regra do fechamento: corrige as que ficaram com datas antigas do cartão */
  for(const x of S.card.filter(x=>x.recorrente_id&&x.cartao_id&&x.status!=='pago')){
    const card=S.cartoes.find(c=>c.id===x.cartao_id);if(!card)continue;const certo=mesFatura(card,x.data);
    if(x.fatura_mes!==certo){const {error}=await sb.from('lancamentos').update({fatura_mes:certo}).eq('id',x.id);if(!error)n++}
  }
  return n;
}
/* ================= cálculos ================= */
/* "efetivo" = o fato econômico aconteceu (pago no caixa ou comprometido no cartão) */
function efetivo(i){return i.status==='pago'||i.status==='comprometido'}
function doMes(m){return S.itens.filter(i=>i.mes===m&&i.status!=='cancelado')}
function resumo(m){
  const it=doMes(m),ef=it.filter(efetivo);
  const g=soma(ef.filter(i=>i.tipo==='gasto')),e=soma(ef.filter(i=>i.tipo==='entrada'));
  const metasM=ef.filter(i=>i.meta_id),inv=ef.filter(i=>!i.meta_id&&(i.tipo==='aporte'||i.tipo==='resgate'));
  const sg=a=>soma(a.filter(i=>i.tipo==='aporte'))-soma(a.filter(i=>i.tipo==='resgate'));
  const ap=sg(metasM),iv=sg(inv),dv=soma(ef.filter(i=>i.tipo==='divida'));
  return {it,ef,gastos:g,entradas:e,guardado:ap,investido:iv,amortizado:dv,resultado:cent(e-g),saldo:cent(e-g)};
}
function emCaixa(){return S.saldoInicial+S.movCaixa}
function guardadoMeta(id){return S.movMetas.filter(x=>x.meta_id===id).reduce((s,x)=>s+(x.tipo==='aporte'?x.valor:-x.valor),0)}
function totalInvest(){return S.invest.reduce((s,x)=>s+x.valor,0)}
function mixHex(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function totalMetas(){return S.metas.reduce((s,m)=>s+guardadoMeta(m.id),0)}
function porCategoria(it,semPessoal){const o={};it.filter(i=>i.tipo==='gasto'&&efetivo(i)&&!(semPessoal&&ehLivre(i))).forEach(i=>{o[i.categoria]=cent((o[i.categoria]||0)+i.valor)});return o}
/* médias dos últimos 3 meses fechados (ou do mês atual, se ainda não houver histórico) */
function media(){
  let per=[1,2,3].map(k=>addMes(MES_ATUAL,-k)).map(m=>S.base.filter(x=>x.mes===m)).filter(a=>a.length);
  if(!per.length)per=[S.base.filter(x=>x.mes===MES_ATUAL)];
  const f=(a,t)=>a.filter(x=>x.tipo===t).reduce((s,x)=>s+x.valor,0);
  const n=per.length;
  const entHist=per.reduce((s,a)=>s+f(a,'entrada'),0)/n, gas=per.reduce((s,a)=>s+f(a,'gasto'),0)/n;
  /* a renda média que vocês definem vale mais que o histórico; sem ela, usa a média dos últimos meses */
  const ent=S.rendaMedia>0?S.rendaMedia:entHist;
  const ap=per.reduce((s,a)=>s+f(a,'aporte')-f(a,'resgate'),0)/n;
  return {ent,gas,ap,sobra:ent-gas,meses:per[0].length?n:0,definida:S.rendaMedia>0,hist:entHist};
}
function planejado(m){const o=S.orc[m];return {gastos:o?o.gastos:(S.limites||{}),entradas:o?o.entradas:0,proprio:!!o}}
/* primeiro mês ainda não cobrado de uma regra e quantas cobranças faltam até o fim */
function proxCobranca(r){const oc=ocorrencia(r,MES_ATUAL);const base=r.inicio>MES_ATUAL?r.inicio:MES_ATUAL;return oc&&(oc.status==='pago'||oc.status==='comprometido'||oc.status==='cancelado')&&base===MES_ATUAL?addMes(MES_ATUAL,1):base}
function restantesRegra(r){if(!r.fim)return null;return Math.max(0,difMes(proxCobranca(r),r.fim)+1)}
/* situação de uma regra (conta ou recorrência) no mês m */
function ocorrencia(r,m){return S.itens.find(i=>i.recorrente_id===r.id&&(i.ref_mes===m||(!i.ref_mes&&i.mes===m)))}
function statusConta(r,m){
  const oc=ocorrencia(r,m),venc=diaNoMes(m,r.dia);
  if(oc&&oc.status==='cancelado')return {k:'idle',txt:'Pulada este mês',venc,oc};
  if(oc&&oc.status==='pago')return {k:'ok',txt:(r.tipo==='entrada'?'Recebida em ':'Paga em ')+dataBR(oc.data_caixa||oc.data),venc,oc,pago:oc};
  if(oc&&oc.status==='comprometido')return {k:'ok',txt:'No cartão · fatura de '+nomeMes(refDoItem(oc)||m,true).toLowerCase(),venc,oc,pago:oc};
  if(!r.ativa)return {k:'idle',txt:'Pausada',venc,oc};
  if(r.inicio>m)return {k:'idle',txt:'Começa em '+mesAno(r.inicio),venc,oc};
  if(r.fim&&m>r.fim)return {k:'idle',txt:'Encerrada em '+mesAno(r.fim),venc,oc};
  const d=diasEntre(HOJE,(oc&&oc.data)||venc);
  if(d<0)return {k:'late',txt:r.tipo==='entrada'?'Aguardando confirmação':(d===-1?'Venceu ontem':`Atrasada ${-d} dias`),venc,oc};
  if(d===0)return {k:'soon',txt:r.tipo==='entrada'?'Prevista para hoje':'Vence hoje',venc,oc};
  if(d<=5)return {k:'soon',txt:(r.tipo==='entrada'?'Prevista ':'Vence ')+(d===1?'amanhã':`em ${d} dias`),venc,oc};
  return {k:'idle',txt:(r.tipo==='entrada'?'Prevista dia ':'Vence dia ')+Math.min(r.dia,ultimoDia(m)),venc,oc};
}
function avatarDe(email,triste){const n=String(S.nomes[email]||email||'').trim().split(/\s+/)[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');return (triste?AVATARES_TRISTES:AVATARES)[n]||''}
/* selinho dos bonequinhos: verde com joinha quando o saldo é positivo, vermelho e tristes quando é negativo */
function selo(v,opt={}){
  if(!isFinite(v)||Math.abs(v)<0.005)return '';
  const bom=v>0,quem=opt.quem?[opt.quem]:Object.keys(S.nomes).slice(0,2);
  const rostos=quem.map(e=>{const av=avatarDe(e,!bom);return `<span class="sl-av">${av||esc((S.nomes[e]||e||'?').charAt(0).toUpperCase())}</span>`}).join('');
  const txt=bom?'No positivo! 👍':'No negativo 👎';
  return `<span class="selo ${bom?'bom':'ruim'}${opt.inl?' inl':''}" title="${txt}" aria-label="${txt}">${rostos}<i class="sl-mao" aria-hidden="true">${bom?'👍':'👎'}</i></span>`;
}
/* dono da conta/compra: azul-escuro para o Enzo, rosa para a Mariana */
const CORES_DONO={enzo:'#1e3a8a',mariana:'#ec4899'};
function corDono(email){const n=String(S.nomes[email]||email||'').trim().split(/\s+/)[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');return CORES_DONO[n]||'#b8860b'}
function donoBadge(email){if(!email)return '';const nome=S.nomes[email]||email.split('@')[0];return `<span class="dono-b" style="--dc:${corDono(email)}"><i>${avatarDe(email)||esc(nome.charAt(0))}</i>${esc(nome.split(' ')[0])}</span>`}
function nomeDe(email){if(!email)return '';if(email===S.me)return 'Você';return S.nomes[email]||email.split('@')[0]}
function ehLivre(i){return !!(i.livre||i.categoria==='livre')}
function outroLivre(i){return ehLivre(i)&&!!i.autor&&i.autor!==S.me}
function catVis(i){return outroLivre(i)?CAT.livre:(CAT[i.categoria]||{em:'•',nome:i.categoria||''})}
function descVis(i){const c=CAT[i.categoria]||{nome:''};if(outroLivre(i))return 'Dinheiro pessoal de '+nomeDe(i.autor);return i.descricao||c.nome}
/* cartões */
function mesFatura(card,dataISO){let fm=dataISO.slice(0,7);if(Number(dataISO.slice(8,10))>=card.fechamento)fm=addMes(fm,1);if(card.vencimento<=card.fechamento)fm=addMes(fm,1);return fm}
function fechamentoFatura(card,fm){return diaNoMes(card.vencimento>card.fechamento?fm:addMes(fm,-1),card.fechamento)}
function vencFatura(card,fm){return diaNoMes(fm,card.vencimento)}
/* dia em que vocês pretendem pagar a fatura (só vale no mês do vencimento, enquanto não passou e não foi paga) */
function pagPrevisto(card,fm){const d=S.pagPrev&&S.pagPrev[card.id+'|'+fm];if(!d||d<HOJE||d.slice(0,7)!==vencFatura(card,fm).slice(0,7))return null;return d}
function itensFatura(id,fm){return S.card.filter(x=>x.cartao_id===id&&x.fatura_mes===fm)}
function infoFatura(card,fm){
  const it=itensFatura(card.id,fm),total=soma(it),aberto=soma(it.filter(x=>x.status==='comprometido')),prev=soma(it.filter(x=>x.status==='previsto'));
  const venc=vencFatura(card,fm),fech=fechamentoFatura(card,fm);
  const k=!it.length?'vazia':aberto<=0?'paga':HOJE>venc?'atrasada':HOJE>=fech?'fechada':'aberta';
  return {it,total,aberto,prev,venc,fech,k:it.length&&aberto<=0&&prev>0?(HOJE>=fech?'fechada':'aberta'):k};
}
/* O "mês da fatura" é sempre o mês em que ela FECHA: fecha 27/09 e vence 05/10 = fatura de setembro.
   Por dentro, a fatura continua guardada pelo mês de vencimento; estas funções fazem a ponte. */
function refDe(card,fm){return fechamentoFatura(card,fm).slice(0,7)}
function fmDeRef(card,ref){return card.vencimento>card.fechamento?ref:addMes(ref,1)}
function faturaRef(card,ref){return infoFatura(card,fmDeRef(card,ref))}
function totalRef(ref,soAberto){return S.cartoes.reduce((s,c)=>{const f=faturaRef(c,ref);return s+(soAberto?f.aberto:f.total)},0)}
function refDoItem(x){const cd=S.cartoes.find(c=>c.id===x.cartao_id);return cd&&x.fatura_mes?refDe(cd,x.fatura_mes):(x.fatura_mes||'')}
function addDia(iso,n){const [y,m,d]=iso.split('-').map(Number);const x=new Date(Date.UTC(y,m-1,d+n));return `${x.getUTCFullYear()}-${pad(x.getUTCMonth()+1)}-${pad(x.getUTCDate())}`}
/* período coberto: da data de fechamento anterior (inclusive) até o dia antes do fechamento desta fatura */
function periodoFatura(card,fm){const fech=fechamentoFatura(card,fm),ant=fechamentoFatura(card,addMes(fm,-1));return {ini:ant,fim:addDia(fech,-1),fech}}
/* cobranças de assinaturas no cartão que ainda não viraram lançamento (meses mais distantes) */
function previstasFatura(card,fm){
  const out=[];
  S.recorrentes.filter(r=>r.ativa&&r.cartao_id===card.id&&r.tipo==='gasto').forEach(r=>{
    for(const m of [addMes(fm,-2),addMes(fm,-1),fm]){
      if(m<MES_ATUAL||r.inicio>m||(r.fim&&m>r.fim))continue;
      const d=diaNoMes(m,r.dia);if(mesFatura(card,d)!==fm)continue;
      if(S.card.some(x=>x.recorrente_id===r.id&&x.ref_mes===m)||S.itens.some(x=>x.recorrente_id===r.id&&x.ref_mes===m))continue;
      out.push({id:'prev-'+r.id+'-'+m,descricao:r.descricao,valor:r.valor,data:d,categoria:r.categoria,dono:r.dono||null,prevista:true,recorrente_id:r.id,ref_mes:m,status:'previsto',autor:null,livre:false,cartao_id:card.id});
    }
  });
  return out.sort((a,b)=>a.data.localeCompare(b.data));
}
function dadosFatura(card,fm){const inf=infoFatura(card,fm),prev=previstasFatura(card,fm),per=periodoFatura(card,fm);
  return {...inf,prev,per,totalPrev:soma(prev),pago:soma(inf.it.filter(x=>x.status==='pago')),mesFech:per.fech.slice(0,7)}}
function foraDoPeriodo(x,per){return x.data<per.ini||x.data>=per.fech}
function usadoCartao(id){return S.card.filter(x=>x.cartao_id===id&&x.status==='comprometido').reduce((s,x)=>s+x.valor,0)}
function faturaMes(id,m){return itensFatura(id,m)}
function comprometido(m){return S.card.filter(x=>x.fatura_mes===m&&x.status==='comprometido').reduce((s,x)=>s+x.valor,0)}
function faturaTotal(m){return S.card.filter(x=>x.fatura_mes===m).reduce((s,x)=>s+x.valor,0)}
/* dívidas */
function saldoDevedor(d,rest){const i=(d.juros||0)/100;return rest<=0?0:i>0?d.parcela*(1-Math.pow(1+i,-rest))/i:d.parcela*rest}
function infoDivida(d){
  const pagos=S.pagDiv.filter(p=>p.divida_id===d.id);
  const pagas=Math.min(d.parcelas_total,d.pagas_inicial+pagos.length),rest=d.parcelas_total-pagas;
  const pagaMes=pagos.some(p=>p.mes===S.mes),pagaAtual=pagos.some(p=>p.mes===MES_ATUAL);
  const sd=saldoDevedor(d,rest),i=(d.juros||0)/100,jurosProx=i>0?Math.min(d.parcela,sd*i):0;
  return {pagas,rest,saldo:sd,pagaMes,jurosProx,fim:rest>0?addMes(MES_ATUAL,pagaAtual?rest:rest-1):null};
}
/* o mês agora: o que ainda entra, o que ainda sai e quanto está disponível de verdade */
function aportesPlanejados(){
  return S.metas.filter(m=>m.prazo).reduce((s,m)=>{const falta=Math.max(0,m.alvo-guardadoMeta(m.id));if(!falta)return s;
    const meses=Math.max(1,difMes(MES_ATUAL,m.prazo.slice(0,7))),porMes=falta/meses;
    const ja=S.movMetas.filter(x=>x.meta_id===m.id&&x.mes===MES_ATUAL).reduce((a,x)=>a+(x.tipo==='aporte'?x.valor:-x.valor),0);
    return s+Math.max(0,porMes-ja)},0);
}
/* uso de uma categoria do orçamento: o que já aconteceu e o que já está comprometido para o mês */
function orcItens(cat,m){
  const it=doMes(m).filter(i=>i.tipo==='gasto'&&i.categoria===cat&&!ehLivre(i));
  const realizados=it.filter(efetivo),compromissos=it.filter(i=>i.status==='previsto');
  if(m>=MES_ATUAL)S.recorrentes.filter(r=>r.ativa&&r.tipo==='gasto'&&r.categoria===cat&&r.inicio<=m&&!(r.fim&&m>r.fim)&&!ocorrencia(r,m)).forEach(r=>{
    compromissos.push({...r,descricao:r.descricao,data:diaNoMes(m,r.dia||1),status:'previsto',valor:r.valor});
  });
  return {realizados,compromissos};
}
function orcUso(cat,m){const it=orcItens(cat,m);return {realizado:soma(it.realizados),comprometido:soma(it.compromissos)}}
function verbaPessoalRestante(){return Object.keys(S.nomes).reduce((s,e)=>{const m=Number(S.mesadas[e])||0;if(!m)return s;
  const u=soma(doMes(MES_ATUAL).filter(i=>i.tipo==='gasto'&&efetivo(i)&&ehLivre(i)&&i.autor===e));return s+Math.max(0,m-u)},0)}
/* o mês agora. Metas e sugestões de aporte NÃO entram aqui: só mudam o caixa quando o aporte é registrado. */
function situacaoMes(){
  const ev=eventosMes(MES_ATUAL);let entra=0,aPagar=0,previsto=0;const itens=[];
  Object.entries(ev).forEach(([d,es])=>es.forEach(e=>{if(e.feito)return;const v=e.pend!=null?e.pend:e.valor;
    if(e.entra)entra+=v;else if(e.sai){if(d<=HOJE)aPagar+=v;else previsto+=v}
    itens.push({...e,data:d,valor:v})}));
  // compromissos atrasados de meses anteriores (faturas e contas não pagas)
  const atrCartao=S.card.filter(x=>x.status==='comprometido'&&x.fatura_mes<MES_ATUAL).reduce((s,x)=>s+x.valor,0);
  const atrContas=S.itens.filter(i=>i.status==='previsto'&&i.mes<MES_ATUAL&&!i.cartao_id&&(i.tipo==='gasto'||i.tipo==='divida')).reduce((s,i)=>s+i.valor,0);
  aPagar+=atrCartao+atrContas;
  const sai=aPagar+previsto,caixa=emCaixa();
  return {caixa,entra,sai,aPagar,previsto,atrCartao:cent(atrCartao),atrContas:cent(atrContas),compromissos:sai,sugestaoMetas:aportesPlanejados(),verba:verbaPessoalRestante(),disponivel:caixa-sai,previsao:caixa+entra-sai,itens};
}
function patrimonioLiquido(){
  const ativos=emCaixa()+totalMetas()+totalInvest();
  const passivos=S.dividas.reduce((s,d)=>s+infoDivida(d).saldo,0)+S.card.filter(x=>x.status==='comprometido').reduce((s,x)=>s+x.valor,0);
  /* patrimônio = o que vocês têm agora (caixa + metas + investimentos); só diminui quando o dinheiro sai do caixa */
  const dividas=S.dividas.reduce((s,d)=>s+infoDivida(d).saldo,0);
  return {ativos,passivos,dividas,liquido:cent(ativos-dividas)};
}
function mesesSeguranca(){const g=media().gas;return g>0?reservaAtual()/g:null}
/* reserva de emergência */
function reservaIdeal(){const g=media().gas;return Math.round(g*6/100)*100}
function reservaAtual(){return S.metas.filter(m=>m.reserva).reduce((s,m)=>s+guardadoMeta(m.id),0)}
function alvoMeta(m){return m.alvo}
/* projeção de metas: média guardada nos últimos 3 meses */
function previsaoMeta(m){
  const g=guardadoMeta(m.id),alvo=alvoMeta(m);if(g>=alvo)return {txt:'Meta batida! 🎉',ok:true};
  const ms=[0,1,2].map(k=>addMes(MES_ATUAL,-k));
  const ritmo=S.movMetas.filter(x=>x.meta_id===m.id&&ms.includes(x.mes)).reduce((s,x)=>s+(x.tipo==='aporte'?x.valor:-x.valor),0)/3;
  if(ritmo<=0)return {txt:'Sem ritmo de aportes ainda',ok:false};
  const n=Math.ceil((alvo-g)/ritmo);
  return {txt:'No ritmo atual: '+mesAno(addMes(MES_ATUAL,n)),ok:true,n,ritmo};
}
const SETA_UP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
const SETA_DN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>';
function delta(atual,anterior,inverso){
  const d=Math.round((atual-anterior)*100)/100;
  const quando='que em '+nomeMes(addMes(S.mes,-1),true).toLowerCase();
  if(!anterior&&!atual)return '';
  if(d===0)return `<span class="dl eq" title="Igual ${quando}" aria-label="Igual ${quando}">=</span>`;
  const bom=inverso?d<0:d>0,txt=`${R(Math.abs(d))} a ${d>0?'mais':'menos'} ${quando}`;
  return `<span class="dl ${bom?'up':'down'}" title="${txt}" aria-label="${txt}">${d>0?SETA_UP:SETA_DN}</span>`;
}
/* ================= navegação ================= */
function navHTML(){
  const atras=S.recorrentes.filter(r=>r.ativa&&r.tipo==='gasto'&&statusConta(r,MES_ATUAL).k==='late').length;
  const gAtual=grupoDe(S.view).id;
  if(!S.abertos){S.abertos={};}
  if(S._gAnt!==gAtual){S.abertos[gAtual]=true;S._gAnt=gAtual}
  $('sideNav').innerHTML=GRUPOS.map(g=>{
    const badge=g.id==='g-plan'&&atras?`<span class="badge">${atras}</span>`:'';
    const multi=g.views.length>1,aberto=multi;
    const subs=multi?`<div class="nav-subs" ${aberto?'':'hidden'}>${g.views.map(id=>{const v=VIEWS.find(x=>x.id===id);const b=id==='contas'&&atras?`<span class="badge">${atras}</span>`:'';return `<button class="nav-sub" data-go="${id}" ${S.view===id?'aria-current="page"':''}>${esc(v.nome)}${b}</button>`}).join('')}</div>`:'';
    return `<div class="nav-g ${aberto?'aberto':''}"><button class="nav-btn" data-grupo-nav="${g.id}" ${gAtual===g.id&&!multi?'aria-current="page"':''}  ${gAtual===g.id&&multi?'data-ativo="1"':''}>${svg(g.ic)}<span>${g.nome}</span>${multi?'':badge}</button>${subs}</div>`}).join('');
  $('tabbar').innerHTML=TABS.map(id=>{const g=GRUPOS.find(x=>x.id===id);return `<button data-grupo="${id}" ${gAtual===id?'aria-current="page"':''}>${svg(g.ic)}<span>${g.curto}</span></button>`}).join('')
    +`<button data-act="mais" ${TABS.includes(gAtual)?'':'aria-current="page"'}>${svg('mais')}<span>Mais</span></button>`;
  $('privBtn').innerHTML=svg(S.priv?'olhoF':'olho')+`<span>${S.priv?'Mostrar valores':'Esconder valores'}</span>`;
  $('privTop').innerHTML=svg(S.priv?'olhoF':'olho');
  document.body.classList.toggle('priv',S.priv);
}
function ir(v){v=ALIAS[v]||v;if(!VIEWS.some(x=>x.id===v))v='geral';S.view=v;S.ultima[grupoDe(v).id]=v;if(location.hash!=='#'+v)history.replaceState(null,'','#'+v);render();window.scrollTo(0,0)}
function irGrupo(gid){const g=GRUPOS.find(x=>x.id===gid)||GRUPOS[0];ir(S.ultima[gid]||g.views[0])}
function subAbas(){const g=grupoDe(S.view);if(g.views.length<2)return '';
  return `<div class="subabas" role="tablist" aria-label="${esc(g.nome)}"><span class="sub-g">${svg(g.ic)}${esc(g.nome)}</span>${g.views.map(id=>{const v=VIEWS.find(x=>x.id===id);return `<button role="tab" data-go="${id}" aria-selected="${S.view===id}">${esc(v.nome)}</button>`}).join('')}</div>`}
function head(titulo,sub,botao,semMes){
  return `<div class="view-head"><div><h1>${titulo}</h1>${sub?`<p>${sub}</p>`:''}</div><div class="head-ctl">
    ${semMes?'':`<div class="mesnav"><button data-act="mes-1" aria-label="Mês anterior">‹</button><span>${nomeMes(S.mes)}</span><button data-act="mes+1" aria-label="Próximo mês">›</button></div>`}
    ${botao||''}</div></div>`;
}
const BTN=(act,txt,extra='')=>`<button class="btn novo" data-act="${act}" ${extra}>${svg('plus')}${txt}</button>`;
const vazio=(t,s,btn)=>`<div class="vazio"><b>${t}</b>${s}${btn?`<br><br>${btn}`:''}</div>`;
function avisoV(n){return vazio('Falta atualizar o banco',`Rode o arquivo schema-v${n}.sql no Supabase para liberar esta parte.`)}
function pbar(label,valor,extra,ratio,cls,vc){return `<div class="pbar"><div class="top"><span>${label}</span><b class="${vc||''}">${valor}${extra?`<small>${extra}</small>`:''}</b></div><div class="tr ${cls||''}"><i style="width:${Math.max(0,Math.min(100,ratio*100))}%"></i></div></div>`}
function clsLim(r){return r>1?'passou':r>=.8?'quase':''}
function linhaMini(i){
  const c=catVis(i);
  const entra=i.tipo==='entrada'||i.tipo==='resgate',transf=i.tipo==='aporte';
  const sinal=entra?'+ ':transf?'→ ':'− ';
  const cls=entra?'pos':transf?'ref':'neg';
  const extra=i.cartao_id?' · 💳 cartão':i.status==='previsto'?' · previsto':'';
  return `<div class="mini-row"><div class="em">${c.em}</div><div class="nm"><b>${esc(descVis(i))}</b><small>${dataBR(i.data)} · ${esc(nomeDe(i.autor)||'Automático')}${extra}</small></div><div class="vl ${cls}">${sinal}${R(i.valor)}</div></div>`;
}
/* ================= visão geral ================= */
/* central de alertas: só contas, faturas e parcelas que vencem nos próximos dias (ou já venceram e não foram pagas) */
const JANELA_ALERTA=7;
function alertas(){
  const al=[],fimD=new Date(hojeD);fimD.setDate(fimD.getDate()+JANELA_ALERTA);
  const fimISO=`${fimD.getFullYear()}-${pad(fimD.getMonth()+1)}-${pad(fimD.getDate())}`;
  const quando=d=>{const n=diasEntre(HOJE,d);return n<0?(n===-1?'venceu ontem':`venceu há ${-n} dias`):n===0?'vence hoje':n===1?'vence amanhã':`vence em ${n} dias (${dataBR(d)})`};
  /* contas, faturas (na data de pagamento prevista ou no vencimento) e parcelas de dívida do mês e do próximo */
  [MES_ATUAL,addMes(MES_ATUAL,1)].forEach(m=>Object.entries(eventosMes(m)).forEach(([d,es])=>es.forEach(e=>{
    if(e.feito||!e.sai||e.transf||d>fimISO)return;
    const v=e.pend!=null?e.pend:e.valor;if(!(v>0))return;
    al.push({k:d<HOJE?'no':'at',d,ic:e.em,t:`${esc(e.txt)} ${quando(d)} · <b>${R0(v)}</b>`,go:e.cartao?'cartoes':e.divida?'dividas':'contas'})})));
  /* o que ficou para trás em meses anteriores */
  S.cartoes.forEach(c=>[...new Set(S.card.filter(x=>x.cartao_id===c.id&&x.status==='comprometido'&&x.fatura_mes<MES_ATUAL).map(x=>x.fatura_mes))].forEach(fm=>{
    const f=infoFatura(c,fm);al.push({k:'no',d:f.venc,ic:'💳',t:`Fatura ${esc(c.nome)} (${esc(soMes(f.fech.slice(0,7)))}) ${quando(f.venc)} · <b>${R0(f.aberto)}</b>`,go:'cartoes'})}));
  S.itens.filter(i=>i.status==='previsto'&&i.mes<MES_ATUAL&&!i.cartao_id&&(i.tipo==='gasto'||i.tipo==='divida')).forEach(i=>
    al.push({k:'no',d:i.data,ic:catVis(i).em,t:`${esc(descVis(i))} ${quando(i.data)} · <b>${R0(i.valor)}</b>`,go:'contas'}));
  return al.sort((a,b)=>(a.k==='no'?0:1)-(b.k==='no'?0:1)||a.d.localeCompare(b.d));
}
/* linhas da projeção do mês: hoje → pendências → eventos futuros, com o saldo acumulado */
function linhasProjecao(sm){
  let saldo=sm.caixa;const tl=sm.itens.filter(e=>e.data>=HOJE).sort((a,b)=>a.data.localeCompare(b.data)||(a.entra?-1:1));
  const atrasado=sm.aPagar-tl.filter(e=>e.data===HOJE&&e.sai).reduce((s,e)=>s+e.valor,0);
  const linhas=[];if(atrasado>0.004){saldo-=atrasado;linhas.push({d:'',t:'Pendências vencidas',v:-atrasado,s:saldo,ic:'⚠️'})}
  tl.forEach(e=>{saldo+=e.entra?e.valor:-e.valor;linhas.push({d:e.data,t:e.txt,k:e.k,v:e.entra?e.valor:-e.valor,s:saldo,ic:e.ic||e.em})});
  return linhas;
}
function vGeral(){
  const sm=situacaoMes(),r0=resumo(MES_ATUAL),mc=soMes(MES_ATUAL),pat=patrimonioLiquido();
  const fimMes=MES_ATUAL+'-'+pad(ultimoDia(MES_ATUAL));
  const al=alertas();
  const retro=(hojeD.getMonth()===11||hojeD.getMonth()===0)?`<button class="banner-retro" data-act="ir-retro">✨ A retrospectiva de ${hojeD.getMonth()===0?ANO_ATUAL-1:ANO_ATUAL} está pronta <span>Ver relatório →</span></button>`:'';
  const lp=linhasProjecao(sm),proxP=lp.filter(l=>l.d).slice(0,3);
  const projHTML=`<button type="button" class="hero-side prev proj-card" data-act="proj-detalhe" aria-label="Ver a projeção detalhada do mês">
      <div class="pj-h"><small>Projeção de ${esc(mc)}</small><span class="pj-ver">Ver detalhes →</span></div>
      <div class="pj-res">
        <span>Hoje em caixa</span><b class="${cS(sm.caixa)}">${R0(sm.caixa)}</b>
        <span>Ainda entra</span><b class="${sm.entra?'pos':'zero'}">+ ${R0(sm.entra)}</b>
        <span>Ainda sai</span><b class="${sm.sai?'ref':'zero'}">− ${R0(sm.sai)}</b>
      </div>
      <div class="pj-fim"><span>Previsão para ${dataBR(fimMes)}</span><b class="${cS(sm.previsao)}">${R0(sm.previsao)}</b></div>
      ${proxP.length?`<div class="pj-prox"><small>Próximos</small>${proxP.map(l=>`<div><span>${dataBR(l.d)}</span><span class="tl-t">${l.ic?l.ic+' ':''}${esc(l.t)}</span><b class="${l.v>0?'pos':'neg'}">${l.v>0?'+':'−'}${R0(Math.abs(l.v))}</b></div>`).join('')}</div>`:'<div class="pj-prox"><small>Nada mais previsto até o fim do mês</small></div>'}
    </button>`;
  // mês selecionado (gráfico e categorias)
  const r=resumo(S.mes),pl=planejado(S.mes).gastos,pc=porCategoria(r.it);
  const dados=[...Array(6)].map((_,i)=>addMes(S.mes,i-5)).map(m=>({m,...resumo(m)}));
  const maxV=Math.max(1,...dados.map(d=>Math.max(d.entradas,d.gastos)));
  const chart=dados.map(d=>`<div class="cg ${d.m===S.mes?'atual':''}">
    <div class="cpair">${barraGrafico('e',d.entradas/maxV*100,d.m,'Entradas',d.entradas,[['Gastos do mês',d.gastos],['Saldo do mês',cent(d.entradas-d.gastos)]])}${barraGrafico('g',d.gastos/maxV*100,d.m,'Gastos',d.gastos,[['Entradas do mês',d.entradas],['Saldo do mês',cent(d.entradas-d.gastos)]])}</div><small>${nomeMes(d.m,true)}</small></div>`).join('');
  const cats=Object.entries(pc).sort((a,b)=>b[1]-a[1]).slice(0,6),maxC=Math.max(1,...cats.map(c=>c[1]));
  const catsHTML=cats.length?cats.map(([id,v])=>{const c=CAT[id]||{em:'•',nome:id};const lim=Number(pl[id])||0;const ratio=lim?v/lim:v/maxC;
    return pbar(`${c.em} ${esc(c.nome)}`,R(v),lim?RF('de '+R0(lim)):'',ratio,lim?clsLim(ratio):'','neg')}).join(''):vazio('Nenhum gasto ainda','Lancem o primeiro gasto do mês para ver para onde o dinheiro está indo.',BTN('novo','Novo gasto','data-tipo="gasto"'));
  const prox=proximosEventos(45).slice(0,5);
  const proxHTML=prox.length?`<div class="mini">${prox.map(e=>`<div class="mini-row"><div class="em">${e.ic||e.em}</div><div class="nm"><b>${esc(e.txt)}</b><small>${e.data===HOJE?'Hoje':diasEntre(HOJE,e.data)===1?'Amanhã':dataBR(e.data)} · ${esc(e.k)}</small>${acaoEvento(e,'btn xs ev-acao')}</div><div class="vl ${e.entra?'pos':'neg'}">${e.entra?'+ ':'− '}${R(e.pend!=null?e.pend:e.valor)}</div></div>`).join('')}</div>`
    :vazio('Nada pela frente','Cadastrem as contas que se repetem (aluguel, internet, salário) para o site avisar antes de vencer.',BTN('cr-nova','Cadastrar conta'));
  const ult=[...r.ef].sort((a,b)=>b.data.localeCompare(a.data)||b.criadoEm-a.criadoEm).slice(0,5);
  const aCartaoMes=soma(r0.ef.filter(i=>i.tipo==='gasto'&&i.cartao_id&&i.status==='comprometido'));
  /* det = qual detalhe abre ao tocar no número (de onde ele vem) */
  const kpi=(k,v,cls,sub,det)=>`<div class="kpi${det?' kpi-click':''}"${det?` data-act="kpi-det" data-k="${det}" role="button" tabindex="0" title="Ver de onde vem este número"`:''}><small>${k}</small><b class="${cls}">${v}</b>${sub?`<span>${sub}</span>`:''}</div>`;
  return head('Visão geral','A situação de vocês e o que precisam saber agora.',BTN('novo-global','Novo'),true)+retro+`
  <div class="hero hero-v3">
    <div class="hv3-main">
      <div class="kpis-top">
        ${kpi(`Em caixa ${selo(sm.caixa,{inl:1})}`,R(sm.caixa),cS(sm.caixa)+' kpi-xl',`<button class="lnk" data-act="ajustar-caixa">Ajustar saldo</button>`,'caixa')}
        ${kpi('Ainda a pagar',R0(sm.compromissos),sm.compromissos>0?'ref':'zero','tudo que ainda vai sair até o fim de '+esc(mc),'aPagar')}
        ${kpi(`Patrimônio líquido ${selo(pat.liquido,{inl:1})}`,R0(pat.liquido),cS(pat.liquido),'caixa + metas + investimentos − dívidas','patrimonio')}
      </div>
      <div class="kpis-bot">
        ${kpi('Entradas',R0(r0.entradas),r0.entradas>0?'pos':'zero','recebidas em '+esc(mc)+` · <button class="lnk" data-act="renda-media">${S.rendaMedia>0?'renda média '+R0(S.rendaMedia):'definir renda média'}</button>`,'entradas')}
        ${kpi('Gastos realizados',R0(r0.gastos),r0.gastos>0?'neg':'zero','em '+esc(mc)+(aCartaoMes>0?` · <span class="ref">${R0(aCartaoMes)}</span> no cartão a pagar`:''),'gastos')}
        ${kpi('Vence hoje / em atraso',R0(sm.aPagar),sm.aPagar>0?'neg':'zero',sm.aPagar>0?'pede pagamento agora':'nada vencido','vence')}
      </div>
      <p class="hv3-nota hv3-dica">Toque em um número para ver de onde ele vem · <button class="lnk" data-act="glossario">o que significa cada termo?</button></p>
      ${sm.sugestaoMetas>0?`<p class="hv3-nota">🎯 Sugestão para as metas neste mês: <b class="ref">${R0(sm.sugestaoMetas)}</b>. Só sai do caixa quando vocês registrarem "Guardar na meta".</p>`:''}
    </div>
    ${projHTML}
  </div>
  <div class="panel alertas-p"><div class="panel-head"><div><h2>Central de alertas</h2><p class="sub">${al.length?`${plural(al.length,'conta ou fatura','contas e faturas')} perto do pagamento`:`Nada vencendo nos próximos ${JANELA_ALERTA} dias`}</p></div></div>
    ${al.length?`<div class="avisos">${al.slice(0,10).map(a=>`<div class="aviso-i ${a.k}"><span>${a.ic} ${a.t}</span><button class="lnk" data-go="${a.go}">Ver →</button></div>`).join('')}</div>`:`<div class="ck ok">✅ Nenhuma conta ou fatura vence nos próximos ${JANELA_ALERTA} dias</div>`}
  </div>
  <div class="grid g2">
    <div class="panel"><div class="panel-head"><div><h2>Próximos compromissos</h2><p class="sub">O que vence e o que vai entrar</p></div><button class="lnk" data-go="calendario">Ver calendário →</button></div>${proxHTML}</div>
    <div class="panel"><div class="panel-head"><div><h2>Para onde foi</h2><p class="sub">${esc(nomeMes(S.mes))}, comparado ao orçamento</p></div><button class="lnk" data-go="orcamento">Orçamento →</button></div>${catsHTML}</div>
  </div>
  <div class="grid g21">
    <div class="panel"><div class="panel-head"><div><h2>Entradas e gastos</h2><p class="sub">Seis meses até ${esc(soMes(S.mes))}</p></div>
      <div class="mesnav"><button data-act="mes-1" aria-label="Mês anterior">‹</button><span>${nomeMes(S.mes)}</span><button data-act="mes+1" aria-label="Próximo mês">›</button></div></div>
      <div class="chart">${chart}</div>
      <div class="legend"><span><i style="background:#16f27a"></i>Entradas</span><span><i style="background:var(--neg)"></i>Gastos</span></div></div>
    <div class="panel"><div class="panel-head"><div><h2>Últimos lançamentos</h2><p class="sub">${esc(nomeMes(S.mes))}</p></div><button class="lnk" data-go="gastos">Ver todos →</button></div>${ult.length?`<div class="mini">${ult.map(linhaMini).join('')}</div>`:vazio('Mês vazio','Nada lançado em '+esc(soMes(S.mes))+'.')}</div>
  </div>`;
}
/* ================= transferências ================= */
function vTransf(){
  const it=doMes(S.mes).filter(i=>(i.tipo==='aporte'||i.tipo==='resgate'||i.tipo==='divida')&&i.status!=='cancelado').sort((a,b)=>b.data.localeCompare(a.data)||b.criadoEm-a.criadoEm);
  const dest=i=>i.meta_id?((S.metas.find(m=>m.id===i.meta_id)||{}).reserva?'🛟 Reserva':'🎯 '+((S.metas.find(m=>m.id===i.meta_id)||{nome:'Meta'}).nome)):i.investimento_id?'📈 '+(()=>{const x=S.invest.find(v=>v.id===i.investimento_id);return x?(x.produto||x.nome||(INVT[x.tipo]||{nome:'Investimento'}).nome):'Investimento'})():i.divida_id?'🏦 Dívida':'📈 Investimento';
  const r=resumo(S.mes),am=soma(it.filter(i=>i.tipo==='divida'));
  const head0=head('Transferências','Dinheiro que muda de lugar: metas, reserva, investimentos e dívidas. Não é gasto nem entrada.',BTN('n-transf','Nova transferência'));
  if(!it.length)return head0+`<div class="panel">${vazio('Nenhuma transferência em '+esc(soMes(S.mes)),'Quando vocês guardarem em uma meta, investirem, resgatarem ou pagarem uma dívida, aparece aqui. Isso não conta como gasto.',BTN('n-transf','Nova transferência'))}</div>`;
  return head0+`
  <div class="tiles">
    <div class="tile"><div class="k">Para metas e reserva</div><div class="v ${cS(r.guardado)}">${R(r.guardado)}</div><div class="d">guardado menos resgatado</div></div>
    <div class="tile"><div class="k">Para investimentos</div><div class="v ${cS(r.investido)}">${R(r.investido)}</div><div class="d">aportes menos resgates</div></div>
    <div class="tile"><div class="k">Dívidas amortizadas</div><div class="v ${am>0?'ref':'zero'}">${R(am)}</div><div class="d">reduz o saldo devedor</div></div>
    <div class="tile"><div class="k">Movimentações</div><div class="v">${it.length}</div><div class="d">em ${esc(soMes(S.mes))}</div></div>
  </div>
  <div class="panel"><div class="tbl-wrap"><table><thead><tr><th>Data</th><th>Movimento</th><th>Origem → destino</th><th class="r">Valor</th><th class="r"></th></tr></thead><tbody>
  ${it.map(i=>{const saiCaixa=i.tipo!=='resgate';return `<tr class="row"><td class="mut">${dataBR(i.data)}</td><td class="desc">${esc(i.descricao||'')}${i.status==='previsto'?' <span class="badge-s">previsto</span>':''}</td>
    <td class="wrap">${saiCaixa?'💵 Caixa → '+esc(dest(i)):esc(dest(i))+' → 💵 Caixa'}</td><td class="r vl ${saiCaixa?'ref':'pos'}">${saiCaixa?'→ ':'+ '}${R(i.valor)}</td>
    <td class="r"><span class="acts"><button class="ic" data-act="editar" data-id="${i.id}" aria-label="Editar">${svg('edit')}</button><button class="ic del" data-act="apagar" data-id="${i.id}" aria-label="Apagar">${svg('del')}</button></span></td></tr>`}).join('')}
  </tbody></table></div><p class="nota">Apagar uma transferência desfaz o efeito: o dinheiro volta para a origem.</p></div>`;
}
/* ================= calendário ================= */
/* botão de ação de um evento do mês: Recebi, Paguei, Pagar fatura ou Pagar parcela */
function acaoEvento(e,cls='btn sm'){
  if(e.feito||e.transf)return '';
  if(e.cartao)return `<button type="button" class="${cls}" data-act="fatura-pagar" data-id="${e.cartao}" data-fm="${e.fm}">Pagar fatura</button>`;
  if(e.divida)return `<button type="button" class="${cls}" data-act="div-pagar" data-id="${e.divida}">Pagar parcela</button>`;
  if(!e.id)return '';
  return `<button type="button" class="${cls}" data-act="oc-confirmar" data-id="${e.id}">${e.entra?'Recebi':'Paguei'}</button>`;
}
function eventosMes(m){
  const ev={};const add=(d,e)=>{(ev[d]=ev[d]||[]).push(e)};
  // lançamentos fora do cartão: realizados e previstos
  S.itens.filter(i=>i.mes===m&&!i.cartao_id&&i.status!=='cancelado').forEach(i=>{
    const c=catVis(i),feito=i.status==='pago',entra=i.tipo==='entrada'||i.tipo==='resgate',sai=!entra;
    const reg=i.recorrente_id&&S.recorrentes.find(r=>r.id===i.recorrente_id);
    const tipoTxt={gasto:'Gasto'+(i.meio?' · '+(NOME_MEIO[i.meio]||i.meio):''),entrada:'Entrada',aporte:i.meta_id?'Transferência · guardar na meta':'Investimento · aporte',resgate:i.meta_id?'Transferência · resgate da meta':'Investimento · resgate',divida:'Pagamento de dívida'}[i.tipo]||'';
    add(i.data,{em:c.em,txt:descVis(i),valor:i.valor,entra,sai,feito,id:i.id,transf:i.tipo==='aporte'||i.tipo==='resgate',
      k:tipoTxt+(feito?'':entra?' · previsto':' · a pagar'),ic:reg?(reg.auto?'🔁':'🏠'):(!feito?'📌':'')});
  });
  // faturas no vencimento
  S.cartoes.forEach(c=>{const f=infoFatura(c,m);if(!f.it.length)return;const pp=f.k==='paga'?null:pagPrevisto(c,m);
    add(pp||f.venc,{em:'💳',txt:'Fatura '+c.nome+' ('+soMes(f.fech.slice(0,7))+')',valor:f.total,pend:f.aberto+f.prev,sai:true,feito:f.k==='paga',ic:'💳',cartao:c.id,fm:m,
      k:'Pagamento de fatura · '+(f.k==='paga'?'paga':f.k==='atrasada'?'atrasada':f.k==='fechada'?'fechada, a pagar':'aberta, fecha '+dataBR(f.fech))+(pp?' · pagamento previsto, vence '+dataBR(f.venc):'')})});
  // parcela de dívida ainda não paga
  S.dividas.forEach(d=>{const inf=infoDivida(d);if(inf.rest<=0||S.pagDiv.some(p=>p.divida_id===d.id&&p.mes===m)||m<MES_ATUAL)return;if(difMes(MES_ATUAL,m)>=inf.rest)return;
    add(diaNoMes(m,d.dia),{em:'🏦',txt:'Parcela '+d.nome,valor:d.parcela,sai:true,divida:d.id,k:'Pagamento de dívida · a pagar',ic:'🏦'})});
  // regras que ainda não geraram ocorrência neste mês (meses mais distantes)
  if(m>=MES_ATUAL)S.recorrentes.filter(r=>r.ativa&&r.inicio<=m&&!(r.fim&&m>r.fim)&&!ocorrencia(r,m)).forEach(r=>{const c=CAT[r.categoria]||{em:'🔁'};
    add(diaNoMes(m,r.dia),{em:c.em,txt:r.descricao,valor:r.valor,entra:r.tipo==='entrada',sai:r.tipo==='gasto',k:r.tipo==='entrada'?'Entrada prevista':(r.cartao_id?'Compra recorrente no cartão · prevista':'Conta prevista'),ic:r.auto?'🔁':'🏠'})});
  return ev;
}
function proximosEventos(n){
  const fim=new Date(hojeD);fim.setDate(fim.getDate()+n);const fimISO=`${fim.getFullYear()}-${pad(fim.getMonth()+1)}-${pad(fim.getDate())}`;
  const lst=[];[MES_ATUAL,addMes(MES_ATUAL,1)].forEach(m=>{const ev=eventosMes(m);Object.entries(ev).forEach(([d,es])=>{if(d>=HOJE&&d<=fimISO)es.filter(e=>!e.feito).forEach(e=>lst.push({...e,data:d}))})});
  return lst.sort((a,b)=>a.data.localeCompare(b.data));
}
function vCalendario(){
  const m=S.mes,[y,mm]=m.split('-').map(Number),first=new Date(y,mm-1,1).getDay(),nd=ultimoDia(m);
  if(!S.calDia||S.calDia.slice(0,7)!==m)S.calDia=m===MES_ATUAL?HOJE:m+'-01';
  const ev=eventosMes(m);
  let cells=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d=>`<div class="wd">${d}</div>`).join('');
  for(let i=0;i<first;i++)cells+='<div class="d vz"></div>';
  for(let d=1;d<=nd;d++){
    const iso=`${m}-${pad(d)}`,es=ev[iso]||[];
    const ent=es.filter(e=>e.entra).reduce((s,e)=>s+e.valor,0),sai=es.filter(e=>e.sai&&e.feito).reduce((s,e)=>s+e.valor,0),fut=es.filter(e=>e.sai&&!e.feito).reduce((s,e)=>s+(e.pend!=null?e.pend:e.valor),0);
    const ics=[...new Set(es.filter(e=>e.ic).map(e=>e.ic))].join('');
    cells+=`<button class="d ${iso===HOJE?'hoje':''} ${iso===S.calDia?'sel':''}" data-act="cal-dia" data-d="${iso}" aria-label="Dia ${d}"><span class="n">${d}</span>${ent?`<span class="a pos"><span class="l">+${K(ent)}</span><span class="s">+${KS(ent)}</span></span>`:''}${sai?`<span class="a neg"><span class="l">−${K(sai)}</span><span class="s">−${KS(sai)}</span></span>`:''}${fut?`<span class="a ref"><span class="l">−${K(fut)}</span><span class="s">−${KS(fut)}</span></span>`:''}${ics?`<span class="ics">${ics}</span>`:''}</button>`;
  }
  const sel=ev[S.calDia]||[];
  const tot=Object.values(ev).flat();
  const entM=tot.filter(e=>e.entra).reduce((s,e)=>s+e.valor,0),saiM=tot.filter(e=>e.sai).reduce((s,e)=>s+e.valor,0);
  const pendM=tot.filter(e=>!e.feito&&e.sai).reduce((s,e)=>s+(e.pend!=null?e.pend:e.valor),0);
  const entRec=tot.filter(e=>e.entra&&e.feito).reduce((s,e)=>s+e.valor,0);
  return head('Calendário','Tudo que entra e sai, dia a dia.',BTN('novo','Novo lançamento','data-tipo="gasto"'))+`
  <div class="tiles">
    <div class="tile"><div class="k">Entradas previstas no mês</div><div class="v pos">${R(entM)}</div><div class="d">${R0(entRec)} recebido + ${R0(entM-entRec)} previsto</div></div>
    <div class="tile"><div class="k">${S.mes<MES_ATUAL?'Saídas no mês':'Saídas previstas no mês'}</div><div class="v neg">${R(saiM)}</div><div class="d">${S.mes<MES_ATUAL?'gastos, faturas e contas':'já pagas + ainda por pagar'}</div></div>
    <div class="tile"><div class="k">Ainda a pagar</div><div class="v ref">${R(pendM)}</div><div class="d">contas, faturas e parcelas</div></div>
    <div class="tile">${selo(entM-saiM)}<div class="k">${S.mes<MES_ATUAL?'Resultado do mês':'Resultado projetado do mês'}</div><div class="v ${cS(entM-saiM)}">${R(entM-saiM)}</div><div class="d">entradas menos saídas ${S.mes<MES_ATUAL?'do mês':'previstas'} (não é o caixa)</div></div>
  </div>
  <div class="cal-wrap">
    <div class="panel"><div class="cal">${cells}</div>
      <div class="cal-leg"><span><i class="lg pos"></i>Entrada</span><span><i class="lg neg"></i>Saída</span><span><i class="lg ref"></i>Compromisso futuro</span><span class="sep"></span><span>🏠 conta</span><span>💳 fatura</span><span>🏦 dívida</span><span>🔁 automática</span><span>📌 agendado</span></div></div>
    <div class="cal-panel"><h2 class="cond" style="margin:0 0 4px;font-size:22px">${diaSemana(S.calDia)}</h2><p class="sub mut" style="margin:0 0 10px;font-size:13.5px">${plural(sel.length,'item','itens')}</p>
      ${sel.length?sel.map(e=>`<div class="ev"><div class="em">${e.em}</div><div class="nm"><b>${esc(e.txt)}</b><small>${esc(e.k)}</small>${acaoEvento(e,'btn sm ev-acao')}</div><div class="vl ${e.entra?'pos':e.feito?'neg':'ref'}">${e.entra?'+ ':''}${R(e.pend!=null&&!e.feito?e.pend:e.valor)}</div></div>`).join(''):vazio('Dia livre','Nada lançado ou previsto.')}
      <button class="btn sm ghost" style="margin-top:12px;width:100%;justify-content:center" data-act="novo" data-tipo="gasto" data-data="${S.calDia}">${svg('plus')}Lançar neste dia</button>
    </div>
  </div>`;
}

/* ================= gastos e entradas ================= */
function tabela(itens,tipo){
  if(!itens.length)return vazio('Nada por aqui',`${tipo==='gasto'?'Nenhum gasto':'Nenhuma entrada'} ${S.fCat||S.fBusca?'com esse filtro. Limpem a busca ou a categoria para ver tudo.':'neste mês. Lancem agora para o resumo do mês começar a ser montado.'}`,S.fCat||S.fBusca?'':BTN('novo',tipo==='gasto'?'Novo gasto':'Nova entrada',`data-tipo="${tipo}"`));
  return `<div class="tbl-wrap"><table><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th class="hide-sm hide-md">Quem lançou</th><th class="r">Valor</th><th class="r"></th></tr></thead><tbody>
  ${itens.map(i=>{const c=catVis(i);const cc=i.cartao_id&&S.cartoes.find(x=>x.id===i.cartao_id);
    const tags=(cc?`<span class="badge-s cc" style="--cc:${esc(cc.cor)}">💳 ${esc(cc.nome)}${i.parcelas>1?' '+i.parcela+'/'+i.parcelas:''}${i.fatura_mes?' · fatura de '+nomeMes(refDoItem(i),true).toLowerCase():''}</span>${i.status==='pago'?'<span class="badge-s">paga</span>':'<span class="badge-s ref">a pagar</span>'}`:'')+(i.recorrente_id?`<span class="badge-s">${(S.recorrentes.find(r=>r.id===i.recorrente_id)||{}).auto?'🔁 automática':'🏠 conta'}${i.editado?' · valor ajustado':''}</span>`:'')+(i.divida_id?'<span class="badge-s">🏦 dívida</span>':'')+(ehLivre(i)&&!outroLivre(i)?'<span class="badge-s">💸 pessoal</span>':'')+(i.tags||[]).map(t=>`<span class="badge-s tg">#${esc(t)}</span>`).join('')+(i.nota?`<span class="badge-s" title="${esc(i.nota)}">📝</span>`:'')+(i.anexo?`<button class="badge-s lnk" data-act="ver-anexo" data-path="${esc(i.anexo)}" title="Ver anexo">📎</button>`:'');
    const meuOuNaoLivre=!outroLivre(i);
    return `<tr class="row"><td class="mut">${dataBR(i.data)}</td><td class="desc">${esc(descVis(i))}${tags}</td><td class="wrap"><span class="cat">${c.em} ${esc(c.nome)}</span></td><td class="hide-sm hide-md mut">${esc(nomeDe(i.autor)||'Automático')}</td><td class="r vl ${tipo==='entrada'?'pos':'neg'}">${R(i.valor)}</td>
    <td class="r"><span class="acts">${meuOuNaoLivre?`${(i.tipo==='gasto'||i.tipo==='entrada')&&!i.recorrente_id&&!(i.parcelas>1)?`<button class="ic" data-act="duplicar" data-id="${i.id}" aria-label="Duplicar para hoje" title="Duplicar para hoje"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg></button>`:''}<button class="ic" data-act="editar" data-id="${i.id}" aria-label="Editar">${svg('edit')}</button><button class="ic del" data-act="apagar" data-id="${i.id}" aria-label="Apagar">${svg('del')}</button>`:''}</span></td></tr>`}).join('')}
  </tbody></table></div>`;
}
function filtrar(tipo){
  const b=S.fBusca.trim().toLowerCase();
  return doMes(S.mes).filter(i=>i.tipo===tipo&&efetivo(i)&&(!S.fCat||i.categoria===S.fCat)&&(!S.fTag||(i.tags||[]).includes(S.fTag))&&(!b||descVis(i).toLowerCase().includes(b)))
    .sort(S.fOrd==='maior'?(a,b)=>b.valor-a.valor||b.data.localeCompare(a.data)
      :S.fOrd==='menor'?(a,b)=>a.valor-b.valor||b.data.localeCompare(a.data)
      :S.fOrd==='antigo'?(a,b)=>a.data.localeCompare(b.data)||a.criadoEm-b.criadoEm
      :(a,b)=>b.data.localeCompare(a.data)||b.criadoEm-a.criadoEm);
}
const ORDENS=[['recente','Mais recente → mais antigo'],['antigo','Mais antigo → mais recente'],['maior','Maior valor → menor valor'],['menor','Menor valor → maior valor']];
function toolbar(cats){
  return `<div class="toolbar"><input class="field grow" id="fBusca" placeholder="Buscar pela descrição" value="${esc(S.fBusca)}">
    <select class="field" id="fCat"><option value="">Todas as categorias</option>${cats.map(c=>`<option value="${c.id}" ${S.fCat===c.id?'selected':''}>${c.em} ${esc(c.nome)}</option>`).join('')}</select>
    <select class="field" id="fOrd" aria-label="Ordenar">${ORDENS.map(([v,t])=>`<option value="${v}" ${S.fOrd===v?'selected':''}>${t}</option>`).join('')}</select>${(()=>{const ts=[...new Set(doMes(S.mes).flatMap(i=>i.tags||[]))].sort();return ts.length?`<select class="field" id="fTag"><option value="">Todas as tags</option>${ts.map(t=>`<option value="${esc(t)}" ${S.fTag===t?'selected':''}>#${esc(t)}</option>`).join('')}</select>`:''})()}</div>`;
}
function vGastos(){
  const r=resumo(S.mes),ant=resumo(addMes(S.mes,-1)),lista=filtrar('gasto'),pc=porCategoria(r.it);
  const dias=S.mes===MES_ATUAL?hojeD.getDate():ultimoDia(S.mes);
  const gs=r.ef.filter(i=>i.tipo==='gasto'),maior=[...gs].sort((a,b)=>b.valor-a.valor)[0];
  const noCartao=soma(gs.filter(i=>i.cartao_id));
  /* despesa já feita no cartão, mas a fatura ainda não foi paga: virou gasto, o caixa não mudou */
  const aPagarIt=gs.filter(i=>i.cartao_id&&i.status==='comprometido'),aPagar=soma(aPagarIt),jaSaiu=r.gastos-aPagar;
  const datasPag=[...new Set(aPagarIt.map(i=>{const cd=S.cartoes.find(c=>c.id===i.cartao_id);return cd&&i.fatura_mes?(pagPrevisto(cd,i.fatura_mes)||vencFatura(cd,i.fatura_mes)):''}).filter(Boolean))].sort();
  const cats=Object.entries(pc).sort((a,b)=>b[1]-a[1]);
  return head('Gastos','Tudo que vocês gastaram no mês, independentemente da forma de pagamento.',BTN('novo','Novo gasto','data-tipo="gasto"'))+`
  <div class="tiles">
    <div class="tile"><div class="k">Total gasto</div><div class="vrow"><div class="v neg">${R(r.gastos)}</div>${delta(r.gastos,ant.gastos,true)}</div><div class="d">${plural(gs.length,'lançamento','lançamentos')}${aPagar>0?`<br>${R0(jaSaiu)} já saíram do caixa · <span class="ref">${R0(aPagar)} a pagar</span>`:''}</div></div>
    <div class="tile"><div class="k">Orçamento usado</div>${(()=>{const tp=CATS_G.reduce((s,c)=>s+(Number(planejado(S.mes).gastos[c.id])||0),0);return tp?`<div class="v ${r.gastos>tp?'neg':''}">${Math.round(r.gastos/tp*100)}%</div><div class="d"><span class="neg">${R0(r.gastos)}</span> de ${RF(R0(tp))}</div>`:`<div class="v zero">—</div><div class="d"><button class="lnk" data-go="orcamento">Definir orçamento →</button></div>`})()}</div>
    <div class="tile"><div class="k">Maior gasto</div><div class="v neg">${maior?R(maior.valor):'—'}</div><div class="d">${maior?esc(descVis(maior)):'Nenhum gasto'}</div></div>
    <div class="tile"><div class="k">A ser pago no cartão</div><div class="v ${aPagar>0?'ref':'zero'}">${R(aPagar)}</div><div class="d">${aPagar>0?`já é gasto, mas o caixa só muda ao pagar a fatura${datasPag.length?' · pagamento '+(datasPag.length>1?'a partir de ':'previsto em ')+dataBR(datasPag[0]):''}`:`nada pendente · ${R0(noCartao)} no cartão, tudo pago`}</div></div>
  </div>
  <div class="grid g21">
    <div class="panel"><h2>Lançamentos</h2><p class="sub">Toque no lápis para corrigir um lançamento.</p>${toolbar(CATS_G)}${tabela(lista,'gasto')}</div>
    <div class="panel"><div class="panel-head"><div><h2>Por categoria</h2><p class="sub">Participação no total</p></div><button class="lnk" data-go="orcamento">Orçamento</button></div>
      ${cats.length?cats.map(([id,v])=>{const c=CAT[id]||{em:'•',nome:id};const p=r.gastos?v/r.gastos:0;return pbar(`${c.em} ${esc(c.nome)}`,R(v),Math.round(p*100)+'%',p,'','neg')}).join(''):vazio('Sem gastos','Nada lançado no mês.')}
    </div>
  </div>`;
}
/* entradas que ainda não caíram: as do mês (automáticas, agendadas e previstas) e, no mês atual, as atrasadas de meses anteriores */
function previstasEntrar(){
  const out=[];
  Object.entries(eventosMes(S.mes)).forEach(([d,es])=>es.forEach(e=>{if(e.entra&&!e.feito&&!e.transf)out.push({...e,data:d})}));
  if(S.mes===MES_ATUAL)S.itens.filter(i=>i.tipo==='entrada'&&i.status==='previsto'&&i.mes<MES_ATUAL).forEach(i=>out.push({id:i.id,txt:descVis(i),valor:i.valor,data:i.data,em:catVis(i).em,ic:'📌',k:'Entrada de '+nomeMes(i.mes,true).toLowerCase()+' que ainda não foi confirmada',entra:true}));
  return out.sort((a,b)=>a.data.localeCompare(b.data));
}
function vEntradas(){
  const r=resumo(S.mes),lista=filtrar('entrada'),ent=r.ef.filter(i=>i.tipo==='entrada');
  const porFonte={},porPessoa={};
  ent.forEach(i=>{porFonte[i.categoria]=(porFonte[i.categoria]||0)+i.valor;const k=i.autor||'auto';porPessoa[k]=(porPessoa[k]||0)+i.valor});
  const ant=resumo(addMes(S.mes,-1)).entradas;
  const med=[1,2,3].map(k=>resumo(addMes(S.mes,-k)).entradas).reduce((a,b)=>a+b,0)/3;
  return head('Entradas','Todo dinheiro que entrou no caixa.',BTN('novo','Nova entrada','data-tipo="entrada"'))+`
  <div class="tiles">
    <div class="tile"><div class="k">Recebido no mês</div><div class="v pos">${R(r.entradas)}</div><div class="d">${plural(ent.length,'lançamento','lançamentos')}</div></div>
    <div class="tile"><div class="k">Ainda previsto</div>${(()=>{const p=previstasEntrar().reduce((s,e)=>s+e.valor,0);return `<div class="v ${p>0?'pos':'zero'}">${R(p)}</div><div class="d">automáticas e agendadas</div>`})()}</div>
    <div class="tile"><div class="k">Média mensal</div><div class="v pos">${R(med)}</div><div class="d">três meses anteriores</div></div>
    <div class="tile"><div class="k">Variação</div>${ant>0?(()=>{const v=Math.round((r.entradas-ant)/ant*100);return `<div class="v ${v>0?'pos':v<0?'neg':'zero'}">${v>0?'+':''}${v}%</div><div class="d">em relação a ${esc(nomeMes(addMes(S.mes,-1),true).toLowerCase())}</div>`})():`<div class="v zero">—</div><div class="d">sem mês anterior</div>`}</div>
  </div>
  ${(()=>{const pe=previstasEntrar(),tp=pe.reduce((s,e)=>s+e.valor,0);
    const cartaoE=e=>{const d=diasEntre(HOJE,e.data),late=d<0,tag=late?`<span class="tag late">Esperada há ${-d} ${-d===1?'dia':'dias'}</span>`:d===0?'<span class="tag soon">Prevista para hoje</span>':`<span class="tag idle">Prevista dia ${Number(e.data.slice(8,10))}</span>`;
      return `<div class="ct-card ent ${late?'late':''}"><span class="ct-catl">${e.em||'💰'} A receber</span><div class="ct-top"><span class="ct-dia">${dataBR(e.data)}</span>${tag}</div>
        <b class="ct-nome">${esc(e.txt)}</b><div class="ct-v pos">+ ${R(e.valor)}</div>
        <div class="ct-meta"><span class="badge-s">${e.ic==='🔁'?'🔁 automática':e.ic==='🏠'?'✋ confirma':'📌 agendada'}</span></div>
        <div class="ct-acts">${e.id?`<button class="btn sm" data-act="oc-confirmar" data-id="${e.id}">Recebi</button>`:'<span class="mut" style="font-size:12.5px">confirma quando o mês chegar</span>'}</div></div>`};
    return `<div class="panel" style="margin-bottom:16px"><div class="panel-head"><div><h2>A receber</h2><p class="sub">Previsto para entrar em ${esc(nomeMes(S.mes))}. Quando o dinheiro cair, toque em “Recebi”.</p></div>${pe.length?`<b class="pos ent-tot">+ ${R0(tp)}</b>`:''}</div>
      ${pe.length?`<div class="ct-grid ct-full">${pe.map(cartaoE).join('')}</div>`:'<p class="nota" style="margin:6px 0 0">Nenhuma entrada prevista para este mês.</p>'}</div>`})()}
  <div class="grid g21">
    <div class="panel"><h2>Lançamentos</h2><p class="sub">Salários, rendas extras e outros valores.</p>${toolbar(CATS_E)}${tabela(lista,'entrada')}</div>
    <div class="panel"><h2>De onde veio</h2><p class="sub">Por tipo de entrada</p>
      ${Object.keys(porFonte).length?Object.entries(porFonte).sort((a,b)=>b[1]-a[1]).map(([id,v])=>{const c=CAT[id]||{em:'•',nome:id};return pbar(`${c.em} ${esc(c.nome)}`,R(v),Math.round(v/r.entradas*100)+'%',v/r.entradas,'','pos')}).join(''):vazio('Sem entradas','Nada lançado no mês.')}
      <h2 style="margin-top:22px">Quem trouxe</h2><p class="sub">Pela pessoa que lançou</p>
      ${Object.keys(porPessoa).length?Object.entries(porPessoa).sort((a,b)=>b[1]-a[1]).map(([k,v])=>pbar(esc(k==='auto'?'Automático':nomeDe(k)),R(v),Math.round(v/r.entradas*100)+'%',v/r.entradas,'','pos')).join(''):vazio('Sem entradas','Nada lançado no mês.')}
    </div>
  </div>`;
}
/* ================= cartões ================= */
function vCartoes(){
  if(!S.temV4)return head('Cartões','')+`<div class="panel">${avisoV(4)}</div>`;
  if(!S.cartoes.length)return head('Cartões','Faturas, limites e compras parceladas.','',true)+`<div class="panel">${vazio('Nenhum cartão cadastrado','Cadastrem os cartões para lançar compras no crédito e acompanhar as faturas.',BTN('cartao-novo','Cadastrar cartão'))}</div>`;
  const med=media(),fm=S.mes;
  const prox=[0,1,2,3,4,5].map(k=>addMes(MES_ATUAL,k)).map(m=>({m,v:totalRef(m),a:totalRef(m,true)}));
  const maxP=Math.max(1,...prox.map(p=>p.v));
  const totalUsado=S.cartoes.reduce((s,c)=>s+usadoCartao(c.id),0),totalLim=S.cartoes.reduce((s,c)=>s+c.limite,0);
  const prox1=totalRef(addMes(MES_ATUAL,1)),atual=totalRef(MES_ATUAL),atualAb=totalRef(MES_ATUAL,true);
  const vencDe=ref=>{const v=[...new Set(S.cartoes.map(c=>faturaRef(c,ref)).filter(f=>f.it.length).map(f=>f.venc))].sort().map(dataBR);return v.length>1?'vencimentos: '+v.join(' e '):v.length?'vence '+v[0]:''};
  const pctRenda=med.ent>0?Math.round(totalRef(addMes(MES_ATUAL,1),true)/med.ent*100):0;
  const pf=S.card.filter(x=>x.status==='comprometido'&&refDoItem(x)>addMes(MES_ATUAL,1)).reduce((s,x)=>s+x.valor,0);
  const grupos={};S.card.filter(x=>x.compra_id&&x.parcelas>1).forEach(x=>{(grupos[x.compra_id]=grupos[x.compra_id]||[]).push(x)});
  const parc=Object.values(grupos).map(g=>{g.sort((a,b)=>(a.parcela||0)-(b.parcela||0));const rest=g.filter(x=>x.status==='comprometido');if(!rest.length)return null;const x=g[0],cc=S.cartoes.find(c=>c.id===x.cartao_id);
    return {nome:x.descricao.replace(/\s\(\d+\/\d+\)$/,''),parcela:x.valor,rest:rest.length,de:x.parcelas,fim:refDoItem(g[g.length-1])||g[g.length-1].fatura_mes,cc,total:soma(rest),compra:soma(g)}}).filter(Boolean).sort((a,b)=>b.total-a.total);
  const TAG={aberta:['idle','Aberta'],fechada:['soon','Fechada · a pagar'],atrasada:['late','Atrasada'],paga:['ok','Paga'],vazia:['idle','Sem compras']};
  const cards=S.cartoes.map(c=>{
    const fm=fmDeRef(c,S.mes),f=infoFatura(c,fm),usado=usadoCartao(c.id),disp=c.limite-usado,t=TAG[f.k];
    return `<div class="ccard-wrap" data-act="faturas" data-id="${c.id}" data-fm="${fm}" role="button" tabindex="0" aria-label="Abrir as faturas do cartão ${esc(c.nome)}">
      <div class="ccard" style="--cc:${esc(c.cor)}">
        <div class="top"><b>${esc(c.nome)}</b><span class="chip-ic"></span></div>
        <div><div class="lbl"><b>Fatura de ${esc(soMes(f.fech.slice(0,7)))}</b> · fecha ${dataBR(f.fech)} · vence ${dataBR(f.venc)}</div><div class="big ${f.aberto>0?'neg':''}">${R(f.total)}</div></div>
        <div class="row"><span>Fecha dia ${c.fechamento}</span><span>Vence dia ${c.vencimento}</span></div>
        <div class="ccard-hint">Ver faturas mês a mês ›</div>
        <div class="acts"><button class="ic" data-act="cartao-editar" data-id="${c.id}" aria-label="Editar cartão">${svg('edit')}</button><button class="ic" data-act="cartao-apagar" data-id="${c.id}" aria-label="Excluir cartão">${svg('del')}</button></div>
      </div>
      <div class="fat-bar"><span class="tag ${t[0]}">${t[1]}</span><button class="btn sm ghost" data-act="fatura-add" data-id="${c.id}" data-fm="${fm}">${svg('plus')}Adicionar compra nesta fatura</button>${f.aberto>0?`<button class="btn sm ghost" data-act="fatura-prev" data-id="${c.id}" data-fm="${fm}">📅 ${pagPrevisto(c,fm)?'Pagar em '+dataBR(pagPrevisto(c,fm)):'Data prevista de pagamento'}</button>`:''}${f.aberto>0?`<button class="btn sm" data-act="fatura-pagar" data-id="${c.id}" data-fm="${fm}">Pagar fatura · ${R0(f.aberto)}</button>`:f.k==='paga'?`<button class="lnk" data-act="fatura-desfazer" data-id="${c.id}" data-fm="${fm}">Desfazer pagamento</button>`:''}</div>
      ${c.limite?`<div><div class="lim-bar"><span>Limite usado <b class="m neg">${R0(usado)}</b></span><span>Disponível <b class="m ${cS(disp)}">${R0(disp)}</b></span></div><div class="tr ${clsLim(usado/c.limite)}"><i style="width:${Math.min(100,usado/c.limite*100)}%"></i></div></div>`:''}
      ${f.it.length?`<div class="mini">${[...f.it].sort((a,b)=>b.valor-a.valor).slice(0,5).map(i=>`<div class="mini-row"><div class="em">${catVis(i).em}</div><div class="nm"><b>${esc(descVis(i))}</b><small>${i.parcelas>1?`Parcela ${i.parcela} de ${i.parcelas}`:'À vista'} · gasto em ${dataBR(i.data)}</small></div><div class="vl neg">${R(i.valor)}</div></div>`).join('')}${f.it.length>5?`<p class="nota">+ ${plural(f.it.length-5,'compra','compras')} nesta fatura</p>`:''}</div>`:'<p class="nota">Nenhuma compra nesta fatura.</p>'}
    </div>`}).join('');
  return head('Cartões','Cada fatura leva o nome do mês em que fecha: fecha 27/09 e vence 05/10 é a fatura de setembro. A compra conta como gasto no dia; o caixa só muda ao pagar a fatura.',BTN('compra-cartao','Compra no cartão'))+`
  <div class="tiles">
    <div class="tile"><div class="k">Fatura de ${esc(soMes(MES_ATUAL))}</div><div class="v ${atualAb>0?'ref':'zero'}">${R(atual)}</div><div class="d">${atualAb>0?`<span class="ref">${R0(atualAb)}</span> a pagar`:atual?'paga':'sem compras'}${vencDe(MES_ATUAL)?' · '+vencDe(MES_ATUAL):''}</div></div>
    <div class="tile"><div class="k">Fatura de ${esc(soMes(addMes(MES_ATUAL,1)))}</div><div class="v ${prox1>0?'ref':'zero'}">${R(prox1)}</div><div class="d">${prox1>0?(vencDe(addMes(MES_ATUAL,1))||'em aberto'):'sem compras'}</div></div>
    <div class="tile"><div class="k">Limite disponível</div><div class="v ${cS(totalLim-totalUsado)}">${R0(totalLim-totalUsado)}</div><div class="d">${totalLim?'de '+RF(R0(totalLim))+' no total':'cadastre os limites'}</div></div>
    <div class="tile"><div class="k">Parcelado futuro</div><div class="v ${pf>0?'ref':'zero'}">${R0(pf)}</div><div class="d">depois da próxima fatura · <span class="${pctRenda>30?'neg':''}">${med.ent>0?pctRenda+'%':'—'} da renda</span></div></div>
  </div>
  <div class="ccards">${cards}<button class="ccard-add" data-act="cartao-novo">${svg('plus')}Novo cartão</button></div>
  ${histCartoes()}
  <div class="grid g2">
    <div class="panel"><h2>Próximas faturas</h2><p class="sub">Compromissos já assumidos, por mês de fechamento (fatura de setembro = fecha em setembro)</p>
      <div class="chart" style="height:180px">${prox.map(p=>`<div class="cg ${p.m===MES_ATUAL?'atual':''}"><div class="cpair">${barraGrafico('g',p.v/maxP*100,p.m,'Total das faturas',p.v,[['Já pago',cent(p.v-p.a)],['A pagar',p.a]],'max-width:38px;width:60%')}</div><small>${nomeMes(p.m,true)}</small></div>`).join('')}</div>
      <p class="nota">${pctRenda>30?'<span class="neg">Mais de 30% da renda já está comprometida no cartão. Segurem novas compras parceladas.</span>':'O ideal é manter o cartão abaixo de 30% da renda mensal.'}</p></div>
    <div class="panel"><h2>Compras parceladas</h2><p class="sub">Em andamento</p>
      ${parc.length?`<div class="mini">${parc.map(p=>`<div class="mini-row"><div class="em cc" style="--cc:${esc(p.cc?p.cc.cor:'#555')}">💳</div><div class="nm"><b>${esc(p.nome)}</b><small>${p.rest} de ${p.de} parcelas restantes · <span class="ref">${R0(p.total)}</span> a pagar · compra de ${R0(p.compra)} · termina ${mesAno(p.fim)}</small></div><div class="vl neg">${R(p.parcela)}<small class="mut" style="font:500 12px Barlow">/mês</small></div></div>`).join('')}</div>`:vazio('Nada parcelado','Nenhuma compra parcelada em andamento.')}
    </div>
  </div>`;
}
/* histórico de todos os lançamentos dos cartões, por fatura */
function itensHistoricoCartoes(){
  const f=S.ccF;
  return S.card.filter(x=>{const ref=refDoItem(x);return (!f.cartao||x.cartao_id===f.cartao)&&(!f.ano||ref.slice(0,4)===f.ano)&&(!f.mes||ref.slice(5,7)===f.mes)});
}
function histCartoes(){
  const f=S.ccF,it=itensHistoricoCartoes();
  const anos=[...new Set([MES_ATUAL.slice(0,4),...S.card.map(x=>refDoItem(x).slice(0,4)),f.ano].filter(Boolean))].sort().reverse();
  const grupos={};it.forEach(x=>{const k=x.cartao_id+'|'+x.fatura_mes;(grupos[k]=grupos[k]||[]).push(x)});
  const refK=k=>{const [cid,fm]=k.split('|'),c=S.cartoes.find(y=>y.id===cid);return c?refDe(c,fm):fm};
  const ordem=Object.keys(grupos).sort((a,b)=>refK(b).localeCompare(refK(a))||a.localeCompare(b));
  const ST={previsto:['idle','Previsto'],lancado:['soon','Lançado'],fechado:['late','Fechado'],pago:['ok','Pago']};
  const stItem=(x,inf)=>x.status==='pago'?'pago':x.status==='previsto'?'previsto':(inf.k==='fechada'||inf.k==='atrasada')?'fechado':'lancado';
  const blocos=ordem.map(k=>{const [cid,fm]=k.split('|'),c=S.cartoes.find(y=>y.id===cid)||{nome:'Cartão',cor:'#555',fechamento:1,vencimento:1},inf=infoFatura(c,fm),xs=grupos[k].sort((a,b)=>a.data.localeCompare(b.data));
    const tf={aberta:['idle','Aberta'],fechada:['soon','Fechada'],atrasada:['late','Atrasada'],paga:['ok','Paga'],vazia:['idle','—']}[inf.k];
    return `<div class="hc-g"><div class="hc-h"><span class="badge-s cc" style="--cc:${esc(c.cor)}">💳 ${esc(c.nome)}</span><b>Fatura de ${esc(soMes(refK(k)))}/${refK(k).slice(0,4)}</b><span class="tag ${tf[0]}">${tf[1]}</span><span class="mut">fecha ${dataBR(inf.fech)} · vence ${dataBR(inf.venc)}</span><b class="neg hc-t">${R(soma(xs))}</b></div>
      ${xs.map(x=>{const s=ST[stItem(x,inf)];return `<div class="hc-i"><span class="mut">${dataBR(x.data)}</span><span>${catVis(x).em} ${esc(descVis(x))}${x.recorrente_id?' <span class="badge-s">🔁 recorrente</span>':''}${x.parcelas>1?` <span class="badge-s">${x.parcela}/${x.parcelas}</span>`:''}</span><span class="tag ${s[0]}">${s[1]}</span><span class="vl neg">${R(x.valor)}</span>${x.status!=='pago'?`<span class="acts"><button class="ic" data-act="editar" data-id="${x.id}" aria-label="Editar">${svg('edit')}</button><button class="ic del" data-act="apagar" data-id="${x.id}" aria-label="Apagar">${svg('del')}</button></span>`:'<span></span>'}</div>`}).join('')}</div>`}).join('');
  return `<div class="panel" style="margin-bottom:16px"><div class="panel-head"><div><h2>Histórico dos cartões</h2><p class="sub">Filtre pelo mês e ano em que a fatura fecha</p></div>
    <div class="toolbar" style="margin:0"><select class="field" id="ccCartao" aria-label="Cartão do histórico"><option value="">Todos os cartões</option>${S.cartoes.map(c=>`<option value="${c.id}" ${f.cartao===c.id?'selected':''}>${esc(c.nome)}</option>`).join('')}</select>
    <select class="field" id="ccMes" aria-label="Mês da fatura"><option value="">Todos os meses</option>${Array.from({length:12},(_,i)=>{const n=pad(i+1);return `<option value="${n}" ${f.mes===n?'selected':''}>${esc(soMes('2000-'+n))}</option>`}).join('')}</select>
    <select class="field" id="ccAno" aria-label="Ano da fatura"><option value="">Todos os anos</option>${anos.map(y=>`<option value="${y}" ${f.ano===y?'selected':''}>${y}</option>`).join('')}</select></div></div>
    ${blocos||vazio('Nada neste período','Nenhum lançamento nos cartões com esse filtro.')}
    <p class="nota">Previsto: recorrência que ainda não chegou no dia. Lançado: está na fatura aberta. Fechado: a fatura fechou e espera pagamento. Pago: a fatura já foi paga.</p></div>`;
}
/* ================= orçamento ================= */
/* percentual a partir de uma fração: 0,62 → "62%" (nunca multiplica duas vezes) */
function pctF(fr){if(!isFinite(fr))return '—';return Math.round(fr*100).toLocaleString('pt-BR')+'%'}
const ORC_GRUPOS=[
  {id:'essenciais',nome:'Essenciais',cats:['moradia','contas','mercado','saude','farmacia','transporte','educacao','manutencao']},
  {id:'estilo',nome:'Estilo de vida',cats:['restaurantes','lazer','beleza','roupas','compras','__livre']},
  {id:'financeiro',nome:'Financeiro',cats:['dividas','assinaturas','impostos']},
  {id:'outros',nome:'Outros',cats:['viagens','presentes','pets','outros']}
];
const ORC_FILTROS=[['todos','Todos'],['com','Com orçamento'],['sem','Sem orçamento'],['estourados','Estourados'],['comprometidos','Com comprometidos']];
function dadosOrcamento(){
  const pl=planejado(S.mes),med=media(),entPl=pl.entradas||Math.round(med.ent);
  const entries=CATS_G.map(c=>{const u=orcUso(c.id,S.mes),lim=Number(pl.gastos[c.id])||0;
    return {...c,lim,realizado:cent(u.realizado),comprometido:cent(u.comprometido)};
  });
  const verbaPl=Object.keys(S.nomes).reduce((s,e)=>s+(Number(S.mesadas[e])||0),0);
  const verbaUso=soma(doMes(S.mes).filter(i=>i.tipo==='gasto'&&efetivo(i)&&ehLivre(i)));
  if(verbaPl||verbaUso)entries.push({id:'__livre',nome:'Dinheiro pessoal',em:'💸',lim:cent(verbaPl),realizado:cent(verbaUso),comprometido:0});
  entries.forEach(x=>{x.usado=cent(x.realizado+x.comprometido);x.disp=cent(x.lim-x.usado);x.estourado=x.lim>0&&x.disp<-.004;});
  const sum=k=>cent(entries.reduce((s,x)=>s+x[k],0));
  return {pl,med,entPl,entries,planejado:sum('lim'),realizado:sum('realizado'),comprometido:sum('comprometido'),
    disponivel:cent(entries.reduce((s,x)=>s+(x.lim?Math.max(0,x.disp):0),0)),
    excesso:cent(entries.reduce((s,x)=>s+(x.estourado?-x.disp:0),0)),estourados:entries.filter(x=>x.estourado)};
}
function passaOrcFiltro(x,f){return f==='com'?x.lim>0:f==='sem'?x.lim===0:f==='estourados'?x.estourado:f==='comprometidos'?x.comprometido>.004:true}
function vOrcamento(){
  const d=dadosOrcamento(),{pl,med,entPl}=d,f=ORC_FILTROS.some(x=>x[0]===S.orcFiltro)?S.orcFiltro:'todos';
  const card=x=>{
    const wR=x.lim?Math.min(100,x.realizado/x.lim*100):0,wC=x.lim?Math.min(100-wR,x.comprometido/x.lim*100):0;
    const ratio=x.lim?pctF(x.usado/x.lim):'';
    return `<div class="orc-card ${x.lim?'':'sem'} ${x.estourado?'orc-estourado':''}" data-ak="orc-${x.id}" data-orc-detail="${x.id}">
      <div class="oc-top"><span class="oc-em" aria-hidden="true">${x.em}</span><b>${esc(x.nome)}</b></div>
      <div class="oc-val"><span class="oc-real">${R0(x.realizado)}</span><span class="mut">/</span>${x.id==='__livre'?`<button class="oc-ed oc-plan" data-go="livre" title="Definir dinheiro pessoal">${x.lim?R0(x.lim):'Definir'}</button>`:`<button class="oc-ed oc-plan" data-orc-edit="${x.id}" title="Editar orçamento de ${esc(x.nome)}">${x.lim?R0(x.lim):'Definir'}</button>`}</div>
      ${x.lim?`<div class="oc-progress"><div class="tr tr2" role="meter" aria-label="Orçamento usado de ${esc(x.nome)}, incluindo compromissos" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100,Math.round(x.usado/x.lim*100))}" aria-valuetext="${ratio} utilizado"><i style="width:${wR}%"></i><i class="c" style="left:${wR}%;width:${wC}%"></i></div><span class="oc-percent">${ratio}</span></div>`:''}
      ${x.comprometido>.004?`<div class="oc-commit"><b>${R0(x.comprometido)}</b> comprometidos</div>`:''}
      <div class="oc-bottom">${x.lim?x.estourado?`<span class="oc-over"><b>${R0(-x.disp)}</b> acima do orçamento</span>`:`<span class="oc-available"><b>${R0(x.disp)}</b> disponíveis</span>`:'<span class="mut">Sem orçamento definido</span>'}${x.lim&&x.id!=='__livre'?`<button class="oc-zerar" data-act="orc-zerar" data-cat="${x.id}" title="Remover orçamento de ${esc(x.nome)}">Zerar</button>`:''}</div>
    </div>`;
  };
  const groups=ORC_GRUPOS.map(g=>{const xs=g.cats.map(id=>d.entries.find(x=>x.id===id)).filter(x=>x&&passaOrcFiltro(x,f));
    return xs.length?`<section class="orc-group" aria-labelledby="orc-group-${g.id}"><div class="orc-group-head"><h2 id="orc-group-${g.id}">${g.nome}</h2><span>${xs.length} ${xs.length===1?'categoria':'categorias'}</span></div><div class="orc-grid">${xs.map(card).join('')}</div></section>`:'';
  }).join('');
  const ess=['moradia','mercado','contas','transporte','saude','farmacia','dividas','impostos'].reduce((s,k)=>s+(Number(pl.gastos[k])||0),0),des=d.planejado-ess,fut=entPl-d.planejado;
  const ref503020=entPl>0?pbar('Essenciais (até 50%)',pctF(ess/entPl),RF(R0(ess)),ess/entPl/.5,clsLim(ess/entPl/.5))
      +pbar('Estilo de vida (até 30%)',pctF(des/entPl),RF(R0(des)),des/entPl/.3,clsLim(des/entPl/.3))
      +pbar('Metas e reserva (20% ou mais)',pctF(Math.max(0,fut)/entPl),RF(R0(fut)),Math.max(0,fut)/entPl/.2)
    :vazio('Sem entradas previstas','Definam a renda média mensal para calcular a divisão 50/30/20.',`<button class="btn" data-act="renda-media">Definir renda média</button>`);
  return head('Orçamento','Planejem por categoria. Editem o limite ou abram o card para ver os detalhes.')+`<div class="orc-page">
  <div class="orc-resumo" data-ak="orc-resumo">
    <div class="tile" data-orc-detail="renda"><small>${pl.entradas?'Entradas previstas':med.definida?'Renda média mensal':'Renda média histórica'}</small><button class="oc-ed big-ed" data-orc-edit="__ent" title="Editar entradas previstas">${R0(entPl)}</button><small>${pl.entradas?'definidas para este mês':med.definida?'definida por vocês':'média dos últimos meses'}</small></div>
    <div class="tile" data-orc-detail="planejado"><small>Planejado para gastar</small><b>${R0(d.planejado)}</b><small>${d.planejado&&entPl>0?pctF(d.planejado/entPl)+' das entradas':'defina os limites abaixo'}</small></div>
    <div class="tile" data-orc-detail="uso"><small>Realizado${d.comprometido?' + comprometido':''}</small><b>${R0(d.realizado+d.comprometido)}</b><small>${R0(d.realizado)} realizados${d.comprometido?` · <span class="oc-commit">${R0(d.comprometido)} comprometidos</span>`:''}</small></div>
    <div class="tile" data-orc-detail="disponivel"><small>Disponível no orçamento</small><b class="oc-available">${R0(d.disponivel)}</b><small>saldo das categorias com limite</small></div>
  </div>
  <div class="orc-alerts" aria-label="Destaques do orçamento">
    ${d.estourados.length?`<button class="orc-alert over" data-orc-filter="estourados"><i aria-hidden="true"></i><b>${d.estourados.length}</b> ${d.estourados.length===1?'categoria acima':'categorias acima'} do orçamento <span>${R0(d.excesso)} de excesso</span></button>`:''}
    ${d.comprometido>.004?`<button class="orc-alert commit" data-orc-filter="comprometidos"><i aria-hidden="true"></i><b>${R0(d.comprometido)}</b> comprometidos</button>`:''}
    ${d.disponivel>.004?`<button class="orc-alert available" data-orc-detail="disponivel"><i aria-hidden="true"></i><b>${R0(d.disponivel)}</b> ainda disponíveis</button>`:''}
  </div>
  <div class="orc-acoes"><span class="mut">${pl.proprio?'Orçamento próprio de '+esc(soMes(S.mes))+'.':'Usando o orçamento padrão.'}</span>
    <button class="btn sm ghost" data-act="renda-media">${med.definida?'Renda média: '+R0(S.rendaMedia):'Definir renda média'}</button>
    <button class="btn sm ghost" data-act="orc-copiar">Copiar do mês anterior</button><button class="btn sm ghost" data-act="orc-padrao">Usar como padrão</button></div>
  <div class="orc-filters" role="group" aria-label="Filtrar categorias">${ORC_FILTROS.map(([id,nome])=>`<button data-orc-filter="${id}" class="${f===id?'on':''}" aria-pressed="${f===id}">${nome}<span>${d.entries.filter(x=>passaOrcFiltro(x,id)).length}</span></button>`).join('')}</div>
  ${groups||`<div class="orc-empty">${vazio('Nenhuma categoria neste filtro','Escolha outro filtro para ver as categorias.',`<button class="btn ghost" data-orc-filter="todos">Ver todas</button>`)}</div>`}
  <details class="orc-reference panel"><summary>Referência 50/30/20</summary><p class="sub">Uma referência para distribuir a renda entre despesas e futuro.</p>${ref503020}</details></div>`;
}
function detalheOrcamento(key){
  const d=dadosOrcamento(),x=d.entries.find(x=>x.id===key),lines=[],groups=[];
  const line=(label,value,detail='',tipo='money')=>lines.push({label,value,detail,tipo});
  const add=(title,rows,total)=>groups.push({title,rows,total});
  const rows=(xs,k)=>xs.map(x=>({label:x.nome,value:x[k]}));
  let titulo='',valor='',formula='',nota='';
  if(x){
    titulo=x.nome;valor=R(x.realizado)+' / '+(x.lim?R(x.lim):'Sem orçamento');
    formula='Disponível = limite planejado − realizado − comprometido. A barra considera realizado + comprometido.';
    line('Limite planejado',x.lim||'Não definido','',x.lim?'money':'text');line('Realizado',x.realizado);line('Comprometido',x.comprometido);
    if(x.lim)line(x.estourado?'Acima do orçamento':'Disponível',x.estourado?-x.disp:x.disp);
    const it=x.id==='__livre'?{realizados:doMes(S.mes).filter(i=>i.tipo==='gasto'&&efetivo(i)&&ehLivre(i)),compromissos:[]}:orcItens(x.id,S.mes);
    const tx=i=>({label:descVis(i),value:i.valor,detail:[i.data?dataLonga(i.data):'',i.status==='previsto'?'Previsto':i.status==='comprometido'?'Compra no cartão · ainda a pagar':'Confirmado'].filter(Boolean).join(' · ')});
    add('Realizados',it.realizados.map(tx),x.realizado);if(it.compromissos.length)add('Compromissos previstos',it.compromissos.map(tx),x.comprometido);
    if(x.id==='__livre')add('Limites de dinheiro pessoal',Object.keys(S.nomes).map(e=>({label:S.nomes[e],value:Number(S.mesadas[e])||0})),x.lim);
    nota='Compras confirmadas no cartão contam como realizadas no orçamento, mesmo antes de pagar a fatura. Comprometidos são gastos previstos e recorrências ainda não lançadas. Este saldo é um limite de gastos, não dinheiro livre em caixa.';
  }else if(key==='renda'){
    titulo='Entradas de referência';valor=R(d.entPl);formula=d.pl.entradas?'Entradas previstas definidas para este mês.':d.med.definida?'Renda média mensal definida por vocês.':'Média histórica calculada pelo dashboard.';
    line('Entradas de referência',d.entPl);line('Planejado para gastar',d.planejado);line('Sobra planejada',cent(d.entPl-d.planejado));nota='Entradas previstas e renda média não representam dinheiro já recebido.';
  }else if(key==='planejado'){
    titulo='Planejado para gastar';valor=R(d.planejado);formula='Soma dos limites por categoria e do dinheiro pessoal.';add('Limites definidos',rows(d.entries.filter(x=>x.lim),'lim'),d.planejado);line('Entradas de referência',d.entPl);line('Sobra planejada',cent(d.entPl-d.planejado));
  }else if(key==='uso'){
    titulo='Realizado + comprometido';valor=R(d.realizado+d.comprometido);formula='Gastos realizados + compromissos previstos em todas as categorias, inclusive as que não têm limite.';
    add('Realizados por categoria',rows(d.entries.filter(x=>x.realizado),'realizado'),d.realizado);if(d.comprometido)add('Comprometidos por categoria',rows(d.entries.filter(x=>x.comprometido),'comprometido'),d.comprometido);
  }else{
    titulo='Disponível no orçamento';valor=R(d.disponivel);formula='Soma dos saldos positivos (limite − realizado − comprometido) apenas nas categorias com orçamento. Excessos são mostrados separadamente.';
    add('Saldo por categoria',d.entries.filter(x=>x.lim&&x.disp>0).map(x=>({label:x.nome,value:x.disp})),d.disponivel);
    if(d.estourados.length)add('Acima do orçamento',d.estourados.map(x=>({label:x.nome,value:-x.disp})),d.excesso);
    line('Saldo líquido das categorias com limite',cent(d.disponivel-d.excesso));
    const sem=d.entries.filter(x=>!x.lim&&x.usado);if(sem.length)add('Gastos sem orçamento definido',rows(sem,'usado'),cent(sem.reduce((s,x)=>s+x.usado,0)));
    nota='Disponível no orçamento não representa dinheiro em caixa. Categorias sem limite não geram saldo disponível.';
  }
  return {titulo,valor,dados:{formula,nota,lines,groups}};
}
/* ================= contas fixas ================= */
function vContas(){
  const m=S.mes,f=S.ctF||(S.ctF={dono:'',cartao:'',cat:'',fora:false});
  const regras=S.recorrentes.map(r=>({k:'regra',r,s:statusConta(r,m),cat:r.categoria,dono:r.dono||'',cartao:r.cartao_id||'',tipo:r.tipo}));
  const avulsos=doMes(m).filter(i=>!i.recorrente_id&&i.status==='previsto').map(i=>({k:'avulso',i,cat:i.categoria,dono:i.dono||'',cartao:i.cartao_id||'',tipo:i.tipo}));
  /* compras no cartão (à vista ou parcelas) entram aqui no mês da compra; as assinaturas já aparecem pela própria conta */
  const compras=S.card.filter(x=>!x.recorrente_id&&x.mes===m&&efetivo(x)).map(i=>({k:'compra',i,cat:i.categoria,dono:i.dono||'',cartao:i.cartao_id||'',tipo:'gasto'}));
  if(!regras.length&&!avulsos.length&&!compras.length)return head('Contas','Tudo que acontece todo mês: aluguel, internet, salário, assinaturas.','',false)+`<div class="panel">${vazio('Nenhuma conta cadastrada','Cadastrem aluguel, internet, luz, salários e assinaturas. Cada uma pode ser lançada automaticamente ou pedir confirmação.',BTN('cr-nova','Cadastrar conta'))}</div>`;
  const passa=x=>(!f.dono||x.dono===f.dono)&&(!f.cartao||(f.cartao==='sem'?!x.cartao:x.cartao===f.cartao));
  const lista=[...regras,...avulsos,...compras].filter(passa);
  const valor=x=>x.k!=='regra'?x.i.valor:(x.s.oc?x.s.oc.valor:x.r.valor);
  const ativo=x=>x.k!=='regra'||((x.r.ativa&&x.r.inicio<=m&&!(x.r.fim&&m>x.r.fim))||x.s.oc);
  const pulada=x=>x.k==='regra'&&!!x.s.oc&&x.s.oc.status==='cancelado';
  const conta1=x=>ativo(x)&&!pulada(x);
  const motivoFora=x=>pulada(x)?'pulada este mês':(x.k==='regra'&&x.r.inicio>m)?'começa depois':(x.k==='regra'&&x.r.fim&&m>x.r.fim)?'já encerrada':(x.k==='regra'&&!x.r.ativa)?'pausada':'';
  const conta=lista.filter(conta1);
  /* o que não vale para este mês (pulada, ainda não começou, encerrada, pausada) fica escondido; um botão mostra de novo */
  const nFora=lista.filter(x=>!conta1(x)).length,visiveis=f.fora?lista:lista.filter(conta1);
  const sai=conta.filter(x=>x.tipo==='gasto'),ent=conta.filter(x=>x.tipo==='entrada');
  const pago=x=>x.k==='compra'||(x.k==='regra'&&(x.s.k==='ok'||(x.s.oc&&x.s.oc.status==='comprometido')));
  /* lançada no cartão, mas a fatura ainda não foi paga: virou despesa, o caixa não mudou */
  const noCartaoAberto=x=>x.k==='compra'?x.i.status==='comprometido':(x.k==='regra'&&!!x.s.oc&&x.s.oc.status==='comprometido');
  const pagas=sai.filter(pago),atras=sai.filter(x=>x.k==='regra'&&x.s.k==='late');
  const tot=a=>cent(a.reduce((s,x)=>s+Math.round(valor(x)*100),0)/100);
  /* o que ainda vai sair do caixa: contas não pagas + faturas de cartão em aberto */
  const faltaPagar=cent(tot(sai)-tot(pagas.filter(x=>!noCartaoAberto(x))));
  const card=x=>{
    const c=x.k==='compra'?catVis(x.i):(CAT[x.cat]||CAT.contas),cc=x.cartao&&S.cartoes.find(y=>y.id===x.cartao),entra=x.tipo==='entrada';
    if(x.k==='compra'){const i=x.i,paga=i.status==='pago',meu=!outroLivre(i),ref=refDoItem(i);
      return `<div class="ct-card compra ${paga?'ok':''}"><span class="ct-catl">${c.em} ${esc(c.nome)}</span><div class="ct-top"><span class="ct-dia">dia ${Number(i.data.slice(8,10))}</span><span class="tag ${paga?'ok':'idle'}">${paga?'Fatura paga':'No cartão'}</span></div>
      <b class="ct-nome">${esc(descVis(i))}</b><div class="ct-v neg">${R(i.valor)}</div>
      <div class="ct-meta">${donoBadge(x.dono)}${cc?`<span class="badge-s cc" style="--cc:${esc(cc.cor)}">💳 ${esc(cc.nome)}</span>`:''}${i.parcelas>1?`<span class="badge-s">parcela ${i.parcela}/${i.parcelas}</span>`:''}${ref&&cc?`<span class="badge-s">fatura de ${esc(soMes(ref))} · vence ${dataBR(vencFatura(cc,i.fatura_mes))}</span>`:''}</div>
      <div class="ct-acts">${cc?`<button class="btn sm ghost" data-act="faturas" data-id="${cc.id}" data-fm="${i.fatura_mes}">Ver fatura</button>`:''}<span class="acts">${meu?`<button class="ic" data-act="editar" data-id="${i.id}" aria-label="Editar">${svg('edit')}</button><button class="ic del" data-act="apagar" data-id="${i.id}" aria-label="Excluir">${svg('del')}</button>`:''}</span></div></div>`}
    if(x.k==='avulso'){const i=x.i;return `<div class="ct-card ag"><span class="ct-catl">${c.em} ${esc(c.nome)}</span><div class="ct-top"><span class="ct-dia">${dataBR(i.data)}</span><span class="tag soon">📌 agendado</span></div>
      <b class="ct-nome">${esc(descVis(i))}</b><div class="ct-v ${entra?'pos':'neg'}">${entra?'+ ':''}${R(i.valor)}</div>
      <div class="ct-meta">${donoBadge(x.dono)}${cc?`<span class="badge-s cc" style="--cc:${esc(cc.cor)}">💳 ${esc(cc.nome)}</span>`:''}</div>
      <div class="ct-acts"><button class="btn sm" data-act="oc-confirmar" data-id="${i.id}">${entra?'Recebi':'Paguei'}</button><span class="acts"><button class="ic" data-act="editar" data-id="${i.id}" aria-label="Editar">${svg('edit')}</button><button class="ic del" data-act="apagar" data-id="${i.id}" aria-label="Excluir">${svg('del')}</button></span></div></div>`}
    const {r,s}=x,oc=s.oc,prev=oc&&oc.status==='previsto',rest=restantesRegra(r);
    const acao=oc?(prev?`<button class="btn sm" data-act="oc-confirmar" data-id="${oc.id}">${entra?'Confirmar':cc?'Lançar':'Pagar'}</button>`
      :oc.status==='pago'||oc.status==='comprometido'?`<button class="btn sm ghost" data-act="oc-desfazer" data-id="${oc.id}">Desfazer</button>`:oc.status==='cancelado'?`<button class="lnk" data-act="oc-reativar" data-id="${oc.id}">Reativar</button>`:''):'';
    return `<div class="ct-card ${s.k} ${r.ativa?'':'inativa'}"><span class="ct-catl">${c.em} ${esc(c.nome)}</span><div class="ct-top"><span class="ct-dia">dia ${Math.min(r.dia,ultimoDia(m))}</span><span class="tag ${s.k}">${s.txt}</span></div>
      <b class="ct-nome">${esc(r.descricao)}</b><div class="ct-v ${conta1(x)?(entra?'pos':'neg'):'fora'}">${entra?'+ ':''}${R(valor(x))}</div>${conta1(x)?'':`<small class="ct-fora">não conta em ${esc(soMes(m))} · ${motivoFora(x)}</small>`}
      <div class="ct-meta">${donoBadge(x.dono)}${cc?`<span class="badge-s cc" style="--cc:${esc(cc.cor)}">💳 ${esc(cc.nome)}</span>`:''}<span class="badge-s">${r.auto?'🔁 automática':'✋ confirma'}</span>${rest!=null?`<span class="badge-s ${rest<=2?'ref':''}">${rest?`faltam ${rest}`:'última cobrada'}</span>`:''}${oc&&oc.editado?'<span class="badge-s ref">valor ajustado</span>':''}</div>
      <div class="ct-acts">${acao}<span class="acts">${prev?`<button class="lnk" data-act="oc-pular" data-id="${oc.id}" title="Pular este mês">Pular</button><button class="ic" data-act="oc-editar" data-id="${oc.id}" aria-label="Alterar só este mês" title="Alterar só este mês">${svg('edit')}</button>`:''}<button class="ic" data-act="rec-editar" data-id="${r.id}" aria-label="Editar a conta (todos os meses)" title="Editar a conta (todos os meses)">⚙️</button><button class="ic del" data-act="rec-apagar" data-id="${r.id}" aria-label="Excluir">${svg('del')}</button></span></div></div>`};
  const ordem=[...CATS_G,...CATS_E].map(c=>c.id);
  const grupos={};visiveis.forEach(x=>{(grupos[x.cat]=grupos[x.cat]||[]).push(x)});
  const cats=Object.keys(grupos).sort((a,b)=>(ordem.indexOf(a)+99*(ordem.indexOf(a)<0))-(ordem.indexOf(b)+99*(ordem.indexOf(b)<0)));
  const pessoas=Object.keys(S.nomes);
  return head('Contas','Contas do mês e compras no cartão, organizadas por categoria. Tudo que vocês lançam aparece aqui.',BTN('cr-nova','Nova conta'))+`
  <div class="ct-filtros">
    <div class="seg-inline" style="margin:0"><button data-act="ct-dono" data-v="" aria-pressed="${!f.dono}">Todos</button>${pessoas.map(e=>`<button data-act="ct-dono" data-v="${esc(e)}" aria-pressed="${f.dono===e}" class="seg-dono" style="--dc:${corDono(e)}"><i class="dono-dot"></i>${esc((S.nomes[e]||e).split(' ')[0])}</button>`).join('')}</div>
    <select class="field" id="ctCartao" aria-label="Filtrar por cartão"><option value="">Todas as formas de pagamento</option><option value="sem" ${f.cartao==='sem'?'selected':''}>Fora do cartão</option>${S.cartoes.map(c=>`<option value="${c.id}" ${f.cartao===c.id?'selected':''}>💳 ${esc(c.nome)}</option>`).join('')}</select>
    ${nFora?`<button type="button" class="ct-tog" data-act="ct-fora" aria-pressed="${!!f.fora}">${f.fora?'🙈 Ocultar contas fora do mês':`👁 Mostrar contas fora do mês (${nFora})`}</button>`:''}
  </div>
  <div class="tiles">
    <div class="tile"><div class="k">Total previsto no mês</div><div class="v ${tot(sai)?'neg':'zero'}">${R(tot(sai))}</div><div class="d">${plural(sai.length,'conta','contas')} · pagas e a pagar</div></div>
    <div class="tile"><div class="k">Já realizado como despesa</div><div class="v ${pagas.length?'neg':'zero'}">${R(tot(pagas))}</div><div class="d">${pagas.length} de ${sai.length} · <b>${R0(tot(pagas)-tot(pagas.filter(noCartaoAberto)))}</b> já pago${tot(pagas.filter(noCartaoAberto))>0?` · <span class="ref">${R0(tot(pagas.filter(noCartaoAberto)))}</span> no cartão, ainda a pagar`:''}</div></div>
    <div class="tile"><div class="k">Ainda a pagar</div><div class="v ${faltaPagar>0?'ref':'zero'}">${R(faltaPagar)}</div><div class="d">${tot(sai.filter(x=>!pago(x)))>0&&tot(pagas.filter(noCartaoAberto))>0?`${R0(tot(sai.filter(x=>!pago(x))))} em contas + ${R0(tot(pagas.filter(noCartaoAberto)))} no cartão · `:''}${atras.length?`<span class="neg">${plural(atras.length,'atrasada','atrasadas')}</span>`:'nenhuma atrasada'}</div></div>
    <div class="tile"><div class="k">Entradas previstas</div><div class="v ${ent.length?'pos':'zero'}">${R(tot(ent))}</div><div class="d">${ent.filter(pago).length} de ${ent.length} recebidas</div></div>
  </div>
  <div class="ct-cats">${cats.map(id=>{const c=CAT[id]||{em:'•',nome:id},xs=grupos[id],cont=xs.filter(conta1),tc=cont.reduce((s,x)=>s+valor(x),0),nc=cont.length;return `<button class="ct-cat" data-act="ct-cat" data-v="${id}" aria-pressed="${f.cat===id}"><span>${c.em} ${esc(c.nome)}</span><b class="${tc?(xs[0].tipo==='entrada'?'pos':'neg'):'zero'}">${R0(tc)}</b><small>${plural(nc,'conta','contas')} no mês${xs.length>nc?` · ${xs.length-nc} fora`:''}</small></button>`}).join('')}${f.cat?'<button class="ct-cat limpar" data-act="ct-cat" data-v="">✕ Ver todas</button>':''}</div>
  ${cats.length?'<div class="ct-grid ct-full">'+cats.filter(id=>!f.cat||id===f.cat).map(id=>grupos[id].sort((a,b)=>((a.r&&a.r.dia)||Number((a.i&&a.i.data||'').slice(8,10)))-((b.r&&b.r.dia)||Number((b.i&&b.i.data||'').slice(8,10)))).map(card).join('')).join('')+'</div>'
    :`<div class="panel">${vazio('Nada com esse filtro','Troquem a pessoa ou a forma de pagamento.')}</div>`}
  <p class="nota">✏️ altera só a ocorrência deste mês. ⚙️ altera a conta em todos os próximos meses. As compras no cartão aparecem no mês da compra; o caixa só muda quando a fatura é paga.</p>`;
}
/* ================= dívidas ================= */
function vDividas(){
  if(!S.temV4)return head('Dívidas','')+`<div class="panel">${avisoV(4)}</div>`;
  const inf=S.dividas.map(d=>({d,i:infoDivida(d)}));
  const ativas=inf.filter(x=>x.i.rest>0);
  const saldo=ativas.reduce((s,x)=>s+x.i.saldo,0),mensal=ativas.reduce((s,x)=>s+x.d.parcela,0);
  const fim=ativas.map(x=>x.i.fim).sort().pop();
  const med=media();
  if(!S.dividas.length)return head('Dívidas','Empréstimos e financiamentos com plano de quitação.','',true)+`<div class="panel">${vazio('🎉 Nenhuma dívida cadastrada','Se tiverem empréstimo ou financiamento, cadastrem aqui para acompanhar a quitação.',BTN('div-nova','Cadastrar dívida'))}</div>`;
  const comJ=ativas.filter(x=>x.d.juros>0),jm=comJ.length?comJ.reduce((s,x)=>s+x.d.juros*x.i.saldo,0)/Math.max(1,comJ.reduce((s,x)=>s+x.i.saldo,0)):0;
  return head('Dívidas','Empréstimos e financiamentos com plano de quitação.',BTN('div-nova','Nova dívida'),true)+`
  <div class="tiles">
    <div class="tile"><div class="k">Saldo devedor</div><div class="v ${saldo>0?'neg':'zero'}">${R(saldo)}</div><div class="d">${plural(ativas.length,'dívida ativa','dívidas ativas')}</div></div>
    <div class="tile"><div class="k">Parcela mensal</div><div class="v ${mensal>0?'neg':'zero'}">${R(mensal)}</div><div class="d">${med.ent?Math.round(mensal/med.ent*100)+'% da renda média':''}</div></div>
    <div class="tile"><div class="k">Juros médios</div><div class="v ${jm>0?'neg':'zero'}">${jm?jm.toLocaleString('pt-BR',{maximumFractionDigits:2})+'%':'—'}</div><div class="d">${jm?'ao mês, ponderado pelo saldo':'nenhum juro informado'}</div></div>
    <div class="tile"><div class="k">Previsão de quitação</div><div class="v ${fim?'':'pos'}">${fim?mesAno(fim):'Quitadas 🎉'}</div><div class="d">${fim?'pagando as parcelas em dia':'todas finalizadas'}</div></div>
  </div>
  ${S.dividas.length?`<div class="cards">${inf.map(({d,i})=>{const p=i.pagas/d.parcelas_total;return `<div class="meta-card">
    <div class="meta-top"><div class="em">🏦</div><div style="min-width:0"><b>${esc(d.nome)}</b><small>${esc(d.credor||'Sem credor informado')}${d.juros?` · ${String(d.juros).replace('.',',')}% ao mês`:''}</small></div>
      <span class="acts"><button class="ic" data-act="div-editar" data-id="${d.id}" aria-label="Editar">${svg('edit')}</button><button class="ic del" data-act="div-apagar" data-id="${d.id}" aria-label="Excluir">${svg('del')}</button></span></div>
    <div class="meta-val"><b class="${i.rest>0?'neg':'zero'}">${i.rest>0?R(i.saldo):'Quitada 🎉'}</b><span>${i.pagas} de ${d.parcelas_total} pagas</span></div>
    <div class="tr"><i style="width:${p*100}%"></i></div>
    <div class="meta-facts"><div><small>Parcela</small><b><span class="neg">${R(d.parcela)}</span> · dia ${d.dia}</b></div><div><small>Taxa</small><b>${d.juros?String(d.juros).replace('.',',')+'% ao mês':'sem juros informados'}</b></div>
      <div><small>Próximo vencimento</small><b class="${i.rest>0&&!S.pagDiv.some(p=>p.divida_id===d.id&&p.mes===MES_ATUAL)&&diaNoMes(MES_ATUAL,d.dia)<HOJE?'neg':''}">${i.rest>0?dataBR(S.pagDiv.some(p=>p.divida_id===d.id&&p.mes===MES_ATUAL)?diaNoMes(addMes(MES_ATUAL,1),d.dia):diaNoMes(MES_ATUAL,d.dia)):'—'}</b></div><div><small>Previsão de quitação</small><b>${i.fim?mesAno(i.fim):'Quitada'}</b></div></div>${d.nota?`<p class="nota" style="margin:0">📝 ${esc(d.nota)}</p>`:''}${d.anexo?`<button class="lnk" data-act="ver-anexo" data-path="${esc(d.anexo)}">📎 Ver documento</button>`:''}${i.rest>0&&i.jurosProx?`<p class="nota" style="margin:0">Próxima parcela: <b class="ref">${R(d.parcela-i.jurosProx)}</b> abate a dívida e <b class="neg">${R(i.jurosProx)}</b> são juros.</p>`:''}
    ${i.rest>0?`<div class="meta-btns">${i.pagaMes?`<span class="tag ok" style="align-self:center">Parcela de ${esc(soMes(S.mes))} paga</span><button class="btn sm ghost" data-act="div-desfazer" data-id="${d.id}">Desfazer</button>`:`<button class="btn sm" data-act="div-pagar" data-id="${d.id}">Pagar parcela de ${esc(soMes(S.mes))}</button>`}</div>`:''}
  </div>`}).join('')}</div>`:`<div class="panel">${vazio('Nenhuma dívida 🎉','Se tiverem empréstimo ou financiamento, cadastrem aqui para acompanhar a quitação.',BTN('div-nova','Cadastrar dívida'))}</div>`}
  ${(()=>{const at=inf.filter(x=>x.i.rest>0);if(!at.length)return '';const max=Math.max(...at.map(x=>x.i.rest));const meses=[...Array(Math.min(max,48)+1)].map((_,k)=>{const m=addMes(MES_ATUAL,k);
      return {m,v:at.reduce((s,x)=>s+saldoDevedor(x.d,Math.max(0,x.i.rest-k)),0)}});
      const mx=Math.max(1,...meses.map(x=>x.v)),passo=Math.ceil(meses.length/16);
      return `<div class="panel" style="margin-top:16px"><h2>Evolução do saldo devedor</h2><p class="sub">Pagando as parcelas em dia, mês a mês até a quitação</p>
        <div class="chart div-chart">${meses.filter((_,k)=>k%passo===0||k===meses.length-1).map(x=>`<div class="cg"><div class="cpair">${barraGrafico('g',x.v/mx*100,x.m,'Saldo devedor',x.v,[],'width:70%;max-width:34px')}</div><small>${mesAno(x.m).replace('/20','/')}</small></div>`).join('')}</div></div>`})()}
  <p class="nota">Dica: se houver mais de uma dívida, priorizem quitar antes a de <b>maior juros</b>. Ao pagar uma parcela, a parte que abate a dívida reduz o saldo devedor; só os juros contam como gasto.</p>`;
}

/* ================= metas ================= */
function vMetas(){
  if(!S.temV2)return head('Metas','')+`<div class="panel">${avisoV(2)}</div>`;
  const MS=S.metas.filter(m=>!m.reserva),tm=MS.reduce((s,m)=>s+guardadoMeta(m.id),0),alvo=MS.reduce((s,m)=>s+alvoMeta(m),0),noMes=resumo(S.mes).guardado;
  const med=media(),ideal=reservaIdeal(),res=reservaAtual(),temRes=S.metas.some(m=>m.reserva);
  const mesesCob=med.gas>0?(res+Math.max(0,emCaixa()))/med.gas:0;
  const metaRes=S.metas.find(m=>m.reserva),alvoRes=metaRes?metaRes.alvo:0;
  const cards=S.metas.filter(m=>!m.reserva).map(m=>{
    const g=guardadoMeta(m.id),a=alvoMeta(m),p=Math.min(100,Math.max(0,g/a*100)),falta=Math.max(0,a-g),pv=previsaoMeta(m);
    let porMes='—',prazoTxt=m.reserva?'Reserva de emergência':'Sem prazo';
    if(m.prazo){const meses=Math.max(1,difMes(MES_ATUAL,m.prazo.slice(0,7)));prazoTxt=(m.reserva?'Reserva · ':'')+'até '+dataLonga(m.prazo);porMes=falta>0?R(falta/meses):'Concluída'}
    return `<div class="meta-card">
      <div class="meta-top"><div class="em">${esc(m.emoji)}</div><div style="min-width:0"><b>${esc(m.nome)}</b><small>${prazoTxt}</small></div>
        <span class="acts"><button class="ic" data-act="meta-editar" data-id="${m.id}" aria-label="Editar meta">${svg('edit')}</button><button class="ic del" data-act="meta-apagar" data-id="${m.id}" aria-label="Excluir meta">${svg('del')}</button></span></div>
      <div class="meta-val"><b class="${cS(g)}">${R(g)}</b><span class="ref">de ${R(a)}</span></div>
      <div class="tr"><i style="width:${p}%"></i></div>
      <div class="meta-facts"><div><small>Falta</small><b class="${falta>0?'ref':'pos'}">${falta>0?R(falta):'Meta batida! 🎉'}</b></div><div><small>Guardar por mês</small>${m.prazo?`<b class="ref">${porMes}</b>`:`<b class="mut sem-prazo">Defina um prazo para calcular o aporte mensal</b>`}</div></div>
      <p class="nota" style="margin:0">${esc(pv.txt)} · nada sai do caixa até vocês guardarem.</p>
      <div class="meta-btns"><button class="btn sm" data-act="aporte" data-id="${m.id}">Guardar dinheiro</button><button class="btn sm ghost" data-act="resgate" data-id="${m.id}" ${g<=0?'disabled style="opacity:.5"':''}>Resgatar</button></div>
    </div>`}).join('');
  if(!S.metas.some(m=>!m.reserva))return head('Metas','O que vocês estão construindo juntos.','',true)+`<div class="panel">${vazio('Nenhuma meta ainda','Comecem pelo casamento, pela mudança ou por uma viagem. A reserva de emergência fica na aba Reserva.',BTN('meta-nova','Criar a primeira meta'))}</div>`;
  return head('Metas','O que vocês estão construindo juntos.',BTN('meta-nova','Nova meta'),true)+`
  <div class="tiles">
    <div class="tile"><div class="k">Total guardado</div><div class="v ${cS(tm)}">${R(tm)}</div><div class="d">somando todas as metas</div></div>
    <div class="tile"><div class="k">Valor das metas</div><div class="v ref">${R(alvo)}</div><div class="d">${alvo?Math.round(tm/alvo*100)+'% do caminho':'Nenhuma meta'}</div></div>
    <div class="tile"><div class="k">Guardado neste mês</div><div class="vrow"><div class="v ${cS(noMes)}">${R(noMes)}</div>${delta(noMes,resumo(addMes(S.mes,-1)).guardado)}</div><div class="d">${esc(nomeMes(S.mes))}</div></div>
    <div class="tile"><div class="k">Metas batidas</div><div class="v">${MS.filter(m=>guardadoMeta(m.id)>=alvoMeta(m)).length} de ${MS.length}</div><div class="d">continuem assim</div></div>
  </div>
  ${S.metas.some(m=>!m.reserva)?`<div class="metas">${cards}</div>`:`<div class="panel">${vazio('Nenhuma meta ainda','Comecem pelo casamento, pela mudança ou pela reserva de emergência.',BTN('meta-nova','Criar a primeira meta'))}</div>`}`;
}

/* ================= reserva de emergência ================= */
function vReserva(){
  if(!S.temV2)return head('Reserva','')+`<div class="panel">${avisoV(2)}</div>`;
  const m=S.metas.find(x=>x.reserva),med=media(),ideal=reservaIdeal(),seg=mesesSeguranca();
  if(!m)return head('Reserva de emergência','Dinheiro guardado para imprevistos: perda de renda, saúde, consertos.','',true)+`<div class="panel">${vazio('🛟 Ainda sem reserva','O ideal é guardar 6 meses do custo de vida de vocês'+(ideal?`, hoje cerca de <b class="ref">${R0(ideal)}</b>`:'')+'.',`<button class="btn" data-act="reserva-criar">${svg('plus')}Criar reserva de emergência</button>`)}</div>`;
  const g=guardadoMeta(m.id),p=Math.min(100,Math.max(0,g/m.alvo*100)),falta=Math.max(0,m.alvo-g),pv=previsaoMeta(m);
  const nivel=!seg?'zero':seg>=6?'pos':seg>=3?'warn':'neg';
  const orcTot=CATS_G.reduce((s,c)=>s+(Number(planejado(MES_ATUAL).gastos[c.id])||0),0)+Object.keys(S.nomes).reduce((s,e)=>s+(Number(S.mesadas[e])||0),0),segOrc=orcTot>0?g/orcTot:null;
  const difere=ideal&&Math.abs(ideal-m.alvo)/ideal>.05;
  return head('Reserva de emergência','Dinheiro guardado para imprevistos: perda de renda, saúde, consertos.','',true)+`
  <div class="res-hero panel">
    <div class="res-big"><span class="res-ic">🛟</span><div><b class="${nivel}">${seg===null?'0':seg.toLocaleString('pt-BR',{maximumFractionDigits:1})}</b><span>${seg===1?'mês':'meses'} de cobertura pelos gastos médios</span></div>${segOrc!==null?`<div class="res-2"><b class="${segOrc>=6?'pos':segOrc>=3?'warn':segOrc>0?'neg':'zero'}">${segOrc.toLocaleString('pt-BR',{maximumFractionDigits:1})}</b><span>${segOrc===1?'mês':'meses'} pelo orçamento planejado (${R0(orcTot)}/mês)</span></div>`:''}</div>
    <p class="mut">${seg===null?'Assim que houver gastos lançados, o site calcula quantos meses a reserva cobre.':seg>=6?'Excelente: vocês têm o recomendado para atravessar imprevistos com tranquilidade.':seg>=3?'Bom caminho. O recomendado são 6 meses de gastos.':'Ainda curta. Priorizem completar pelo menos 3 meses de gastos.'}</p>
    <div class="res-prog"><div class="meta-val"><b class="${cS(g)}">${R(g)}</b><span class="ref">de ${R(m.alvo)}</span></div><div class="tr"><i style="width:${p}%"></i></div>
      <div class="oc-pe"><span>${Math.round(p)}% do alvo</span><span class="${falta?'ref':'pos'}">${falta?'Faltam '+R0(falta):'Meta batida! 🎉'}</span></div></div>
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">
      <div class="fact"><small>Gasto médio por mês</small><b class="${med.gas>0?'neg':'zero'}">${R0(med.gas)}</b></div>
      <div class="fact"><small>Ideal (6 meses de gastos)</small><b class="ref">${ideal?R0(ideal):'Sem histórico'}</b></div>
      <div class="fact"><small>Previsão para completar</small><b class="ref">${esc(pv.txt.replace('No ritmo atual: ',''))}</b></div>
    </div>
    ${difere?`<p class="nota">Pelos gastos atuais, o ideal seria <b class="ref">${R0(ideal)}</b>. <button class="lnk" data-act="reserva-ajustar">Atualizar alvo →</button></p>`:''}
    <div class="meta-btns" style="margin-top:14px"><button class="btn" data-act="aporte" data-id="${m.id}">Guardar dinheiro</button><button class="btn ghost" data-act="resgate" data-id="${m.id}" ${g<=0?'disabled style="opacity:.5"':''}>Resgatar</button><button class="btn ghost" data-act="meta-editar" data-id="${m.id}">Editar alvo</button><button class="btn ghost danger-t" data-act="reserva-excluir">Remover reserva</button></div>
  </div>`;
}
/* ================= desejos + simulador ================= */
function simular(valor,forma,n){
  const med=media(),sm=situacaoMes(),disp=sm.disponivel,res=reservaAtual();
  const mm=Number(S.mesadas[S.me])||0,usoL=soma(doMes(MES_ATUAL).filter(i=>i.tipo==='gasto'&&ehLivre(i)&&i.autor===S.me)),livre=mm-usoL;
  let k,t,s,linhas;
  if(forma==='vista'){
    const pct=disp>0?valor/disp*100:Infinity;
    if(valor<=disp*.5){k='ok';t='Cabe no orçamento';s='A compra usa menos da metade do dinheiro disponível deste mês.'}
    else if(valor<=disp){k='at';t='Cabe, mas aperta';s=`A compra consumiria ${Math.round(pct)}% do dinheiro disponível deste mês.`}
    else{k='no';t='Melhor esperar';s=disp>0?`A compra passa ${R(valor-disp)} do dinheiro disponível e mexeria em compromissos ou na reserva.`:'Neste momento não há dinheiro disponível depois dos compromissos do mês.'}
    linhas=[['Disponível',`${R0(disp)} → <b class="${cS(disp-valor)}">${R0(disp-valor)}</b>`],
      ['Reserva',valor<=disp?'<b class="pos">não será afetada</b>':`<b class="neg">pode precisar de até ${R0(Math.min(res,valor-disp))}</b>`],
      ['Seu dinheiro pessoal',mm?`<b class="${cS(livre)}">${R0(livre)}</b> disponível${valor<=livre?' (dá para pagar com ele)':''}`:'<span class="mut">não definido</span>'],
      ['Metas do mês',valor<=disp?'<b class="pos">mantidas</b>':'<b class="neg">podem ficar sem aporte</b>']];
  }else{
    n=Math.max(2,Math.min(48,n||2));const c0=S.cartoes[0],ref0=c0?refDe(c0,mesFatura(c0,HOJE)):addMes(MES_ATUAL,1);
    const parc=valor/n,prox=totalRef(ref0,true),comp=med.ent>0?(prox+parc)/med.ent:null;
    if(med.sobra<=0||parc>med.sobra){k='no';t='Melhor esperar';s=med.sobra<=0?'Hoje os gastos já consomem toda a renda; uma parcela nova aumentaria o aperto.':`A parcela de ${R(parc)} é maior que a sobra média de ${R(med.sobra)} por mês.`}
    else if(parc>med.sobra*.5||(comp!==null&&comp>.3)){k='at';t='Cabe, mas aperta';s=comp>.3?`Com essa parcela, ${Math.round(comp*100)}% da renda fica comprometida no cartão (o ideal é até 30%).`:`A parcela consome ${Math.round(parc/med.sobra*100)}% do que sobra por mês.`}
    else{k='ok';t='Cabe no orçamento';s='A parcela cabe com folga na sobra mensal.'}
    linhas=[['Parcela',`<b class="neg">${n}× ${R(parc)}</b>`],['Sobra média por mês',`${R0(med.sobra)} → <b class="${cS(med.sobra-parc)}">${R0(med.sobra-parc)}</b>`],
      ['Renda comprometida no cartão',comp===null?'—':`<b class="${comp>.3?'neg':comp>.2?'warn':'pos'}">${Math.round(comp*100)}%</b>`],
      ['Faturas afetadas',`<b class="ref">${mesAno(ref0)} a ${mesAno(addMes(ref0,n-1))}</b>`],
      ['Maior fatura no período',(()=>{let mx=0,mm='';for(let k=0;k<n;k++){const m=addMes(ref0,k),v=totalRef(m)+parc;if(v>mx){mx=v;mm=m}}return `<b class="neg">${R0(mx)}</b> na fatura de ${mesAno(mm)}`})()]];
  }
  const meio=med.sobra/2;
  const dica=meio>0?`Guardando metade da sobra média (${R0(meio)} por mês), vocês juntam o valor em <b>${plural(Math.ceil(valor/meio),'mês','meses')}</b> e compram à vista.`:'Para juntar o valor, primeiro é preciso que sobre dinheiro no fim do mês.';
  return {k,t,s,linhas,dica};
}
function simHTML(){
  const v=parseValor(S.sim.valor);
  if(!v)return '<p class="nota">Digite um valor para ver se a compra cabe no bolso de vocês agora.</p>';
  const r=simular(v,S.sim.forma,parseInt(S.sim.n,10));
  return `<div class="verd ${r.k}"><span>${r.k==='ok'?'✅':r.k==='at'?'⚠️':'⛔'}</span><div>${S.sim.nome?esc(S.sim.nome)+' · ':''}<span class="ref">${R(v)}</span><br>${r.t}<small>${r.s}</small></div></div>
    <div class="sim-depois"><div class="side-title" style="padding:0 0 6px">${S.sim.forma==='vista'?'Depois da compra':'Com o parcelamento'}</div>${r.linhas.map(l=>`<div class="sd-l"><span>${l[0]}</span><span>${l[1]}</span></div>`).join('')}</div><p class="nota">${r.dica}</p><p class="nota">É só uma simulação: nada muda nos dados até vocês confirmarem.</p><button class="btn sm" style="margin-top:10px" data-act="sim-comprar">Comprar de verdade</button>`;
}
function vDesejos(){
  const temV=S.temV4;
  const ORD_D={prioridade:(a,b)=>a.prioridade-b.prioridade||a.valor-b.valor,menor:(a,b)=>a.valor-b.valor,maior:(a,b)=>b.valor-a.valor,nome:(a,b)=>a.nome.localeCompare(b.nome,'pt-BR')};
  if(!ORD_D[S.ordDes])S.ordDes='prioridade';
  const abertos=S.desejos.filter(d=>d.status==='aberto').sort(ORD_D[S.ordDes]);
  const feitos=S.desejos.filter(d=>d.status!=='aberto').sort(ORD_D[S.ordDes]);
  const lst=S.abaDesejos==='aberto'?abertos:feitos,med=media();
  const PR={1:['p1','Alta'],2:['p2','Média'],3:['p3','Baixa']};
  return head('Desejos','Tudo que vocês querem conquistar, sem dívida.',temV&&!(S.abaDesejos==='aberto'&&!abertos.length)?BTN('des-novo','Novo desejo'):'',true)+`
  <div class="panel" style="margin-bottom:16px"><h2>Podemos comprar?</h2><p class="sub">Simule uma compra e veja o impacto no caixa, na reserva e no mês de vocês</p>
    <div class="sim-form">
      <label>O que é (opcional)<input class="field" id="simNome" maxlength="60" placeholder="Ex.: Sofá novo" value="${esc(S.sim.nome)}"></label>
      <label>Valor (R$)<input class="field" id="simValor" inputmode="decimal" placeholder="0,00" value="${esc(S.sim.valor)}"></label>
      <label>Forma de pagamento<select class="field" id="simForma"><option value="vista" ${S.sim.forma==='vista'?'selected':''}>À vista</option><option value="parc" ${S.sim.forma==='parc'?'selected':''}>Parcelado</option></select></label>
      <label id="simNWrap" ${S.sim.forma==='parc'?'':'hidden'}>Parcelas<input class="field" id="simN" type="number" min="2" max="48" value="${esc(S.sim.n)}"></label>
    </div>
    <div id="simRes">${simHTML()}</div>
  </div>
  ${temV?`${S.desejos.length?`<div class="tiles tiles-des">
    <div class="tile tile-total"><div class="k">Valor total dos desejos</div><div class="v ref">${R(soma(abertos))}</div><div class="d">${plural(abertos.length,'desejo','desejos')} na lista${abertos.filter(d=>d.prioridade===1).length?` · <b>${R0(soma(abertos.filter(d=>d.prioridade===1)))}</b> em prioridade alta`:''}</div></div>
    <div class="tile"><div class="k">Prioridade alta</div><div class="v">${abertos.filter(d=>d.prioridade===1).length}</div><div class="d">${RF(R0(soma(abertos.filter(d=>d.prioridade===1))))}</div></div>
    <div class="tile"><div class="k">Viraram meta</div><div class="v">${feitos.filter(d=>d.status==='meta').length}</div><div class="d">em construção</div></div>
    <div class="tile"><div class="k">Conquistados</div><div class="v pos">${feitos.filter(d=>d.status==='comprado').length}</div><div class="d">desejos realizados</div></div>
  </div>`:''}
  ${S.desejos.length?`<div class="seg-inline"><button data-act="des-aba" data-v="aberto" aria-pressed="${S.abaDesejos==='aberto'}">Na lista (${abertos.length})</button><button data-act="des-aba" data-v="feito" aria-pressed="${S.abaDesejos!=='aberto'}">Realizados e em meta (${feitos.length})</button></div>
  <div class="toolbar" style="margin:10px 0 0"><select class="field" id="dOrd" aria-label="Ordenar desejos">${[['prioridade','Prioridade'],['menor','Menor valor'],['maior','Maior valor'],['nome','Nome (A–Z)']].map(([v,t])=>`<option value="${v}" ${S.ordDes===v?'selected':''}>Ordenar: ${t}</option>`).join('')}</select></div>`:''}
  ${lst.length?`<div class="cards">${lst.map(d=>{const p=PR[d.prioridade]||PR[2];const meses=med.sobra>0?Math.ceil(d.valor/(med.sobra/2)):null;return `<div class="meta-card des-card pr-${p[0]}">
    <div class="meta-top"><div class="em">${esc(d.emoji)}</div><div style="min-width:0"><b>${esc(d.nome)}</b><small><span class="prio ${p[0]}">${p[1]}</span>${d.status==='meta'?' · virou meta':d.status==='comprado'?' · conquistado 🎉':''}</small></div>
      <span class="acts"><button class="ic" data-act="des-editar" data-id="${d.id}" aria-label="Editar">${svg('edit')}</button><button class="ic del" data-act="des-apagar" data-id="${d.id}" aria-label="Excluir">${svg('del')}</button></span></div>
    <div class="meta-val"><b class="ref">${R(d.valor)}</b>${d.link&&/^https?:\/\//.test(d.link)?`<a class="lnk" href="${esc(d.link)}" target="_blank" rel="noopener">Ver produto</a>`:''}</div>
    ${d.status==='aberto'?`<p class="nota" style="margin:0">${meses?`Guardando metade da sobra média, juntam em ${plural(meses,'mês','meses')}.`:'Sem sobra média ainda para estimar.'}</p>
    <div class="meta-btns"><button class="btn sm ghost" data-act="des-simular" data-id="${d.id}">Simular</button><button class="btn sm ghost" data-act="des-meta" data-id="${d.id}">Virar meta</button><button class="btn sm" data-act="des-comprado" data-id="${d.id}">Comprado</button></div>`
    :`<div class="meta-btns"><button class="btn sm ghost" data-act="des-reabrir" data-id="${d.id}">Voltar para a lista</button></div>`}
  </div>`}).join('')}</div>`:`<div class="panel">${vazio(S.abaDesejos==='aberto'?'Lista vazia':'Nada realizado ainda',S.abaDesejos==='aberto'?'Anotem aqui viagens, móveis e tudo que querem conquistar.':'Quando um desejo virar meta ou for comprado, ele aparece aqui.',S.abaDesejos==='aberto'?BTN('des-novo','Adicionar desejo'):'')}</div>`}`
  :`<div class="panel">${avisoV(4)}</div>`}`;
}

/* ================= dinheiro livre ================= */
function vLivre(){
  if(!S.temV4)return head('Dinheiro pessoal','')+`<div class="panel">${avisoV(4)}</div>`;
  const pessoas=Object.keys(S.nomes);
  if(!S.temV6)return head('Dinheiro pessoal','')+`<div class="panel">${avisoV(6)}</div>`;
  const it=doMes(S.mes).filter(i=>i.tipo==='gasto'&&efetivo(i)&&ehLivre(i));
  const meus=it.filter(i=>i.autor===S.me).sort((a,b)=>b.data.localeCompare(a.data));
  const totalMes=pessoas.reduce((s,e)=>s+(Number(S.mesadas[e])||0),0);
  return head('Dinheiro pessoal','Um valor mensal para cada um usar livremente.',`<button class="btn novo" data-act="novo" data-tipo="gasto" data-livre="1">${svg('plus')}Lançar gasto pessoal</button>`)+`
  <div class="cards" style="margin-bottom:16px">${pessoas.map(e=>{const m=Number(S.mesadas[e])||0,u=soma(it.filter(i=>i.autor===e)),rest=m-u;const nome=S.nomes[e]||e;return `<div class="meta-card pessoa">${m?selo(rest,{quem:e}):''}
    <div class="meta-top"><div class="av ${avatarDe(e)?'img':''}">${avatarDe(e)||esc((nome||'?').charAt(0).toUpperCase())}</div><div style="min-width:0"><b>${esc(e===S.me?nome+' (você)':nome)}</b><small>${m?RF(R(m))+' por mês':'Valor ainda não definido'}</small></div></div>
    <div class="meta-val"><b class="${cS(rest)}">${R(rest)}</b><span>${rest<0?'acima do combinado':'disponível em '+esc(soMes(S.mes))}</span></div>
    <div class="tr ${m?clsLim(u/m):''}"><i style="width:${m?Math.min(100,u/m*100):0}%"></i></div>
    <div class="meta-facts"><div><small>Usado no mês</small><b class="${u>0?'neg':'zero'}">${R(u)}</b></div><div><small>Lançamentos</small><b>${it.filter(i=>i.autor===e).length}</b></div></div>
  </div>`}).join('')}</div>
  <div class="grid g21">
    <div class="panel"><h2>Seus gastos pessoais</h2><p class="sub">Só você vê os detalhes. A outra pessoa vê apenas o total.</p>
      ${meus.length?`<div class="mini">${meus.map(linhaMini).join('')}</div>`:vazio('Nada lançado','Seus gastos pessoais do mês aparecem aqui.')}</div>
    <div class="panel"><h2>Combinado do casal</h2><p class="sub">Valor mensal de cada um</p>
      ${pessoas.map(e=>`<div class="mini-row"><div class="em ${avatarDe(e)?'av-sm':''}">${avatarDe(e)||'💸'}</div><div class="nm"><b>${esc(S.nomes[e]||e)}</b></div><div class="vl ref">${R(Number(S.mesadas[e])||0)}</div></div>`).join('')}
      <p class="nota">Total reservado por mês: <b class="ref">${R(totalMes)}</b>. Ao lançar, marquem "Pago com meu dinheiro pessoal": o gasto entra na categoria certa e desconta do dinheiro pessoal de quem pagou.</p>
      <button class="btn ghost" style="margin-top:12px" data-act="mesadas">Definir valores</button></div>
  </div>`;
}

/* ================= retrospectiva ================= */
async function carregarRetro(ano){
  const {data,error}=await sb.from('lancamentos').select('*').gte('data',ano+'-01-01').lt('data',(ano+1)+'-01-01');
  S.retro[ano]=error?[]:(data||[]).filter(x=>x.status!=='previsto'&&x.status!=='cancelado').map(x=>({...x,valor:Number(x.valor),mes:x.data.slice(0,7),autor:x.autor_email,livre:!!x.livre}));
  if(S.view==='retro')render();
}
function vRetro(){
  const ano=S.ano,nav=`<div class="mesnav"><button data-act="ano-1" aria-label="Ano anterior">‹</button><span>${ano}</span><button data-act="ano+1" aria-label="Próximo ano">›</button></div>`;
  const h=`<div class="view-head"><div><h1>Relatório anual</h1><p>O ano de vocês em números.</p></div><div class="head-ctl">${nav}</div></div>`;
  let d=S.retro[ano];
  if(!d){carregarRetro(ano);return h+`<div class="panel">${vazio('Carregando o ano…','Juntando todos os lançamentos de '+ano+'.')}</div>`}
  const d0=d;d=d.filter(x=>x.data<=HOJE);const futG=cent(d0.filter(x=>x.data>HOJE&&x.tipo==='gasto').reduce((q,x)=>q+x.valor,0));
  if(!d.length)return h+`<div class="panel">${vazio('Nenhum lançamento em '+ano,'Quando houver lançamentos neste ano, a retrospectiva aparece aqui.')}</div>`;
  const f=(arr,t)=>arr.filter(x=>x.tipo===t).reduce((s,x)=>s+x.valor,0);
  const ent=f(d,'entrada'),gas=f(d,'gasto'),guard=f(d,'aporte')-f(d,'resgate');
  const meses=[...Array(12)].map((_,i)=>`${ano}-${pad(i+1)}`).map(m=>{const a=d.filter(x=>x.mes===m);return {m,ent:f(a,'entrada'),gas:f(a,'gasto'),guard:f(a,'aporte')-f(a,'resgate'),n:a.length}});
  const ativos=meses.filter(x=>x.n);
  const melhor=[...ativos].sort((a,b)=>(b.ent-b.gas)-(a.ent-a.gas))[0],pior=[...ativos].sort((a,b)=>(a.ent-a.gas)-(b.ent-b.gas))[0];
  const cats={};d.filter(x=>x.tipo==='gasto').forEach(x=>cats[x.categoria]=(cats[x.categoria]||0)+x.valor);
  const topC=Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const maior=d.filter(x=>x.tipo==='gasto'&&!outroLivre(x)).sort((a,b)=>b.valor-a.valor)[0];
  const cartao=d.filter(x=>x.tipo==='gasto'&&x.cartao_id).reduce((s,x)=>s+x.valor,0);
  const maxV=Math.max(1,...meses.map(x=>Math.max(x.ent,x.gas)));
  const taxa=ent>0?Math.round((ent-gas)/ent*100):0;
  return h+`
  <div class="hero"><div><div class="hero-kick"><span class="live"></span>${ano} em números</div><h1 class="${cS(ent-gas)}">${R(ent-gas)}${selo(ent-gas,{inl:1})}</h1>
    <div class="hero-sub"><span>foi o que sobrou no ano até hoje (${dataBR(HOJE)}), depois de todos os gastos, cartão incluído</span>${futG>0.004?`<span>Fora desta conta: ${R0(futG)} em gastos com data futura (parcelas e pagamentos antecipados). O Resumo mensal conta esses valores no mês deles.</span>`:''}</div>
    <div class="hero-meta"><div><b class="pos">${R0(ent)}</b><span>Entradas até hoje</span></div><div><b class="neg">${R0(gas)}</b><span>Gastos realizados até hoje</span></div><div><b class="${cS(guard)}">${R0(guard)}</b><span>Guardado em metas</span></div><div><b>${d.length}</b><span>Lançamentos</span></div></div></div>
    <div class="hero-side"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="12"/><circle cx="60" cy="60" r="54" fill="none" stroke="url(#gr2)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${2*Math.PI*54}" stroke-dashoffset="${2*Math.PI*54*(1-Math.max(0,Math.min(100,taxa))/100)}"/><defs><linearGradient id="gr2"><stop offset="0" stop-color="#e8a90c"/><stop offset="1" stop-color="#fff1b8"/></linearGradient></defs></svg><div class="rv">${taxa}%</div></div><div><b class="cond" style="font-size:19px">Taxa de economia</b><small>da renda do ano ficou com vocês</small></div></div>
  </div>
  <div class="tiles">
    <div class="tile"><div class="k">Mês campeão 🏆</div><div class="v">${melhor?esc(cap(soMes(melhor.m))):'—'}</div><div class="d">${melhor?'sobraram <span class="'+cS(melhor.ent-melhor.gas)+'">'+R0(melhor.ent-melhor.gas)+'</span>':''}</div></div>
    <div class="tile"><div class="k">Mês mais apertado</div><div class="v">${pior?esc(cap(soMes(pior.m))):'—'}</div><div class="d">${pior?'saldo de <span class="'+cS(pior.ent-pior.gas)+'">'+R0(pior.ent-pior.gas)+'</span>':''}</div></div>
    <div class="tile"><div class="k">Categoria que mais pesou</div><div class="v">${topC[0]?(CAT[topC[0][0]]||{em:''}).em+' '+esc((CAT[topC[0][0]]||{nome:topC[0][0]}).nome):'—'}</div><div class="d">${topC[0]?'<span class="neg">'+R0(topC[0][1])+'</span> no ano':''}</div></div>
    <div class="tile"><div class="k">Gasto médio por mês</div><div class="v neg">${R(ativos.length?gas/ativos.length:0)}</div><div class="d">em ${plural(ativos.length,'mês','meses')} com lançamentos</div></div>
  </div>
  <div class="grid g21">
    <div class="panel"><h2>Mês a mês</h2><p class="sub">Entradas e gastos de ${ano}</p>
      <div class="chart12" style="grid-template-columns:repeat(${Math.max(meses.length,6)},1fr)">${meses.map(x=>`<div class="cg"><div class="cpair">${barraGrafico('e',x.ent/maxV*100,x.m,'Entradas',x.ent,[['Gastos do mês',x.gas],['Saldo do mês',cent(x.ent-x.gas)]])}${barraGrafico('g',x.gas/maxV*100,x.m,'Gastos',x.gas,[['Entradas do mês',x.ent],['Saldo do mês',cent(x.ent-x.gas)]])}</div><small>${nomeMes(x.m,true).charAt(0)}</small></div>`).join('')}</div>
      <div class="legend"><span><i style="background:#16f27a"></i>Entradas</span><span><i style="background:var(--neg)"></i>Gastos</span></div></div>
    <div class="panel"><h2>Para onde foi o dinheiro</h2><p class="sub">Categorias do ano</p>
      ${topC.slice(0,8).map(([id,v])=>{const c=CAT[id]||{em:'•',nome:id};return pbar(`${c.em} ${esc(c.nome)}`,R0(v),Math.round(v/gas*100)+'%',v/topC[0][1],'','neg')}).join('')}</div>
  </div>
  <div class="grid g2">
    <div class="panel"><h2>Destaques</h2><p class="sub">Curiosidades do ano</p><div class="facts">
      <div class="fact"><small>Maior gasto</small><b class="neg">${maior?R(maior.valor):'—'}</b><small>${maior?esc(maior.descricao||''):''}</small></div>
      <div class="fact"><small>Gasto no cartão</small><b class="neg">${R0(cartao)}</b><small>${gas?Math.round(cartao/gas*100)+'% dos gastos':''}</small></div>
      <div class="fact"><small>Meses no azul</small><b class="pos">${ativos.filter(x=>x.ent>=x.gas).length} de ${ativos.length}</b></div>
      <div class="fact"><small>Média guardada por mês</small><b class="${cS(ativos.length?guard/ativos.length:0)}">${R0(ativos.length?guard/ativos.length:0)}</b></div></div></div>
    <div class="panel"><h2>Guardar a retrospectiva</h2><p class="sub">Exporte o ano para Excel ou PDF</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-act="exp-excel-ano">${svg('baixar')}Baixar Excel de ${ano}</button><button class="btn ghost" data-act="exp-pdf">Salvar esta tela em PDF</button></div>
      <p class="nota">No PDF, escolham "Salvar como PDF" na janela de impressão.</p></div>
  </div>`;
}

/* ================= investimentos ================= */
function pizzaSVG(fatias,total){
  const cx=170,cy=165,Rr=150,P=[];
  const defs=fatias.map((f,i)=>`<radialGradient id="pg${i}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${Rr}" fx="${cx-35}" fy="${cy-45}"><stop offset="0" stop-color="${mixHex(f.cor,'#ffffff',.18)}"/><stop offset=".55" stop-color="${f.cor}"/><stop offset="1" stop-color="${mixHex(f.cor,'#000000',.18)}"/></radialGradient>`).join('');
  let a0=-Math.PI/2;
  const geo=fatias.map(f=>{const ang=f.valor/total*Math.PI*2,a1=a0+ang,mid=a0+ang/2;const g={a0,a1,mid,ang};a0=a1;return g});
  const arco=(g,dy)=>{if(g.ang>=Math.PI*2-1e-6)return null;const x1=cx+Rr*Math.cos(g.a0),y1=cy+dy+Rr*Math.sin(g.a0),x2=cx+Rr*Math.cos(g.a1),y2=cy+dy+Rr*Math.sin(g.a1);
    return `M${cx} ${cy+dy}L${x1.toFixed(2)} ${y1.toFixed(2)}A${Rr} ${Rr} 0 ${g.ang>Math.PI?1:0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z`};
  const forma=(g,dy,attrs)=>{const d=arco(g,dy);return d?`<path d="${d}" ${attrs}/>`:`<circle cx="${cx}" cy="${cy+dy}" r="${Rr}" ${attrs}/>`};
  // base com profundidade (o "relevo" lateral da pizza)
  const base=fatias.map((f,i)=>forma(geo[i],6,`fill="${mixHex(f.cor,'#000000',.3)}"`)).join('');
  const topo=fatias.map((f,i)=>{const g=geo[i],dx=(Math.cos(g.mid)*5).toFixed(1),dy=(Math.sin(g.mid)*5-2).toFixed(1);
    return `<g class="fatia" data-fatia="${i}" style="--dx:${dx}px;--dy:${dy}px">${forma(g,6,`fill="${mixHex(f.cor,'#000000',.5)}"`)}${forma(g,0,`fill="url(#pg${i})" stroke="rgba(0,0,0,.45)" stroke-width="1.5" stroke-linejoin="round"`)}</g>`}).join('');
  return `<svg viewBox="0 0 340 345" role="img" aria-label="Divisão dos investimentos por tipo"><defs>${defs}<filter id="pSombra" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="5"/></filter>
    <radialGradient id="pBrilho" cx="35%" cy="25%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="${cx}" cy="${cy+26}" rx="${Rr*.95}" ry="${Rr*.9}" fill="#000" opacity=".25" filter="url(#pSombra)"/>
    <g>${base}</g><g>${topo}</g>
    <circle cx="${cx}" cy="${cy}" r="${Rr}" fill="url(#pBrilho)" pointer-events="none"/></svg>`;
}
function vInvestimentos(){
  if(!S.temV5)return head('Investimentos','',null,true)+`<div class="panel">${avisoV(5)}</div>`;
  const tot=totalInvest();
  const por={};S.invest.forEach(x=>{por[x.tipo]=(por[x.tipo]||0)+x.valor});
  const fatiasTipo=INV.filter(t=>por[t.id]).map(t=>{const its=S.invest.filter(x=>x.tipo===t.id),pp={};its.forEach(x=>{const k=x.produto||x.nome||t.nome;pp[k]=(pp[k]||0)+x.valor});return {...t,valor:por[t.id],qtd:its.length,partes:Object.entries(pp).sort((a,b)=>b[1]-a[1])}}).sort((a,b)=>b.valor-a.valor);
  /* com uma classe só (ex.: 100% renda fixa) o gráfico não informa nada: divide por produto até haver mais classes */
  const fatias=fatiasTipo.length===1?fatiasTipo[0].partes.map(([k,v],i)=>({...fatiasTipo[0],nome:k,valor:v,qtd:S.invest.filter(x=>x.tipo===fatiasTipo[0].id&&(x.produto||x.nome||fatiasTipo[0].nome)===k).length,cor:mixHex(fatiasTipo[0].cor,i%2?'#000000':'#ffffff',Math.min(.5,.18*Math.ceil(i/1.5))),partes:[[k,v]]})):fatiasTipo;
  S._fatias=fatias;
  const maior=fatias[0];
  const pctF=v=>(v/tot*100).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
  if(!S.invest.length)return head('Investimentos','Onde o dinheiro de vocês está rendendo.',null,true)+`<div class="panel">${vazio('Nenhum investimento cadastrado','Cadastrem poupança, Tesouro, CDB, ações e outros para ver a divisão no gráfico.',BTN('inv-novo','Adicionar investimento'))}</div>`;
  return head('Investimentos','Onde o dinheiro de vocês está rendendo.',BTN('inv-novo','Novo investimento'),true)+`
  <div class="tiles">
    ${(()=>{const apl=S.invest.reduce((s,x)=>s+x.aplicado,0),evo=tot-apl,rent=apl>0?evo/apl*100:0,mesA=S.invest.filter(x=>(x.data||'').slice(0,7)===MES_ATUAL).reduce((s,x)=>s+x.aplicado,0);
      return `<div class="tile"><div class="k">Patrimônio investido</div><div class="v ${cS(tot)}">${R(tot)}</div><div class="d">em ${plural(S.invest.length,'aplicação','aplicações')}</div></div>
    <div class="tile"><div class="k">Aportes no mês</div>${(()=>{const r0=resumo(MES_ATUAL);return `<div class="v ${r0.investido>0?'pos':r0.investido<0?'neg':'zero'}">${R(r0.investido)}</div><div class="d">saiu do caixa em ${esc(soMes(MES_ATUAL))} · não conta como gasto</div>`})()}</div>
    <div class="tile"><div class="k">Rentabilidade</div><div class="v ${cS(evo)}">${evo>0?'+':''}${rent.toLocaleString('pt-BR',{maximumFractionDigits:2})}%</div><div class="d">sobre ${RF(R0(apl))} aplicados</div></div>
    <div class="tile">${selo(evo)}<div class="k">Resultado</div><div class="v ${cS(evo)}">${evo>0?'+ ':''}${R(evo)}</div><div class="d">valor atual menos o aplicado</div></div>`})()}
  </div>
  <div class="panel inv-distribution" style="margin-bottom:16px"><h2>Divisão da carteira</h2><p class="sub">Passe o mouse (ou toque) em uma fatia para ver os detalhes</p>
    <div class="inv-wrap">
      <div class="pie-box" id="pieBox">${pizzaSVG(fatias,tot)}<div class="pie-tip" id="pieTip" hidden></div></div>
      <div class="leg">${fatias.map((f,i)=>`<div class="leg-row" data-fatia="${i}"><i style="background:linear-gradient(135deg,${mixHex(f.cor,'#ffffff',.3)},${f.cor})"></i><span>${esc(f.nome)}<small class="mut"> · ${plural(f.qtd,'aplicação','aplicações')}</small></span><b class="pos m">${R(f.valor)}</b><small>${pctF(f.valor)}</small></div>`).join('')}
        <div class="leg-row tot"><i style="background:transparent"></i><span><b style="font:inherit;font-weight:700">Total</b></span><b class="pos m">${R(tot)}</b><small>100%</small></div></div>
    </div>
  </div>
  <div class="panel"><h2>Aplicações</h2><p class="sub">Toquem no lápis para atualizar o valor atual e acompanhar o rendimento</p>
    <div class="tbl-wrap"><table><thead><tr><th>Categoria</th><th>Produto</th><th class="hide-sm">Detalhe</th><th class="hide-sm">Instituição</th><th class="hide-sm">Desde</th><th class="r hide-sm">Aplicado</th><th class="r">Valor atual</th><th class="r hide-sm">Resultado</th><th class="r"></th></tr></thead><tbody>
    ${S.invest.map(x=>{const t=INVT[x.tipo]||{nome:x.tipo,cor:'#888'};return `<tr class="row"><td><span class="cat"><i class="dot" style="background:${t.cor}"></i>${esc(t.curto||t.nome)}</span></td><td class="desc">${esc(x.produto||x.nome||t.nome)}</td><td class="hide-sm mut">${esc(x.produto?x.nome||'—':'—')}</td><td class="hide-sm mut">${esc(x.instituicao||'—')}</td><td class="hide-sm mut">${dataBR(x.data)}/${x.data.slice(2,4)}</td><td class="r hide-sm mut">${R(x.aplicado)}</td><td class="r vl pos">${R(x.valor)}</td><td class="r hide-sm vl ${cS(x.valor-x.aplicado)}">${x.valor-x.aplicado>0?'+ ':''}${R(x.valor-x.aplicado)}<small class="rend">${x.aplicado>0?((x.valor-x.aplicado)/x.aplicado*100).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%':'—'}</small></td>
      <td class="r"><span class="acts"><button class="lnk" data-act="inv-aportar" data-id="${x.id}">Aportar</button><button class="lnk" data-act="inv-resgatar" data-id="${x.id}" style="margin:0 6px">Resgatar</button><button class="ic" data-act="inv-editar" data-id="${x.id}" aria-label="Editar">${svg('edit')}</button><button class="ic del" data-act="inv-apagar" data-id="${x.id}" aria-label="Excluir">${svg('del')}</button></span></td></tr>`}).join('')}
    </tbody></table></div>
    <p class="nota">Se o dinheiro de uma meta (como a reserva de emergência) estiver aplicado em um investimento, cadastrem em só um dos lugares para o patrimônio não contar duas vezes.</p>
  </div>`;
}
function ligarPizza(){
  const box=$('pieBox');if(!box)return;const tip=$('pieTip'),tot=totalInvest();
  const els=[...document.querySelectorAll('#view [data-fatia]')];
  const ativar=(i,ev)=>{
    els.forEach(el=>el.classList.toggle('on',el.dataset.fatia===String(i)));
    box.classList.toggle('ativo',i!==null);
    if(i===null){tip.hidden=true;return}
    const f=S._fatias[i];
    tip.innerHTML=`<div class="pt-h"><i style="background:${f.cor}"></i>${esc(f.nome)}</div><div class="pt-v">${S.priv?'R$ •••':R(f.valor)}</div><div class="pt-p">${(f.valor/tot*100).toLocaleString('pt-BR',{maximumFractionDigits:1})}% da carteira · ${plural(f.qtd,'aplicação','aplicações')}</div>${f.partes.length>1||(f.partes[0]&&f.partes[0][0]!==f.nome)?`<div class="pt-l">${f.partes.slice(0,5).map(([k,v])=>`<span>${esc(k)}</span><b>${S.priv?'•••':R(v)}</b>`).join('')}</div>`:''}`;
    tip.hidden=false;
    const r=box.getBoundingClientRect();
    if(ev&&ev.clientX&&box.contains(ev.target)){tip.style.left=(ev.clientX-r.left)+'px';tip.style.top=(ev.clientY-r.top)+'px'}
    else{tip.style.left='50%';tip.style.top='18%'}
  };
  els.forEach(el=>{
    const i=Number(el.dataset.fatia);
    el.addEventListener('mouseenter',e=>ativar(i,e));
    el.addEventListener('mousemove',e=>{if(box.contains(e.target))ativar(i,e)});
    el.addEventListener('mouseleave',()=>ativar(null));
    el.addEventListener('click',e=>{e.stopPropagation();ativar(el.classList.contains('on')&&e.pointerType!=='mouse'?null:i,e)});
  });
}

/* ================= barras com relevo e detalhes ================= */
function barraGrafico(classe,altura,mes,label,valor,extra=[],style=''){
  const h=Number.isFinite(altura)?Math.max(0,Math.min(100,altura)):0;
  return `<div class="cb bar-track"${style?` style="${esc(style)}"`:''}><i class="${classe==='g'?'g':'e'} bar-3d${cent(valor)===0?' bar-zero':''}" style="height:${h}%" tabindex="0" role="img" aria-label="${esc(label+' · '+nomeMes(mes))}" aria-describedby="chartBarTip" data-bar-value="${cent(valor)}" data-bar-period="${esc(nomeMes(mes))}" data-bar-label="${esc(label)}" data-bar-extra="${esc(JSON.stringify(extra))}"></i></div>`;
}
function conteudoBarra(bar){
  const money=v=>S.priv?'R$ •••':R(Number(v)||0),d=bar.dataset;
  let extra=[];try{extra=JSON.parse(d.barExtra||'[]')}catch(e){}
  return `<div class="bar-tip-month">${esc(d.barPeriod)}</div><div class="bar-tip-heading"><i class="${bar.classList.contains('g')?'g':'e'}"></i><b>${esc(d.barLabel)}</b></div><div class="bar-tip-value">${money(d.barValue)}</div>${extra.length?`<div class="bar-tip-details">${extra.map(([label,value])=>`<div><span>${esc(label)}</span><b>${money(value)}</b></div>`).join('')}</div>`:''}`;
}
let BAR_CTL=null;
function ligarBarras(root=$('view')){
  if(BAR_CTL)BAR_CTL.abort();
  let tip=document.getElementById('chartBarTip');if(tip)tip.hidden=true;
  const bars=[...root.querySelectorAll('[data-bar-value]')];if(!bars.length)return;
  BAR_CTL=new AbortController();const signal=BAR_CTL.signal;
  if(!tip){tip=document.createElement('div');tip.id='chartBarTip';tip.className='bar-tip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.append(tip)}
  let active=null;
  const hide=()=>{if(active)active.classList.remove('bar-active');active=null;tip.hidden=true};
  const position=(bar,e)=>{
    const r=bar.getBoundingClientRect(),t=tip.getBoundingClientRect();
    const x=e&&Number.isFinite(e.clientX)?e.clientX:r.left+r.width/2;
    const y=e&&Number.isFinite(e.clientY)?e.clientY:r.top;
    const left=Math.min(Math.max(10,x+16),Math.max(10,window.innerWidth-t.width-10));
    let top=y-t.height-14;if(top<10)top=y+20;
    tip.style.left=left+'px';tip.style.top=Math.min(Math.max(10,top),Math.max(10,window.innerHeight-t.height-10))+'px';
  };
  const show=(bar,e)=>{
    if(active&&active!==bar)active.classList.remove('bar-active');active=bar;bar.classList.add('bar-active');
    tip.innerHTML=conteudoBarra(bar);tip.hidden=false;position(bar,e);
  };
  bars.forEach(bar=>{
    const track=bar.closest('.bar-track');
    track.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')show(bar,e)},{signal});
    track.addEventListener('pointermove',e=>{if(active===bar&&e.pointerType!=='touch')position(bar,e)},{signal});
    track.addEventListener('pointerleave',()=>{if(document.activeElement===bar)show(bar);else if(active===bar)hide()},{signal});
    track.addEventListener('click',e=>{e.stopPropagation();show(bar,e)},{signal});
    bar.addEventListener('focus',()=>show(bar),{signal});
    bar.addEventListener('blur',()=>{if(active===bar)hide()},{signal});
    bar.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();hide()}else if(['Enter',' '].includes(e.key)){e.preventDefault();show(bar)}},{signal});
  });
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('.bar-track'))hide()},{signal});
  window.addEventListener('scroll',hide,{signal,capture:true});window.addEventListener('resize',hide,{signal});
}

/* ================= movimento: números e barras ================= */
/* Sem animação ao abrir, atualizar, navegar ou alterar investimentos/configuração.
   Só uma mudança efetiva em gasto/entrada já carregados permite interpolação. */
const ANIM=new Map();
const SEM_MOV=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const RX_MOEDA=/^(\s*[+−→]?\s*)(-?)R\$\s?([\d.]+)(,(\d{2}))?(\s*)$/;
function animar(permitir=false){
  if(SEM_MOV)return;
  const root=$('view'),v=S.view;
  // números: contam do valor anterior até o novo (subindo ou descendo)
  const jobs=[];let i=0;ANIM._c={};
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode())){
    const t=n.nodeValue;if(t.indexOf('R$')<0)continue;
    const m=t.match(RX_MOEDA);if(!m)continue;
    const val=(m[2]?-1:1)*Number(m[3].replace(/\./g,'')+(m[5]?'.'+m[5]:''));
    const dono=n.parentElement&&n.parentElement.closest('[data-ak]'),key=dono?v+'|'+dono.dataset.ak+'|'+(ANIM._c[dono.dataset.ak]=(ANIM._c[dono.dataset.ak]||0)+1):v+'|n'+(i++),ja=ANIM.has(key),de=ja?ANIM.get(key):val;ANIM.set(key,val);
    if(!permitir||Math.abs(de-val)<0.005)continue;
    const fmt=m[4]?brl:brl0;
    jobs.push({n,de,para:val,pre:m[1],suf:m[6],fmt});n.nodeValue=m[1]+fmt.format(de)+m[6];
  }
  if(jobs.length){
    const t0=performance.now(),D=800;
    const passo=agora=>{const p=Math.min(1,(agora-t0)/D),e=1-Math.pow(1-p,3);
      jobs.forEach(j=>{j.n.nodeValue=j.pre+j.fmt.format(p<1?j.de+(j.para-j.de)*e:j.para)+j.suf});
      if(p<1)requestAnimationFrame(passo)};
    requestAnimationFrame(passo);
  }
  // barras, gráficos e anéis: crescem ou encolhem a partir da posição anterior
  root.querySelectorAll('.tr i,.cb i,.ring circle[stroke-dasharray]').forEach((b,k)=>{
    const key=v+'|b'+k,anel=b.tagName.toLowerCase()==='circle',prop=anel?'strokeDashoffset':b.closest('.cb')?'height':'width';
    const alvo=anel?b.getAttribute('stroke-dashoffset'):b.style[prop];
    const ini=ANIM.has(key)?ANIM.get(key):alvo;
    ANIM.set(key,alvo);
    if(!permitir||ini===alvo||alvo==null)return;
    b.style.transition='none';b.style[prop]=ini;
    b.getBoundingClientRect();
    b.style.transition='';
    requestAnimationFrame(()=>{b.style[prop]=alvo});
  });
  // pizza: gira e abre ao entrar na tela

}

/* orçamento: clique no valor para editar; salva sozinho */
let filaOrc=Promise.resolve();
function salvarOrc(){S._orcPend=(S._orcPend||0)+1;const mes=S.mes,snap=JSON.parse(JSON.stringify(S.orc[mes]));
  filaOrc=filaOrc.then(async()=>{const {error}=await sb.from('orcamentos').upsert({mes,gastos:snap.gastos,entradas:snap.entradas||0,atualizado_em:new Date().toISOString()});
    if(error)toast(/orcamentos/.test(error.message||'')?'Falta rodar o schema-v4.sql no Supabase.':'Não deu para salvar agora.')}).finally(()=>{S._orcPend--});return filaOrc}
function ligarOrcamento(){
  const root=$('view');
  root.querySelectorAll('[data-orc-filter]').forEach(b=>b.addEventListener('click',()=>{
    S.orcFiltro=b.dataset.orcFilter;render();$('view').querySelector('.orc-filters [data-orc-filter="'+S.orcFiltro+'"]')?.focus({preventScroll:true});
  }));
  root.querySelectorAll('[data-orc-detail]').forEach(card=>{
    const open=()=>modalCardDetalhe(detalheOrcamento(card.dataset.orcDetail));
    if(card.tagName!=='BUTTON'){
      card.setAttribute('role','button');card.tabIndex=0;
      card.setAttribute('aria-label',(card.querySelector('.oc-top b')?.textContent||card.querySelector('small')?.textContent||'Orçamento')+'. Ver composição detalhada');
      card.addEventListener('keydown',e=>{if(e.target===card&&['Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();open()}});
    }
    card.addEventListener('click',e=>{if(e.target!==card){const control=e.target.closest('button,a,input,select');if(control&&control!==card)return;}e.stopPropagation();open()});
  });
  document.querySelectorAll('[data-orc-edit]').forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.orcEdit,pl0=planejado(S.mes),atual=k==='__ent'?(pl0.entradas||''):(pl0.gastos[k]||'');
    const inp=document.createElement('input');inp.className='field oc-inp';inp.inputMode='decimal';inp.value=fmtInput(atual);inp.placeholder='0,00';
    b.replaceWith(inp);inp.focus();inp.select();S._orcEditando=(S._orcEditando||0)+1;
    let feito=false;
    const salvar=()=>{if(feito)return;feito=true;S._orcEditando--;
      const raw=inp.value.trim(),v=raw?parseValor(raw):null;
      if(raw&&!v){toast('Valor inválido. Use números como 800 ou 1.200,50.');render();return}
      const pl=planejado(S.mes),g={...pl.gastos};let ent=pl.entradas||0;   // estado atual, não o do momento do clique
      if(k==='__ent')ent=v||0;else if(v)g[k]=v;else delete g[k];
      S.orc[S.mes]={gastos:g,entradas:ent};render();salvarOrc();};
    inp.addEventListener('keydown',e=>{if(e.key==='Enter')inp.blur();if(e.key==='Escape'){feito=true;S._orcEditando--;render()}});
    inp.addEventListener('blur',salvar);
  }));
}
/* ================= relatórios ================= */
async function carregarHist(){
  if(S._histC)return;S._histC=true;const v0=S._histV=(S._histV||0)+1;
  const {data,error}=await sb.from('lancamentos').select('tipo,valor,data,data_caixa,status,meta_id,investimento_id,divida_id,categoria,tags,livre').limit(20000);
  S._histC=false;
  if(v0!==S._histV)return; /* chegou uma resposta mais nova */
  S.hist=error?[]:(data||[]).map(x=>({...x,valor:Number(x.valor)}));if(['relmes','patrimonio'].includes(S.view))render();
}
function fimMes(m){return m+'-'+pad(ultimoDia(m))}
/* patrimônio no fim de um mês = caixa + metas + investimentos − dívidas */
function patrimonioEm(m){
  const fim=fimMes(m),H=S.hist||[],sg=x=>x.tipo==='entrada'||x.tipo==='resgate'?x.valor:-x.valor;
  /* o mês atual usa o mesmo caixa da Visão geral: um conceito, um valor */
  const caixa=m===MES_ATUAL?cent(emCaixa()):cent(S.saldoInicial+H.filter(x=>x.status==='pago'&&x.data_caixa&&x.data_caixa<=fim).reduce((s,x)=>s+Math.round(sg(x)*100),0)/100);
  const metas=H.filter(x=>x.meta_id&&x.status==='pago'&&x.data<=fim).reduce((s,x)=>s+(x.tipo==='aporte'?x.valor:-x.valor),0);
  const invest=S.invest.reduce((s,x)=>{if(m>=MES_ATUAL)return s+x.valor;const depois=H.filter(l=>l.investimento_id===x.id&&l.status==='pago'&&l.data>fim).reduce((a,l)=>a+(l.tipo==='aporte'?l.valor:-l.valor),0);
    /* com "patrimônio inicial" definido, o que foi cadastrado sem movimentar o caixa já existia nessa data */
    const de=(S.patrIni&&x.data&&S.patrIni<x.data)?S.patrIni:x.data;
    const v=(de&&de>fim&&!H.some(l=>l.investimento_id===x.id&&l.data<=fim))?0:x.aplicado-depois;return s+Math.max(0,v)},0);
  const dividas=S.dividas.reduce((s,d)=>{const pagos=H.filter(l=>l.divida_id===d.id&&l.tipo==='divida'&&l.data<=fim).length;return s+saldoDevedor(d,Math.max(0,d.parcelas_total-d.pagas_inicial-pagos))},0);
  return {caixa,metas,invest,dividas,liquido:cent(caixa+metas+invest-dividas)};
}
function vPatrimonio(){
  const h0=head('Patrimônio','Evolução mês a mês: caixa + metas + investimentos − dívidas.','',true);
  if(!S.hist){carregarHist();return h0+`<div class="panel">${vazio('Carregando o histórico…','Juntando todos os lançamentos.')}</div>`}
  /* histórico começa em setembro de 2026, quando vocês passaram a usar o site */
  const INICIO_HIST='2026-09',ini=MES_ATUAL<INICIO_HIST?MES_ATUAL:INICIO_HIST,nM=Math.min(12,difMes(ini,MES_ATUAL)+1);
  const meses=[...Array(nM)].map((_,k)=>addMes(MES_ATUAL,k-nM+1)).map(m=>({m,...patrimonioEm(m)}));
  const mx=Math.max(1,...meses.map(x=>Math.abs(x.liquido))),at=meses[meses.length-1],ant=meses[meses.length-2]||at;
  return h0+`
  <div class="tiles">
    <div class="tile">${selo(at.liquido)}<div class="k">Patrimônio líquido hoje</div><div class="vrow"><div class="v ${cS(at.liquido)}">${R(at.liquido)}</div>${delta(at.liquido,ant.liquido)}</div><div class="d">em relação a ${esc(nomeMes(ant.m,true).toLowerCase())}</div></div>
    <div class="tile"><div class="k">Caixa + metas</div><div class="v ${cS(at.caixa+at.metas)}">${R0(at.caixa+at.metas)}</div><div class="d">metas: ${R0(at.metas)}</div></div>
    <div class="tile"><div class="k">Investimentos</div><div class="v ${cS(at.invest)}">${R0(at.invest)}</div><div class="d">valor atual</div></div>
    <div class="tile"><div class="k">Dívidas</div><div class="v ${at.dividas>0?'neg':'zero'}">${R0(at.dividas)}</div><div class="d">saldo devedor</div></div>
  </div>
  <div class="panel"><h2>Desde setembro de 2026</h2><p class="sub">Patrimônio registrado em cada mês · o mês atual mostra o valor de hoje</p>
    <div class="chart-pat" style="--n:${meses.length}">${meses.map(x=>`<div class="cg ${x.m===MES_ATUAL?'atual':''}"><small class="cval ${cS(x.liquido)}">${R0(x.liquido)}</small><div class="cpair">${barraGrafico(x.liquido>=0?'e':'g',Math.abs(x.liquido)/mx*100,x.m,'Patrimônio líquido',x.liquido,[['Caixa',x.caixa],['Metas e reserva',x.metas],['Investimentos',x.invest],['Dívidas',x.dividas]])}</div><small>${nomeMes(x.m,true)}${x.m===MES_ATUAL?' (atual)':''}</small></div>`).join('')}</div>
    <div class="tbl-wrap" style="margin-top:14px"><table><thead><tr><th>Mês</th><th class="r">Caixa</th><th class="r">Metas</th><th class="r">Investimentos</th><th class="r">Dívidas</th><th class="r">Patrimônio</th></tr></thead><tbody>
    ${[...meses].reverse().map(x=>`<tr class="row"><td>${esc(nomeMes(x.m))}${x.m===MES_ATUAL?' (atual)':''}</td><td class="r vl ${cS(x.caixa)}">${R0(x.caixa)}</td><td class="r vl ${cS(x.metas)}">${R0(x.metas)}</td><td class="r vl ${cS(x.invest)}">${R0(x.invest)}</td><td class="r vl ${x.dividas>0?'neg':'zero'}">${R0(x.dividas)}</td><td class="r vl ${cS(x.liquido)}">${R0(x.liquido)}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="orc-acoes" style="margin-top:12px"><span class="mut">${S.patrIni?`Patrimônio inicial: os investimentos já cadastrados contam desde <b>${dataBR(S.patrIni)}/${S.patrIni.slice(0,4)}</b>.`:'Investimentos aparecem só a partir do dia em que foram cadastrados. Se já existiam antes, informe desde quando.'}</span>
      <button class="btn sm ghost" data-act="patr-ini">${S.patrIni?'Alterar':'Definir patrimônio inicial'}</button></div>
    <p class="nota">Os investimentos dos meses anteriores usam o valor aplicado, porque o site não guarda o histórico de rendimento; o mês atual usa o valor atual. O caixa parte do saldo ajustado por vocês.</p></div>`;
}
function resumoFech(m){const r=resumo(m),p=S.hist?patrimonioEm(m):null;return {entradas:r.entradas,gastos:r.gastos,investimentos:r.investido,metas:r.guardado,resultado:r.resultado,saldo_final:p?p.caixa:null,patrimonio:p?p.liquido:null}}
function vRelMes(){
  const m=S.mes,ant=addMes(m,-1),r=resumo(m),ra=resumo(ant),f=S.fech[m];
  if(!S.hist)carregarHist();
  const med3=[1,2,3].map(k=>resumo(addMes(m,-k))),mg=med3.reduce((s,x)=>s+x.gastos,0)/3,me=med3.reduce((s,x)=>s+x.entradas,0)/3;
  const pc=porCategoria(r.it),pa=porCategoria(ra.it),pl=planejado(m).gastos;
  const difs=CATS_G.map(c=>({c,d:(pc[c.id]||0)-(pa[c.id]||0)})).filter(x=>x.d!==0).sort((a,b)=>b.d-a.d);
  const cresceu=difs[0]&&difs[0].d>0?difs[0]:null,caiu=difs.length&&difs[difs.length-1].d<0?difs[difs.length-1]:null;
  const p=S.hist?patrimonioEm(m):null,pA=S.hist?patrimonioEm(ant):null;
  const tags={};r.ef.filter(i=>i.tipo==='gasto').forEach(i=>(i.tags||[]).forEach(t=>tags[t]=(tags[t]||0)+i.valor));
  const fechavel=m<=MES_ATUAL;
  const linhaCmp=(k,a,b,inv)=>`<div class="sd-l"><span>${k}</span><span><b class="${inv?'neg':'pos'}">${R0(a)}</b> <span class="mut">vs ${R0(b)}</span> ${delta(a,b,inv)}</span></div>`;
  const orcRows=CATS_G.filter(c=>Number(pl[c.id])||pc[c.id]).map(c=>{const lim=Number(pl[c.id])||0,v=pc[c.id]||0;return `<tr class="row"><td>${c.em} ${esc(c.nome)}</td><td class="r vl ref">${lim?R0(lim):'—'}</td><td class="r vl ${v?'neg':'zero'}">${R0(v)}</td><td class="r vl ${lim?cS(lim-v):'zero'}">${lim?R0(lim-v):'—'}</td></tr>`}).join('');
  const emAndamento=m===MES_ATUAL&&!f;
  const diaCmp=Math.min(Number(HOJE.slice(8,10)),ultimoDia(ant)),limAnt=ant+'-'+pad(diaCmp);
  const somaT=(arr,t,lim)=>cent(arr.filter(i=>i.tipo===t&&(!lim||i.data<=lim)).reduce((q,i)=>q+i.valor,0));
  const cmpE=emAndamento?somaT(r.ef,'entrada',HOJE):r.entradas,cmpEa=emAndamento?somaT(ra.ef,'entrada',limAnt):ra.entradas;
  const cmpG=emAndamento?somaT(r.ef,'gasto',HOJE):r.gastos,cmpGa=emAndamento?somaT(ra.ef,'gasto',limAnt):ra.gastos;
  return head('Resumo mensal',`${esc(nomeMes(m))}${f?' · mês fechado em '+dataBR((f.criado_em||HOJE).slice(0,10)):emAndamento?' · <b class="ref">mês em andamento</b>':''}`,fechavel?(f?`<button class="btn ghost" data-act="reabrir-mes">Reabrir mês</button>`:`<button class="btn novo" data-act="fechar-mes">Fechar mês</button>`):'')+`
  ${f?`<div class="panel fech-p"><h2>🔒 Resumo salvo no fechamento</h2><p class="sub">Valores preservados como estavam em ${dataBR((f.criado_em||HOJE).slice(0,10))}</p><div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
    ${[['Entradas',f.resumo.entradas,'pos'],['Gastos',f.resumo.gastos,'neg'],['Investimentos',f.resumo.investimentos,'ref'],['Metas',f.resumo.metas,'ref'],['Saldo final',f.resumo.saldo_final,null]].map(x=>`<div class="fact"><small>${x[0]}</small><b class="${x[2]||cS(x[1]||0)}">${x[1]==null?'—':R0(x[1])}</b></div>`).join('')}</div></div>`:''}
  <div class="tiles">
    <div class="tile"><div class="k">Entradas</div><div class="vrow"><div class="v ${r.entradas?'pos':'zero'}">${R(r.entradas)}</div>${delta(r.entradas,ra.entradas)}</div><div class="d">média 3 meses: ${R0(me)}</div></div>
    <div class="tile"><div class="k">Gastos</div><div class="vrow"><div class="v ${r.gastos?'neg':'zero'}">${R(r.gastos)}</div>${delta(r.gastos,ra.gastos,true)}</div><div class="d">média 3 meses: ${R0(mg)}</div></div>
    <div class="tile"><div class="k">Investimentos e metas</div><div class="v ${cS(r.investido+r.guardado)}">${R(r.investido+r.guardado)}</div><div class="d">investido ${R0(r.investido)} · metas ${R0(r.guardado)}</div></div>
    <div class="tile">${p?selo(p.caixa):''}<div class="k">${emAndamento?'Caixa atual':'Saldo final do mês'}</div><div class="v ${p?cS(p.caixa):'zero'}">${p?R(p.caixa):'…'}</div><div class="d">${emAndamento?'o mês ainda não terminou':'caixa no último dia'}</div></div>
  </div>
  <div class="grid g2">
    <div class="panel"><h2>Comparativo</h2><p class="sub">${emAndamento?`${esc(nomeMes(m,true))} até ${dataBR(HOJE)} × ${esc(nomeMes(ant,true))} até ${dataBR(limAnt)}`:`${esc(nomeMes(m,true))} contra ${esc(nomeMes(ant,true))}`}</p>
      <div class="sim-depois">${linhaCmp('Entradas',cmpE,cmpEa)}${linhaCmp('Gastos',cmpG,cmpGa,true)}
        <div class="sd-l"><span>Gastos vs média de 3 meses</span><span><b class="neg">${R0(r.gastos)}</b> <span class="mut">vs ${R0(mg)}</span> ${delta(r.gastos,mg,true)}</span></div>
        <div class="sd-l"><span>Categoria que mais cresceu</span><span>${cresceu?`${cresceu.c.em} ${esc(cresceu.c.nome)} <b class="neg">+${R0(cresceu.d)}</b>`:'<span class="mut">nenhuma</span>'}</span></div>
        <div class="sd-l"><span>Maior redução</span><span>${caiu?`${caiu.c.em} ${esc(caiu.c.nome)} <b class="pos">−${R0(-caiu.d)}</b>`:'<span class="mut">nenhuma</span>'}</span></div>
        <div class="sd-l"><span>Patrimônio líquido</span><span>${p?`<b class="${cS(p.liquido)}">${R0(p.liquido)}</b> <span class="mut">vs ${R0(pA.liquido)}</span> ${delta(p.liquido,pA.liquido)}`:'…'}</span></div></div></div>
    <div class="panel"><h2>Gastos por categoria</h2><p class="sub">${esc(nomeMes(m))}</p>
      ${Object.keys(pc).length?Object.entries(pc).sort((a,b)=>b[1]-a[1]).map(([id,v])=>{const c=CAT[id]||{em:'•',nome:id};return pbar(`${c.em} ${esc(c.nome)}`,R(v),Math.round(v/r.gastos*100)+'%',v/r.gastos,'','neg')}).join(''):vazio('Sem gastos','Nada lançado no mês.')}
      ${Object.keys(tags).length?`<h2 style="margin-top:18px">Por tag</h2><p class="sub">Gastos marcados com tags</p>${Object.entries(tags).sort((a,b)=>b[1]-a[1]).map(([t,v])=>pbar('#'+esc(t),R(v),'',v/Math.max(...Object.values(tags)),'','neg')).join('')}`:''}</div>
  </div>
  <div class="panel"><h2>Orçamento vs realizado</h2><p class="sub">${esc(nomeMes(m))}</p>
    ${orcRows?`<div class="tbl-wrap"><table><thead><tr><th>Categoria</th><th class="r">Planejado</th><th class="r">Realizado</th><th class="r">Diferença</th></tr></thead><tbody>${orcRows}</tbody></table></div>`:vazio('Sem orçamento','Definam o orçamento do mês para comparar.')}</div>`;
}

/* esconder valores: marca todo texto com R$ (telas e janelas) */
function marcarValores(root){
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode())){if(n.nodeValue.indexOf('R$')>=0&&n.parentElement)n.parentElement.classList.add('rs')}
}
/* calendário e seletor de mês no visual do site (substituem os do navegador) */
const DP_MESES=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
function dpTexto(inp){const v=inp.value;if(!v)return inp.dataset.ph||'Escolher';if(inp.dataset.dp==='month'){const [y,m]=v.split('-');return cap(DP_MESES[+m-1])+' de '+y}const [y,m,d]=v.split('-');return `${d}/${m}/${y}`}
function melhorarDatas(root){
  root.querySelectorAll('input[type=date],input[type=month]').forEach(inp=>{
    const tipo=inp.type;inp.dataset.dp=tipo==='month'?'month':'date';inp.type='hidden';
    const b=document.createElement('button');b.type='button';b.className='field dp-btn';b.dataset.for=inp.id;
    b.innerHTML=`<span class="dp-txt">${esc(dpTexto(inp))}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`;
    inp.after(b);b.addEventListener('click',e=>{e.stopPropagation();abrirDP(inp,b)});
    const sync=()=>{b.querySelector('.dp-txt').textContent=dpTexto(inp)};inp.addEventListener('dp-sync',sync);
  });
}
function fecharDP(){document.querySelectorAll('.dp-pop').forEach(p=>p.remove())}
function fecharSel(){document.querySelectorAll('.sel-pop').forEach(p=>p.remove());document.querySelectorAll('.sel-btn[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'))}
function abrirDP(inp,btn){
  fecharDP();fecharSel();
  const host=btn.closest('dialog')||document.body,pop=document.createElement('div');pop.className='dp-pop';host.append(pop);
  const mes=inp.dataset.dp==='month',min=inp.min||'',max=inp.max||'';
  let ref=(inp.value||HOJE).slice(0,7);
  const pos=()=>{const r=btn.getBoundingClientRect(),ph=pop.offsetHeight,pw=pop.offsetWidth;let top=r.bottom+6;if(top+ph>innerHeight-8)top=Math.max(8,r.top-ph-6);let left=Math.min(r.left,innerWidth-pw-8);pop.style.top=top+'px';pop.style.left=Math.max(8,left)+'px'};
  const escolher=v=>{inp.value=v;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));inp.dispatchEvent(new Event('dp-sync'));fecharDP();btn.focus()};
  const desenha=()=>{
    const [y,m]=ref.split('-').map(Number);
    if(mes){
      pop.innerHTML=`<div class="dp-h"><button type="button" class="dp-nav" data-d="-12">‹</button><b>${y}</b><button type="button" class="dp-nav" data-d="12">›</button></div>
        <div class="dp-meses">${DP_MESES.map((n,k)=>{const v=`${y}-${pad(k+1)}`,off=(min&&v<min)||(max&&v>max);return `<button type="button" class="dp-m ${v===inp.value?'sel':''} ${v===MES_ATUAL?'hoje':''}" data-v="${v}" ${off?'disabled':''}>${cap(n)}</button>`}).join('')}</div>`;
    }else{
      const prim=new Date(y,m-1,1).getDay(),nd=ultimoDia(ref);let cel='';
      for(let i=0;i<prim;i++)cel+='<span></span>';
      for(let d=1;d<=nd;d++){const v=`${ref}-${pad(d)}`,off=(min&&v<min)||(max&&v>max);cel+=`<button type="button" class="dp-d ${v===inp.value?'sel':''} ${v===HOJE?'hoje':''}" data-v="${v}" ${off?'disabled':''}>${d}</button>`}
      pop.innerHTML=`<div class="dp-h"><button type="button" class="dp-nav" data-d="-1">‹</button><b>${cap(nomeMes(ref))}</b><button type="button" class="dp-nav" data-d="1">›</button></div>
        <div class="dp-sem">${['D','S','T','Q','Q','S','S'].map(x=>`<span>${x}</span>`).join('')}</div><div class="dp-dias">${cel}</div>
        <div class="dp-pe"><button type="button" class="lnk" data-v="${(max&&HOJE>max)||(min&&HOJE<min)?'':HOJE}">Hoje</button></div>`;
    }
    pos();
  };
  pop.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.d){ref=mes?`${Number(ref.slice(0,4))+Number(b.dataset.d)/12}-01`:addMes(ref,Number(b.dataset.d));desenha();return}
    if(b.dataset.v)escolher(mes?b.dataset.v:b.dataset.v)});
  desenha();
}
document.addEventListener('click',e=>{if(!e.target.closest('.dp-pop,.dp-btn'))fecharDP();if(!e.target.closest('.sel-pop,.sel-btn'))fecharSel()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(document.querySelector('.dp-pop')||document.querySelector('.sel-pop'))){e.stopPropagation();e.preventDefault();fecharDP();fecharSel()}},true);
addEventListener('resize',()=>fecharSel());addEventListener('scroll',e=>{if(!(e.target&&e.target.closest&&e.target.closest('.sel-pop')))fecharSel()},true);
/* listas de seleção no visual do site: substituem as caixas brancas do navegador */
const SEL_CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
function melhorarSelects(root){
  root.querySelectorAll('select:not([data-sx])').forEach(sel=>{
    sel.dataset.sx='1';sel.classList.add('sx-oculto');sel.tabIndex=-1;
    const b=document.createElement('button');b.type='button';b.className='field sel-btn';b.setAttribute('aria-haspopup','listbox');b.setAttribute('aria-expanded','false');
    if(sel.id)b.dataset.for=sel.id;
    b.innerHTML='<span class="sel-txt"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    sel.after(b);
    const sync=()=>{const o=sel.options[sel.selectedIndex];b.querySelector('.sel-txt').textContent=o?o.textContent:'';b.disabled=sel.disabled};
    sync();sel.addEventListener('change',sync);new MutationObserver(sync).observe(sel,{childList:true,subtree:true,attributes:true});
    b.addEventListener('click',e=>{e.stopPropagation();if(b.getAttribute('aria-expanded')==='true')return fecharSel();abrirSel(sel,b)});
    b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();abrirSel(sel,b)}});
  });
}
function abrirSel(sel,btn){
  fecharSel();fecharDP();
  const host=btn.closest('dialog')||document.body,pop=document.createElement('div');pop.className='sel-pop';pop.setAttribute('role','listbox');pop.tabIndex=-1;host.append(pop);
  btn.setAttribute('aria-expanded','true');
  const ops=[...sel.options];let hi=Math.max(0,sel.selectedIndex);
  pop.innerHTML=ops.map((o,k)=>`<button type="button" role="option" class="sel-op ${k===sel.selectedIndex?'sel':''}" data-k="${k}" aria-selected="${k===sel.selectedIndex}" ${o.disabled?'disabled':''}><span>${esc(o.textContent)}</span>${SEL_CHECK}</button>`).join('');
  const r=btn.getBoundingClientRect();
  pop.style.minWidth=Math.max(r.width,190)+'px';pop.style.maxWidth=Math.min(innerWidth-16,480)+'px';
  const pos=()=>{const ph=pop.offsetHeight,pw=pop.offsetWidth,abaixo=innerHeight-r.bottom-14,acima=r.top-14;let top,mh;
    if(abaixo>=Math.min(ph,240)||abaixo>=acima){top=r.bottom+6;mh=Math.max(120,abaixo)}else{mh=Math.max(120,acima);top=Math.max(8,r.top-6-Math.min(ph,mh,360))}
    pop.style.maxHeight=Math.min(mh,360)+'px';pop.style.top=top+'px';pop.style.left=Math.max(8,Math.min(r.left,innerWidth-pw-8))+'px'};
  pos();requestAnimationFrame(pos);
  const marca=()=>{const l=pop.querySelectorAll('.sel-op');l.forEach((o,k)=>o.classList.toggle('hi',k===hi));if(l[hi])l[hi].scrollIntoView({block:'nearest'})};marca();
  const escolher=k=>{const o=ops[k];if(!o||o.disabled)return;sel.selectedIndex=k;sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));fecharSel();btn.focus()};
  pop.addEventListener('click',e=>{e.stopPropagation();const o=e.target.closest('.sel-op');if(o)escolher(+o.dataset.k)});
  pop.addEventListener('keydown',e=>{const n=ops.length;
    if(e.key==='ArrowDown'){e.preventDefault();hi=Math.min(n-1,hi+1);marca()}else if(e.key==='ArrowUp'){e.preventDefault();hi=Math.max(0,hi-1);marca()}
    else if(e.key==='Home'){e.preventDefault();hi=0;marca()}else if(e.key==='End'){e.preventDefault();hi=n-1;marca()}
    else if(e.key==='Enter'||e.key===' '){e.preventDefault();escolher(hi)}else if(e.key==='Tab'){fecharSel()}});
  pop.focus({preventScroll:true});
}
/* campo de comprovante com botão próprio, em português */
function melhorarArquivos(root){
  root.querySelectorAll('input[type=file]:not([data-fx])').forEach(inp=>{
    inp.dataset.fx='1';inp.classList.add('fx-oculto');
    const b=document.createElement('span');b.className='field fx-btn';b.innerHTML='<b>📎 Escolher arquivo</b><span class="fx-nome">Nenhum arquivo escolhido</span>';
    b.addEventListener('click',e=>{e.preventDefault();inp.click()});
    inp.after(b);inp.addEventListener('change',()=>{const f=inp.files&&inp.files[0];b.querySelector('.fx-nome').textContent=f?f.name:'Nenhum arquivo escolhido';b.classList.toggle('tem',!!f)});
  });
}
/* campos de valor e de quantidade: só números */
function soNumeros(root){
  root.querySelectorAll('input[type=number]').forEach(i=>{i.type='text';i.inputMode='numeric';i.dataset.num='int';i.autocomplete='off'});
}
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.kpi-click,.fact-click,.det-click')){e.preventDefault();e.target.click()}});
document.addEventListener('input',e=>{const i=e.target;if(!(i instanceof HTMLInputElement))return;
  const dec=i.inputMode==='decimal',int=i.dataset.num==='int';if(!dec&&!int)return;
  const antes=i.value,pos=i.selectionStart;
  let v=int?antes.replace(/\D+/g,''):antes.replace(/[^\d.,-]+/g,'').replace(/(?!^)-/g,'');
  if(v!==antes){i.value=v;const p=Math.max(0,(pos||v.length)-(antes.length-v.length));try{i.setSelectionRange(p,p)}catch(x){}}
},true);

/* ================= render ================= */
function render(animarMovimento=false){
  navHTML();
  const V={relmes:vRelMes,patrimonio:vPatrimonio,transf:vTransf,geral:vGeral,calendario:vCalendario,gastos:vGastos,entradas:vEntradas,cartoes:vCartoes,orcamento:vOrcamento,contas:vContas,dividas:vDividas,metas:vMetas,desejos:vDesejos,reserva:vReserva,livre:vLivre,retro:vRetro,investimentos:vInvestimentos};
  if(S.temV9===false){$('view').innerHTML=`<div class="panel" style="max-width:640px;margin:40px auto">${vazio('Falta um passo para ativar a nova versão','Rodem o arquivo <b>schema-v9.sql</b> no SQL Editor do Supabase e recarreguem a página. Ele converte todos os lançamentos para o novo modelo, sem apagar nada.')}</div>`;return}
  $('view').innerHTML=subAbas()+(V[S.view]||vGeral)();
  ligarOrcamento();
  ligarPizza();
  ligarBarras();
  ligarTabelas($('view'));
  ligarCardsDetalhes($('view'));
  animar(animarMovimento);
  const ctc=$('ctCartao');if(ctc)ctc.addEventListener('change',()=>{S.ctF.cartao=ctc.value;render()});
  marcarValores($('view'));melhorarDatas($('view'));melhorarSelects($('view'));soNumeros($('view'));
  const b=$('fBusca'),c=$('fCat');
  if(b)b.addEventListener('input',()=>{S.fBusca=b.value;clearTimeout(b._t);b._t=setTimeout(()=>{const pos=b.selectionStart;render();const nb=$('fBusca');nb.focus();nb.setSelectionRange(pos,pos)},250)});
  if(c)c.addEventListener('change',()=>{S.fCat=c.value;render()});
  const dO=$('dOrd');if(dO)dO.addEventListener('change',()=>{S.ordDes=dO.value;try{localStorage.setItem('pf-ord-des',dO.value)}catch(e){}render()});
  const fo=$('fOrd');if(fo)fo.addEventListener('change',()=>{S.fOrd=fo.value;try{localStorage.setItem('pf-ord',fo.value)}catch(e){}render()});
  const ft=$('fTag');if(ft)ft.addEventListener('change',()=>{S.fTag=ft.value;render()});
  ['ccCartao','ccMes','ccAno'].forEach((id,i)=>{const el=$(id);if(el)el.addEventListener('change',()=>{S.ccF[['cartao','mes','ano'][i]]=el.value;render()})});
  if($('simValor')){
    const upd=()=>{S.sim={nome:$('simNome').value,valor:$('simValor').value,forma:$('simForma').value,n:$('simN').value};$('simNWrap').hidden=S.sim.forma!=='parc';$('simRes').innerHTML=simHTML()};
    ['simNome','simValor','simN'].forEach(id=>$(id).addEventListener('input',upd));$('simForma').addEventListener('change',upd);
  }
}
/* ================= cards: composição dos valores ================= */
function ligarTabelas(root){
  root.querySelectorAll('.tbl-wrap table').forEach(table=>{
    const headers=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row=>[...row.children].forEach((cell,i)=>{cell.dataset.label=headers[i]||''}));
  });
}
function ligarCardsDetalhes(root,origem=S.view){
  root.querySelectorAll('.tile,.kpi,.fact').forEach(card=>{
    if(card.dataset.act||card.dataset.orcDetail)return; // mantém as janelas de detalhe que já existiam
    const title=card.querySelector('.k')||card.querySelector('small');
    const value=card.querySelector('.v')||card.querySelector('b');
    if(!title||!value)return;
    const snapshot={origem:card.closest('.fat-view')?'fatura':origem,titulo:title.textContent.trim(),valor:value.textContent.trim(),sub:card.querySelector('.d')?.textContent.trim()||'',fechado:!!card.closest('.fech-p')};
    card.classList.add('valor-card');card.setAttribute('role','button');card.tabIndex=0;
    card.setAttribute('aria-label',snapshot.titulo+': '+snapshot.valor+'. Ver composição detalhada');
    card.title='Clique para ver de onde vem este valor';
    card.addEventListener('click',e=>{if(e.target.closest('button,a,input,select,summary,details'))return;e.stopPropagation();modalCardDetalhe(snapshot)});
    card.addEventListener('keydown',e=>{if(e.target!==card||!['Enter',' '].includes(e.key))return;e.preventDefault();e.stopPropagation();modalCardDetalhe(snapshot)});
  });
}
function dadosCardDetalhe(view,titulo,fechado=false){
  const key=semAcento(titulo),m=S.mes,r=resumo(m),sm=situacaoMes(),groups=[],lines=[];
  let formula='',nota='';
  const row=(label,value,detail='',tipo='money')=>({label,value,detail,tipo});
  const add=(title,rows,total)=>groups.push({title,rows,total});
  const line=(label,value,detail='',tipo='money')=>lines.push(row(label,value,detail,tipo));
  const tx=i=>row(descVis(i),i.tipo==='resgate'?-i.valor:i.valor,[i.data?dataLonga(i.data):'',catVis(i).nome,i.status==='comprometido'?'No cartão · ainda a pagar':i.status==='previsto'?'Previsto':'Confirmado',i.parcelas>1?`Parcela ${i.parcela}/${i.parcelas}`:''].filter(Boolean).join(' · '));
  const ev=e=>row(e.txt,e.valor,[e.data?dataLonga(e.data):'',e.k,e.feito?'Realizado':'Pendente'].filter(Boolean).join(' · '));
  const total=a=>cent(a.reduce((s,x)=>s+x.valor,0));
  const eventos=Object.entries(eventosMes(m)).flatMap(([data,es])=>es.map(e=>({...e,data}))).sort((a,b)=>a.data.localeCompare(b.data));
  const transactions=(title,arr,signed=false)=>add(title,arr.map(tx),signed?cent(arr.reduce((s,i)=>s+(i.tipo==='resgate'?-i.valor:i.valor),0)):total(arr));
  if(fechado){
    const f=S.fech[m],o=f?.resumo||{};formula='Este card é uma fotografia salva no fechamento do mês; não é recalculado com lançamentos posteriores.';
    [['Entradas',o.entradas],['Gastos',o.gastos],['Investimentos',o.investimentos],['Metas',o.metas],['Saldo final',o.saldo_final]].forEach(([n,v])=>line(n,v==null?'Não registrado':v,'',v==null?'text':'money'));
    nota=f?'Fechamento registrado em '+dataLonga((f.criado_em||HOJE).slice(0,10))+'. Os lançamentos atuais podem diferir desta fotografia.':'';
  }else if(view==='calendario'){
    const entradas=eventos.filter(e=>e.entra),saidas=eventos.filter(e=>e.sai),pendentes=saidas.filter(e=>!e.feito).map(e=>({...e,valor:e.pend!=null?e.pend:e.valor}));
    if(key.startsWith('entradas')){formula='Entradas previstas no mês = entradas e resgates realizados + entradas e resgates ainda previstos.';add('Já recebido / resgatado',entradas.filter(e=>e.feito).map(ev),total(entradas.filter(e=>e.feito)));add('Ainda previsto',entradas.filter(e=>!e.feito).map(ev),total(entradas.filter(e=>!e.feito)));}
    else if(key==='ainda a pagar'){formula='Ainda a pagar = eventos de saída pendentes neste mês. Para faturas parcialmente pagas, conta apenas a parte pendente.';add('Compromissos pendentes',pendentes.map(ev),total(pendentes));}
    else if(key.startsWith('resultado')){formula='Resultado projetado = total de entradas do calendário − total de saídas do calendário. Não representa o saldo em caixa.';line('Entradas do calendário',total(entradas));line('Saídas do calendário',-total(saidas));add('Entradas',entradas.map(ev),total(entradas));add('Saídas',saidas.map(ev),total(saidas));}
    else{formula='Saídas previstas = eventos de saída já realizados + total dos eventos de saída previstos, incluindo faturas, parcelas e transferências.';add('Saídas realizadas',saidas.filter(e=>e.feito).map(ev),total(saidas.filter(e=>e.feito)));add('Saídas em eventos ainda pendentes',saidas.filter(e=>!e.feito).map(ev),total(saidas.filter(e=>!e.feito)));}
    nota='Período: '+nomeMes(m)+'. O calendário representa movimentação de caixa, incluindo transferências; uma compra no cartão aparece na fatura para evitar contá-la duas vezes.';
  }else if(view==='entradas'){
    if(key==='recebido no mes'){formula='Recebido no mês = soma das entradas confirmadas no mês selecionado.';transactions('Entradas recebidas',r.ef.filter(i=>i.tipo==='entrada'));}
    else if(key==='ainda previsto'){formula='Ainda previsto = entradas automáticas e agendadas que ainda não foram recebidas. No mês atual, inclui entradas atrasadas de meses anteriores.';const a=previstasEntrar();add('Entradas a receber',a.map(ev),total(a));nota='A previsão só passa a recebido quando a ocorrência for confirmada. Resgates de investimentos não fazem parte desta lista de entradas.';}
    else if(key==='media mensal'){formula='Média mensal = entradas dos três meses anteriores ÷ 3, inclusive meses com zero.';[1,2,3].map(k=>addMes(m,-k)).forEach(mes=>line(nomeMes(mes),resumo(mes).entradas));line('Divisor',3,'','text');}
    else{const ant=resumo(addMes(m,-1)).entradas;formula='Variação = (recebido no mês − recebido no mês anterior) ÷ recebido no mês anterior × 100.';line('Recebido em '+nomeMes(m),r.entradas);line('Recebido em '+nomeMes(addMes(m,-1)),ant);nota=ant>0?'O card arredonda a variação para um percentual inteiro.':'Sem entradas no mês anterior, não é possível calcular a variação percentual.';}
  }else if(view==='gastos'){
    const gastos=r.ef.filter(i=>i.tipo==='gasto'),cartao=gastos.filter(i=>i.cartao_id&&i.status==='comprometido');
    if(key==='orcamento usado'){const orc=planejado(m).gastos;formula='Orçamento usado = gastos realizados ÷ soma dos limites planejados das categorias × 100.';line('Gastos realizados',r.gastos);add('Limites por categoria',CATS_G.map(c=>row(c.nome,Number(orc[c.id])||0)),CATS_G.reduce((s,c)=>s+(Number(orc[c.id])||0),0));}
    else if(key==='maior gasto'){formula='Maior valor entre os gastos realizados do mês que podem ser detalhados para esta conta.';const maior=[...gastos].filter(i=>!outroLivre(i)).sort((a,b)=>b.valor-a.valor)[0];transactions('Lançamento de maior valor',maior?[maior]:[]);}
    else if(key==='a ser pago no cartao'){formula='Compras do mês com status comprometido: já são despesa, mas ainda não saíram do caixa.';transactions('Compras com fatura pendente',cartao);}
    else{formula='Total gasto = gastos pagos fora do cartão + compras no cartão, inclusive faturas ainda pendentes.';transactions('Gastos realizados',gastos);}
  }else if(view==='transf'){
    let a=doMes(m).filter(i=>i.tipo==='aporte'||i.tipo==='resgate'||i.tipo==='divida');
    if(key==='para metas e reserva'){a=a.filter(i=>i.meta_id&&efetivo(i));formula='Transferências para metas e reserva = aportes − resgates no mês.';}
    else if(key==='para investimentos'){a=a.filter(i=>efetivo(i)&&!i.meta_id&&(i.tipo==='aporte'||i.tipo==='resgate'));formula='Transferências para investimentos = aportes − resgates no mês.';}
    else if(key==='dividas amortizadas'){a=a.filter(i=>i.tipo==='divida');formula='Soma dos pagamentos de dívida registrados neste mês, incluindo os previstos que aparecem na tela.';nota='O valor pago pode incluir juros; confira a parcela e o saldo devedor na aba Dívidas.';}
    else{formula='Quantidade de transferências e pagamentos de dívidas realizados no mês.';line('Movimentações',a.length,'','text');}
    transactions('Movimentações do mês',a,true);
  }else if(view==='cartoes'){
    if(key==='limite disponivel'){formula='Limite disponível = limites cadastrados − compras comprometidas em todas as faturas.';add('Limites por cartão',S.cartoes.map(c=>row(c.nome,c.limite,'Limite cadastrado')),S.cartoes.reduce((s,c)=>s+c.limite,0));add('Uso por cartão',S.cartoes.map(c=>row(c.nome,usadoCartao(c.id),'Compras ainda comprometidas')),S.cartoes.reduce((s,c)=>s+usadoCartao(c.id),0));}
    else if(key==='parcelado futuro'){formula='Soma das compras comprometidas em faturas que fecham depois da próxima fatura.';transactions('Compras e parcelas futuras',S.card.filter(i=>i.status==='comprometido'&&refDoItem(i)>addMes(MES_ATUAL,1)));}
    else{const ref=key==='fatura de '+semAcento(soMes(MES_ATUAL))?MES_ATUAL:addMes(MES_ATUAL,1);formula='Fatura = soma das compras no período de fechamento de cada cartão.';S.cartoes.forEach(c=>{const f=faturaRef(c,ref);transactions(c.nome+' · vence '+dataLonga(f.venc),f.it)});nota='A referência exibida é o mês em que a fatura fecha. O vencimento pode ocorrer no mês seguinte.';}
  }else if(view==='contas'){
    const f=S.ctF||{};const out=[];
    S.recorrentes.forEach(reg=>{const st=statusConta(reg,m),oc=st.oc,ativo=(reg.ativa&&reg.inicio<=m&&!(reg.fim&&m>reg.fim))||oc;if(!ativo||oc?.status==='cancelado')return;out.push({nome:reg.descricao,valor:oc?oc.valor:reg.valor,tipo:reg.tipo,dono:reg.dono||'',cartao:reg.cartao_id||'',data:oc?.data||diaNoMes(m,reg.dia),pago:st.k==='ok'||oc?.status==='comprometido',aberto:oc?.status==='comprometido',status:st.txt})});
    doMes(m).filter(i=>!i.recorrente_id&&i.status==='previsto').forEach(i=>out.push({nome:descVis(i),valor:i.valor,tipo:i.tipo,dono:i.dono||'',cartao:i.cartao_id||'',data:i.data,pago:false,aberto:false,status:'Agendado'}));
    S.card.filter(i=>!i.recorrente_id&&i.mes===m&&efetivo(i)).forEach(i=>out.push({nome:descVis(i),valor:i.valor,tipo:'gasto',dono:i.dono||'',cartao:i.cartao_id||'',data:i.data,pago:true,aberto:i.status==='comprometido',status:i.status==='comprometido'?'No cartão · a pagar':'Fatura paga'}));
    let a=out.filter(x=>(!f.dono||x.dono===f.dono)&&(!f.cartao||(f.cartao==='sem'?!x.cartao:x.cartao===f.cartao)));
    if(key==='entradas previstas'){a=a.filter(x=>x.tipo==='entrada');formula='Soma das entradas das contas que valem para o mês, recebidas ou ainda previstas.';}
    else{a=a.filter(x=>x.tipo==='gasto');if(key==='ja realizado como despesa'){a=a.filter(x=>x.pago);formula='Contas realizadas + compras no cartão, mesmo com fatura pendente.';}else if(key==='ainda a pagar'){a=a.filter(x=>!x.pago||x.aberto);formula='Contas ainda pendentes + contas e compras já realizadas no cartão com fatura em aberto.';}else formula='Total das despesas das contas ativas e das compras do cartão neste mês, incluindo pagas e pendentes.';}
    add('Composição com os filtros da tela',a.map(x=>row(x.nome,x.valor,dataLonga(x.data)+' · '+x.status)),total(a));nota='Os filtros de pessoa e cartão da tela também são aplicados aqui. Contas pausadas, fora do prazo ou puladas são excluídas.';
  }else if(view==='dividas'){
    const a=S.dividas.map(d=>({...d,info:infoDivida(d)})).filter(d=>d.info.rest>0);const saldo=a.reduce((s,d)=>s+d.info.saldo,0);
    if(key==='saldo devedor'){formula='Soma dos saldos devedores estimados das dívidas ativas.';add('Dívidas ativas',a.map(d=>row(d.nome,d.info.saldo,`${d.info.rest} parcelas restantes · juros ${d.juros||0}% ao mês`)),saldo);}
    else if(key==='parcela mensal'){formula='Soma das parcelas mensais das dívidas ativas.';add('Parcelas',a.map(d=>row(d.nome,d.parcela,`${d.info.rest} parcelas restantes`)),a.reduce((s,d)=>s+d.parcela,0));}
    else if(key==='juros medios'){formula='Juros médios = soma de (saldo × juros mensais) ÷ saldo devedor total.';add('Taxas e pesos',a.map(d=>row(d.nome,(d.juros||0)+'% a.m.',`Saldo ${R(d.info.saldo)} · peso ${saldo>0?(d.info.saldo/saldo*100).toFixed(2):0}%`,'text')));}
    else{formula='Previsão de quitação = último mês de término das dívidas ativas, mantendo as parcelas em dia.';add('Previsões por dívida',a.map(d=>row(d.nome,d.info.fim?nomeMes(d.info.fim):'Quitada',`${d.info.rest} parcelas restantes`,'text')));}
    nota='Saldo estimado pelas parcelas restantes e juros informados. Se houver juros, usa o valor presente das parcelas; confira o saldo oficial com a instituição.';
  }else if(view==='metas'){
    const a=S.metas.filter(x=>!x.reserva);
    if(key==='guardado neste mes'){formula='Guardado no mês = aportes em metas e reserva − resgates, no mês selecionado.';transactions('Aportes e resgates',r.ef.filter(i=>i.meta_id),true);}
    else if(key==='valor das metas'){formula='Soma dos alvos das metas, sem a reserva de emergência.';add('Alvos cadastrados',a.map(x=>row(x.nome,alvoMeta(x),`Guardado: ${R(guardadoMeta(x.id))}`)),a.reduce((s,x)=>s+alvoMeta(x),0));}
    else if(key==='metas batidas'){formula='Metas com saldo guardado maior ou igual ao alvo cadastrado.';add('Situação de cada meta',a.map(x=>row(x.nome,guardadoMeta(x.id)>=alvoMeta(x)?'Batida':'Em andamento',`Guardado ${R(guardadoMeta(x.id))} / alvo ${R(alvoMeta(x))}`,'text')));}
    else{formula='Soma dos saldos guardados em metas, sem a reserva de emergência.';add('Saldo por meta',a.map(x=>row(x.nome,guardadoMeta(x.id),`Alvo ${R(alvoMeta(x))}`)),a.reduce((s,x)=>s+guardadoMeta(x.id),0));}
  }else if(view==='reserva'){
    const med=media(),meta=S.metas.find(x=>x.reserva);formula=key.startsWith('ideal')?'Ideal = gasto médio × 6, arredondado para a centena mais próxima.':key.startsWith('previsao')?'Previsão baseada no ritmo líquido de aportes dos últimos três meses.':'Gasto médio calculado nos meses com histórico, dentre os últimos três meses fechados; sem histórico, utiliza o mês atual.';
    let ms=[1,2,3].map(k=>addMes(MES_ATUAL,-k)).filter(mes=>S.base.some(x=>x.mes===mes));if(!ms.length)ms=[MES_ATUAL];
    add('Gastos usados na média',ms.map(mes=>row(nomeMes(mes),S.base.filter(x=>x.mes===mes&&x.tipo==='gasto').reduce((s,x)=>s+x.valor,0))));line('Gasto médio mensal',med.gas);line('Reserva guardada',reservaAtual());line('Referência de 6 meses',reservaIdeal());
    if(meta){line('Alvo cadastrado',meta.alvo);line('Falta para o alvo',Math.max(0,meta.alvo-guardadoMeta(meta.id)));line('Previsão',previsaoMeta(meta).txt,'','text');}
  }else if(view==='investimentos'){
    const a=S.invest,aplicado=a.reduce((s,x)=>s+x.aplicado,0),atual=totalInvest();
    if(key==='aportes no mes'){formula='Aportes do mês atual − resgates do mês atual, sem transferências para metas.';const rr=resumo(MES_ATUAL);transactions('Movimentações de investimentos',rr.ef.filter(i=>!i.meta_id&&(i.tipo==='aporte'||i.tipo==='resgate')),true);}
    else{formula=key==='rentabilidade'?'Rentabilidade = (valor atual − capital aplicado) ÷ capital aplicado × 100. Não é rentabilidade anualizada.':key==='resultado'?'Resultado = soma dos valores atuais − soma do capital aplicado.':'Patrimônio investido = soma dos valores atuais cadastrados.';line('Valor atual total',atual);line('Capital aplicado total',aplicado);line('Diferença',atual-aplicado);add('Aplicações cadastradas',a.map(x=>row(x.produto||x.nome||(INVT[x.tipo]||{}).nome||x.tipo,x.valor,`${x.nome||''} · aplicado ${R(x.aplicado)} · resultado ${R(x.valor-x.aplicado)} · ${x.instituicao||'Instituição não informada'}`)),atual);}
    nota='Valores cadastrados no dashboard. Não são atualizados automaticamente pela cotação de mercado.';
  }else if(view==='patrimonio'||view==='relmes'){
    if(view==='relmes'&&(key==='entradas'||key==='gastos')){const type=key==='entradas'?'entrada':'gasto';formula='Soma dos lançamentos realizados do tipo selecionado no mês.';transactions('Lançamentos de '+nomeMes(m),r.ef.filter(i=>i.tipo===type));}
    else if(view==='relmes'&&key==='investimentos e metas'){formula='Investimentos e metas = aportes líquidos em investimentos + aportes líquidos em metas e reserva.';transactions('Aportes menos resgates',r.ef.filter(i=>i.tipo==='aporte'||i.tipo==='resgate'),true);line('Investimentos líquidos',r.investido);line('Metas e reserva líquidas',r.guardado);}
    else{const period=view==='patrimonio'?MES_ATUAL:m,pat=patrimonioEm(period);formula=key==='caixa + metas'?'Caixa + saldos das metas e reserva na data de referência.':key==='investimentos'?'Valor dos investimentos na data de referência.':key==='dividas'?'Saldo devedor das dívidas na data de referência.':key==='caixa atual'||key==='saldo final do mes'?'Caixa = saldo inicial + entradas e resgates − saídas confirmadas até a data de referência.':'Patrimônio líquido = caixa + metas e reserva + investimentos − dívidas.';line('Caixa',pat.caixa);line('Metas e reserva',pat.metas);line('Investimentos',pat.invest);line('Dívidas',-pat.dividas);line('Patrimônio líquido',pat.liquido);nota='Referência: '+nomeMes(period)+'. Meses passados usam o histórico de lançamentos; o mês atual usa os valores atuais do dashboard.';}
  }else if(view==='desejos'){
    let a=S.desejos;if(key==='prioridade alta')a=a.filter(x=>x.status==='aberto'&&x.prioridade===1);else if(key==='viraram meta')a=a.filter(x=>x.status==='meta');else a=a.filter(x=>x.status==='comprado');formula='Quantidade de desejos com o status indicado no card.';line('Quantidade',a.length,'','text');add('Desejos incluídos',a.map(x=>row(x.nome,x.valor,`Status: ${x.status} · prioridade ${x.prioridade}`)),total(a));
  }else if(view==='retro'){
    const a=(S.retro[S.ano]||[]).filter(i=>i.data<=HOJE),meses=[...new Set(a.map(i=>i.mes))];const por=meses.map(mes=>{const its=a.filter(i=>i.mes===mes),ent=total(its.filter(i=>i.tipo==='entrada')),gas=total(its.filter(i=>i.tipo==='gasto'));return {mes,its,ent,gas,saldo:ent-gas}});
    if(key.startsWith('mes campeao')||key==='mes mais apertado'){const p=[...por].sort((a,b)=>key.startsWith('mes campeao')?b.saldo-a.saldo:a.saldo-b.saldo)[0];formula='Comparação dos resultados (entradas − gastos) entre os meses com lançamentos.';if(p){line('Mês',nomeMes(p.mes),'','text');line('Entradas',p.ent);line('Gastos',p.gas);line('Resultado',p.saldo);transactions('Lançamentos do mês',p.its.filter(i=>['entrada','gasto'].includes(i.tipo)));}}
    else if(key==='categoria que mais pesou'){const cats=porCategoria(a),top=Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];formula='Categoria com maior soma de gastos realizados no ano.';if(top)transactions((CAT[top[0]]||{nome:top[0]}).nome,a.filter(i=>i.tipo==='gasto'&&i.categoria===top[0]));}
    else if(key==='maior gasto'){formula='Maior gasto realizado no ano visível para esta conta.';const maior=a.filter(i=>i.tipo==='gasto'&&!outroLivre(i)).sort((a,b)=>b.valor-a.valor)[0];transactions('Lançamento',maior?[maior]:[]);}
    else if(key==='gasto no cartao'){formula='Soma dos gastos feitos no cartão durante o ano.';transactions('Compras no cartão',a.filter(i=>i.tipo==='gasto'&&i.cartao_id));}
    else if(key==='meses no azul'){formula='Quantidade de meses com entradas maiores ou iguais aos gastos.';add('Resultado por mês',por.map(x=>row(nomeMes(x.mes),x.saldo,x.saldo>=0?'No azul':'No vermelho')));}
    else if(key==='media guardada por mes'){formula='(Aportes − resgates no ano) ÷ meses com lançamentos.';transactions('Transferências',a.filter(i=>i.tipo==='aporte'||i.tipo==='resgate'),true);line('Meses considerados',meses.length,'','text');}
    else{formula='Gastos realizados no ano ÷ quantidade de meses com lançamentos.';add('Gastos por mês',por.map(x=>row(nomeMes(x.mes),x.gas)),total(a.filter(i=>i.tipo==='gasto')));line('Meses considerados',meses.length,'','text');}
    nota='Ano '+S.ano+'. Lançamentos previstos, cancelados e posteriores a hoje não entram nos destaques.';
  }else if(view==='geral'){
    if(key.startsWith('previsao')){formula='Previsão de caixa = caixa atual + entradas previstas − compromissos pendentes.';line('Caixa atual',sm.caixa);line('Ainda entra',sm.entra);line('Ainda sai',-sm.sai);line('Previsão',sm.previsao);add('Entradas previstas',sm.itens.filter(e=>e.entra).map(ev),sm.entra);add('Saídas previstas',sm.itens.filter(e=>e.sai).map(ev));line('Atrasados anteriores',sm.atrCartao+sm.atrContas);}
    else{formula='Caixa atual = saldo inicial cadastrado + saldo líquido de todas as movimentações confirmadas de caixa até hoje.';line('Saldo inicial cadastrado',S.saldoInicial);line('Movimentações líquidas confirmadas',S.movCaixa);line('Em caixa hoje',emCaixa());nota='Movimentações líquidas incluem entradas e resgates menos gastos, aportes e pagamentos confirmados. Compras no cartão pendentes não saem do caixa até pagar a fatura.';}
  }else if(view==='fatura'){
    const card=S.cartoes.find(c=>c.id===S.fatView?.cartao);if(card){const d=dadosFatura(card,S.fatView.fm);let a=d.it;if(key==='ja paga')a=a.filter(x=>x.status==='pago');else if(key==='a pagar')a=a.filter(x=>x.status==='comprometido');
    formula=key==='a pagar'?'Compras e parcelas comprometidas nesta fatura.':key==='ja paga'?'Compras e parcelas com pagamento confirmado nesta fatura.':key==='lancamentos'?'Quantidade de compras cadastradas + recorrências ainda previstas para a fatura.':'Soma de todas as compras cadastradas na fatura; previsões extras aparecem separadas.';
    transactions('Compras da fatura',a);if(key==='lancamentos'||key==='total da fatura')transactions('Recorrências ainda previstas',d.prev);line('Período da fatura',dataLonga(d.per.ini)+' até '+dataLonga(d.per.fim),'','text');line('Vencimento',dataLonga(d.venc),'','text');}
  }else{
    formula='Valores registrados na tela selecionada.';line('Saldo em caixa',sm.caixa);line('Compromissos pendentes',sm.compromissos);nota='Consulte também os lançamentos do período para acompanhar a composição.';
  }
  return {formula,nota,lines,groups};
}
function modalCardDetalhe(snapshot){
  const d=snapshot.dados||dadosCardDetalhe(snapshot.origem,snapshot.titulo,snapshot.fechado),volta=snapshot.origem==='fatura'?{...S.fatView}:null;
  const fmt=r=>r.tipo==='text'?esc(r.value):R(r.value);
  const linha=(r,extra='')=>`<div class="card-detail-row ${extra}"><span>${esc(r.label)}${r.detail?`<small>${esc(r.detail)}</small>`:''}</span><b class="${r.tipo==='text'?'':cS(r.value)}">${fmt(r)}</b></div>`;
  modal(`<h2>${esc(snapshot.titulo)}</h2><div class="card-detail-layout"><div class="card-detail-summary"><div class="card-detail-value">${esc(snapshot.valor)}</div>${snapshot.sub?`<p class="card-detail-note">${esc(snapshot.sub)}</p>`:''}<div class="card-detail-formula">${esc(d.formula)}</div>${d.lines.length?`<div class="card-detail-group"><h3>Como o valor é formado</h3>${d.lines.map(x=>linha(x)).join('')}</div>`:''}${d.nota?`<p class="card-detail-note">${esc(d.nota)}</p>`:''}</div><div class="card-detail-groups">${d.groups.map(g=>`<section class="card-detail-group"><h3>${esc(g.title)}</h3><div class="card-detail-items ${g.rows.length>10?'many':''}">${g.rows.length?g.rows.map(x=>linha(x)).join(''):'<p class="card-detail-note">Nenhum item neste grupo.</p>'}</div>${g.total!==undefined?linha({label:'Total deste grupo',value:g.total},'total'):''}</section>`).join('')}</div></div><div class="btns" style="margin-top:18px"><button class="btn ghost" data-m="cancelar">${volta?'Voltar à fatura':'Fechar'}</button></div>`);
  if(volta)S.fatVoltar=volta;
}

/* ================= modal ================= */
let onSave=null;
function modal(html,salvar){
  S.fatAtiva=false;$('mdl').innerHTML=html;onSave=salvar||null;fecharDP();fecharSel();soNumeros($('mdl'));melhorarDatas($('mdl'));melhorarSelects($('mdl'));melhorarArquivos($('mdl'));layoutModal();if(!$('dlg').open)$('dlg').showModal();$('dlg').scrollTop=0;marcarValores($('mdl'));ligarTabelas($('mdl'));ligarCardsDetalhes($('mdl'));caberModal();
  const f=$('mdl').querySelector('input.big,input:not([type=checkbox])');if(f&&salvar)setTimeout(()=>f.focus(),40);
  $('mdl').querySelectorAll('.seg,.chips').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!g.contains(b))return;g.querySelectorAll(':scope>button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(g.dataset.onchange&&window[g.dataset.onchange])window[g.dataset.onchange](b)}));
}
function fechar(){S.fatAtiva=false;S.fatVoltar=null;if($('dlg').open)$('dlg').close()}
/* feedback visual de "salvo": selo animado no centro da tela */
function feedbackSalvo(txt){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const d=document.createElement('div');d.className='salvo-pop';d.setAttribute('role','status');
  d.innerHTML=`<svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23"/><path d="M15 27l7.5 7.5L38 19"/></svg><span>${esc(txt||'Salvo!')}</span>`;
  document.body.append(d);setTimeout(()=>d.classList.add('sai'),1050);setTimeout(()=>d.remove(),1500);
}
$('mdlX').addEventListener('click',()=>voltarOuFechar());
$('dlg').addEventListener('cancel',e=>{if(S.fatVoltar){e.preventDefault();voltarOuFechar()}});
/* encaixa a janela na tela: compacta em etapas e, se preciso, usa mais colunas */
function caberModal(){
  const d=$('dlg'),m=$('mdl');if(!d.open)return;
  d.classList.remove('cmp1','cmp2','cmp3');
  if(innerWidth>760&&m.getBoundingClientRect().height>innerHeight-48)d.classList.add('cmp2');
}
addEventListener('resize',()=>{clearTimeout(window.__cm);window.__cm=setTimeout(caberModal,120)});
const __moMdl=new MutationObserver(()=>{clearTimeout(window.__cm2);window.__cm2=setTimeout(()=>{marcarValores($('mdl'));caberModal()},30)});
__moMdl.observe($('mdl'),{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
function layoutModal(){
  const m=$('mdl'),kids=[...m.children];
  for(let i=0;i<kids.length;i++){const k=kids[i],nx=kids[i+1];
    if(k.tagName==='LABEL'&&!k.querySelector('input,select,textarea')&&nx){const w=document.createElement('div');w.className='fg';k.before(w);w.append(k,nx);i++}}
  const blocos=[...m.children].filter(el=>!el.matches('h2,.btns,.erro'));
  const pesado=blocos.reduce((s,el)=>s+(el.querySelectorAll('.chip').length>8?2:1),0);
  const d=$('dlg');d.classList.remove('c1','c2','c3','mg','card-details');
  if(m.querySelector('.card-detail-layout'))d.classList.add('card-details');
  else if(m.querySelector('.novo-grid,.mais,.pj-facts,.fat-view'))d.classList.add('mg');
  else d.classList.add(pesado<=3?'c1':pesado<=7?'c2':'c3');
}
$('mdl').addEventListener('click',async e=>{
  const b=e.target.closest('[data-m]');if(!b)return;
  if(b.dataset.m==='cancelar')return voltarOuFechar();
  if((b.dataset.m==='res-devolver'||b.dataset.m==='res-apagar')&&S._resExcluir){const {m,g}=S._resExcluir;b.disabled=true;let error;
    if(b.dataset.m==='res-devolver'){({error}=await sb.from('lancamentos').insert({tipo:'resgate',valor:g,descricao:'Resgate: '+m.nome,categoria:'meta',data:HOJE,meta_id:m.id,status:'pago'}));
      if(!error)({error}=await sb.from('metas').update(S.temV10?{arquivada:true,reserva:false}:{reserva:false}).eq('id',m.id))}
    else({error}=await sb.from('metas').delete().eq('id',m.id));
    b.disabled=false;if(error){$('mdl').querySelector('.erro').textContent='Não deu para remover: '+error.message;return}
    S._resExcluir=null;fechar();toast(b.dataset.m==='res-devolver'?'Valor devolvido ao caixa e reserva removida':'Reserva e histórico apagados');recarregar();return}
  if(b.dataset.m==='ir-cartao'){const o={valor:parseValor(val('mValor')),desc:val('mDesc'),cat:sel('cat'),data:val('mData'),livre:!!$('mdl').querySelector('#mLivre')?.checked};return modalCompraCartao(o)}
  if(b.dataset.m==='salvar'&&onSave){
    const err=$('mdl').querySelector('.erro');err.textContent='';b.disabled=true;
    try{const msg=await onSave();if(msg){err.textContent=msg}else{const v=S.fatVoltar;fechar();feedbackSalvo();await recarregar();if(v)abrirFaturas(v.cartao,v.fm)}}
    catch(x){err.textContent='Não deu para salvar: '+(x&&x.message||'tente de novo.')}
    finally{b.disabled=false}
  }
});
const sel=g=>$('mdl').querySelector(`[data-g="${g}"] [aria-pressed="true"]`)?.dataset.v;
const val=id=>$('mdl').querySelector('#'+id)?.value||'';
const btns=(txt,perigo)=>`<div class="erro" role="alert"></div><div class="btns"><button class="btn ghost" data-m="cancelar">Cancelar</button><button class="btn ${perigo?'danger':''}" data-m="salvar">${txt}</button></div>`;
const chipsCat=(lista,atual)=>lista.map(c=>`<button type="button" class="chip" data-v="${c.id}" aria-pressed="${c.id===atual}">${c.em} ${esc(c.nome)}</button>`).join('');
const dataPadrao=()=>S.mes===MES_ATUAL?HOJE:S.mes+'-01';
function confirmar(titulo,texto,botao,acao){modal(`<h2>${titulo}</h2><p class="mut" style="margin:-6px 0 18px">${texto}</p>${btns(botao,true)}`,acao)}
function info(titulo,html){modal(`<h2>${titulo}</h2>${html}<div class="btns" style="margin-top:16px"><button class="btn" data-m="cancelar">Entendi</button></div>`)}

/* ---------- lançamento (com cartão e parcelas) ---------- */
window.__trocaMeio=b=>{const cr=b.dataset.v==='credito';['#credWrap'].forEach(s=>{const el=$('mdl').querySelector(s);if(el)el.hidden=!cr});['#situWrap'].forEach(s=>{const el=$('mdl').querySelector(s);if(el)el.hidden=cr});const l=$('mdl').querySelector('#lblDataL');if(l)l.firstChild.textContent=cr?'Data da compra':'Data';layoutModal()};
window.__trocaTipo=b=>{const t=b.dataset.v,lista=t==='gasto'?CATS_G:CATS_E;$('mdl').querySelector('[data-g="cat"]').innerHTML=chipsCat(lista,lista[0].id);if(t!=='gasto'){const c=$('mdl').querySelector('#credWrap');if(c)c.hidden=true;const s=$('mdl').querySelector('#situWrap');if(s)s.hidden=false}
  ['#meioWrap','#livreWrap'].forEach(s=>{const el=$('mdl').querySelector(s);if(el)el.hidden=t!=='gasto'});
  const sw=$('mdl').querySelector('[data-g="situ"]');if(sw){const bs=sw.querySelectorAll('button');bs[0].textContent=t==='gasto'?'Já paguei':'Já recebi';bs[1].textContent=t==='gasto'?'Vou pagar (agendar)':'Vou receber (prevista)'}};
const MEIOS=[['pix','Pix'],['debito','Débito'],['credito','Crédito'],['dinheiro','Dinheiro'],['transferencia','Transferência'],['boleto','Boleto']];
const meioChips=(atual,semCredito)=>MEIOS.filter(m=>!(semCredito&&m[0]==='credito')).map(m=>`<button type="button" class="chip" data-v="${m[0]}" aria-pressed="${m[0]===(atual||'pix')}">${m[1]}</button>`).join('');
const cartaoChips=(atual)=>S.cartoes.map((c,k)=>`<button type="button" class="chip" data-v="${c.id}" aria-pressed="${atual?c.id===atual:k===0}">💳 ${esc(c.nome)}</button>`).join('');
const donoChips=(atual)=>Object.keys(S.nomes).map(e=>`<button type="button" class="chip chip-dono" data-v="${esc(e)}" aria-pressed="${e===(atual||S.me)}" style="--dc:${corDono(e)}"><i class="dono-dot"></i>${esc((S.nomes[e]||e).split(' ')[0])}</button>`).join('');
const donoBox=(atual)=>S.temV11?`<label style="margin-bottom:0">De quem é?</label><div class="chips" data-g="dono">${donoChips(atual)}</div>`:'';
/* fatura escolhida pela pessoa (item 2): por padrão, a fatura em que a data da compra cai */
function opcoesFatura(card,dataISO,escolhida){
  const auto=mesFatura(card,dataISO);const lista=[];for(let k=-1;k<=6;k++)lista.push(addMes(auto,k));
  return lista.map(fm=>`<option value="${fm}" ${fm===(escolhida||auto)?'selected':''}>Fatura de ${soMes(refDe(card,fm))} · fecha ${dataBR(fechamentoFatura(card,fm))} · vence ${dataBR(vencFatura(card,fm))}${fm===auto?' ✓':''}</option>`).join('');
}
function parseTags(s){return [...new Set(String(s||'').split(/[,;]+/).map(t=>t.trim().replace(/^#+/,'').toLowerCase().slice(0,24)).filter(Boolean))].slice(0,6)}
const extrasBox=(x)=>S.temV10?`<div class="fg extras"><label>Tags (opcional)<input class="field" id="mTags" maxlength="120" placeholder="Ex.: viagem, casamento" value="${esc((x&&x.tags||[]).join(', '))}"></label>
  <label>Observação (opcional)<input class="field" id="mNota" maxlength="200" placeholder="Algum detalhe para lembrar depois" value="${esc(x&&x.nota||'')}"></label>
  <label>Comprovante (opcional)<input class="field" id="mAnexo" type="file" accept="image/*,application/pdf">${x&&x.anexo?'<small class="mut">Já tem um arquivo anexado. Escolha outro para substituir.</small>':''}</label></div>`:'';
async function lerExtras(){
  if(!S.temV10)return {};
  const o={tags:parseTags(val('mTags')),nota:val('mNota').trim().slice(0,200)};
  const f=$('mdl').querySelector('#mAnexo')?.files?.[0];
  if(f){if(f.size>10*1024*1024)throw new Error('O comprovante pode ter no máximo 10 MB.');
    const nome=f.name.normalize('NFD').replace(/[^\w.\-]+/g,'_').slice(-60),path=`${uuid()}/${nome}`;
    const {error}=await sb.storage.from('anexos').upload(path,f,{upsert:false,contentType:f.type||undefined});
    if(error)throw new Error('Não deu para enviar o comprovante: '+error.message);o.anexo=path}
  return o;
}
const livreBox=(on)=>S.temV6?`<div id="livreWrap"><label class="chk"><input type="checkbox" id="mLivre" ${on?'checked':''}> 💸 Pago com meu dinheiro pessoal</label></div>`:'';
/* gasto ou entrada imediata (Pix, débito, dinheiro) — ou agendada */
function modalLancamento(tipo,item,o={}){
  if(item)return modalEditarLanc(item);
  const lista=tipo==='gasto'?CATS_G:CATS_E,cat=o.cat||lista[0].id,data=o.data||dataPadrao(),meio0=o.meio||'pix';
  modal(`<h2>${tipo==='entrada'?'Nova entrada':'Novo gasto'}</h2>
    <div class="seg" data-g="tipo" data-onchange="__trocaTipo"><button type="button" data-v="gasto" aria-pressed="${tipo==='gasto'}">Gasto</button><button type="button" data-v="entrada" aria-pressed="${tipo==='entrada'}">Entrada</button></div>
    <label>Valor (R$)<input class="field big" id="mValor" inputmode="decimal" autocomplete="off" placeholder="0,00" value="${o.valor?fmtInput(o.valor):''}"></label>
    <label style="margin-bottom:0">Categoria</label><div class="chips" data-g="cat">${chipsCat(lista,cat)}</div>
    <div id="meioWrap" ${tipo==='gasto'?'':'hidden'}><label style="margin-bottom:0">Forma de pagamento</label><div class="chips" data-g="meio" data-onchange="__trocaMeio">${meioChips(meio0)}</div></div>
    <div id="credWrap" ${tipo==='gasto'&&meio0==='credito'?'':'hidden'}>${S.cartoes.length?`<label style="margin-bottom:0">Cartão</label><div class="chips" data-g="cartao">${cartaoChips()}</div>
      <label>Parcelas<input class="field" id="mParc" type="number" min="1" max="24" value="${o.n||1}"></label>
      <label class="chk"><input type="checkbox" id="mRec"> 🔁 Repetir todo mês neste cartão (assinatura, academia…)</label>
      <p class="mut" style="font-size:13px;margin:4px 0 14px">No crédito, o gasto conta na data da compra e a fatura do cartão aumenta. O caixa só muda quando a fatura for paga.</p>`
      :`<p class="mut">Nenhum cartão cadastrado. <button type="button" class="lnk" data-act="cartao-novo">Cadastrar cartão</button></p>`}</div>
    ${donoBox(o.dono)}
    <label id="lblDataL">${meio0==='credito'?'Data da compra':'Data'}<input class="field" id="mData" type="date" value="${data}"></label>
    <details class="mais-det"><summary>Mais detalhes <small>descrição, situação, tags, anexo</small></summary>
      <label>Descrição (opcional)<input class="field" id="mDesc" maxlength="80" autocomplete="off" placeholder="${tipo==='entrada'?'Ex.: salário':'Ex.: feira do sábado'}" value="${esc(o.desc||'')}"></label>
      <div id="situWrap" ${tipo==='gasto'&&meio0==='credito'?'hidden':''}><label style="margin-bottom:0">Situação</label><div class="seg" data-g="situ"><button type="button" data-v="pago" aria-pressed="true">${tipo==='gasto'?'Já paguei':'Já recebi'}</button><button type="button" data-v="previsto" aria-pressed="false">${tipo==='gasto'?'Vou pagar (agendar)':'Vou receber (prevista)'}</button></div><p class="mut" style="font-size:13px;margin:6px 0 14px">Com data futura, o lançamento é agendado automaticamente.</p></div>
      ${tipo==='gasto'?livreBox(o.livre):livreBox(false).replace('<div id="livreWrap">','<div id="livreWrap" hidden>')}
      ${extrasBox()}
    </details>
    ${btns('Salvar')}`,
  async()=>{
    const valor=parseValor(val('mValor')),d=val('mData'),desc=val('mDesc').trim().slice(0,80),categoria=sel('cat'),t=sel('tipo');
    const meio=t==='gasto'?(sel('meio')||'pix'):'',credito=meio==='credito',status=credito?'comprometido':(d>HOJE?'previsto':(sel('situ')||'pago'));
    const dono=S.temV11&&sel('dono')?{dono:sel('dono')}:{};
    if(!valor)return 'Digite um valor maior que zero, por exemplo 45,90.';
    if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return 'Escolha a data.';
    const livre=t==='gasto'&&!!$('mdl').querySelector('#mLivre')?.checked;
    if(credito)return salvarCompraCredito({cardId:sel('cartao'),valor,n:parseInt(val('mParc'),10)||1,d,desc,categoria,livre,dono:sel('dono')||S.me,rec:!!$('mdl').querySelector('#mRec')?.checked,extras:await lerExtras(),after:o.after});
    const ex=await lerExtras();
    const {error}=await sb.from('lancamentos').insert({tipo:t,valor,descricao:desc,categoria,data:d,status,meio,...(livre?{livre:true}:{}),...dono,...ex});
    if(error)throw error;
    if(d.slice(0,7)!==S.mes)S.mes=d.slice(0,7);
    toast(status==='previsto'?'Agendado para '+dataBR(d)+` · ${R0(valor)} ainda não saiu do caixa`:t==='gasto'?`Gasto adicionado · caixa reduzido em ${R(valor)} (agora ${R(emCaixa()-valor)})`:`Entrada registrada · caixa aumentou ${R(valor)} (agora ${R(emCaixa()+valor)})`);
    if(o.after)await o.after();
  });
}
/* compra no crédito (parcelada ou recorrente): uma regra única usada pelo gasto e pela compra no cartão */
async function salvarCompraCredito(c){
  const card=S.cartoes.find(x=>x.id===c.cardId);
  if(!card)return 'Escolham o cartão.';
  const n=Math.max(1,Math.min(48,c.n||1)),dono=S.temV11&&c.dono?{dono:c.dono}:{};
  if(c.rec){
    if(n>1)return 'Uma compra recorrente é cobrada uma vez por mês: deixem 1 parcela.';
    const ini=c.d.slice(0,7),reg={tipo:'gasto',descricao:c.desc||CAT[c.categoria].nome,categoria:c.categoria,valor:c.valor,dia:Number(c.d.slice(8,10)),inicio:ini,ativa:true,auto:true,meio:'credito',cartao_id:card.id,...dono};
    if(c.restantes){if(!S.temV11)return 'Falta rodar o arquivo schema-v11.sql no Supabase para limitar os meses.';reg.fim=addMes(ini,c.restantes-1)}
    const r=await sb.from('recorrentes').insert(reg);
    if(r.error){if(/cartao_id|meio/.test(r.error.message||''))return 'Falta rodar o arquivo schema-v10.sql no Supabase.';if(/dono|fim/.test(r.error.message||''))return 'Falta rodar o arquivo schema-v11.sql no Supabase.';throw r.error}
    toast('Compra recorrente criada: entra todo mês na fatura do '+card.nome+(c.restantes?` (${c.restantes} cobranças)`:''));
  }else{
    const linhas=parcelasCompra(card,c.valor,n,c.d,c.fm).map(p=>({tipo:'gasto',valor:p.valor,descricao:(c.desc||CAT[c.categoria].nome)+(n>1?` (${p.k}/${n})`:''),categoria:c.categoria,data:p.data,
      cartao_id:card.id,compra_id:p.compra,parcela:p.k,parcelas:n,fatura_mes:p.fm,status:'comprometido',meio:'credito',...(c.livre?{livre:true}:{}),...(c.extras||{}),...dono}));
    const {error}=await sb.from('lancamentos').insert(linhas);if(error){if(/dono/.test(error.message||''))return 'Falta rodar o arquivo schema-v11.sql no Supabase.';throw error}
    toast(n>1?`Compra lançada em ${n}x de ${R(linhas[n>1?1:0].valor)}`:`Compra lançada · fatura de ${soMes(refDe(card,linhas[0].fatura_mes))} agora ${R(infoFatura(card,linhas[0].fatura_mes).total+soma(linhas))} (vence ${dataBR(vencFatura(card,linhas[0].fatura_mes))})`);
  }
  if(['contas','gastos','orcamento','calendario'].includes(S.view)&&c.d.slice(0,7)!==S.mes)S.mes=c.d.slice(0,7);
  if(c.after)await c.after();
}
/* compra no crédito: gasto no dia da compra; caixa só muda ao pagar a fatura */
function modalCompraCartao(o={}){
  if(!S.cartoes.length){info('Nenhum cartão cadastrado',`<p>Cadastrem um cartão primeiro, com os dias de fechamento e vencimento.</p><button class="btn" data-act="cartao-novo">${svg('plus')}Cadastrar cartão</button>`);return}
  const card0=S.cartoes.find(c=>c.id===o.cartao)||S.cartoes[0],d0=o.data||HOJE;
  modal(`<h2>${o.fm?'Adicionar compra na fatura':'Compra no cartão'}</h2>
    <label style="margin-bottom:0">Cartão</label><div class="chips" data-g="cartao">${cartaoChips(card0.id)}</div>
    <div class="row2"><label>Valor total (R$)<input class="field big" id="mValor" inputmode="decimal" placeholder="0,00" value="${o.valor?fmtInput(o.valor):''}"></label>
    <label>Parcelas<input class="field big" id="mParc" type="number" min="1" max="48" value="${o.n||1}"></label></div>
    <label>Descrição<input class="field" id="mDesc" maxlength="80" placeholder="Ex.: TV da sala" value="${esc(o.desc||'')}"></label>
    <label>Data da compra<input class="field" id="mData" type="date" value="${d0}"></label>
    <label id="fatWrap">Fatura (✓ = pela data da compra)<select class="field" id="mFat">${opcoesFatura(card0,d0,o.fm)}</select></label>
    <label class="chk"><input type="checkbox" id="mRec" ${o.rec?'checked':''}> 🔁 Repetir todo mês (assinatura, academia…)</label>
    <label id="restWrap" hidden>Quantas cobranças faltam, contando a deste mês? (opcional)<input class="field" id="mRest" type="number" min="1" max="120" placeholder="Ex.: 8 · vazio = sem fim"></label>
    <label style="margin-bottom:0">Categoria</label><div class="chips" data-g="cat">${chipsCat(CATS_G,o.cat||'compras')}</div>
    ${donoBox(o.dono)}
    ${livreBox(o.livre)}
    <div class="sim-depois" id="cpResumo" style="margin-bottom:14px"></div>
    ${extrasBox()}
    ${btns('Lançar compra')}`,
  async()=>{
    const valor=parseValor(val('mValor')),d=val('mData'),rest=parseInt(val('mRest'),10)||0;
    if(!valor)return 'Digite o valor da compra.';if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return 'Escolha a data.';
    return salvarCompraCredito({cardId:sel('cartao'),valor,n:parseInt(val('mParc'),10)||1,d,fm:$('mdl').querySelector('#mFat').value,desc:val('mDesc').trim().slice(0,70),categoria:sel('cat'),dono:sel('dono'),
      livre:!!$('mdl').querySelector('#mLivre')?.checked,rec:!!$('mdl').querySelector('#mRec')?.checked,restantes:rest,extras:await lerExtras(),after:o.after});
  });
  let manual=!!o.fm;
  const fatSel=$('mdl').querySelector('#mFat');fatSel.addEventListener('change',()=>{manual=true;upd()});
  const upd=()=>{const card=S.cartoes.find(c=>c.id===sel('cartao')),v=parseValor(val('mValor')),rec=$('mdl').querySelector('#mRec').checked,n=rec?1:Math.max(1,Math.min(48,parseInt(val('mParc'),10)||1)),d=val('mData');const el=$('mdl').querySelector('#cpResumo');
    $('mdl').querySelector('#mParc').disabled=rec;$('mdl').querySelector('#restWrap').hidden=!rec;$('mdl').querySelector('#fatWrap').hidden=rec;
    if(card&&/^\d{4}-\d{2}-\d{2}$/.test(d)){const keep=manual?fatSel.value:null;fatSel.innerHTML=opcoesFatura(card,d,keep)}
    if(!card||!v||!/^\d{4}-\d{2}-\d{2}$/.test(d)){el.innerHTML='<span class="mut">Preencham o valor para ver onde a compra cai.</span>';return}
    const fm=rec?null:fatSel.value,ps=parcelasCompra(card,v,n,d,fm),rst=parseInt(val('mRest'),10)||0;
    el.innerHTML=rec?`<div class="sd-l"><span>Conta como gasto</span><span><b class="neg">${R(v)} por mês</b> · ${rst?`${rst} cobranças, de ${mesAno(d.slice(0,7))} a ${mesAno(addMes(d.slice(0,7),rst-1))}`:'a partir de '+mesAno(d.slice(0,7))}</span></div><div class="sd-l"><span>Primeira fatura</span><span>de <b class="ref">${soMes(refDe(card,ps[0].fm))}</b> · vence ${dataBR(vencFatura(card,ps[0].fm))}</span></div><div class="sd-l"><span>Caixa hoje</span><span><b class="pos">não muda</b> · sai ao pagar cada fatura</span></div>`
     :`<div class="sd-l"><span>Conta como gasto em</span><span><b class="neg">${n>1?R(ps[0].valor)+' por mês':R(v)}</b> · ${n>1?mesAno(ps[0].data.slice(0,7))+' a '+mesAno(ps[n-1].data.slice(0,7)):mesAno(d.slice(0,7))}</span></div>
      <div class="sd-l"><span>${n>1?'Primeira fatura':'Fatura'}</span><span>de <b class="ref">${soMes(refDe(card,ps[0].fm))}</b> · fecha ${dataBR(fechamentoFatura(card,ps[0].fm))} · vence ${dataBR(vencFatura(card,ps[0].fm))}</span></div><div class="sd-l"><span>Caixa hoje</span><span><b class="pos">não muda</b> · sai ao pagar a fatura</span></div>`};
  ['mValor','mParc','mData','mRest'].forEach(id=>$('mdl').querySelector('#'+id).addEventListener('input',upd));$('mdl').querySelector('#mRec').addEventListener('change',upd);$('mdl').querySelector('[data-g="cartao"]').addEventListener('click',()=>{manual=false;setTimeout(upd,0)});upd();
}
function parcelasCompra(card,valor,n,d,fmEscolhida){
  const fm0=fmEscolhida||mesFatura(card,d),compra=uuid(),base=Math.floor(valor/n*100)/100,resto=Math.round((valor-base*n)*100)/100,dia=Number(d.slice(8,10));
  return [...Array(n)].map((_,k)=>({k:k+1,compra,valor:Math.round((base+(k===0?resto:0))*100)/100,data:diaNoMes(addMes(d.slice(0,7),k),dia),fm:addMes(fm0,k)}));
}
/* editar um lançamento existente: vale só para ele */
function modalEditarLanc(item){
  const lista=item.tipo==='entrada'?CATS_E:CATS_G;
  modal(`<h2>Editar lançamento</h2>
    ${item.compra_id&&item.parcelas>1?'<p class="mut" style="margin:-6px 0 14px;font-size:13.5px">É uma parcela de compra no cartão: a alteração vale só para esta parcela.</p>':''}
    ${item.recorrente_id?'<p class="mut" style="margin:-6px 0 14px;font-size:13.5px">Vale só para esta ocorrência. Para mudar todos os meses, usem ⚙️ em Contas.</p>':''}
    <label>Valor (R$)<input class="field big" id="mValor" inputmode="decimal" value="${fmtInput(item.valor)}"></label>
    <label>Descrição<input class="field" id="mDesc" maxlength="80" value="${esc(item.descricao)}"></label>
    ${item.tipo==='gasto'||item.tipo==='entrada'?`<label style="margin-bottom:0">Categoria</label><div class="chips" data-g="cat">${chipsCat(lista,item.categoria)}</div>`:''}
    <label>Data${item.cartao_id?' do gasto':''}<input class="field" id="mData" type="date" value="${item.data}"></label>
    ${item.tipo==='gasto'&&!outroLivre(item)?livreBox(ehLivre(item)):''}
    ${extrasBox(item)}
    ${btns('Salvar alterações')}`,
  async()=>{
    const valor=parseValor(val('mValor')),d=val('mData');if(!valor)return 'Digite um valor válido.';if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return 'Escolha a data.';
    const up={valor,descricao:val('mDesc').trim().slice(0,80),data:d};if(sel('cat'))up.categoria=sel('cat');
    if(item.tipo==='gasto'&&$('mdl').querySelector('#mLivre'))up.livre=!!$('mdl').querySelector('#mLivre').checked;
    if(item.recorrente_id&&(valor!==item.valor||d!==item.data))up.editado=true;
    if(item.status==='pago'&&!item.cartao_id&&d!==item.data)up.data_caixa=d;
    if(item.cartao_id&&d!==item.data){const cd=S.cartoes.find(c=>c.id===item.cartao_id);if(cd&&item.fatura_mes===mesFatura(cd,item.data))up.fatura_mes=mesFatura(cd,d)}
    Object.assign(up,await lerExtras());
    const {error}=await sb.from('lancamentos').update(up).eq('id',item.id);if(error)throw error;toast('Lançamento atualizado');
  });
}
/* "+ Novo": um só lugar para registrar qualquer fato financeiro */
/* projeção do mês, detalhada */
function modalProjecao(){
  const sm=situacaoMes(),r0=resumo(MES_ATUAL),lp=linhasProjecao(sm),mc=soMes(MES_ATUAL),fim=MES_ATUAL+'-'+pad(ultimoDia(MES_ATUAL));
  const feitos=[...r0.ef].sort((a,b)=>b.data.localeCompare(a.data)||b.criadoEm-a.criadoEm);
  const aCartaoMes=soma(r0.ef.filter(i=>i.tipo==='gasto'&&i.cartao_id&&i.status==='comprometido')),saiuCaixa=cent(r0.gastos-aCartaoMes);
  const fato=(t,v,c,s,det)=>`<div class="fact${det?' fact-click':''}"${det?` data-act="det-fluxo" data-k="${det}" role="button" tabindex="0" title="Ver tudo detalhado"`:''}><small>${t}</small><b class="${c}">${v}</b>${s?`<small>${s}</small>`:''}</div>`;
  modal(`<h2>Projeção de ${esc(mc)}</h2>
    <div class="pj-facts">
      ${fato('Em caixa hoje',R(sm.caixa),cS(sm.caixa))}
      ${fato('Já entrou no mês',R(r0.entradas),r0.entradas?'pos':'zero','','jaEntrou')}
      ${fato('Já saiu do caixa',R(saiuCaixa),saiuCaixa?'neg':'zero',aCartaoMes>0.004?`+ ${R0(aCartaoMes)} no cartão, a pagar na fatura`:'','jaSaiu')}
      ${fato('Ainda entra',R(sm.entra),sm.entra?'pos':'zero','salários e entradas previstas','aEntrar')}
      ${fato('Ainda sai',R(sm.sai),sm.sai?'neg':'zero',`${R0(sm.aPagar)} vencidos ou de hoje · ${R0(sm.previsto)} até o fim do mês`,'aSair')}
      ${fato('Previsão para '+dataBR(fim),R(sm.previsao),cS(sm.previsao),'caixa + o que entra − o que sai')}
    </div>
    ${sm.sugestaoMetas>0.5?`<p class="mut" style="margin:0 0 12px">🎯 Sugestão para as metas neste mês: <b class="ref">${R0(sm.sugestaoMetas)}</b>. Não está incluída na previsão: só sai do caixa quando vocês guardarem.</p>`:''}
    <div class="pj-cols">
      <div><div class="side-title" style="padding:0 0 6px">Daqui até o fim do mês</div><div class="pj-lista">
        <div class="tl-l tl-h"><span>Hoje</span><span></span><b class="${cS(sm.caixa)}">${R0(sm.caixa)}</b></div>
        ${lp.map(l=>`<div class="tl-l"><span>${l.d?dataBR(l.d):'—'}</span><span class="tl-t" title="${esc(l.k||'')}">${l.ic?l.ic+' ':''}${esc(l.t)} <i class="${l.v>0?'pos':'neg'}">${l.v>0?'+':'−'}${R0(Math.abs(l.v))}</i></span><b class="${cS(l.s)}">${R0(l.s)}</b></div>`).join('')||'<p class="mut">Nada mais previsto.</p>'}
        <div class="tl-l tl-h"><span>${dataBR(fim)}</span><span>Final do mês</span><b class="${cS(sm.previsao)}">${R0(sm.previsao)}</b></div></div></div>
      <div><div class="side-title" style="padding:0 0 6px">Já aconteceu em ${esc(mc)}</div><div class="pj-lista">
        ${feitos.length?feitos.map(i=>{const entra=i.tipo==='entrada'||i.tipo==='resgate',tr=i.tipo==='aporte';return `<div class="tl-l"><span>${dataBR(i.data)}</span><span class="tl-t">${catVis(i).em} ${esc(descVis(i))}${i.cartao_id?(i.status==='comprometido'?' · 💳 no cartão, ainda não saiu do caixa':' · 💳'):''}</span><b class="${entra?'pos':tr?'ref':(i.cartao_id&&i.status==='comprometido'?'ref':'neg')}">${entra?'+':'−'}${R0(i.valor)}</b></div>`}).join(''):'<p class="mut">Nenhum lançamento ainda.</p>'}</div></div>
    </div>
    <div class="btns" style="margin-top:14px"><button class="btn ghost" data-go="calendario">Abrir calendário</button><button class="btn" data-m="cancelar">Fechar</button></div>`);
}
function modalNovo(){
  const op=(act,em,t,s)=>`<button class="novo-op" data-act="${act}"><span class="no-em">${em}</span><span><b>${t}</b><small>${s}</small></span></button>`;
  modal(`<h2>O que aconteceu?</h2><div class="novo-grid">
    ${op('n-gasto','💸','Gasto','Pix, débito, crédito, dinheiro ou transferência')}
    ${op('n-entrada','💰','Entrada','Dinheiro recebido ou previsto')}
    ${op('compra-cartao','💳','Compra no cartão','À vista, parcelada ou recorrente')}
    ${op('cr-nova','📅','Conta recorrente','Algo que acontece todo mês')}
    ${op('n-invest','📈','Investimento','Aporte ou resgate')}
    ${op('n-meta','🎯','Guardar em meta','Separar dinheiro para um objetivo')}
    ${op('n-divida','🏦','Pagar dívida','Parcela de empréstimo ou financiamento')}
    ${op('n-transf','🔄','Transferência','Entre caixa, metas, reserva e investimentos')}
    </div><div class="btns" style="margin-top:14px"><button class="btn ghost" data-m="cancelar">Fechar</button></div>`);
}
function modalTransf(){
  const op=(act,em,t,s,extra='')=>`<button class="novo-op" data-act="${act}" ${extra}><span class="no-em">${em}</span><span><b>${t}</b><small>${s}</small></span></button>`;
  const res=S.metas.find(m=>m.reserva);
  modal(`<h2>Transferência</h2><p class="mut" style="margin:-6px 0 14px">Muda onde o dinheiro está, sem contar como gasto nem como entrada.</p><div class="novo-grid">
    ${op('n-meta','🎯','Caixa → meta','Guardar para um objetivo')}
    ${res?op('aporte','🛟','Caixa → reserva','Reforçar a reserva de emergência',`data-id="${res.id}"`):op('reserva-criar','🛟','Criar reserva','E já guardar o primeiro valor')}
    ${op('n-invest','📈','Caixa → investimento','Aplicar dinheiro')}
    ${res?op('resgate','↩️','Reserva → caixa','Usar dinheiro da reserva',`data-id="${res.id}"`):''}
    ${op('n-meta-res','↩️','Meta → caixa','Resgatar dinheiro de uma meta')}
    ${op('n-invest-res','↩️','Investimento → caixa','Resgatar uma aplicação')}
    </div><div class="btns" style="margin-top:14px"><button class="btn ghost" data-m="cancelar">Fechar</button></div>`);
}
function modalEscolherDivida(){
  const ds=S.dividas.filter(d=>infoDivida(d).rest>0);
  if(!ds.length){info('Nenhuma dívida em aberto',`<p>Não há parcelas a pagar.</p><button class="btn" data-act="div-nova">${svg('plus')}Cadastrar dívida</button>`);return}
  if(ds.length===1)return modalPagarDivida(ds[0]);
  modal(`<h2>Pagar qual dívida?</h2><div class="novo-grid">${ds.map(d=>`<button class="novo-op" data-act="div-pagar" data-id="${d.id}"><span class="no-em">🏦</span><span><b>${esc(d.nome)}</b><small>Parcela ${R0(d.parcela)} · saldo ${R0(infoDivida(d).saldo)}</small></span></button>`).join('')}</div><div class="btns" style="margin-top:14px"><button class="btn ghost" data-m="cancelar">Fechar</button></div>`);
}
function modalEscolherMeta(tipo){
  const ms=S.metas.filter(m=>tipo==='aporte'||guardadoMeta(m.id)>0);
  if(!ms.length){info(tipo==='aporte'?'Nenhuma meta ainda':'Nada para resgatar',tipo==='aporte'?`<p>Criem uma meta primeiro.</p><button class="btn" data-act="meta-nova">${svg('plus')}Criar meta</button>`:'<p>Nenhuma meta tem dinheiro guardado.</p>');return}
  if(ms.length===1)return modalAporte(ms[0],tipo);
  modal(`<h2>${tipo==='aporte'?'Guardar em qual meta?':'Resgatar de qual meta?'}</h2><div class="novo-grid">${ms.map(m=>`<button class="novo-op" data-act="${tipo}" data-id="${m.id}"><span class="no-em">${esc(m.emoji)}</span><span><b>${esc(m.nome)}</b><small>${R0(guardadoMeta(m.id))} de ${R0(m.alvo)}</small></span></button>`).join('')}</div><div class="btns" style="margin-top:14px"><button class="btn ghost" data-m="cancelar">Fechar</button></div>`);
}
function modalEscolherInvest(tipo){
  if(!S.invest.length){if(tipo==='aporte')return modalInvest();info('Nada para resgatar','<p>Nenhum investimento cadastrado.</p>');return}
  const op=x=>{const t=INVT[x.tipo]||{nome:'',cor:'#888'};return `<button class="novo-op" data-act="${tipo==='aporte'?'inv-aportar':'inv-resgatar'}" data-id="${x.id}"><span class="no-em"><i class="dot" style="background:${t.cor};width:14px;height:14px"></i></span><span><b>${esc(x.produto||x.nome||t.nome)}${x.produto&&x.nome?' · '+esc(x.nome):''}</b><small>${esc(t.nome)} · ${R0(x.valor)}</small></span></button>`};
  modal(`<h2>${tipo==='aporte'?'Investir':'Resgatar investimento'}</h2><div class="novo-grid">${tipo==='aporte'?`<button class="novo-op" data-act="inv-novo"><span class="no-em">＋</span><span><b>Nova aplicação</b><small>Um investimento que ainda não está na lista</small></span></button>`:''}${S.invest.map(op).join('')}</div><div class="btns" style="margin-top:14px"><button class="btn ghost" data-m="cancelar">Fechar</button></div>`);
}
/* ---------- metas ---------- */
function modalMeta(m){
  modal(`<h2>${m?'Editar meta':'Nova meta'}</h2>
    <label>Nome da meta<input class="field" id="mNome" maxlength="60" placeholder="Ex.: Casamento" value="${esc(m?m.nome:'')}"></label>
    <label style="margin-bottom:0">Ícone</label><div class="chips" data-g="emoji">${EMOJIS_META.map(e=>`<button type="button" class="chip" data-v="${e}" aria-pressed="${(m?m.emoji:'💍')===e}">${e}</button>`).join('')}</div>
    <div class="row2"><label>Quanto precisam (R$)<input class="field" id="mAlvo" inputmode="decimal" placeholder="30.000" value="${m?fmtInput(m.alvo):''}"></label>
    <label>Prazo (opcional)<input class="field" id="mPrazo" type="date" value="${m&&m.prazo?m.prazo:''}"></label></div>
    ${S.temV4?`<label class="chk"><input type="checkbox" id="mRes" ${m&&m.reserva?'checked':''}> Esta é a reserva de emergência</label>`:''}
    ${btns(m?'Salvar alterações':'Criar meta')}`,
  async()=>{
    const nome=val('mNome').trim(),alvo=parseValor(val('mAlvo'));
    if(!nome)return 'Dê um nome para a meta.';if(!alvo)return 'Digite o valor que vocês querem juntar.';
    const reg={nome,emoji:sel('emoji')||'🎯',alvo,prazo:val('mPrazo')||null};
    if(S.temV4)reg.reserva=!!$('mdl').querySelector('#mRes')?.checked;
    const {error}=m?await sb.from('metas').update(reg).eq('id',m.id):await sb.from('metas').insert(reg);
    if(error)throw error;toast(m?'Meta atualizada':'Meta criada');
  });
}
function modalAporte(m,tipo){
  const g=guardadoMeta(m.id);
  modal(`<h2>${tipo==='aporte'?'Guardar em':'Resgatar de'} ${esc(m.emoji)} ${esc(m.nome)}</h2>
    <p class="mut" style="margin:-8px 0 16px">${tipo==='aporte'?`Já guardado: ${R(g)} de ${R(alvoMeta(m))}. Em caixa agora: ${R(emCaixa())}.`:`Disponível nesta meta: ${R(g)}`}</p>
    <label>Valor (R$)<input class="field big" id="mValor" inputmode="decimal" placeholder="0,00"></label>
    <label>Data<input class="field" id="mData" type="date" value="${dataPadrao()}"></label>
    ${btns(tipo==='aporte'?'Guardar':'Resgatar')}`,
  async()=>{
    const valor=parseValor(val('mValor')),d=val('mData');
    if(!valor)return 'Digite um valor maior que zero.';
    if(tipo==='resgate'&&valor>g+0.001)return 'O valor é maior do que está guardado nesta meta.';
    const {error}=await sb.from('lancamentos').insert({tipo,valor,descricao:(tipo==='aporte'?'Guardado: ':'Resgate: ')+m.nome,categoria:'meta',data:d,meta_id:m.id});
    if(error)throw error;toast(tipo==='aporte'?'Dinheiro guardado':'Resgate registrado');
  });
}
function modalExcluirReserva(m,g){
  if(g<=0){confirmar('Remover reserva de emergência?','A reserva sai da tela. O histórico de movimentações continua guardado; dá para criar uma nova reserva depois.','Remover reserva',
    async()=>{const {error}=await sb.from('metas').update(S.temV10?{arquivada:true,reserva:false}:{reserva:false}).eq('id',m.id);if(error)throw error;toast('Reserva removida')});return}
  modal(`<h2>Remover reserva de emergência</h2><p class="mut" style="margin:-6px 0 16px">Há <b class="pos">${R(g)}</b> guardados na reserva. O que fazer com esse dinheiro?</p>
    <div class="novo-grid" style="grid-template-columns:1fr">
      <button class="novo-op" data-m="res-devolver"><span class="no-em">↩️</span><span><b>Devolver ${R0(g)} ao caixa e remover</b><small>Registra um resgate (o caixa sobe) e a reserva sai da tela. O histórico continua guardado.</small></span></button>
      <button class="novo-op" data-m="res-apagar"><span class="no-em">🗑️</span><span><b>Apagar a reserva e todo o histórico</b><small>Os aportes e resgates da reserva são desfeitos, como se ela nunca tivesse existido. Use se ela foi criada por engano ou em teste.</small></span></button>
    </div><div class="erro" role="alert"></div><div class="btns" style="margin-top:12px"><button class="btn ghost" data-m="cancelar">Cancelar</button></div>`);
  S._resExcluir={m,g};
}
function modalReserva(){
  const ideal=reservaIdeal();
  modal(`<h2>🛟 Criar reserva de emergência</h2>
    <p class="mut" style="margin:-6px 0 16px">${ideal?`Pelos gastos de vocês, o ideal é <b class="ref">${R0(ideal)}</b> (6 meses de gastos). Podem usar esse valor ou definir outro.`:'Ainda não há histórico de gastos para sugerir um valor. Uma boa referência é somar 6 meses do custo de vida de vocês.'}</p>
    <label>Quanto querem ter na reserva (R$)<input class="field big" id="mAlvo" inputmode="decimal" placeholder="Ex.: 30.000" value="${ideal?fmtInput(ideal):''}"></label>
    <label>Já têm algum valor guardado para isso? (opcional)<input class="field" id="mJa" inputmode="decimal" placeholder="0,00"></label>
    <p class="mut" style="font-size:13px;margin:-6px 0 14px">Esse valor entra direto na reserva, sem descontar do Em caixa.</p>
    ${btns('Criar reserva')}`,
  async()=>{
    const alvo=parseValor(val('mAlvo')),ja=parseValor(val('mJa'));
    if(!alvo)return 'Digite quanto querem juntar na reserva.';
    const reg={nome:'Reserva de emergência',emoji:'🛟',alvo};if(S.temV4)reg.reserva=true;
    const {data,error}=await sb.from('metas').insert(reg).select('id');
    if(error)throw error;
    if(ja&&data&&data[0]){const r=await sb.from('lancamentos').insert({tipo:'aporte',valor:ja,descricao:'Já guardado: Reserva de emergência',categoria:'meta',data:HOJE,meta_id:data[0].id});if(r.error)throw r.error;
      await sb.from('config').upsert({id:'casal',saldo_inicial:Math.round((S.saldoInicial+ja)*100)/100,atualizado_em:new Date().toISOString()})}
    toast('Reserva criada');
  });
}
function invDetalhe(tipo,x){
  const t=INVT[tipo]||INV[0],p=x&&x.tipo===tipo?x.produto:'';
  const conhecido=t.produtos&&t.produtos.includes(p),outro=t.produtos&&p&&!conhecido;
  const sel0=t.produtos?(conhecido?p:outro?t.produtos[t.produtos.length-1]:t.produtos[0]):'';
  return `${t.produtos?`<label style="margin-bottom:0">${t.campo}</label><div class="chips" data-g="prodInv" data-onchange="__trocaProd">${t.produtos.map(v=>`<button type="button" class="chip" data-v="${esc(v)}" aria-pressed="${v===sel0}">${esc(v)}</button>`).join('')}</div>
    <div id="outroWrap" ${/^Outr[oa]$/.test(sel0)?'':'hidden'}><label>Qual?<input class="field" id="mOutro" maxlength="30" placeholder="Ex.: LC, LF, CRI" value="${esc(outro?p:'')}"></label></div>`:''}
    <label>${t.lbl}<input class="field" id="mNome" maxlength="60" placeholder="${esc(t.ph)}" value="${esc(x&&x.tipo===tipo?x.nome:'')}"></label>`;
}
window.__trocaCatInv=b=>{const x=S._invEdit;$('mdl').querySelector('#invDet').innerHTML=invDetalhe(b.dataset.v,x);ligarChipsMdl($('mdl').querySelector('#invDet'))};
window.__trocaProd=b=>{const w=$('mdl').querySelector('#outroWrap');if(w){w.hidden=!/^Outr[oa]$/.test(b.dataset.v);if(!w.hidden)setTimeout(()=>$('mdl').querySelector('#mOutro').focus(),30)}};
function ligarChipsMdl(root){root.querySelectorAll('.seg,.chips').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!g.contains(b))return;g.querySelectorAll(':scope>button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(g.dataset.onchange&&window[g.dataset.onchange])window[g.dataset.onchange](b)}))}
function modalInvest(x){
  S._invEdit=x||null;const tipo=x?x.tipo:'renda_fixa';
  modal(`<h2>${x?'Editar investimento':'Novo investimento'}</h2>
    <label style="margin-bottom:0">Categoria</label><div class="chips" data-g="catInv" data-onchange="__trocaCatInv">${INV.map(t=>`<button type="button" class="chip" data-v="${t.id}" aria-pressed="${tipo===t.id}"><i class="dot" style="background:${t.cor}"></i>${esc(t.curto)}</button>`).join('')}</div>
    <div id="invDet">${invDetalhe(tipo,x)}</div>
    <label>Instituição<input class="field" id="mInst" maxlength="40" placeholder="Ex.: Banco X" value="${esc(x?x.instituicao:'')}"></label>
    <div class="row2"><label>Valor aplicado (R$)<input class="field big" id="mApl" inputmode="decimal" placeholder="0,00" value="${x?fmtInput(x.aplicado):''}"></label>
    <label>Valor atual (R$)<input class="field big" id="mValor" inputmode="decimal" placeholder="Igual ao aplicado" value="${x&&x.valor!==x.aplicado?fmtInput(x.valor):''}"></label></div>
    <p class="mut" style="font-size:13px;margin:-6px 0 14px">O valor atual é opcional. Atualizem quando quiserem acompanhar o rendimento.</p>
    <label>Data<input class="field" id="mData" type="date" value="${x?x.data:HOJE}"></label>
    ${x?'':`<label style="margin-bottom:0">De onde veio o dinheiro</label><div class="seg" data-g="origem"><button type="button" data-v="caixa" aria-pressed="true">Saiu do caixa agora</button><button type="button" data-v="ja" aria-pressed="false">Já tínhamos esse investimento</button></div>`}
    ${btns(x?'Salvar alterações':'Adicionar investimento')}`,
  async()=>{
    const tipo=sel('catInv')||'renda_fixa',t=INVT[tipo];
    const aplicado=parseValor(val('mApl')),atualTxt=val('mValor').trim(),valor=atualTxt?parseValor(atualTxt):aplicado,d=val('mData');
    let produto=t.produtos?(sel('prodInv')||''):'';
    if(/^Outr[oa]$/.test(produto)&&val('mOutro').trim())produto=val('mOutro').trim().slice(0,30);
    const nome=val('mNome').trim();
    if(!t.produtos&&!nome)return `Informe o ${t.lbl.toLowerCase()}.`;
    if(!aplicado)return 'Digite o valor aplicado.';
    if(atualTxt&&!valor)return 'O valor atual está inválido.';
    if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return 'Escolha a data.';
    const reg={tipo,produto,valor,nome,instituicao:val('mInst').trim(),data:d};if(S.temV8)reg.aplicado=aplicado;
    const {data:novo,error}=x?await sb.from('investimentos').update(reg).eq('id',x.id).select('id'):await sb.from('investimentos').insert(reg).select('id');
    if(error){if(/produto|investimentos_tipo_check|check constraint/.test(error.message||''))return 'Falta rodar o arquivo schema-v7.sql no Supabase.';if(/investimentos/.test(error.message||''))return 'Falta rodar o arquivo schema-v5.sql no Supabase.';throw error}
    if(!x&&sel('origem')!=='ja'&&novo&&novo[0]){const r2=await sb.from('lancamentos').insert({tipo:'aporte',valor:aplicado,descricao:'Investido: '+(produto||nome||t.nome),categoria:'investimentos',data:d,investimento_id:novo[0].id,status:d<=HOJE?'pago':'previsto'});if(r2.error)throw r2.error}
    toast(x?'Investimento atualizado':'Investimento adicionado');
  });
}
/* aporte ou resgate numa aplicação existente: move o caixa e a posição, sem virar gasto/entrada */
function modalMovInvest(x,tipo){
  const t=INVT[x.tipo]||{nome:''};
  modal(`<h2>${tipo==='aporte'?'Aportar em':'Resgatar de'} ${esc(x.produto||x.nome||t.nome)}</h2>
    <p class="mut" style="margin:-6px 0 16px">Posição atual: <b class="pos">${R(x.valor)}</b> (aplicado ${R(x.aplicado)}). ${tipo==='aporte'?'O valor sai do caixa e entra no investimento.':'O valor volta para o caixa.'} Não conta como ${tipo==='aporte'?'gasto':'entrada'}.</p>
    <label>Valor (R$)<input class="field big" id="mValor" inputmode="decimal" placeholder="0,00"></label>
    <label>Data<input class="field" id="mData" type="date" value="${HOJE}"></label>${btns(tipo==='aporte'?'Aportar':'Resgatar')}`,
  async()=>{
    const v=parseValor(val('mValor')),d=val('mData');if(!v)return 'Digite o valor.';if(tipo==='resgate'&&v>x.valor+0.001)return 'O valor é maior que a posição atual.';
    const prop=tipo==='resgate'&&x.valor>0?x.aplicado/x.valor:1;
    const novoValor=Math.round((x.valor+(tipo==='aporte'?v:-v))*100)/100,novoApl=Math.max(0,Math.round((x.aplicado+(tipo==='aporte'?v:-v*prop))*100)/100);
    const r1=await sb.from('investimentos').update({valor:novoValor,aplicado:novoApl}).eq('id',x.id);if(r1.error)throw r1.error;
    const r2=await sb.from('lancamentos').insert({tipo,valor:v,descricao:(tipo==='aporte'?'Investido: ':'Resgate: ')+(x.produto||x.nome||t.nome),categoria:'investimentos',data:d,investimento_id:x.id,status:'pago'});if(r2.error)throw r2.error;
    toast(tipo==='aporte'?'Aporte registrado':'Resgate registrado');
  });
}
/* confirmar uma ocorrência prevista (conta, salário ou agendamento) */
function modalConfirmarOc(item){
  const ent=item.tipo==='entrada';
  modal(`<h2>${ent?'Confirmar recebimento':'Confirmar pagamento'}</h2><p class="mut" style="margin:-6px 0 16px">${esc(descVis(item))} · previsto para ${dataBR(item.data)}</p>
    <label>Valor ${ent?'recebido':'pago'} (R$)<input class="field big" id="mValor" inputmode="decimal" value="${fmtInput(item.valor)}"></label>
    <label>Data do ${ent?'recebimento':'pagamento'}<input class="field" id="mData" type="date" value="${HOJE}" max="${HOJE}"></label>
    <p class="mut" style="font-size:13px;margin:-6px 0 14px">${item.recorrente_id?'Mudar o valor aqui vale só para este mês.':''} ${ent?'O valor entra no caixa.':item.cartao_id?'O valor entra na fatura do cartão; o caixa só muda ao pagar a fatura.':'O valor sai do caixa e conta no orçamento.'}</p>${btns(ent?'Confirmar':'Marcar como paga')}`,
  async()=>{
    const v=parseValor(val('mValor')),d=val('mData');if(!v)return 'Digite o valor.';if(d>HOJE)return 'A data não pode ser no futuro.';
    const up=item.cartao_id?{status:'comprometido',valor:v}:{status:'pago',valor:v,data_caixa:d};if(v!==item.valor&&item.recorrente_id)up.editado=true;if(!item.recorrente_id&&!item.cartao_id)up.data=d;
    const {error}=await sb.from('lancamentos').update(up).eq('id',item.id);if(error)throw error;toast(ent?`Recebimento confirmado · caixa aumentou ${R(v)}`:item.cartao_id?`Lançado na fatura do cartão · o caixa só muda ao pagar a fatura`:`Pagamento registrado · caixa reduzido em ${R(v)}`);
  });
}
/* data prevista de pagamento: só muda onde a fatura aparece no Calendário e na Projeção; o caixa muda ao pagar */
function modalPagPrev(card,fm){
  if(!S.temV12){toast('Falta rodar o arquivo schema-v12.sql no Supabase.');return}
  const f=infoFatura(card,fm),atual=pagPrevisto(card,fm),mesV=f.venc.slice(0,7);
  modal(`<h2>Data prevista de pagamento</h2><p class="mut" style="margin:-6px 0 16px">Fatura ${esc(card.nome)} de ${esc(soMes(refDe(card,fm)))} · vence ${dataBR(f.venc)} · ${R(f.aberto+f.prev)}</p>
    <label>Quando vocês pretendem pagar<input class="field" id="mData" type="date" value="${atual||''}"></label>
    <p class="mut" style="font-size:13px;margin:-6px 0 14px">Vale entre hoje e o dia do vencimento, dentro de ${esc(soMes(mesV))}. Deixe em branco para voltar à data de vencimento. O caixa só muda quando vocês usarem <b>Pagar fatura</b>.</p>${btns('Salvar')}`,
  async()=>{const d=val('mData');
    if(d&&(!/^\d{4}-\d{2}-\d{2}$/.test(d)||d<HOJE||d>f.venc))return 'Escolha uma data entre hoje e '+dataBR(f.venc)+'.';
    const novo={...S.pagPrev},k=card.id+'|'+fm;if(d)novo[k]=d;else delete novo[k];
    const {error}=await sb.from('config').upsert({id:'casal',pag_previstos:novo,atualizado_em:new Date().toISOString()});if(error)throw error;
    S.pagPrev=novo;toast(d?'Pagamento previsto para '+dataBR(d):'Voltou para o vencimento');});
}
/* patrimônio inicial: desde quando os investimentos já cadastrados existiam (não é "ganho" do dia do cadastro) */
function modalPatrIni(){
  if(!S.temPatr){toast('Falta rodar o arquivo schema-v12.sql no Supabase.');return}
  modal(`<h2>Patrimônio inicial</h2><p class="mut" style="margin:-6px 0 16px">Investimentos cadastrados sem movimentar o caixa passam a contar desde a data abaixo, e o gráfico deixa de mostrar um salto no mês do cadastro.</p>
    <label>Esse patrimônio já existia desde<input class="field" id="mData" type="date" value="${S.patrIni||''}"></label>
    <p class="mut" style="font-size:13px;margin:-6px 0 14px">Use o dia em que vocês começaram a usar o site (por exemplo 01/09/2026). Deixe em branco para voltar a contar só a partir do cadastro.</p>${btns('Salvar')}`,
  async()=>{const d=val('mData');
    if(d&&(!/^\d{4}-\d{2}-\d{2}$/.test(d)||d>HOJE))return 'Escolha uma data que já passou.';
    const {error}=await sb.from('config').upsert({id:'casal',patr_inicial:d||null,atualizado_em:new Date().toISOString()});if(error)throw error;
    S.patrIni=d;toast(d?'Patrimônio inicial definido':'Patrimônio inicial removido');});
}
/* renda média mensal: o app usa para orçamento, % da renda no cartão, simulador, dívidas e desejos */
function modalRendaMedia(){
  if(!S.temRenda){toast('Falta rodar o arquivo schema-v12.sql no Supabase.');return}
  const hist=media().hist;
  modal(`<h2>Renda média mensal</h2><p class="mut" style="margin:-6px 0 16px">Quanto vocês recebem por mês, somando os salários e as entradas que se repetem. O app usa esse valor para calcular o orçamento, quanto do cartão compromete a renda e se uma compra cabe.</p>
    <label>Renda média por mês (R$)<input class="field big" id="mValor" inputmode="decimal" autocomplete="off" placeholder="0,00" value="${S.rendaMedia>0?fmtInput(S.rendaMedia):''}"></label>
    <p class="mut" style="font-size:13px;margin:-6px 0 14px">${hist>0?`Pelo histórico, a média dos últimos meses é ${R0(hist)}. `:''}Deixe em branco para o app usar a média do que entrou nos últimos meses. Isso não lança nenhuma entrada no caixa.</p>${btns('Salvar')}`,
  async()=>{const t=val('mValor').trim(),v=t?parseValor(t):null;
    if(t&&!v)return 'Digite um valor válido.';
    const {error}=await sb.from('config').upsert({id:'casal',renda_media:v||null,atualizado_em:new Date().toISOString()});if(error)throw error;
    S.rendaMedia=v||0;toast(v?'Renda média definida':'Voltou a usar a média dos últimos meses');});
}
/* detalhe completo de entradas e gastos (passado e futuro) */
function modalFluxo(k,volta){
  const sm=situacaoMes(),r0=resumo(MES_ATUAL),mc=soMes(MES_ATUAL);
  const porDataDesc=(a,b)=>b.data.localeCompare(a.data)||(b.criadoEm||0)-(a.criadoEm||0),porData=(a,b)=>a.data.localeCompare(b.data);
  const row=(dt,em,txt,tag,v,cls,id)=>`<div class="sd-l sub${id?' det-click':''}"${id?` data-act="det-edit" data-id="${id}" role="button" tabindex="0" title="Abrir para editar"`:''}><span>${em||''} ${esc(txt)} <small class="mut">${dt?dataBR(dt):''}${tag?' · '+tag:''}</small></span><span><b class="${cls||''}">${R(v)}</b></span></div>`;
  const tot=(t,v,cls)=>`<div class="sd-l tot"><span>${t}</span><span><b class="${cls}">${R(v)}</b></span></div>`;
  const sec=(t,v,cls,linhas,vazio)=>`<div class="side-title" style="padding:10px 0 4px">${t}</div>${linhas||`<p class="mut" style="margin:4px 0">${vazio}</p>`}${tot('Total',v,cls)}`;
  const entP=r0.ef.filter(i=>i.tipo==='entrada').sort(porDataDesc);
  const gaP=r0.ef.filter(i=>i.tipo==='gasto').sort(porDataDesc);
  const tagG=i=>i.cartao_id?(i.status==='comprometido'?'💳 no cartão, a pagar':'💳 fatura paga'):(NOME_MEIO[i.meio]||'saiu do caixa');
  const lEnt=entP.map(i=>row(i.data,catVis(i).em,descVis(i),'recebido',i.valor,'pos',i.id)).join('');
  const entF=sm.itens.filter(e=>e.entra).sort(porData);
  const lEntF=entF.map(e=>row(e.data,e.em,e.txt,e.k||'previsto',e.valor,'pos',e.id&&!e.cartao?e.id:'')).join('');
  const caixaP=gaP.filter(i=>!(i.cartao_id&&i.status==='comprometido')),cartP=gaP.filter(i=>i.cartao_id&&i.status==='comprometido');
  const lCx=caixaP.map(i=>row(i.data,catVis(i).em,descVis(i),tagG(i),i.valor,'neg',i.id)).join('');
  const lCt=cartP.map(i=>row(i.data,catVis(i).em,descVis(i),tagG(i),i.valor,'ref',i.id)).join('');
  const saiF=sm.itens.filter(e=>e.sai).sort(porData);
  const lSaiF=saiF.map(e=>row(e.data,e.em,e.txt,e.k||'',e.valor,'ref',e.id&&!e.cartao?e.id:'')).join('');
  const atras=cent(sm.atrCartao+sm.atrContas);
  const lAtr=atras>0.004?`<div class="sd-l"><span>Atrasado de meses anteriores</span><span><b class="neg">${R(atras)}</b></span></div>`:'';
  const caixaTot=soma(caixaP),cartTot=soma(cartP);
  let t,def,corpo,go='';
  if(k==='jaEntrou'){t='Já entrou em '+mc;def='Tudo que vocês já receberam neste mês.';corpo=sec('Entradas recebidas',r0.entradas,r0.entradas>0?'pos':'zero',lEnt,'Nenhuma entrada recebida ainda.');go='entradas'}
  else if(k==='aEntrar'){t='Ainda entra em '+mc;def='Salários e entradas previstos até o fim do mês, ainda não recebidos.';corpo=sec('Entradas previstas',sm.entra,sm.entra>0?'pos':'zero',lEntF,'Nada mais previsto para entrar.');go='calendario'}
  else if(k==='jaSaiu'){t='Já saiu do caixa em '+mc;def='Gastos que realmente tiraram dinheiro da conta. Compras no cartão só saem quando a fatura é paga.';corpo=sec('Saíram do caixa',caixaTot,caixaTot>0?'neg':'zero',lCx,'Nada saiu do caixa ainda.');go='gastos'}
  else if(k==='aSair'){t='Ainda sai em '+mc;def='Tudo que já é obrigação e ainda vai sair do caixa até o fim do mês: contas, faturas e parcelas.';corpo=sec('A pagar até o fim do mês',sm.sai,sm.sai>0?'ref':'zero',lSaiF+lAtr,'Nada mais a pagar.');go='calendario'}
  else if(k==='entradas'){t='Entradas de '+mc;def='O que já entrou e o que ainda está previsto, lançamento por lançamento.';
    corpo=sec('Já recebido',r0.entradas,r0.entradas>0?'pos':'zero',lEnt,'Nenhuma entrada recebida ainda.')+sec('Ainda a receber',sm.entra,sm.entra>0?'pos':'zero',lEntF,'Nada mais previsto.')+(S.rendaMedia>0?`<div class="sd-l"><span>Renda média definida</span><span><b class="ref">${R(S.rendaMedia)}</b></span></div>`:'');go='entradas'}
  else {t='Gastos de '+mc;def='Tudo que vocês gastaram, independentemente da forma de pagamento, lançamento por lançamento.';
    corpo=sec('Já saíram do caixa',caixaTot,caixaTot>0?'neg':'zero',lCx,'Nada saiu do caixa ainda.')+sec('No cartão, ainda a pagar',cartTot,cartTot>0?'ref':'zero',lCt,'Nenhuma compra no cartão pendente.')+tot('Total gasto',r0.gastos,'neg');go='gastos'}
  modal(`<h2>${t}</h2><p class="mut" style="margin:-6px 0 10px">${def}</p><div class="sim-depois kpi-det fluxo-det">${corpo}</div><p class="mut" style="font-size:12.5px;margin:8px 0 0">Toque em um lançamento para editar.</p><div class="btns" style="margin-top:12px">${volta?`<button class="btn ghost" data-act="det-proj">← Projeção</button>`:`<button class="btn ghost" data-m="cancelar">Fechar</button>`}<button class="btn" data-go="${go}">Abrir</button></div>`);
}
/* de onde vem cada número da Visão geral */
function modalKpi(k){
  const sm=situacaoMes(),r0=resumo(MES_ATUAL),mc=soMes(MES_ATUAL);
  const lin=(t,v,cls)=>`<div class="sd-l"><span>${t}</span><span><b class="${cls||''}">${v}</b></span></div>`;
  const porData=(a,b)=>a.data.localeCompare(b.data);
  const itensDe=arr=>arr.sort(porData).map(e=>`<div class="sd-l sub"><span>${e.em||''} ${esc(e.txt)} <small class="mut">${dataBR(e.data)}</small></span><span>${R(e.valor)}</span></div>`).join('');
  const sai=sm.itens.filter(e=>e.sai&&!e.transf),fat=sai.filter(e=>e.cartao),dv=sai.filter(e=>e.divida),ou=sai.filter(e=>!e.cartao&&!e.divida);
  const grupo=(t,arr,extra)=>{const tot=soma(arr)+(extra||0);return tot>0.004?lin(t,R(tot),'ref')+itensDe(arr):''};
  const atras=cent(sm.atrCartao+sm.atrContas);
  const aCartaoMes=soma(r0.ef.filter(i=>i.tipo==='gasto'&&i.cartao_id&&i.status==='comprometido'));
  let t='',def='',corpo='',go='',btnExtra='';
  if(k==='aPagar'){t='Ainda a pagar';def='Tudo que já é obrigação de vocês e ainda não saiu do caixa até o fim de '+mc+'.';
    corpo=grupo('Faturas de cartão',fat)+grupo('Contas e gastos agendados',ou)+grupo('Parcelas de dívida',dv)+(atras>0.004?lin('Atrasado de meses anteriores',R(atras),'neg'):'')+'<div class="sd-l tot"><span>Total</span><span><b class="ref">'+R(sm.compromissos)+'</b></span></div>';go='calendario'}
  else if(k==='vence'){t='Vence hoje / em atraso';def='A parte do "ainda a pagar" que já venceu ou vence hoje. É o que pede pagamento agora.';
    const ja=sai.filter(e=>e.data<=HOJE);
    corpo=(ja.length?itensDe(ja):'')+(atras>0.004?lin('Atrasado de meses anteriores',R(atras),'neg'):'')+(sm.aPagar<=0.004?'<p class="mut">Nada vencido neste momento.</p>':'')+'<div class="sd-l tot"><span>Total</span><span><b class="'+(sm.aPagar>0?'neg':'zero')+'">'+R(sm.aPagar)+'</b></span></div>';go='contas'}
  else if(k==='caixa'){t='Em caixa';def='O dinheiro que está na conta agora. Compras no cartão só saem do caixa quando a fatura é paga.';
    corpo=lin('Saldo inicial informado',R(S.saldoInicial),cS(S.saldoInicial))+lin('Entradas menos saídas já pagas',R(S.movCaixa),cS(S.movCaixa))+'<div class="sd-l tot"><span>Em caixa</span><span><b class="'+cS(sm.caixa)+'">'+R(sm.caixa)+'</b></span></div>';
    btnExtra='<button class="btn ghost" data-act="ajustar-caixa">Ajustar saldo</button>'}
  else if(k==='patrimonio'){const pat=patrimonioLiquido();t='Patrimônio líquido';def='O que vocês têm: caixa, dinheiro em metas e investimentos, menos as dívidas cadastradas.';
    corpo=lin('Caixa',R(emCaixa()),cS(emCaixa()))+lin('Metas',R(totalMetas()))+lin('Investimentos',R(totalInvest()))+lin('Dívidas',pat.dividas>0?'− '+R(pat.dividas):R(0),pat.dividas>0?'neg':'zero')+'<div class="sd-l tot"><span>Patrimônio líquido</span><span><b class="'+cS(pat.liquido)+'">'+R(pat.liquido)+'</b></span></div>';go='patrimonio'}
  else if(k==='gastos'){t='Gastos realizados';def='Tudo que vocês gastaram em '+mc+', independentemente da forma de pagamento.';
    corpo=lin('Já saíram do caixa',R(cent(r0.gastos-aCartaoMes)))+lin('No cartão, ainda a pagar',R(aCartaoMes),aCartaoMes>0?'ref':'zero')+'<div class="sd-l tot"><span>Total gasto</span><span><b class="neg">'+R(r0.gastos)+'</b></span></div>';go='gastos'}
  else if(k==='entradas'){t='Entradas';def='O que entrou em '+mc+' e o que ainda está previsto.';
    corpo=lin('Já recebido',R(r0.entradas),r0.entradas>0?'pos':'zero')+lin('Ainda a receber',R(sm.entra),sm.entra>0?'pos':'zero')+'<div class="sd-l tot"><span>Previsto no mês</span><span><b class="pos">'+R(cent(r0.entradas+sm.entra))+'</b></span></div>'+(S.rendaMedia>0?lin('Renda média definida',R(S.rendaMedia),'ref'):'');go='calendario'}
  else return;
  modal(`<h2>${t}</h2><p class="mut" style="margin:-6px 0 14px">${def}</p><div class="sim-depois kpi-det">${corpo}</div><div class="btns" style="margin-top:14px"><button class="btn ghost" data-m="cancelar">Fechar</button>${btnExtra}${go?`<button class="btn" data-go="${go}">Abrir</button>`:''}</div>`);
}
function modalGlossario(){
  const d=(t,x)=>`<div class="gl"><b>${t}</b><span>${x}</span></div>`;
  modal(`<h2>O que significa cada termo</h2><div class="glos">
    ${d('Gasto (despesa)','Tudo que vocês consumiram, no dia da compra, seja Pix, dinheiro ou cartão de crédito.')}
    ${d('Saída','Dinheiro que realmente saiu da conta. Compra no cartão só vira saída quando a fatura é paga.')}
    ${d('Realizado','Já aconteceu: o gasto foi feito ou a entrada foi recebida.')}
    ${d('Previsto','Agendado ou recorrente, ainda não aconteceu (a data não chegou ou não foi confirmado).')}
    ${d('Comprometido','Já virou gasto no cartão, mas a fatura ainda não foi paga. No orçamento, é o previsto do mês.')}
    ${d('Ainda a pagar','Tudo que já é obrigação e ainda não saiu do caixa: faturas, contas, parcelas e agendados.')}
    ${d('Vence hoje / em atraso','A parte do "ainda a pagar" que já venceu ou vence hoje.')}
    ${d('Em caixa','O dinheiro que está na conta agora.')}
    ${d('Resultado do mês','Entradas menos saídas do mês. No mês atual, o calendário mostra o “resultado projetado”, que inclui o que ainda vai entrar e sair. Não é o saldo da conta.')}
    ${d('Patrimônio líquido','Caixa + metas + investimentos − dívidas cadastradas.')}
  </div><div class="btns" style="margin-top:14px"><button class="btn" data-m="cancelar">Entendi</button></div>`);
}
/* busca em todo o histórico: descrição, categoria, valor, mês e ano */
const MESES_BUSCA=['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const semAcento=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function modalBusca(){
  modal(`<h2>Buscar</h2><label>O que procura?<input class="field" id="bQ" autocomplete="off" placeholder="Ex.: netflix, aluguel, 200, outubro 2026"></label>
    <div id="bRes" class="busca-res"><p class="mut">Busca em todos os lançamentos, contas, metas, dívidas e desejos. Dá para combinar: <b>mercado outubro</b>, <b>200</b>, <b>academia 2026</b>.</p></div>
    <div class="btns"><button class="btn ghost" data-m="cancelar">Fechar</button></div>`);
  const q=$('mdl').querySelector('#bQ');let t=null,seq=0;
  setTimeout(()=>q.focus(),60);
  q.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(()=>buscar(q.value,++seq,()=>seq),260)});
}
async function buscar(txt,meu,atual){
  const box=$('bRes');if(!box)return;
  const bruto=txt.trim();if(bruto.length<2){box.innerHTML='<p class="mut">Digite pelo menos 2 letras ou um valor.</p>';return}
  let nq=semAcento(bruto).replace(/r\$/g,' ');
  let mes=null,ano=null;
  const my=nq.match(/\b(20\d\d)\b/);if(my){ano=Number(my[1]);nq=nq.replace(my[0],' ')}
  MESES_BUSCA.forEach((n,i)=>{if(mes===null&&new RegExp('\\b'+n+'\\b').test(nq)){mes=i+1;nq=nq.replace(n,' ')}});
  nq=nq.replace(/\s+/g,' ').trim();
  const limpo=nq.replace(/[,()%*]/g,' ').replace(/\s+/g,' ').trim();
  const numTxt=/^[\d.,]+$/.test(nq)?normNum(nq):null,num=numTxt&&isFinite(Number(numTxt))&&Number(numTxt)>0?Number(numTxt):null;
  const cats=Object.entries(CAT).filter(([id,c])=>limpo&&(semAcento(c.nome).includes(limpo)||id===limpo)).map(([id])=>id);
  let qr=sb.from('lancamentos').select('*').neq('status','cancelado').order('data',{ascending:false}).limit(80);
  if(mes!==null||ano!==null){const y=ano||ANO_ATUAL;
    if(mes!==null){const a=`${y}-${pad(mes)}-01`,b=mes===12?`${y+1}-01-01`:`${y}-${pad(mes+1)}-01`;qr=qr.gte('data',a).lt('data',b)}else qr=qr.gte('data',`${y}-01-01`).lt('data',`${y+1}-01-01`)}
  if(limpo){const f=[`descricao.ilike.%${limpo}%`];if(cats.length)f.push(`categoria.in.(${cats.join(',')})`);if(num!==null)f.push(`valor.eq.${num}`);qr=qr.or(f.join(','))}
  const {data,error}=await qr;
  if(meu!==undefined&&atual&&meu!==atual())return;
  if(error){box.innerHTML='<p class="mut">Não deu para buscar agora. Tentem de novo.</p>';return}
  const itens=(data||[]).map(deLinha);
  const extras=[];
  if(limpo){
    S.recorrentes.filter(r=>semAcento(r.descricao).includes(limpo)).forEach(r=>extras.push({em:(CAT[r.categoria]||{em:'🔁'}).em,t:r.descricao,s:`Conta fixa · todo dia ${r.dia} · ${R0(r.valor)}`,go:'contas'}));
    S.metas.filter(m=>semAcento(m.nome).includes(limpo)).forEach(m=>extras.push({em:m.emoji||'🎯',t:m.nome,s:`Meta · ${R0(guardadoMeta(m.id))} de ${R0(m.alvo)}`,go:m.reserva?'reserva':'metas'}));
    S.dividas.filter(d=>semAcento(d.nome).includes(limpo)).forEach(d=>extras.push({em:'🏦',t:d.nome,s:`Dívida · parcela ${R0(d.parcela)}`,go:'dividas'}));
    S.desejos.filter(d=>semAcento(d.nome).includes(limpo)).forEach(d=>extras.push({em:d.emoji||'⭐',t:d.nome,s:`Desejo · ${R0(d.valor)}`,go:'desejos'}));
  }
  const gastos=itens.filter(i=>i.tipo==='gasto'),totG=soma(gastos);
  const st=i=>i.status==='previsto'?'previsto':i.status==='comprometido'?'no cartão, a pagar':'';
  const linhas=itens.map(i=>{const c=catVis(i),ent=i.tipo==='entrada'||i.tipo==='resgate',v=ent?'entradas':'gastos';
    return `<button type="button" class="busca-i" data-act="busca-ir" data-mes="${i.mes}" data-v="${i.tipo==='entrada'?'entradas':(i.tipo==='aporte'||i.tipo==='resgate'||i.tipo==='divida')?'transf':v}"><span class="bi-em">${c.em}</span><span class="bi-t"><b>${esc(descVis(i))}</b><small>${dataBR(i.data)}/${i.data.slice(0,4)} · ${esc(c.nome)}${st(i)?' · '+st(i):''}</small></span><span class="bi-v ${ent?'pos':'neg'}">${ent?'+ ':''}${R(i.valor)}</span></button>`}).join('');
  const ex=extras.map(e=>`<button type="button" class="busca-i" data-go="${e.go}"><span class="bi-em">${e.em}</span><span class="bi-t"><b>${esc(e.t)}</b><small>${esc(e.s)}</small></span><span class="bi-v mut">›</span></button>`).join('');
  box.innerHTML=(itens.length||extras.length)?`${itens.length?`<p class="mut busca-res-t">${plural(itens.length,'lançamento','lançamentos')}${itens.length>=80?' (mostrando os 80 mais recentes)':''}${gastos.length?` · gastos somam <b class="neg">${R(totG)}</b>`:''}</p><div class="busca-l">${linhas}</div>`:''}${extras.length?`<p class="mut busca-res-t">Também encontrado em</p><div class="busca-l">${ex}</div>`:''}`:'<p class="mut">Nada encontrado. Tentem outra palavra, um valor (200) ou um mês (outubro).</p>';
  marcarValores(box);
}
function modalPagarFatura(card,fm){
  const f=infoFatura(card,fm);
  if(f.aberto<=0){toast('Esta fatura já está paga.');return}
  const depois=emCaixa()-f.aberto;
  modal(`<h2>Pagar ${R(f.aberto)}?</h2><p class="mut" style="margin:-6px 0 16px">Fatura ${esc(card.nome)} de ${esc(soMes(refDe(card,fm)))} · fecha ${dataBR(f.fech)} · vence ${dataBR(f.venc)} · ${plural(f.it.length,'compra','compras')}</p>
    <div class="sim-depois" style="margin-bottom:14px"><div class="sd-l"><span>Caixa hoje</span><span>${R(emCaixa())}</span></div><div class="sd-l"><span>Caixa após o pagamento</span><span><b class="${cS(depois)}">${R(depois)}</b></span></div></div>
    <ul class="cons"><li>A fatura será marcada como paga.</li><li>Nenhuma nova despesa será criada: os gastos do mês não mudam.</li>${depois<0?'<li class="neg">O caixa ficará negativo.</li>':''}</ul>
    <label>Data do pagamento<input class="field" id="mData" type="date" value="${HOJE}" max="${HOJE}"></label>${btns('Pagar fatura')}`,
  async()=>{const d=val('mData');if(d>HOJE)return 'A data não pode ser no futuro.';
    const {data,error}=await sb.from('lancamentos').update({status:'pago',data_caixa:d}).eq('cartao_id',card.id).eq('fatura_mes',fm).eq('status','comprometido').select('id');if(error)throw error;
    if(!data||!data.length)return 'Esta fatura já foi paga. Atualize a tela para ver.';
    toastDesfazer(`Fatura paga · caixa reduzido em ${R(f.aberto)} (agora ${R(depois)})`,async()=>{const r=await sb.from('lancamentos').update({status:'comprometido',data_caixa:null}).in('id',data.map(x=>x.id));if(r.error)throw r.error});});
}
function modalPagarDivida(dv){
  const inf=infoDivida(dv),juros=Math.round(inf.jurosProx*100)/100,principal=Math.round((dv.parcela-juros)*100)/100;
  modal(`<h2>Pagar parcela · ${esc(dv.nome)}</h2>
    <div class="sim-depois" style="margin-bottom:14px"><div class="sd-l"><span>Parcela</span><span><b class="neg">${R(dv.parcela)}</b></span></div>
      <div class="sd-l"><span>Abate a dívida</span><span><b class="ref">${R(principal)}</b></span></div>${juros?`<div class="sd-l"><span>Juros (conta como gasto)</span><span><b class="neg">${R(juros)}</b></span></div>`:''}
      <div class="sd-l"><span>Saldo devedor</span><span>${R0(inf.saldo)} → <b>${R0(Math.max(0,inf.saldo-principal))}</b></span></div></div>
    <label>Data do pagamento<input class="field" id="mData" type="date" value="${S.mes===MES_ATUAL?HOJE:diaNoMes(S.mes,dv.dia)}"></label>${btns('Pagar parcela')}`,
  async()=>{const d=val('mData');
    const regs=[{tipo:'divida',valor:principal,descricao:'Parcela: '+dv.nome,categoria:'dividas',data:d,divida_id:dv.id,status:'pago'}];
    if(juros>0)regs.push({tipo:'gasto',valor:juros,descricao:'Juros: '+dv.nome,categoria:'dividas',data:d,divida_id:dv.id,status:'pago'});
    const {error}=await sb.from('lancamentos').insert(regs);if(error)throw error;toast('Parcela paga');});
}
/* ---------- conta nova: a pagar ou automática ---------- */
window.__trocaMovCR=b=>{const ent=b.dataset.v==='entrada',lista=ent?CATS_E:CATS_G;$('mdl').querySelector('[data-g="cat"]').innerHTML=chipsCat(lista,ent?'salario':'contas');const mw=$('mdl').querySelector('#meioCR');if(mw)mw.hidden=ent;const cw=$('mdl').querySelector('#credCR');if(cw&&ent)cw.hidden=true;layoutModal()};
window.__trocaMeioCR=b=>{const cw=$('mdl').querySelector('#credCR');if(cw)cw.hidden=b.dataset.v!=='credito';layoutModal()};
window.__trocaFreq=b=>{const um=b.dataset.v==='uma';$('mdl').querySelector('#diaWrap').hidden=um;$('mdl').querySelector('#dataWrap').hidden=!um;$('mdl').querySelector('#comoWrap').hidden=um||sel('mov')==='entrada'&&false;$('mdl').querySelector('#iniWrap').hidden=um};
function modalContaNova(){
  modal(`<h2>Conta recorrente ou futura</h2>
    <div class="seg" data-g="mov" data-onchange="__trocaMovCR"><button type="button" data-v="gasto" aria-pressed="true">Saída</button><button type="button" data-v="entrada" aria-pressed="false">Entrada</button></div>
    <div class="seg" data-g="freq" data-onchange="__trocaFreq"><button type="button" data-v="mes" aria-pressed="true">Todo mês</button><button type="button" data-v="uma" aria-pressed="false">Uma vez só</button></div>
    <label>Nome<input class="field" id="mNome" maxlength="60" placeholder="Ex.: Internet"></label>
    <div class="row2"><label>Valor ${''}(R$)<input class="field" id="mValor" inputmode="decimal" placeholder="0,00"></label>
    <label id="diaWrap">Dia do mês<input class="field" id="mDia" type="number" min="1" max="31" placeholder="10"></label>
    <label id="dataWrap" hidden>Data<input class="field" id="mDataU" type="date" value="${addMes(MES_ATUAL,0)===S.mes?HOJE:S.mes+'-01'}"></label></div>
    <label style="margin-bottom:0">Categoria</label><div class="chips" data-g="cat">${chipsCat(CATS_G,'contas')}</div>
    <div id="meioCR"><label style="margin-bottom:0">Forma de pagamento</label><div class="chips" data-g="meio" data-onchange="__trocaMeioCR">${meioChips('pix')}</div></div>
    <div id="credCR" hidden>${S.cartoes.length?`<label style="margin-bottom:0">Cartão</label><div class="chips" data-g="cartao">${cartaoChips()}</div><p class="mut" style="font-size:13px;margin:-8px 0 14px">Cada mês entra na fatura do cartão; o caixa só muda ao pagar a fatura.</p>`:'<p class="mut">Nenhum cartão cadastrado.</p>'}</div>
    <div id="comoWrap"><label style="margin-bottom:0">Como tratar?</label>
      <div class="seg" data-g="como"><button type="button" data-v="auto" aria-pressed="false">Lançar automaticamente</button><button type="button" data-v="pagar" aria-pressed="true">Pedir confirmação</button></div>
      <p class="mut" style="font-size:13px;margin:-8px 0 14px">Até ser lançada ou confirmada, ela aparece no calendário, no orçamento e na previsão como compromisso.</p></div>
    <div id="iniWrap"><label>Começar em<input class="field" id="mIni" type="month" value="${MES_ATUAL}"></label>
      <label>Quantas cobranças faltam, contando a primeira? (opcional)<input class="field" id="mRest" type="number" min="1" max="120" placeholder="Ex.: 8 · vazio = sem fim"></label></div>
    ${donoBox()}
    ${btns('Cadastrar')}`,
  async()=>{
    const nome=val('mNome').trim(),valor=parseValor(val('mValor')),mov=sel('mov'),freq=sel('freq');
    if(!nome)return 'Dê um nome.';if(!valor)return 'Digite o valor.';
    const meio=mov==='gasto'?(sel('meio')||'pix'):'',card=meio==='credito'?S.cartoes.find(c=>c.id===sel('cartao')):null;
    if(meio==='credito'&&!card)return 'Escolham o cartão.';
    if(freq==='uma'){const d=val('mDataU');if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return 'Escolha a data.';
      if(card)return salvarCompraCredito({cardId:card.id,valor,n:1,d,desc:nome,categoria:sel('cat'),dono:sel('dono')});
      const {error}=await sb.from('lancamentos').insert({tipo:mov,valor,descricao:nome,categoria:sel('cat'),data:d,status:'previsto',meio,...(S.temV11&&sel('dono')?{dono:sel('dono')}:{})});if(error)throw error;toast('Agendado para '+dataBR(d));return}
    const dia=parseInt(val('mDia'),10);if(!(dia>=1&&dia<=31))return 'O dia vai de 1 a 31.';
    const ini=val('mIni');
    const reg={tipo:mov,descricao:nome,valor,dia,categoria:sel('cat'),inicio:/^\d{4}-\d{2}$/.test(ini)?ini:MES_ATUAL,ativa:true,auto:sel('como')==='auto'};
    const rest=parseInt(val('mRest'),10)||0;if(S.temV11){if(sel('dono'))reg.dono=sel('dono');if(rest)reg.fim=addMes(reg.inicio,rest-1)}else if(rest)return 'Falta rodar o arquivo schema-v11.sql no Supabase para limitar os meses.';
    if(S.temV10){reg.meio=meio;if(card)reg.cartao_id=card.id}else if(card)return 'Falta rodar o arquivo schema-v10.sql no Supabase para contas no crédito.';
    const {error}=await sb.from('recorrentes').insert(reg);
    if(error){if(/auto/.test(error.message||''))return 'Falta rodar o arquivo schema-v9.sql no Supabase.';if(/meio|cartao_id/.test(error.message||''))return 'Falta rodar o arquivo schema-v10.sql no Supabase.';throw error}
    toast('Conta cadastrada');
  });
}
/* ---------- contas fixas ---------- */
function modalConta(c){
  modal(`<h2>${c?'Editar conta':'Nova conta fixa'}</h2>
    <label>Nome<input class="field" id="mNome" maxlength="60" placeholder="Ex.: Aluguel" value="${esc(c?c.nome:'')}"></label>
    <div class="row2"><label>Valor (R$)<input class="field" id="mValor" inputmode="decimal" placeholder="0,00" value="${c?fmtInput(c.valor):''}"></label>
    <label>Dia do vencimento<input class="field" id="mDia" type="number" min="1" max="31" placeholder="10" value="${c?c.dia:''}"></label></div>
    <label style="margin-bottom:0">Categoria</label><div class="chips" data-g="cat">${chipsCat(CATS_G,c?c.categoria:'contas')}</div>
    ${c?`<label style="margin-bottom:0">Situação</label><div class="seg" data-g="ativa"><button type="button" data-v="1" aria-pressed="${c.ativa}">Ativa</button><button type="button" data-v="0" aria-pressed="${!c.ativa}">Pausada</button></div>`:''}
    ${btns(c?'Salvar alterações':'Cadastrar conta')}`,
  async()=>{
    const nome=val('mNome').trim(),valor=parseValor(val('mValor')),dia=parseInt(val('mDia'),10);
    if(!nome)return 'Dê um nome para a conta.';if(!valor)return 'Digite o valor da conta.';if(!(dia>=1&&dia<=31))return 'O dia do vencimento vai de 1 a 31.';
    const reg={nome,valor,dia,categoria:sel('cat')||'contas'};if(c)reg.ativa=sel('ativa')!=='0';
    const {error}=c?await sb.from('contas_fixas').update(reg).eq('id',c.id):await sb.from('contas_fixas').insert(reg);
    if(error)throw error;toast(c?'Conta atualizada':'Conta cadastrada');
  });
}
/* ---------- cartões ---------- */
function modalCartao(c){
  modal(`<h2>${c?'Editar cartão':'Novo cartão'}</h2>
    <label>Nome do cartão<input class="field" id="mNome" maxlength="40" placeholder="Ex.: Nubank" value="${esc(c?c.nome:'')}"></label>
    <label>Limite (R$)<input class="field" id="mLim" inputmode="decimal" placeholder="5.000" value="${c?fmtInput(c.limite):''}"></label>
    <div class="row2"><label>Dia do fechamento<input class="field" id="mFech" type="number" min="1" max="31" placeholder="25" value="${c?c.fechamento:''}"></label>
    <label>Dia do vencimento<input class="field" id="mVenc" type="number" min="1" max="31" placeholder="5" value="${c?c.vencimento:''}"></label></div>
    <label style="margin-bottom:0">Cor</label><div class="chips" data-g="cor">${CORES_CARTAO.map(k=>`<button type="button" class="chip" data-v="${k}" aria-pressed="${(c?c.cor:CORES_CARTAO[0])===k}" style="width:38px;height:32px;padding:0;background:${k};border:2px solid ${(c?c.cor:CORES_CARTAO[0])===k?'#fff':'transparent'}" aria-label="Cor"></button>`).join('')}</div>
    <p class="mut" style="font-size:13px;margin:-6px 0 14px">Compras feitas depois do fechamento entram na fatura do mês seguinte.</p>
    ${btns(c?'Salvar alterações':'Cadastrar cartão')}`,
  async()=>{
    const nome=val('mNome').trim(),limite=parseLivre(val('mLim'))||0,fechamento=parseInt(val('mFech'),10),vencimento=parseInt(val('mVenc'),10);
    if(!nome)return 'Dê um nome para o cartão.';if(!(fechamento>=1&&fechamento<=31))return 'O dia do fechamento vai de 1 a 31.';if(!(vencimento>=1&&vencimento<=31))return 'O dia do vencimento vai de 1 a 31.';
    const reg={nome,limite:Math.max(0,limite),fechamento,vencimento,cor:sel('cor')||CORES_CARTAO[0]};
    const {error}=c?await sb.from('cartoes').update(reg).eq('id',c.id):await sb.from('cartoes').insert(reg);
    if(error)throw error;toast(c?'Cartão atualizado':'Cartão cadastrado');
  });
  $('mdl').querySelector('[data-g="cor"]').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$('mdl').querySelectorAll('[data-g="cor"] button').forEach(x=>x.style.borderColor=x===b?'#fff':'transparent')});
}
/* ---------- recorrentes ---------- */
function modalRecorrente(r){
  const lista=r.tipo==='gasto'?CATS_G:CATS_E;
  modal(`<h2>Editar conta (todos os meses)</h2>
    <label>Nome<input class="field" id="mDesc" maxlength="80" value="${esc(r.descricao)}"></label>
    <div class="row2"><label>Valor padrão (R$)<input class="field" id="mValor" inputmode="decimal" value="${fmtInput(r.valor)}"></label>
    <label>Dia do mês<input class="field" id="mDia" type="number" min="1" max="31" value="${r.dia}"></label></div>
    <label style="margin-bottom:0">Categoria</label><div class="chips" data-g="cat">${chipsCat(lista,r.categoria)}</div>
    ${r.tipo==='gasto'&&S.temV10?`<label style="margin-bottom:0">Forma de pagamento</label><div class="chips" data-g="meio" data-onchange="__trocaMeioCR">${meioChips(r.cartao_id?'credito':(r.meio||'pix'))}</div>
      <div id="credCR" ${r.cartao_id?'':'hidden'}>${S.cartoes.length?`<label style="margin-bottom:0">Cartão</label><div class="chips" data-g="cartao">${cartaoChips(r.cartao_id)}</div>`:'<p class="mut">Nenhum cartão cadastrado.</p>'}</div>`:''}
    <label style="margin-bottom:0">Como tratar?</label><div class="seg" data-g="como"><button type="button" data-v="auto" aria-pressed="${r.auto}">Lançar automaticamente</button><button type="button" data-v="pagar" aria-pressed="${!r.auto}">Pedir confirmação</button></div>
    <label style="margin-bottom:0">Situação</label><div class="seg" data-g="ativa"><button type="button" data-v="1" aria-pressed="${r.ativa}">Ativa</button><button type="button" data-v="0" aria-pressed="${!r.ativa}">Pausada</button></div>
    ${S.temV11?`<label>Quantas cobranças ainda faltam? (opcional)<input class="field" id="mRest" type="number" min="1" max="120" placeholder="vazio = sem fim" value="${r.fim?restantesRegra(r)||'':''}"></label>${donoBox(r.dono)}`:''}
    <p class="mut" style="font-size:13px;margin:-6px 0 14px">As ocorrências ainda não confirmadas são atualizadas, exceto as que vocês ajustaram manualmente. As já confirmadas ficam como estão.</p>
    ${btns('Salvar alterações')}`,
  async()=>{
    const descricao=val('mDesc').trim(),valor=parseValor(val('mValor')),dia=parseInt(val('mDia'),10);
    if(!descricao)return 'Dê um nome.';if(!valor)return 'Digite o valor.';if(!(dia>=1&&dia<=31))return 'O dia vai de 1 a 31.';
    const reg={descricao,valor,dia,categoria:sel('cat'),auto:sel('como')==='auto',ativa:sel('ativa')!=='0'};
    if(r.tipo==='gasto'&&S.temV10){const meio=sel('meio')||'pix';reg.meio=meio;reg.cartao_id=meio==='credito'?(sel('cartao')||null):null;if(meio==='credito'&&!reg.cartao_id)return 'Escolham o cartão.'}
    if(S.temV11){if(sel('dono'))reg.dono=sel('dono');const rest=parseInt(val('mRest'),10)||0;reg.fim=rest?addMes(proxCobranca(r),rest-1):null}
    const {error}=await sb.from('recorrentes').update(reg).eq('id',r.id);if(error)throw error;
    if(S.temV11&&reg.fim)await sb.from('lancamentos').update({status:'cancelado'}).eq('recorrente_id',r.id).eq('status','previsto').gt('ref_mes',reg.fim);
    const pend=S.itens.filter(i=>i.recorrente_id===r.id&&i.status==='previsto'&&!i.editado);
    for(const p of pend){await sb.from('lancamentos').update({valor,descricao,categoria:reg.categoria,data:diaNoMes(p.ref_mes||p.mes,dia)}).eq('id',p.id)}
    if(!reg.ativa)await sb.from('lancamentos').update({status:'cancelado'}).eq('recorrente_id',r.id).eq('status','previsto').gt('data',HOJE);
    toast('Conta atualizada');
  });
}
/* ---------- dívidas ---------- */
function modalDivida(d){
  modal(`<h2>${d?'Editar dívida':'Nova dívida'}</h2>
    <div class="row2"><label>Nome<input class="field" id="mNome" maxlength="60" placeholder="Ex.: Financiamento do carro" value="${esc(d?d.nome:'')}"></label>
    <label>Credor (opcional)<input class="field" id="mCred" maxlength="60" placeholder="Ex.: Banco X" value="${esc(d?d.credor:'')}"></label></div>
    <div class="row2"><label>Valor da parcela (R$)<input class="field" id="mParc" inputmode="decimal" placeholder="0,00" value="${d?fmtInput(d.parcela):''}"></label>
    <label>Dia do pagamento<input class="field" id="mDia" type="number" min="1" max="31" value="${d?d.dia:''}"></label></div>
    <div class="row2"><label>Total de parcelas<input class="field" id="mTot" type="number" min="1" value="${d?d.parcelas_total:''}"></label>
    <label>Já pagas antes de hoje<input class="field" id="mPag" type="number" min="0" value="${d?d.pagas_inicial:0}"></label></div>
    ${S.temV10?`<label>Observação (opcional)<input class="field" id="mNota" maxlength="200" placeholder="Ex.: contrato nº 123, quitação antecipada com desconto" value="${esc(d?d.nota||'':'')}"></label>
    <label>Contrato ou documento (opcional)<input class="field" id="mAnexo" type="file" accept="image/*,application/pdf">${d&&d.anexo?'<small class="mut">Já tem um documento. Escolha outro para substituir.</small>':''}</label>`:''}
    <label>Juros ao mês, em % (opcional)<input class="field" id="mJur" inputmode="decimal" placeholder="Ex.: 1,99" value="${d&&d.juros?fmtInput(d.juros):''}"></label>
    ${btns(d?'Salvar alterações':'Cadastrar dívida')}`,
  async()=>{
    const nome=val('mNome').trim(),parcela=parseValor(val('mParc')),dia=parseInt(val('mDia'),10),tot=parseInt(val('mTot'),10),pag=parseInt(val('mPag'),10)||0,jur=parseLivre(val('mJur'))||0;
    if(!nome)return 'Dê um nome para a dívida.';if(!parcela)return 'Digite o valor da parcela.';if(!(dia>=1&&dia<=31))return 'O dia vai de 1 a 31.';
    if(!(tot>=1))return 'Informe o total de parcelas.';if(pag<0||pag>tot)return 'As parcelas já pagas não podem passar do total.';
    const reg={nome,credor:val('mCred').trim(),parcela,dia,parcelas_total:tot,pagas_inicial:pag,juros:Math.max(0,jur)};
    if(S.temV10){const ex=await lerExtras();reg.nota=ex.nota||'';if(ex.anexo)reg.anexo=ex.anexo}
    const {error}=d?await sb.from('dividas').update(reg).eq('id',d.id):await sb.from('dividas').insert(reg);
    if(error)throw error;toast(d?'Dívida atualizada':'Dívida cadastrada');
  });
}
/* ---------- desejos ---------- */
function modalDesejo(d){
  modal(`<h2>${d?'Editar desejo':'Novo desejo'}</h2>
    <label>O que vocês querem<input class="field" id="mNome" maxlength="60" placeholder="Ex.: Viagem para a Bahia" value="${esc(d?d.nome:'')}"></label>
    <label style="margin-bottom:0">Ícone</label><div class="chips" data-g="emoji">${EMOJIS_DESEJO.map(e=>`<button type="button" class="chip" data-v="${e}" aria-pressed="${(d?d.emoji:'✨')===e}">${e}</button>`).join('')}</div>
    <label>Valor estimado (R$)<input class="field" id="mValor" inputmode="decimal" placeholder="0,00" value="${d?fmtInput(d.valor):''}"></label>
    <label style="margin-bottom:0">Prioridade</label><div class="seg" data-g="prio"><button type="button" data-v="1" aria-pressed="${d?d.prioridade===1:false}">Alta</button><button type="button" data-v="2" aria-pressed="${d?d.prioridade===2:true}">Média</button><button type="button" data-v="3" aria-pressed="${d?d.prioridade===3:false}">Baixa</button></div>
    <label>Link do produto (opcional)<input class="field" id="mLink" type="url" placeholder="https://" value="${esc(d?d.link:'')}"></label>
    ${btns(d?'Salvar alterações':'Adicionar desejo')}`,
  async()=>{
    const nome=val('mNome').trim(),valor=parseValor(val('mValor')),link=val('mLink').trim();
    if(!nome)return 'Dê um nome para o desejo.';if(!valor)return 'Digite o valor estimado.';
    if(link&&!/^https?:\/\//.test(link))return 'O link precisa começar com http:// ou https://';
    const reg={nome,valor,emoji:sel('emoji')||'✨',prioridade:parseInt(sel('prio')||'2',10),link};
    const {error}=d?await sb.from('desejos').update(reg).eq('id',d.id):await sb.from('desejos').insert(reg);
    if(error)throw error;toast(d?'Desejo atualizado':'Desejo adicionado');
  });
}
/* ---------- faturas do cartão, mês a mês ---------- */
const TAG_FAT={aberta:['idle','Aberta'],fechada:['soon','Fechada · a pagar'],atrasada:['late','Atrasada'],paga:['ok','Paga'],vazia:['idle','Sem compras']};
function abrirFaturas(cid,fm){
  const card=S.cartoes.find(c=>c.id===cid);if(!card)return;
  const d=dadosFatura(card,fm),t=TAG_FAT[d.k]||TAG_FAT.vazia;
  const ant=dadosFatura(card,addMes(fm,-1)),pro=dadosFatura(card,addMes(fm,1)),sub=x=>`${cap(soMes(x.mesFech))} · ${R0(x.total+x.totalPrev)}`;
  const linha=(x,prev)=>{
    const c=catVis(x),fora=!prev&&foraDoPeriodo(x,d.per),certo=fora?mesFatura(card,x.data):null,meu=!outroLivre(x);
    const st=prev?'<span class="badge-s ref">prevista</span>':x.status==='pago'?'<span class="badge-s">paga</span>':x.status==='previsto'?'<span class="badge-s ref">a confirmar</span>':'';
    return `<div class="fv-l ${prev?'prev':''} ${fora?'fora':''}"><span class="fv-d">${dataBR(x.data)}</span>
      <div class="fv-t"><b>${c.em} ${esc(descVis(x))}</b><div class="fv-b">${x.parcelas>1?`<span class="badge-s">parcela ${x.parcela}/${x.parcelas}</span>`:''}${x.recorrente_id?'<span class="badge-s">🔁 recorrente</span>':''}${donoBadge(x.dono)}${st}${fora?`<span class="badge-s ref">⚠ data fora do período</span><button type="button" class="lnk" data-act="item-mover" data-id="${x.id}" data-fm="${certo}">Mover para a fatura certa</button>`:''}</div></div>
      <b class="fv-v neg">${R(x.valor)}</b>
      <span class="acts">${prev||!meu?'':`<button class="ic" data-act="editar" data-id="${x.id}" aria-label="Editar">${svg('edit')}</button><button class="ic del" data-act="apagar" data-id="${x.id}" aria-label="Excluir">${svg('del')}</button>`}</span></div>`};
  const fact=(k,v,c,s)=>`<div class="fact"><small>${k}</small><b class="${c}">${v}</b>${s?`<small>${s}</small>`:''}</div>`;
  const vazio_=!d.it.length&&!d.prev.length;
  modal(`<h2>💳 ${esc(card.nome)}</h2>
    <div class="fat-view" data-fm="${fm}">
      <div class="fv-nav">
        <button type="button" class="fv-arrow" data-act="fat-nav" data-d="-1" aria-label="Fatura anterior"><span>‹</span><small>${esc(sub(ant))}</small></button>
        <div class="fv-title"><span class="fv-cap">Fatura de</span><b>${esc(nomeMes(d.mesFech))}</b><span>Fatura que fecha <b>${dataBR(d.fech)}</b> e vence <b>${dataBR(d.venc)}/${fm.slice(0,4)}</b></span><span>Compras de ${dataBR(d.per.ini)} a ${dataBR(d.per.fim)}</span><span class="tag ${t[0]}">${t[1]}</span></div>
        <button type="button" class="fv-arrow dir" data-act="fat-nav" data-d="1" aria-label="Próxima fatura"><span>›</span><small>${esc(sub(pro))}</small></button>
      </div>
      <div class="fv-tiles">
        ${fact('Total da fatura',R(d.total),d.total?'neg':'zero',d.prev.length?`+ ${R0(d.totalPrev)} previstos`:'')}
        ${fact('Já paga',R(d.pago),d.pago?'neg':'zero')}
        ${fact('A pagar',R(d.aberto),d.aberto?'ref':'zero')}
        ${fact('Lançamentos',String(d.it.length+d.prev.length),'zero',d.prev.length?`${d.prev.length} prevista${d.prev.length>1?'s':''}`:'')}
      </div>
      <div class="fv-acoes"><button class="btn sm ghost" data-act="fatura-add" data-id="${card.id}" data-fm="${fm}">${svg('plus')}Adicionar compra nesta fatura</button>${d.aberto>0?`<button class="btn sm ghost" data-act="fatura-prev" data-id="${card.id}" data-fm="${fm}">📅 ${pagPrevisto(card,fm)?'Pagar em '+dataBR(pagPrevisto(card,fm)):'Data prevista de pagamento'}</button>`:''}${d.aberto>0?`<button class="btn sm" data-act="fatura-pagar" data-id="${card.id}" data-fm="${fm}">Pagar fatura · ${R0(d.aberto)}</button>`:d.k==='paga'?`<button class="lnk" data-act="fatura-desfazer" data-id="${card.id}" data-fm="${fm}">Desfazer pagamento</button>`:''}</div>
      <div class="fv-lista">${vazio_?'<p class="nota" style="padding:18px 6px">Nenhuma compra nesta fatura.</p>':[...d.it].sort((a,b)=>a.data.localeCompare(b.data)||a.criadoEm-b.criadoEm).map(x=>linha(x,false)).join('')+d.prev.map(x=>linha(x,true)).join('')}</div>
    </div>
    <div class="btns"><button class="btn" data-m="cancelar">Fechar</button></div>`);
  S.fatView={cartao:cid,fm};S.fatAtiva=true;
}
function voltarOuFechar(){const v=S.fatVoltar;if(v){S.fatVoltar=null;abrirFaturas(v.cartao,v.fm)}else fechar()}
document.addEventListener('keydown',e=>{
  if(!S.fatAtiva||!$('dlg').open||document.querySelector('.dp-pop,.sel-pop'))return;
  if(/^(INPUT|SELECT|TEXTAREA)$/.test((e.target&&e.target.tagName)||''))return;
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();abrirFaturas(S.fatView.cartao,addMes(S.fatView.fm,e.key==='ArrowLeft'?-1:1))}
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.matches&&e.target.matches('.ccard-wrap[role=button]')){e.preventDefault();e.target.click()}});
/* ---------- segurança: verificação em 2 etapas ---------- */
function qrSrc(q){if(!q)return '';const m=String(q).match(/^data:image\/svg\+xml;(?:charset=)?utf-8,(.*)$/is);return m&&!/%3C/i.test(m[1])?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(m[1]):q}
async function modalSeguranca(){
  modal(`<h2>🔐 Segurança da conta</h2><p class="mut">Verificando…</p>`);
  const [f,dbRes,aal]=await Promise.all([fatorTotp().catch(()=>null),sb.rpc('mfa_ok').then(r=>r,()=>({error:true})),nivelAAL().catch(()=>null)]);
  const noBanco=!dbRes.error;
  const linhaBanco=noBanco?`<div class="sec-l ok"><b>Trava no banco de dados</b><span>Ativa: quem ligou a verificação só acessa os dados com o código.</span></div>`
    :`<div class="sec-l aviso"><b>Trava no banco de dados</b><span>Ainda não instalada. Rodem o <b>schema-v12.sql</b> no Supabase. Sem ele, a verificação vale só na tela do site e alguém com a senha poderia ignorá-la.</span></div>`;
  if(f){
    modal(`<h2>🔐 Segurança da conta</h2>
      <div class="sec-l ok"><b>Verificação em 2 etapas: ativada ✅</b><span>Ao entrar, o site pede o código do aplicativo autenticador${f.friendly_name?` (${esc(f.friendly_name)})`:''}.</span></div>
      ${linhaBanco}
      <p class="mut" style="font-size:13px">Perdeu o celular? Quem administra o Supabase remove a verificação em Authentication > Users, e você volta a entrar só com a senha.</p>
      <div class="erro" role="alert"></div>
      <div class="btns"><button class="btn danger" data-act="mfa-desativar">Desativar</button><button class="btn" data-m="cancelar">Fechar</button></div>`);
  }else{
    modal(`<h2>🔐 Segurança da conta</h2>
      <div class="sec-l aviso"><b>Verificação em 2 etapas: desativada</b><span>Hoje basta a senha (ou o Google) para entrar. Com a verificação, quem descobrir sua senha ainda precisa do seu celular.</span></div>
      ${linhaBanco}
      <div class="erro" role="alert"></div>
      <div class="btns"><button class="btn ghost" data-m="cancelar">Agora não</button><button class="btn" data-act="mfa-ativar">Ativar verificação em 2 etapas</button></div>`);
  }
}
async function iniciarEnroll(){
  const lista=await sb.auth.mfa.listFactors();
  for(const x of ((lista.data&&lista.data.all)||[]).filter(x=>x.status==='unverified'))await sb.auth.mfa.unenroll({factorId:x.id});
  const {data,error}=await sb.auth.mfa.enroll({factorType:'totp',friendlyName:'Controle 360 · '+new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})});
  if(error){toast(erroPT(error));return}
  const chave=data.totp.secret;
  modal(`<h2>Ativar verificação em 2 etapas</h2>
    <ol class="mfa-passos"><li>No celular, instale um aplicativo autenticador (Google Authenticator, Microsoft Authenticator, Authy…).</li><li>Escaneie o QR code abaixo, ou digite a chave.</li><li>Digite o código de 6 números que o aplicativo mostrar.</li></ol>
    <div class="mfa-qr"><img id="mfaQr" alt="QR code para o aplicativo autenticador" width="200" height="200"></div>
    <div class="mfa-chave"><small>Não consegue escanear? Digite esta chave no aplicativo:</small><code>${esc(chave)}</code><button type="button" class="lnk" data-act="copiar-chave" data-v="${esc(chave)}">Copiar chave</button></div>
    <p class="mut" style="font-size:13px">⚠️ Guardem essa chave num gerenciador de senhas. Ela é o jeito de recuperar o acesso se perderem o celular.</p>
    <label>Código de 6 números<input class="field mfa-cod" id="mCodigo" type="text" inputmode="numeric" data-num="int" maxlength="6" autocomplete="one-time-code" placeholder="000000"></label>
    ${btns('Confirmar e ativar')}`,
  async()=>{
    const code=val('mCodigo').trim();if(!/^\d{6}$/.test(code))return 'Digite os 6 números do aplicativo.';
    const {error:e2}=await sb.auth.mfa.challengeAndVerify({factorId:data.id,code});
    if(e2)return erroPT(e2);
    toast('Verificação em 2 etapas ativada');
  });
  $('mdl').querySelector('#mfaQr').src=qrSrc(data.totp.qr_code);
}
/* ---------- caixa, mesadas ---------- */
function modalCaixa(){
  modal(`<h2>Ajustar saldo em caixa</h2>
    <p class="mut" style="margin:-6px 0 16px">Somem o que vocês têm hoje nas contas e na carteira (sem contar o dinheiro das metas). A partir daí, cada entrada, gasto ou valor guardado atualiza o caixa sozinho.</p>
    <label>Quanto vocês têm hoje (R$)<input class="field big" id="mValor" inputmode="decimal" placeholder="0,00" value="${fmtInput(Math.round(emCaixa()*100)/100)}"></label>
    ${btns('Salvar saldo')}`,
  async()=>{
    const v=parseLivre(val('mValor'));if(v===null)return 'Digite um valor, por exemplo 8.500,00.';
    const {error}=await sb.from('config').upsert({id:'casal',saldo_inicial:Math.round((v-S.movCaixa)*100)/100,atualizado_em:new Date().toISOString()});
    if(error){if(/saldo_inicial/.test(error.message||''))return 'Falta rodar o arquivo schema-v3.sql no Supabase para liberar o ajuste.';throw error}
    toast('Saldo em caixa atualizado');
  });
}
function modalMesadas(){
  const ps=Object.keys(S.nomes);
  modal(`<h2>Dinheiro pessoal de cada um</h2><p class="mut" style="margin:-6px 0 16px">Quanto cada um pode gastar por mês, sem prestar contas.</p>
    ${ps.map((e,i)=>`<label>${esc(S.nomes[e]||e)} (R$ por mês)<input class="field" data-mes="${esc(e)}" inputmode="decimal" placeholder="0,00" value="${fmtInput(S.mesadas[e]||'')}"></label>`).join('')}
    ${btns('Salvar valores')}`,
  async()=>{
    const novo={};let ok=true;$('mdl').querySelectorAll('[data-mes]').forEach(inp=>{if(!inp.value.trim())return;const v=parseValor(inp.value);if(!v)ok=false;else novo[inp.dataset.mes]=v});
    if(!ok)return 'Algum valor está inválido.';
    const {error}=await sb.from('config').upsert({id:'casal',mesadas:novo,atualizado_em:new Date().toISOString()});
    if(error){if(/mesadas/.test(error.message||''))return 'Falta rodar o arquivo schema-v4.sql no Supabase.';throw error}
    toast('Valores salvos');
  });
}
/* ---------- menu "mais", exportar, instalar ---------- */
function modalMais(){
  modal(`<h2>Menu</h2>${GRUPOS.map(g=>`<div class="mais-g"><div class="side-title">${esc(g.nome)}</div><div class="mais">${g.views.map(id=>{const v=VIEWS.find(x=>x.id===id);return `<button data-go="${id}" ${S.view===id?'aria-current="page"':''}>${svg(id==='geral'?'geral':id==='reserva'?'metas':id==='contas'?'contas':id)}${esc(v.nome)}</button>`}).join('')}</div></div>`).join('')}
    <div class="side-title">Ferramentas</div>
    <div class="mais"><button data-act="priv">${svg(S.priv?'olhoF':'olho')}${S.priv?'Mostrar valores':'Esconder valores'}</button><button data-act="exportar">${svg('baixar')}Exportar</button>${standalone()?'':`<button data-act="instalar">${svg('instalar')}Instalar app</button>`}
    <button data-act="seguranca">${svg('escudo')}Segurança</button><button data-act="ajustar-caixa">💵 Ajustar saldo</button><button data-act="sair">${svg('sair')}Sair</button></div>
    <div class="btns"><button class="btn ghost" data-m="cancelar">Fechar</button></div>`);
}
function modalExportar(){
  modal(`<h2>Exportar</h2><p class="mut" style="margin:-6px 0 16px">Para guardar, imprimir ou levar a um planejador financeiro.</p>
    <div style="display:flex;flex-direction:column;gap:10px">
      <button class="btn" data-act="exp-excel-mes">${svg('baixar')}Excel de ${esc(soMes(S.mes))} de ${S.mes.slice(0,4)}</button>
      <button class="btn" data-act="exp-excel-ano">${svg('baixar')}Excel do ano de ${S.view==='retro'?S.ano:ANO_ATUAL}</button>
      <button class="btn ghost" data-act="exp-pdf">PDF desta tela</button></div>
    <p class="mut" style="font-size:13px;margin:12px 0 0">No PDF, escolham "Salvar como PDF" na janela de impressão.</p>
    <div class="btns" style="margin-top:16px"><button class="btn ghost" data-m="cancelar">Fechar</button></div>`);
}
function carregarScript(src){return new Promise((res,rej)=>{if(document.querySelector(`script[src="${src}"]`)&&window.XLSX)return res();const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.append(s)})}
async function exportarExcel(periodo){
  fechar();toast('Preparando o arquivo…');
  try{await carregarScript('xlsx.full.min.js')}catch(e){toast('Não deu para carregar o gerador de Excel.');return}
  let rows,nome;
  if(periodo==='mes'){rows=doMes(S.mes);nome='planejamento-'+S.mes}
  else{const ano=S.view==='retro'?S.ano:ANO_ATUAL;if(!S.retro[ano])await carregarRetro(ano);rows=S.retro[ano]||[];nome='planejamento-'+ano}
  if(!rows.length){toast('Não há lançamentos nesse período.');return}
  const TIPO={gasto:'Gasto',entrada:'Entrada',aporte:'Guardado em meta',resgate:'Resgate de meta'};
  const ord=[...rows].sort((a,b)=>a.data.localeCompare(b.data));
  const linhas=ord.map(i=>{const cc=i.cartao_id&&S.cartoes.find(c=>c.id===i.cartao_id);const [y,m,d]=i.data.split('-');
    return {'Data':`${d}/${m}/${y}`,'Tipo':TIPO[i.tipo]||i.tipo,'Descrição':descVis(i),'Categoria':catVis(i).nome,'Valor (R$)':(i.tipo==='entrada'||i.tipo==='resgate'?1:-1)*i.valor,'Quem lançou':nomeDe(i.autor)||'Automático','Cartão':cc?cc.nome:''}});
  const meses=[...new Set(ord.map(i=>i.data.slice(0,7)))];
  const f=(a,t)=>a.filter(x=>x.tipo===t).reduce((s,x)=>s+x.valor,0);
  const resumoM=meses.map(m=>{const a=ord.filter(x=>x.data.slice(0,7)===m);const e=f(a,'entrada'),g=f(a,'gasto'),ap=f(a,'aporte')-f(a,'resgate');return {'Mês':nomeMes(m),'Entradas':e,'Gastos':g,'Guardado em metas':ap,'Sobra':e-g-ap}});
  const cats={};ord.filter(x=>x.tipo==='gasto').forEach(x=>{const n=(CAT[x.categoria]||{nome:x.categoria}).nome;cats[n]=(cats[n]||0)+x.valor});
  const catRows=Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({'Categoria':k,'Total gasto':v}));
  const wb=XLSX.utils.book_new();
  const w1=XLSX.utils.json_to_sheet(linhas);w1['!cols']=[{wch:12},{wch:18},{wch:38},{wch:24},{wch:14},{wch:16},{wch:14}];
  const w2=XLSX.utils.json_to_sheet(resumoM);w2['!cols']=[{wch:20},{wch:14},{wch:14},{wch:18},{wch:14}];
  const w3=XLSX.utils.json_to_sheet(catRows);w3['!cols']=[{wch:26},{wch:14}];
  XLSX.utils.book_append_sheet(wb,w2,'Resumo');XLSX.utils.book_append_sheet(wb,w1,'Lançamentos');XLSX.utils.book_append_sheet(wb,w3,'Categorias');
  XLSX.writeFile(wb,nome+'.xlsx');toast('Arquivo baixado');
}
function standalone(){return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function instalar(){
  if(instalarEvt){fechar();instalarEvt.prompt();instalarEvt.userChoice.finally(()=>{instalarEvt=null});return}
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  info('Instalar como app',ios?`<p>No iPhone, abra o site no <b>Safari</b> e:</p><ol style="line-height:1.8;padding-left:20px"><li>Toque no botão <b>Compartilhar</b> (quadrado com seta para cima).</li><li>Escolha <b>Adicionar à Tela de Início</b>.</li><li>Toque em <b>Adicionar</b>.</li></ol>`
    :`<p>No <b>Android</b>, abra no Chrome, toque no menu <b>⋮</b> e escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</p><p>No <b>computador</b>, no Chrome ou no Edge, clique no ícone de instalar que aparece no canto direito da barra de endereço.</p>`);
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();instalarEvt=e});
const VERSAO='28';
if($('verLogin'))$('verLogin').textContent='Versão '+VERSAO;
/* atualização automática: quando sai uma versão nova, o site se recarrega sozinho (espera fechar a janela aberta, se houver) */
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
  const tinhaControle=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').then(r=>{if(r&&r.update)r.update().catch(()=>{})}).catch(()=>{});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!tinhaControle)return;toast('Versão nova disponível. Atualizando…');const rec=()=>setTimeout(()=>location.reload(),900);$('dlg').open?$('dlg').addEventListener('close',rec,{once:true}):rec()});
}

/* ================= ações ================= */
async function inserir(t,reg,msg){const {error}=await sb.from(t).insert(reg);if(error){toast('Não deu para salvar: '+error.message);return false}if(msg)toast(msg);recarregar();return true}
document.addEventListener('click',async e=>{
  const gn=e.target.closest('[data-grupo-nav]');if(gn){const g=GRUPOS.find(x=>x.id===gn.dataset.grupoNav);S.abertos=S.abertos||{};
    S.abertos[g.id]=true;irGrupo(g.id);return}
  const gr=e.target.closest('[data-grupo]');if(gr){fechar();irGrupo(gr.dataset.grupo);return}
  const go=e.target.closest('[data-go]');if(go){fechar();ir(go.dataset.go);return}
  if(!e.target.closest('[data-fatia]')&&document.querySelector('#view .fatia.on')){document.querySelectorAll('#view [data-fatia].on').forEach(x=>x.classList.remove('on'));$('pieBox')?.classList.remove('ativo');const t=$('pieTip');if(t)t.hidden=true}
  const a=e.target.closest('[data-act]');if(!a||a.disabled)return;
  const id=a.dataset.id,act=a.dataset.act;
  if(a.closest('.fat-view')&&['editar','apagar','fatura-pagar','fatura-add','fatura-prev'].includes(act))S.fatVoltar={...S.fatView};
  const item=S.itens.find(i=>i.id===id)||S.card.find(i=>i.id===id),meta=S.metas.find(m=>m.id===id),conta=S.contas.find(c=>c.id===id),cartao=S.cartoes.find(c=>c.id===id),
    rec=S.recorrentes.find(r=>r.id===id),div=S.dividas.find(d=>d.id===id),des=S.desejos.find(d=>d.id===id);
  switch(act){
    case 'mes-1':S.mes=addMes(S.mes,-1);await carregarItens();render();break;
    case 'mes+1':S.mes=addMes(S.mes,1);await carregarItens();render();break;
    case 'ano-1':S.ano--;render();break;
    case 'ano+1':S.ano++;render();break;
    case 'novo':modalLancamento(a.dataset.tipo||'gasto',null,{cat:a.dataset.cat,data:a.dataset.data,livre:a.dataset.livre==='1'});break;
    case 'editar':if(item)modalLancamento(null,item);break;
    case 'apagar':if(!item)break;
      if(item.recorrente_id)confirmar('Pular este mês?',`${esc(descVis(item))} deixa de acontecer em ${esc(soMes(item.ref_mes||item.mes))}. A conta continua nos próximos meses.`,'Pular este mês',async()=>{const antes=item.status;const {error}=await sb.from('lancamentos').update({status:'cancelado'}).eq('id',id);if(error)throw error;toastDesfazer('Mês pulado',async()=>{const r=await sb.from('lancamentos').update({status:antes}).eq('id',id);if(r.error)throw r.error})});
      else if(item.compra_id&&item.parcelas>1)confirmar('Apagar compra parcelada?',`${esc(item.descricao.replace(/\s\(\d+\/\d+\)$/,''))} tem ${item.parcelas} parcelas. Todas saem dos gastos, das faturas e das projeções.`,'Apagar compra inteira',async()=>{const {data:orig}=await sb.from('lancamentos').select('*').eq('compra_id',item.compra_id);const {error}=await sb.from('lancamentos').delete().eq('compra_id',item.compra_id);if(error)throw error;
        if(orig&&orig.length)toastDesfazer('Compra apagada',async()=>{const r=await sb.from('lancamentos').insert(orig);if(r.error)throw r.error});else toast('Compra apagada')});
      else confirmar('Apagar lançamento?',`${esc(descVis(item))} de ${R(item.valor)} sai de todo o site para vocês dois.`,'Apagar',async()=>{const {data:orig}=await sb.from('lancamentos').select('*').eq('id',id);const {error}=await sb.from('lancamentos').delete().eq('id',id);if(error)throw error;
        if(orig&&orig.length)toastDesfazer('Lançamento apagado',async()=>{const r=await sb.from('lancamentos').insert(orig);if(r.error)throw r.error});else toast('Lançamento apagado')});break;
    case 'duplicar':{if(!item||!(item.tipo==='gasto'||item.tipo==='entrada')||item.recorrente_id||item.parcelas>1){toast('Só gastos e entradas avulsos podem ser duplicados.');break}
      a.disabled=true;const cd=item.cartao_id&&S.cartoes.find(c=>c.id===item.cartao_id);
      const nova={tipo:item.tipo,valor:item.valor,descricao:item.descricao,categoria:item.categoria,data:HOJE,meio:item.meio||'',...(item.livre?{livre:true}:{}),...(item.dono?{dono:item.dono}:{}),...(item.tags&&item.tags.length?{tags:item.tags}:{}),
        ...(cd?{cartao_id:cd.id,fatura_mes:mesFatura(cd,HOJE),status:'comprometido',meio:'credito',compra_id:uuid(),parcela:1,parcelas:1}:{status:'pago'})};
      const {data:ins,error}=await sb.from('lancamentos').insert(nova).select('id');a.disabled=false;
      if(error){toast('Não deu para duplicar agora.');break}
      if(HOJE.slice(0,7)!==S.mes){S.mes=HOJE.slice(0,7)}
      toastDesfazer(`Duplicado para hoje · ${R(item.valor)}`,async()=>{const r=await sb.from('lancamentos').delete().in('id',(ins||[]).map(x=>x.id));if(r.error)throw r.error});break}
    case 'busca':modalBusca();break;
    case 'busca-ir':{const m=a.dataset.mes,v=a.dataset.v;fechar();S.mes=m;await carregarItens();ir(v);break}
    case 'cal-dia':S.calDia=a.dataset.d;render();break;
    case 'meta-nova':modalMeta();break;
    case 'meta-editar':if(meta)modalMeta(meta);break;
    case 'meta-apagar':if(meta)confirmar('Excluir meta?',`A meta ${esc(meta.nome)} e todo o histórico de dinheiro guardado nela serão apagados.`,'Excluir meta',async()=>{const {error}=await sb.from('metas').delete().eq('id',id);if(error)throw error;toast('Meta excluída')});break;
    case 'aporte':case 'resgate':if(meta)modalAporte(meta,act);break;
    case 'reserva-criar':modalReserva();break;
    case 'reserva-ajustar':{const m=S.metas.find(x=>x.reserva),v=reservaIdeal();if(m&&v){const {error}=await sb.from('metas').update({alvo:v}).eq('id',m.id);if(error)toast('Não deu para atualizar.');else{toast('Alvo atualizado');recarregar()}}}break;
    case 'conta-nova':case 'cr-nova':case 'rec-novo':modalContaNova();break;
    case 'cartao-novo':modalCartao();break;
    case 'cartao-editar':if(cartao)modalCartao(cartao);break;
    case 'cartao-apagar':if(cartao)confirmar('Excluir cartão?',`O cartão ${esc(cartao.nome)} será removido. As compras já lançadas continuam nos gastos.`,'Excluir cartão',async()=>{const {error}=await sb.from('cartoes').delete().eq('id',id);if(error)throw error;toast('Cartão excluído')});break;
    case 'rec-editar':if(rec)modalRecorrente(rec);break;
    case 'rec-apagar':if(rec)confirmar('Excluir conta?',`${esc(rec.descricao)} deixa de acontecer nos próximos meses. O que já foi confirmado continua no histórico.`,'Excluir',async()=>{await sb.from('lancamentos').delete().eq('recorrente_id',id).eq('status','previsto');const {error}=await sb.from('recorrentes').delete().eq('id',id);if(error)throw error;toast('Conta excluída')});break;
    case 'div-nova':modalDivida();break;
    case 'div-editar':if(div)modalDivida(div);break;
    case 'div-apagar':if(div)confirmar('Excluir dívida?',`${esc(div.nome)} será removida. Os pagamentos já lançados continuam nos gastos.`,'Excluir',async()=>{const {error}=await sb.from('dividas').delete().eq('id',id);if(error)throw error;toast('Dívida excluída')});break;
    case 'div-pagar':if(div)modalPagarDivida(div);break;
    case 'div-desfazer':if(div){a.disabled=true;const {error}=await sb.from('lancamentos').delete().eq('divida_id',div.id).in('tipo',['divida','gasto']).gte('data',S.mes+'-01').lt('data',addMes(S.mes,1)+'-01');
      if(error){toast('Não deu para desfazer.');a.disabled=false}else{toast('Pagamento desfeito');recarregar()}}break;
    case 'des-novo':modalDesejo();break;
    case 'des-editar':if(des)modalDesejo(des);break;
    case 'des-apagar':if(des)confirmar('Excluir desejo?',`${esc(des.nome)} sai da lista.`,'Excluir',async()=>{const {error}=await sb.from('desejos').delete().eq('id',id);if(error)throw error;toast('Desejo excluído')});break;
    case 'des-aba':S.abaDesejos=a.dataset.v;render();break;
    case 'des-simular':if(des){S.sim={nome:des.nome,valor:fmtInput(des.valor),forma:'vista',n:10};render();window.scrollTo({top:0,behavior:'smooth'})}break;
    case 'des-meta':if(des){a.disabled=true;const {error}=await sb.from('metas').insert({nome:des.nome.slice(0,60),emoji:EMOJIS_META.includes(des.emoji)?des.emoji:'🎯',alvo:des.valor});
      if(error){toast('Não deu para criar a meta.');a.disabled=false;break}await sb.from('desejos').update({status:'meta'}).eq('id',des.id);toast('Virou meta! Vejam em Metas.');recarregar()}break;
    case 'des-comprado':if(des)modalLancamento('gasto',null,{valor:des.valor,desc:des.nome,cat:'compras',after:async()=>{await sb.from('desejos').update({status:'comprado'}).eq('id',des.id)}});break;
    case 'des-reabrir':if(des){await sb.from('desejos').update({status:'aberto'}).eq('id',des.id);recarregar()}break;
    case 'orc-zerar':{const k=a.dataset.cat,pl=planejado(S.mes);if(!pl.gastos[k])break;const g={...pl.gastos};delete g[k];S.orc[S.mes]={gastos:g,entradas:pl.entradas||0};render();
      const {error}=await sb.from('orcamentos').upsert({mes:S.mes,gastos:g,entradas:pl.entradas||0,atualizado_em:new Date().toISOString()});
      if(error)toast('Não deu para zerar agora.');else toast((CAT[k]||{nome:''}).nome+': planejado zerado')}break;
    case 'orc-padrao':{const p=planejado(S.mes);a.disabled=true;const {error}=await sb.from('config').upsert({id:'casal',limites:p.gastos,atualizado_em:new Date().toISOString()});a.disabled=false;
      if(error)toast('Não deu para salvar agora.');else{toast('Este orçamento virou o padrão dos próximos meses');recarregar()}}break;
    case 'orc-copiar':{const p=planejado(addMes(S.mes,-1));a.disabled=true;const {error}=await sb.from('orcamentos').upsert({mes:S.mes,gastos:p.gastos,entradas:p.entradas||0,atualizado_em:new Date().toISOString()});a.disabled=false;
      if(error)toast(/orcamentos/.test(error.message||'')?'Falta rodar o schema-v4.sql no Supabase.':'Não deu para copiar agora.');else{toast('Orçamento copiado do mês anterior');recarregar()}}break;
    case 'inv-novo':modalInvest();break;
    case 'inv-editar':{const x=S.invest.find(i=>i.id===id);if(x)modalInvest(x)}break;
    case 'inv-apagar':{const x=S.invest.find(i=>i.id===id);if(!x)break;const movs=S.itens.filter(i=>i.investimento_id===x.id).length;
      confirmar('Excluir investimento?',`${esc(x.produto||x.nome||(INVT[x.tipo]||{nome:''}).nome)} sai da carteira e <b>todos os aportes e resgates dele também são desfeitos</b>: o caixa, o patrimônio, o calendário e os relatórios são recalculados como se ele nunca tivesse existido.${movs?'':' (Investimentos cadastrados como "já tínhamos" não mexem no caixa.)'} Se o dinheiro voltou de verdade para a conta, usem Resgatar em vez de excluir.`,'Excluir e desfazer',
        async()=>{const r1=await sb.from('lancamentos').delete().eq('investimento_id',x.id);if(r1.error)throw r1.error;const {error}=await sb.from('investimentos').delete().eq('id',x.id);if(error)throw error;toast('Investimento e aportes excluídos')})}break;
    case 'seguranca':modalSeguranca();break;
    case 'mfa-ativar':iniciarEnroll();break;
    case 'mfa-desativar':confirmar('Desativar a verificação em 2 etapas?','A conta volta a entrar só com a senha (ou o Google). Seus dados ficam menos protegidos.','Desativar',async()=>{const f=await fatorTotp();if(!f)return 'Nada para desativar.';const {error}=await sb.auth.mfa.unenroll({factorId:f.id});if(error)return erroPT(error);toast('Verificação em 2 etapas desativada')});break;
    case 'copiar-chave':{try{await navigator.clipboard.writeText(a.dataset.v);toast('Chave copiada')}catch(x){toast('Não deu para copiar. Selecione a chave e copie.')}}break;
    case 'novo-global':modalNovo();break;
    case 'proj-detalhe':modalProjecao();break;
    case 'n-gasto':modalLancamento('gasto');break;
    case 'n-entrada':modalLancamento('entrada');break;
    case 'compra-cartao':modalCompraCartao();break;
    case 'n-transf':modalTransf();break;
    case 'n-invest':modalEscolherInvest('aporte');break;
    case 'n-invest-res':modalEscolherInvest('resgate');break;
    case 'n-meta':modalEscolherMeta('aporte');break;
    case 'n-meta-res':modalEscolherMeta('resgate');break;
    case 'inv-aportar':case 'inv-resgatar':{const x=S.invest.find(i=>i.id===id);if(x)modalMovInvest(x,act==='inv-aportar'?'aporte':'resgate')}break;
    case 'oc-confirmar':if(item)modalConfirmarOc(item);break;
    case 'oc-editar':if(item)modalEditarLanc(item);break;
    case 'oc-pular':case 'oc-reativar':case 'oc-desfazer':if(item){a.disabled=true;const {error}=await sb.from('lancamentos').update({status:act==='oc-pular'?'cancelado':'previsto'}).eq('id',id);
      if(error){toast('Não deu para alterar agora.');a.disabled=false}else{toast(act==='oc-pular'?'Mês pulado. Ela some desta tela; para rever, use “Mostrar contas fora do mês”.':act==='oc-desfazer'?'Confirmação desfeita':'Ocorrência reativada');recarregar()}}break;
    case 'ct-cat':S.ctF=S.ctF||{dono:'',cartao:'',cat:''};S.ctF.cat=a.dataset.v===S.ctF.cat?'':a.dataset.v;render();break;
    case 'ct-fora':S.ctF=S.ctF||{dono:'',cartao:'',cat:'',fora:false};S.ctF.fora=!S.ctF.fora;render();break;
    case 'ct-dono':S.ctF=S.ctF||{dono:'',cartao:''};S.ctF.dono=a.dataset.v;render();break;
    case 'faturas':abrirFaturas(id,a.dataset.fm||mesFatura(S.cartoes.find(c=>c.id===id)||{fechamento:28,vencimento:5},HOJE));break;
    case 'fat-nav':abrirFaturas(S.fatView.cartao,addMes(S.fatView.fm,Number(a.dataset.d)));break;
    case 'item-mover':{const x=S.card.find(i=>i.id===id);if(!x)break;a.disabled=true;const delta=difMes(x.fatura_mes,a.dataset.fm);
      const lote=x.compra_id&&x.parcelas>1?S.card.filter(i=>i.compra_id===x.compra_id):[x];let falhou=false;
      for(const y of lote){const {error}=await sb.from('lancamentos').update({fatura_mes:addMes(y.fatura_mes,delta)}).eq('id',y.id);if(error)falhou=true}
      toast(falhou?'Não deu para mover agora.':(lote.length>1?`${lote.length} parcelas movidas`:'Movida para a fatura certa'));
      const v={...S.fatView};await recarregar();abrirFaturas(v.cartao,v.fm)}break;
    case 'fatura-add':if(cartao){const fm=a.dataset.fm,fech=fechamentoFatura(cartao,fm);modalCompraCartao({cartao:cartao.id,fm,data:HOJE<=fech?HOJE:fech})}break;
    case 'fatura-pagar':if(cartao)modalPagarFatura(cartao,a.dataset.fm);break;
    case 'fatura-prev':if(cartao)modalPagPrev(cartao,a.dataset.fm);break;
    case 'patr-ini':modalPatrIni();break;
    case 'renda-media':modalRendaMedia();break;
    case 'kpi-det':(a.dataset.k==='entradas'||a.dataset.k==='gastos')?modalFluxo(a.dataset.k):modalKpi(a.dataset.k);break;
    case 'det-fluxo':modalFluxo(a.dataset.k,true);break;
    case 'det-proj':modalProjecao();break;
    case 'det-edit':{const it=S.itens.find(x=>x.id===a.dataset.id);if(it)modalLancamento(null,it)}break;
    case 'glossario':modalGlossario();break;
    case 'fatura-desfazer':if(cartao){const volta=a.closest('.fat-view')?{...S.fatView}:null;a.disabled=true;const {error}=await sb.from('lancamentos').update({status:'comprometido'}).eq('cartao_id',cartao.id).eq('fatura_mes',a.dataset.fm).eq('status','pago');
      if(error){toast('Não deu para desfazer.');a.disabled=false}else{toast('Pagamento da fatura desfeito');await recarregar();if(volta)abrirFaturas(volta.cartao,volta.fm)}}break;
    case 'sim-comprar':{const v=parseValor(S.sim.valor);if(!v)break;if(S.sim.forma==='parc')modalCompraCartao({valor:v,desc:S.sim.nome,n:parseInt(S.sim.n,10)||2});else modalLancamento('gasto',null,{valor:v,desc:S.sim.nome,cat:'compras'})}break;
    case 'n-divida':modalEscolherDivida();break;
    case 'ver-anexo':{const p=a.dataset.path;if(!p)break;const {data,error}=await sb.storage.from('anexos').createSignedUrl(p,300);if(error||!data){toast('Não deu para abrir o anexo.');break}window.open(data.signedUrl,'_blank','noopener')}break;
    case 'fechar-mes':{if(!S.temV10){toast('Falta rodar o arquivo schema-v10.sql no Supabase.');break}if(!S.hist){await carregarHist()}const m=S.mes,res=resumoFech(m);
      confirmar('Fechar '+soMes(m)+'?',`${m===MES_ATUAL&&HOJE<m+'-'+pad(ultimoDia(m))?`<b class="neg">O mês ainda não terminou</b> (hoje é ${dataBR(HOJE)}). Fechar agora salva um resumo parcial. `:''}O resumo do mês fica salvo como está agora: entradas <b class="pos">${R0(res.entradas)}</b>, gastos <b class="neg">${R0(res.gastos)}</b>, investimentos <b class="ref">${R0(res.investimentos)}</b>, metas <b class="ref">${R0(res.metas)}</b>${res.saldo_final!=null?`, saldo final <b>${R0(res.saldo_final)}</b>`:''}. ${S.orc[addMes(m,1)]?'':'O orçamento deste mês também é copiado para '+soMes(addMes(m,1))+', para começar o próximo período. '}Os lançamentos continuam editáveis; dá para reabrir o mês depois.`,'Fechar mês',
        async()=>{const {error}=await sb.from('fechamentos').upsert({mes:m,resumo:res,criado_em:new Date().toISOString()});if(error)throw error;
          const prox=addMes(m,1);if(!S.orc[prox]){const p=planejado(m);await sb.from('orcamentos').upsert({mes:prox,gastos:p.gastos,entradas:p.entradas||0,atualizado_em:new Date().toISOString()})}
          toast(cap(soMes(m))+' fechado')})}break;
    case 'reabrir-mes':confirmar('Reabrir '+soMes(S.mes)+'?','O resumo salvo no fechamento é descartado. Os lançamentos do mês não mudam.','Reabrir mês',async()=>{const {error}=await sb.from('fechamentos').delete().eq('mes',S.mes);if(error)throw error;toast('Mês reaberto')});break;
    case 'reserva-excluir':{const m=S.metas.find(x=>x.reserva);if(!m)break;const g=guardadoMeta(m.id);modalExcluirReserva(m,g)}break;
    case 'mesadas':modalMesadas();break;
    case 'ajustar-caixa':modalCaixa();break;
    case 'priv':S.priv=!S.priv;try{localStorage.setItem('pf-priv',S.priv?'1':'0')}catch(x){}navHTML();if($('dlg').open)modalMais();break;
    case 'mais':modalMais();break;
    case 'ir-retro':S.ano=hojeD.getMonth()===0?ANO_ATUAL-1:ANO_ATUAL;ir('retro');break;
    case 'exportar':modalExportar();break;
    case 'exp-excel-mes':exportarExcel('mes');break;
    case 'exp-excel-ano':exportarExcel('ano');break;
    case 'exp-pdf':fechar();setTimeout(()=>window.print(),350);break;
    case 'instalar':instalar();break;
    case 'sair':sair();break;
  }
});
window.addEventListener('hashchange',()=>{let v=location.hash.slice(1);v=ALIAS[v]||v;if(VIEWS.some(x=>x.id===v)&&v!==S.view){S.view=v;S.ultima[grupoDe(v).id]=v;render()}});

/* ================= login ================= */
const URL_SITE=location.origin+location.pathname;
let recuperando=/type=recovery/.test(location.hash+location.search);
function msgLogin(t,erro){const m=$('lMsg');m.textContent=t||'';m.classList.toggle('erro-l',!!erro)}
const MODOS_LOGIN=['lForm','lReset','lNova','lMfa'];
function modoLogin(m){MODOS_LOGIN.forEach(id=>$(id).hidden=id!==m);msgLogin('')}
function telaLogin(msg,semForm){$('app').hidden=true;$('login').hidden=false;modoLogin(semForm?'':'lForm');if(semForm)MODOS_LOGIN.forEach(id=>$(id).hidden=true);msgLogin(msg||'',!!semForm)}
function erroPT(e){const m=(e&&e.message)||'';
  if(/invalid totp|totp code|invalid.*(mfa|code)/i.test(m))return 'Código incorreto ou vencido. Use o código atual do aplicativo (ele muda a cada 30 segundos) e confira se a hora do celular está automática.';
  if(/enabled|not.*support/i.test(m)&&/mfa|factor|totp/i.test(m))return 'A verificação em 2 etapas está desligada no Supabase. Ative em Authentication > Multi-Factor.';
  if(/Invalid login credentials/i.test(m))return 'E-mail ou senha incorretos. Se ainda não criou uma senha, use o link abaixo.';
  if(/Email not confirmed/i.test(m))return 'Confirme seu e-mail primeiro: abra a mensagem que enviamos.';
  if(/rate limit|security purposes|too many/i.test(m))return 'Muitas tentativas seguidas. Espere um minuto e tente de novo.';
  if(/should be different/i.test(m))return 'A nova senha precisa ser diferente da anterior.';
  if(/at least|weak|short/i.test(m))return 'Senha muito curta ou fraca. Use pelo menos 8 caracteres.';
  if(/provider is not enabled|Unsupported provider/i.test(m))return 'O login com Google ainda não foi ativado no Supabase.';
  return m||'Algo deu errado. Tente de novo.'}
/* verificação em 2 etapas: depois do login, quem ativou precisa confirmar o código antes de ver qualquer dado */
async function nivelAAL(){if(!sb.auth.mfa)return null;const {data,error}=await sb.auth.mfa.getAuthenticatorAssuranceLevel();return error?null:data}
async function fatorTotp(){if(!sb.auth.mfa)return null;const {data}=await sb.auth.mfa.listFactors();const all=(data&&data.all)||[];
  return all.find(f=>(f.factor_type||f.type)==='totp'&&f.status==='verified')||((data&&data.totp)||[])[0]||null}
let entrando=false;
async function aposLogin(sessao){
  if(entrando)return;entrando=true;
  try{const a=await nivelAAL();
    if(a&&a.nextLevel==='aal2'&&a.currentLevel!=='aal2'){telaMfa();return}
    await entrar(sessao)}
  finally{entrando=false}
}
function telaMfa(){$('app').hidden=true;$('login').hidden=false;modoLogin('lMfa');$('lSair').hidden=true;$('lCodigo').value='';setTimeout(()=>$('lCodigo').focus(),60)}
async function verificarMfa(){
  const code=$('lCodigo').value.trim();
  if(!/^\d{6}$/.test(code))return msgLogin('Digite os 6 números do aplicativo.',true);
  $('lVerificar').disabled=true;msgLogin('Verificando…');
  const f=await fatorTotp();
  if(!f){$('lVerificar').disabled=false;return msgLogin('Não encontrei a verificação em 2 etapas desta conta. Entre de novo.',true)}
  const {error}=await sb.auth.mfa.challengeAndVerify({factorId:f.id,code});
  $('lVerificar').disabled=false;
  if(error){$('lCodigo').value='';$('lCodigo').focus();return msgLogin(erroPT(error),true)}
  if(S.voltarSenha){S.voltarSenha=false;modoLogin('lNova');return msgLogin('Código confirmado. Agora salve a nova senha.')}
  msgLogin('');const {data:{session}}=await sb.auth.getSession();if(session)await entrar(session);
}
$('lVerificar').addEventListener('click',verificarMfa);
$('lCodigo').addEventListener('keydown',e=>{if(e.key==='Enter')verificarMfa()});
$('lCodigo').addEventListener('input',()=>{if($('lCodigo').value.length===6)verificarMfa()});
$('lVoltarMfa').addEventListener('click',()=>sair());
async function entrar(sessao){
  S.me=(sessao.user.email||'').toLowerCase();
  const {data,error}=await sb.from('membros').select('email,nome');
  if(error||!data||!data.length){telaLogin('A conta '+S.me+' não está na lista de quem pode usar este site.',true);$('lSair').hidden=false;return}
  S.nomes=Object.fromEntries(data.map(m=>[m.email.toLowerCase(),m.nome]));
  $('whoName').textContent=S.nomes[S.me]||S.me.split('@')[0];if($('ver'))$('ver').textContent='Versão '+VERSAO;$('whoMail').textContent=S.me;
  if(standalone())$('instBtn').hidden=true;
  if(/access_token|type=/.test(location.hash))history.replaceState(null,'',location.pathname);
  let h=location.hash.slice(1);h=ALIAS[h]||h;if(VIEWS.some(v=>v.id===h)){S.view=h;S.ultima[grupoDe(h).id]=h}
  $('login').hidden=true;$('app').hidden=false;
  render();await recarregar();assinar();
}
$('lGoogle').addEventListener('click',async()=>{
  $('lGoogle').disabled=true;msgLogin('Abrindo o Google…');
  const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:URL_SITE,queryParams:{prompt:'select_account'}}});
  if(error){$('lGoogle').disabled=false;msgLogin(erroPT(error),true)}
});
async function entrarSenha(){
  const email=$('lEmail').value.trim(),password=$('lSenha').value;
  if(!/^\S+@\S+\.\S+$/.test(email))return msgLogin('Digite um e-mail válido.',true);
  if(!password)return msgLogin('Digite sua senha.',true);
  $('lEntrar').disabled=true;msgLogin('Entrando…');
  const {data,error}=await sb.auth.signInWithPassword({email,password});
  $('lEntrar').disabled=false;
  if(error)return msgLogin(erroPT(error),true);
  msgLogin('');aposLogin(data.session);
}
$('lEntrar').addEventListener('click',entrarSenha);
$('lSenha').addEventListener('keydown',e=>{if(e.key==='Enter')entrarSenha()});
$('lEsqueci').addEventListener('click',()=>{modoLogin('lReset');$('lEmailR').value=$('lEmail').value;$('lEmailR').focus()});
$('lVoltar').addEventListener('click',()=>modoLogin('lForm'));
$('lEnviarR').addEventListener('click',async()=>{
  const email=$('lEmailR').value.trim();
  if(!/^\S+@\S+\.\S+$/.test(email))return msgLogin('Digite um e-mail válido.',true);
  $('lEnviarR').disabled=true;
  const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:URL_SITE});
  $('lEnviarR').disabled=false;
  if(error)return msgLogin(erroPT(error),true);
  msgLogin('Pronto! Se esse e-mail tiver acesso, chega um link em instantes. Abra-o neste aparelho para criar a senha.');
});
$('lSalvarSenha').addEventListener('click',async()=>{
  const s1=$('lSenha1').value,s2=$('lSenha2').value;
  if(s1.length<8)return msgLogin('Use pelo menos 8 caracteres.',true);
  if(s1!==s2)return msgLogin('As duas senhas não são iguais.',true);
  $('lSalvarSenha').disabled=true;
  const {error}=await sb.auth.updateUser({password:s1});
  $('lSalvarSenha').disabled=false;
  if(error&&/aal2/i.test(error.message||'')){S.voltarSenha=true;telaMfa();return msgLogin('Para trocar a senha, confirme primeiro o código do aplicativo autenticador.',true)}
  if(error)return msgLogin(erroPT(error),true);
  recuperando=false;toast('Senha salva');
  const {data:{session}}=await sb.auth.getSession();if(session)aposLogin(session);
});
async function sair(){fechar();await sb.auth.signOut();location.hash='';location.reload()}
$('lSair').addEventListener('click',sair);

(async()=>{
  if(!window.supabase||!CFG.url||!CFG.anonKey||CFG.url.includes('COLE_AQUI')){telaLogin('Falta configurar o arquivo config.js com o endereço e a chave do Supabase.',true);return}
  sb=window.supabase.createClient(CFG.url.replace(/\/(rest|auth)\/v1\/?$/,'').replace(/\/$/,''),CFG.anonKey);
  sb.auth.onAuthStateChange((ev,s)=>{
    if(ev==='PASSWORD_RECOVERY'){recuperando=true;$('app').hidden=true;$('login').hidden=false;modoLogin('lNova');return}
    if(ev==='SIGNED_IN'&&s&&!recuperando&&$('app').hidden&&$('lSair').hidden)aposLogin(s);
  });
  const {data:{session}}=await sb.auth.getSession();
  if(recuperando&&session){$('app').hidden=true;$('login').hidden=false;modoLogin('lNova');return}
  const erroUrl=new URLSearchParams(location.hash.slice(1)+'&'+location.search.slice(1)).get('error_description');
  if(session)aposLogin(session);else telaLogin(erroUrl?'Não deu para entrar: '+erroUrl.replace(/\+/g,' '):'');
})();
})();
