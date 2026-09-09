const SUPA='https://abcuvgoipnwiltlbcqxa.supabase.co';
const KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';
const ADMIN_EMAIL='ayudaparaelalumnouno@gmail.com';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmtDate=v=>v?new Date(v).toLocaleString('es-AR',{dateStyle:'short',timeStyle:'short'}):'—';
const fmtSize=n=>{if(!n)return'—';const u=['B','KB','MB','GB'];let i=0,v=Number(n);while(v>=1024&&i<u.length-1){v/=1024;i++}return v.toFixed(i?1:0)+' '+u[i]};
let auth=null,materials=[],stories=[];
function authMsg(t,e=false){$('#authMsg').innerHTML=t?'<div class="msg '+(e?'error':'')+'">'+esc(t)+'</div>':''}
function saveAuth(x){auth=x;sessionStorage.setItem('afa_admin_auth',JSON.stringify(x))}
function loadAuth(){try{return JSON.parse(sessionStorage.getItem('afa_admin_auth')||'null')}catch{return null}}
function clearAuth(){auth=null;sessionStorage.removeItem('afa_admin_auth')}
async function login(){
  const password=$('#password').value;if(!password)return authMsg('Ingresá tu contraseña.',true);
  const r=await fetch(SUPA+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email:ADMIN_EMAIL,password})});
  const p=await r.json().catch(()=>null);if(!r.ok)return authMsg(p?.msg||p?.error_description||'No se pudo iniciar sesión.',true);
  saveAuth(p);$('#password').value='';await boot();
}
async function refreshToken(){
  if(!auth?.refresh_token)throw Error('La sesión venció.');
  const r=await fetch(SUPA+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:auth.refresh_token})});
  const p=await r.json().catch(()=>null);if(!r.ok)throw Error('La sesión venció.');saveAuth(p);return p;
}
async function authedFetch(url,opt={},retry=true){
  if(!auth?.access_token)throw Error('La sesión venció.');
  const headers={apikey:KEY,Authorization:'Bearer '+auth.access_token,'Content-Type':'application/json',...(opt.headers||{})};
  let r=await fetch(url,{...opt,headers});
  if(r.status===401&&retry){await refreshToken();return authedFetch(url,opt,false)}
  return r;
}
async function rpc(name,body){
  const r=await authedFetch(SUPA+'/rest/v1/rpc/'+name,{method:'POST',body:JSON.stringify(body||{})});
  const p=await r.json().catch(()=>null);if(!r.ok)throw Error(p?.message||p?.error||'No se pudo completar la operación.');return p;
}
async function edge(name,body){
  const r=await authedFetch(SUPA+'/functions/v1/'+name,{method:'POST',body:JSON.stringify(body||{})});
  const p=await r.json().catch(()=>null);if(!r.ok)throw Error(p?.error||p?.message||'No se pudo completar la operación.');return p;
}
async function verifyStaff(){
  await rpc('get_mental_health_moderation_queue',{status_filter:'pending',result_limit:1});
}
async function boot(){
  auth=loadAuth();
  if(!auth){$('#loginCard').classList.remove('hidden');$('#panel').classList.add('hidden');return}
  try{
    await verifyStaff();
    $('#loginCard').classList.add('hidden');$('#panel').classList.remove('hidden');authMsg('');
    await Promise.all([loadMaterials(),loadStories()]);
  }catch(e){clearAuth();$('#loginCard').classList.remove('hidden');$('#panel').classList.add('hidden');authMsg(e.message||'La cuenta no tiene permisos.',true)}
}
function statHtml(vals){return vals.map(([k,v])=>'<div class="stat"><b>'+v+'</b><span>'+k+'</span></div>').join('')}
function switchTab(name){
  $$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
  $('#materialsTab').classList.toggle('hidden',name!=='materials');
  $('#storiesTab').classList.toggle('hidden',name!=='stories');
}
$$('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));

async function loadMaterials(){
  const p=await edge('student-moderation',{action:'list',statuses:['pending','approved','rejected','published']});
  materials=p.items||[];
  const c={pending:0,approved:0,rejected:0,published:0};materials.forEach(x=>c[x.status]=(c[x.status]||0)+1);
  $('#matPendingBadge').textContent=c.pending;$('#materialOverview').innerHTML=statHtml([['Pendientes',c.pending],['Aprobados',c.approved],['Rechazados',c.rejected],['Publicados',c.published]]);
  renderMaterials();
}
function materialMeta(x){const s=x.subjects||{},y=s.study_years?.year_number,c=s.study_years?.study_plans?.careers?.name,school=s.study_years?.study_plans?.careers?.schools?.name;return[school,c,y?y+'º año':null,s.name].filter(Boolean)}
function materialCard(x){
  const preview=x.preview_url?'<a class="file" target="_blank" rel="noopener" href="'+esc(x.preview_url)+'">Previsualizar archivo ↗</a>':'<span class="badge">Sin vista previa</span>';
  const submitter=[x.submitter_name,x.submitter_email].filter(Boolean).join(' · ')||'Anónimo';
  const core=x.status==='pending'?'<button class="primary" data-mapprove="'+x.id+'">Aprobar</button><button class="danger" data-mreject="'+x.id+'">Rechazar</button>':x.status==='approved'?'<button class="primary" data-mpublish="'+x.id+'">Publicar</button><button class="danger" data-mreject="'+x.id+'">Rechazar</button>':'';
  return '<article class="item" id="m-'+x.id+'"><div class="itemTop"><div><div class="badges"><span class="badge '+esc(x.status)+'">'+esc(x.status)+'</span></div><h3>'+esc(x.title)+'</h3><p>'+esc(materialMeta(x).join(' · '))+'</p></div>'+preview+'</div><div class="details"><div><b>Archivo</b><span>'+esc(x.original_filename||'—')+' · '+fmtSize(x.file_size_bytes)+'</span></div><div><b>Enviado</b><span>'+fmtDate(x.created_at)+'</span></div><div><b>Alumno</b><span>'+esc(submitter)+'</span></div><div><b>Descripción</b><span>'+esc(x.description||'Sin descripción')+'</span></div></div><label class="notesLabel">Notas internas<textarea class="notes" rows="2" placeholder="Opcional"></textarea></label><div class="itemActions">'+core+'<button class="deleteBtn" data-mdelete="'+x.id+'">Eliminar definitivamente</button></div></article>';
}
function renderMaterials(){
  const st=$('#materialStatus').value,items=st==='all'?materials:materials.filter(x=>x.status===st);
  $('#materialQueue').innerHTML=items.length?'<div class="queue">'+items.map(materialCard).join('')+'</div>':'<div class="empty">No hay aportes en esta categoría.</div>';
  $$('[data-mapprove]').forEach(b=>b.onclick=()=>materialAction(b.dataset.mapprove,'approve'));
  $$('[data-mreject]').forEach(b=>b.onclick=()=>materialReject(b.dataset.mreject));
  $$('[data-mpublish]').forEach(b=>b.onclick=()=>materialPublish(b.dataset.mpublish));
  $$('[data-mdelete]').forEach(b=>b.onclick=()=>materialDelete(b.dataset.mdelete));
}
function materialNotes(id){return $('#m-'+id)?.querySelector('.notes')?.value.trim()||null}
async function busy(root,fn){root?.classList.add('busy');try{await fn()}finally{root?.classList.remove('busy')}}
async function materialAction(id,action){await busy($('#m-'+id),async()=>{try{await edge('student-moderation',{action,submission_id:id,notes:materialNotes(id)});await loadMaterials()}catch(e){alert(e.message) }})}
async function materialReject(id){const reason=prompt('Indicá el motivo del rechazo:');if(!reason?.trim())return;await busy($('#m-'+id),async()=>{try{await edge('student-moderation',{action:'reject',submission_id:id,reason:reason.trim(),notes:materialNotes(id)});await loadMaterials()}catch(e){alert(e.message)}})}
async function materialPublish(id){if(!confirm('¿Publicar este aporte? El archivo pasará a ser público en Material.'))return;await materialAction(id,'publish')}
async function materialDelete(id){const x=materials.find(i=>i.id===id);if(!x||!confirm('¿Eliminar definitivamente este aporte y sus archivos?'))return;await busy($('#m-'+id),async()=>{try{await edge('student-moderation-delete',{submission_id:id,confirm_title:x.title});await loadMaterials()}catch(e){alert(e.message)}})}

async function loadStories(){
  const p=await rpc('get_mental_health_moderation_queue',{status_filter:'all',result_limit:200});
  stories=Array.isArray(p)?p:[];
  const c={pending:0,published:0,private:0,rejected:0};stories.forEach(x=>c[x.status]=(c[x.status]||0)+1);
  $('#storyPendingBadge').textContent=c.pending;$('#storyOverview').innerHTML=statHtml([['Pendientes',c.pending],['Publicados',c.published],['Privados',c.private],['Rechazados',c.rejected]]);
  renderStories();
}
function storyCard(x){
  const pending=x.status==='pending';
  const consent=x.publish_consent===true;
  const original=x.story_text?'<div class="storyOriginal">'+esc(x.story_text)+'</div>':'';
  const published=x.published_text?'<div class="privateInfo"><b>Versión publicada:</b><br>'+esc(x.published_text)+'</div>':'';
  let editor='',actions='';
  if(pending&&consent){
    editor='<label class="publishLabel">Versión que se publicará en el muro<textarea class="pubText" maxlength="6000">'+esc(x.story_text||'')+'</textarea><small>Podés quitar detalles identificatorios antes de publicar.</small></label>';
    actions='<button class="mentalBtn" data-spublish="'+x.story_id+'">Publicar en el muro</button><button class="softBtn" data-sprivate="'+x.story_id+'">Dejar privado</button><button class="danger" data-sreject="'+x.story_id+'">Rechazar</button>';
  }else if(pending){
    actions='<button class="softBtn" data-sprivate="'+x.story_id+'">Marcar como privado</button><button class="danger" data-sreject="'+x.story_id+'">Rechazar</button>';
  }
  const consentBadge=consent?'<span class="badge consent">Autorizó publicación</span>':'<span class="badge private">No autorizó publicación</span>';
  const note=!consent&&pending?'<div class="warning">Este relato no puede publicarse porque la persona no autorizó su publicación.</div>':'';
  return '<article class="storyCard" id="s-'+x.story_id+'"><div class="storyTop"><div><div class="badges"><span class="badge '+esc(x.status)+'">'+esc(x.status)+'</span>'+consentBadge+'</div><h3>Relato anónimo</h3><div class="storyMeta">Recibido: '+fmtDate(x.created_at)+(x.reviewed_at?' · Revisado: '+fmtDate(x.reviewed_at):'')+'</div></div></div>'+original+published+note+editor+'<label class="notesLabel">Notas internas<textarea class="notes" rows="2" placeholder="Opcional">'+esc(x.moderator_notes||'')+'</textarea></label><div class="storyActions">'+actions+'<button class="deleteBtn" data-sdelete="'+x.story_id+'">Eliminar definitivamente</button></div></article>';
}
function renderStories(){
  const st=$('#storyStatus').value,items=st==='all'?stories:stories.filter(x=>x.status===st);
  $('#storyQueue').innerHTML=items.length?'<div class="queue">'+items.map(storyCard).join('')+'</div>':'<div class="empty">No hay relatos en esta categoría.</div>';
  $$('[data-spublish]').forEach(b=>b.onclick=()=>storyPublish(b.dataset.spublish));
  $$('[data-sprivate]').forEach(b=>b.onclick=()=>storyModerate(b.dataset.sprivate,'private'));
  $$('[data-sreject]').forEach(b=>b.onclick=()=>storyModerate(b.dataset.sreject,'reject'));
  $$('[data-sdelete]').forEach(b=>b.onclick=()=>storyDelete(b.dataset.sdelete));
}
function storyNotes(id){return $('#s-'+id)?.querySelector('.notes')?.value.trim()||null}
async function storyPublish(id){
  const root=$('#s-'+id),txt=root?.querySelector('.pubText')?.value.trim()||'';
  if(txt.length<10)return alert('La versión pública debe tener al menos 10 caracteres.');
  if(!confirm('¿Publicar este relato anónimo en el Muro de voces?'))return;
  await busy(root,async()=>{try{await rpc('moderate_mental_health_story',{story_id_input:id,action_input:'publish',published_text_input:txt,moderator_notes_input:storyNotes(id)});await loadStories()}catch(e){alert(e.message)}})
}
async function storyModerate(id,action){
  const label=action==='private'?'dejar este relato como privado':'rechazar este relato';
  if(!confirm('¿Querés '+label+'? El texto original dejará de conservarse.'))return;
  await busy($('#s-'+id),async()=>{try{await rpc('moderate_mental_health_story',{story_id_input:id,action_input:action,published_text_input:null,moderator_notes_input:storyNotes(id)});await loadStories()}catch(e){alert(e.message)}})
}
async function storyDelete(id){
  if(!confirm('¿Eliminar definitivamente este relato? Esta acción no se puede deshacer.'))return;
  await busy($('#s-'+id),async()=>{try{await rpc('moderate_mental_health_story',{story_id_input:id,action_input:'delete',published_text_input:null,moderator_notes_input:storyNotes(id)});await loadStories()}catch(e){alert(e.message)}})
}
$('#login').onclick=login;$('#password').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();login()}};
$('#logout').onclick=()=>{clearAuth();location.reload()};
$('#materialStatus').onchange=renderMaterials;$('#storyStatus').onchange=renderStories;
boot();