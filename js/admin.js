/* A URL do Apps Script fica em js/config.js */
const $=id=>document.getElementById(id);
const BRL=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let senha='',produtos=[],editando=null,fotos=[],bImg='',bImgM='',tm;
try{senha=sessionStorage.getItem('c3m_s')||''}catch(e){}
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');clearTimeout(tm);tm=setTimeout(()=>e.classList.remove('show'),3200)}
async function api(acao,extra){
  const r=await fetch(SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({acao,senha},extra||{}))});
  const j=await r.json();if(!j.ok)throw new Error(j.erro||'Erro');return j;
}
function reduzir(file,max){return new Promise((ok,no)=>{
  const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');
    c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.82))};
  img.onerror=()=>no(new Error('Não foi possível ler a imagem.'));img.src=u})}
async function enviar(file,max){return (await api('admin_foto',{dataUrl:await reduzir(file,max),largura:max})).url}

async function carregar(){
  const j=await api('admin_listar');produtos=j.produtos;
  $('login').hidden=true;$('painel').hidden=false;
  $('resumo').textContent=`${produtos.length} produtos, ${produtos.filter(p=>p.ativo).length} visíveis no site`;
  $('espList').innerHTML=[...new Set(produtos.map(p=>p.esp).filter(Boolean))].map(e=>`<option value="${esc(e)}">`).join('');
  $('lista').innerHTML=produtos.map((p,i)=>`
   <div class="card p-3 flex flex-wrap items-center gap-3">
    <div style="width:56px;height:56px;border-radius:.7rem;overflow:hidden;background:var(--soft);display:grid;place-items:center;flex:none">${p.fotos[0]?`<img src="${esc(p.fotos[0])}" alt="" style="width:100%;height:100%;object-fit:cover">`:'🌸'}</div>
    <div class="flex-1" style="min-width:180px"><strong>${esc(p.nome)}</strong> <span class="tag" style="position:static;display:inline-block;${p.ativo?'':'background:var(--soft);color:var(--muted)'}">${p.ativo?'Visível':'Oculto'}</span>
     <div class="muted text-sm">${esc(p.esp||'Sem espécie')} · ${BRL(p.preco)} · estoque ${p.estoque} · vendidos ${p.vendidos}</div></div>
    <button class="btn btn-ghost !py-2" data-e="${i}" type="button">Editar</button>
    <button class="btn btn-ghost !py-2" data-r="${i}" type="button">Remover</button>
   </div>`).join('')||'<p class="muted">Nenhum produto ainda. Clique em “Novo produto”.</p>';
}
$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();senha=$('senha').value;$('loginErr').hidden=true;
  try{await carregar();try{sessionStorage.setItem('c3m_s',senha)}catch(x){}}
  catch(err){senha='';$('loginErr').textContent=err.message;$('loginErr').hidden=false}
});
$('sair').addEventListener('click',()=>{try{sessionStorage.removeItem('c3m_s')}catch(e){}location.reload()});

/* ---------- abas ---------- */
function aba(b){$('secP').hidden=b;$('secB').hidden=!b;$('tabP').className='btn '+(b?'btn-ghost':'btn-primary')+' !py-2';$('tabB').className='btn '+(b?'btn-primary':'btn-ghost')+' !py-2'}
$('tabP').addEventListener('click',()=>aba(false));
$('tabB').addEventListener('click',async()=>{aba(true);
  try{const c=(await api('admin_config')).config,f=$('bForm');
    ['titulo','subtitulo','botaoTexto','botaoLink'].forEach(k=>f[k].value=c[k]||'');
    bImg=c.imagem||'';bImgM=c.imagemMobile||'';prevB()}catch(err){toast(err.message)}});

/* ---------- banner ---------- */
function prevB(){
  const h=(u,k)=>u?`<img src="${esc(u)}" alt="" style="max-height:110px;border-radius:.7rem"><br><button type="button" class="btn btn-ghost !py-1 !px-3 mt-1" data-rm="${k}">Remover imagem</button>`:'';
  $('bPrev').innerHTML=h(bImg,'d');$('bPrevM').innerHTML=h(bImgM,'m');
}
$('secB').addEventListener('click',e=>{const b=e.target.closest('[data-rm]');if(!b)return;if(b.dataset.rm==='d')bImg='';else bImgM='';prevB()});
async function subirBanner(inp,mobile){
  const file=inp.files[0];if(!file)return;$('bErr').hidden=true;$('bSalvar').disabled=true;toast('Enviando imagem…');
  try{const u=await enviar(file,mobile?1200:1920);if(mobile)bImgM=u;else bImg=u;prevB()}
  catch(err){$('bErr').textContent=err.message;$('bErr').hidden=false}
  $('bSalvar').disabled=false;inp.value='';
}
$('bFile').addEventListener('change',e=>subirBanner(e.target,false));
$('bFileM').addEventListener('change',e=>subirBanner(e.target,true));
$('bForm').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.target;$('bErr').hidden=true;$('bSalvar').disabled=true;
  try{const j=await api('admin_config_salvar',{config:{titulo:f.titulo.value,subtitulo:f.subtitulo.value,botaoTexto:f.botaoTexto.value,botaoLink:f.botaoLink.value,imagem:bImg,imagemMobile:bImgM}});
    try{sessionStorage.removeItem('c3m_cat')}catch(x){}toast(j.msg)}
  catch(err){$('bErr').textContent=err.message;$('bErr').hidden=false}
  $('bSalvar').disabled=false;
});

/* ---------- produtos ---------- */
const f=$('pForm');
function renderFotos(){$('fotosBox').innerHTML=fotos.map((u,i)=>`<div class="fthumb"><img src="${esc(u)}" alt=""><button type="button" data-cap="${i}">${i?'Tornar capa':'★ Capa'}</button><button type="button" data-del="${i}">Remover</button></div>`).join('')||'<p class="muted text-sm">Nenhuma foto ainda.</p>'}
function abrir(p){
  editando=p;f.reset();$('pErr').hidden=true;$('urlFoto').value='';
  $('pTitle').textContent=p?'Editar produto':'Novo produto';
  f.nome.readOnly=!!p;f.nome.style.opacity=p?.6:1;fotos=p?[...p.fotos]:[];
  if(p){f.nome.value=p.nome;f.esp.value=p.esp;f.preco.value=p.preco;f.custo.value=p.custo;f.estoque.value=p.estoqueIni;f.descricao.value=p.desc;f.descricaoLonga.value=p.descLonga;f.etiqueta.value=p.etiqueta;f.estilo.value=p.estilo;f.ativo.checked=p.ativo}
  renderFotos();$('prod').showModal();
}
$('novo').addEventListener('click',()=>abrir(null));
$('pClose').addEventListener('click',()=>$('prod').close());
$('lista').addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.e!==undefined)abrir(produtos[b.dataset.e]);
  if(b.dataset.r!==undefined){
    const p=produtos[b.dataset.r];if(!confirm(`Remover “${p.nome}” do site?`))return;
    try{const j=await api('admin_remover',{nome:p.nome});toast(j.msg);await carregar()}catch(err){toast(err.message)}
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
  try{const j=await api('admin_salvar',{novo:!editando,produto:{nome:v.nome,esp:v.esp,preco:v.preco,custo:v.custo,estoque:v.estoque,descricao:v.descricao,descricaoLonga:v.descricaoLonga,etiqueta:v.etiqueta,estilo:v.estilo,fotos,ativo:f.ativo.checked}});
    try{sessionStorage.removeItem('c3m_cat')}catch(x){}$('prod').close();toast(j.msg);await carregar()}
  catch(err){$('pErr').textContent=err.message;$('pErr').hidden=false}
  $('pSalvar').disabled=false;$('pSalvar').textContent='Salvar produto';
});
if(senha&&!SCRIPT_URL.startsWith('COLE_AQUI'))carregar().catch(()=>{senha=''});
