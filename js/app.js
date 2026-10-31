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
 {n:'Phalaenopsis Branca',d:'Clássica e elegante, floresce por meses',dl:'',p:89.9,t:'Para iniciantes',fotos:[],estilo:'branca',esp:'Phalaenopsis',disp:true},
 {n:'Phalaenopsis Rosa',d:'A queridinha para presentear',dl:'',p:99.9,t:'Mais vendida',fotos:[],estilo:'rosa',esp:'Phalaenopsis',disp:true},
 {n:'Phalaenopsis Pintadinha',d:'Pétalas manchadas, cada uma é única',dl:'',p:129.9,t:'',fotos:[],estilo:'pintada',esp:'Phalaenopsis',disp:true},
 {n:'Dendrobium Nobile',d:'Dezenas de flores em uma só haste',dl:'',p:79.9,t:'Para iniciantes',fotos:[],estilo:'roxa',esp:'Dendrobium',disp:true},
 {n:'Oncidium Chuva de Ouro',d:'Perfumada, com flores amarelas leves',dl:'',p:109.9,t:'',fotos:[],estilo:'amarela',esp:'Oncidium',disp:true},
 {n:'Cattleya Roxa',d:'Grande, aromática e muito desejada',dl:'',p:159.9,t:'Para coleção',fotos:[],estilo:'roxa',esp:'Cattleya',disp:true}]};
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
const card=p=>`<article class="card p-2.5 md:p-4 flex flex-col"><a href="${prodUrl(p)}" class="no-underline"><div class="photo">${p.t?`<span class="tag">${esc(p.t)}</span>`:''}${imgOf(p)}</div><h3 class="display text-lg md:text-xl font-bold mt-3">${esc(p.n)}</h3></a><p class="muted text-sm mt-1 flex-1">${esc(p.d)}</p><p class="font-bold text-lg mt-2">${BRL(p.p)}</p><p class="muted text-xs mb-3">ou 3x de ${BRL(p.p/3)} sem juros</p><button class="btn btn-buy" data-add="${slug(p.n)}" ${p.disp===false?'disabled style="opacity:.5;cursor:not-allowed"':''}>${p.disp===false?'Esgotado':'Comprar'}</button></article>`;

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
const FOOTER=`<footer id="contato" class="foot border-t" style="border-color:var(--line)">
  <div class="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    <div>
      <p class="display text-xl font-bold">🌸 Orquidário C3M</p>
      <p class="muted text-sm mt-2 max-w-xs">Orquídeas cultivadas com cuidado para quem ama flores e para quem sonha com uma coleção.</p>
    </div>
    <div>
      <p class="font-bold mb-3">Loja</p>
      <ul class="space-y-2 text-sm"><li><a href="categoria.html">Orquídeas</a></li><li><a href="#">Kits para iniciantes</a></li><li><a href="#">Vasos e substratos</a></li><li><a href="#">Vale-presente</a></li></ul>
    </div>
    <div>
      <p class="font-bold mb-3">Ajuda</p>
      <ul class="space-y-2 text-sm"><li><a href="#">Guia de cuidados</a></li><li><a href="#">Prazos e frete</a></li><li><a href="#">Trocas e garantia</a></li><li><a href="#">Perguntas frequentes</a></li></ul>
    </div>
    <div>
      <p class="font-bold mb-3">Fale com a gente</p>
      <ul class="space-y-2 text-sm"><li><a href="https://wa.me/5531999176791" target="_blank" rel="noopener">WhatsApp: (31) 99917-6791</a></li><li><a href="#">contato@orquidarioc3m.com.br</a></li><li><a href="#">Instagram: @orquidarioc3m</a></li><li class="muted">Seg. a sáb., das 8h às 17h</li></ul>
    </div>
  </div>
  <div class="border-t text-center text-xs muted py-5 px-4" style="border-color:var(--line)">© 2026 Orquidário C3M. Todos os direitos reservados. CNPJ 00.000.000/0001-00</div>
</footer>`;
function layout(){
  $('hdr').innerHTML=`<div class="text-center text-sm font-semibold py-2 px-3" style="background:var(--plum);color:var(--bg)">Frete grátis nas compras acima de R$ ${FRETE_GRATIS_ACIMA} para todo o Brasil</div>
  <header class="top"><div class="max-w-6xl mx-auto flex items-center justify-between gap-2 px-4 py-3">
   <a href="index.html" class="display text-xl font-bold no-underline flex items-center gap-2"><span aria-hidden="true">🌸</span> Orquidário C3M</a>
   <nav class="hidden md:flex gap-6 text-sm font-semibold muted" aria-label="Principal"><a href="index.html" class="no-underline hover:underline">Início</a><a href="categoria.html" class="no-underline hover:underline">Todas as orquídeas</a><a href="#contato" class="no-underline hover:underline">Contato</a></nav>
   <div class="flex items-center gap-2">
    <div class="relative"><button class="btn btn-ghost !py-2 !px-4" id="espBtn" type="button" aria-expanded="false" aria-controls="espMenu">Espécies ▾</button><div id="espMenu" class="menu" hidden></div></div>
    <button class="btn btn-ghost !py-2 !px-4" id="cartBtn" type="button" aria-label="Carrinho"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg><span id="cartCount">0</span></button>
   </div></div></header>`;
  if($('ftr'))$('ftr').innerHTML=FOOTER;
  document.body.insertAdjacentHTML('beforeend',DIALOG+'<div class="toast" id="toast" role="status" aria-live="polite"></div>');
  const btn=$('espBtn'),menu=$('espMenu');
  const fecha=()=>{menu.hidden=true;btn.setAttribute('aria-expanded','false')};
  btn.addEventListener('click',e=>{e.stopPropagation();menu.hidden=!menu.hidden;btn.setAttribute('aria-expanded',String(!menu.hidden))});
  document.addEventListener('click',e=>{if(!menu.contains(e.target))fecha()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')fecha()});
}
function fillMenu(){
  const sp=especies();
  $('espMenu').innerHTML=(sp.length?sp.map(x=>`<a href="${catUrl(x.slug)}"><span>${esc(x.nome)}</span><span class="muted">${x.n}</span></a>`).join(''):'<p class="muted text-sm" style="padding:.75rem">Em breve.</p>')+'<a href="categoria.html" style="border-top:1px solid var(--line);font-weight:700">Ver todas as orquídeas</a>';
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
    cc.textContent=qtyTotal();const L=lines();
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
    const wa='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(msg);
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
