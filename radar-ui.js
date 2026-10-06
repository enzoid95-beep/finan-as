/* Controle 360 · interface do Radar, usando somente dados carregados no dashboard. */
(function(){
'use strict';
const C=window.RadarCore,esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v||0);
const pct=v=>C.n(v)===null?'—':Number(v).toLocaleString('pt-BR',{maximumFractionDigits:2})+'%';
const num=v=>C.n(v)===null?'—':Number(v).toLocaleString('pt-BR',{maximumFractionDigits:2});
const date=v=>Number.isFinite(Date.parse(v))?new Date(v.length===10?v+'T12:00:00':v).toLocaleString('pt-BR',v.length===10?{dateStyle:'short'}:{dateStyle:'short',timeStyle:'short'}):'data indisponível';
const safeURL=v=>{try{const u=new URL(v);return u.protocol==='https:'?u.href:''}catch{return ''}};
let conta='',prefs={},mercado=null,erro='',carregando=false,aba='acoes',ultimo=0,busca='',buscando=false,erroBusca='',buscaSeq=0;
function carregar(email){if(conta===email)return;conta=email;mercado=null;erro='';ultimo=0;aba='acoes';busca='';buscando=false;erroBusca='';buscaSeq++;try{prefs=JSON.parse(localStorage.getItem('c360-radar-v1:'+email)||'{}')||{}}catch{prefs={}};if(typeof prefs!=='object'||Array.isArray(prefs))prefs={};}
function metodologia(){return `<details class="radar-method"><summary>Como o Radar calcula e avalia?</summary><p>Os dados são consultados quando você clica em Atualizar ações ou busca um ticker. O serviço consulta uma ação por chamada, sem consultas simultâneas nesta instância. O cache por conjunto de tickers dura até 5 minutos. Fonte, data-base e indicadores ausentes aparecem em cada card.</p><p>Nas ações, a nota é a média simples de quatro critérios de 0 a 10: P/L, dividend yield, ROE e dívida/patrimônio. As faixas aparecem em “Por que recebeu essa nota?”. Sem os quatro dados, não há nota nem ranking. Notas de 8 ou mais são atrativas pelos critérios, de 5 a 7,99 são neutras e abaixo de 5 são pouco atrativas.</p><p>O Top 5 compara apenas as ações carregadas com dados completos e recentes. Não é um ranking de toda a Bolsa. Não há comparação setorial, análise de governança ou previsão de retorno. Dados com mais de 96 horas ficam fora dos destaques. Cotações podem ter atraso.</p><p>Os cards de caixa usam o dashboard: caixa livre = caixa − compromissos. A sobra estimada desconta verba pessoal, metas e um colchão de um mês de gastos médios. Entradas futuras não entram nessa conta.</p></details>`;}
function logoEmpresa(x){const url=safeURL(x.logoUrl),src=url&&new URL(url).hostname==='icons.brapi.dev'?url:'',words=String(x.name||x.ticker||'').trim().split(/\s+/),initials=words.slice(0,2).map(w=>w.charAt(0)).join('').toUpperCase();
 return `<span class="radar-company-logo"><span aria-hidden="true">${esc(initials||String(x.ticker||'').slice(0,2))}</span>${src?`<img data-radar-logo src="${esc(src)}" alt="Logo de ${esc(x.name||x.ticker)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" draggable="false">`:''}</span>`;
}
document.addEventListener('error',e=>{if(e.target?.matches?.('img[data-radar-logo]'))e.target.hidden=true},{capture:true});
function acaoCard(x){const s=C.notaAcao(x),stale=!C.recente(x.asOf),cor=s.nota===null?'info':s.nota>=8?'ok':s.nota>=5?'atencao':'alerta';return `<article class="radar-market-card"><div class="radar-section"><div class="radar-company-heading">${logoEmpresa(x)}<h3>${esc(x.ticker)}</h3></div><span class="radar-pill">${s.nota===null?'Sem nota':num(s.nota)+'/10'}</span></div><p>${esc(x.name||'')}</p><b class="radar-price">${C.n(x.price)===null?'—':R(x.price)}</b><span class="radar-status ${cor}">${stale?'Dados desatualizados · fora do ranking':s.status}</span><div class="radar-metrics"><span>P/L <b>${num(x.pl)}</b></span><span>DY <b>${pct(x.dy)}</b></span><span>ROE <b>${pct(x.roe)}</b></span><span>Dívida / PL <b>${num(x.debtEquity)}x</b></span><span>Variação no pregão <b>${pct(x.change)}</b></span><span>Risco <b>alto · renda variável</b></span></div><details><summary>Por que recebeu essa nota?</summary>${s.criterios.map(c=>`<p><b>${c.nome}: ${c.nota===null?'não informado':c.nota+'/10'}</b><br>${c.regra}</p>`).join('')}<p>Peso de cada critério: 25%. Desempenho do pregão é informativo e não entra na nota. Dados incompletos não recebem nota.</p></details><small class="mut">${esc(x.source)} · cotação ${date(x.asOf)}${x.fundamentalDate?' · balanço '+esc(x.fundamentalDate):''}</small></article>`;}
function filtrarAcoes(stocks,term){const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const q=norm(term.trim());return q?stocks.filter(x=>norm(x.ticker).includes(q)||norm(x.name).includes(q)):stocks;}
function mercadoHTML(a,p){
 const stocks=Array.isArray(mercado?.stocks)?mercado.stocks:[],filtered=filtrarAcoes(stocks,busca);
 const ranked=filtered.filter(x=>C.recente(x.asOf)&&C.notaAcao(x).nota!==null).sort((x,y)=>C.notaAcao(y).nota-C.notaAcao(x).nota);
 const active=aba==='destaques'&&ranked.length?'destaques':'acoes',shown=active==='destaques'?ranked.slice(0,5):filtered;
 const empty=busca.trim()?'Nenhuma ação carregada corresponde à busca. Informe o ticker e clique em Buscar ação para consultar.':'Sem ações carregadas. Clique em Atualizar ações ou busque um ticker.';
 return `<div class="radar-market-head"><div><h3>Radar do mercado</h3><p class="sub">${mercado?'Última consulta: '+date(mercado.fetchedAt):'Consulte ações pelo ticker e acompanhe os dados disponíveis na fonte'}</p></div><div class="radar-market-actions"><button type="button" class="btn ghost" data-radar="conexao">Como ativar os dados</button><button type="button" class="btn" data-radar="atualizar" ${carregando||buscando?'disabled':''}>${carregando?'Consultando…':'Atualizar ações'}</button></div></div>
 <p class="nota" role="status">${esc(erro)}${mercado?.warnings?.length?' '+mercado.warnings.map(esc).join(' · '):''}</p>
 <form id="radarBuscaForm" class="radar-search" role="search"><label for="radarBusca">Buscar ação</label><div class="radar-search-controls"><input id="radarBusca" name="ticker" class="field" type="search" autocomplete="off" spellcheck="false" placeholder="Ticker ou nome · ex.: PETR4" value="${esc(busca)}" aria-describedby="radarBuscaAjuda"><button type="submit" class="btn" ${buscando||carregando?'disabled':''}>${buscando?'Buscando…':'Buscar ação'}</button>${busca?'<button type="button" class="btn ghost" data-radar="limpar-busca">Limpar</button>':''}</div><small id="radarBuscaAjuda">Para consultar uma nova ação, informe o ticker. O nome filtra as ações já carregadas.</small><p class="radar-search-status" role="status">${esc(erroBusca)}</p></form>
 ${p==='Conservador'||a.bloqueado||a.meses===null||a.meses<6?'<p class="radar-hint">Destaques são informações de mercado. Confira compromissos, liquidez e riscos antes de usar esse dinheiro. Uma nota alta não define se a ação é adequada para você.</p>':''}
 <div class="radar-tabs" role="tablist" aria-label="Ações do Radar">${[['acoes','Ações'],...(ranked.length?[['destaques','Top 5 de ações']]:[])].map(([id,n])=>`<button type="button" role="tab" aria-selected="${active===id}" data-radar-tab="${id}" aria-controls="radarResultados">${n}</button>`).join('')}<span class="radar-result-count">${shown.length} ${shown.length===1?'ação':'ações'}</span></div><div id="radarResultados" class="radar-market-grid" role="tabpanel" aria-label="${active==='destaques'?'Destaques entre as ações carregadas':'Ações carregadas'}">${shown.map(acaoCard).join('')||'<p class="radar-empty">'+empty+'</p>'}</div>`;
}
function render(d){
 carregar(d.email);const a=C.analisar(d,null,prefs.classes||{});
 return `<div class="radar radar-focus"><div class="view-head"><div><span class="radar-eyebrow">CONTROLE 360 · MERCADO</span><h1>Radar de Investimentos</h1><p>Busque empresas, confira cotações e entenda os indicadores.</p></div><span class="radar-pill">Dados com fonte e data</span></div>
 <section class="panel radar-main">${mercadoHTML(a,null)}${metodologia()}<p class="nota">Informação educativa, sem execução de compras. Fonte de cotações, indicadores e logos: <a class="lnk" href="https://brapi.dev/docs" target="_blank" rel="noopener noreferrer">brapi</a>. A disponibilidade dos indicadores depende da cobertura da fonte.</p></section>
 <div class="radar-context-head"><h2>Seu caixa para planejar</h2><p class="sub">Clique nos cards para entender cada valor. Não representa uma indicação de compra.</p></div>
 <div class="tiles radar-tiles">${[['Em caixa',a.caixa,'saldo atual'],['Compromissos',a.compromissos,'registrados para o mês + atrasados'],['Caixa livre',a.livre,'caixa − compromissos'],['Sobra estimada',a.sobra,'após verba, metas e colchão de caixa']].map(([nome,v,sub])=>`<div class="tile"><div class="k">${nome}</div><div class="v ${v<0?'neg':'ref'}">${R(v)}</div><div class="d">${sub}</div></div>`).join('')}</div>
 </div>`;
}
function bind(root,ctx){
 root.querySelectorAll('.radar-market-card').forEach(card=>{
  card.classList.add('radar-product-click');card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Ver detalhes de '+(card.querySelector('h3')?.textContent||'investimento'));
  const abrir=()=>{const clone=card.cloneNode(true);clone.querySelectorAll('details').forEach(d=>d.open=true);ctx.openModal('<h2>Detalhes do investimento</h2>'+clone.innerHTML+'<div class="btns" style="margin-top:18px"><button class="btn ghost" data-m="cancelar">Fechar</button></div>');};
  card.addEventListener('click',e=>{if(e.target.closest('a,button,summary,details'))return;e.stopPropagation();abrir()});
  card.addEventListener('keydown',e=>{if(e.target===card&&['Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();abrir()}});
 });
 root.querySelector('[data-radar="conexao"]')?.addEventListener('click',()=>ctx.openModal(`<h2>Ativar os dados do mercado</h2><p class="card-detail-note">Uma configuração inicial conecta o Radar à fonte. Depois, use Atualizar ações.</p><ol class="card-detail-note"><li>Crie uma chave de API na <a class="lnk" href="https://brapi.dev/dashboard" target="_blank" rel="noopener noreferrer">brapi</a> e confira os dados incluídos no seu plano.</li><li>No projeto Supabase deste dashboard, publique a função <b>radar-mercado</b> usando o código fornecido com a atualização.</li><li>Em Edge Functions → Secrets, cadastre <b>BRAPI_TOKEN</b> com a chave da fonte. A chave fica no servidor.</li><li>Mantenha a validação de JWT ativada. Entre no dashboard e clique em Atualizar ações.</li></ol><p class="card-detail-note">Cotações e indicadores dependem da cobertura do plano. Sem dados suficientes, o Radar mostra o preço disponível e não inventa notas. Use a busca para consultar um ticker específico.</p><div class="btns"><button class="btn ghost" data-m="cancelar">Fechar</button></div>`));
 root.querySelectorAll('[data-radar-tab]').forEach(b=>b.addEventListener('click',()=>{aba=b.dataset.radarTab;ctx.redraw();}));
 root.querySelector('[data-radar="atualizar"]')?.addEventListener('click',async()=>{if(carregando||buscando)return;if(Date.now()-ultimo<60000){ctx.toast('Aguarde um minuto entre consultas.');return}carregando=true;ultimo=Date.now();erro='';const owner=conta;ctx.redraw();try{const data=await Promise.race([ctx.fetchMarket({stocksOnly:true,...(/^[A-Z]{4}\d{1,2}$/.test(busca.trim().toUpperCase())?{tickers:[busca.trim().toUpperCase()]}:mercado?.stocks?.length?{tickers:mercado.stocks.map(x=>x.ticker).slice(0,10)}:{})}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('tempo')),25000))]);if(conta!==owner)return;if(!data||!Array.isArray(data.stocks)||!Array.isArray(data.treasury)||!Array.isArray(data.offers))throw new Error('formato');mercado={...data,stocks:[...new Map([...(mercado?.stocks||[]),...data.stocks].map(x=>[x.ticker,x])).values()]};if(data.cdi&&!C.recente(data.cdi.asOf))mercado.cdi=null;}catch{if(conta===owner)erro='Não foi possível consultar o mercado. A conexão precisa estar ativada; tente novamente mais tarde. Os valores do seu caixa continuam disponíveis.';}finally{carregando=false;if(conta===owner)ctx.redraw();}});
 const search=root.querySelector('#radarBusca');
 search?.addEventListener('input',()=>{
   busca=search.value;erroBusca='';aba='acoes';const pos=search.selectionStart;ctx.redraw();
   const next=document.getElementById('radarBusca');next?.focus({preventScroll:true});if(next&&pos!==null)next.setSelectionRange(pos,pos);
 });
 root.querySelector('[data-radar="limpar-busca"]')?.addEventListener('click',()=>{busca='';erroBusca='';aba='acoes';ctx.redraw();document.getElementById('radarBusca')?.focus()});
 root.querySelector('#radarBuscaForm')?.addEventListener('submit',async e=>{
   e.preventDefault();if(buscando||carregando)return;
   const ticker=busca.trim().toUpperCase();
   if(!/^[A-Z]{4}\d{1,2}$/.test(ticker)){erroBusca='Para consultar na fonte, informe o ticker, como PETR4 ou ITSA4. Você também pode filtrar pelo nome das ações carregadas.';ctx.redraw();return;}
   busca=ticker;aba='acoes';buscando=true;erroBusca='';const owner=conta,seq=++buscaSeq;ctx.redraw();
   try{
     const data=await Promise.race([ctx.fetchMarket({tickers:[ticker],stocksOnly:true}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('tempo')),25000))]);
     if(conta!==owner||seq!==buscaSeq)return;
     if(!data||!Array.isArray(data.stocks))throw new Error('formato');
     const merged=new Map((mercado?.stocks||[]).map(x=>[x.ticker,x]));data.stocks.forEach(x=>merged.set(x.ticker,x));
     mercado={...data,stocks:[...merged.values()]};
     if(!data.stocks.length)erroBusca='A fonte não retornou cotação para '+ticker+'. Confira o ticker e os avisos acima.';
     else if(!data.stocks.some(x=>x.ticker===ticker))busca=data.stocks[0].ticker;
   }catch{if(conta===owner&&seq===buscaSeq)erroBusca='Não foi possível buscar a ação. Confira a conexão, a atualização da função radar-mercado e tente novamente.';}
   finally{if(conta===owner&&seq===buscaSeq){buscando=false;ctx.redraw();}}
 });
}
window.ControleRadar={render,bind};
})();
