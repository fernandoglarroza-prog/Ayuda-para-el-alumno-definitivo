// Nextfuture V4.9 — UX y validación del circuito de solicitud
(function(){'use strict';
const $=id=>document.getElementById(id);
const escHtml=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function digits(v){return String(v||'').replace(/\D/g,'')}
function valid(){
 const name=$('rqName')?.value.trim()||'',phone=digits($('rqPhone')?.value),issue=$('rqIssue')?.value.trim()||'',email=$('rqEmail')?.value.trim()||'';
 const errors=[];
 if(name.length<3)errors.push('Ingresá tu nombre.');
 if(phone.length<8)errors.push('Revisá el teléfono/WhatsApp.');
 if(issue.length<8)errors.push('Contanos un poco más sobre la falla.');
 if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))errors.push('Revisá el email.');
 return errors;
}
function summary(){
 const box=$('nf49RequestSummary');if(!box)return;
 const device=$('rqDevice')?.selectedOptions?.[0]?.textContent||'',brand=$('rqBrand')?.value.trim()||'',model=$('rqModel')?.value.trim()||'',mode=$('rqMode')?.selectedOptions?.[0]?.textContent||'',loc=$('rqLocality')?.value||'',issue=$('rqIssue')?.value.trim()||'';
 box.innerHTML=`<small>RESUMEN DE LA SOLICITUD</small><div class="nf49-summary-grid"><p><b>Equipo</b><span>${escHtml([device,brand,model].filter(Boolean).join(' · ')||'A completar')}</span></p><p><b>Modalidad</b><span>${escHtml(mode||'A completar')}</span></p><p><b>Zona</b><span>${escHtml(loc||'A completar')}</span></p><p class="wide"><b>Problema informado</b><span>${escHtml(issue||'A completar')}</span></p></div>`;
}
function init(){
 const form=$('requestForm');if(!form||$('nf49RequestSummary'))return;
 const box=document.createElement('div');box.id='nf49RequestSummary';box.className='nf49-request-summary';form.querySelector('.request-actions')?.insertAdjacentElement('beforebegin',box);
 ['rqDevice','rqBrand','rqModel','rqMode','rqLocality','rqIssue'].forEach(id=>$(id)?.addEventListener('input',summary));
 $('rqPhone')?.setAttribute('placeholder','Ej: 11 3011 2951');$('rqPhone')?.setAttribute('autocomplete','tel');
 $('rqName')?.setAttribute('autocomplete','name');$('rqEmail')?.setAttribute('autocomplete','email');
 form.addEventListener('submit',e=>{const er=valid();if(!er.length)return;e.preventDefault();e.stopImmediatePropagation();const m=$('requestMsg');if(m){m.innerHTML='<b>Revisemos estos datos:</b><br>'+er.join('<br>');m.classList.add('show','error');}form.querySelector(':invalid')?.focus();},{capture:true});
 summary();
}
document.addEventListener('DOMContentLoaded',init);
})();