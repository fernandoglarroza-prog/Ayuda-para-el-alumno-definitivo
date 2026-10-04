import http from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';import handler from '../api/assistant.js';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const headers=JSON.parse(await fs.readFile(path.join(root,'vercel.json'),'utf8')).headers[0].headers;
http.createServer(async(req,res)=>{
 res.status=n=>{res.statusCode=n;return res};res.json=v=>{res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(v))};
 for(const h of headers)res.setHeader(h.key,h.value.replace('; upgrade-insecure-requests',''));
 try{const pathname=new URL(req.url,'http://localhost').pathname;if(pathname==='/api/assistant'){if(req.method==='POST'){let b='';for await(const c of req){b+=c;if(Buffer.byteLength(b)>18000)return res.status(413).json({error:'Consulta demasiado larga'})}try{req.body=JSON.parse(b)}catch{return res.status(400).json({error:'JSON inválido'})}}return await handler(req,res)}
  const safe=pathname==='/'?'/index.html':pathname;if(!/^\/(?:index\.html|app\.js|contribution-fix\.js|assistant\.(?:js|css)|styles\.css)$/.test(safe))return res.status(404).end();
  res.setHeader('Content-Type',safe.endsWith('.js')?'text/javascript; charset=utf-8':safe.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8');res.end(await fs.readFile(path.join(root,safe)));
 }catch{res.status(500).json({error:'No se pudo completar la solicitud'})}
}).listen(Number(process.env.PORT||8787),'127.0.0.1',()=>console.log('http://127.0.0.1:8787'));
