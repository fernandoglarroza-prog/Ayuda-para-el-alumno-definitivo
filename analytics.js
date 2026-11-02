(()=>{
  const send=(name,data={})=>{try{if(typeof window.va==='function')window.va('event',{name,data})}catch{}};

  document.addEventListener('click',e=>{
    const el=e.target.closest?.('button,a');
    if(!el)return;

    const go=el.getAttribute('data-go');
    if(go)send('Section View',{section:go});

    if(el.matches('[data-open="assistant"]'))send('Assistant Open');
    if(el.matches('[data-open="contribute"]'))send('Contribution Form Open');

    const href=el.getAttribute('href')||'';
    if(href.includes('chat.whatsapp.com'))send('WhatsApp Group Open');
    if(href.includes('linkbio.co/GruposMateriasEnfermeria'))send('Nursing Groups Hub Open');
    if(href.includes('drive.google.com'))send('Drive Link Open');
    if(el.classList.contains('fileRow'))send('Material File Open');

    if(el.matches('.communitySchool'))send('Community School Filter',{school:el.dataset.school||''});
    if(el.matches('.communityArea'))send('Community Area Filter',{area:el.dataset.area||''});

    if(el.id==='scheduleBtn')send('Schedule Search');
    if(el.id==='globalSearchBtn')send('Global Search');
  },{passive:true});

  document.addEventListener('submit',e=>{
    if(e.target?.id==='contributeForm')send('Contribution Form Submit');
  },{passive:true});
})();