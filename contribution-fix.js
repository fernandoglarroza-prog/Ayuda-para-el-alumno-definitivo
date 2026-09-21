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
