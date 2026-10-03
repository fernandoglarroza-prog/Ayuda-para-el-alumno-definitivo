// Nextfuture V4.7 — diagnóstico diferencial explicable
(function(){'use strict';
const esc=s=>typeof diagEsc==='function'?diagEsc(s):String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const n=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function build(){
 const s=DIAG_DATA?.[diagState.device]?.symptoms?.[diagState.symptom];if(!s)return[];
 const c=window.NextfutureDiagnostic?.context?.()||{}, t=n([s.label,...(s.causes||[])].join(' ')), rows=[];
 const add=(cause,favors,against,confirm)=>rows.push({cause,favors,against,confirm});
 if(/carga|cargador|puerto|enciende|alimentacion/.test(t)){
  add('Accesorio o alimentación externa','Cambia al mover/cambiar cable, cargador, toma o fuente.','Falla igual con una alimentación conocida y compatible.','Medir tensión/potencia y probar con alimentación de referencia.');
  add('Puerto, jack, flex o subplaca','Hay falso contacto, daño visible o carga intermitente.','El conector está firme y la alimentación llega correctamente a placa.','Inspección y medición de entrada/continuidad sin asumir cambio de pieza.');
  add('Batería o circuito de carga','Hay apagados, autonomía anormal, calentamiento o porcentaje errático.','La batería entrega tensión estable y el consumo de carga es normal.','Medir consumo, batería y líneas de carga.');
 }
 if(/pantalla|imagen|display|tactil/.test(t)){
  add('Módulo de pantalla / táctil','El equipo mantiene sonido, vibración o actividad pero falla imagen/táctil.','No hay signos de arranque o también falla la salida externa cuando aplica.','Comprobar señal, iluminación, flex y módulo con procedimiento compatible.');
  add('Flex, conector o alimentación de pantalla','La falla cambia al mover tapa/equipo o apareció tras golpe/reparación.','Conexiones y tensiones del display son estables.','Inspección de conectores y líneas de alimentación/señal.');
  add('Video, placa o arranque','No hay imagen junto con otros signos de POST/arranque anormal.','El sistema arranca normalmente y el problema queda localizado al panel.','Separar POST/arranque de la ruta de video antes de reemplazar pantalla.');
 }
 if(/calienta|temperatura|ventilador|reinicia|apaga/.test(t)){
  add('Refrigeración','Empeora después de minutos de uso o bajo carga.','La temperatura es normal cuando ocurre la falla.','Registrar temperaturas, ventiladores y transferencia térmica.');
  add('Alimentación / batería / placa','El calor es muy localizado o aparece incluso con poca carga.','El consumo eléctrico es estable y el calor sigue un patrón normal de CPU/GPU.','Medir consumo y localizar térmicamente la zona antes de intervenir.');
 }
 if(/lento|disco|ssd|hdd|almacenamiento|congela|arranque/.test(t)){
  add('Almacenamiento degradado','Hay errores de lectura/escritura, desaparición de unidad o ruidos de HDD.','La unidad pasa pruebas y el problema no se relaciona con E/S.','Revisar SMART cuando aplica, estabilidad de detección y lectura, priorizando respaldo.');
  add('Sistema / software','Empezó tras actualización, instalación o hay procesos/espacio saturados.','Persiste fuera del sistema habitual o aparecen errores físicos de unidad.','Revisar sistema de forma reversible antes de reinstalar.');
 }
 if(/wifi|bluetooth|senal|sim|ethernet|red/.test(t)){
  add('Red, SIM, router o accesorio externo','Sólo falla con una red, SIM o accesorio concreto.','Falla igual en varias redes/accesorios conocidos.','Prueba cruzada antes de abrir el equipo.');
  add('Módulo, antena o controlador','Falla con múltiples redes/accesorios o varias funciones inalámbricas juntas.','Otra configuración/restablecimiento reversible resuelve la falla.','Verificar controlador/configuración y luego hardware de conectividad.');
 }
 if(c.antecedent==='liquid')add('Humedad / corrosión','Existe antecedente directo de líquido o humedad.','No puede descartarse sólo porque el equipo todavía encienda.','Inspección controlada sin energizar innecesariamente y mediciones de placa.');
 if(c.antecedent==='drop')add('Daño por impacto','La falla comenzó inmediatamente después de una caída o golpe.','No hay relación temporal y las pruebas apuntan a software/accesorio.','Revisar módulo, flex, conectores, carcasa y placa según la zona afectada.');
 if(c.antecedent==='update')add('Software / actualización','Funcionaba normalmente antes del cambio de software.','Hay síntomas físicos independientes o la falla precede a la actualización.','Reversión/diagnóstico de software conservando datos antes de cambiar hardware.');
 return rows.slice(0,5);
}
function render(){
 const root=document.querySelector('#diagResultCard .diag-result');if(!root||root.querySelector('#nf47Diff')||diagState.symptom==='other')return;
 const rows=build();if(!rows.length)return;
 const sec=document.createElement('section');sec.id='nf47Diff';sec.className='nf47-diff';
 sec.innerHTML='<div class="nf47-title"><small>DIAGNÓSTICO DIFERENCIAL</small><h3>Cómo se separan las causas posibles</h3><p>Un mismo síntoma puede tener orígenes distintos. Estos datos ayudan a decidir qué comprobar antes de reemplazar piezas.</p></div><div class="nf47-list">'+rows.map((r,i)=>`<article><div class="nf47-cause"><span>${i+1}</span><b>${esc(r.cause)}</b></div><div class="nf47-cols"><p><small>LO FAVORECE</small>${esc(r.favors)}</p><p><small>LO HACE MENOS PROBABLE</small>${esc(r.against)}</p><p><small>CÓMO SE CONFIRMA</small>${esc(r.confirm)}</p></div></article>`).join('')+'</div><p class="nf47-note">La orientación no asigna porcentajes inventados: la causa final se confirma con inspección, mediciones y pruebas del equipo real.</p>';
 root.appendChild(sec);
}
const c=document.getElementById('diagResultCard');if(c)new MutationObserver(()=>setTimeout(render,80)).observe(c,{childList:true,subtree:true});
window.NextfutureDifferential={build};
})();