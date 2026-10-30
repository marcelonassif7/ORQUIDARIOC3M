/* Usa a mesma URL do Apps Script do site (js/main.js) */
const SCRIPT_URL=(document.currentScript&&document.currentScript.dataset.url)||'COLE_AQUI_A_URL_DO_APPS_SCRIPT'; // <<< cole a mesma URL de main.js
const $=id=>document.getElementById(id);
const BRL=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let senha='';try{senha=sessionStorage.getItem('c3m_s')||''}catch(e){}
let produtos=[],editando=null,tm;
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');clearTimeout(tm);tm=setTimeout(()=>e.classList.remove('show'),3200)}

async function api(acao,extra){
  const r=await fetch(SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({acao,senha},extra||{}))});
  const j=await r.json();if(!j.ok)throw new Error(j.erro||'Erro');return j;
}
async function carregar(){
  const j=await api('admin_listar');produtos=j.produtos;
  $('login').hidden=true;$('painel').hidden=false;
  const vis=produtos.filter(p=>p.ativo).length;
  $('resumo').textContent=`${produtos.length} produtos cadastrados, ${vis} visíveis no site`;
  $('lista').innerHTML=produtos.map((p,i)=>`
   <div class="card p-3 flex flex-wrap items-center gap-3">
    <div style="width:56px;height:56px;border-radius:.7rem;overflow:hidden;background:var(--soft);display:grid;place-items:center;flex:none">${p.foto?`<img src="${esc(p.foto)}" alt="" style="width:100%;height:100%;object-fit:cover">`:'🌸'}</div>
    <div class="flex-1" style="min-width:180px"><strong>${esc(p.nome)}</strong> <span class="tag" style="position:static;display:inline-block;${p.ativo?'':'background:var(--soft);color:var(--muted)'}">${p.ativo?'Visível':'Oculto'}</span>
     <div class="muted text-sm">${BRL(p.preco)} · estoque ${p.estoque} · vendidos ${p.vendidos}</div></div>
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

const f=$('pForm');
function abrir(p){
  editando=p;f.reset();$('pErr').hidden=true;$('preview').innerHTML='';
  $('pTitle').textContent=p?'Editar produto':'Novo produto';
  f.nome.readOnly=!!p;f.nome.style.opacity=p?.6:1;
  if(p){f.nome.value=p.nome;f.preco.value=p.preco;f.custo.value=p.custo;f.estoque.value=p.estoqueIni;f.descricao.value=p.desc;f.etiqueta.value=p.etiqueta;f.estilo.value=p.estilo;f.foto.value=p.foto;f.ativo.checked=p.ativo;
    if(p.foto)$('preview').innerHTML=`<img src="${esc(p.foto)}" alt="" style="max-height:120px;border-radius:.7rem">`}
  $('prod').showModal();
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
function reduzir(file){return new Promise((ok,no)=>{
  const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const k=Math.min(1,900/Math.max(img.width,img.height)),c=document.createElement('canvas');
    c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.82))};
  img.onerror=()=>no(new Error('Não foi possível ler a imagem.'));img.src=u})}
$('arquivo').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  $('preview').textContent='Enviando foto…';$('pSalvar').disabled=true;
  try{const j=await api('admin_foto',{dataUrl:await reduzir(file)});f.foto.value=j.url;
    $('preview').innerHTML=`<img src="${esc(j.url)}" alt="" style="max-height:120px;border-radius:.7rem">`}
  catch(err){$('preview').textContent='';$('pErr').textContent=err.message;$('pErr').hidden=false}
  $('pSalvar').disabled=false;
});
f.addEventListener('submit',async e=>{
  e.preventDefault();$('pErr').hidden=true;$('pSalvar').disabled=true;$('pSalvar').textContent='Salvando…';
  const v=Object.fromEntries(new FormData(f));
  try{const j=await api('admin_salvar',{novo:!editando,produto:{nome:v.nome,preco:v.preco,custo:v.custo,estoque:v.estoque,descricao:v.descricao,etiqueta:v.etiqueta,estilo:v.estilo,foto:v.foto,ativo:f.ativo.checked}});
    $('prod').close();toast(j.msg);await carregar()}
  catch(err){$('pErr').textContent=err.message;$('pErr').hidden=false}
  $('pSalvar').disabled=false;$('pSalvar').textContent='Salvar produto';
});
if(senha&&!SCRIPT_URL.startsWith('COLE_AQUI'))carregar().catch(()=>{senha=''});
