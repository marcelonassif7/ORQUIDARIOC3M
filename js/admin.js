/* A URL do Apps Script fica em js/config.js */
const $=id=>document.getElementById(id);
const BRL=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dataBr=v=>{const d=new Date(v);return isNaN(d)?'':d.toLocaleDateString('pt-BR')};
const telWa=v=>{let d=String(v).replace(/\D/g,'');if(d.length<=11)d='55'+d;return 'https://wa.me/'+d};
let token='',produtos=[],pedidos=[],config={},editando=null,fotos=[],bImg='',bImgM='',tm;
try{token=sessionStorage.getItem('c3m_t')||''}catch(e){}
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');clearTimeout(tm);tm=setTimeout(()=>e.classList.remove('show'),3200)}
const limpaCache=()=>{try{localStorage.removeItem('c3m_cat2')}catch(e){}};
async function api(acao,extra){
  const r=await fetch(SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({acao,token},extra||{}))});
  const j=await r.json();
  if(!j.ok){if(/^Sess/.test(j.erro||'')){token='';try{sessionStorage.removeItem('c3m_t')}catch(x){}$('painel').hidden=true;$('login').hidden=false;$('sair').hidden=true}
    throw new Error(j.erro||'Erro')}
  return j;
}
function reduzir(file,max){return new Promise((ok,no)=>{
  const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');
    c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.82))};
  img.onerror=()=>no(new Error('Não foi possível ler a imagem.'));img.src=u})}
async function enviar(file,max){return (await api('admin_foto',{dataUrl:await reduzir(file,max),largura:max})).url}

/* ---------- carregar e desenhar ---------- */
async function carregar(){
  const [a,b,c]=await Promise.all([api('admin_listar'),api('admin_pedidos'),api('admin_config')]);
  produtos=a.produtos;pedidos=b.pedidos;config=c.config;
  $('login').hidden=true;$('painel').hidden=false;$('sair').hidden=false;
  resumo();listaPedidos();listaProdutos();formsConfig();
}
const chipPag=s=>`<span class="chip ${s==='Pago'?'ok':s==='Cancelado'?'bad':'warn'}">${esc(s)}</span>`;
const chipEnv=s=>`<span class="chip ${s==='Entregue'?'ok':s==='Enviado'?'warn':''}">${esc(s)}</span>`;
function resumo(){
  const hoje=new Date(),doMes=pedidos.filter(o=>{const d=new Date(o.data);return d.getMonth()===hoje.getMonth()&&d.getFullYear()===hoje.getFullYear()});
  const pagos=doMes.filter(o=>o.statusPag==='Pago'),rec=pagos.reduce((a,o)=>a+o.total,0);
  const pend=pedidos.filter(o=>o.statusPag==='Pendente').length,enviar=pedidos.filter(o=>o.statusPag==='Pago'&&o.statusEnvio==='A enviar').length;
  $('kpis').innerHTML=[['Receita do mês',BRL(rec)],['Pedidos pagos no mês',pagos.length],['Ticket médio',BRL(pagos.length?rec/pagos.length:0)],['Aguardando pagamento',pend],['Pagos, a enviar',enviar]]
    .map(k=>`<div class="kpi"><small>${k[0]}</small><strong>${k[1]}</strong></div>`).join('');
  $('ultimos').innerHTML=pedidos.slice(0,5).map(o=>`<div class="flex justify-between gap-2 py-2" style="border-bottom:1px solid var(--line)"><span><strong>${esc(o.cliente)}</strong><br><small class="muted">${dataBr(o.data)} · ${esc(o.pedido)}</small></span><span class="text-right">${BRL(o.total)}<br>${chipPag(o.statusPag)}</span></div>`).join('')||'<p class="muted">Nenhum pedido ainda.</p>';
  const baixo=produtos.filter(p=>p.ativo&&p.estoque<=2);
  $('baixo').innerHTML=baixo.map(p=>`<div class="flex justify-between gap-2 py-2" style="border-bottom:1px solid var(--line)"><span>${esc(p.nome)}</span><span class="chip ${p.estoque===0?'bad':'warn'}">${p.estoque===0?'Esgotado':p.estoque+' un.'}</span></div>`).join('')||'<p class="muted">Tudo certo com o estoque.</p>';
}
function listaPedidos(){
  const f=$('fPed').value;
  const L=pedidos.filter(o=>f==='todos'||(f==='pend'&&o.statusPag==='Pendente')||(f==='enviar'&&o.statusPag==='Pago'&&o.statusEnvio==='A enviar')||(f==='pago'&&o.statusPag==='Pago')||(f==='cancel'&&o.statusPag==='Cancelado'));
  const sel=(n,vals,v)=>`<select name="${n}">${vals.map(x=>`<option${x===v?' selected':''}>${x}</option>`).join('')}</select>`;
  $('listaPed').innerHTML=L.map(o=>`<details class="card ped"><summary><span><strong>${esc(o.cliente)}</strong><br><small class="muted">${esc(o.pedido)} · ${dataBr(o.data)}</small></span><span class="flex items-center gap-2 flex-wrap">${chipPag(o.statusPag)}${chipEnv(o.statusEnvio)}<strong>${BRL(o.total)}</strong></span></summary>
   <div class="pbox" data-p="${esc(o.pedido)}"><table>${o.itens.map(i=>`<tr><td>${i.qtd}x ${esc(i.produto)}</td><td>${BRL(i.qtd*i.preco)}</td></tr>`).join('')}<tr><td class="muted">Frete</td><td>${BRL(o.frete)}</td></tr><tr><td><strong>Total</strong></td><td><strong>${BRL(o.total)}</strong></td></tr></table>
   <p class="text-sm"><strong>Pagamento:</strong> ${esc(o.pagamento)}<br><strong>CPF:</strong> ${esc(o.cpf||'-')} · <strong>E-mail:</strong> ${esc(o.email||'-')}<br><strong>WhatsApp:</strong> <a class="more" href="${telWa(o.whats)}" target="_blank" rel="noopener">${esc(o.whats)}</a><br><strong>Entrega:</strong> ${esc(o.endereco||o.cidade||'-')}</p>
   <div class="grid grid-cols-2 gap-3"><label class="field">Pagamento${sel('pag',['Pendente','Pago','Cancelado'],o.statusPag)}</label><label class="field">Envio${sel('env',['A enviar','Enviado','Entregue'],o.statusEnvio)}</label></div>
   <label class="field">Código de rastreio<input name="rast" maxlength="40" value="${esc(o.rastreio||'')}"></label>
   <button class="btn btn-primary mt-3" data-save type="button">Salvar pedido</button><p class="muted text-xs mt-2">Pedido cancelado devolve o estoque automaticamente.</p></div></details>`).join('')||'<p class="muted mt-4">Nenhum pedido neste filtro.</p>';
}
function listaProdutos(){
  $('resumoProd').textContent=`${produtos.length} produtos, ${produtos.filter(p=>p.ativo).length} visíveis no site`;
  $('espList').innerHTML=[...new Set(produtos.map(p=>p.esp).filter(Boolean))].map(e=>`<option value="${esc(e)}">`).join('');
  $('lista').innerHTML=produtos.map((p,i)=>`<div class="card p-3 flex flex-wrap items-center gap-3">
    <div style="width:56px;height:56px;border-radius:.7rem;overflow:hidden;background:var(--soft);display:grid;place-items:center;flex:none">${p.fotos[0]?`<img src="${esc(p.fotos[0])}" alt="" style="width:100%;height:100%;object-fit:cover">`:'🌸'}</div>
    <div class="flex-1" style="min-width:180px"><strong>${esc(p.nome)}</strong> <span class="chip ${p.ativo?'ok':''}">${p.ativo?'Visível':'Oculto'}</span>
     <div class="muted text-sm">${esc(p.esp||'Sem espécie')} · ${p.promo>0&&p.promo<p.preco?`<s>${BRL(p.preco)}</s> ${BRL(p.promo)}`:BRL(p.preco)} · estoque ${p.estoque} · vendidos ${p.vendidos}</div></div>
    <button class="btn btn-ghost !py-2" data-e="${i}" type="button">Editar</button><button class="btn btn-danger !py-2" data-r="${i}" type="button">Remover</button></div>`).join('')||'<p class="muted">Nenhum produto ainda. Clique em “Novo produto”.</p>';
}
function formsConfig(){
  const f=$('cForm');[...f.elements].forEach(el=>{if(el.name)el.value=config[el.name]||''});
  const b=$('bForm');['titulo','subtitulo','botaoTexto','botaoLink'].forEach(k=>b[k].value=config[k]||'');
  bImg=config.imagem||'';bImgM=config.imagemMobile||'';prevB();
}

/* ---------- login, abas ---------- */
$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();$('loginErr').hidden=true;
  try{const j=await api('admin_login',{senha:$('senha').value});token=j.token;$('senha').value='';
    try{sessionStorage.setItem('c3m_t',token)}catch(x){}await carregar()}
  catch(err){token='';$('loginErr').textContent=err.message;$('loginErr').hidden=false}
});
$('sair').addEventListener('click',()=>{try{sessionStorage.removeItem('c3m_t')}catch(e){}location.reload()});
document.querySelector('.tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-tab]');if(!b)return;
  document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  ['resumo','pedidos','produtos','banner','loja'].forEach(t=>$('tab-'+t).hidden=(t!==b.dataset.tab))});

/* ---------- pedidos ---------- */
$('fPed').addEventListener('change',listaPedidos);
$('listaPed').addEventListener('click',async e=>{
  const b=e.target.closest('[data-save]');if(!b)return;const box=b.closest('.pbox');
  b.disabled=true;
  try{const j=await api('admin_pedido_status',{pedido:box.dataset.p,statusPag:box.querySelector('[name=pag]').value,statusEnvio:box.querySelector('[name=env]').value,rastreio:box.querySelector('[name=rast]').value});
    limpaCache();toast(j.msg);await carregar()}
  catch(err){toast(err.message);b.disabled=false}
});
$('csv').addEventListener('click',()=>{
  const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
  const linhas=[['Pedido','Data','Cliente','CPF','E-mail','WhatsApp','Endereço','Pagamento','Status pagamento','Status envio','Rastreio','Itens','Frete','Total']].concat(
    pedidos.map(o=>[o.pedido,dataBr(o.data),o.cliente,o.cpf,o.email,o.whats,o.endereco||o.cidade,o.pagamento,o.statusPag,o.statusEnvio,o.rastreio,o.itens.map(i=>i.qtd+'x '+i.produto).join(' + '),o.frete,o.total]));
  const blob=new Blob(['\ufeff'+linhas.map(l=>l.map(q).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='pedidos-orquidario-c3m.csv';a.click();URL.revokeObjectURL(a.href);
});

/* ---------- banner e configurações ---------- */
function prevB(){
  const h=(u,k)=>u?`<img src="${esc(u)}" alt="" style="max-height:110px;border-radius:.7rem"><br><button type="button" class="btn btn-ghost !py-1 !px-3 mt-1" data-rm="${k}">Remover imagem</button>`:'';
  $('bPrev').innerHTML=h(bImg,'d');$('bPrevM').innerHTML=h(bImgM,'m');
}
$('tab-banner').addEventListener('click',e=>{const b=e.target.closest('[data-rm]');if(!b)return;if(b.dataset.rm==='d')bImg='';else bImgM='';prevB()});
async function subirBanner(inp,mobile){
  const file=inp.files[0];if(!file)return;$('bErr').hidden=true;$('bSalvar').disabled=true;toast('Enviando imagem…');
  try{const u=await enviar(file,mobile?1200:1920);if(mobile)bImgM=u;else bImg=u;prevB()}
  catch(err){$('bErr').textContent=err.message;$('bErr').hidden=false}
  $('bSalvar').disabled=false;inp.value='';
}
$('bFile').addEventListener('change',e=>subirBanner(e.target,false));
$('bFileM').addEventListener('change',e=>subirBanner(e.target,true));
async function salvarConfig(obj,btn,err){
  err.hidden=true;btn.disabled=true;
  try{const j=await api('admin_config_salvar',{config:obj});limpaCache();toast(j.msg);config=(await api('admin_config')).config;formsConfig()}
  catch(x){err.textContent=x.message;err.hidden=false}
  btn.disabled=false;
}
$('bForm').addEventListener('submit',e=>{e.preventDefault();const f=e.target;
  salvarConfig({titulo:f.titulo.value,subtitulo:f.subtitulo.value,botaoTexto:f.botaoTexto.value,botaoLink:f.botaoLink.value,imagem:bImg,imagemMobile:bImgM},$('bSalvar'),$('bErr'))});
$('cForm').addEventListener('submit',e=>{e.preventDefault();const o={};[...e.target.elements].forEach(el=>{if(el.name)o[el.name]=el.value});salvarConfig(o,$('cSalvar'),$('cErr'))});

/* ---------- produtos ---------- */
const f=$('pForm');
function renderFotos(){$('fotosBox').innerHTML=fotos.map((u,i)=>`<div class="fthumb"><img src="${esc(u)}" alt=""><button type="button" data-cap="${i}">${i?'Tornar capa':'★ Capa'}</button><button type="button" data-del="${i}">Remover</button></div>`).join('')||'<p class="muted text-sm">Nenhuma foto ainda.</p>'}
function abrir(p){
  editando=p;f.reset();$('pErr').hidden=true;$('urlFoto').value='';
  $('pTitle').textContent=p?'Editar produto':'Novo produto';
  f.nome.readOnly=!!p;f.nome.style.opacity=p?.6:1;fotos=p?[...p.fotos]:[];
  if(p){f.nome.value=p.nome;f.esp.value=p.esp;f.preco.value=p.preco;f.promo.value=p.promo||'';f.custo.value=p.custo;f.estoque.value=p.estoqueIni;f.descricao.value=p.desc;f.descricaoLonga.value=p.descLonga;f.etiqueta.value=p.etiqueta;f.estilo.value=p.estilo;f.ativo.checked=p.ativo}
  renderFotos();$('prod').showModal();
}
$('novo').addEventListener('click',()=>abrir(null));
$('pClose').addEventListener('click',()=>$('prod').close());
$('lista').addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.e!==undefined)abrir(produtos[b.dataset.e]);
  if(b.dataset.r!==undefined){
    const p=produtos[b.dataset.r];if(!confirm(`Remover “${p.nome}” do site?`))return;
    try{const j=await api('admin_remover',{nome:p.nome});limpaCache();toast(j.msg);await carregar()}catch(err){toast(err.message)}
  }
});
$('fotosBox').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.del!==undefined)fotos.splice(b.dataset.del,1);
  if(b.dataset.cap!==undefined)fotos.unshift(fotos.splice(b.dataset.cap,1)[0]);
  renderFotos()});
$('addUrl').addEventListener('click',()=>{const u=$('urlFoto').value.trim();if(/^https:\/\//.test(u)&&fotos.length<8){fotos.push(u);$('urlFoto').value='';renderFotos()}});
$('arquivo').addEventListener('change',async e=>{
  const files=[...e.target.files];if(!files.length)return;$('pSalvar').disabled=true;$('pErr').hidden=true;
  try{for(const file of files){if(fotos.length>=8)break;toast('Enviando foto…');fotos.push(await enviar(file,900));renderFotos()}}
  catch(err){$('pErr').textContent=err.message;$('pErr').hidden=false}
  e.target.value='';$('pSalvar').disabled=false;
});
f.addEventListener('submit',async e=>{
  e.preventDefault();$('pErr').hidden=true;$('pSalvar').disabled=true;$('pSalvar').textContent='Salvando…';
  const v=Object.fromEntries(new FormData(f));
  try{const j=await api('admin_salvar',{novo:!editando,produto:{nome:v.nome,esp:v.esp,preco:v.preco,promo:v.promo,custo:v.custo,estoque:v.estoque,descricao:v.descricao,descricaoLonga:v.descricaoLonga,etiqueta:v.etiqueta,estilo:v.estilo,fotos,ativo:f.ativo.checked}});
    limpaCache();$('prod').close();toast(j.msg);await carregar()}
  catch(err){$('pErr').textContent=err.message;$('pErr').hidden=false}
  $('pSalvar').disabled=false;$('pSalvar').textContent='Salvar produto';
});
if(token&&!SCRIPT_URL.startsWith('COLE_AQUI'))carregar().catch(()=>{token=''});
