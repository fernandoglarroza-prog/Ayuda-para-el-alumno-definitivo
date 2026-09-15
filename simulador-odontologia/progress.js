(() => {
  const KEY='ayuda_sim_odontologia_progress_v1';
  const empty=()=>({attempts:0,correct:0,byMode:{},byTarget:{},explored:{},updatedAt:null});
  function load(){try{return {...empty(),...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{return empty();}}
  let data=load();
  function save(){data.updatedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(data));}catch{}render();}
  function cleanName(s=''){return s.replace(/^Caso\s+\d+\s*·\s*/i,'').replace(/^Identificá(?:\s+en[^:]+)?\s*:\s*/i,'').trim();}
  function recordAttempt(mode,target,ok){target=cleanName(target)||'Pregunta';data.attempts++;if(ok)data.correct++;data.byMode[mode]=data.byMode[mode]||{attempts:0,correct:0};data.byMode[mode].attempts++;if(ok)data.byMode[mode].correct++;data.byTarget[target]=data.byTarget[target]||{attempts:0,correct:0};data.byTarget[target].attempts++;if(ok)data.byTarget[target].correct++;save();}
  function recordExplore(key){if(!key)return;data.explored[key]=(data.explored[key]||0)+1;save();}

  window.SimulatorProgress={recordAttempt,recordExplore,get:()=>data,reset(){data=empty();save();}};
  document.addEventListener('simulator:select',e=>recordExplore(e.detail?.key));
  document.addEventListener('simulator:practice-result',e=>{
    const d=e.detail||{};
    if(!d.mode||!d.target||typeof d.correct!=='boolean')return;
    recordAttempt(d.mode,d.target,d.correct);
  });

  const watchers=new Map();
  function watchBanner(id,mode){
    const el=document.getElementById(id);if(!el||watchers.has(el))return;
    let target='';let last='';
    const read=()=>{
      const text=(el.textContent||'').trim();if(!text||text===last)return;last=text;
      if(/Identificá/i.test(text)){target=cleanName(text);return;}
      if(text.startsWith('✓'))recordAttempt(mode,target,true);
      else if(text.startsWith('✕'))recordAttempt(mode,target,false);
    };
    const o=new MutationObserver(read);o.observe(el,{childList:true,characterData:true,subtree:true});watchers.set(el,o);read();
  }
  function attach(){watchBanner('radQuizBanner','Imagen esquemática');watchBanner('realQuizBanner','Panorámica real');watchBanner('cbctQuizBanner','CBCT · planos');}
  const bodyObserver=new MutationObserver(attach);bodyObserver.observe(document.body,{childList:true,subtree:true});attach();

  function pct(a,c){return a?Math.round(c*100/a):0;}
  function weakAreas(){return Object.entries(data.byTarget).filter(([,v])=>v.attempts>=2).map(([name,v])=>({name,...v,score:pct(v.attempts,v.correct)})).sort((a,b)=>a.score-b.score||b.attempts-a.attempts).slice(0,4);}
  function mount(){
    if(document.getElementById('progressDashboard'))return true;
    const anchor=document.getElementById('sourcePolicyPanel')||document.getElementById('cbctAnatomyTrainer')||document.getElementById('realCbctCase')||document.getElementById('realRadiographCase');if(!anchor)return false;
    const section=document.createElement('section');section.id='progressDashboard';section.className='progressDash';
    section.innerHTML=`<div class="progressHead"><div><span class="simEy">Tu progreso · guardado solo en este dispositivo</span><h2>Qué estás dominando y qué conviene repasar</h2><p>No requiere cuenta y no envía resultados a ningún servidor. Podés borrar el progreso cuando quieras.</p></div><button id="progressReset" type="button">Borrar mi progreso</button></div><div class="progressStats"><article><b id="pAccuracy">—</b><span>Precisión</span></article><article><b id="pAttempts">0</b><span>Respuestas</span></article><article><b id="pExplored">0</b><span>Estructuras exploradas</span></article></div><div class="progressGrid"><div><h3>Por tipo de práctica</h3><div id="pModes" class="progressRows"></div></div><div><h3>Para repasar</h3><div id="pWeak" class="progressRows"></div></div></div><p class="progressPrivacy">Privacidad: este panel usa únicamente almacenamiento local del navegador. No guarda nombre, correo, imágenes médicas ni identificadores de pacientes.</p>`;
    anchor.insertAdjacentElement('afterend',section);
    section.querySelector('#progressReset').addEventListener('click',()=>{if(confirm('¿Borrar el progreso guardado en este dispositivo?'))window.SimulatorProgress.reset();});render();return true;
  }
  function render(){
    const root=document.getElementById('progressDashboard');if(!root)return;
    root.querySelector('#pAccuracy').textContent=data.attempts?`${pct(data.attempts,data.correct)}%`:'—';
    root.querySelector('#pAttempts').textContent=String(data.attempts);
    root.querySelector('#pExplored').textContent=String(Object.keys(data.explored).length);
    const modes=Object.entries(data.byMode);root.querySelector('#pModes').innerHTML=modes.length?modes.map(([name,v])=>`<div><span>${name}</span><b>${v.correct}/${v.attempts} · ${pct(v.attempts,v.correct)}%</b></div>`).join(''):'<p>Todavía no hiciste ejercicios calificables.</p>';
    const weak=weakAreas();root.querySelector('#pWeak').innerHTML=weak.length?weak.map(v=>`<div><span>${v.name}</span><b>${v.score}% · ${v.attempts} intentos</b></div>`).join(''):'<p>Cuando haya al menos dos intentos por tema, acá aparecerán tus prioridades de repaso.</p>';
  }
  if(!mount()){const o=new MutationObserver(()=>{if(mount())o.disconnect();});o.observe(document.body,{childList:true,subtree:true});setTimeout(()=>o.disconnect(),10000);}
})();