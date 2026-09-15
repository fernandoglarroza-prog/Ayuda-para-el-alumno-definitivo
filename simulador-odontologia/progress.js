(() => {
  const mobile = matchMedia('(pointer: coarse)').matches || innerWidth <= 900;
  window.SimulatorMobileStability = { mobile, optimizedManifest: false, contextLost: false, fpsCap: mobile ? 30 : null };

  // The dental overlay logic only needs tooth bounds from atlas.json, not every
  // tooth mesh. Reusing the mandibular chunk id prevents the viewer from
  // downloading dozens of unnecessary dental geometry chunks on phones.
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : (input?.url || '');
    const response = await originalFetch(input, init);
    if (!url.includes('/models/atlas.json') || !response.ok) return response;
    try {
      const data = await response.clone().json();
      const mandible = data.parts?.find((p) => p.id === 'FJ3289' || p.conceptId === 'FJ3289' || /^Mandible$/i.test(p.name || ''));
      if (!mandible || !Number.isFinite(mandible.chunk)) return response;
      for (const part of data.parts || []) if (/tooth/i.test(part?.name || '')) part.chunk = mandible.chunk;
      window.SimulatorMobileStability.optimizedManifest = true;
      return new Response(JSON.stringify(data), { status: response.status, statusText: response.statusText, headers: response.headers });
    } catch {
      return response;
    }
  };

  if (mobile) {
    // Reduce framebuffer/GPU pressure on Android and other coarse-pointer devices.
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, attrs) {
      if (this.id === 'skullCanvas' && /^(webgl2?|experimental-webgl)$/i.test(type)) {
        attrs = { ...(attrs || {}), antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: false, desynchronized: false };
      }
      return originalGetContext.call(this, type, attrs);
    };

    // Render at 1x on phones. High-DPI WebGL framebuffers are one of the largest
    // GPU costs here and add little educational value on a small screen.
    if ((window.devicePixelRatio || 1) > 1) {
      try { Object.defineProperty(window, 'devicePixelRatio', { configurable: true, get: () => 1 }); } catch {}
    }

    // Cap requestAnimationFrame-driven loops (Three.js viewer and ATM demo) at
    // ~30 FPS on mobile. Touch interaction remains fluid while GPU work is halved.
    const nativeRAF = window.requestAnimationFrame.bind(window);
    const nativeCancel = window.cancelAnimationFrame.bind(window);
    const rafTokens = new Map();
    const lastByCallback = new WeakMap();
    let rafSeq = 1;
    window.requestAnimationFrame = (callback) => {
      const token = rafSeq++;
      let nativeId = 0;
      const step = (time) => {
        if (!rafTokens.has(token)) return;
        const last = lastByCallback.get(callback) || 0;
        if (time - last >= 32) {
          lastByCallback.set(callback, time);
          rafTokens.delete(token);
          callback(time);
          return;
        }
        nativeId = nativeRAF(step);
        rafTokens.set(token, nativeId);
      };
      nativeId = nativeRAF(step);
      rafTokens.set(token, nativeId);
      return token;
    };
    window.cancelAnimationFrame = (token) => {
      const nativeId = rafTokens.get(token);
      if (nativeId) nativeCancel(nativeId);
      rafTokens.delete(token);
    };

    const style = document.createElement('style');
    style.textContent = '@media(max-width:620px){.skullStage{height:390px!important;min-height:340px!important}.viewerRetry{position:absolute;z-index:8;left:50%;top:58%;transform:translate(-50%,-50%);border:0;border-radius:12px;padding:11px 16px;background:#0b4bb3;color:#fff;font-weight:800;box-shadow:0 8px 24px #17203333}}';
    document.head.appendChild(style);
  }

  const canvas = document.getElementById('skullCanvas');
  const stage = document.getElementById('skullStage');
  const status = document.getElementById('viewerStatus');
  const errorBox = document.getElementById('viewerError');
  if (canvas && stage) {
    const showRetry = (message) => {
      stage.classList.add('failed');
      if (status) { status.textContent = 'Visor 3D pausado'; status.classList.add('error'); }
      if (errorBox) { errorBox.hidden = false; errorBox.textContent = message; }
      let retry = document.getElementById('viewerRetry');
      if (!retry) {
        retry = document.createElement('button'); retry.id = 'viewerRetry'; retry.className = 'viewerRetry'; retry.type = 'button'; retry.textContent = 'Reiniciar visor 3D';
        retry.addEventListener('click', () => location.reload()); stage.appendChild(retry);
      }
    };
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault(); window.SimulatorMobileStability.contextLost = true;
      showRetry('El teléfono liberó la memoria gráfica del visor. Reinicialo en modo liviano; las fichas y ejercicios siguen disponibles.');
    }, false);
    canvas.addEventListener('webglcontextrestored', () => location.reload(), false);
  }

  if (mobile) {
    // Keep optional overlays available but off initially on phones. This reduces
    // draw calls and transparent geometry until the student explicitly needs it.
    document.addEventListener('simulator:viewer-ready', () => {
      requestAnimationFrame(() => {
        const landmarks = document.getElementById('toggleLandmarks');
        const canal = document.getElementById('toggleCanal');
        if (landmarks?.classList.contains('active')) landmarks.click();
        if (canal?.classList.contains('active')) canal.click();
      });
    }, { once: true });
  }

  if (mobile && status) {
    const decorate = () => {
      if (status.classList.contains('ready') && !status.textContent.includes('modo liviano')) status.textContent += ' · modo liviano · 30 FPS';
    };
    new MutationObserver(decorate).observe(status, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    decorate();
  }
})();

(() => {
  const KEY='ayuda_sim_odontologia_progress_v1';
  const empty=()=>({attempts:0,correct:0,byMode:{},byTarget:{},explored:{},updatedAt:null});
  function load(){try{return {...empty(),...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{return empty();}}
  let data=load();
  function save(){data.updatedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(data));}catch{}render();document.dispatchEvent(new CustomEvent('simulator:progress-updated',{detail:{attempts:data.attempts,correct:data.correct}}));}
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

(() => {
  const assets=[
    ['link','/simulador-odontologia/adaptive-study.css'],
    ['script','/simulador-odontologia/adaptive-study.js'],
    ['link','/simulador-odontologia/exam-mode.css'],
    ['script','/simulador-odontologia/exam-mode.js']
  ];
  assets.forEach(([type,url])=>{
    if(type==='link'){
      if(document.querySelector(`link[href="${url}"]`))return;
      const el=document.createElement('link');el.rel='stylesheet';el.href=url;document.head.appendChild(el);
    }else{
      if(document.querySelector(`script[src="${url}"]`))return;
      const el=document.createElement('script');el.src=url;el.defer=true;document.body.appendChild(el);
    }
  });
})();