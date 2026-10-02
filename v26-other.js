// Nextfuture V2.6 — opción "Otro problema"
(function(){
  const otherDef={
    label:'Otro problema / No encuentro mi falla',
    price:'Requiere revisión',
    inspection:true,
    causes:['La falla no coincide con una categoría predefinida','Puede requerir pruebas específicas según lo que describas'],
    questions:[]
  };
  Object.values(DIAG_DATA).forEach(device=>{device.symptoms.other={...otherDef};});

  const originalChooseSymptom=chooseSymptom;
  chooseSymptom=function(key){
    const calc=document.getElementById('diagCalculate');
    const oldCustom=document.getElementById('diagOtherSubmit');
    if(oldCustom) oldCustom.remove();
    calc.style.display='';

    if(key!=='other'){
      originalChooseSymptom(key);
      return;
    }

    diagState.symptom='other';
    diagState.answers={};
    document.getElementById('diagQuestionIntro').textContent=`${DIAG_DATA[diagState.device].label} · Otro problema. Describilo con tus palabras y lo revisamos sin forzar un diagnóstico automático.`;
    document.getElementById('diagQuestions').innerHTML=`
      <div class="other-problem-card">
        <label for="diagOtherText">Contanos qué hace el equipo</label>
        <textarea id="diagOtherText" rows="6" maxlength="700" placeholder="Ej: se apaga cuando abro la cámara, hace un ruido extraño, sólo falla a veces, aparece un mensaje de error..."></textarea>
        <div class="other-counter"><span id="diagOtherCount">0</span>/700</div>
      </div>
      <div class="other-mini-grid">
        <div class="field"><label for="diagOtherSince">¿Desde cuándo pasa?</label><input id="diagOtherSince" placeholder="Ej: desde ayer / hace una semana"></div>
        <div class="field"><label for="diagOtherTrigger">¿Pasó algo antes?</label><input id="diagOtherTrigger" placeholder="Ej: caída, actualización, cambio de cargador"></div>
      </div>`;
    calc.style.display='none';
    const custom=document.createElement('button');
    custom.type='button';
    custom.id='diagOtherSubmit';
    custom.className='btn btn-primary diag-continue';
    custom.textContent='Enviar descripción para revisión';
    calc.insertAdjacentElement('afterend',custom);
    document.getElementById('diagOtherText').addEventListener('input',e=>{
      document.getElementById('diagOtherCount').textContent=String(e.target.value.length);
    });
    custom.addEventListener('click',renderOtherResult);
    diagShow('question',3);
  };

  function renderOtherResult(){
    const text=document.getElementById('diagOtherText')?.value.trim()||'';
    if(text.length<10){alert('Describí un poco más el problema para que podamos orientarte mejor.');return;}
    const since=document.getElementById('diagOtherSince')?.value.trim()||'';
    const trigger=document.getElementById('diagOtherTrigger')?.value.trim()||'';
    const brand=document.getElementById('diagBrand').value.trim();
    const model=document.getElementById('diagModel').value.trim();
    const equipment=[brand,model].filter(Boolean).join(' ')||DIAG_DATA[diagState.device].label;
    const detail=[since?`Desde cuándo: ${since}`:'',trigger?`Antecedente: ${trigger}`:''].filter(Boolean).join(' · ');

    document.getElementById('diagResultCard').innerHTML=`<div class="diag-result"><div class="diag-result-top"><div><small>CONSULTA PERSONALIZADA</small><h3>${diagEsc(equipment)} · Otro problema</h3><p>No vamos a inventar una causa sin datos suficientes. Tu descripción queda lista para revisión técnica.</p></div><span class="diag-badge warn">REQUIERE REVISIÓN</span></div><div class="diag-result-grid"><div class="diag-panel"><h4>Lo que nos contaste</h4><p class="other-description">${diagEsc(text)}</p>${detail?`<div class="diag-price-note">${diagEsc(detail)}</div>`:''}</div><div class="diag-panel"><h4>Costo orientativo</h4><div class="diag-price">Requiere revisión</div><div class="diag-price-note">Primero necesitamos identificar la falla. Si después corresponde una reparación concreta, te confirmamos presupuesto antes de avanzar.</div></div><div class="diag-panel"><h4>Qué podemos revisar</h4><ul><li>Si el síntoma se relaciona con software, alimentación o un componente.</li><li>Si hace falta un repuesto o sólo configuración/mantenimiento.</li><li>Si conviene resolverlo a domicilio o recibir el equipo.</li></ul></div><div class="diag-panel"><h4>Siguiente paso</h4><ul><li>Podés acercar el equipo con turno.</li><li>Podemos coordinar retiro según la zona.</li><li>También podés enviarnos esta consulta por WhatsApp.</li></ul></div></div><div class="diag-actions"><div class="diag-selects"><div><label for="diagMode">Modalidad preferida</label><select id="diagMode"><option value="Lo acerco con turno">Lo acerco con turno</option><option value="Solicitar retiro">Solicitar retiro</option><option value="Servicio a domicilio">Servicio a domicilio</option></select></div><div><label for="diagLocality">Localidad</label><select id="diagLocality"><option>Moreno</option><option>Paso del Rey</option><option>Merlo</option><option>Ituzaingó</option><option>Morón</option><option>Otra zona</option></select></div></div><div class="diag-whatsapp"><a class="btn btn-primary" id="diagWhatsApp" target="_blank" rel="noopener">Enviar consulta por WhatsApp</a></div></div><div class="diag-disclaimer">Esta opción no genera un diagnóstico automático porque la falla no encaja en una categoría predefinida. La revisión técnica permite evitar conclusiones incorrectas.</div></div>`;

    const link=document.getElementById('diagWhatsApp');
    const update=()=>{
      const mode=document.getElementById('diagMode').value;
      const locality=document.getElementById('diagLocality').value;
      const msg=`Hola Nextfuture. Hice el diagnóstico previo y elegí “Otro problema”. Equipo: ${equipment}. Descripción: ${text}.${since?` Desde cuándo: ${since}.`:''}${trigger?` Antes ocurrió: ${trigger}.`:''} Modalidad: ${mode}. Localidad: ${locality}. Quiero coordinar una revisión.`;
      link.href=`https://wa.me/5491130112951?text=${encodeURIComponent(msg)}`;
    };
    document.getElementById('diagMode').addEventListener('change',update);
    document.getElementById('diagLocality').addEventListener('change',update);
    update();
    diagShow('result',4);
  }

  const resetCustom=()=>{
    const calc=document.getElementById('diagCalculate');
    if(calc) calc.style.display='';
    document.getElementById('diagOtherSubmit')?.remove();
  };
  document.getElementById('diagBackSymptom')?.addEventListener('click',resetCustom);
  document.getElementById('diagRestart')?.addEventListener('click',resetCustom);
})();
