// Nextfuture V5.6: ayuda contextual para el seguimiento de reparaciones.
(function(){
 'use strict';
 function init(){
  const section=document.getElementById('seguimiento');
  const code=document.getElementById('code');
  const phone=document.getElementById('phone');
  const track=document.getElementById('track');
  if(!section||!code||!phone||!track)return;
  const guide=document.createElement('div');
  guide.className='nf56-guide';
  guide.innerHTML='<strong>¿Dónde encuentro estos datos?</strong><p>El código aparece cuando registrás tu solicitud. Los cuatro números son los últimos dígitos del teléfono que informaste.</p><p>No necesitás crear una cuenta ni ingresar tu teléfono completo.</p>';
  guide.style.cssText='padding:14px 18px;margin:12px 0;background:#f0f7f2;border:1px solid #cce1d4;border-radius:12px;line-height:1.5';
  const fields=section.querySelector('.fields');
  if(fields)fields.insertAdjacentElement('beforebegin',guide);
  phone.setAttribute('pattern','[0-9]{4}');
  phone.setAttribute('aria-label','Últimos cuatro dígitos del teléfono registrado');
  code.setAttribute('aria-label','Código de reparación');
  const result=document.getElementById('result');
  if(result){result.setAttribute('role','status');result.setAttribute('aria-live','polite');}
  track.addEventListener('click',function(){
   if(!code.value.trim()||phone.value.replace(/\D/g,'').length!==4)return;
   track.disabled=true;
   window.setTimeout(function(){track.disabled=false;},1800);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();