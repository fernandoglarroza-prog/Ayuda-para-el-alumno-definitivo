(() => {
  if (!Array.isArray(window.NURSING_CASES)) return;
  const ids = new Set(window.NURSING_CASES.map(c => c.id));
  const pack = [
    {
      id:'pediatria-01', number:'09', area:'Pediatría', difficulty:'Intermedio', icon:'👧',
      patient:{ name:'Mateo P.', firstName:'Mateo', age:8, profile:'child-boy', room:'P-12', status:'Febril y cansado', complaint:'Consulta acompañado por un adulto responsable por fiebre, tos y decaimiento.' },
      vitals:{ bp:'105/68', hr:110, rr:24, temp:'38,2', sat:96 }, improvedVitals:{ sat:97, status:'Más tranquilo' },
      history:[['Motivo','Fiebre · tos · decaimiento'],['Acompañante','Adulto responsable presente'],['Estado','Despierto · responde adecuadamente'],['Enfoque','Comunicación adaptada a la edad']],
      objective:'Practicá una valoración pediátrica centrada en seguridad, comunicación con el niño y acompañante, signos vitales y registro.',
      questions:[
        {id:'feel',label:'¿Cómo te sentís ahora?',answer:'Estoy cansado y me molesta la garganta cuando toso.',points:5},
        {id:'caregiver',label:'¿Desde cuándo tiene fiebre y qué observaron en casa?',answer:'El acompañante refiere fiebre desde ayer y menor actividad habitual.',points:5},
        {id:'fluids',label:'¿Pudo tomar líquidos?',answer:'Tomó algo, pero menos de lo habitual.',points:5},
        {id:'allergy',label:'¿Tiene alergias conocidas?',answer:'El acompañante no refiere alergias conocidas.',points:5},
        {id:'game',label:'¿Cuál es tu juego favorito?',answer:'Me gustan los juegos de carreras.',points:0}
      ],
      actions:[
        {id:'identity',icon:'🪪',title:'Verificar identidad y acompañante',text:'Confirmar datos y vínculo del adulto responsable.',points:5,feedback:'Identidad y acompañante verificados dentro del escenario.'},
        {id:'communication',icon:'💬',title:'Adaptar la comunicación',text:'Explicar lo que se hará con lenguaje acorde a la edad.',points:8,feedback:'La comunicación adaptada mejora la colaboración en este ejercicio.'},
        {id:'vitals',icon:'❤️',title:'Controlar signos vitales',text:'Registrar parámetros del escenario.',points:7,feedback:'Registraste los parámetros pediátricos presentados por el caso.'},
        {id:'resp',icon:'🫁',title:'Valorar respiración',text:'Observar frecuencia, esfuerzo y tolerancia.',points:8,feedback:'El escenario presenta tos y frecuencia respiratoria aumentada respecto del reposo del caso.'},
        {id:'hydration',icon:'💧',title:'Valorar ingesta e hidratación',text:'Integrar lo referido por niño y acompañante.',points:7,feedback:'Detectaste menor ingesta como dato a documentar y seguir.'},
        {id:'separate',icon:'🚪',title:'Separar al acompañante sin explicación',text:'Retirar al acompañante de forma automática.',points:0,feedback:'El escenario espera una comunicación respetuosa y centrada en el niño, considerando al adulto responsable.'}
      ],
      medication:{order:'Medicamento P: 180 mg',available:'120 mg / 5 mL',answer:7.5,explanation:'En este ejercicio matemático, 180 mg corresponden a 7,5 mL de la presentación ficticia.'},
      drip:{volume:500,hours:8,factor:20,drops:21,pump:62.5}, recordHint:'acompañante, estado general, temperatura, respiración, ingesta y comunicación adaptada'
    },
    {
      id:'materno-01', number:'10', area:'Materno-infantil', difficulty:'Intermedio', icon:'🤱',
      patient:{ name:'Valentina S.', firstName:'Valentina', age:28, profile:'postpartum-woman', room:'M-08', status:'Puerperio inmediato estable', complaint:'Refiere cansancio y molestias leves durante la recuperación postparto simulada.' },
      vitals:{ bp:'116/74',hr:88,rr:18,temp:'36,8',sat:98 }, improvedVitals:{sat:98,status:'Confort mejorado'},
      history:[['Situación','Puerperio simulado'],['Estado','Consciente · orientada'],['Acompañamiento','Binomio madre-bebé'],['Prioridad','Confort · observación · educación']],
      objective:'Realizá una valoración respetuosa del puerperio simulado, priorizando estado general, dolor, seguridad, vínculo y registro.',
      questions:[
        {id:'pain',label:'¿Tiene dolor o alguna molestia?',answer:'Tengo una molestia leve y estoy bastante cansada.',points:5},
        {id:'dizziness',label:'¿Sintió mareos al movilizarse?',answer:'Un poco al levantarme la primera vez.',points:5},
        {id:'feeding',label:'¿Cómo se siente con la alimentación del bebé?',answer:'Tengo dudas y me gustaría que me expliquen con tranquilidad.',points:5},
        {id:'support',label:'¿Cuenta con alguien que la acompañe?',answer:'Sí, tengo acompañamiento familiar.',points:5},
        {id:'tv',label:'¿Qué programa quiere mirar?',answer:'Ahora prefiero descansar.',points:0}
      ],
      actions:[
        {id:'identity',icon:'🪪',title:'Verificar identidad',text:'Confirmar datos antes de continuar.',points:5,feedback:'Identidad verificada.'},
        {id:'vitals',icon:'❤️',title:'Controlar signos vitales',text:'Registrar parámetros del escenario.',points:7,feedback:'Los parámetros simulados se mantienen estables.'},
        {id:'pain',icon:'📊',title:'Valorar dolor y confort',text:'Explorar molestias y necesidades.',points:7,feedback:'Completaste la valoración de dolor y confort.'},
        {id:'safety',icon:'⚠️',title:'Valorar seguridad al movilizarse',text:'Relacionar el mareo referido con la movilización.',points:8,feedback:'Priorizaste seguridad antes de fomentar movilización.'},
        {id:'education',icon:'🤱',title:'Ofrecer educación y apoyo',text:'Escuchar dudas y orientar según equipo/protocolo.',points:8,feedback:'El escenario valora educación respetuosa y centrada en la persona.',evolves:true},
        {id:'rush',icon:'⏩',title:'Apurar el alta sin reevaluar',text:'Finalizar rápidamente sin revisar necesidades.',points:0,feedback:'Antes del cierre, el caso requiere reevaluación y registro.'}
      ],
      medication:{order:'Medicamento M: 300 mg',available:'200 mg / 5 mL',answer:7.5,explanation:'En el ejercicio ficticio, 300 mg equivalen a 7,5 mL.'},
      drip:{volume:1000,hours:10,factor:20,drops:33,pump:100}, recordHint:'estado general, dolor, seguridad, educación brindada y respuesta de la paciente'
    },
    {
      id:'salud-mental-01', number:'11', area:'Salud mental', difficulty:'Intermedio', icon:'🧠',
      patient:{ name:'Abril D.', firstName:'Abril', age:23, profile:'young-woman', room:'SM-03', status:'Ansiedad intensa', complaint:'Refiere ansiedad, sensación de desborde y dificultad para concentrarse.' },
      vitals:{bp:'128/80',hr:104,rr:23,temp:'36,6',sat:98}, improvedVitals:{sat:98,status:'Más contenida'},
      history:[['Motivo','Ansiedad intensa'],['Estado','Consciente · orientada'],['Comunicación','Puede expresar lo que siente'],['Prioridad','Seguridad · escucha · ambiente tranquilo']],
      objective:'Practicá comunicación terapéutica, valoración de seguridad y organización de un entorno de cuidado dentro de un caso ficticio.',
      questions:[
        {id:'feeling',label:'¿Puede contarme qué está sintiendo ahora?',answer:'Siento que todo me supera y me cuesta ordenar lo que pienso.',points:5},
        {id:'trigger',label:'¿Pasó algo antes de que empezara a sentirse así?',answer:'Tuve una situación muy estresante y desde entonces estoy muy inquieta.',points:5},
        {id:'support',label:'¿Hay alguien de confianza a quien quisiera avisar?',answer:'Sí, hay una persona a la que podría llamar si hace falta.',points:4},
        {id:'safety',label:'¿Se siente segura en este momento?',answer:'Sí, me siento segura acá, pero necesito que alguien se quede cerca.',points:6},
        {id:'judge',label:'¿Por qué no puede simplemente calmarse?',answer:'Esa pregunta me hace sentir incomprendida.',points:0}
      ],
      actions:[
        {id:'identity',icon:'🪪',title:'Presentarse y verificar identidad',text:'Iniciar de forma clara y respetuosa.',points:5,feedback:'Iniciaste el vínculo de cuidado de manera adecuada.'},
        {id:'environment',icon:'🌿',title:'Reducir estímulos',text:'Favorecer un ambiente tranquilo y seguro.',points:8,feedback:'Disminuiste estímulos innecesarios en el escenario.'},
        {id:'listen',icon:'👂',title:'Escucha activa',text:'Permitir que la persona se exprese sin confrontar.',points:8,feedback:'La escucha activa aporta información y contención.'},
        {id:'safety',icon:'🛡️',title:'Valorar seguridad',text:'Explorar si se siente segura y si requiere apoyo adicional.',points:8,feedback:'Completaste una valoración explícita de seguridad.'},
        {id:'reassess',icon:'🔄',title:'Reevaluar y registrar',text:'Volver a valorar estado y documentar.',points:6,feedback:'Abril refiere sentirse más contenida luego de la intervención simulada.',evolves:true},
        {id:'argue',icon:'⚡',title:'Confrontar para que cambie de actitud',text:'Discutir para intentar convencerla.',points:0,feedback:'La confrontación no aporta al objetivo de comunicación terapéutica de este escenario.'}
      ],
      medication:{order:'Medicamento SM: 100 mg',available:'200 mg / 4 mL',answer:2,explanation:'Ejercicio matemático ficticio: 100 mg corresponden a 2 mL.'},
      drip:{volume:500,hours:5,factor:20,drops:33,pump:100}, recordHint:'estado general, comunicación, seguridad, estímulos ambientales y respuesta observada'
    },
    {
      id:'dispositivos-01', number:'12', area:'Dispositivos y balance', difficulty:'Intermedio', icon:'🧴',
      patient:{ name:'Omar L.', firstName:'Omar', age:58, profile:'adult-man', room:'220', status:'Control de dispositivos', complaint:'Paciente estable con acceso periférico y sistema urinario simulado para control de enfermería.' },
      vitals:{bp:'124/76',hr:84,rr:18,temp:'36,9',sat:97}, improvedVitals:{sat:97,status:'Control completado'},
      history:[['Situación','Paciente estable'],['Dispositivos','Acceso periférico · sistema urinario simulado'],['Objetivo','Vigilancia · seguridad · balance'],['Estado','Consciente y orientado']],
      objective:'Practicá la vigilancia de dispositivos y balance sin realizar inserciones: observación, seguridad, permeabilidad simulada y registro.',
      questions:[
        {id:'pain',label:'¿Tiene dolor o molestia en la zona del acceso?',answer:'No me duele, pero siento un poco de tirantez cuando muevo el brazo.',points:5},
        {id:'urine',label:'¿Notó alguna molestia relacionada con el sistema urinario?',answer:'No tengo dolor en este momento.',points:5},
        {id:'fluids',label:'¿Cómo viene tolerando los líquidos?',answer:'Bien, no tuve náuseas.',points:5},
        {id:'mobility',label:'¿Necesita ayuda para movilizarse?',answer:'Prefiero que me ayuden por los tubos y cables.',points:5},
        {id:'sports',label:'¿Qué deporte le gusta?',answer:'Me gusta mirar fútbol.',points:0}
      ],
      actions:[
        {id:'identity',icon:'🪪',title:'Verificar identidad',text:'Confirmar datos antes del control.',points:5,feedback:'Identidad verificada.'},
        {id:'vitals',icon:'❤️',title:'Controlar signos vitales',text:'Registrar parámetros actuales.',points:7,feedback:'Parámetros simulados estables.'},
        {id:'ivsite',icon:'💧',title:'Valorar acceso periférico',text:'Observar fijación, sitio y permeabilidad simulada.',points:8,feedback:'El escenario muestra acceso fijado, sin hallazgos visibles de alarma.'},
        {id:'urinary',icon:'🧴',title:'Valorar sistema urinario',text:'Comprobar circuito, posición y registro del volumen simulado.',points:8,feedback:'El sistema se presenta cerrado y el escenario permite registrar el volumen observado.'},
        {id:'balance',icon:'📋',title:'Actualizar balance',text:'Integrar ingresos y egresos del ejercicio.',points:7,feedback:'Actualizaste el balance hídrico simulado.',evolves:true},
        {id:'disconnect',icon:'✂️',title:'Desconectar dispositivos para movilizar',text:'Retirarlos sin indicación para facilitar movimiento.',points:0,feedback:'El escenario espera priorizar seguridad y revisar indicaciones antes de modificar dispositivos.'}
      ],
      medication:{order:'Medicamento E: 240 mg',available:'120 mg / 5 mL',answer:10,explanation:'Ejercicio matemático ficticio: 240 mg corresponden a 10 mL.'},
      drip:{volume:750,hours:6,factor:20,drops:42,pump:125}, recordHint:'estado general, acceso periférico, sistema urinario, movilidad segura y balance hídrico'
    }
  ];
  pack.forEach(c => { if (!ids.has(c.id)) window.NURSING_CASES.push(c); });
  window.NURSING_CASE_ROADMAP = [
    ['Pediatría','👧'],['Materno-infantil','🤱'],['Salud mental','🧠'],['Dispositivos y balance','🧴'],
    ['Accesos y fluidoterapia','💧'],['Cuidados respiratorios','🫁'],['Urgencias','🚨'],['Administración segura','💉']
  ];
  window.dispatchEvent(new CustomEvent('nursing-cases-updated'));
})();