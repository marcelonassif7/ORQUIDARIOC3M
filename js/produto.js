initApp().then(()=>{
  const p=bySlug(new URLSearchParams(location.search).get('p')||''),box=$('prod');
  if(!p){box.innerHTML='<p>Não encontramos este produto. <a href="categoria.html" style="text-decoration:underline">Ver todas as orquídeas</a></p>';return}
  document.title=p.n+' | Orquidário C3M';
  const fotos=p.fotos||[],off=p.disp===false;let q=1;
  $('crumb').innerHTML=`<a href="index.html" style="text-decoration:underline">Início</a> / ${p.esp?`<a href="${catUrl(slug(p.esp))}" style="text-decoration:underline">${esc(p.esp)}</a> / `:''}<span>${esc(p.n)}</span>`;
  const thumbs=fotos.length>1?`<div class="thumbs">${fotos.map((u,i)=>`<button type="button" class="thumb" data-i="${i}" aria-label="Foto ${i+1}" ${i?'':'aria-current="true"'}><img src="${esc(u)}" alt=""></button>`).join('')}</div>`:'';
  box.innerHTML=`<div class="grid md:grid-cols-2 gap-6 md:gap-12">
   <div><div class="photo gal-main">${p.t?`<span class="tag">${esc(p.t)}</span>`:''}${fotos[0]?`<img src="${esc(fotos[0])}" alt="${esc(p.n)}" id="galImg">`:orchid(...(ESTILOS[p.estilo]||ESTILOS.rosa))}</div>${thumbs}</div>
   <div>
    ${p.esp?`<a href="${catUrl(slug(p.esp))}" class="muted text-sm" style="text-decoration:underline">${esc(p.esp)}</a>`:''}
    <h1 class="display page-title mt-1">${esc(p.n)}</h1>
    <p class="ppage-price">${BRL(p.p)}</p>
    <p class="muted text-sm">ou até ${LOJA.parcelas}x de ${BRL(p.p/LOJA.parcelas)} sem juros</p>
    <p class="mt-5" style="white-space:pre-line">${esc(p.dl||p.d)}</p>
    ${off?'<p class="mt-6 font-bold">Esgotado no momento.</p>':`<div class="flex items-center gap-4 mt-6"><span class="font-semibold">Quantidade</span><div class="qty"><button type="button" id="qMenos" aria-label="Diminuir">−</button><span id="qVal">1</span><button type="button" id="qMais" aria-label="Aumentar">+</button></div></div>
    <div class="flex flex-col sm:flex-row gap-3 mt-6"><button class="btn btn-buy" id="buyBtn" type="button" style="width:auto">Comprar agora</button><button class="btn btn-ghost" id="addBtn" type="button">Adicionar ao carrinho</button></div>`}
    <p class="muted text-sm mt-6">Ao finalizar, enviamos o resumo do pedido para o nosso WhatsApp e combinamos pagamento e envio com você.</p>
   </div></div>`;
  const th=box.querySelector('.thumbs');
  if(th)th.addEventListener('click',e=>{const b=e.target.closest('.thumb');if(!b)return;
    $('galImg').src=fotos[b.dataset.i];th.querySelectorAll('.thumb').forEach(t=>t.removeAttribute('aria-current'));b.setAttribute('aria-current','true')});
  if(!off){
    const set=n=>{q=Math.max(1,Math.min(20,n));$('qVal').textContent=q};
    $('qMenos').onclick=()=>set(q-1);$('qMais').onclick=()=>set(q+1);
    $('addBtn').onclick=()=>addToCart(slug(p.n),q);
    $('buyBtn').onclick=()=>{addToCart(slug(p.n),q);$('cartBtn').click()};
  }
  const rel=CAT.produtos.filter(x=>x.n!==p.n&&p.esp&&slug(x.esp)===slug(p.esp)).slice(0,4);
  if(rel.length){$('relWrap').hidden=false;$('rel').innerHTML=rel.map(card).join('')}
});
