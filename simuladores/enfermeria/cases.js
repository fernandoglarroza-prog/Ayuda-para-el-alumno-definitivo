window.NURSING_CASES = [
  {
    id: 'respiratorio-01', number: '01', area: 'Clínica médica', difficulty: 'Inicial', icon: '🫁',
    patient: { name: 'Marta G.', firstName: 'Marta', age: 67, profile: 'older-woman', room: '204', status: 'Disnea leve', complaint: 'Consulta por tos, fiebre y sensación de falta de aire.' },
    vitals: { bp: '150/90', hr: 102, rr: 24, temp: '38,4', sat: 91 },
    improvedVitals: { sat: 93, status: 'Más confortable' },
    history: [
      ['Motivo de ingreso', 'Cuadro respiratorio febril'], ['Antecedentes', 'HTA · diabetes tipo 2'],
      ['Estado', 'Consciente y orientada'], ['Acceso venoso', 'Vía periférica permeable']
    ],
    objective: 'Completá la valoración inicial, entrevistá a la paciente, resolvé los dos cálculos y redactá un registro breve.',
    questions: [
      { id: 'breathing', label: '¿Desde cuándo siente que le falta el aire?', answer: 'Desde esta mañana. Al caminar hasta el baño me falta más el aire.', points: 6 },
      { id: 'allergy', label: '¿Tiene alergias conocidas?', answer: 'No conozco ninguna alergia a medicamentos.', points: 5 },
      { id: 'meds', label: '¿Toma medicación habitualmente?', answer: 'Sí, tomo medicación para la presión y para la diabetes.', points: 4 },
      { id: 'pain', label: '¿Tiene dolor o molestias en el pecho?', answer: 'No tengo dolor fuerte; siento el pecho cargado cuando toso.', points: 5 },
      { id: 'breakfast', label: '¿Qué desayunó hoy?', answer: 'Tomé té y comí dos tostadas temprano.', points: 0 }
    ],
    actions: [
      { id: 'identity', icon: '🪪', title: 'Verificar identidad', text: 'Confirmar datos del paciente antes de continuar.', points: 5, feedback: 'Identidad verificada dentro del escenario.' },
      { id: 'vitals', icon: '❤️', title: 'Controlar signos vitales', text: 'Registrar los valores iniciales del caso.', points: 8, feedback: 'Registraste TA, FC, FR, temperatura y SpO₂.' },
      { id: 'resp', icon: '🫁', title: 'Valorar patrón respiratorio', text: 'Observar frecuencia, esfuerzo y síntomas referidos.', points: 10, feedback: 'Detectás taquipnea leve y disnea referida con el esfuerzo.' },
      { id: 'orders', icon: '📋', title: 'Revisar indicaciones', text: 'Consultar qué está indicado en el caso antes de administrar.', points: 7, feedback: 'Revisaste las indicaciones simuladas antes de preparar elementos.' },
      { id: 'position', icon: '🛏️', title: 'Favorecer confort y reevaluar', text: 'Modificar la posición dentro del ejercicio y volver a observar.', points: 5, feedback: 'Marta refiere sentirse un poco más cómoda. En esta simulación, la SpO₂ pasa a 93%.', evolves: true },
      { id: 'family', icon: '👥', title: 'Llamar a un familiar', text: 'Acción posible, aunque no es prioritaria para los objetivos actuales.', points: 0, feedback: 'Podría ser útil en otro momento, pero no aporta a la prioridad planteada en este ejercicio.' }
    ],
    medication: { order: 'Medicamento A: 250 mg', available: '500 mg / 5 mL', answer: 2.5, explanation: '500 mg están contenidos en 5 mL, por lo que 250 mg corresponden a la mitad del volumen.' },
    drip: { volume: 1000, hours: 8, factor: 20, drops: 42, pump: 125 },
    recordHint: 'paciente consciente y orientada, patrón respiratorio, signos vitales y acciones realizadas'
  },
  {
    id: 'metabolico-01', number: '02', area: 'Metabólico', difficulty: 'Inicial', icon: '🍬',
    patient: { name: 'Lucas M.', firstName: 'Lucas', age: 52, profile: 'adult-man', room: '118', status: 'Débil y sudoroso', complaint: 'Refiere temblor, debilidad y sudoración de comienzo reciente.' },
    vitals: { bp: '125/78', hr: 108, rr: 20, temp: '36,4', sat: 97 },
    improvedVitals: { sat: 97, status: 'Más tranquilo' },
    history: [
      ['Motivo de consulta', 'Debilidad · temblor · sudoración'], ['Antecedentes', 'Diabetes tipo 2'],
      ['Estado', 'Consciente · algo ansioso'], ['Dato inicial', 'Comió poco durante el día']
    ],
    objective: 'Recabá datos, priorizá la valoración, resolvé los cálculos y elaborá un registro del episodio simulado.',
    questions: [
      { id: 'onset', label: '¿Cuándo comenzaron los síntomas?', answer: 'Hace unos veinte minutos, mientras estaba sentado.', points: 5 },
      { id: 'food', label: '¿Cuándo fue su última comida?', answer: 'Al mediodía. Después casi no comí nada.', points: 5 },
      { id: 'diabetes', label: '¿Cómo maneja habitualmente su diabetes?', answer: 'Tengo medicación indicada y controles periódicos.', points: 5 },
      { id: 'allergy', label: '¿Tiene alergias conocidas?', answer: 'No conozco alergias a medicamentos.', points: 5 },
      { id: 'tv', label: '¿Qué estaba mirando en televisión?', answer: 'Un partido. Los síntomas empezaron después.', points: 0 }
    ],
    actions: [
      { id: 'identity', icon: '🪪', title: 'Verificar identidad', text: 'Confirmar datos antes de continuar.', points: 5, feedback: 'Identidad verificada dentro del escenario.' },
      { id: 'consciousness', icon: '🧠', title: 'Valorar estado de conciencia', text: 'Observar respuesta, orientación y seguridad.', points: 8, feedback: 'Lucas está consciente, orientado y puede responder preguntas.' },
      { id: 'glucose', icon: '🩸', title: 'Control simulado de glucemia', text: 'Obtener el dato clave planteado por el escenario.', points: 10, feedback: 'El caso revela un valor de glucemia capilar bajo para el objetivo del ejercicio. Debés relacionarlo con los síntomas y las indicaciones docentes.' },
      { id: 'vitals', icon: '❤️', title: 'Controlar signos vitales', text: 'Registrar parámetros actuales.', points: 7, feedback: 'Registraste los parámetros y detectaste taquicardia.' },
      { id: 'orders', icon: '📋', title: 'Revisar indicaciones y protocolo', text: 'Consultar las pautas del escenario antes de avanzar.', points: 5, feedback: 'Revisaste las indicaciones y el protocolo educativo antes de continuar.', evolves: true },
      { id: 'walk', icon: '🚶', title: 'Hacer caminar al paciente', text: 'Probar tolerancia al esfuerzo en este momento.', points: 0, feedback: 'No es una prioridad útil para este escenario y puede aumentar el riesgo de caída. Revisá primero los datos disponibles.' }
    ],
    medication: { order: 'Medicamento B: 400 mg', available: '200 mg / 5 mL', answer: 10, explanation: 'Si 200 mg corresponden a 5 mL, 400 mg corresponden al doble: 10 mL.' },
    drip: { volume: 500, hours: 4, factor: 20, drops: 42, pump: 125 },
    recordHint: 'síntomas referidos, estado de conciencia, signos vitales, dato de glucemia del ejercicio y acciones realizadas'
  },
  {
    id: 'quirurgico-01', number: '03', area: 'Enfermería quirúrgica', difficulty: 'Intermedio', icon: '🩹',
    patient: { name: 'Sofía R.', firstName: 'Sofía', age: 34, profile: 'adult-woman', room: '312', status: 'Postoperatorio', complaint: 'Se encuentra en recuperación y refiere dolor en la zona quirúrgica.' },
    vitals: { bp: '118/72', hr: 96, rr: 18, temp: '37,2', sat: 96 },
    improvedVitals: { sat: 96, status: 'Confort mejorado' },
    history: [
      ['Situación', 'Postoperatorio reciente'], ['Antecedentes', 'Sin datos relevantes informados'],
      ['Estado', 'Consciente y orientada'], ['Dispositivos', 'Acceso periférico · drenaje simulado']
    ],
    objective: 'Realizá una valoración postoperatoria ordenada, identificá datos relevantes, resolvé cálculos y registrá tu intervención.',
    questions: [
      { id: 'pain', label: '¿Cómo describiría el dolor y cuánto le molesta?', answer: 'Es un dolor localizado, más fuerte cuando me muevo.', points: 6 },
      { id: 'nausea', label: '¿Tiene náuseas o ganas de vomitar?', answer: 'Un poco de náuseas, pero no vomité.', points: 4 },
      { id: 'allergy', label: '¿Tiene alergias conocidas?', answer: 'No conozco alergias.', points: 5 },
      { id: 'urine', label: '¿Pudo orinar desde la cirugía?', answer: 'Todavía no desde que volví a la habitación.', points: 5 },
      { id: 'music', label: '¿Qué música prefiere escuchar?', answer: 'Me gusta el rock nacional.', points: 0 }
    ],
    actions: [
      { id: 'identity', icon: '🪪', title: 'Verificar identidad', text: 'Confirmar datos de la paciente.', points: 5, feedback: 'Identidad verificada dentro del caso.' },
      { id: 'vitals', icon: '❤️', title: 'Controlar signos vitales', text: 'Registrar parámetros de recuperación.', points: 7, feedback: 'Registraste los parámetros disponibles.' },
      { id: 'wound', icon: '🩹', title: 'Observar sitio quirúrgico', text: 'Valorar el aspecto presentado por el escenario.', points: 8, feedback: 'El apósito se observa íntegro en esta simulación. Registrá el hallazgo.' },
      { id: 'drain', icon: '🧴', title: 'Valorar drenaje simulado', text: 'Observar fijación y características mostradas.', points: 7, feedback: 'Revisaste el drenaje y sus características simuladas.' },
      { id: 'pain', icon: '📊', title: 'Valorar dolor', text: 'Cuantificar y relacionar el dolor con el movimiento.', points: 8, feedback: 'Completaste la valoración de dolor y confort.', evolves: true },
      { id: 'food', icon: '🍔', title: 'Ofrecer una comida completa', text: 'Avanzar alimentación sin revisar indicaciones.', points: 0, feedback: 'Antes de avanzar con alimentación en un postoperatorio, este ejercicio espera que revises las indicaciones correspondientes.' }
    ],
    medication: { order: 'Medicamento C: 375 mg', available: '250 mg / 5 mL', answer: 7.5, explanation: '250 mg corresponden a 5 mL; 375 mg equivalen a una vez y media esa dosis, es decir 7,5 mL.' },
    drip: { volume: 500, hours: 6, factor: 20, drops: 28, pump: 83.3 },
    recordHint: 'estado general, dolor, signos vitales, sitio quirúrgico, drenaje simulado y acciones realizadas'
  },
  {
    id: 'adulto-mayor-01', number: '04', area: 'Adulto mayor', difficulty: 'Intermedio', icon: '👴',
    patient: { name: 'Juan C.', firstName: 'Juan', age: 76, profile: 'older-man', room: '226', status: 'Mareo al incorporarse', complaint: 'Refiere debilidad, sed y mareos al intentar levantarse.' },
    vitals: { bp: '105/65', hr: 101, rr: 19, temp: '37,0', sat: 96 },
    improvedVitals: { sat: 96, status: 'Seguro y acompañado' },
    history: [
      ['Motivo de ingreso', 'Debilidad · mareos · baja ingesta'], ['Antecedentes', 'HTA'],
      ['Estado', 'Consciente y orientado'], ['Riesgo', 'Inestabilidad al incorporarse']
    ],
    objective: 'Priorizá seguridad y valoración, investigá la ingesta, resolvé los cálculos y documentá el caso.',
    questions: [
      { id: 'fluids', label: '¿Cuánto líquido tomó hoy?', answer: 'Muy poco. Casi no tuve ganas de tomar agua.', points: 5 },
      { id: 'dizziness', label: '¿Cuándo aparece el mareo?', answer: 'Sobre todo cuando me siento o me pongo de pie.', points: 5 },
      { id: 'urine', label: '¿Notó cambios al orinar?', answer: 'Fui pocas veces desde ayer.', points: 5 },
      { id: 'meds', label: '¿Toma medicación habitualmente?', answer: 'Sí, tengo medicación indicada para la presión.', points: 5 },
      { id: 'weather', label: '¿Le gusta el clima de hoy?', answer: 'Prefiero cuando no hace tanto calor.', points: 0 }
    ],
    actions: [
      { id: 'identity', icon: '🪪', title: 'Verificar identidad', text: 'Confirmar datos antes de continuar.', points: 5, feedback: 'Identidad verificada.' },
      { id: 'fall', icon: '⚠️', title: 'Valorar riesgo de caída', text: 'Relacionar mareo e inestabilidad con seguridad.', points: 8, feedback: 'Identificaste un riesgo de caída relevante para el caso.' },
      { id: 'vitals', icon: '❤️', title: 'Controlar signos vitales', text: 'Registrar los parámetros disponibles.', points: 7, feedback: 'Registraste los valores y detectaste presión relativamente baja para el contexto simulado.' },
      { id: 'hydration', icon: '💧', title: 'Valorar hidratación', text: 'Reunir datos sobre ingesta, eliminación y signos del escenario.', points: 8, feedback: 'Los datos del ejercicio sugieren baja ingesta y requieren integrar balance y observación clínica.' },
      { id: 'orders', icon: '📋', title: 'Revisar indicaciones', text: 'Consultar la pauta educativa antes de continuar.', points: 7, feedback: 'Revisaste las indicaciones y organizaste la secuencia del caso.', evolves: true },
      { id: 'walk', icon: '🚶', title: 'Pedirle que camine solo', text: 'Probar marcha sin asistencia.', points: 0, feedback: 'Con mareos al incorporarse, el escenario espera que priorices primero la seguridad y la valoración.' }
    ],
    medication: { order: 'Medicamento D: 150 mg', available: '300 mg / 6 mL', answer: 3, explanation: '150 mg representan la mitad de 300 mg, por lo que corresponden 3 mL de una presentación de 6 mL.' },
    drip: { volume: 1000, hours: 12, factor: 20, drops: 28, pump: 83.3 },
    recordHint: 'estado general, mareos, seguridad, ingesta, eliminación, signos vitales y acciones realizadas'
  }
];

window.NURSING_CASE_ROADMAP = [
  ['Cardiovascular', '❤️'], ['Pediatría', '👶'], ['Materno-infantil', '🤰'], ['Curaciones', '🩹'],
  ['Oxigenoterapia', '🫁'], ['Urgencias', '🚨'], ['Salud mental', '🧠'], ['Administración de medicación', '💉']
];
