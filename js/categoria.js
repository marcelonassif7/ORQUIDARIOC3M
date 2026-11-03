$('grid').innerHTML=skel(8);
initApp(()=>{
  const pr=new URLSearchParams(location.search),e=pr.get('e')||'',q=(pr.get('q')||'').trim();
  const esp=especies().find(x=>x.slug===e);
  let lista=esp?CAT.produtos.filter(p=>slug(p.esp)===e):CAT.produtos,titulo=esp?esp.nome:'Todas as orquídeas';
  if(q){const t=slug(q);lista=CAT.produtos.filter(p=>slug([p.n,p.esp,p.d,p.dl].join(' ')).includes(t));titulo='Busca: “'+q+'”';document.querySelector('.search input').value=q}
  $('catTitulo').textContent=titulo;$('catCrumb').textContent=titulo;document.title=titulo+' | Orquidário C3M';
  $('catSub').textContent=lista.length+(lista.length===1?' orquídea':' orquídeas');
  const ord=$('ordem'),render=()=>{
    const l=[...lista];
    if(ord.value==='menor')l.sort((a,b)=>pv(a)-pv(b));else if(ord.value==='maior')l.sort((a,b)=>pv(b)-pv(a));else if(ord.value==='az')l.sort((a,b)=>a.n.localeCompare(b.n));
    $('grid').innerHTML=l.length?l.map(card).join(''):'<p class="muted" style="grid-column:1/-1">Nenhuma orquídea encontrada. <a href="categoria.html" style="text-decoration:underline">Ver todas</a>.</p>'};
  ord.onchange=render;render();
});
