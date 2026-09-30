// Nextfuture V3.6 — casos reales y opiniones verificadas
(function(){
  'use strict';
  const ENDPOINT='https://abcuvgoipnwiltlbcqxa.supabase.co/functions/v1/nextfuture-feedback';
  const KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const stars=n=>'★'.repeat(Math.max(0,Math.min(5,Number(n)||0)))+'☆'.repeat(Math.max(0,5-Math.min(5,Number(n)||0)));
  async function load(){
    try{
      const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify({action:'get_public'})});
      const d=await r.json();if(!r.ok)throw new Error();
      if(!(d.cases||[]).length&&!(d.reviews||[]).length)return;
      const anchor=document.getElementById('solicitud');if(!anchor)return;
      const s=document.createElement('section');s.className='shell section nf36-social';s.id='casos-reales';
      const stats=d.review_count?`<div class="nf36-score"><b>${Number(d.average_rating||0).toFixed(1)}</b><span>${stars(Math.round(d.average_rating||0))}</span><small>${d.review_count} opinión${d.review_count===1?'':'es'} autorizada${d.review_count===1?'':'s'}</small></div>`:'';
      const cases=(d.cases||[]).slice(0,6).map(c=>`<article class="nf36-case"><span class="nf36-verified">CASO REAL</span><small>${esc(c.device)}</small><h3>${esc(c.title||'Reparación realizada')}</h3><p>${esc(c.summary||'')}</p>${c.review?`<div class="nf36-mini-review"><b>${stars(c.review.rating)}</b><q>${esc(c.review.comment||'')}</q><small>${esc(c.review.display_name||'Cliente verificado')}</small></div>`:''}</article>`).join('');
      const reviews=(d.reviews||[]).slice(0,6).map(x=>`<article class="nf36-review"><div class="nf36-stars">${stars(x.rating)}</div><q>${esc(x.comment||'Sin comentario escrito.')}</q><b>${esc(x.display_name||'Cliente verificado')}</b><small>${esc(x.device||'Equipo reparado')} · trabajo verificado</small></article>`).join('');
      s.innerHTML=`<div class="section-head"><div><span class="diag-kicker">TRABAJOS VERIFICADOS</span><h2>Casos reales y devoluciones de clientes</h2><p class="sub">Sólo mostramos trabajos efectivamente realizados. Los comentarios aparecen únicamente cuando el cliente autorizó su publicación; nunca mostramos teléfono, email, dirección ni datos privados de la orden.</p></div>${stats}</div>${cases?`<div class="nf36-cases">${cases}</div>`:''}${reviews?`<div class="nf36-review-head"><h3>Qué dijeron después de la entrega</h3><p>Opiniones vinculadas a órdenes reales de Nextfuture.</p></div><div class="nf36-reviews">${reviews}</div>`:''}`;
      anchor.insertAdjacentElement('afterend',s);
    }catch(_){/* La portada sigue funcionando aunque no carguen los casos. */}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})();