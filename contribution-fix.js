(()=>{
  function enhanceContributionForm(form){
    if(!form||form.dataset.careerSubjectFixed==='1')return;
    const subject=form.querySelector('#contributeSubject');
    if(!subject)return;
    const subjectLabel=subject.closest('label');
    if(!subjectLabel)return;
    form.dataset.careerSubjectFixed='1';

    const careerLabel=document.createElement('label');
    careerLabel.innerHTML='Carrera <span>*</span><select id="contributeCareer" required><option value="">Cargando carreras…</option></select>';
    subjectLabel.parentNode.insertBefore(careerLabel,subjectLabel);
    const career=careerLabel.querySelector('#contributeCareer');
    let catalog=new Map();
    let observer;

    const watch=()=>observer.observe(subject,{childList:true,subtree:true});
    const setSubjectHtml=html=>{
      observer.disconnect();
      subject.innerHTML=html;
      watch();
    };

    function captureOriginalOptions(){
      const groups=[...subject.querySelectorAll('optgroup')];
      if(!groups.length)return false;
      catalog=new Map(groups.map(group=>[
        group.label,
        [...group.querySelectorAll('option')].map(option=>({value:option.value,label:option.textContent||''}))
      ]));
      const names=[...catalog.keys()].sort((a,b)=>a.localeCompare(b,'es-AR'));
      career.innerHTML='<option value="">Seleccioná una carrera</option>'+names.map(name=>'<option value="'+name.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'">'+name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</option>').join('');
      career.disabled=false;
      setSubjectHtml('<option value="">Primero seleccioná una carrera</option>');
      subject.disabled=true;
      return true;
    }

    observer=new MutationObserver(()=>{
      if(captureOriginalOptions())return;
      const first=subject.options?.[0]?.textContent||'';
      if(/no pudimos/i.test(first)){
        career.innerHTML='<option value="">No pudimos cargar las carreras</option>';
        career.disabled=true;
        subject.disabled=true;
      }
    });
    watch();

    career.addEventListener('change',()=>{
      const selected=career.value;
      if(!selected||!catalog.has(selected)){
        setSubjectHtml('<option value="">Primero seleccioná una carrera</option>');
        subject.disabled=true;
        return;
      }
      const items=catalog.get(selected)||[];
      setSubjectHtml('<option value="">Seleccioná una materia</option>'+items.map(item=>'<option value="'+String(item.value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'">'+String(item.label).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</option>').join(''));
      subject.disabled=false;
      subject.focus();
    });

    form.addEventListener('reset',()=>setTimeout(()=>{
      career.value='';
      setSubjectHtml('<option value="">Primero seleccioná una carrera</option>');
      subject.disabled=true;
    },0));

    captureOriginalOptions();
  }

  const modalBody=document.querySelector('#modalBody');
  if(!modalBody)return;
  const modalObserver=new MutationObserver(()=>enhanceContributionForm(modalBody.querySelector('#contributeForm')));
  modalObserver.observe(modalBody,{childList:true,subtree:true});
  enhanceContributionForm(modalBody.querySelector('#contributeForm'));
})();

(()=>{
  const SUPABASE_URL='https://abcuvgoipnwiltlbcqxa.supabase.co';
  const PUBLIC_KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const school=document.querySelector('#schoolSelect');
  const career=document.querySelector('#careerSelect');
  const year=document.querySelector('#yearSelect');
  const search=document.querySelector('#subjectSearch');
  const count=document.querySelector('#driveCount');
  const results=document.querySelector('#driveSubjects');
  if(!school||!career||!year||!search||!count||!results)return;

  let hierarchy=[];

  function flat(){
    const out=[];
    for(const sc of hierarchy||[]){
      for(const c of sc.careers||[]){
        for(const y of c.years||[]){
          for(const s of y.subjects||[]){
            out.push({
              school:sc.name,
              schoolSlug:sc.slug,
              career:c.name,
              careerSlug:c.slug,
              year:y.year,
              name:s.name,
              url:s.folder_url,
              indexed:s.indexed_files||0,
              published:s.published_materials||0
            });
          }
        }
      }
    }
    return out;
  }

  function refreshYears(){
    const selectedSchool=school.value;
    const selectedCareer=career.value;
    const years=[...new Set(flat().filter(x=>(!selectedSchool||x.schoolSlug===selectedSchool)&&(!selectedCareer||x.careerSlug===selectedCareer)).map(x=>x.year))]
      .filter(v=>v!==null&&v!==undefined)
      .sort((a,b)=>Number(a)-Number(b));
    year.innerHTML='<option value="">Todos los años</option>'+years.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'° año</option>').join('');
  }

  function refreshCareers(){
    const selectedSchool=school.value;
    const careers=(hierarchy||[])
      .filter(sc=>!selectedSchool||sc.slug===selectedSchool)
      .flatMap(sc=>sc.careers||[]);
    const seen=new Set();
    const unique=careers.filter(c=>{const k=String(c.slug||c.name);if(seen.has(k))return false;seen.add(k);return true});
    career.innerHTML='<option value="">Todas las carreras</option>'+unique.map(c=>'<option value="'+esc(c.slug)+'">'+esc(c.name)+'</option>').join('');
    refreshYears();
  }

  function render(){
    const selectedSchool=school.value;
    const selectedCareer=career.value;
    const selectedYear=year.value;
    const q=search.value.toLowerCase().trim();
    const items=flat().filter(x=>(!selectedSchool||x.schoolSlug===selectedSchool)&&(!selectedCareer||x.careerSlug===selectedCareer)&&(!selectedYear||String(x.year)===selectedYear)&&(!q||String(x.name||'').toLowerCase().includes(q)));
    count.textContent=items.length+' materias';
    results.innerHTML=items.slice(0,180).map((x,i)=>'<article class="subjectCard"><div class="subjectMeta"><span class="badge blue">'+esc(x.career)+'</span><span class="badge">'+esc(x.year)+'° año</span></div><h3>'+esc(x.name)+'</h3><p>'+esc(x.school)+'</p><div class="subjectActions"><button type="button" data-material-fix="'+i+'">Ver material</button><a href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">Abrir Drive</a></div></article>').join('')||'<div class="notice">No encontramos una materia con esos filtros.</div>';
    results.querySelectorAll('[data-material-fix]').forEach(button=>{
      button.addEventListener('click',()=>{
        const item=items[Number(button.dataset.materialFix)];
        if(!item)return;
        if(typeof window.openSubjectMaterials==='function')window.openSubjectMaterials(item);
        else if(item.url)window.open(item.url,'_blank','noopener,noreferrer');
      });
    });
  }

  async function loadHierarchy(){
    count.textContent='Cargando estructura…';
    try{
      const response=await fetch(SUPABASE_URL+'/rest/v1/rpc/get_drive_material_hierarchy',{
        method:'POST',
        headers:{
          apikey:PUBLIC_KEY,
          Authorization:'Bearer '+PUBLIC_KEY,
          'Content-Type':'application/json'
        },
        body:'{}'
      });
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      if(!Array.isArray(data)||!data.length)throw new Error('Estructura vacía');
      hierarchy=data;
      school.innerHTML='<option value="">Todas las Escuelas</option>'+hierarchy.map(sc=>'<option value="'+esc(sc.slug)+'">'+esc(sc.name)+'</option>').join('');
      refreshCareers();
      render();
    }catch(error){
      console.error('No se pudo cargar el navegador de material',error);
      count.textContent='No se pudo cargar';
      results.innerHTML='<div class="notice"><b>No pudimos cargar la estructura de material.</b><p>Actualizá la página e intentá nuevamente.</p></div>';
    }
  }

  school.addEventListener('change',()=>{refreshCareers();render()});
  career.addEventListener('change',()=>{refreshYears();render()});
  year.addEventListener('change',render);
  search.addEventListener('input',render);
  loadHierarchy();
})();
