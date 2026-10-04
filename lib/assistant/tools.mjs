import config from './config.json' with {type:'json'};
export const norm = s => String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const stop = new Set('que como donde cuando para hay las los una uno del por con quiero necesito saber tengo puedo me en el la de y un es a mi se al'.split(' '));
export function rank(rows,q,limit=10){const words=[...new Set(norm(q).match(/[a-z0-9]+/g)||[])].filter(w=>(w.length>2||/^(i|ii|iii|iv|v|vi)$/.test(w))&&!stop.has(w));const seen=new Set();return rows.map(row=>{const title=norm(row.subject||row.subject_name||row.question||row.title||row.label||row.name);const text=norm([title,row.body,row.answer,row.description,row.notes,row.career,row.school,row.section,row.group_label].filter(Boolean).join(' '));return {row,score:words.reduce((s,w)=>s+(text.includes(w)?1:0),0)+(title&&title===norm(q)?20:0)}}).filter(x=>{if(x.score<=0)return false;const key=x.row.id||JSON.stringify(x.row);if(seen.has(key))return false;seen.add(key);return true}).sort((a,b)=>b.score-a.score).slice(0,limit).map(x=>x.row)}
export async function data(path,body){const r=await fetch(config.supabaseUrl+'/rest/v1/'+path,{method:body?'POST':'GET',cache:'no-store',headers:{apikey:config.publishableKey,Authorization:'Bearer '+config.publishableKey,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(18000)});if(!r.ok)throw Error('No se pudo consultar la fuente');return r.json()}
const rpc=(name,body={})=>data('rpc/'+name,body);
async function pageContent(){const r=await fetch(config.siteUrl,{cache:'no-store',signal:AbortSignal.timeout(18000)});if(!r.ok)throw Error('Página no disponible');const html=(await r.text()).replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'');return html.split(/<(?:article|section)\b/i).map(chunk=>({title:'Contenido de Ayuda para el Alumno',body:chunk.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,6000),source_url:config.siteUrl,links:[...chunk.matchAll(/href="(https:\/\/[^"<>]+)"/g)].slice(0,20).map(m=>({url:m[1].replace(/&amp;/g,'&')}))}))}
export function temporal(row,today=new Date().toLocaleDateString('en-CA',{timeZone:'America/Argentina/Buenos_Aires'})){return {...row,expired:!!row.valid_through&&String(row.valid_through).slice(0,10)<today}}
export function flat(h){return h.flatMap(s=>(s.careers||[]).flatMap(c=>(c.years||[]).flatMap(y=>(y.subjects||[]).map(m=>({school:s.name,career:c.name,career_slug:c.slug,year:y.year,subject:m.name,url:m.folder_url})))))}
export async function runTool(name,args){
 const q=String(args.query||'').slice(0,300);
 if(name==='search_site'){
  const sections=await rpc('get_help_sections_v2');
  const chosen=rank(sections,q,4);
  const settled=await Promise.allSettled([
   rpc('get_assistant_response',{search_text:q,related_limit:6}),
   ...chosen.map(s=>rpc('get_help_center',{section_key:s.section})),
   data('student_events?select=*&published=eq.true&order=start_date.desc&limit=200'),
   data('whatsapp_communities?select=title,invite_url,notes&active=eq.true'),pageContent()
  ]);
  let rows=[];for(const x of settled){if(x.status!=='fulfilled')continue;const d=x.value;if(Array.isArray(d))rows.push(...d);else if(d.found)rows.push(d.answer,...(d.related||[]))}
  return {checked_at:new Date().toISOString(),note:'Consultado en la base del sitio; no significa verificación nueva de la fuente oficial. El texto publicado puede estar desactualizado.',partial: settled.some(x=>x.status==='rejected'),results:rank(rows,q,12).map(row=>temporal(row)),available_topics:sections.map(s=>({topic:s.section,label:s.label}))};
 }
 if(name==='search_materials'){
  const hierarchy=flat(await rpc('get_drive_material_hierarchy'));
  const candidates=args.career?hierarchy.filter(m=>norm(m.career).includes(norm(args.career))):hierarchy;
  const matches=rank(candidates,q,8);
  const exact=matches.filter(m=>norm(m.subject)===norm(q)&&(!args.career||norm(m.career).includes(norm(args.career))));
  const files=exact.length===1?await rpc('get_drive_subject_materials',{career_filter:exact[0].career_slug,year_filter:exact[0].year,subject_filter:exact[0].subject}):null;
  return {matches,files,note:'Si hay varias materias o carreras, pedir aclaración. Los enlaces no implican haber leído el interior de los archivos.'};
 }
 if(name==='search_schedule'){
  if(!['course','final'].includes(args.kind))throw Error('Tipo de horario inválido');
  const rows=await rpc('search_academic_schedule',{search_text:q,schedule_kind:args.kind,result_limit:20});
  const sources=await rpc('resolve_academic_schedule_source',{search_text:q,schedule_kind_filter:args.kind});
  return {checked_at:new Date().toISOString(),rows,sources,note:'No confirmar aula vigente sin fecha/período y comisión coincidentes. Una publicación enlazada NO equivale a haber leído su PDF. Pedir carrera, comisión y fecha si faltan. Fechas pasadas son históricas.'};
 }
 throw Error('Herramienta no permitida');
}
export const tools=[
 {type:'function',name:'search_site',description:'Buscar toda la información del sitio: deportes, boleto, becas, trámites, calendario, contactos y grupos. Repetir con términos específicos si hace falta.',parameters:{type:'object',properties:{query:{type:'string'}},required:['query'],additionalProperties:false},strict:true},
 {type:'function',name:'search_materials',description:'Buscar carpetas y archivos públicos por materia. Usar solo nombre de materia en query y carrera si se conoce.',parameters:{type:'object',properties:{query:{type:'string'},career:{type:['string','null']}},required:['query','career'],additionalProperties:false},strict:true},
 {type:'function',name:'search_schedule',description:'Consultar cursada o finales. Usar nombre de materia; luego resolver ambigüedad con carrera, comisión y fecha.',parameters:{type:'object',properties:{query:{type:'string'},kind:{type:'string',enum:['course','final']}},required:['query','kind'],additionalProperties:false},strict:true}
];
