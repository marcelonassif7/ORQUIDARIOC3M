const ico=d=>`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const BADGES=[
 [ico('<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),'Frete grátis acima de R$ 199','Entrega para todo o Brasil, com rastreio.'],
 [ico('<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>'),'Embalagem protegida','Caixa reforçada para a planta chegar firme e sem danos.'],
 [ico('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'),'Garantia de chegada','Se a planta chegar com problema, trocamos ou devolvemos o valor.'],
 [ico('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'),'Pagamento seguro','Pix, cartão em até 3x sem juros e boleto.']
];
$('badges').innerHTML=BADGES.map(b=>`<div class="card p-5"><div>${b[0]}</div><h3 class="font-bold mt-3">${b[1]}</h3><p class="muted text-sm mt-1">${b[2]}</p></div>`).join('');

const REVIEWS=[
 ['Marina S.','Niterói, RJ','Nunca tinha conseguido manter uma orquídea viva. A minha chegou linda e o guia de cuidados me ajudou muito. Já pedi a segunda!'],
 ['Carlos A.','Belo Horizonte, MG','Comecei com uma Dendrobium e hoje tenho oito. Atendimento atencioso e plantas sempre muito bem embaladas.'],
 ['Juliana P.','São Paulo, SP','Comprei de presente para minha mãe. Chegou rápido, sem nenhuma flor quebrada, e ela adorou.']
];
document.getElementById('reviews').innerHTML=REVIEWS.map(r=>`<figure class="card p-5 m-0"><div style="color:var(--star)" aria-label="5 de 5 estrelas">★★★★★</div><blockquote class="mt-3 m-0">“${r[2]}”</blockquote><figcaption class="mt-4 text-sm"><strong>${r[0]}</strong> <span class="muted">· ${r[1]}</span></figcaption></figure>`).join('');

$('bArt').innerHTML=orchid('#F08CC1','#F7B8DA','#C0328A');
initApp().then(()=>{
  const c={};Object.entries(CAT.config||{}).forEach(([k,v])=>{if(v)c[k]=v});
  if(c.titulo)$('bTitulo').textContent=c.titulo;
  if(c.subtitulo)$('bSub').textContent=c.subtitulo;
  if(c.botaoTexto)$('bBtn').textContent=c.botaoTexto;
  if(c.botaoLink&&!/^\s*javascript:/i.test(c.botaoLink))$('bBtn').href=c.botaoLink;
  if(c.imagem){const u=u=>'url("'+String(u).replace(/"/g,'%22')+'")',b=$('banner');
    b.style.setProperty('--bd',u(c.imagem));if(c.imagemMobile)b.style.setProperty('--bm',u(c.imagemMobile));
    b.classList.add('has-img');$('bArt').hidden=true}
  const sp=especies();
  $('especies').hidden=!sp.length;
  $('catTiles').innerHTML=sp.map(x=>{const p=CAT.produtos.find(q=>slug(q.esp)===x.slug);
    return `<a href="${catUrl(x.slug)}" class="tile card"><div class="photo">${imgOf(p)}</div><h3 class="display text-lg md:text-xl font-bold mt-3">${esc(x.nome)}</h3><p class="muted text-sm">${x.n} ${x.n===1?'orquídea':'orquídeas'}</p></a>`}).join('');
  $('grid').innerHTML=CAT.produtos.length?CAT.produtos.slice(0,6).map(card).join(''):'<p class="muted" style="grid-column:1/-1">Novas orquídeas chegando em breve.</p>';
});
