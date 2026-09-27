(() => {
  if (!Array.isArray(window.NURSING_CASES)) return;

  window.NURSING_CASES.push(
    {
      id: 'cardiovascular-01', number: '05', area: 'Cardiovascular', difficulty: 'Intermedio', icon: '❤️',
      patient: { name: 'Ricardo P.', firstName: 'Ricardo', age: 61, profile: 'adult-man', room: '210', status: 'Dolor torácico en estudio', complaint: 'Refiere opresión torácica de inicio reciente y preocupación.' },
      vitals: { bp: '158/92', hr: 104, rr: 22, temp: '36,7', sat: 94 },
      improvedVitals: { sat: 95, status: 'Más tranquilo y monitorizado' },
      history: [['Motivo de ingreso','Dolor torácico en evaluación'],['Antecedentes','HTA · tabaquismo previo'],['Estado','Consciente y orientado'],['Prioridad','Valoración y vigilancia']],
      objective: 'Realizá una valoración ordenada, explorá síntomas relevantes, revisá indicaciones del escenario y documentá tus hallazgos.',
      questions: [
        { id:'pain', label:'¿Cómo describiría la molestia?', answer:'Es una presión en el centro del pecho; empezó hace poco.', points:5 },
        { id:'onset', label:'¿Qué estaba haciendo cuando comenzó?', answer:'Estaba caminando despacio cuando apareció.', points:5 },
        { id:'radiation', label:'¿La molestia se desplaza hacia otra zona?', answer:'La siento principalmente en el pecho.', points:4 },
        { id:'allergy', label:'¿Tiene alergias conocidas?', answer:'No conozco alergias a medicamentos.', points:4 },
        { id:'meal', label:'¿Qué comió de postre?', answer:'No recuerdo bien; creo que una fruta.', points:0 }
      ],
      actions: [
        { id:'identity', icon:'🪪', title:'Verificar identidad', text:'Confirmar datos del paciente.', points:5, feedback:'Identidad verificada dentro del escenario.' },
        { id:'vitals', icon:'❤️', title:'Controlar signos vitales', text:'Registrar parámetros iniciales.', points:7, feedback:'Registraste los parámetros del caso.' },
        { id:'pain', icon:'📊', title:'Caracterizar el dolor', text:'Explorar inicio, características y evolución.', points:9, feedback:'Completaste una valoración estructurada del síntoma.' },
        { id:'monitor', icon:'🖥️', title:'Mantener vigilancia del caso', text:'Observar evolución y cambios del escenario.', points:7, feedback:'Organizaste la vigilancia del paciente dentro de la simulación.' },
        { id:'orders', icon:'📋', title:'Revisar indicaciones', text:'Consultar indicaciones y protocolo del escenario.', points:7, feedback:'Revisaste las indicaciones antes de avanzar.', evolves:true },
        { id:'walk', icon:'🚶', title:'Indicar caminata para probar tolerancia', text:'Solicitar esfuerzo en este momento.', points:0, feedback:'No es una prioridad útil en este escenario. Primero corresponde completar la valoración y seguir las indicaciones.' }
      ],
      medication: { order:'Medicamento E: 300 mg', available:'150 mg / 5 mL', answer:10, explanation:'Si 150 mg corresponden a 5 mL, 300 mg corresponden a 10 mL.' },
      drip: { volume:500, hours:5, factor:20, drops:33, pump:100 },
      recordHint:'características del dolor, signos vitales, evolución, indicaciones revisadas y acciones realizadas'
    },
    {
      id: 'respiratorio-02', number: '06', area: 'Oxigenoterapia', difficulty: 'Intermedio', icon: '🫁',
      patient: { name: 'Elena S.', firstName: 'Elena', age: 72, profile: 'older-woman', room: '207', status: 'Saturación disminuida', complaint: 'Presenta disnea y saturación reducida dentro del escenario educativo.' },
      vitals: { bp: '138/84', hr: 98, rr: 26, temp: '37,8', sat: 89 },
      improvedVitals: { sat: 93, status: 'Respuesta favorable simulada' },
      history: [['Motivo de ingreso','Disnea y tos'],['Antecedentes','Enfermedad respiratoria crónica referida'],['Estado','Consciente · fatigada'],['Consigna','Seguir indicación de oxigenoterapia simulada']],
      objective:'Priorizá la valoración respiratoria, verificá la indicación del escenario, practicá oxigenoterapia simulada y reevaluá.',
      questions:[
        { id:'breathing', label:'¿Qué siente al respirar?', answer:'Me cuesta más cuando hablo o me muevo.', points:6 },
        { id:'baseline', label:'¿Usa algún dispositivo respiratorio habitualmente?', answer:'Tengo controles y tratamiento indicado por mi equipo de salud.', points:5 },
        { id:'allergy', label:'¿Tiene alergias conocidas?', answer:'No conozco alergias.', points:4 },
        { id:'cough', label:'¿Tiene tos?', answer:'Sí, desde hace unos días.', points:5 },
        { id:'tv', label:'¿Qué programa estaba mirando?', answer:'Un noticiero.', points:0 }
      ],
      actions:[
        { id:'identity', icon:'🪪', title:'Verificar identidad', text:'Confirmar datos antes de intervenir.', points:5, feedback:'Identidad verificada.' },
        { id:'vitals', icon:'❤️', title:'Controlar signos vitales', text:'Registrar parámetros del escenario.', points:7, feedback:'Registraste los signos vitales y la saturación.' },
        { id:'resp', icon:'🫁', title:'Valorar patrón respiratorio', text:'Observar frecuencia, esfuerzo y tolerancia.', points:9, feedback:'Completaste la valoración respiratoria.' },
        { id:'orders', icon:'📋', title:'Revisar indicación de oxigenoterapia', text:'Confirmar el dispositivo y parámetros indicados por el ejercicio.', points:7, feedback:'Verificaste la indicación simulada antes de colocar el dispositivo.' },
        { id:'reassess', icon:'🔁', title:'Reevaluar respuesta', text:'Volver a observar saturación y confort.', points:7, feedback:'La simulación muestra mejoría de la saturación tras la intervención indicada.', evolves:true },
        { id:'guess', icon:'🎲', title:'Elegir oxígeno al azar', text:'Seleccionar dispositivo sin consultar la indicación.', points:0, feedback:'El escenario espera que primero verifiques la indicación y el protocolo institucional.' }
      ],
      medication:{ order:'Medicamento F: 200 mg', available:'400 mg / 4 mL', answer:2, explanation:'200 mg representan la mitad de 400 mg; corresponden 2 mL.' },
      drip:{ volume:500, hours:8, factor:20, drops:21, pump:62.5 },
      recordHint:'patrón respiratorio, SpO₂, dispositivo indicado en la simulación, respuesta y reevaluación'
    },
    {
      id: 'medicacion-01', number: '07', area: 'Medicaciones', difficulty: 'Intermedio', icon: '💉',
      patient: { name: 'Carla D.', firstName: 'Carla', age: 46, profile: 'adult-woman', room: '116', status: 'Tratamiento indicado', complaint: 'Paciente estable con una administración de medicación ficticia pendiente dentro del ejercicio.' },
      vitals:{ bp:'122/76', hr:82, rr:17, temp:'36,6', sat:98 },
      improvedVitals:{ sat:98, status:'Procedimiento verificado' },
      history:[['Situación','Administración simulada de medicación'],['Estado','Consciente y orientada'],['Alergias','Deben verificarse en la entrevista'],['Consigna','Aplicar controles de seguridad del ejercicio']],
      objective:'Completá entrevista, cálculos, verificaciones de seguridad y la administración simulada sin utilizar un medicamento real.',
      questions:[
        { id:'allergy', label:'¿Tiene alergias conocidas?', answer:'No conozco alergias a medicamentos.', points:6 },
        { id:'meds', label:'¿Qué medicación toma habitualmente?', answer:'Tengo tratamiento indicado, pero traje la lista para que la revisen.', points:4 },
        { id:'prior', label:'¿Recibió alguna medicación recientemente?', answer:'Sí, está anotada en el registro de la habitación.', points:5 },
        { id:'symptom', label:'¿Cómo se siente ahora?', answer:'Me siento bien, un poco cansada.', points:5 },
        { id:'music', label:'¿Qué música escucha?', answer:'Pop y rock.', points:0 }
      ],
      actions:[
        { id:'identity', icon:'🪪', title:'Verificar identidad', text:'Confirmar datos con los identificadores del escenario.', points:6, feedback:'Identidad verificada.' },
        { id:'allergies', icon:'⚠️', title:'Verificar alergias', text:'Confirmar alergias antes del procedimiento.', points:7, feedback:'Verificaste alergias dentro del caso.' },
        { id:'orders', icon:'📋', title:'Revisar indicación y registro', text:'Comparar indicación, cálculo y registro disponible.', points:8, feedback:'Revisaste la indicación y el registro antes de administrar.' },
        { id:'vitals', icon:'❤️', title:'Valorar estado previo', text:'Registrar parámetros y condición general.', points:6, feedback:'Completaste la valoración previa.' },
        { id:'reassess', icon:'🔁', title:'Registrar y reevaluar', text:'Documentar la administración simulada y observar respuesta.', points:8, feedback:'Completaste el cierre y reevaluación del procedimiento.', evolves:true },
        { id:'skip', icon:'⏩', title:'Administrar sin revisar datos', text:'Omitir controles previos.', points:0, feedback:'En el ejercicio faltan verificaciones esenciales antes de continuar.' }
      ],
      medication:{ order:'Medicamento G: 180 mg', available:'90 mg / 3 mL', answer:6, explanation:'90 mg corresponden a 3 mL; 180 mg corresponden al doble, 6 mL.' },
      drip:{ volume:250, hours:2, factor:20, drops:42, pump:125 },
      recordHint:'identidad, alergias, indicación simulada, cálculo, vía indicada en el ejercicio, registro y respuesta'
    },
    {
      id:'urgencias-01', number:'08', area:'Urgencias', difficulty:'Avanzado', icon:'🚨',
      patient:{ name:'Nicolás A.', firstName:'Nicolás', age:29, profile:'adult-man', room:'Shock room simulado', status:'Evaluación prioritaria', complaint:'Ingresa con mareo intenso, palidez y sensación de debilidad dentro de un escenario de entrenamiento.' },
      vitals:{ bp:'92/58', hr:118, rr:24, temp:'36,3', sat:95 },
      improvedVitals:{ sat:96, status:'En vigilancia simulada' },
      history:[['Ingreso','Escenario de urgencias'],['Estado','Consciente · ansioso'],['Dato inicial','Taquicardia e hipotensión en el ejercicio'],['Objetivo','Priorización y reevaluación']],
      objective:'Organizá una valoración inicial priorizada, evitá acciones que demoren la evaluación y documentá cambios del escenario.',
      questions:[
        { id:'onset', label:'¿Cuándo comenzó el mareo?', answer:'De golpe, hace poco rato.', points:5 },
        { id:'bleeding', label:'¿Tuvo sangrado o pérdida de líquidos?', answer:'No vi sangrado, pero estuve con malestar y casi no tomé líquidos.', points:5 },
        { id:'pain', label:'¿Tiene dolor?', answer:'No tengo un dolor fuerte ahora.', points:4 },
        { id:'allergy', label:'¿Tiene alergias conocidas?', answer:'No conozco alergias.', points:4 },
        { id:'sport', label:'¿Qué deporte practica?', answer:'Juego al fútbol de vez en cuando.', points:0 }
      ],
      actions:[
        { id:'identity', icon:'🪪', title:'Identificar y orientar', text:'Confirmar identidad mientras se organiza la evaluación.', points:5, feedback:'Paciente identificado y orientado dentro del escenario.' },
        { id:'vitals', icon:'❤️', title:'Control inmediato de parámetros', text:'Registrar signos vitales y tendencia.', points:9, feedback:'Detectaste taquicardia e hipotensión del escenario.' },
        { id:'consciousness', icon:'🧠', title:'Valorar estado neurológico', text:'Observar respuesta y orientación.', points:7, feedback:'El paciente está consciente y responde adecuadamente.' },
        { id:'orders', icon:'📋', title:'Activar circuito del escenario', text:'Seguir las indicaciones y prioridades institucionales simuladas.', points:7, feedback:'Organizaste el circuito de atención del ejercicio.' },
        { id:'reassess', icon:'🔁', title:'Reevaluar', text:'Volver a controlar cambios y respuesta.', points:7, feedback:'Completaste la reevaluación del caso.', evolves:true },
        { id:'wait', icon:'⏳', title:'Esperar sin controlar parámetros', text:'Demorar la valoración inicial.', points:0, feedback:'La situación planteada requiere priorizar valoración y vigilancia dentro del ejercicio.' }
      ],
      medication:{ order:'Medicamento H: 240 mg', available:'120 mg / 4 mL', answer:8, explanation:'120 mg corresponden a 4 mL; 240 mg corresponden a 8 mL.' },
      drip:{ volume:1000, hours:10, factor:20, drops:33, pump:100 },
      recordHint:'estado inicial, parámetros, prioridades, intervenciones simuladas y reevaluación'
    }
  );

  window.NURSING_CASE_ROADMAP = (window.NURSING_CASE_ROADMAP || []).filter(([name]) => !['Cardiovascular','Oxigenoterapia','Urgencias','Administración de medicación'].includes(name));
})();