/* Nextfuture V4.2 — customer notification preferences */
(function(){
  'use strict';
  const API='https://abcuvgoipnwiltlbcqxa.supabase.co/rest/v1/rpc';
  const KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';
  const token=new URL(location.href).searchParams.get('token')||'';
  const headers={'Content-Type':'application/json','apikey':KEY,'Authorization':`Bearer ${KEY}`};
  let mounted=false;
  async function rpc(name,body){const r=await fetch(`${API}/${name}`,{method:'POST',headers,body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.message||d?.error||'No se pudo guardar');return d;}
  function mount(){
    if(mounted||!token)return;
    const content=document.getElementById('content');if(!content||content.classList.contains('hidden')||!content.children.length)return;
    mounted=true;
    const section=document.createElement('section');section.className='card nf42-notify';section.id='nf42Notify';
    section.innerHTML=`<div class="nf42-head"><div><small>AVISOS DE LA REPARACIÓN</small><h2>¿Querés recibir cada novedad automáticamente?</h2><p>Podés elegir WhatsApp, email, ambos o ninguno. Podés cambiarlo cuando quieras desde este mismo enlace privado.</p></div><span class="nf42-badge">Opcional</span></div><div class="nf42-options"><label><input id="nf42Wa" type="checkbox"><span><b>WhatsApp</b><small>Estados, presupuesto, seña, repuesto, reparación, pruebas y entrega.</small></span></label><label id="nf42EmailLabel"><input id="nf42Email" type="checkbox"><span><b>Email</b><small>Recibí las mismas novedades en el correo registrado.</small></span></label></div><button id="nf42Save" type="button">Guardar preferencias</button><div id="nf42Msg" class="nf42-msg">Cargando preferencias…</div>`;
    const firstCard=content.querySelector('.card');if(firstCard)firstCard.insertAdjacentElement('afterend',section);else content.prepend(section);
    load();
    document.getElementById('nf42Save')?.addEventListener('click',save);
  }
  async function load(){const m=document.getElementById('nf42Msg');try{const d=await rpc('nf_public_get_notification_preferences',{p_token:token});if(!d?.ok)throw new Error(d?.error||'No pudimos cargar las preferencias');document.getElementById('nf42Wa').checked=!!d.whatsapp;document.getElementById('nf42Email').checked=!!d.email;const email=document.getElementById('nf42Email'),lab=document.getElementById('nf42EmailLabel');if(!d.has_email){email.disabled=true;lab.classList.add('disabled');lab.querySelector('small').textContent='No hay un email registrado en esta reparación.';}m.textContent=d.whatsapp||d.email?'Avisos activados según tu selección.':'Los avisos automáticos están desactivados.';}catch(e){m.textContent=e.message||'No pudimos cargar las preferencias.';m.classList.add('error')}}
  async function save(){const b=document.getElementById('nf42Save'),m=document.getElementById('nf42Msg');b.disabled=true;m.classList.remove('error','ok');m.textContent='Guardando…';try{const d=await rpc('nf_public_set_notification_preferences',{p_token:token,p_whatsapp:document.getElementById('nf42Wa').checked,p_email:document.getElementById('nf42Email').checked});if(!d?.ok)throw new Error(d?.error||'No pudimos guardar');m.textContent=(d.whatsapp||d.email)?'Preferencias guardadas ✓ Desde ahora las próximas novedades quedarán preparadas para esos canales.':'Avisos automáticos desactivados.';m.classList.add('ok');}catch(e){m.textContent=e.message||'No pudimos guardar.';m.classList.add('error')}finally{b.disabled=false}}
  const obs=new MutationObserver(mount);document.addEventListener('DOMContentLoaded',()=>{mount();const c=document.getElementById('content');if(c)obs.observe(c,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});});
})();