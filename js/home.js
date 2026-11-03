$('bArt').innerHTML=orchid('#F08CC1','#F7B8DA','#C0328A');
$('grid').innerHTML=skel(8);
initApp(()=>{
  $('benefits').innerHTML=[['💳',`Pague como quiser !`,'Aceitamos diversas formas de pagamento'],['📲','Atendimento no WhatsApp',LOJA.telefone],['📍','Visite o orquidário',LOJA.cidade.replace('/',', ')],['🌿','Matrizes selecionadas','Grande variedade de espécies']]
    .map(b=>`<li><span aria-hidden="true">${b[0]}</span><div><strong>${esc(b[1])}</strong><small>${esc(b[2])}</small></div></li>`).join('');
  const c={};Object.entries(CAT.config||{}).forEach(([k,v])=>{if(v)c[k]=v});
  if(c.titulo)$('bTitulo').textContent=c.titulo;
  if(c.subtitulo)$('bSub').textContent=c.subtitulo;
  if(c.botaoTexto)$('bBtn').textContent=c.botaoTexto;
  if(c.botaoLink&&!/^\s*javascript:/i.test(c.botaoLink))$('bBtn').href=c.botaoLink;
  const b=$('banner');
  if(c.imagem){const u=x=>'url("'+String(x).replace(/"/g,'%22')+'")';
    b.style.setProperty('--bd',u(c.imagem));if(c.imagemMobile)b.style.setProperty('--bm',u(c.imagemMobile));else b.style.removeProperty('--bm');
    b.classList.add('has-img');$('bArt').hidden=true}
  else{b.classList.remove('has-img');$('bArt').hidden=false}
  const sp=especies();
  $('especies').hidden=!sp.length;
  $('catTiles').innerHTML=sp.map(x=>{const p=CAT.produtos.find(q=>slug(q.esp)===x.slug);
    return `<a href="${catUrl(x.slug)}" class="tile"><div class="photo">${imgOf(p)}</div><h3>${esc(x.nome)}</h3><p class="muted text-sm">${x.n} ${x.n===1?'orquídea':'orquídeas'}</p></a>`}).join('');
  $('grid').innerHTML=CAT.produtos.length?CAT.produtos.slice(0,8).map(card).join(''):'<p class="muted" style="grid-column:1/-1">Novas orquídeas chegando em breve.</p>';
  $('visitInfo').innerHTML=contactBlock();$('mapaBox').innerHTML=mapFrame();
});
