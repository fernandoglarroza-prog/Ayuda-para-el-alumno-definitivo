(() => {
  const cfg=window.NURSING_INTERACTIONS;if(!cfg)return;
  Object.assign(cfg.cases,{
    'pediatria-01':{defaultHint:'Empezá por observación general, respiración y parámetros; adaptá siempre la interacción a la edad.',findings:{
      'observe:head':{title:'Estado general',text:'Mateo está despierto, cansado y responde adecuadamente para el escenario.',actionId:'communication'},
      'observe:chest':{title:'Patrón respiratorio',text:'Se observa tos y respiración algo acelerada dentro del caso.',actionId:'resp'},
      'stethoscope:chest':{title:'Auscultación simulada',text:'El simulador presenta un hallazgo respiratorio ficticio para integrar con fiebre y tos.',actionId:'resp'},
      'bp:arm':{title:'Presión arterial',text:'TA simulada: 105/68 mmHg.',actionId:'vitals'},
      'oximeter:hand':{title:'Oximetría',text:'SpO₂ simulada: 96%.',actionId:'vitals'},
      'observe:hand':{title:'Ingesta e hidratación',text:'El dato debe relacionarse con la menor ingesta referida por el acompañante.',actionId:'hydration'}
    }},
    'materno-01':{defaultHint:'Valorá estado general, confort, seguridad y parámetros antes de avanzar con educación.',findings:{
      'observe:head':{title:'Estado general',text:'Valentina está consciente, orientada y cansada.',actionId:'identity'},
      'bp:arm':{title:'Presión arterial',text:'TA simulada: 116/74 mmHg.',actionId:'vitals'},
      'oximeter:hand':{title:'Oximetría',text:'SpO₂ simulada: 98%.',actionId:'vitals'},
      'observe:abdomen':{title:'Confort',text:'La paciente refiere molestias leves propias del escenario y solicita orientación.',actionId:'pain'},
      'observe:legs':{title:'Movilización segura',text:'Refiere mareo leve al primer intento de levantarse.',actionId:'safety'}
    }},
    'salud-mental-01':{defaultHint:'En este caso, observar y escuchar aportan más que usar instrumentos de forma repetitiva.',findings:{
      'observe:head':{title:'Contacto y orientación',text:'Abril está consciente, orientada y puede expresar lo que siente.',actionId:'listen'},
      'observe:chest':{title:'Respiración observada',text:'La respiración está acelerada en el contexto de ansiedad del escenario.'},
      'bp:arm':{title:'Presión arterial',text:'TA simulada: 128/80 mmHg.',actionId:'vitals'},
      'oximeter:hand':{title:'Oximetría',text:'SpO₂ simulada: 98%.',actionId:'vitals'},
      'observe:legs':{title:'Entorno y seguridad',text:'No se observan datos físicos prioritarios; el escenario espera reducir estímulos y mantener un ambiente seguro.',actionId:'environment'}
    }},
    'dispositivos-01':{defaultHint:'Explorá el brazo, la zona central y el estado general antes de registrar balance.',findings:{
      'observe:head':{title:'Estado general',text:'Omar está consciente, orientado y estable.',actionId:'identity'},
      'observe:arm':{title:'Acceso periférico',text:'El sitio se observa fijado y sin hallazgos visibles de alarma en este escenario.',actionId:'ivsite'},
      'dressing:arm':{title:'Fijación del acceso',text:'La simulación permite revisar la fijación sin manipular ni insertar el dispositivo.',actionId:'ivsite'},
      'observe:abdomen':{title:'Sistema urinario simulado',text:'El sistema se presenta cerrado; integrá el volumen observado al balance.',actionId:'urinary'},
      'bp:arm':{title:'Presión arterial',text:'TA simulada: 124/76 mmHg.',actionId:'vitals'},
      'oximeter:hand':{title:'Oximetría',text:'SpO₂ simulada: 97%.',actionId:'vitals'}
    }}
  });
})();