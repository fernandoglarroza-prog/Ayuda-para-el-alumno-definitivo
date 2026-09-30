const NF_REQUEST='https://abcuvgoipnwiltlbcqxa.supabase.co/functions/v1/nextfuture-request';
const NF_KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';
const rq=s=>document.querySelector(s);
function reqMsg(text,error=false){const x=rq('#requestMsg');x.innerHTML=text;x.classList.add('show');x.classList.toggle('error',error)}
async function sendRequest(e){e.preventDefault();const b=rq('#requestSubmit');b.disabled=true;reqMsg('Registrando solicitud…');const body={name:rq('#rqName').value.trim(),phone:rq('#rqPhone').value.trim(),email:rq('#rqEmail').value.trim()||null,locality:rq('#rqLocality').value,device_type:rq('#rqDevice').value,brand:rq('#rqBrand').value.trim()||null,model:rq('#rqModel').value.trim()||null,issue:rq('#rqIssue').value.trim(),service_mode:rq('#rqMode').value,website:rq('#rqWebsite').value,diagnostic_snapshot:window.NextfutureLearning?.snapshot?.()||null};try{const r=await fetch(NF_REQUEST,{method:'POST',headers:{'Content-Type':'application/json','apikey':NF_KEY},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.error||'No pudimos registrar la solicitud.');reqMsg(`<b>Solicitud ${d.order_code} registrada ✓</b><br>Guardá ese código. Para consultar el estado usá también los últimos 4 dígitos de tu teléfono: <b>${d.phone_last4}</b>.${d.diagnostic_saved?'<br>El diagnóstico previo quedó asociado a esta reparación.':''}`);if(rq('#code'))rq('#code').value=d.order_code;if(rq('#phone'))rq('#phone').value=d.phone_last4;e.target.reset();rq('#rqLocality').value='Moreno'}catch(err){reqMsg(err.message,true)}finally{b.disabled=false}}
document.addEventListener('DOMContentLoaded',()=>rq('#requestForm')?.addEventListener('submit',sendRequest));

// V3.6: casos reales y opiniones verificadas. Carga desacoplada para no afectar solicitudes si esta sección falla.
(function(){
 const l=document.createElement('link');l.rel='stylesheet';l.href='./v36-public-cases.css';document.head.appendChild(l);
 const s=document.createElement('script');s.src='./v36-public-cases.js';s.defer=true;document.head.appendChild(s);
})();

// V3.7: snapshot estructurado sólo cuando el diagnóstico termina convirtiéndose en una solicitud real.
(function(){
 const s=document.createElement('script');s.src='./v37-diagnostic-learning.js';s.defer=true;document.head.appendChild(s);
})();

// V3.8: evidencia histórica visible únicamente cuando existen muestras mínimas suficientes.
(function(){
 const l=document.createElement('link');l.rel='stylesheet';l.href='./v38-diagnostic-evidence.css';document.head.appendChild(l);
 const s=document.createElement('script');s.src='./v38-diagnostic-evidence.js';s.defer=true;document.head.appendChild(s);
})();