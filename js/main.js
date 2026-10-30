/* ===== CONFIGURAÇÃO: edite estes valores ===== */
const SCRIPT_URL='COLE_AQUI_A_URL_DO_APPS_SCRIPT'; // URL gerada ao publicar o Apps Script
const WHATSAPP='5531999176791';                    // recebe os pedidos: DDI+DDD+número, só dígitos
const FRETE_FIXO=25, FRETE_GRATIS_ACIMA=199;       // mesmos valores do Code.gs
/* ============================================= */

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

let PRODUCTS=[
 {n:'Phalaenopsis Branca',d:'Clássica e elegante, floresce por meses',p:89.9,c:['#FFFFFF','#F3E6F7','#E9B8D6'],t:'Para iniciantes'},
 {n:'Phalaenopsis Rosa',d:'A queridinha para presentear',p:99.9,c:['#F7B8DA','#F08CC1','#C0328A'],t:'Mais vendida'},
 {n:'Phalaenopsis Pintadinha',d:'Pétalas manchadas, cada uma é única',p:129.9,c:['#FAD9EC','#F3A6CF','#8C1F68']},
 {n:'Dendrobium Nobile',d:'Dezenas de flores em uma só haste',p:79.9,c:['#E3C6F5','#C99AE8','#7A3FA3'],t:'Para iniciantes'},
 {n:'Oncidium Chuva de Ouro',d:'Perfumada, com flores amarelas leves',p:109.9,c:['#F6D365','#F2B632','#A8691B']},
 {n:'Cattleya Roxa',d:'Grande, aromática e muito desejada',p:159.9,c:['#C77DE0','#A653C9','#F6D365'],t:'Para coleção'}
];
const BRL=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

document.getElementById('heroOrchid').innerHTML=orchid('#F08CC1','#F7B8DA','#C0328A');

const ESTILOS={branca:['#FFFFFF','#F3E6F7','#E9B8D6'],rosa:['#F7B8DA','#F08CC1','#C0328A'],pintada:['#FAD9EC','#F3A6CF','#8C1F68'],roxa:['#C77DE0','#A653C9','#F6D365'],amarela:['#F6D365','#F2B632','#A8691B']};
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderGrid(){
  document.getElementById('grid').innerHTML=PRODUCTS.length?PRODUCTS.map((x,i)=>`
 <article class="card p-2.5 md:p-4 flex flex-col">
  <div class="photo">${x.t?`<span class="tag">${esc(x.t)}</span>`:''}${x.foto?`<img src="${esc(x.foto)}" alt="${esc(x.n)}" loading="lazy">`:orchid(...x.c)}</div>
  <h3 class="display text-lg md:text-xl font-bold mt-3">${esc(x.n)}</h3>
  <p class="muted text-sm mt-1 flex-1">${esc(x.d)}</p>
  <p class="font-bold text-lg mt-2">${BRL(x.p)}</p>
  <p class="muted text-xs mb-3">ou 3x de ${BRL(x.p/3)} sem juros</p>
  <button class="btn btn-buy" data-i="${i}" ${x.disp===false?'disabled style="opacity:.5;cursor:not-allowed"':''}>${x.disp===false?'Esgotado':'Comprar'}</button>
 </article>`).join(''):'<p class="muted" style="grid-column:1/-1">Novas orquídeas chegando em breve.</p>';
}
async function loadProducts(){
  if(SCRIPT_URL.startsWith('COLE_AQUI')){renderGrid();return}
  document.getElementById('grid').innerHTML='<p class="muted" style="grid-column:1/-1">Carregando orquídeas…</p>';
  try{
    const j=await (await fetch(SCRIPT_URL+'?acao=produtos')).json();
    if(j.ok)PRODUCTS=j.produtos.map(x=>({n:x.n,d:x.d,p:x.p,t:x.t,foto:x.foto,disp:x.disp,c:ESTILOS[x.estilo]||ESTILOS.rosa}));
  }catch(err){console.error(err)}
  renderGrid();renderCart();
}

const ico=d=>`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const BADGES=[
 [ico('<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),'Frete grátis acima de R$ 199','Entrega para todo o Brasil, com rastreio.'],
 [ico('<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>'),'Embalagem protegida','Caixa reforçada para a planta chegar firme e sem danos.'],
 [ico('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'),'Garantia de chegada','Se a planta chegar com problema, trocamos ou devolvemos o valor.'],
 [ico('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'),'Pagamento seguro','Pix, cartão em até 3x sem juros e boleto.']
];
document.getElementById('badges').innerHTML=BADGES.map(b=>`<div class="card p-5"><div>${b[0]}</div><h3 class="font-bold mt-3">${b[1]}</h3><p class="muted text-sm mt-1">${b[2]}</p></div>`).join('');

const REVIEWS=[
 ['Marina S.','Niterói, RJ','Nunca tinha conseguido manter uma orquídea viva. A minha chegou linda e o guia de cuidados me ajudou muito. Já pedi a segunda!'],
 ['Carlos A.','Belo Horizonte, MG','Comecei com uma Dendrobium e hoje tenho oito. Atendimento atencioso e plantas sempre muito bem embaladas.'],
 ['Juliana P.','São Paulo, SP','Comprei de presente para minha mãe. Chegou rápido, sem nenhuma flor quebrada, e ela adorou.']
];
document.getElementById('reviews').innerHTML=REVIEWS.map(r=>`<figure class="card p-5 m-0"><div style="color:var(--star)" aria-label="5 de 5 estrelas">★★★★★</div><blockquote class="mt-3 m-0">“${r[2]}”</blockquote><figcaption class="mt-4 text-sm"><strong>${r[0]}</strong> <span class="muted">· ${r[1]}</span></figcaption></figure>`).join('');


const cart={};
const $=id=>document.getElementById(id);
const dlg=$('checkout'),itemsEl=$('cartItems'),sumEl=$('cartSummary'),form=$('orderForm'),doneEl=$('ckDone'),errEl=$('ckError'),btn=$('ckSubmit');
const qtyTotal=()=>Object.values(cart).reduce((a,b)=>a+b,0);
const subtotal=()=>Object.entries(cart).reduce((s,[i,q])=>s+PRODUCTS[i].p*q,0);
const freteDe=s=>(s===0||s>=FRETE_GRATIS_ACIMA)?0:FRETE_FIXO;
let tm;
function showToast(t){toast.textContent=t;toast.classList.add('show');clearTimeout(tm);tm=setTimeout(()=>toast.classList.remove('show'),2200)}

function renderCart(){
  cc.textContent=qtyTotal();
  const keys=Object.keys(cart);
  itemsEl.innerHTML=keys.length?keys.map(i=>`<div class="ck-row"><div class="flex-1"><strong>${PRODUCTS[i].n}</strong><div class="muted text-sm">${BRL(PRODUCTS[i].p)}</div></div><div class="qty"><button type="button" data-a="-" data-i="${i}" aria-label="Diminuir">−</button><span>${cart[i]}</span><button type="button" data-a="+" data-i="${i}" aria-label="Aumentar">+</button></div></div>`).join(''):'<p class="muted">Seu carrinho está vazio. Escolha uma orquídea para começar.</p>';
  const s=subtotal(),f=freteDe(s);
  sumEl.innerHTML=keys.length?`<div class="sum-line muted"><span>Produtos</span><span>${BRL(s)}</span></div><div class="sum-line muted"><span>Frete</span><span>${f?BRL(f):'Grátis'}</span></div><div class="sum-line font-bold text-lg"><span>Total</span><span>${BRL(s+f)}</span></div>`:'';
  form.hidden=!keys.length;
}
const cc=$('cartCount'),toast=$('toast');

$('grid').addEventListener('click',e=>{
  const b=e.target.closest('button[data-i]');if(!b)return;
  cart[b.dataset.i]=Math.min(20,(cart[b.dataset.i]||0)+1);
  renderCart();showToast(PRODUCTS[b.dataset.i].n+' adicionada ao carrinho');
});
itemsEl.addEventListener('click',e=>{
  const b=e.target.closest('button[data-a]');if(!b)return;
  const i=b.dataset.i;cart[i]=Math.min(20,(cart[i]||0)+(b.dataset.a==='+'?1:-1));
  if(cart[i]<=0)delete cart[i];renderCart();
});
$('cartBtn').addEventListener('click',()=>{
  doneEl.hidden=true;itemsEl.hidden=false;sumEl.hidden=false;errEl.hidden=true;
  renderCart();dlg.showModal();
});
$('ckClose').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});

const onlyDigits=v=>String(v||'').replace(/\D/g,'');
function cpfOk(v){const c=onlyDigits(v);if(c.length!==11||/^(\d)\1+$/.test(c))return false;
  for(const n of [9,10]){let t=0;for(let i=0;i<n;i++)t+=c[i]*(n+1-i);if((t*10)%11%10!=c[n])return false}return true}
const mask=(el,fn)=>el.addEventListener('input',()=>{el.value=fn(onlyDigits(el.value))});
mask(form.cpf,d=>d.slice(0,11).replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'));
mask(form.cep,d=>d.slice(0,8).replace(/(\d{5})(\d)/,'$1-$2'));
form.uf.innerHTML='<option value="">UF</option>'+'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ').map(u=>`<option>${u}</option>`).join('');
form.cep.addEventListener('blur',async()=>{
  const c=onlyDigits(form.cep.value);if(c.length!==8)return;
  try{const j=await (await fetch('https://viacep.com.br/ws/'+c+'/json/')).json();
    if(!j.erro){form.rua.value=j.logradouro||form.rua.value;form.bairro.value=j.bairro||form.bairro.value;form.cidade.value=j.localidade||form.cidade.value;form.uf.value=j.uf||form.uf.value;form.numero.focus()}}catch(e){}
});
const mostraErro=t=>{errEl.textContent=t;errEl.hidden=false};

form.addEventListener('submit',async e=>{
  e.preventDefault();
  const itens=Object.entries(cart).map(([i,q])=>({produto:PRODUCTS[i].n,qtd:q}));
  if(!itens.length)return;
  const v=Object.fromEntries(new FormData(form));errEl.hidden=true;
  if(!cpfOk(v.cpf))return mostraErro('CPF inválido. Confira os números.');
  if(onlyDigits(v.cep).length!==8)return mostraErro('CEP inválido. Digite os 8 números.');
  if(!v.uf)return mostraErro('Escolha o estado.');
  const s=subtotal(),f=freteDe(s),total=s+f;
  const pedido='C3M-'+new Date().toISOString().slice(2,10).replace(/-/g,'')+'-'+Math.floor(1000+Math.random()*9000);
  const linha1=`${v.rua}, ${v.numero}${v.complemento?' - '+v.complemento:''}`;
  const endereco=`${linha1}${v.bairro?', '+v.bairro:''}, ${v.cidade}/${v.uf}, CEP ${v.cep}`;
  const msg=[`*Novo pedido ${pedido}*`,'','*Itens*',...Object.entries(cart).map(([i,q])=>`• ${q}x ${PRODUCTS[i].n} - ${BRL(PRODUCTS[i].p*q)}`),'',
    `Produtos: ${BRL(s)}`,`Frete: ${f?BRL(f):'Grátis'}`,`*Total: ${BRL(total)}*`,`Pagamento: ${v.pagamento}`,'',
    '*Dados do cliente*',`Nome: ${v.nome}`,`CPF: ${v.cpf}`,`E-mail: ${v.email}`,`WhatsApp: ${v.whatsapp}`,'',
    '*Endereço de entrega*',linha1,...(v.bairro?[`Bairro: ${v.bairro}`]:[]),`${v.cidade}/${v.uf}`,`CEP: ${v.cep}`].join('\n');
  const wa='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(msg);
  btn.disabled=true;btn.textContent='Abrindo o WhatsApp…';
  if(!SCRIPT_URL.startsWith('COLE_AQUI')){      // registra na planilha (se falhar, o WhatsApp segue)
    const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),4000);
    try{await fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',signal:ctl.signal,headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({pedido,nome:v.nome,cpf:v.cpf,email:v.email,whatsapp:v.whatsapp,endereco,cidade:v.cidade+'/'+v.uf,pagamento:v.pagamento,website:v.website,itens})})}
    catch(err){console.error(err)}
    clearTimeout(t);
  }
  doneEl.innerHTML=`<div class="text-center"><div style="font-size:2.5rem" aria-hidden="true">🌸</div><h3 class="display text-2xl font-bold">Falta só um passo!</h3><p class="muted mt-2">Pedido <strong>${pedido}</strong> · Total <strong>${BRL(total)}</strong></p><p class="mt-3">Envie a mensagem no WhatsApp para confirmarmos o pagamento e o envio.</p><a class="btn btn-primary mt-4 no-underline" href="${wa}" target="_blank" rel="noopener">Enviar pedido no WhatsApp</a></div>`;
  itemsEl.hidden=sumEl.hidden=form.hidden=true;doneEl.hidden=false;
  for(const k in cart)delete cart[k];cc.textContent=0;form.reset();
  btn.disabled=false;btn.textContent='Finalizar compra';
  location.href=wa;
});
renderCart();
loadProducts();
