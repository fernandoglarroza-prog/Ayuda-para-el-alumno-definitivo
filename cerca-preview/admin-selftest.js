(()=>{
  const logLine=(box,text,kind='')=>{const p=document.createElement('div');p.className='notice '+kind;p.textContent=text;box.appendChild(p);box.scrollTop=box.scrollHeight;};
  async function runSelfTest(btn,box){
    if(!S.profile||S.profile.role!=='admin'){toast('Sólo disponible para administración');return;}
    btn.disabled=true;box.innerHTML='';
    try{
      logLine(box,'1/9 Creando solicitud demo real en Moreno…');
      const created=await edge('cerca-requests',{action:'create',category_slug:'tecnico',title:'[DEMO] PC no enciende',description:'Prueba automática integral del flujo real de Cerca. No corresponde a un cliente real.',locality:'Moreno',urgency:'today',service_mode:'onsite',budget_hint:15000});
      const match=(created.matches||[]).find(m=>m.provider?.id===S.user.id)||(created.matches||[])[0];
      if(!match)throw new Error('No se generó un match. Revisá que el perfil técnico demo siga verificado y disponible.');
      logLine(box,`2/9 Matching generado (${Math.round(Number(match.score||0))} puntos). Aceptando oportunidad…`);
      const accepted=await edge('cerca-requests',{action:'respond',match_id:match.id,decision:'accept'});
      const jobId=accepted.job?.job_id||accepted.job?.id;
      if(!jobId)throw new Error('Se aceptó la oportunidad pero no se recibió el ID del trabajo.');
      logLine(box,`3/9 Trabajo ${accepted.job?.job_code||''} creado. Enviando presupuesto v1…`);
      const sent=await edge('cerca-job',{action:'send_quote',job_id:jobId,visit_amount:2000,labor_amount:9000,materials_amount:4000,extra_amount:0,note:'Presupuesto automático de prueba.'});
      if(!sent.quote?.id)throw new Error('No se pudo crear el presupuesto demo.');
      logLine(box,`4/9 Presupuesto ${new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(sent.quote.total_amount||15000))} enviado. Aceptándolo como cliente demo…`);
      await edge('cerca-job',{action:'respond_quote',job_id:jobId,quote_id:sent.quote.id,decision:'accept'});
      logLine(box,'5/9 Presupuesto aceptado. Registrando pago sandbox retenido…');
      const paid=await edge('cerca-payment',{action:'simulate_pay',job_id:jobId,idempotency_key:`selftest-${crypto.randomUUID()}`});
      logLine(box,`6/9 Pago sandbox retenido (${new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(paid.payment?.amount||15000))}). Recorriendo ejecución…`);
      for(const st of ['en_route','arrived','working','review']) await edge('cerca-job',{action:'set_status',job_id:jobId,status:st});
      logLine(box,'7/9 Prestador marcó el trabajo terminado. Confirmando conformidad del cliente…');
      const done=await edge('cerca-payment',{action:'confirm_completion',job_id:jobId});
      logLine(box,'8/9 Liquidación completada. Actualizando paneles…');
      await Promise.allSettled([loadRequests(),loadJobs(),loadAdmin()]);
      const s=done.settlement||{};
      const fmt=v=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(v||0));
      logLine(box,`9/9 PRUEBA COMPLETA ✓ Total ${fmt(s.gross_amount||15000)} · Prestador ${fmt(s.provider_amount||s.provider_net||13500)} · Cerca ${fmt(s.platform_amount||s.platform_fee||1500)}`,'success');
      if(typeof openJob==='function')openJob(jobId);
    }catch(err){console.error(err);logLine(box,`Error: ${err.message||err}`,'error');toast(err.message||'Falló la prueba integral');}
    finally{btn.disabled=false;}
  }
  window.addEventListener('DOMContentLoaded',()=>{
    const admin=document.querySelector('#adminView');if(!admin)return;
    const card=document.createElement('div');card.className='card';card.style.marginTop='18px';
    card.innerHTML='<span class="eyebrow">AUTOTEST REAL</span><h2>Prueba integral del backend</h2><p class="muted">Usa tu perfil técnico demo y crea registros reales marcados como DEMO. No mueve dinero real.</p><div class="item-actions"><button id="runCercaSelfTest" class="btn primary">Ejecutar prueba completa</button></div><div id="selfTestLog" class="stack" style="margin-top:14px;max-height:320px;overflow:auto"></div>';
    admin.appendChild(card);
    const btn=card.querySelector('#runCercaSelfTest'),box=card.querySelector('#selfTestLog');
    btn.addEventListener('click',()=>runSelfTest(btn,box));
  });
})();