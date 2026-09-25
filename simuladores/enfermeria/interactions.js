window.NURSING_INTERACTIONS = {
  tools: [
    { id:'observe', icon:'👁️', name:'Observar' },
    { id:'stethoscope', icon:'🩺', name:'Estetoscopio' },
    { id:'bp', icon:'🫀', name:'Tensiómetro' },
    { id:'oximeter', icon:'🖐️', name:'Oxímetro' },
    { id:'glucose', icon:'🩸', name:'Glucómetro' },
    { id:'dressing', icon:'🩹', name:'Curación / apósito' }
  ],
  zones: [
    { id:'head', label:'Cabeza', short:'Cabeza' },
    { id:'chest', label:'Tórax', short:'Tórax' },
    { id:'arm', label:'Brazo', short:'Brazo' },
    { id:'hand', label:'Mano / dedo', short:'Mano' },
    { id:'abdomen', label:'Abdomen / zona central', short:'Abdomen' },
    { id:'legs', label:'Miembros inferiores', short:'Piernas' }
  ],
  cases: {
    'respiratorio-01': {
      defaultHint:'Probá observar el tórax, usar el estetoscopio o controlar parámetros con los instrumentos.',
      findings: {
        'observe:chest': { title:'Observación del tórax', text:'En el escenario se aprecia respiración algo acelerada y mayor esfuerzo al hablar.', actionId:'resp' },
        'stethoscope:chest': { title:'Auscultación simulada', text:'El simulador presenta ruidos respiratorios alterados como dato educativo del caso. Relacionalos con la clínica y la bibliografía de tu cátedra.', actionId:'resp' },
        'bp:arm': { title:'Control de presión arterial', text:'TA simulada: 150/90 mmHg.', actionId:'vitals' },
        'oximeter:hand': { title:'Oximetría', text:'SpO₂ simulada inicial: 91%.', actionId:'vitals' },
        'observe:head': { title:'Estado general', text:'Paciente consciente, orientada y capaz de responder preguntas.', actionId:'identity' }
      }
    },
    'metabolico-01': {
      defaultHint:'En este cuadro son especialmente útiles la observación, el control de signos y el glucómetro.',
      findings: {
        'observe:head': { title:'Estado general', text:'Se observa sudoración y cierta inquietud; el paciente responde coherentemente.', actionId:'consciousness' },
        'glucose:hand': { title:'Glucemia capilar simulada', text:'El escenario revela un valor bajo de glucemia capilar para el objetivo educativo. Integralo con temblor, sudoración y baja ingesta.', actionId:'glucose' },
        'bp:arm': { title:'Control de presión arterial', text:'TA simulada: 125/78 mmHg.', actionId:'vitals' },
        'oximeter:hand': { title:'Oximetría', text:'SpO₂ simulada: 97%.', actionId:'vitals' },
        'observe:legs': { title:'Seguridad', text:'No hay un hallazgo prioritario en miembros inferiores para este caso; evitá hacer caminar al paciente solo mientras persistan los síntomas.' }
      }
    },
    'quirurgico-01': {
      defaultHint:'Explorá el estado general, el sitio quirúrgico y los parámetros disponibles antes de avanzar.',
      findings: {
        'observe:head': { title:'Estado general', text:'Paciente consciente y orientada; refiere dolor y algo de náuseas.' },
        'observe:abdomen': { title:'Sitio quirúrgico simulado', text:'El apósito se observa íntegro dentro de este escenario.', actionId:'wound' },
        'dressing:abdomen': { title:'Revisión de apósito', text:'El ejercicio permite revisar fijación e integridad del apósito sin realizar una técnica real.', actionId:'wound' },
        'bp:arm': { title:'Control de presión arterial', text:'TA simulada: 118/72 mmHg.', actionId:'vitals' },
        'oximeter:hand': { title:'Oximetría', text:'SpO₂ simulada: 96%.', actionId:'vitals' },
        'observe:legs': { title:'Movilidad y confort', text:'La paciente refiere mayor dolor al moverse; el dato se integra con la valoración de dolor.', actionId:'pain' }
      }
    },
    'adulto-mayor-01': {
      defaultHint:'Priorizá seguridad, estado general, parámetros y datos relacionados con hidratación.',
      findings: {
        'observe:head': { title:'Estado general', text:'Paciente consciente y orientado; refiere mareo al incorporarse.' },
        'observe:legs': { title:'Riesgo de caída', text:'El escenario muestra inestabilidad al intentar incorporarse, un dato importante para la seguridad.', actionId:'fall' },
        'bp:arm': { title:'Control de presión arterial', text:'TA simulada: 105/65 mmHg.', actionId:'vitals' },
        'oximeter:hand': { title:'Oximetría', text:'SpO₂ simulada: 96%.', actionId:'vitals' },
        'observe:hand': { title:'Observación periférica', text:'La información del ejercicio debe integrarse con la baja ingesta y la eliminación referida.', actionId:'hydration' }
      }
    }
  }
};

if (!document.querySelector('script[data-procedure-engine]')) {
  const procedureScript = document.createElement('script');
  procedureScript.src = './procedures.js';
  procedureScript.dataset.procedureEngine = 'true';
  document.body.appendChild(procedureScript);
}
