import {answer,collectSources,validateMessages} from '../lib/assistant/agent.mjs';
import {runTool,norm} from '../lib/assistant/tools.mjs';

const attempts=new Map();
const enabled=()=>process.env.AGENT_ENABLED==='true'&&!!process.env.OPENAI_API_KEY&&!!process.env.OPENAI_MODEL;
export function routeQuery(query){
 const q=norm(query);
 const material=/\b(material|apuntes|parciales|resumenes|libros|archivos)\b/.test(q);
 const schedule=!material&&/\b(aula|aulas|curso|cursada|rindo|rendir|mesa|final|horario|horarios)\b/.test(q)&&!/(deporte|futbol|voley|basquet|boxeo|biblioteca|boleto|idioma)/.test(q);
 const kind=/\b(rindo|rendir|mesa|final|examen)\b/.test(q)?'final':'course';
 const subject=query.replace(/^[¿¡\s]*(?:en qu[eé] aula (?:curso|rindo)|d[oó]nde (?:curso|rindo)|(?:necesito|busco|tenes|tenés|quiero) (?:material|apuntes|parciales|resumenes|resúmenes)|(?:material|apuntes|parciales|resúmenes|resumenes)|(?:aulas?|horarios?)(?: de (?:cursada|examen))?)\s*(?:de\s+)?/i,'').replace(/[?¿]/g,'').trim();
 return {tool:material?'search_materials':schedule?'search_schedule':'search_site',query:subject||query,kind,career:null};
}
function throttle(req){const ip=String(req.headers?.['x-real-ip']||req.socket?.remoteAddress||'unknown').slice(0,100);const now=Date.now();for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);const v=attempts.get(ip)||{count:0,until:now+60000};v.count++;if(attempts.size>=2000&&!attempts.has(ip))return false;attempts.set(ip,v);return v.count<=12}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store, max-age=0');
 if(req.method==='GET')return res.status(200).json({mode:enabled()?'ai':'sources'});
 if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Método no permitido'})}
 if(!throttle(req)){res.setHeader('Retry-After','60');return res.status(429).json({error:'Hiciste varias consultas seguidas. Esperá un minuto y volvé a intentar.'})}
 let body=req.body;if(typeof body==='string'){try{body=JSON.parse(body)}catch{return res.status(400).json({error:'Solicitud inválida'})}}
 if(!body||JSON.stringify(body).length>18000)return res.status(400).json({error:'La consulta es demasiado larga.'});
 let messages;try{messages=validateMessages(body.messages);if(messages.at(-1).role!=='user')throw Error()}catch{return res.status(400).json({error:'Escribí una consulta válida de hasta 2400 caracteres.'})}
 try{
  if(enabled()){const r=await answer(messages);return res.status(r.status).json({...r.body,checked_at:new Date().toISOString()})}
  const query=messages.at(-1).content;const route=routeQuery(query);
  const result=await runTool(route.tool,route);
  return res.status(200).json({mode:'sources',topic:route.tool,result,sources:collectSources(result),checked_at:new Date().toISOString()});
 }catch{return res.status(502).json({error:'No pude consultar las fuentes en este momento. Probá de nuevo; esto no significa que no haya información.'})}
}
