initApp().then(()=>{
  const e=new URLSearchParams(location.search).get('e')||'';
  const esp=especies().find(x=>x.slug===e);
  const lista=esp?CAT.produtos.filter(p=>slug(p.esp)===e):CAT.produtos;
  const titulo=esp?esp.nome:'Todas as orquídeas';
  $('catTitulo').textContent=titulo;$('catCrumb').textContent=titulo;document.title=titulo+' | Orquidário C3M';
  $('catSub').textContent=lista.length+(lista.length===1?' orquídea':' orquídeas');
  $('grid').innerHTML=lista.length?lista.map(card).join(''):'<p class="muted" style="grid-column:1/-1">Nenhuma orquídea nesta categoria por enquanto.</p>';
});
