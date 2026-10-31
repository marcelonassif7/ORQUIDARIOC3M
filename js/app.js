/* ===== app.js: código compartilhado por todas as páginas ===== */
const $=id=>document.getElementById(id);
const BRL=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const onlyDigits=v=>String(v||'').replace(/\D/g,'');
function orchid(a,b,c){
  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração de orquídea">
  <path d="M100 215 C98 170 104 140 100 104" stroke="#2E6B4E" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M100 205 C70 195 45 200 30 214 C55 218 85 214 100 205Z" fill="#2E6B4E"/>
  <path d="M100 205 C130 193 158 198 172 214 C145 218 115 214 100 205Z" fill="#3D8362"/>
  <g transform="translate(100 100)">
    <ellipse cx="0" cy="-46" rx="20" ry="38" fill="${a}"/>
    <ellipse cx="0" cy="-46" rx="20" ry="38" fill="${a}" transform="rotate(125)"/>
    <ellipse cx="0" cy="-46" rx="20" ry="38" fill="${a}" transform="rotate(235)"/>
    <ellipse cx="-44" cy="-4" rx="42" ry="33" fill="${b}" transform="rotate(-12 -44 -4)"/>
    <ellipse cx="44" cy="-4" rx="42" ry="33" fill="${b}" transform="rotate(12 44 -4)"/>
    <path d="M-16 6 C-24 30 -10 48 0 50 C10 48 24 30 16 6 C8 -2 -8 -2 -16 6Z" fill="${c}"/>
    <circle cx="0" cy="2" r="7" fill="#F6D365"/>
  </g></svg>`}
const ESTILOS={branca:['#FFFFFF','#F3E6F7','#E9B8D6'],rosa:['#F7B8DA','#F08CC1','#C0328A'],pintada:['#FAD9EC','#F3A6CF','#8C1F68'],roxa:['#C77DE0','#A653C9','#F6D365'],amarela:['#F6D365','#F2B632','#A8691B']};
const DEMO={config:{},produtos:[
 {n:'Cattleya Walkeriana S/A “Satisfaction”',d:'Matriz selecionada do Orquidário C3M',dl:'',p:3500,t:'Lançamento',fotos:[],estilo:'rosa',esp:'Cattleya Walkeriana',disp:true},
 {n:'Cattleya Walkeriana Coerulea “A15 Caliman”',d:'Para colecionadores exigentes',dl:'',p:7000,t:'Lançamento',fotos:[],estilo:'roxa',esp:'Cattleya Walkeriana',disp:true},
 {n:'Cattleya Walkeriana “3 Amigos” x “Prof. Tambarussi”',d:'Ótima para começar a coleção',dl:'',p:35,t:'',fotos:[],estilo:'rosa',esp:'Cattleya Walkeriana',disp:true},
 {n:'Cattleya Nobilior S/A “C3M” x “DNO” x Sibling',d:'Cruzamento de matrizes do orquidário',dl:'',p:90,t:'',fotos:[],estilo:'branca',esp:'Cattleya Nobilior',disp:true},
 {n:'Cattleya Walkeriana Vinicolor “C3M” x “Miss Poledance”',d:'Cruzamento de vinicolores',dl:'',p:150,t:'',fotos:[],estilo:'roxa',esp:'Cattleya Walkeriana',disp:true},
 {n:'Cattleya Walkeriana Pelórica “C3M”',d:'Forma pelórica, peça de coleção',dl:'',p:750,t:'Lançamento',fotos:[],estilo:'pintada',esp:'Cattleya Walkeriana',disp:true}]};
let CAT=DEMO;
async function loadCatalog(){
  if(SCRIPT_URL.startsWith('COLE_AQUI')){CAT=DEMO;return}
  try{const c=sessionStorage.getItem('c3m_cat');if(c){const o=JSON.parse(c);if(Date.now()-o.t<60000){CAT=o.d;return}}}catch(e){}
  try{const j=await (await fetch(SCRIPT_URL+'?acao=catalogo')).json();
    if(j.ok){CAT={config:j.config||{},produtos:j.produtos||[]};try{sessionStorage.setItem('c3m_cat',JSON.stringify({t:Date.now(),d:CAT}))}catch(e){}return}}catch(e){console.error(e)}
  CAT=DEMO;
}
const especies=()=>{const m={};CAT.produtos.forEach(p=>{const s=slug(p.esp);if(s)(m[s]=m[s]||{nome:p.esp,slug:s,n:0}).n++});return Object.values(m).sort((a,b)=>a.nome.localeCompare(b.nome))};
const bySlug=s=>CAT.produtos.find(p=>slug(p.n)===s);
const prodUrl=p=>'produto.html?p='+slug(p.n);
const catUrl=s=>'categoria.html'+(s?'?e='+s:'');
const imgOf=p=>p.fotos&&p.fotos[0]?`<img src="${esc(p.fotos[0])}" alt="${esc(p.n)}" loading="lazy">`:orchid(...(ESTILOS[p.estilo]||ESTILOS.rosa));
const card=p=>`<article class="pcard"><a href="${prodUrl(p)}" class="photo" aria-label="${esc(p.n)}">${p.t?`<span class="tag">${esc(p.t)}</span>`:''}${imgOf(p)}</a><div class="pbody"><h3 class="pname"><a href="${prodUrl(p)}">${esc(p.n)}</a></h3><p class="pprice">${BRL(p.p)}</p><p class="pinst">até <strong>${LOJA.parcelas}x</strong> de <strong>${BRL(p.p/LOJA.parcelas)}</strong> sem juros</p><button class="btn btn-buy" data-add="${slug(p.n)}" ${p.disp===false?'disabled':''}>${p.disp===false?'Esgotado':'Comprar'}</button></div></article>`;

const DIALOG=`<dialog id="checkout" aria-labelledby="ckTitle">
  <div class="ck-head"><h2 id="ckTitle" class="display text-2xl font-bold">Seu carrinho</h2><button type="button" id="ckClose" class="ck-x" aria-label="Fechar">✕</button></div>
  <div class="ck-body">
    <div id="cartItems"></div>
    <div id="cartSummary"></div>
    <form id="orderForm" hidden>
      <h3 class="font-bold mt-5 mb-1">Seus dados</h3>
      <label class="field">Nome completo<input name="nome" required autocomplete="name" maxlength="80"></label>
      <div class="grid grid-cols-2 gap-3">
        <label class="field">CPF<input name="cpf" required inputmode="numeric" maxlength="14" placeholder="000.000.000-00"></label>
        <label class="field">WhatsApp com DDD<input name="whatsapp" required inputmode="tel" autocomplete="tel" maxlength="20" placeholder="(31) 90000-0000"></label>
      </div>
      <label class="field">E-mail<input name="email" type="email" required autocomplete="email" maxlength="80"></label>
      <h3 class="font-bold mt-5 mb-1">Endereço de entrega</h3>
      <label class="field">CEP<input name="cep" required inputmode="numeric" maxlength="9" autocomplete="postal-code" placeholder="00000-000"></label>
      <label class="field">Rua<input name="rua" required maxlength="80" autocomplete="address-line1"></label>
      <div class="grid grid-cols-2 gap-3">
        <label class="field">Número<input name="numero" required maxlength="10"></label>
        <label class="field">Complemento<input name="complemento" maxlength="40" placeholder="Apto, bloco..."></label>
      </div>
      <label class="field">Bairro<input name="bairro" maxlength="60"></label>
      <div class="grid grid-cols-3 gap-3">
        <label class="field" style="grid-column:span 2">Cidade<input name="cidade" required maxlength="60" autocomplete="address-level2"></label>
        <label class="field">Estado<select name="uf" required></select></label>
      </div>
      <label class="field">Forma de pagamento<select name="pagamento"><option>Pix</option><option>Cartão de crédito</option><option>Boleto</option></select></label>
      <input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <p class="muted text-xs mt-2">Ao finalizar, abrimos o WhatsApp em uma nova guia com o resumo do pedido para você enviar. Usamos seus dados só para processar e entregar a compra, conforme a LGPD.</p>
      <button class="btn btn-primary w-full mt-4" id="ckSubmit" type="submit">Finalizar compra</button>
      <p id="ckError" class="text-sm mt-3" style="color:#C0392B" hidden></p>
    </form>
    <div id="ckDone" hidden></div>
  </div>
</dialog>`;
const mapsQ=()=>encodeURIComponent(`${LOJA.nome} ${LOJA.endereco} ${LOJA.cidade}`);
const waLink=t=>'https://wa.me/'+WHATSAPP+(t?'?text='+encodeURIComponent(t):'');
const contactBlock=()=>`<ul class="clist"><li><strong>Endereço</strong>${esc(LOJA.endereco)}<br>${esc(LOJA.cidade)} · CEP ${esc(LOJA.cep)}</li><li><strong>WhatsApp e telefone</strong><a href="${waLink()}" target="_blank" rel="noopener">${esc(LOJA.telefone)}</a></li><li><strong>E-mail</strong><a href="mailto:${esc(LOJA.email)}">${esc(LOJA.email)}</a></li><li><strong>Horário</strong>${LOJA.horario.map(esc).join('<br>')}<br><span class="muted text-xs">${esc(LOJA.obsHorario||'')}</span></li></ul><div class="flex gap-2 flex-wrap mt-4"><a class="btn btn-primary no-underline" href="https://www.google.com/maps/search/?api=1&query=${mapsQ()}" target="_blank" rel="noopener">Como chegar</a><a class="btn btn-ghost no-underline" href="${waLink()}" target="_blank" rel="noopener">Chamar no WhatsApp</a></div>`;
const mapFrame=()=>`<iframe class="mapa" title="Mapa do ${esc(LOJA.nome)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${mapsQ()}&output=embed"></iframe>`;
const logoHtml=h=>`<img src="img/logo.png" alt="${esc(LOJA.nome)}" style="height:${h}px;width:auto" onerror="this.outerHTML='<span class=&quot;logo-text&quot;>${esc(LOJA.nome)}</span>'">`;
const NAV0=['<a href="index.html">Início</a>','<a href="categoria.html">Todas as orquídeas</a>'],NAV1=['<a href="quemsomos.html">Quem somos</a>','<a href="#rodape">Contato</a>'];
function footerHtml(){return `<footer class="foot" id="rodape"><div class="wrap fgrid">
 <div><a href="index.html" class="logo" aria-label="${esc(LOJA.nome)}">${logoHtml(52)}</a><p class="mt-3">Orquídeas cultivadas em ${esc(LOJA.cidade.replace('/',', '))}. Todo mundo pode colecionar orquídeas.</p></div>
 <div><h4>Categorias</h4><ul id="ftrSp"></ul></div>
 <div><h4>Institucional</h4><ul><li><a href="quemsomos.html">Quem somos</a></li><li><a href="quemsomos.html#contato">Como chegar</a></li><li><a href="${waLink()}" target="_blank" rel="noopener">Fale pelo WhatsApp</a></li></ul></div>
 <div><h4>Contato</h4><ul><li>${esc(LOJA.endereco)}<br>${esc(LOJA.cidade)} · CEP ${esc(LOJA.cep)}</li><li><a href="${waLink()}" target="_blank" rel="noopener">${esc(LOJA.telefone)}</a></li><li><a href="mailto:${esc(LOJA.email)}">${esc(LOJA.email)}</a></li><li>${LOJA.horario.map(esc).join('<br>')}</li></ul><p class="mt-3"><a href="${esc(LOJA.facebook)}" target="_blank" rel="noopener">Facebook</a> · <a href="${esc(LOJA.instagram)}" target="_blank" rel="noopener">Instagram</a></p></div>
 </div><div class="fbot"><div class="wrap">${esc(LOJA.razao)} · CNPJ ${esc(LOJA.cnpj)} · © ${new Date().getFullYear()} Todos os direitos reservados.</div></div></footer>`}
function layout(){
  $('hdr').innerHTML=`<div class="topbar"><div class="wrap flex items-center justify-between gap-3">
   <div class="flex items-center gap-4"><a href="${esc(LOJA.facebook)}" target="_blank" rel="noopener">Facebook</a><a href="${esc(LOJA.instagram)}" target="_blank" rel="noopener">Instagram</a></div>
   <div class="flex items-center gap-4"><a href="#rodape">Fale conosco</a><a href="${waLink()}" target="_blank" rel="noopener">WhatsApp ${esc(LOJA.telefone)}</a></div></div></div>
  <header class="top"><div class="wrap hdr-main">
   <a href="index.html" class="logo" aria-label="${esc(LOJA.nome)}">${logoHtml(56)}</a>
   <form class="search" action="categoria.html" method="get" role="search"><input type="search" name="q" placeholder="Buscar orquídeas…" aria-label="Buscar orquídeas"><button type="submit" aria-label="Buscar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button></form>
   <button class="cartbox" id="cartBtn" type="button" aria-label="Abrir carrinho"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg><span class="cart-txt"><strong>Meu carrinho</strong><small id="cartInfo">Carrinho vazio</small></span><span class="cart-n" id="cartCount">0</span></button>
  </div><nav class="catnav" aria-label="Categorias"><div class="wrap" id="catNav">${NAV0.concat(NAV1).join('')}</div></nav></header>`;
  if($('ftr'))$('ftr').innerHTML=footerHtml();
  document.body.insertAdjacentHTML('beforeend',DIALOG+'<div class="toast" id="toast" role="status" aria-live="polite"></div>');
  markNav();
}
function markNav(){const cur=(location.pathname.split('/').pop()||'index.html')+location.search;
  document.querySelectorAll('#catNav a').forEach(x=>{if(x.getAttribute('href')===cur)x.setAttribute('aria-current','page')})}
function fillMenu(){
  const sp=especies();
  $('catNav').innerHTML=NAV0.concat(sp.map(x=>`<a href="${catUrl(x.slug)}">${esc(x.nome)}</a>`),NAV1).join('');markNav();
  if($('ftrSp'))$('ftrSp').innerHTML=sp.map(x=>`<li><a href="${catUrl(x.slug)}">${esc(x.nome)}</a></li>`).join('')+'<li><a href="categoria.html">Todas as orquídeas</a></li>';
}

/* ---------- carrinho (guardado no navegador, vale em todas as páginas) ---------- */
let cart={};try{cart=JSON.parse(localStorage.getItem('c3m_cart')||'{}')}catch(e){}
const saveCart=()=>{try{localStorage.setItem('c3m_cart',JSON.stringify(cart))}catch(e){}};
const lines=()=>Object.entries(cart).map(([n,q])=>({p:CAT.produtos.find(x=>x.n===n),q})).filter(x=>x.p);
const qtyTotal=()=>lines().reduce((a,x)=>a+x.q,0);
const subtotal=()=>lines().reduce((a,x)=>a+x.p.p*x.q,0);
const freteDe=s=>(s===0||s>=FRETE_GRATIS_ACIMA)?0:FRETE_FIXO;
let tm,renderCart=()=>{};
function showToast(t){const e=$('toast');e.textContent=t;e.classList.add('show');clearTimeout(tm);tm=setTimeout(()=>e.classList.remove('show'),2200)}
function addToCart(s,q){const p=bySlug(s);if(!p||p.disp===false)return;cart[p.n]=Math.min(20,(cart[p.n]||0)+(q||1));saveCart();renderCart();showToast(p.n+' adicionada ao carrinho')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)addToCart(b.dataset.add,Number(b.dataset.q)||1)});

function cpfOk(v){const c=onlyDigits(v);if(c.length!==11||/^(\d)\1+$/.test(c))return false;
  for(const n of [9,10]){let t=0;for(let i=0;i<n;i++)t+=c[i]*(n+1-i);if((t*10)%11%10!=c[n])return false}return true}
function wireCart(){
  const dlg=$('checkout'),itemsEl=$('cartItems'),sumEl=$('cartSummary'),form=$('orderForm'),doneEl=$('ckDone'),errEl=$('ckError'),btn=$('ckSubmit'),cc=$('cartCount');
  renderCart=()=>{
    cc.textContent=qtyTotal();const L=lines();$('cartInfo').textContent=L.length?qtyTotal()+(qtyTotal()===1?' item':' itens')+' · '+BRL(subtotal()):'Carrinho vazio';
    itemsEl.innerHTML=L.length?L.map(x=>`<div class="ck-row"><div class="flex-1"><strong>${esc(x.p.n)}</strong><div class="muted text-sm">${BRL(x.p.p)}</div></div><div class="qty"><button type="button" data-a="-" data-s="${slug(x.p.n)}" aria-label="Diminuir">−</button><span>${x.q}</span><button type="button" data-a="+" data-s="${slug(x.p.n)}" aria-label="Aumentar">+</button></div></div>`).join(''):'<p class="muted">Seu carrinho está vazio. Escolha uma orquídea para começar.</p>';
    const s=subtotal(),f=freteDe(s);
    sumEl.innerHTML=L.length?`<div class="sum-line muted"><span>Produtos</span><span>${BRL(s)}</span></div><div class="sum-line muted"><span>Frete</span><span>${f?BRL(f):'Grátis'}</span></div><div class="sum-line font-bold text-lg"><span>Total</span><span>${BRL(s+f)}</span></div>`:'';
    form.hidden=!L.length;
  };
  itemsEl.addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(!b)return;const p=bySlug(b.dataset.s);if(!p)return;
    cart[p.n]=Math.min(20,(cart[p.n]||0)+(b.dataset.a==='+'?1:-1));if(cart[p.n]<=0)delete cart[p.n];saveCart();renderCart()});
  $('cartBtn').addEventListener('click',()=>{doneEl.hidden=true;itemsEl.hidden=false;sumEl.hidden=false;errEl.hidden=true;renderCart();dlg.showModal()});
  $('ckClose').addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
  const mask=(el,fn)=>el.addEventListener('input',()=>{el.value=fn(onlyDigits(el.value))});
  mask(form.cpf,d=>d.slice(0,11).replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'));
  mask(form.cep,d=>d.slice(0,8).replace(/(\d{5})(\d)/,'$1-$2'));
  form.uf.innerHTML='<option value="">UF</option>'+'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ').map(u=>`<option>${u}</option>`).join('');
  form.cep.addEventListener('blur',async()=>{
    const c=onlyDigits(form.cep.value);if(c.length!==8)return;
    try{const j=await (await fetch('https://viacep.com.br/ws/'+c+'/json/')).json();
      if(!j.erro){form.rua.value=j.logradouro||form.rua.value;form.bairro.value=j.bairro||form.bairro.value;form.cidade.value=j.localidade||form.cidade.value;form.uf.value=j.uf||form.uf.value;form.numero.focus()}}catch(e){}
  });
  const erro=t=>{errEl.textContent=t;errEl.hidden=false};
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const L=lines();if(!L.length)return;
    const v=Object.fromEntries(new FormData(form));errEl.hidden=true;
    if(!cpfOk(v.cpf))return erro('CPF inválido. Confira os números.');
    if(onlyDigits(v.cep).length!==8)return erro('CEP inválido. Digite os 8 números.');
    if(!v.uf)return erro('Escolha o estado.');
    const s=subtotal(),f=freteDe(s),total=s+f;
    const pedido='C3M-'+new Date().toISOString().slice(2,10).replace(/-/g,'')+'-'+Math.floor(1000+Math.random()*9000);
    const linha1=`${v.rua}, ${v.numero}${v.complemento?' - '+v.complemento:''}`;
    const endereco=`${linha1}${v.bairro?', '+v.bairro:''}, ${v.cidade}/${v.uf}, CEP ${v.cep}`;
    const msg=[`*Novo pedido ${pedido}*`,'','*Itens*',...L.map(x=>`• ${x.q}x ${x.p.n} - ${BRL(x.p.p*x.q)}`),'',
      `Produtos: ${BRL(s)}`,`Frete: ${f?BRL(f):'Grátis'}`,`*Total: ${BRL(total)}*`,`Pagamento: ${v.pagamento}`,'',
      '*Dados do cliente*',`Nome: ${v.nome}`,`CPF: ${v.cpf}`,`E-mail: ${v.email}`,`WhatsApp: ${v.whatsapp}`,'',
      '*Endereço de entrega*',linha1,...(v.bairro?[`Bairro: ${v.bairro}`]:[]),`${v.cidade}/${v.uf}`,`CEP: ${v.cep}`].join('\n');
    const wa=waLink(msg);
    const payload=JSON.stringify({pedido,nome:v.nome,cpf:v.cpf,email:v.email,whatsapp:v.whatsapp,endereco,cidade:v.cidade+'/'+v.uf,pagamento:v.pagamento,website:v.website,itens:L.map(x=>({produto:x.p.n,qtd:x.q}))});
    const w=window.open(wa,'_blank');if(w)w.opener=null;   // nova guia (precisa acontecer logo no clique)
    doneEl.innerHTML=`<div class="text-center"><div style="font-size:2.5rem" aria-hidden="true">🌸</div><h3 class="display text-2xl font-bold">Conclua seu pedido pelo nosso WhatsApp</h3><p class="muted mt-2">Pedido <strong>${pedido}</strong> · Total <strong>${BRL(total)}</strong></p><p class="mt-3">${w?'Abrimos o WhatsApp em uma nova guia.':'Toque no botão abaixo para abrir o WhatsApp.'} Envie a mensagem para confirmarmos o pagamento e o envio.</p><a class="btn btn-primary mt-4 no-underline" href="${wa}" target="_blank" rel="noopener">${w?'Abrir o WhatsApp novamente':'Abrir o WhatsApp'}</a></div>`;
    itemsEl.hidden=sumEl.hidden=form.hidden=true;doneEl.hidden=false;
    cart={};saveCart();form.reset();renderCart();
    if(!SCRIPT_URL.startsWith('COLE_AQUI')){
      try{await fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',keepalive:true,headers:{'Content-Type':'text/plain;charset=utf-8'},body:payload})}catch(err){console.error(err)}
    }
  });
}
async function initApp(){layout();wireCart();await loadCatalog();fillMenu();renderCart()}
