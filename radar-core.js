/* Controle 360 · regras educativas do Radar. Sem ordens ou movimentações. */
(function(root){
'use strict';
const CLASSES=[['reserva','Reserva / liquidez','#f5b301'],['fixa','Renda fixa','#3b82f6'],['variavel','Renda variável','#a855f7'],['internacional','Internacional','#22d3ee'],['outros','Outros','#ec4899']];
const n=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v))?Number(v):null;
const money=v=>Math.round(v*100)/100;
function perfil(respostas){
 if(!Array.isArray(respostas)||respostas.length!==5||respostas.some(x=>!Number.isInteger(x)||x<0||x>2))return null;
 const pontos=respostas.reduce((s,x)=>s+x,0);
 // Tolerância a perdas e necessidade imediata de liquidez limitam o risco.
 return respostas[1]===0||respostas[2]===0||pontos<=3?'Conservador':pontos<=7?'Moderado':'Arrojado';
}
function classe(x,ajustes={}){
 if(CLASSES.some(c=>c[0]===ajustes[x.id]))return ajustes[x.id];
 if(x.tipo==='renda_fixa')return 'fixa';
 if(['acoes','fiis'].includes(x.tipo))return 'variavel';
 if(x.tipo==='bdrs')return 'internacional';
 if(x.tipo==='fundos'&&x.produto==='Renda fixa')return 'fixa';
 if(x.tipo==='fundos'&&x.produto==='Ações')return 'variavel';
 // ETF / fundo sem identificação de exposição fica em Outros até a confirmação.
 return 'outros';
}
function analisar(d,p,ajustes={}){
 const caixa=n(d.caixa)||0,compromissos=Math.max(0,n(d.compromissos)||0),verba=Math.max(0,n(d.verba)||0),metasMes=Math.max(0,n(d.metasMes)||0);
 const gastos=Math.max(0,n(d.gastos)||0),reserva=Math.max(0,n(d.reserva)||0)+(d.invest||[]).filter(x=>x.valor>0&&classe(x,ajustes)==='reserva').reduce((s,x)=>s+x.valor,0),meses=gastos>0?reserva/gastos:null;
 const livre=money(caixa-compromissos),planejavel=money(livre-verba-metasMes),margem=gastos; // colchão de um mês, regra explícita
 const sobra=money(Math.max(0,planejavel-margem));
 const dividas=(d.dividas||[]).filter(x=>x.saldo>0),caras=dividas.filter(x=>x.juros>=2);
 const metas=(d.metas||[]).filter(x=>x.falta>0),curtas=metas.filter(x=>x.dias!==null&&x.dias<=730),longas=metas.filter(x=>x.dias!==null&&x.dias>=1825);
 const por=Object.fromEntries(CLASSES.map(c=>[c[0],0]));por.reserva=Math.max(0,n(d.reserva)||0);
 const inv=(d.invest||[]).filter(x=>x.valor>0);inv.forEach(x=>por[classe(x,ajustes)]+=x.valor);
 const total=Object.values(por).reduce((s,v)=>s+v,0),investido=inv.reduce((s,x)=>s+x.valor,0);
 const emissores={};inv.forEach(x=>{if(x.instituicao){const k=x.instituicao.trim().toLocaleLowerCase('pt-BR');emissores[k]=(emissores[k]||0)+x.valor}});
 const concentracao=investido>0?Math.max(0,...inv.map(x=>x.valor),...Object.values(emissores))/investido:0;
 const prioridades=[];const add=(titulo,texto,tom='info',go='')=>prioridades.push({titulo,texto,tom,go});
 if(gastos<=0)add('Complete o histórico de gastos','Sem gastos registrados, não dá para medir a reserva nem estimar uma sobra segura. Cadastre os gastos antes de planejar novos aportes.','atencao','gastos');
 if(livre<=0)add('Proteja os compromissos do mês','O caixa atual não cobre os compromissos registrados. Evite novos aportes até equilibrar o mês.','alerta','contas');
 else if(planejavel<=margem)add('Mantenha uma margem no caixa','Depois dos compromissos, do dinheiro pessoal e dos aportes planejados, a sobra não supera o colchão de um mês de gastos médios. Considere esperar antes de investir.','atencao','geral');
 if(caras.length)add('Compare o custo das dívidas','Há dívida com juros de pelo menos 2% ao mês. Compare o custo efetivo total com retornos líquidos incertos antes de ampliar a carteira. Preserve dinheiro para imprevistos.','alerta','dividas');
 else if(dividas.length)add('Inclua as dívidas na decisão','Confira juros e custo efetivo total das dívidas antes de definir os próximos aportes.','info','dividas');
 if(meses!==null&&meses<6)add('Reforce a reserva primeiro',`A reserva cobre ${meses.toLocaleString('pt-BR',{maximumFractionDigits:1})} meses de gastos. A referência deste planejamento é 6 meses. Priorize disponibilidade de resgate e menor volatilidade.`,'atencao','reserva');
 if(curtas.length)add('Proteja as metas próximas',`${curtas.length} meta(s) em até 2 anos ou com prazo vencido. Considere baixa volatilidade e vencimento compatível; uma taxa maior não compensa precisar vender com perda.`,'info','metas');
 if(concentracao>.5)add('Revise a concentração','Mais de 50% dos investimentos estão em uma aplicação ou instituição cadastrada. Avalie emissores, conglomerados e classes diferentes. Instituição pode ser a corretora, não o emissor.','atencao','investimentos');
 if(investido>0&&por.fixa/investido>.8&&meses!==null&&meses>=6&&p&&p!=='Conservador')add('Conheça outras classes','Mais de 80% dos investimentos estão classificados como renda fixa. Para recursos de longo prazo, estude renda variável e exposição internacional, respeitando sua tolerância a perdas.','info','investimentos');
 if(longas.length)add('Separe o dinheiro de longo prazo','Metas com prazo de 5 anos ou mais permitem estudar classes com maior oscilação, se o perfil e a situação financeira forem compatíveis.','info','metas');
 if(sobra>0&&meses!==null&&meses>=6&&!caras.length)add('Existe uma sobra para avaliar','Há dinheiro estimado além dos compromissos e do colchão de caixa. Confira despesas ainda não registradas e destine apenas o que pode ficar aplicado.','ok');
 if(!p)add('Responda ao questionário','Defina seu perfil antes de comparar a distribuição. O questionário é educativo e não substitui a avaliação de suitability da instituição financeira.');
 // Percentuais ilustrativos do patrimônio financeiro (reserva cadastrada + investimentos), não ordens de compra.
 let modelo=p==='Conservador'?[30,65,0,5,0]:p==='Moderado'?[20,45,20,15,0]:[15,30,30,20,5];
 const bloqueado=gastos<=0||livre<=0||planejavel<=margem||caras.length>0;
 if(meses!==null&&meses<6)modelo=[100,0,0,0,0];
 else if(curtas.length&&p)modelo=p==='Arrojado'?[30,45,15,10,0]:[40,50,5,5,0];
 const sugerida=p?Object.fromEntries(CLASSES.map((c,i)=>[c[0],modelo[i]])):null;
 return {caixa,compromissos,livre,verba,metasMes,planejavel,margem,sobra,reserva,gastos,meses,total,por,investido,concentracao,prioridades,sugerida,bloqueado,capacidade:gastos>0&&!caras.length?sobra:0,curtas,longas};
}
function simular({capital,dias,taxa,tipo,cdi,isento=false}){
 if(!Number.isFinite(capital)||capital<=0||!Number.isInteger(dias)||dias<1||dias>36500||!Number.isFinite(taxa)||taxa<=0||taxa>1000||!['cdi','prefixado'].includes(tipo))return null;
 if(tipo==='cdi'&&(!Number.isFinite(cdi)||cdi<=0||cdi>100))return null;
 // 252 dias úteis/ano; 365 dias corridos/ano. É uma aproximação, sem calendário de feriados.
 const fator=tipo==='cdi'?Math.pow(1+(Math.pow(1+cdi/100,1/252)-1)*taxa/100,dias*252/365):Math.pow(1+taxa/100,dias/365);
 const bruto=capital*(fator-1),irAliq=isento?0:dias<=180?.225:dias<=360?.20:dias<=720?.175:.15;
 const tabela=[96,93,90,86,83,80,76,73,70,66,63,60,56,53,50,46,43,40,36,33,30,26,23,20,16,13,10,6,3];
 const iof=isento||dias>=30?0:bruto*tabela[dias-1]/100,ir=(bruto-iof)*irAliq,liquido=bruto-iof-ir;
 return {capital,bruto:money(bruto),iof:money(iof),ir:money(ir),irAliq,liquido:money(liquido),final:money(capital+liquido),retorno:liquido/capital*100};
}
function notaAcao(x){
 const specs=[['P/L',n(x.pl),v=>v>0&&v<=15?10:v>0&&v<=25?6:2,'Positivo até 15: 10; até 25: 6; demais: 2.'],['Dividend yield',n(x.dy),v=>v>=4&&v<=10?10:v>0&&v<4?6:2,'De 4% a 10%: 10; entre 0% e 4%: 6; demais: 2.'],['ROE',n(x.roe),v=>v>=15?10:v>0?6:2,'A partir de 15%: 10; positivo abaixo disso: 6; demais: 2.'],['Dívida / patrimônio',n(x.debtEquity),v=>v>=0&&v<=.5?10:v>=0&&v<=1?6:2,'Até 0,5x: 10; até 1x: 6; demais: 2.']];
 const criterios=specs.map(([nome,valor,fn,regra])=>({nome,valor,nota:valor===null?null:fn(valor),regra}));
 const completos=criterios.every(c=>c.nota!==null);const nota=completos?money(criterios.reduce((s,c)=>s+c.nota,0)/4):null;
 return {nota,criterios,status:nota===null?'Dados insuficientes':nota>=8?'Atrativa pelos critérios':nota>=5?'Neutra pelos critérios':'Pouco atrativa pelos critérios'};
}
function recente(data,horas=96,agora=Date.now()) {const t=Date.parse(data);return Number.isFinite(t)&&t<=agora+300000&&agora-t<=horas*3600000;}
const api={CLASSES,perfil,classe,analisar,simular,notaAcao,recente,n};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RadarCore=api;
})(typeof window!=='undefined'?window:globalThis);
