(() => {
 'use strict';
 let dialog,log,input,submit,status,previousFocus,history=[],pending=false,controller;
 const make=(tag,text,cls)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el};
 function sourceLink(parent,s){try{const u=new URL(s.url);if(u.protocol!=='https:')return;const a=make('a',s.title||'Abrir fuente','apa-source');a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';parent.append(a)}catch{}}
 function message(text,user=false){const el=make('div',text,'apa-message'+(user?' apa-user':''));log.append(el);log.scrollTop=log.scrollHeight;return el}
 function clear(){if(pending)return;history=[];log.replaceChildren();message('¿Qué necesitás encontrar? Podés consultar por material, aulas, deportes, boleto y otros temas de la página.');input.focus()}
 function renderSources(d){
  const r=d.result;const box=message('');
  const isSchedule=d.topic==='search_schedule';
  box.append(make('p',isSchedule?'Encontré estas referencias para revisar tu cursada o examen. Confirmá que correspondan a tu carrera, comisión y fecha.':'Encontré esta información publicada:'));
  if(r.partial)box.append(make('p','Algunas fuentes no respondieron; la búsqueda puede estar incompleta.','apa-warning'));
  if(isSchedule)box.append(make('p','La publicación enlazada puede contener el aula. No pude confirmar su contenido dentro del documento.','apa-warning'));
  const rows=(r.results||r.matches||r.rows||[]).slice(0,5);
  if(!rows.length)box.append(make('p',(r.sources||[]).length?'Podés abrir la publicación correspondiente abajo.':'No encontré una coincidencia directa. Probá con el nombre de la materia, tu carrera o un tema más específico.'));
  for(const row of rows){const card=make('article','','apa-result');card.append(make('h3',row.title||row.question||row.subject||row.subject_name||'Información del sitio'));
   const text=row.body||row.answer||row.description||[row.career,row.school,row.year&&row.year+'° año',row.event_date,row.day_of_week,row.start_time,row.classroom&&'Aula '+row.classroom,row.campus,row.commission].filter(Boolean).join(' · ');
   card.append(make('p',text));if(row.expired)card.prepend(make('p','Información vencida: consultá la fuente para verificar novedades.','apa-warning'));
   if(row.last_verified_at)card.append(make('small','Última verificación registrada: '+new Date(row.last_verified_at).toLocaleDateString('es-AR')));
   if(row.valid_through)card.append(make('small','Vigencia informada: '+String(row.valid_through).slice(0,10)));
   for(const url of [row.source_url,row.url,row.invite_url])if(url)sourceLink(card,{url,title:row.url?'Abrir carpeta o material':'Ver fuente'});box.append(card);
  }
  const known=new Set(rows.flatMap(row=>[row.source_url,row.url,row.invite_url].filter(Boolean)));
  for(const source of d.sources||[])if(!known.has(source.url)){sourceLink(box,source);known.add(source.url)}
  box.append(make('small','Fuentes consultadas ahora: '+new Date(d.checked_at).toLocaleString('es-AR')+'. La fecha de publicación puede ser anterior.','apa-time'));
 }
 async function send(){const q=input.value.trim();if(!q||pending)return;pending=true;submit.disabled=true;input.value='';history.push({role:'user',content:q});message(q,true);const wait=message('Consultando las fuentes…');controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),120000);
  try{const response=await fetch('/api/assistant',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history.slice(-10)}),signal:controller.signal});const d=await response.json();if(!response.ok)throw Error(d.error||'No pude completar la consulta.');wait.remove();
   if(d.mode==='ai'){status.textContent='Asistente con IA · fuentes del sitio';const box=message(d.answer);for(const s of d.sources||[])sourceLink(box,{...s,title:'['+s.id+'] '+s.title});history.push({role:'assistant',content:d.answer.slice(0,2400)})}
   else{status.textContent='Búsqueda en vivo · conversación con IA pendiente de activación';renderSources(d)}
  }catch(e){wait.textContent=e.name==='AbortError'?'La consulta se interrumpió. Podés volver a intentarlo.':e.message}
  finally{clearTimeout(timeout);pending=false;submit.disabled=false;log.scrollTop=log.scrollHeight;if(dialog.open)input.focus()}
 }
 function init(){
  dialog=make('dialog','','apa-dialog');dialog.setAttribute('aria-labelledby','apa-title');const head=make('header','','apa-head');const title=make('h2','Ayuda para el Alumno');title.id='apa-title';const close=make('button','Cerrar','apa-close');close.type='button';close.onclick=()=>dialog.close();head.append(title,close);
  status=make('p','Consultá la información del sitio','apa-status');log=make('div','','apa-log');log.setAttribute('role','log');log.setAttribute('aria-live','polite');log.setAttribute('aria-relevant','additions text');
  const chips=make('div','','apa-chips');for(const [label,q] of [['Material','Material de Química Orgánica II'],['Aulas','¿En qué aula curso Química Orgánica II?'],['Deportes','¿Qué deportes hay?'],['Boleto','¿Cómo tramito el boleto estudiantil?']]){const b=make('button',label);b.type='button';b.onclick=()=>{input.value=q;input.focus()};chips.append(b)}
  const form=make('form','','apa-form');const label=make('label','Tu consulta');label.htmlFor='apa-query';input=make('input');input.id='apa-query';input.placeholder='Escribí tu consulta…';input.maxLength=1200;input.required=true;input.autocomplete='off';submit=make('button','Consultar');submit.type='submit';form.append(label,input,submit);form.onsubmit=e=>{e.preventDefault();send()};const footer=make('div','','apa-footer');const reset=make('button','Nueva consulta');reset.type='button';reset.onclick=clear;footer.append(reset,make('small','No ingreses DNI ni contraseñas. No somos un canal oficial de la UNO.'));
  dialog.append(head,status,chips,log,form,footer);document.body.append(dialog);dialog.addEventListener('close',()=>{controller?.abort();previousFocus?.focus()});dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()}});clear();
 }
 function open(seed=''){if(!dialog)init();previousFocus=document.activeElement;if(!dialog.open)dialog.showModal();input.value=seed;input.focus();fetch('/api/assistant',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{if(d)status.textContent=d.mode==='ai'?'Asistente con IA · fuentes del sitio':'Búsqueda en vivo · conversación con IA pendiente de activación'}).catch(()=>{});if(seed)send()}
 window.openAlumnoAssistant=open;
 document.addEventListener('click',e=>{if(e.target.closest('[data-open="assistant"]')){e.preventDefault();e.stopImmediatePropagation();open()}},true);
 const launcher=make('button','Preguntale al asistente','apa-launcher');launcher.type='button';launcher.onclick=()=>open();document.body.append(launcher);
})();
