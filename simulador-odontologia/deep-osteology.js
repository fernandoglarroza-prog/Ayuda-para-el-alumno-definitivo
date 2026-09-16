(() => {
  const DATA = {
    mandibula: {
      name: 'Mandíbula', badge: 'Hueso impar · móvil · viscerocráneo', modelKey: 'mandibula',
      summary: 'Hueso impar en forma de herradura que constituye el esqueleto de la arcada inferior. Presenta un cuerpo horizontal y dos ramas ascendentes. Su cóndilo participa en la ATM y su conducto mandibular aloja el paquete neurovascular alveolar inferior.',
      orientation: 'Para orientarla: proceso alveolar hacia superior; mentón hacia anterior; ramas hacia posterior; cóndilo posterior y coronoides anterior.',
      morphology: [
        ['Cuerpo', 'Tiene una base inferior y una porción alveolar superior. En la cara externa se reconocen sínfisis y protuberancia mentoniana, tubérculos mentonianos, foramen mentoniano y línea oblicua. En la cara interna se reconocen espinas mentonianas, fosas digástricas, línea milohioidea, fosa sublingual y fosa submandibular.'],
        ['Rama', 'Lámina cuadrilátera con cara lateral relacionada con masetero y cara medial relacionada con pterigoideo medial. En su cara medial se abre el foramen mandibular, protegido parcialmente por la língula, y continúa el surco milohioideo.'],
        ['Borde superior', 'Presenta apófisis coronoides por delante y proceso condilar por detrás, separados por la escotadura mandibular. El proceso condilar posee cuello y cabeza; en el cuello se encuentra la fóvea pterigoidea para el pterigoideo lateral.'],
        ['Ángulo', 'Zona de transición entre cuerpo y rama. En su cara lateral se inserta principalmente el masetero y en la medial el pterigoideo medial, formando un cabestrillo muscular alrededor del ángulo.']
      ],
      landmarks: [
        ['Foramen mandibular', 'Entrada del conducto mandibular en la cara medial de la rama. Ingresan nervio y vasos alveolares inferiores. Es una referencia esencial para la anestesia troncular.'],
        ['Língula', 'Pequeña lengüeta ósea anterior al foramen mandibular. Da inserción al ligamento esfenomandibular.'],
        ['Conducto mandibular', 'Trayecto intraóseo del paquete alveolar inferior desde el foramen mandibular hacia el cuerpo. Emite ramas dentarias y continúa hacia los componentes mentoniano e incisivo.'],
        ['Foramen mentoniano', 'Abertura de la cara externa del cuerpo por donde emerge el nervio mentoniano. Su posición es variable; con frecuencia se proyecta en región premolar.'],
        ['Línea milohioidea', 'Cresta oblicua de la cara interna del cuerpo donde se origina el músculo milohioideo. Separa topográficamente la fosa sublingual, superior, de la submandibular, inferior y posterior.'],
        ['Espinas mentonianas', 'En la línea media interna. Las superiores se relacionan con geniogloso y las inferiores con genihioideo.'],
        ['Escotadura mandibular', 'Entre coronoides y cóndilo; por ella pasan el nervio y vasos masetéricos.']
      ],
      articulations: 'La mandíbula se articula con los temporales mediante ambas ATM. Los dientes se unen al proceso alveolar por articulaciones dentoalveolares (gonfosis), no por una articulación ósea directa con otro hueso.',
      insertions: [
        ['Temporal', 'Inserción en apófisis coronoides y borde anterior de la rama; eleva y, con fibras posteriores, retrae la mandíbula.'],
        ['Masetero', 'Inserción en cara lateral de rama y ángulo; potente elevador.'],
        ['Pterigoideo medial', 'Inserción en cara medial del ángulo y rama inferior; eleva y participa en protrusión/lateralidad.'],
        ['Pterigoideo lateral', 'Inserción en fóvea pterigoidea del cuello condilar y en complejo disco-capsular; participa en protrusión y traslación.'],
        ['Milohioideo', 'Origen en línea milohioidea; forma gran parte del piso muscular de la boca.'],
        ['Geniogloso / genihioideo', 'Origen en espinas mentonianas superiores e inferiores respectivamente.'],
        ['Digástrico anterior', 'Origen en fosa digástrica cercana a la línea media.']
      ],
      neurovascular: 'El nervio alveolar inferior, rama de V3, entra por el foramen mandibular acompañado por vasos alveolares inferiores, recorre el conducto y aporta ramas dentarias. Cerca de la región premolar se divide funcionalmente en componente mentoniano, que emerge por el foramen mentoniano, e incisivo, que continúa anteriormente. Antes de entrar al foramen, el alveolar inferior da el nervio milohioideo, que sigue el surco milohioideo.',
      dental: [
        'Bloqueo del nervio alveolar inferior: la relación entre rama, foramen mandibular, língula y espacio pterigomandibular es fundamental.',
        'Terceros molares inferiores: interesa la relación con conducto mandibular y nervio lingual en la cara medial de la región posterior.',
        'Implantología: deben valorarse altura ósea, corticales, conducto mandibular y foramen mentoniano, idealmente con CBCT cuando está indicado.',
        'Panorámica: el conducto suele verse como una banda radiolúcida delimitada por corticales variables; el foramen mentoniano puede superponerse a ápices premolares y simular una lesión si no se sigue su continuidad anatómica.'
      ],
      oral: [
        ['Describa la mandíbula y oriéntela.', 'Hueso impar del viscerocráneo con cuerpo en herradura y dos ramas. Se orienta con proceso alveolar superior, mentón anterior, ramas posteriores; coronoides anterior y cóndilo posterior.'],
        ['Describa la cara medial del cuerpo mandibular.', 'Espinas mentonianas, fosas digástricas, línea milohioidea, fosa sublingual por encima/anterior y fosa submandibular por debajo/posterior.'],
        ['Explique el recorrido del paquete alveolar inferior.', 'Entra por foramen mandibular, recorre conducto mandibular, da ramas dentarias y continúa hacia componentes mentoniano e incisivo; el mentoniano emerge por el foramen mentoniano.'],
        ['¿Qué inserciones musculares deben conocerse en rama y ángulo?', 'Temporal en coronoides/borde anterior; masetero lateral; pterigoideo medial medial; pterigoideo lateral en fóvea del cuello condilar.'],
        ['Relacione mandíbula con anestesia odontológica.', 'El bloqueo alveolar inferior exige reconocer referencias de rama, espacio pterigomandibular y proximidad del foramen mandibular; la variación anatómica modifica la técnica y el éxito.']
      ]
    },
    maxilar: {
      name: 'Maxilar', badge: 'Hueso par · viscerocráneo · neumático', modelKey: 'maxilar',
      summary: 'Hueso central del macizo facial. Forma parte de la órbita, cavidad nasal, paladar duro y arcada dentaria superior. Su cuerpo contiene el seno maxilar y emite procesos frontal, cigomático, alveolar y palatino.',
      orientation: 'Para orientarlo: proceso alveolar hacia inferior; superficie orbital hacia superior; apertura nasal hacia medial; tuberosidad hacia posterior.',
      morphology: [
        ['Cuerpo', 'De forma aproximadamente piramidal, contiene el seno maxilar y presenta superficies anterior, orbital, infratemporal/posterior y nasal/medial.'],
        ['Proceso frontal', 'Asciende junto a la nariz y contribuye a la pared lateral nasal y reborde orbitario medial. Se articula con frontal, nasal y lagrimal.'],
        ['Proceso cigomático', 'Proyección lateral robusta hacia el hueso cigomático; integra el complejo cigomaticomaxilar.'],
        ['Proceso alveolar', 'Borde inferior que aloja los alvéolos de los dientes superiores. Su morfología depende de la presencia y posición de las raíces dentarias.'],
        ['Proceso palatino', 'Lámina horizontal medial que forma la mayor porción anterior del paladar duro y, superiormente, parte del piso de la cavidad nasal.']
      ],
      landmarks: [
        ['Foramen infraorbitario', 'En la superficie anterior, inferior al reborde orbitario. Emergen nervio y vasos infraorbitarios.'],
        ['Surco y conducto infraorbitarios', 'Recorren la superficie orbital y continúan hacia el foramen infraorbitario. Durante su recorrido se originan ramas alveolares superiores anteriores y, cuando existe, media.'],
        ['Fosa canina', 'Depresión de la cara anterior, lateral a la eminencia canina. Es una referencia topográfica del maxilar anterior.'],
        ['Eminencia canina', 'Prominencia relacionada con la raíz larga del canino superior.'],
        ['Tuberosidad maxilar', 'Prominencia posterior al último molar; relacionada con inserción parcial del pterigoideo medial y con los forámenes alveolares superiores posteriores.'],
        ['Forámenes alveolares posteriores', 'Dan paso a nervios y vasos alveolares superiores posteriores hacia molares y seno maxilar.'],
        ['Conducto incisivo', 'En región anterior del paladar, comunica cavidad nasal y oral y transmite estructuras nasopalatinas/vasculares.']
      ],
      articulations: 'Cada maxilar articula con frontal, etmoides, nasal, lagrimal, cigomático, palatino, concha nasal inferior, vómer y maxilar contralateral. Estas articulaciones explican su posición central en el macizo facial.',
      insertions: [
        ['Buccinador', 'Se origina parcialmente en procesos alveolares maxilar y mandibular en región molar, continuándose con el rafe pterigomandibular.'],
        ['Pterigoideo medial', 'Tiene una cabeza superficial relacionada con la tuberosidad maxilar.'],
        ['Músculos periorales/nasales', 'Diversos músculos de la expresión facial se originan alrededor de la apertura piriforme, fosa canina y región infraorbitaria.']
      ],
      neurovascular: 'V2 entra en la fosa pterigopalatina tras atravesar el foramen redondo. Su continuación infraorbitaria recorre surco y conducto infraorbitarios. Las ramas alveolares superiores posterior, media y anterior aportan sensibilidad dentaria y al seno maxilar; el patrón de la rama media es variable. El nervio infraorbitario emerge por el foramen infraorbitario para distribuirse por párpado inferior, región nasal lateral y labio superior.',
      dental: [
        'Seno maxilar: su piso puede relacionarse estrechamente con raíces de premolares y molares; la relación real varía y debe evaluarse radiográficamente.',
        'Bloqueos alveolares superiores: la tuberosidad y los forámenes alveolares posteriores son referencias para PSA; el infraorbitario permite abordar territorios ASA/MSA según anatomía individual.',
        'Paladar: el proceso palatino y el conducto incisivo son referencias para anestesia nasopalatina; el palatino mayor se estudia en conjunto con hueso palatino.',
        'Cirugía e implantología: espesor de cortical vestibular, seno, piso nasal, conducto nasopalatino y región infraorbitaria condicionan planificación.'
      ],
      oral: [
        ['Describa las cuatro superficies del cuerpo del maxilar.', 'Anterior facial, superior u orbital, posterior/infratemporal y medial/nasal. Cada una posee accidentes específicos: infraorbitario anterior; surco/canal orbital; tuberosidad y forámenes alveolares posteriores; y relieves de pared nasal.'],
        ['Nombre los procesos del maxilar.', 'Frontal, cigomático, alveolar y palatino.'],
        ['Explique la relación del maxilar con el seno maxilar.', 'El seno ocupa el cuerpo del hueso; su piso se aproxima de manera variable a raíces posteriores, mientras sus paredes se relacionan con cavidad nasal, órbita y superficies facial/infratemporal.'],
        ['¿Cómo llega V2 a los dientes superiores?', 'V2 pasa por foramen redondo a fosa pterigopalatina; ramas alveolares superiores e infraorbitaria forman el aporte sensitivo de dientes y periodonto superior.'],
        ['¿Qué accidentes de la tuberosidad son importantes en odontología?', 'Forámenes alveolares superiores posteriores y relación con PSA, vasos y plexo pterigoideo; además es región de inserción muscular y referencia quirúrgica posterior.']
      ]
    },
    temporal: {
      name: 'Hueso temporal', badge: 'Hueso par · base y pared lateral del cráneo', modelKey: 'temporal',
      summary: 'Hueso complejo que integra pared lateral y base del cráneo. Participa en la ATM, forma parte del arco cigomático y aloja estructuras del oído. Se divide para el estudio en porciones escamosa, petrosa, mastoidea y timpánica, además del proceso estiloides.',
      orientation: 'Para orientarlo: proceso cigomático hacia anterior; mastoides posterior e inferior; porción petrosa dirigida anteromedialmente; meato acústico externo lateral.',
      morphology: [
        ['Porción escamosa', 'Lámina lateral del cráneo. Emite el proceso cigomático y contiene la fosa mandibular y eminencia/tubérculo articular relacionados con ATM.'],
        ['Porción petrosa', 'Pirámide ósea muy densa de la base craneal. Aloja oído medio/interno y contiene conductos neurovasculares importantes. Su ápice se dirige anteromedialmente.'],
        ['Porción mastoidea', 'Posterior al meato acústico externo; contiene proceso mastoides y celdillas mastoideas.'],
        ['Porción timpánica', 'Rodea gran parte del conducto auditivo externo y participa en relaciones con la región mandibular.'],
        ['Proceso estiloides', 'Proyección inferomedial alargada, origen/inserción del aparato estilohioideo y músculos estiloideos.']
      ],
      landmarks: [
        ['Fosa mandibular', 'Depresión de la escama temporal donde se relaciona el cóndilo mandibular mediante el disco articular.'],
        ['Eminencia / tubérculo articular', 'Anterior a la fosa mandibular. Guía el desplazamiento anteroinferior del complejo cóndilo-disco durante la apertura amplia y protrusión.'],
        ['Fisura petrotimpánica', 'Relacionada con la ATM y con el paso de la cuerda del tímpano hacia la fosa infratemporal, donde se une al nervio lingual.'],
        ['Meato acústico externo', 'Abertura lateral del conducto auditivo externo, importante como referencia externa próxima a ATM.'],
        ['Proceso mastoides', 'Proyección posteroinferior con inserciones musculares cervicales.'],
        ['Foramen estilomastoideo', 'Salida del nervio facial del cráneo, entre regiones estiloidea y mastoidea.'],
        ['Conducto carotídeo', 'En la porción petrosa; transmite la arteria carótida interna y plexo simpático asociado.'],
        ['Meato acústico interno', 'En cara posterior de la porción petrosa; transmite principalmente nervios facial y vestibulococlear y vasos laberínticos.']
      ],
      articulations: 'Se articula con parietal, occipital, esfenoides, cigomático y mandíbula. La articulación con la mandíbula es sinovial compleja y se realiza a través del complejo disco-cóndilo dentro de la ATM.',
      insertions: [
        ['Temporal', 'Se origina ampliamente en la fosa temporal y fascia temporal, incluyendo territorio óseo temporal.'],
        ['Masetero', 'Se origina en el arco cigomático, al cual contribuye el proceso cigomático del temporal.'],
        ['Esternocleidomastoideo', 'Inserción en proceso mastoides y línea nucal superior.'],
        ['Estilohioideo, estilogloso y estilofaríngeo', 'Se originan en el proceso estiloides junto con inserciones ligamentarias del aparato estilohioideo.']
      ],
      neurovascular: 'La porción petrosa se relaciona con carótida interna, nervios facial y vestibulococlear, aparato auditivo y venas/senos de la base. La cuerda del tímpano, rama del facial, atraviesa el oído medio y sale hacia la fosa infratemporal por la fisura petrotimpánica para unirse al nervio lingual; esta relación explica la conexión entre temporal, V3 y gusto de los dos tercios anteriores de la lengua.',
      dental: [
        'ATM: deben reconocerse fosa mandibular, eminencia articular y relación con meato acústico externo.',
        'Dolor preauricular: la proximidad entre ATM, oído y territorio auriculotemporal explica superposición clínica de síntomas.',
        'Cuerda del tímpano + nervio lingual: conexión anatómica relevante para gusto y secreción salival submandibular/sublingual.',
        'Radiología: en CBCT de ATM interesa morfología condilar y componentes óseos temporales; los tejidos blandos/disco requieren otras modalidades para evaluación clínica específica.'
      ],
      oral: [
        ['Divida el temporal para su estudio.', 'Porciones escamosa, petrosa, mastoidea y timpánica, más proceso estiloides como accidente destacado.'],
        ['Describa los componentes temporales de la ATM.', 'Fosa mandibular y eminencia/tubérculo articular de la porción escamosa; el disco se interpone entre superficie temporal y cóndilo.'],
        ['¿Qué pasa por la fisura petrotimpánica y por qué importa en Odontología?', 'La cuerda del tímpano se dirige hacia la fosa infratemporal y se une al nervio lingual; aporta gusto anterior y fibras parasimpáticas preganglionares para glándulas submandibular/sublingual.'],
        ['¿Qué estructuras atraviesan el meato acústico interno?', 'Principalmente nervios facial (VII) y vestibulococlear (VIII), además de vasos laberínticos.'],
        ['Relacione temporal, arco cigomático y músculos de la masticación.', 'El proceso cigomático del temporal integra el arco, origen del masetero; la fosa temporal da origen al temporal, que se inserta en coronoides mandibular.']
      ]
    },
    esfenoides: {
      name: 'Esfenoides', badge: 'Hueso impar · centro de la base del cráneo', modelKey: 'esfenoides',
      summary: 'Hueso central de la base craneal que conecta neurocráneo y viscerocráneo. Está formado por cuerpo, alas menores, alas mayores y procesos pterigoideos. Sus conductos, fisuras y forámenes son esenciales para V1, V2, V3 y vasos meníngeos.',
      orientation: 'Para orientarlo: cuerpo en la línea media; alas menores hacia anterosuperior; alas mayores laterales; procesos pterigoideos descendiendo inferiormente.',
      morphology: [
        ['Cuerpo', 'Contiene senos esfenoidales. Superiormente forma la región selar; lateralmente se relaciona con seno cavernoso y estructuras neurovasculares.'],
        ['Alas menores', 'Proyecciones triangulares anteriores. Participan en techo orbitario posterior y límite entre fosas craneales anterior y media; terminan medialmente en procesos clinoides anteriores.'],
        ['Alas mayores', 'Amplias expansiones laterales que contribuyen a fosa craneal media, pared lateral del cráneo, órbita y fosas temporal/infratemporal. Alojan forámenes redondo, oval y espinoso.'],
        ['Procesos pterigoideos', 'Descienden desde la unión del cuerpo con alas mayores. Cada uno posee lámina medial y lateral separadas posteriormente por la fosa pterigoidea; la lámina medial termina en hamulus.']
      ],
      landmarks: [
        ['Conducto óptico', 'Entre cuerpo y ala menor; transmite nervio óptico y arteria oftálmica.'],
        ['Fisura orbitaria superior', 'Entre alas menor y mayor; comunica fosa craneal media con órbita y transmite III, IV, V1, VI y estructuras venosas/simpáticas.'],
        ['Foramen redondo', 'En ala mayor; conduce V2 desde fosa craneal media hacia fosa pterigopalatina.'],
        ['Foramen oval', 'En ala mayor; comunica fosa craneal media con fosa infratemporal. Principal paso de V3; también pueden transcurrir estructuras meníngeas/venosas y nervio petroso menor según variación.'],
        ['Foramen espinoso', 'Posterolateral al oval; transmite arteria y vena meníngeas medias y rama meníngea de V3.'],
        ['Hamulus pterigoideo', 'Gancho inferior de la lámina medial. Actúa como polea para el tendón del tensor del velo del paladar.'],
        ['Fosa pterigoidea', 'Entre láminas medial y lateral; relacionada con origen del pterigoideo medial y estructuras vecinas.'],
        ['Conducto pterigoideo', 'En la base del proceso pterigoideo; comunica región del foramen lacerum con fosa pterigopalatina y transmite nervio/vasos del conducto pterigoideo.']
      ],
      articulations: 'Articula con frontal, parietales, temporales, occipital, etmoides, cigomáticos, palatinos y vómer. Esta gran cantidad de articulaciones refleja su papel de “hueso llave” de la base craneal.',
      insertions: [
        ['Pterigoideo lateral', 'Cabeza superior relacionada con cara infratemporal del ala mayor; cabeza inferior con cara lateral de la lámina pterigoidea lateral.'],
        ['Pterigoideo medial', 'Origen profundo relacionado con cara medial de lámina lateral y fosa pterigoidea; participa también la región maxilar/palatina.'],
        ['Tensor del velo del paladar', 'Se relaciona con fosa escafoidea, espina del esfenoides y trayecto alrededor del hamulus.'],
        ['Temporal', 'Parte de su origen incluye superficie temporal del ala mayor.']
      ],
      neurovascular: 'El esfenoides organiza gran parte del tránsito neurovascular de la base: V2 atraviesa foramen redondo hacia la fosa pterigopalatina; V3 atraviesa foramen oval hacia la fosa infratemporal; la arteria meníngea media entra por foramen espinoso. La fisura orbitaria superior transmite III, IV, V1 y VI, mientras el conducto óptico transmite II y arteria oftálmica.',
      dental: [
        'Anestesia y dolor orofacial: V2 y V3 salen del cráneo a través de forámenes del esfenoides antes de distribuirse por maxilar y mandíbula.',
        'Fosas profundas: el esfenoides forma paredes y comunicaciones de las fosas infratemporal y pterigopalatina, claves para nervios dentarios y arteria maxilar.',
        'Masticación: las láminas pterigoideas y ala mayor sirven de origen a pterigoideos, fundamentales para protrusión y lateralidad mandibular.',
        'Radiología: forámenes oval/redondo/espinoso tienen valor de orientación de la base craneal; su interpretación debe respetar variaciones anatómicas.'
      ],
      oral: [
        ['Divida el esfenoides para su estudio.', 'Cuerpo, dos alas menores, dos alas mayores y dos procesos pterigoideos.'],
        ['Compare forámenes redondo, oval y espinoso.', 'Redondo: V2 hacia fosa pterigopalatina. Oval: principalmente V3 hacia fosa infratemporal. Espinoso: arteria meníngea media, vena acompañante y ramo meníngeo de V3.'],
        ['Explique la importancia odontológica de los procesos pterigoideos.', 'Dan origen a músculos pterigoideos y forman límites de fosas profundas relacionadas con V2/V3, arteria maxilar y técnicas anestésicas.'],
        ['¿Qué comunica la fisura orbitaria superior?', 'Fosa craneal media con órbita; transmite III, IV, V1, VI y estructuras venosas/simpáticas.'],
        ['Relacione esfenoides con fosa pterigopalatina.', 'El foramen redondo lleva V2 hacia ella y el conducto pterigoideo llega a su región posterior; procesos pterigoideos y cuerpo contribuyen a sus límites profundos.']
      ]
    }
  };

  const PARENT = {
    condilo_mandibular:'mandibula', coronoides_mandibular:'mandibula', escotadura_mandibular:'mandibula',
    foramen_mandibular:'mandibula', lingula_mandibular:'mandibula', conducto_mandibular:'mandibula', foramen_mentoniano:'mandibula', angulo_mandibular:'mandibula',
    foramen_infraorbitario:'maxilar', seno_maxilar:'maxilar', proceso_alveolar_maxilar:'maxilar',
    foramen_redondo:'esfenoides', foramen_oval:'esfenoides', foramen_espinoso:'esfenoides'
  };

  const style = document.createElement('style');
  style.textContent = `
    .deepOsteology{margin:32px auto;max-width:1280px;padding:0 18px}.deepHead{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:16px}.deepHead h2{margin:.25rem 0}.deepBoneTabs,.deepModeTabs{display:flex;gap:8px;flex-wrap:wrap}.deepBoneTabs button,.deepModeTabs button,.deepActions button{border:1px solid rgba(120,150,190,.35);background:rgba(255,255,255,.05);color:inherit;border-radius:999px;padding:9px 13px;font-weight:700}.deepBoneTabs button.active,.deepModeTabs button.active{background:#2563eb;color:white;border-color:#2563eb}.deepPanel{margin-top:14px;border:1px solid rgba(120,150,190,.25);border-radius:20px;background:rgba(10,20,35,.55);padding:20px}.deepTop{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:start}.deepBadge{font-size:.8rem;padding:6px 10px;border-radius:999px;background:rgba(37,99,235,.15);border:1px solid rgba(96,165,250,.3)}.deepSummary{font-size:1.02rem;line-height:1.65}.deepOrientation{padding:12px 14px;border-left:4px solid #60a5fa;background:rgba(96,165,250,.08);border-radius:10px}.deepGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:16px}.deepCard{border:1px solid rgba(120,150,190,.2);border-radius:16px;padding:15px;background:rgba(255,255,255,.025)}.deepCard h4{margin:.1rem 0 .45rem}.deepCard p{margin:.3rem 0;line-height:1.55}.deepCard ul{padding-left:20px;margin:.45rem 0}.deepTable{display:grid;gap:9px}.deepRow{display:grid;grid-template-columns:minmax(135px,.35fr) 1fr;gap:12px;padding:10px 0;border-bottom:1px solid rgba(120,150,190,.15)}.deepRow:last-child{border-bottom:0}.deepRow b{color:#93c5fd}.deepOral{display:grid;gap:10px}.deepOral details{border:1px solid rgba(120,150,190,.22);border-radius:14px;padding:12px 14px;background:rgba(255,255,255,.025)}.deepOral summary{cursor:pointer;font-weight:800}.deepActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.deepSource{font-size:.82rem;opacity:.8;margin-top:15px;line-height:1.5}.deepInfoButton{margin-top:10px;width:100%;border:1px solid rgba(96,165,250,.4);border-radius:12px;background:rgba(37,99,235,.14);color:inherit;padding:10px;font-weight:800}.deepLevelNote{font-size:.88rem;opacity:.82;margin-top:8px}@media(max-width:760px){.deepHead,.deepTop{grid-template-columns:1fr;display:grid}.deepGrid{grid-template-columns:1fr}.deepRow{grid-template-columns:1fr;gap:4px}.deepPanel{padding:15px}.deepOsteology{padding:0 12px}}
  `;
  document.head.appendChild(style);

  function mount(){
    if(document.getElementById('deepOsteology')) return true;
    const anchor = document.getElementById('v1Hub') || document.querySelector('.simRoadmap');
    if(!anchor) return false;
    const section = document.createElement('section');
    section.id='deepOsteology'; section.className='deepOsteology';
    section.innerHTML=`<div class="deepHead"><div><span class="simEy">V2 académica · Osteología profunda</span><h2>Estudiar como para un oral, no solo reconocer</h2><p>Primera ampliación de profundidad a partir de la devolución de estudiantes avanzados. El contenido se organiza en tres niveles para que el repaso rápido y el estudio completo convivan.</p></div><span class="deepBadge">Unidad I · Osteología</span></div><div class="deepBoneTabs" id="deepBoneTabs"></div><div class="deepModeTabs" id="deepModeTabs"><button class="active" data-deep-mode="summary">Resumen</button><button data-deep-mode="full">Desarrollo completo</button><button data-deep-mode="oral">Oral / parcial</button></div><div id="deepPanel" class="deepPanel"></div>`;
    anchor.insertAdjacentElement('afterend',section);
    return true;
  }

  let current='mandibula', mode='summary';
  const rowTable = arr => `<div class="deepTable">${arr.map(([a,b])=>`<div class="deepRow"><b>${a}</b><span>${b}</span></div>`).join('')}</div>`;
  const bullets = arr => `<ul>${arr.map(x=>`<li>${x}</li>`).join('')}</ul>`;

  function render(){
    const d=DATA[current]; if(!d) return;
    const tabs=document.getElementById('deepBoneTabs');
    if(tabs && !tabs.children.length){tabs.innerHTML=Object.entries(DATA).map(([k,v])=>`<button type="button" data-deep-bone="${k}">${v.name}</button>`).join('');tabs.querySelectorAll('[data-deep-bone]').forEach(b=>b.addEventListener('click',()=>{current=b.dataset.deepBone;render();}));}
    tabs?.querySelectorAll('[data-deep-bone]').forEach(b=>b.classList.toggle('active',b.dataset.deepBone===current));
    document.querySelectorAll('[data-deep-mode]').forEach(b=>b.classList.toggle('active',b.dataset.deepMode===mode));
    const panel=document.getElementById('deepPanel'); if(!panel)return;
    const head=`<div class="deepTop"><div><span class="simEy">${d.name}</span><h3>${d.name}</h3></div><span class="deepBadge">${d.badge}</span></div><p class="deepSummary">${d.summary}</p><div class="deepOrientation"><b>Orientación de la pieza:</b> ${d.orientation}</div><div class="deepActions"><button type="button" data-deep-3d="${d.modelKey}">Ver / aislar referencia en 3D</button></div>`;
    if(mode==='summary') panel.innerHTML=head+`<div class="deepGrid"><article class="deepCard"><h4>Qué tenés que poder describir</h4>${bullets(d.morphology.map(x=>x[0]))}</article><article class="deepCard"><h4>Accidentes que no pueden faltar</h4>${bullets(d.landmarks.slice(0,6).map(x=>x[0]))}</article><article class="deepCard"><h4>Relación odontológica</h4>${bullets(d.dental.slice(0,3))}</article><article class="deepCard"><h4>Objetivo de examen</h4><p>Poder orientar la pieza, describirla de manera ordenada, nombrar accidentes y explicar al menos una relación neurovascular y una aplicación odontológica sin depender del modelo.</p></article></div><p class="deepLevelNote">Pasá a <b>Desarrollo completo</b> para estudiar detalles o a <b>Oral / parcial</b> para autoevaluarte.</p>`;
    else if(mode==='full') panel.innerHTML=head+`<div class="deepGrid"><article class="deepCard"><h4>Morfología y partes</h4>${rowTable(d.morphology)}</article><article class="deepCard"><h4>Accidentes anatómicos</h4>${rowTable(d.landmarks)}</article><article class="deepCard"><h4>Articulaciones y relaciones</h4><p>${d.articulations}</p></article><article class="deepCard"><h4>Inserciones musculares / ligamentosas</h4>${rowTable(d.insertions)}</article><article class="deepCard"><h4>Relaciones neurovasculares</h4><p>${d.neurovascular}</p></article><article class="deepCard"><h4>Odontología y diagnóstico por imágenes</h4>${bullets(d.dental)}</article></div><p class="deepSource"><b>Marco académico:</b> Unidad I del Programa Analítico oficial de Anatomía Normal de Odontología UNO. El desarrollo anatómico ampliado es material educativo original del simulador, verificado con anatomía descriptiva estándar y fuentes abiertas de NCBI/StatPearls; no reproduce páginas de los libros de la cátedra.</p>`;
    else panel.innerHTML=head+`<h4 style="margin-top:18px">Preguntas de desarrollo</h4><div class="deepOral">${d.oral.map(([q,a],i)=>`<details><summary>${i+1}. ${q}</summary><p>${a}</p></details>`).join('')}</div><div class="deepCard" style="margin-top:14px"><h4>Cómo practicar</h4><p>Intentá responder en voz alta antes de abrir la respuesta. Una respuesta sólida debería seguir el orden: <b>definición → orientación → partes → accidentes → relaciones → aplicación odontológica</b>.</p></div>`;
    panel.querySelector('[data-deep-3d]')?.addEventListener('click',e=>{document.dispatchEvent(new CustomEvent('simulator:select',{detail:{key:e.currentTarget.dataset.deep3d,sourceName:'Osteología profunda V2'}}));document.getElementById('skullStage')?.scrollIntoView({behavior:'smooth',block:'center'});});
  }

  function bind(){
    if(!mount())return false;
    document.querySelectorAll('[data-deep-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.deepMode;render();}));
    const info=document.querySelector('.simInfoBody') || document.querySelector('.simInfo');
    if(info && !document.getElementById('deepInfoButton')){const b=document.createElement('button');b.id='deepInfoButton';b.className='deepInfoButton';b.type='button';b.textContent='📚 Abrir desarrollo anatómico profundo';b.hidden=true;b.addEventListener('click',()=>{document.getElementById('deepOsteology')?.scrollIntoView({behavior:'smooth',block:'start'});mode='full';render();});info.appendChild(b);}
    render(); return true;
  }

  function selectionKey(key){return DATA[key]?key:PARENT[key]||null;}
  document.addEventListener('simulator:select',e=>{const k=selectionKey(e.detail?.key);const b=document.getElementById('deepInfoButton');if(b)b.hidden=!k;if(k){current=k;render();}});

  if(!bind()){
    const obs=new MutationObserver(()=>{if(bind())obs.disconnect();});obs.observe(document.body,{childList:true,subtree:true});setTimeout(()=>obs.disconnect(),12000);
  }
})();