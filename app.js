const SUPA='https://abcuvgoipnwiltlbcqxa.supabase.co';const KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';const H={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};const S={help:[],m:[],g:[],e:[],sources:[],drive:[],kind:'course'};const SITE_ENV=location.hostname.includes('pruebas')?'staging':location.hostname.includes('preview')?'preview':'production';const ANALYTICS_KEYS=new Set(['section','seeded','career','year','school','area','kind']);const track=(name,data={})=>{try{const clean={};for(const [k,v] of Object.entries(data||{})){if(ANALYTICS_KEYS.has(k)&&v!==undefined&&v!==null)clean[k]=typeof v==='string'?v.slice(0,160):v}fetch(SUPA+'/rest/v1/site_analytics_events',{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({event_name:name,event_data:clean,site_env:SITE_ENV}),keepalive:true}).catch(()=>{});if(typeof window.va==='function')window.va('event',{name,data:clean})}catch{}};track('Page View');const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)],esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));async function api(p,o={}){const r=await fetch(SUPA+'/rest/v1/'+p,{...o,headers:H});if(!r.ok)throw Error(await r.text());return r.json()}const rpc=(n,a={})=>api('rpc/'+n,{method:'POST',body:JSON.stringify(a)});function go(id){track('Section View',{section:id});$$('.view').forEach(v=>v.classList.toggle('on',v.id===id));scrollTo({top:0,behavior:'smooth'})}$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));function open(h){$('#modalBody').innerHTML=h;$('#modal').classList.add('on')}function close(){$('#modal').classList.remove('on')}$$('[data-close]').forEach(b=>b.onclick=close);

function helpCard(x){return '<button class="helpCard" data-sec="'+x.section+'"><span class="icon">'+x.icon+'</span><h3>'+esc(x.label)+'</h3><p>'+esc(x.description)+'</p><span class="count">'+x.question_count+' preguntas</span></button>'}function bindHelpCards(root=document){root.querySelectorAll('[data-sec]').forEach(b=>b.onclick=()=>helpCenter(b.dataset.sec))}function renderHelp(q=''){const s=q.toLowerCase().trim(),xs=S.help.filter(x=>!s||[x.label,x.description,x.section,x.group_label].some(v=>String(v||'').toLowerCase().includes(s)));const groups=[...new Map(xs.map(x=>[x.group_key,{key:x.group_key,label:x.group_label,description:x.group_description,order:x.group_sort_order}])).values()].sort((a,b)=>a.order-b.order);$('#helpSections').innerHTML=groups.map(g=>{const items=xs.filter(x=>x.group_key===g.key);return '<section class="helpGroup"><div class="helpGroupHead"><div><h2>'+esc(g.label)+'</h2><p>'+esc(g.description)+'</p></div><span class="badge">'+items.reduce((a,x)=>a+Number(x.question_count),0)+' preguntas</span></div><div class="grid3">'+items.map(helpCard).join('')+'</div></section>'}).join('');bindHelpCards($('#helpSections'))}function renderFeatured(){$('#featuredHelp').innerHTML=S.help.filter(x=>x.featured).slice(0,8).map(helpCard).join('');bindHelpCards($('#featuredHelp'))}function fmtDate(v){if(!v)return'';return new Date(String(v).slice(0,10)+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'short',year:'numeric'})}function answerHtml(a){const art=a.article_number?'<div class="answer"><b>Artículo '+esc(a.article_number)+'</b><br>'+esc(a.article_excerpt||'')+'</div>':'';let badges='';if(a.time_sensitive)badges+=' <span class="badge amber">Información temporal</span>';if(a.valid_through)badges+=' <span class="badge">Vigente hasta '+fmtDate(a.valid_through)+'</span>';return '<div class="answer"><div class="meta">'+badges+'</div><h3>'+esc(a.title||a.question)+'</h3><p>'+esc(a.body||a.answer)+'</p>'+art+(a.source_url?'<a href="'+esc(a.source_url)+'">Ver fuente oficial →</a>':'')+'</div>'}async function helpCenter(sec){track('Help Topic Open',{section:sec});const meta=S.help.find(x=>x.section===sec);open('<span class="ey">Centro de ayuda</span><h2>'+esc(meta?.label||sec)+'</h2><div id="ql"></div>');try{const rows=await rpc('get_help_center',{section_key:sec});$('#ql').innerHTML=rows.map((x,i)=>'<button class="qbtn" data-i="'+i+'">'+esc(x.question)+(x.article_number?' · Art. '+x.article_number:'')+'</button>').join('');$$('.qbtn').forEach(b=>b.onclick=()=>$('#ql').innerHTML=answerHtml({...rows[+b.dataset.i],title:rows[+b.dataset.i].question,body:rows[+b.dataset.i].answer}))}catch{}}async function loadSug(el){try{const x=await rpc('get_assistant_suggestions',{section_key:null,result_limit:8});el.innerHTML=x.map(i=>'<button class="chip">'+esc(i.question)+'</button>').join('');el.querySelectorAll('button').forEach(b=>b.onclick=()=>assistant(b.textContent))}catch{}}async function assistant(seed=''){track('Assistant Open',{seeded:Boolean(seed)});open('<span class="ey">Respuestas con fuente</span><h2>Preguntale a Ayuda para el Alumno</h2><div class="search"><input id="aq" value="'+esc(seed)+'" placeholder="Escribí tu pregunta"><button id="ab" class="btn primary">Preguntar</button></div><div id="asug" class="chips"></div><div id="ares"></div>');$('#ab').onclick=()=>ask($('#aq').value);$('#aq').onkeydown=e=>e.key==='Enter'&&ask($('#aq').value);loadSug($('#asug'));if(seed)ask(seed)}async function ask(q){if(!q.trim())return;track('Assistant Search');$('#ares').innerHTML='<div class="answer">Buscando…</div>';try{const d=await rpc('get_assistant_response',{search_text:q,related_limit:3});if(!d.found){$('#ares').innerHTML='<div class="answer"><h3>No encontramos información para esa consulta</h3><p>Probá con otras palabras o entrá a una categoría.</p></div>';return}$('#ares').innerHTML=answerHtml(d.answer)+(d.related?.length?'<div class="related"><b>También puede servirte</b>'+d.related.map(x=>'<button data-r="'+esc(x.title)+'">'+esc(x.title)+'</button>').join('')+'</div>':'');$$('[data-r]').forEach(b=>b.onclick=()=>ask(b.dataset.r))}catch{}}$$('[data-open="assistant"]').forEach(b=>b.onclick=()=>assistant());const UPLOAD_MAX=25*1024*1024,UPLOAD_ACCEPT='.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.ppt,.pptx,.xls,.xlsx';
function uploadError(payload,fallback){return payload&&typeof payload==='object'&&typeof payload.error==='string'?payload.error:fallback}
function subjectOptionLabel(x){const y=x.study_years?.year_number,c=x.study_years?.study_plans?.careers?.name||'Otras materias';return {career:c,label:(y?y+'° · ':'')+x.name}}
async function loadContributionOptions(){
  const subject=$('#contributeSubject'),type=$('#contributeType');
  if(!subject||!type)return;
  try{
    const [subjects,types]=await Promise.all([
      api('subjects?select=id,name,study_years(year_number,study_plans(careers(name,schools(name))))&active=eq.true'),
      api('material_types?select=id,key,name,sort_order&active=eq.true&order=sort_order.asc')
    ]);
    const groups=new Map();
    subjects.map(x=>({...x,_label:subjectOptionLabel(x)})).sort((a,b)=>(a._label.career+' '+a._label.label).localeCompare(b._label.career+' '+b._label.label,'es-AR')).forEach(x=>{if(!groups.has(x._label.career))groups.set(x._label.career,[]);groups.get(x._label.career).push(x)});
    subject.innerHTML='<option value="">Seleccioná una materia</option>'+[...groups.entries()].map(([career,items])=>'<optgroup label="'+esc(career)+'">'+items.map(x=>'<option value="'+esc(x.id)+'">'+esc(x._label.label)+'</option>').join('')+'</optgroup>').join('');
    type.innerHTML='<option value="">Otro / no estoy seguro</option>'+types.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+'</option>').join('');
  }catch(e){
    subject.innerHTML='<option value="">No pudimos cargar las materias</option>';
    const msg=$('#contributeStatus');if(msg){msg.className='formStatus error';msg.textContent='No pudimos cargar las opciones. Cerrá y volvé a intentar.'}
  }
}
async function submitContribution(form){
  const status=$('#contributeStatus'),submit=$('#contributeSubmit'),file=form.elements.file?.files?.[0];
  if(status){status.className='formStatus';status.textContent=''}
  if(!file){if(status){status.className='formStatus error';status.textContent='Elegí un archivo para enviar.'}return}
  if(file.size>UPLOAD_MAX){if(status){status.className='formStatus error';status.textContent='El archivo supera el máximo de 25 MB.'}return}
  track('Contribution Submit');
  if(submit){submit.disabled=true;submit.textContent='Enviando…'}
  try{
    const data=new FormData(form);
    const response=await fetch(SUPA+'/functions/v1/student-upload',{method:'POST',headers:{apikey:KEY},body:data});
    const payload=await response.json().catch(()=>null);
    if(!response.ok)throw Error(uploadError(payload,'No pudimos enviar el material.'));
    form.reset();
    if(status){status.className='formStatus success';status.innerHTML='<b>¡Aporte recibido!</b><span>Quedó privado y pendiente de revisión. Cuando sea aprobado podrá publicarse para otros estudiantes.</span>'}
    if(submit){submit.textContent='Enviado ✓'}
  }catch(e){
    if(status){status.className='formStatus error';status.textContent=e?.message||'No pudimos enviar el material.'}
    if(submit){submit.disabled=false;submit.textContent='Enviar para revisión'}
  }
}
function contribute(){
  track('Contribution Form Open');
  open('<span class="ey">Aportes de estudiantes</span><h2>Compartí material con otros alumnos</h2><p class="formIntro">No necesitás crear una cuenta. El archivo queda privado hasta que lo revisemos.</p><form id="contributeForm" class="contributeForm"><label>Materia <span>*</span><select id="contributeSubject" name="subject_id" required><option value="">Cargando materias…</option></select></label><div class="formRow"><label>Tipo de material<select id="contributeType" name="material_type_id"><option value="">Cargando…</option></select></label><label>Año del material<input name="academic_year" inputmode="numeric" pattern="20[0-9]{2}" maxlength="4" placeholder="Ej.: 2026"></label></div><label>Título <span>*</span><input name="title" required maxlength="180" placeholder="Ej.: 1° parcial resuelto"></label><label>Descripción<textarea name="description" maxlength="2000" rows="3" placeholder="Opcional: comisión, docente, temas incluidos, etc."></textarea></label><label class="filePicker">Archivo <span>*</span><input name="file" type="file" accept="'+UPLOAD_ACCEPT+'" required><small>PDF, imagen u Office · máximo 25 MB.</small></label><div class="formRow"><label>Tu nombre<input name="submitter_name" maxlength="100" placeholder="Opcional"></label><label>Tu correo<input name="submitter_email" type="email" maxlength="254" placeholder="Opcional"></label></div><input class="honeypot" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><label class="consentLine"><input name="consent_to_publish" type="checkbox" value="true" checked required><span>Autorizo a Ayuda para el Alumno a publicar este archivo si supera la revisión.</span></label><div class="moderationNote"><b>No se publica automáticamente.</b><span>Evitá subir datos personales, material confidencial o contenido que no tengas permiso de compartir. No subas libros comerciales completos protegidos por derechos de autor.</span></div><div id="contributeStatus" class="formStatus" role="status"></div><div class="formActions"><button type="button" class="btn secondary" id="contributeCancel">Cancelar</button><button type="submit" class="btn primary" id="contributeSubmit">Enviar para revisión</button></div></form>');
  $('#contributeCancel').onclick=close;
  $('#contributeForm').onsubmit=e=>{e.preventDefault();submitContribution(e.currentTarget)};
  loadContributionOptions();
}
$$('[data-open="contribute"]').forEach(b=>b.onclick=contribute);$('#globalSearchBtn').onclick=()=>assistant($('#globalSearch').value);$('#globalSearch').onkeydown=e=>e.key==='Enter'&&assistant($('#globalSearch').value);$('#helpSearch').oninput=e=>renderHelp(e.target.value);

function mat(q=''){q=q.toLowerCase();$('#materials').innerHTML=S.m.filter(x=>!q||[x.title,x.description,x.subjects?.name].some(v=>String(v||'').toLowerCase().includes(q))).map(x=>'<article class="item"><div class="meta">'+(x.academic_year?'<span class="badge">'+x.academic_year+'</span>':'')+'</div><h3>'+esc(x.title)+'</h3><p>'+esc(x.subjects?.name||x.description||'')+'</p>'+(x.storage_url?'<a href="'+esc(x.storage_url)+'">Descargar / abrir material →</a>':'')+'</article>').join('')||'<div class="notice">No encontramos material con ese criterio.</div>'}$('#matSearch').oninput=e=>mat(e.target.value);$('#matFocus').onclick=()=>$('#matSearch').focus();
function driveFlat(){const out=[];for(const sc of S.drive)for(const c of sc.careers||[])for(const y of c.years||[])for(const s of y.subjects||[])out.push({school:sc.name,schoolSlug:sc.slug,career:c.name,careerSlug:c.slug,year:y.year,name:s.name,url:s.folder_url,indexed:s.indexed_files||0,published:s.published_materials||0});return out}
function populateDriveFilters(){const ss=$('#schoolSelect'),cs=$('#careerSelect'),ys=$('#yearSelect');ss.innerHTML='<option value="">Todas las Escuelas</option>'+S.drive.map(s=>'<option value="'+esc(s.slug)+'">'+esc(s.name)+'</option>').join('');refreshCareerOptions();ss.onchange=()=>{refreshCareerOptions();renderDrive()};cs.onchange=()=>{refreshYearOptions();renderDrive()};ys.onchange=renderDrive;$('#subjectSearch').oninput=renderDrive}
function refreshCareerOptions(){const school=$('#schoolSelect').value,cs=$('#careerSelect');const careers=S.drive.filter(s=>!school||s.slug===school).flatMap(s=>s.careers||[]);cs.innerHTML='<option value="">Todas las carreras</option>'+careers.map(c=>'<option value="'+esc(c.slug)+'">'+esc(c.name)+'</option>').join('');refreshYearOptions()}
function refreshYearOptions(){const career=$('#careerSelect').value,school=$('#schoolSelect').value;const years=[...new Set(driveFlat().filter(x=>(!school||x.schoolSlug===school)&&(!career||x.careerSlug===career)).map(x=>x.year))].sort((a,b)=>a-b);$('#yearSelect').innerHTML='<option value="">Todos los años</option>'+years.map(y=>'<option value="'+y+'">'+y+'° año</option>').join('')}
function renderDrive(){const school=$('#schoolSelect').value,career=$('#careerSelect').value,year=$('#yearSelect').value,q=$('#subjectSearch').value.toLowerCase().trim();let xs=driveFlat().filter(x=>(!school||x.schoolSlug===school)&&(!career||x.careerSlug===career)&&(!year||String(x.year)===year)&&(!q||x.name.toLowerCase().includes(q)));$('#driveCount').textContent=xs.length+' materias';$('#driveSubjects').innerHTML=xs.slice(0,180).map(x=>'<article class="subjectCard"><div class="subjectMeta"><span class="badge blue">'+esc(x.career)+'</span><span class="badge">'+x.year+'° año</span>'+(x.indexed?'<span class="badge green">'+x.indexed+' archivos</span>':'')+'</div><h3>'+esc(x.name)+'</h3><p>'+esc(x.school)+'</p><div class="subjectActions"><button data-material="'+encodeURIComponent(JSON.stringify(x))+'">Ver material</button><a href="'+esc(x.url)+'">Abrir Drive</a></div></article>').join('')||'<div class="notice">No encontramos una materia con esos filtros.</div>';$$('[data-material]').forEach(b=>b.onclick=()=>{try{openSubjectMaterials(JSON.parse(decodeURIComponent(b.dataset.material)))}catch{}})}
function formatSize(n){if(!n)return'';const u=['B','KB','MB','GB'];let i=0,v=Number(n);while(v>=1024&&i<u.length-1){v/=1024;i++}return v.toFixed(i?1:0)+' '+u[i]}
async function openSubjectMaterials(x){track('Material Subject Open',{career:x.careerSlug||'',year:String(x.year||'')});open('<span class="ey">'+esc(x.career)+' · '+x.year+'° año</span><h2>'+esc(x.name)+'</h2><div id="subjectMaterialBody"><div class="answer">Cargando material…</div></div>');try{const d=await rpc('get_drive_subject_materials',{career_filter:x.careerSlug,year_filter:x.year,subject_filter:x.name});let groups='';for(const c of d.categories||[]){if(!(c.files||[]).length)continue;groups+='<section class="materialGroup"><h3>'+esc(c.name)+'</h3><div class="fileList">'+c.files.map(f=>'<a class="fileRow" href="'+esc(f.url)+'"><span><b>'+esc(f.title)+'</b><br><small>'+esc(f.mime_type||'Archivo')+(f.file_size_bytes?' · '+formatSize(f.file_size_bytes):'')+'</small></span><strong>Abrir →</strong></a>').join('')+'</div></section>'}const legacy=(d.published_materials||[]);if(legacy.length){groups+='<section class="materialGroup"><h3>Material publicado</h3><div class="fileList">'+legacy.map(f=>'<a class="fileRow" href="'+esc(f.url)+'"><span><b>'+esc(f.title)+'</b><br><small>'+esc(f.material_type_key||'material')+(f.file_size_bytes?' · '+formatSize(f.file_size_bytes):'')+'</small></span><strong>Abrir →</strong></a>').join('')+'</div></section>'}$('#subjectMaterialBody').innerHTML=groups||'<div class="notice"><b>Todavía no hay archivos indexados en esta materia.</b><p>Podés abrir la carpeta de Drive para revisar el contenido disponible.</p><a class="btn secondary" href="'+esc(x.url)+'">Abrir carpeta →</a></div>'}catch{$('#subjectMaterialBody').innerHTML='<div class="notice">No pude cargar el material en este momento.</div>'}}

const COMMUNITY_META={
'ce2cc521-3461-4515-8f1f-73bf59191131':{school:'general',area:'general',title:'Comunidad de Ayuda Para El Alumno',desc:'Comunidad general del proyecto para estudiantes de la UNO.'},
'0e804ec6-8a7d-4711-808f-433a8317855b':{school:'salud',area:'ingresantes',title:'Ingresantes Salud 2026',desc:'Comunidad para ingresantes de la Escuela de Ciencias de la Salud.'},
'eb56892c-e90d-44b6-8f63-21b7833e6bb2':{school:'salud',area:'enfermeria',title:'Lic. en Enfermería — Regulares',desc:'Comunidad de estudiantes regulares de Licenciatura en Enfermería.'},
'630e9c52-4e81-4f6f-995c-b8c4283d75e9':{school:'tecnologicas',area:'ingresantes',title:'Ingresantes Tecnológicas 2026',desc:'Comunidad para ingresantes de la Escuela de Ciencias Tecnológicas.'},
'bbbe49dc-9342-4015-9e5d-7ebb28f36af8':{omit:true},
'912f7083-c13d-4a4c-8872-d9aba584c388':{school:'salud',area:'materias',title:'Análisis y Producción del Discurso — Salud',desc:'Grupo vinculado a la materia para estudiantes de Salud.'},
'e4e9e709-412c-4b32-8e3c-e408a7351627':{school:'juridicas',area:'abogacia',title:'Abogacía — 2.º Cuatrimestre 2026',desc:'Comunidad de Abogacía correspondiente al segundo cuatrimestre 2026.'},
'7ced76a6-9ded-4887-a1cf-32c7a107c17c':{school:'salud',area:'odontologia',title:'Escuela de Salud — Odontología',desc:'Comunidad general de estudiantes de Odontología.'},
'af629e7f-35a8-40a9-a702-afebba512d3a':{school:'salud',area:'ingresantes',title:'Escuela de Salud — Ingresantes 2025',desc:'Comunidad para ingresantes 2025 de la Escuela de Ciencias de la Salud.'},
'622e19b0-c473-423b-bfe1-e0964780b66c':{omit:true},
'15bc6a7f-6497-4d51-9c93-bfa068b61b1f':{school:'tecnologicas',area:'informatica',title:'Escuela de Informática',desc:'Comunidad vinculada a estudiantes de Informática.'},
'0752537d-4172-4243-8a5b-3d97f265f0b7':{school:'tecnologicas',area:'ingenieria',title:'Escuela de Ingeniería',desc:'Comunidad vinculada a estudiantes de Ingeniería.'},
'e7bbb659-65be-4cd2-8a1a-265ffe46f2b7':{omit:true},
'79d34f60-88b5-4efd-acde-84b8d115a7b4':{school:'general',area:'articulo7',title:'Artículo 7 — 2026',desc:'Comunidad vinculada al ingreso por Artículo 7.'},
'519a894f-8d86-4775-99df-77858aa6ed6b':{school:'tecnologicas',area:'informatica',title:'Todas las Comisiones — UNO Informática',desc:'Acceso general a comisiones de Informática.'},
'c56219f6-ae83-4821-ab75-23222ab1d195':{omit:true},
'aeee6581-07a0-42e8-9478-3fe500c01794':{school:'juridicas',area:'ingresantes',title:'Jurídicas — Ingresantes 2026',desc:'Comunidad para ingresantes 2026 de Ciencias Jurídicas, Políticas y Sociales.'},
'4267d449-5d96-486d-afcb-95a0bb3ba5b4':{omit:true},
'77f45f42-0900-4f2f-b598-c64d1ca31bb6':{omit:true},
'8d9dde90-f64a-4812-9855-b0288b09a2d7':{school:'administracion',area:'ingresantes',title:'Administración — Ingresantes 2026',desc:'Comunidad para ingresantes 2026 de la Escuela de Administración.'},
'cdd334cf-32c3-4cb3-8085-427acef798e4':{omit:true},
'51cb4bb0-a41f-4574-a2d7-1959865d950b':{omit:true},
'da970721-5361-40f4-bfcf-b48892793dee':{omit:true},
'304cae41-7fc2-4fa1-9955-255a1456d27f':{school:'recreacion',area:'videojuegos',title:'GAME OVER',desc:'Comunidad de estudiantes para jugar videojuegos con compañeros, de manera online o presencial.'},
'24c10c88-fda8-421b-8e97-816afc3584b0':{omit:true},
'2fbf7da5-9b47-446f-b40c-6362abcf7e54':{school:'salud',area:'odontologia',title:'Links materias de 2.º — Odontología',desc:'Acceso a grupos de materias de segundo año de Odontología.'},
'aa230f67-0a1b-4ce0-8530-b96d0a75cdf6':{school:'salud',area:'odontologia',title:'Links materias de 1.º — Odontología',desc:'Acceso a grupos de materias de primer año de Odontología.'},
'3b137fa7-c379-40b3-9424-f4c20810a12a':{school:'tecnologicas',area:'ingenieria',title:'Escuela de Ingeniería — Grupos de Materias',desc:'Acceso a comunidades y grupos de materias de Ingeniería.'}
};
const COMMUNITY_SCHOOLS=[
 {key:'salud',icon:'🩺',label:'Escuela de Ciencias de la Salud',short:'Salud'},
 {key:'tecnologicas',icon:'💻',label:'Escuela de Ciencias Tecnológicas',short:'Tecnológicas'},
 {key:'juridicas',icon:'⚖️',label:'Escuela de Ciencias Jurídicas, Políticas y Sociales',short:'Jurídicas'},
 {key:'administracion',icon:'📊',label:'Escuela de Administración',short:'Administración'},
 {key:'general',icon:'🎓',label:'General UNO',short:'General UNO'},
 {key:'recreacion',icon:'🎮',label:'Comunidad y recreación',short:'Recreación'}
];
const COMMUNITY_AREAS={
 salud:[['ingresantes','Ingresantes'],['enfermeria','Enfermería'],['odontologia','Odontología'],['materias','Materias de Salud']],
 tecnologicas:[['ingresantes','Ingresantes'],['informatica','Informática'],['ingenieria','Ingeniería']],
 juridicas:[['ingresantes','Ingresantes'],['abogacia','Abogacía']],
 administracion:[['ingresantes','Ingresantes']],
 general:[['general','Ayuda Para El Alumno'],['articulo7','Artículo 7']],
 recreacion:[['videojuegos','Videojuegos']]
};
let groupSchool='',groupArea='';
function communityItems(){
 const base=S.g.map(x=>({...x,...(COMMUNITY_META[x.id]||{omit:true})})).filter(x=>!x.omit);
 base.push({id:'enfermeria-linkbio',school:'salud',area:'enfermeria',title:'Comunidades de materias de Enfermería',desc:'Acceso general a los grupos de materias de Enfermería organizados por año y cuatrimestre.',invite_url:'https://linkbio.co/GruposMateriasEnfermeria',external:true});
 return base
}
function renderCommunityMenus(){
 const all=communityItems();
 $('#groupSchoolMenu').innerHTML=COMMUNITY_SCHOOLS.map(s=>{
   const n=all.filter(x=>x.school===s.key).length;
   return '<button class="communitySchool '+(groupSchool===s.key?'active':'')+'" data-school="'+s.key+'"><span class="schoolIcon">'+s.icon+'</span><span><b>'+esc(s.label)+'</b><small>'+n+' '+(n===1?'acceso':'accesos')+'</small></span><strong>Ver →</strong></button>'
 }).join('');
 $$('.communitySchool').forEach(b=>b.onclick=()=>{groupSchool=b.dataset.school;groupArea='';track('Community School Filter',{school:groupSchool});renderCommunityMenus();groups($('#groupSearch').value)});
 const wrap=$('#groupAreaWrap'),menu=$('#groupAreaMenu'),areas=COMMUNITY_AREAS[groupSchool]||[];
 if(!groupSchool||areas.length<2){wrap.hidden=true;menu.innerHTML=''}else{
   wrap.hidden=false;menu.innerHTML='<button class="communityArea '+(!groupArea?'active':'')+'" data-area="">Todos</button>'+areas.map(([k,l])=>'<button class="communityArea '+(groupArea===k?'active':'')+'" data-area="'+k+'">'+esc(l)+'</button>').join('');
   $$('.communityArea').forEach(b=>b.onclick=()=>{groupArea=b.dataset.area;track('Community Area Filter',{school:groupSchool,area:groupArea||'all'});renderCommunityMenus();groups($('#groupSearch').value)})
 }
}
function groups(q=''){
 q=q.toLowerCase().trim();
 const all=communityItems();
 let xs=all.filter(x=>(!groupSchool||x.school===groupSchool)&&(!groupArea||x.area===groupArea));
 if(q)xs=all.filter(x=>[x.title,x.desc,(COMMUNITY_SCHOOLS.find(s=>s.key===x.school)||{}).label].some(v=>String(v||'').toLowerCase().includes(q)));
 const guide=$('#groupGuide');
 guide.style.display=(!groupSchool&&!q)?'flex':'none';
 $('#groupCount').textContent=all.length+' accesos organizados';
 $('#groups').innerHTML=(!groupSchool&&!q)?'':xs.map(x=>{
   const sc=COMMUNITY_SCHOOLS.find(s=>s.key===x.school);
   return '<article class="item communityCard"><div class="meta"><span class="badge '+(x.school==='recreacion'?'amber':'green')+'">'+esc(sc?.short||'Comunidad')+'</span>'+(x.external?'<span class="badge blue">Acceso general</span>':'')+'</div><h3>'+esc(x.title)+'</h3><p>'+esc(x.desc||'Comunidad estudiantil')+'</p><a href="'+esc(x.invite_url)+'" target="_blank" rel="noopener">'+(x.external?'Ver comunidades →':'Unirme por WhatsApp →')+'</a></article>'
 }).join('')||'<div class="notice communityEmpty"><b>No encontramos grupos con ese filtro.</b><p>Probá otra Escuela, categoría o término de búsqueda.</p></div>'
}
$('#groupSearch').oninput=e=>groups(e.target.value);function events(){const fmt=d=>d?new Date(d+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'short',year:'numeric'}):'';$('#events').innerHTML=S.e.map(x=>'<article class="event"><div class="date">'+fmt(x.start_date)+'</div><div><b>'+esc(x.title)+'</b><p>'+esc(x.description||'')+'</p></div></article>').join('');$('#homeEvents').innerHTML=S.e.filter(x=>!x.end_date||x.end_date>='2026-09-04').slice(0,3).map(x=>'<article class="event"><div class="date">'+fmt(x.start_date)+'</div><div><b>'+esc(x.title)+'</b></div></article>').join('')}
document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a');
  if(!a)return;
  const href=a.getAttribute('href')||'';
  if(href.includes('chat.whatsapp.com')||href.includes('linkbio.co/GruposMateriasEnfermeria')){
    track('Community Link Open',{kind:href.includes('linkbio.co')?'hub':'whatsapp'});
  }else if(a.classList.contains('fileRow')||a.closest('#materials')){
    track('Material Link Open');
  }
});
function setKind(kind){S.kind=kind;$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.kind===kind));renderSources();$('#scheduleResults').innerHTML=''}$$('.tab').forEach(b=>b.onclick=()=>setKind(b.dataset.kind));$$('[data-open-schedule]').forEach(b=>b.onclick=()=>{go('aulas');setKind(b.dataset.openSchedule)});function bindSourceButtons(){$$('.openSource').forEach(b=>b.onclick=()=>{const u=b.dataset.url;if(u)window.location.assign(u)})}function renderSources(){const xs=S.sources.filter(x=>x.schedule_kind===S.kind);$('#sourceTitle').textContent=S.kind==='course'?'Materias · 2º cuatrimestre 2026':'Exámenes finales · última publicación oficial disponible: julio 2026';$('#sourceText').textContent=S.kind==='course'?'Elegí tu Escuela/carrera para abrir aulas, días, horarios y modalidad.':'La próxima publicación general está prevista para el 7 de diciembre de 2026. Mientras tanto podés consultar la última publicación oficial disponible y verificar novedades en la página de la UNO.';$('#officialGeneral').href=S.kind==='course'?'https://www.uno.edu.ar/estudiantes-uno/materias.html':'https://www.uno.edu.ar/estudiantes-uno/examenes.html';$('#scheduleSources').innerHTML=xs.map(x=>'<article class="sourceCard"><div class="meta"><span class="badge blue">'+(S.kind==='course'?'Materias':'Finales')+'</span><span class="badge">'+x.academic_year+'</span></div><h3>'+esc(x.career_label||x.school_label)+'</h3><p>'+esc(x.school_label)+'</p><div class="sourceActions"><button class="openSource" data-url="'+esc(x.source_url)+'">Abrir publicación oficial</button><a href="'+esc(x.source_page_url)+'">Ver en la página de la UNO →</a></div></article>').join('');bindSourceButtons()}async function schedule(){const q=$('#scheduleSearch').value.trim();if(!q)return;track('Schedule Search',{kind:S.kind});$('#scheduleResults').innerHTML='<div class="notice">Buscando…</div>';try{const rows=await rpc('search_academic_schedule',{search_text:q,schedule_kind:S.kind,result_limit:20});if(rows.length){$('#scheduleResults').innerHTML='<div class="grid3">'+rows.map(x=>'<article class="scheduleCard"><span class="badge blue">'+(x.kind==='final'?'Examen final':'Cursada')+'</span><h3>'+esc(x.subject_name)+'</h3><p>'+esc([x.event_date,x.day_of_week,x.start_time&&x.start_time.slice(0,5),x.end_time&&x.end_time.slice(0,5),x.classroom,x.campus,x.commission,x.modality].filter(Boolean).join(' · '))+'</p>'+(x.source_url?'<a href="'+esc(x.source_url)+'">Fuente →</a>':'')+'</article>').join('')+'</div>';return}const r=await rpc('resolve_academic_schedule_source',{search_text:q,schedule_kind_filter:S.kind});if(r.length){const x=r[0];$('#scheduleResults').innerHTML='<div class="notice"><b>Encontramos la publicación correspondiente</b><p><strong>'+esc(x.subject_name)+'</strong> · '+esc(x.career_name)+(x.study_year?' · '+x.study_year+'º año':'')+'.</p><button class="btn primary openResolved" data-url="'+esc(x.source_url)+'">Abrir publicación oficial</button> <a class="btn secondary" href="'+esc(x.source_page_url)+'">Ver página de la UNO</a></div>';$('.openResolved').onclick=()=>window.location.assign($('.openResolved').dataset.url);return}$('#scheduleResults').innerHTML='<div class="notice"><b>No encontramos esa materia en la consulta rápida.</b><p>Elegí tu Escuela/carrera en las publicaciones oficiales que aparecen abajo.</p></div>'}catch{$('#scheduleResults').innerHTML='<div class="notice">No pude consultar el buscador en este momento.</div>'}}$('#scheduleBtn').onclick=schedule;$('#scheduleSearch').onkeydown=e=>e.key==='Enter'&&schedule();

async function load(){try{const [help,m,g,e,sources,drive]=await Promise.all([rpc('get_help_sections_v2'),api('materials?select=id,title,description,academic_year,storage_url,subjects(name)&status=eq.published&visibility=eq.public&limit=350'),api('whatsapp_communities?select=id,title,invite_url,verified,notes&active=eq.true'),api('student_events?select=*&published=eq.true&order=start_date.asc'),rpc('get_academic_schedule_sources',{kind_filter:'all'}),rpc('get_drive_material_hierarchy')]);S.help=help;S.m=m;S.g=g;S.e=e;S.sources=sources;S.drive=drive;renderFeatured();renderHelp();mat();renderCommunityMenus();groups();events();renderSources();populateDriveFilters();renderDrive();loadSug($('#heroSug'))}catch(e){console.error(e)}}load();