/* Nextfuture V4.0 — recuperación segura del acceso administrativo */
(function(){
  'use strict';
  const RECOVER=`${SB}/auth/v1/recover`;
  const USER=`${SB}/auth/v1/user`;
  const emailInput=()=>document.getElementById('loginEmail');
  const passwordInput=()=>document.getElementById('loginPassword');
  function loginMessage(text,error=false){
    const el=document.getElementById('loginMsg');if(!el)return;
    el.textContent=text;el.classList.toggle('error',error);
  }
  function recoveryRedirect(){
    const u=new URL(location.href);u.hash='';return u.toString();
  }
  async function requestRecovery(){
    const email=String(emailInput()?.value||'').trim();
    if(!email){loginMessage('Ingresá primero el correo administrativo.',true);emailInput()?.focus();return;}
    const btn=document.getElementById('forgotPassword');if(btn)btn.disabled=true;
    loginMessage('Enviando correo de recuperación…');
    try{
      const r=await fetch(`${RECOVER}?redirect_to=${encodeURIComponent(recoveryRedirect())}`,{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY},body:JSON.stringify({email})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(d.msg||d.error_description||d.error||'No se pudo enviar el correo');
      loginMessage('Si el correo corresponde al administrador, vas a recibir un enlace para crear una contraseña nueva. Revisá también Spam/Correo no deseado.');
    }catch(e){loginMessage(e.message||'No se pudo iniciar la recuperación.',true)}finally{if(btn)btn.disabled=false}
  }
  function showReset(accessToken){
    const form=document.getElementById('loginForm');if(!form)return;
    form.innerHTML=`<div class="reset-box"><p><b>Crear nueva contraseña</b></p><label>Nueva contraseña</label><input id="nfNewPassword" type="password" autocomplete="new-password" minlength="10" required><label>Repetir contraseña</label><input id="nfNewPassword2" type="password" autocomplete="new-password" minlength="10" required><button class="btn primary" id="nfSaveNewPassword" type="button">Guardar nueva contraseña</button><div id="loginMsg" class="msg"></div></div>`;
    document.getElementById('nfSaveNewPassword')?.addEventListener('click',async()=>{
      const p1=String(document.getElementById('nfNewPassword')?.value||''),p2=String(document.getElementById('nfNewPassword2')?.value||'');
      if(p1.length<10)return loginMessage('Usá una contraseña de al menos 10 caracteres.',true);
      if(p1!==p2)return loginMessage('Las contraseñas no coinciden.',true);
      loginMessage('Actualizando contraseña…');
      try{
        const r=await fetch(USER,{method:'PUT',headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${accessToken}`},body:JSON.stringify({password:p1})});
        const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.msg||d.error_description||d.error||'No se pudo actualizar');
        history.replaceState(null,'',location.pathname+location.search);
        loginMessage('Contraseña actualizada. Recargá la página e ingresá con la nueva contraseña.');
      }catch(e){loginMessage(e.message||'No se pudo actualizar la contraseña.',true)}
    });
  }
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('forgotPassword')?.addEventListener('click',requestRecovery);
    document.getElementById('togglePassword')?.addEventListener('click',()=>{
      const p=passwordInput();if(!p)return;const show=p.type==='password';p.type=show?'text':'password';document.getElementById('togglePassword').textContent=show?'Ocultar':'Mostrar';
    });
    const hp=new URLSearchParams(location.hash.replace(/^#/,''));
    if(hp.get('type')==='recovery'&&hp.get('access_token'))showReset(hp.get('access_token'));
  });
})();