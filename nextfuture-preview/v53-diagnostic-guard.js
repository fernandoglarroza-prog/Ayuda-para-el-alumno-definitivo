/* Nextfuture V5.3 — guardarraíl de resultado: nunca deja un diagnóstico sin respuesta */
(function(){'use strict';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function symptom(){return window.DIAG_DATA?.[window.diagState?.device]?.symptoms?.[window.diagState?.symptom]||null}
function state(){try{return diagState}catch(e){return null}}
function data(){try{return DIAG_DATA}catch(e){return null}}
function fallback(reason){
 const st=state(),db=data(),card=$('diagResultCard');if(!st||!db||!card||!st.device||!st.symptom)return false;
 const s=db[st.device]?.symptoms?.[st.symptom];if(!s)return false;
 const brand=$('diagBrand')?.value.trim()||'',model=$('diagModel')?.value.trim()||'',name=[brand,model].filter(Boolean).join(' ')||db[st.device]?.label||'Equipo';
 const job=window.NextfutureQuoteV52?.jobFromSymptom?.(st.symptom,s)||'diagnosis',q=window.NextfutureQuoteV52?.estimate?.(st.device,job,[brand,model].filter(Boolean).join(' '));
 card.innerHTML=`<div class="diag-result nf53-fallback"><div class="diag-result-top"><div><small>RESULTADO PRELIMINAR</small><h3>${esc(name)} · ${esc(s.label||'Problema informado')}</h3><p>El modelo no necesita estar cargado en nuestra base para recibir una orientación.</p></div><span class="diag-badge warn">ORIENTACIÓN POR SÍNTOMAS</span></div><div class="diag-result-grid"><div class="diag-panel"><h4>Qué puede estar pasando</h4><ul>${(s.causes||['Requiere revisión técnica']).map(x=>'<li>'+esc(x)+'</li>').join('')}</ul></div><div class="diag-panel"><h4>Estimación responsable</h4><div class="diag-price">${q?'Mano de obra desde '+new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(q.labor):'Requiere cotización'}</div><div class="diag-price-note">El repuesto se confirma para ${esc(name)}. No usamos el precio de otro modelo como sustituto.</div></div><div class="diag-panel"><h4>Qué revisar primero</h4><ul><li>Confirmar el síntoma con pruebas seguras.</li><li>Separar accesorio, software y componente físico cuando corresponda.</li><li>Verificar modelo/variante antes de pedir repuestos.</li></ul></div><div class="diag-panel"><h4>Siguiente paso</h4><p>Podés continuar con la cotización o enviar la solicitud con este equipo exacto.</p></div></div><div class="nf48-quote-bridge"><div><small>COTIZACIÓN</small><b>${esc(name)}</b><p>Si no existe una referencia de repuesto verificada, se cotiza de forma personalizada.</p></div><button class="btn btn-secondary" id="nf53Quote" type="button">Cotizar este equipo</button></div><div class="diag-disclaimer">Orientación previa. La causa y el presupuesto final se confirman revisando físicamente el equipo.</div></div>`;
 $('diagResultStage')?.classList.remove('hidden');if($('diagProgress'))$('diagProgress').textContent='Paso 4 de 4';
 $('nf53Quote')?.addEventListener('click',()=>{location.hash='cotizador';setTimeout(()=>{const d=$('qpDeviceV52'),m=$('qpModelV52'),j=$('qpJobV52');if(d)d.value=st.device;if(j&&d){j.innerHTML=Object.keys({phone:{diagnosis:1,screen:1,battery:1,charge:1,camera:1,audio:1,software:1,water:1,board:1},tablet:{diagnosis:1,screen:1,battery:1,charge:1,software:1,water:1,board:1},notebook:{diagnosis:1,screen:1,battery:1,charge:1,keyboard:1,ssd:1,ram:1,cleaning:1,software:1,board:1},pc:{diagnosis:1,psu:1,ssd:1,ram:1,cleaning:1,software:1,assembly:1,board:1}}[st.device]||{diagnosis:1}).map(k=>'<option value="'+k+'">'+k+'</option>').join('');j.value=job}if(m)m.value=[brand,model].filter(Boolean).join(' ');window.NextfutureQuoteV52?.render?.()},30)});
 console.warn('Nextfuture diagnostic fallback used',reason||'empty result');return true;
}
function guard(){
 const st=state();if(!st?.device||!st?.symptom)return;
 setTimeout(()=>{const card=$('diagResultCard');if(!card)return;const result=card.querySelector('.diag-result');if(!result||!result.textContent.trim())fallback('empty-render')},250);
}
document.addEventListener('click',e=>{if(e.target.closest?.('#diagCalculate'))guard()},{capture:false});
window.addEventListener('error',e=>{const st=state();if(st?.device&&st?.symptom&&$('diagResultStage')&&!$('diagResultStage').classList.contains('hidden'))setTimeout(()=>{if(!$('diagResultCard')?.querySelector('.diag-result'))fallback('script-error')},0)});
window.NextfutureDiagnosticGuard={fallback,guard};
})();