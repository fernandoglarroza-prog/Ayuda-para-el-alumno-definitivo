(() => {
  const records = [
    {
      id:'cbct-educativo-propio', title:'CBCT anatómico educativo · cortes esquemáticos', status:'approved',
      copyright:'Creación propia del proyecto; no reutiliza una imagen clínica externa', privacy:'Sin datos de pacientes ni información clínica identificable',
      source:'Ayuda para el Alumno · material didáctico generado para el simulador',
      url:''
    },
    {
      id:'pano-caso1', title:'Panorámica · Caso 1', status:'preview',
      copyright:'CC BY-SA 4.0 verificada', privacy:'Privacidad/consentimiento no documentados explícitamente en la ficha usada',
      source:'Wikimedia Commons · Ruhrfisch, 2011',
      url:'https://commons.wikimedia.org/wiki/File:X-ray_of_all_32_human_teeth.jpg'
    },
    {
      id:'pano-caso2', title:'Panorámica · Caso 2', status:'approved',
      copyright:'Dominio público / licencia abierta documentada', privacy:'La ficha documenta liberación de copyright y confidencialidad médica',
      source:'Wikimedia Commons · Timpo, 2011',
      url:'https://commons.wikimedia.org/wiki/File:PAN_TEETH.jpg'
    },
    {
      id:'pano-caso3', title:'Panorámica · Caso 3', status:'preview',
      copyright:'CC BY 4.0 verificada', privacy:'Privacidad/consentimiento no documentados explícitamente en la ficha usada',
      source:'Wikimedia Commons · Farhang Amini, 2021',
      url:'https://commons.wikimedia.org/wiki/File:Dental_Panorama_X-ray.jpg'
    },
    {
      id:'cbct-wikimedia', title:'CBCT multiplanar actual', status:'preview',
      copyright:'CC BY-SA 4.0 verificada', privacy:'La ficha del archivo no documenta de forma suficiente anonimización/consentimiento para nuestro estándar de producción',
      source:'Wikimedia Commons · Panda 51, 2015',
      url:'https://commons.wikimedia.org/wiki/File:CBCT_image_01.png'
    },
    {
      id:'cbct-sciencedb-158', title:'CBCT · fuente prioritaria para producción', status:'approved-source',
      copyright:'CC BY 4.0', privacy:'158 casos desidentificados; consentimiento informado y aprobación ética documentados',
      source:'Scientific Data / ScienceDB · Feng et al., 2026 · DOI 10.57760/sciencedb.26465',
      url:'https://doi.org/10.1038/s41597-026-07156-9'
    },
    {
      id:'pano-mendeley-107', title:'Panorámicas Mendeley · fuente candidata', status:'review',
      copyright:'CC BY 4.0', privacy:'La página de dataset consultada no explicita anonimización; requiere revisión antes de producción',
      source:'Panoramic Dental Xray Dataset · Mendeley Data · DOI 10.17632/73n3kz2k4k',
      url:'https://data.mendeley.com/datasets/73n3kz2k4k/3'
    }
  ];

  window.ImagingSourcePolicy = {
    records,
    canPublish(id){ return records.find(r=>r.id===id)?.status === 'approved'; },
    get(id){ return records.find(r=>r.id===id) || null; }
  };

  function mount(){
    if(document.getElementById('sourcePolicyPanel')) return true;
    const anchor = document.getElementById('cbctAnatomyTrainer') || document.getElementById('realCbctCase') || document.getElementById('realRadiographCase') || document.getElementById('radiologyModule');
    if(!anchor) return false;
    const section=document.createElement('section');
    section.id='sourcePolicyPanel';
    section.className='sourcePolicy';
    const cards=records.map(r=>{
      const label=r.status==='approved'?'Aprobada para producción':r.status==='approved-source'?'Fuente aprobada · próxima integración':r.status==='preview'?'Solo preview':r.status==='review'?'En revisión':'Bloqueada';
      const link=r.url?`<a href="${r.url}" target="_blank" rel="noopener noreferrer">Abrir fuente ↗</a>`:'';
      return `<article class="sourceCard status-${r.status}"><div class="sourceTop"><b>${r.title}</b><span>${label}</span></div><p><strong>Derechos:</strong> ${r.copyright}</p><p><strong>Privacidad:</strong> ${r.privacy}</p><small>${r.source}</small>${link}</article>`;
    }).join('');
    section.innerHTML=`<div class="sourceHead"><div><span class="simEy">Control de fuentes · licencia + privacidad</span><h2>Qué imágenes pueden llegar a producción</h2><p>Una imagen no se aprueba por estar publicada en Internet. Exigimos licencia reutilizable y, para material clínico, documentación suficiente de anonimización, consentimiento o liberación de confidencialidad.</p></div><span class="sourceRule">Regla: duda = no publicar</span></div><div class="sourceLegend"><span class="ok">● Aprobada</span><span class="preview">● Solo preview</span><span class="review">● En revisión</span></div><div class="sourceGrid">${cards}</div><p class="sourceFoot">Los cortes CBCT educativos son material propio sin datos de pacientes y pueden publicarse. La fuente CBCT prioritaria para sustituir el caso clínico provisional contiene 158 estudios desidentificados, consentimiento informado, aprobación ética y licencia CC BY 4.0. Hasta efectuar esa sustitución, el CBCT de Wikimedia permanece marcado como material de prueba.</p>`;
    anchor.insertAdjacentElement('afterend',section);
    return true;
  }
  if(mount()) return;
  const observer=new MutationObserver(()=>{if(mount()) observer.disconnect();});
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),10000);
})();