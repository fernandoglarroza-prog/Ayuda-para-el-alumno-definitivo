// Nextfuture V5.4 — navegación clara y continuidad entre secciones
(function(){
'use strict';
function init(){
 const ids=['diagnostico','cotizador','solicitud','seguimiento'];
 const labels=['Diagnóstico','Presupuesto','Solicitar reparación','Seguir mi reparación'];
 const nav=document.createElement('nav');nav.className='nf54-nav';nav.setAttribute('aria-label','Secciones principales de Nextfuture');
 nav.innerHTML='<div class="nf54-nav-inner">'+ids.map((id,i)=>'<a href="#'+id+'" data-nf54="'+id+'"><span class="nf54-num">'+(i+1)+'</span>'+labels[i]+'</a>').join('')+'</div>';
 const header=document.querySelector('.topbar');if(header)header.insertAdjacentElement('afterend',nav);
 const style=document.createElement('style');style.textContent='.nf54-nav{position:sticky;top:0;z-index:30;background:#f8fbf9;border-bottom:1px solid #d7e6dd;box-shadow:0 2px 10px #0f1f1a12}.nf54-nav-inner{max-width:1180px;margin:auto;display:flex;gap:8px;padding:10px 16px;overflow-x:auto;scrollbar-width:thin}.nf54-nav a{display:inline-flex;align-items:center;gap:8px;flex:1;justify-content:center;min-width:max-content;padding:10px 13px;border-radius:12px;color:#153b2c;text-decoration:none;font-weight:700;font-size:14px}.nf54-nav a:hover,.nf54-nav a:focus-visible,.nf54-nav a[aria-current="location"]{background:#dcefe5;outline-offset:2px}.nf54-num{display:inline-grid;place-items:center;width:23px;height:23px;border-radius:50%;background:#1b5940;color:white;font-size:12px}#diagnostico,#cotizador,#solicitud,#seguimiento{scroll-margin-top:95px}.nf54-next{margin:16px 0;padding:16px;border:1px solid #d7e6dd;background:#f7fbf8;border-radius:14px}.nf54-next p{margin:0 0 10px}.nf54-next a{display:inline-block;background:#195c42;color:#fff!important;text-decoration:none;padding:11px 16px;border-radius:10px;font-weight:700}@media(max-width:700px){.nf54-nav-inner{gap:4px}.nf54-nav a{font-size:12px;padding:9px 10px}.nf54-num{width:20px;height:20px}}';document.head.append(style);
 const quote=document.getElementById('cotizador'),request=document.getElementById('solicitud');
 if(quote&&!document.getElementById('nf54QuoteNext')){const next=document.createElement('div');next.id='nf54QuoteNext';next.className='nf54-next';next.innerHTML='<p><b>¿Querés avanzar?</b> Podés solicitar la reparación sin aceptar todavía un presupuesto definitivo.</p><a href="#solicitud">Solicitar reparación →</a>';quote.append(next)}
 if(request&&!document.getElementById('nf54RequestNext')){const next=document.createElement('div');next.id='nf54RequestNext';next.className='nf54-next';next.innerHTML='<p><b>¿Ya tenés una orden?</b> Consultá su estado sin volver a completar la solicitud.</p><a href="#seguimiento">Consultar mi reparación →</a>';request.append(next)}
 const links=[...nav.querySelectorAll('a')];function mark(){const current=ids.filter(id=>{const el=document.getElementById(id);return el&&el.getBoundingClientRect().top<170}).pop()||ids[0];links.forEach(a=>a.getAttribute('data-nf54')===current?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'))}
 window.addEventListener('scroll',mark,{passive:true});mark();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();