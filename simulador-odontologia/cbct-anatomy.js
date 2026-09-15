(() => {
  const concepts = {
    conducto_mandibular: {
      name: 'Conducto mandibular', threeDKey: 'conducto_mandibular',
      note: 'En CBCT se reconoce como un trayecto hipodenso/radiolúcido rodeado por corticales variables dentro del cuerpo mandibular.'
    },
    foramen_mentoniano: {
      name: 'Foramen mentoniano', threeDKey: 'foramen_mentoniano',
      note: 'Es la salida vestibular del conducto mandibular en la región premolar. Conviene confirmarlo siguiendo su continuidad en más de un plano.'
    },
    cortical_vestibular: {
      name: 'Cortical vestibular', threeDKey: 'mandibula',
      note: 'Es la cortical externa orientada hacia vestibular. En cortes transversales aparece como una banda ósea hiperdensa periférica.'
    },
    cortical_lingual: {
      name: 'Cortical lingual', threeDKey: 'mandibula',
      note: 'Es la cortical interna orientada hacia la lengua. Su identificación es clave para comprender espesor óseo y posición bucolingual del conducto.'
    },
    seno_maxilar: {
      name: 'Seno maxilar', threeDKey: 'seno_maxilar',
      note: 'Cavidad aérea del maxilar. En CBCT su piso puede estar muy próximo a raíces de premolares y molares superiores.'
    },
    raiz_molar: {
      name: 'Raíz de molar', threeDKey: 'maxilar',
      note: 'Las raíces dentarias se siguen en los tres planos. En maxilar posterior es importante valorar su relación con el piso del seno.'
    }
  };

  const scenes = [
    {
      id:'axial-mandibula', label:'Mandíbula axial', plane:'Axial', title:'Mandíbula · corte axial',
      intro:'Entrená relaciones bucolinguales: cortical vestibular, cortical lingual y conducto mandibular.',
      targets:['cortical_vestibular','cortical_lingual','conducto_mandibular'],
      svg:`<svg viewBox="0 0 760 430" role="img" aria-label="Esquema educativo de CBCT axial de mandíbula"><rect width="760" height="430" rx="18" fill="#111820"/><g opacity=".9"><path d="M92 215 C150 95 292 72 380 116 C468 72 610 95 668 215 C620 330 500 356 380 310 C260 356 140 330 92 215Z" fill="#9aa4ae"/><path d="M128 216 C174 130 292 116 380 151 C468 116 586 130 632 216 C588 290 492 310 380 274 C268 310 172 290 128 216Z" fill="#28313a"/></g><ellipse cx="250" cy="236" rx="24" ry="18" fill="#0b0f14"/><ellipse cx="510" cy="236" rx="24" ry="18" fill="#0b0f14"/><g fill="#dfe7ef"><circle cx="335" cy="170" r="24"/><circle cx="425" cy="170" r="24"/></g><button></button><g class="cbctAnHot" data-key="cortical_vestibular" tabindex="0" role="button" aria-label="Cortical vestibular"><ellipse cx="134" cy="220" rx="44" ry="74"/></g><g class="cbctAnHot" data-key="cortical_lingual" tabindex="0" role="button" aria-label="Cortical lingual"><ellipse cx="208" cy="220" rx="38" ry="58"/></g><g class="cbctAnHot" data-key="conducto_mandibular" tabindex="0" role="button" aria-label="Conducto mandibular"><ellipse cx="250" cy="236" rx="32" ry="26"/></g><text x="20" y="405">Esquema anatómico educativo · no es un estudio clínico</text></svg>`
    },
    {
      id:'coronal-mandibula', label:'Mandíbula coronal', plane:'Coronal', title:'Mandíbula · corte coronal',
      intro:'Observá espesor vertical, corticales y posición del conducto dentro del cuerpo mandibular.',
      targets:['cortical_vestibular','cortical_lingual','conducto_mandibular'],
      svg:`<svg viewBox="0 0 760 430" role="img" aria-label="Esquema educativo de CBCT coronal de mandíbula"><rect width="760" height="430" rx="18" fill="#111820"/><path d="M185 78 Q120 202 178 338 Q265 380 380 326 Q495 380 582 338 Q640 202 575 78 Q498 130 380 122 Q262 130 185 78Z" fill="#929da8"/><path d="M223 116 Q176 208 216 304 Q294 332 380 290 Q466 332 544 304 Q584 208 537 116 Q470 160 380 157 Q290 160 223 116Z" fill="#29333d"/><ellipse cx="272" cy="260" rx="25" ry="20" fill="#0a0f15"/><ellipse cx="488" cy="260" rx="25" ry="20" fill="#0a0f15"/><g class="cbctAnHot" data-key="cortical_vestibular" tabindex="0" role="button" aria-label="Cortical vestibular"><ellipse cx="187" cy="250" rx="44" ry="84"/></g><g class="cbctAnHot" data-key="cortical_lingual" tabindex="0" role="button" aria-label="Cortical lingual"><ellipse cx="245" cy="250" rx="32" ry="70"/></g><g class="cbctAnHot" data-key="conducto_mandibular" tabindex="0" role="button" aria-label="Conducto mandibular"><ellipse cx="272" cy="260" rx="34" ry="28"/></g><text x="20" y="405">Esquema anatómico educativo · no es un estudio clínico</text></svg>`
    },
    {
      id:'sagital-mandibula', label:'Mandíbula sagital', plane:'Sagital', title:'Mandíbula · corte sagital',
      intro:'Seguí el conducto mandibular hacia anterior hasta su salida por el foramen mentoniano.',
      targets:['conducto_mandibular','foramen_mentoniano'],
      svg:`<svg viewBox="0 0 760 430" role="img" aria-label="Esquema educativo de CBCT sagital de mandíbula"><rect width="760" height="430" rx="18" fill="#111820"/><path d="M108 318 Q145 122 286 84 Q420 74 612 154 Q666 190 644 252 Q602 338 428 354 Q250 374 108 318Z" fill="#949faa"/><path d="M150 294 Q195 164 300 132 Q414 126 576 183 Q610 202 593 240 Q548 300 418 314 Q274 330 150 294Z" fill="#2a343e"/><path d="M185 258 Q295 270 390 258 Q490 246 565 214" stroke="#090e14" stroke-width="24" fill="none" stroke-linecap="round"/><ellipse cx="194" cy="260" rx="19" ry="28" fill="#090e14"/><g fill="#dbe4ec"><rect x="318" y="118" width="34" height="106" rx="12"/><rect x="373" y="112" width="34" height="110" rx="12"/><rect x="428" y="117" width="34" height="104" rx="12"/></g><g class="cbctAnHot wide" data-key="conducto_mandibular" tabindex="0" role="button" aria-label="Conducto mandibular"><path d="M225 260 Q340 274 455 250 Q520 236 565 214"/></g><g class="cbctAnHot" data-key="foramen_mentoniano" tabindex="0" role="button" aria-label="Foramen mentoniano"><ellipse cx="194" cy="260" rx="34" ry="38"/></g><text x="20" y="405">Esquema anatómico educativo · no es un estudio clínico</text></svg>`
    },
    {
      id:'coronal-maxilar', label:'Maxilar coronal', plane:'Coronal', title:'Maxilar posterior · corte coronal',
      intro:'Relacioná raíces posteriores con el piso del seno maxilar.',
      targets:['seno_maxilar','raiz_molar'],
      svg:`<svg viewBox="0 0 760 430" role="img" aria-label="Esquema educativo de CBCT coronal de maxilar posterior"><rect width="760" height="430" rx="18" fill="#111820"/><path d="M110 82 Q210 50 380 68 Q550 50 650 82 L610 302 Q510 350 380 326 Q250 350 150 302Z" fill="#9aa5af"/><ellipse cx="265" cy="170" rx="116" ry="82" fill="#151d25"/><ellipse cx="495" cy="170" rx="116" ry="82" fill="#151d25"/><path d="M150 244 Q270 214 380 228 Q490 214 610 244" stroke="#e7edf3" stroke-width="9" fill="none"/><g fill="#e7edf3"><path d="M300 250 l-18 92 h36Z"/><path d="M344 246 l-13 98 h28Z"/><path d="M416 246 l-13 98 h28Z"/><path d="M460 250 l-18 92 h36Z"/></g><g class="cbctAnHot" data-key="seno_maxilar" tabindex="0" role="button" aria-label="Seno maxilar"><ellipse cx="265" cy="170" rx="105" ry="72"/></g><g class="cbctAnHot" data-key="raiz_molar" tabindex="0" role="button" aria-label="Raíz de molar"><ellipse cx="323" cy="294" rx="45" ry="68"/></g><text x="20" y="405">Esquema anatómico educativo · no es un estudio clínico</text></svg>`
    }
  ];

  function init(){
    const anchor=document.getElementById('realCbctCase')||document.getElementById('radiologyModule');
    if(!anchor||document.getElementById('cbctAnatomyTrainer'))return false;
    const section=document.createElement('section');
    section.id='cbctAnatomyTrainer'; section.className='cbctAnatomy';
    section.innerHTML=`<div class="cbctAnHead"><div><span class="simEy">CBCT anatómico · entrenamiento controlado</span><h2>Identificá estructuras dentro de los cortes</h2><p>Estos cortes son esquemas propios sincronizados con el atlas 3D. Los usamos para aprender anatomía sin depender de un caso clínico cuya privacidad todavía no esté aprobada para producción.</p></div><div class="cbctAnActions"><button id="cbctAnToggleLabels" class="active" type="button">Ayudas: visibles</button><button id="cbctAnPractice" type="button">Practicar anatomía</button></div></div><div id="cbctAnTabs" class="cbctAnTabs"></div><div class="cbctAnGrid"><div class="cbctAnViewer"><div id="cbctAnSvg"></div><div id="cbctAnQuiz" class="cbctAnQuiz" hidden></div></div><aside class="cbctAnPanel"><span id="cbctAnPlane" class="radLabel"></span><h3 id="cbctAnTitle"></h3><p id="cbctAnIntro"></p><div id="cbctAnConcepts" class="cbctAnConcepts"></div><div id="cbctAnDetail" class="cbctAnDetail"><b>Elegí una estructura</b><p>Tocá una región del corte o uno de los conceptos para ver cómo reconocerla.</p></div><button id="cbctAnShow3d" class="primary" type="button" disabled>Comparar en 3D</button><p class="cbctAnNote">No se utiliza información de pacientes. La geometría de estos cortes es didáctica y no sirve para medición clínica.</p></aside></div>`;
    anchor.insertAdjacentElement('afterend',section);

    const tabs=section.querySelector('#cbctAnTabs'),svgHost=section.querySelector('#cbctAnSvg'),plane=section.querySelector('#cbctAnPlane'),title=section.querySelector('#cbctAnTitle'),intro=section.querySelector('#cbctAnIntro'),conceptHost=section.querySelector('#cbctAnConcepts'),detail=section.querySelector('#cbctAnDetail'),show3d=section.querySelector('#cbctAnShow3d'),quizBox=section.querySelector('#cbctAnQuiz'),practiceBtn=section.querySelector('#cbctAnPractice'),toggleLabels=section.querySelector('#cbctAnToggleLabels');
    let sceneIndex=0,selected=null,labels=true,quiz=false,target=null,attempts=0,correct=0;

    scenes.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=s.label;b.dataset.scene=String(i);b.addEventListener('click',()=>{if(!quiz)renderScene(i);});tabs.appendChild(b);});

    function bindHotspots(){
      section.querySelectorAll('.cbctAnHot[data-key]').forEach(el=>{const act=()=>quiz?answer(el.dataset.key):select(el.dataset.key);el.addEventListener('click',act);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});});
    }
    function renderScene(i){
      sceneIndex=i; const s=scenes[i]; selected=null; show3d.disabled=true;
      plane.textContent=`${s.plane} · esquema educativo`;title.textContent=s.title;intro.textContent=s.intro;svgHost.innerHTML=s.svg;bindHotspots();
      tabs.querySelectorAll('[data-scene]').forEach(b=>b.classList.toggle('active',Number(b.dataset.scene)===i));
      conceptHost.innerHTML=s.targets.map(k=>`<button type="button" data-concept="${k}">${concepts[k].name}</button>`).join('');
      conceptHost.querySelectorAll('[data-concept]').forEach(b=>b.addEventListener('click',()=>{if(!quiz)select(b.dataset.concept);}));
      detail.innerHTML='<b>Elegí una estructura</b><p>Tocá una región del corte o uno de los conceptos para ver cómo reconocerla.</p>';
      section.classList.toggle('hideCbctAnLabels',!labels);
    }
    function select(key){const c=concepts[key];if(!c)return;selected=key;detail.innerHTML=`<b>${c.name}</b><p>${c.note}</p>`;show3d.disabled=false;section.querySelectorAll('[data-concept]').forEach(b=>b.classList.toggle('active',b.dataset.concept===key));section.querySelectorAll('.cbctAnHot[data-key]').forEach(el=>el.classList.toggle('active',el.dataset.key===key));}
    function newQuestion(){const s=scenes[Math.floor(Math.random()*scenes.length)];sceneIndex=scenes.indexOf(s);renderScene(sceneIndex);quiz=true;section.classList.add('cbctAnQuizMode');const pool=s.targets;target=pool[Math.floor(Math.random()*pool.length)];quizBox.hidden=false;quizBox.textContent=`${s.plane} · Identificá: ${concepts[target].name}`;}
    function startQuiz(){quiz=true;attempts=0;correct=0;practiceBtn.textContent='Terminar práctica';section.classList.add('cbctAnQuizMode');newQuestion();}
    function endQuiz(){quiz=false;quizBox.hidden=true;practiceBtn.textContent='Practicar anatomía';section.classList.remove('cbctAnQuizMode');renderScene(sceneIndex);}
    function answer(key){attempts++;const ok=key===target;if(ok)correct++;quizBox.textContent=`${ok?'✓ Correcto':'✕ Era '+concepts[target].name} · ${correct}/${attempts}`;document.dispatchEvent(new CustomEvent('simulator:practice-result',{detail:{mode:'CBCT · anatomía',target:concepts[target].name,correct:ok}}));setTimeout(()=>{if(quiz)newQuestion();},950);}

    toggleLabels.addEventListener('click',()=>{labels=!labels;section.classList.toggle('hideCbctAnLabels',!labels);toggleLabels.classList.toggle('active',labels);toggleLabels.textContent=labels?'Ayudas: visibles':'Ayudas: ocultas';});
    practiceBtn.addEventListener('click',()=>quiz?endQuiz():startQuiz());
    show3d.addEventListener('click',()=>{if(!selected)return;document.dispatchEvent(new CustomEvent('simulator:select',{detail:{key:concepts[selected].threeDKey,sourceName:'CBCT anatómico educativo'}}));document.getElementById('skullStage')?.scrollIntoView({behavior:'smooth',block:'center'});});
    renderScene(0); return true;
  }

  if(init())return;const o=new MutationObserver(()=>{if(init())o.disconnect();});o.observe(document.body,{childList:true,subtree:true});setTimeout(()=>o.disconnect(),10000);
})();