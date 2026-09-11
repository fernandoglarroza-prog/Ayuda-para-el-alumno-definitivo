(()=>{
  const section=document.querySelector('#redes');
  if(!section)return;
  const grid=section.querySelector('.socialGrid');
  if(!grid)return;

  const instagramIcon=`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.8" r="1.2" fill="currentColor"/></svg>`;
  const facebookIcon=`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.2H8.2v3h2.6v8h3z"/></svg>`;

  grid.innerHTML=`
    <article class="socialCard socialCardMente">
      <img class="socialCardLogo mentalLogo" src="./logo.webp" alt="Logo de Una mente sana es posible">
      <a class="compactMainLink" href="https://www.instagram.com/unamentesanaesposible/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Una mente sana es posible">
        <span class="brandIcon">${instagramIcon}</span>
        <b>Nuestro Instagram</b>
      </a>
    </article>

    <article class="socialCard socialCardCentro">
      <img class="socialCardLogo ceLogo" src="./ce-logo.svg?v=20260911c" alt="Logo del Centro de Estudiantes de la Universidad Nacional del Oeste">
      <div class="compactSocialBody">
        <b class="compactTitle">Centro de Estudiantes</b>
        <div class="miniSocialLinks">
          <a href="https://www.instagram.com/ce.uno/" target="_blank" rel="noopener noreferrer" aria-label="Instagram del Centro de Estudiantes"><span class="brandIcon">${instagramIcon}</span><span>Instagram</span></a>
          <a href="https://www.facebook.com/CE.NuevaUNO/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook del Centro de Estudiantes"><span class="brandIcon">${facebookIcon}</span><span>Facebook</span></a>
        </div>
      </div>
    </article>`;

  section.querySelector('.socialNote')?.remove();
  const sectionHead=section.querySelector('.sectionHead');
  if(sectionHead){
    const p=sectionHead.querySelector('p');
    if(p)p.remove();
  }

  const style=document.createElement('style');
  style.textContent=`
    #redes.section{padding:28px 0!important}
    #redes .sectionHead{margin-bottom:10px!important}
    #redes .sectionHead .eyebrow{font-size:11px!important}
    #redes .sectionHead h2{font-size:25px!important;margin-bottom:0!important}
    #redes .socialGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
    #redes .socialCard{padding:9px 12px!important;border-radius:14px!important;min-height:66px!important;display:grid!important;grid-template-columns:46px 1fr!important;gap:10px!important;align-items:center!important;box-shadow:none!important}
    #redes .socialCardLogo{width:44px!important;height:44px!important;margin:0!important;object-fit:contain!important;flex:none!important}
    #redes .mentalLogo,#redes .ceLogo{border-radius:50%!important;background:#fff!important;border:1px solid #dbe9e6!important;padding:1px!important}
    #redes .compactMainLink{display:inline-flex!important;align-items:center!important;gap:7px!important;text-decoration:none!important;color:#235f69!important;font-size:13px!important;line-height:1.2!important;width:max-content!important;max-width:100%!important}
    #redes .compactSocialBody{min-width:0!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}
    #redes .compactTitle{font-family:inherit!important;font-size:14px!important;line-height:1.2!important;white-space:nowrap!important}
    #redes .miniSocialLinks{display:flex!important;gap:5px!important;flex-wrap:nowrap!important}
    #redes .miniSocialLinks a{display:inline-flex!important;align-items:center!important;gap:4px!important;padding:5px 7px!important;border:1px solid #d9e5e2!important;border-radius:8px!important;text-decoration:none!important;color:#2b6870!important;font-size:11px!important;font-weight:800!important;line-height:1!important;background:#fff!important}
    #redes .brandIcon{display:inline-flex!important;width:14px!important;height:14px!important;flex:0 0 14px!important}
    #redes .brandIcon svg{width:100%!important;height:100%!important}
    @media(max-width:760px){
      #redes.section{padding:22px 0!important}
      #redes .sectionHead{margin-bottom:8px!important}
      #redes .sectionHead .eyebrow{display:none!important}
      #redes .sectionHead h2{font-size:21px!important}
      #redes .socialGrid{grid-template-columns:1fr!important;gap:7px!important}
      #redes .socialCard{grid-template-columns:42px 1fr!important;min-height:58px!important;padding:7px 10px!important;gap:9px!important;text-align:left!important}
      #redes .socialCardLogo{width:40px!important;height:40px!important}
      #redes .compactSocialBody{gap:7px!important}
      #redes .compactTitle{font-size:13px!important}
      #redes .miniSocialLinks a{padding:4px 6px!important;font-size:10.5px!important}
      #redes .brandIcon{width:13px!important;height:13px!important;flex-basis:13px!important}
    }
    @media(max-width:420px){
      #redes .miniSocialLinks a span:last-child{display:none!important}
      #redes .miniSocialLinks a{width:30px!important;height:28px!important;justify-content:center!important;padding:0!important}
      #redes .brandIcon{width:15px!important;height:15px!important;flex-basis:15px!important}
    }
  `;
  document.head.appendChild(style);
})();
