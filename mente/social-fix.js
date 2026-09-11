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
      <div class="compactSocialBody">
        <a class="simpleInstagramLink" href="https://www.instagram.com/unamentesanaesposible/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Una mente sana es posible">
          <span class="instagramMark">${instagramIcon}</span>
          <b>Nuestro Instagram</b>
        </a>
      </div>
    </article>

    <article class="socialCard socialCardCentro">
      <img class="socialCardLogo ceLogo" src="./ce-logo.svg?v=20260911b" alt="Logo del Centro de Estudiantes de la Universidad Nacional del Oeste">
      <div class="compactSocialBody">
        <h3>Centro de Estudiantes</h3>
        <div class="socialActions socialActionsBrand">
          <a href="https://www.instagram.com/ce.uno/" target="_blank" rel="noopener noreferrer" aria-label="Instagram del Centro de Estudiantes"><span class="brandIcon">${instagramIcon}</span>Instagram</a>
          <a href="https://www.facebook.com/CE.NuevaUNO/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook del Centro de Estudiantes"><span class="brandIcon">${facebookIcon}</span>Facebook</a>
        </div>
      </div>
    </article>`;

  section.querySelector('.socialNote')?.remove();

  const style=document.createElement('style');
  style.textContent=`
    #redes .socialGrid{gap:12px!important}
    #redes .socialCard{padding:14px 16px!important;border-radius:18px!important;min-height:108px!important;display:grid!important;grid-template-columns:68px 1fr!important;gap:14px!important;align-items:center!important;box-shadow:0 6px 18px rgba(31,66,70,.05)!important}
    #redes .socialCardLogo{width:64px!important;height:64px!important;margin:0!important;object-fit:contain!important}
    #redes .mentalLogo{border-radius:50%!important}
    #redes .ceLogo{border-radius:50%!important;background:#f2fbfd!important;padding:2px!important;border:1px solid #d5e7ec!important}
    #redes .compactSocialBody{min-width:0}
    #redes .socialCard h3{font-size:20px!important;margin:0 0 8px!important;line-height:1.1!important}
    #redes .simpleInstagramLink{display:inline-flex!important;align-items:center!important;gap:7px!important;margin:0!important;text-decoration:none!important;color:#235f69!important;font-size:14px!important}
    #redes .instagramMark,#redes .brandIcon{display:inline-flex!important;width:18px!important;height:18px!important;flex:0 0 18px!important}
    #redes .instagramMark svg,#redes .brandIcon svg{width:100%!important;height:100%!important}
    #redes .socialActions{display:flex!important;gap:7px!important;flex-wrap:wrap!important;margin:0!important}
    #redes .socialActions a{padding:7px 9px!important;border-radius:9px!important;font-size:12px!important;gap:6px!important}
    @media(max-width:760px){
      #redes .socialGrid{grid-template-columns:1fr!important}
      #redes .socialCard{grid-template-columns:58px 1fr!important;padding:12px 14px!important;gap:12px!important;min-height:92px!important;text-align:left!important}
      #redes .socialCardLogo{width:54px!important;height:54px!important}
      #redes .socialCard h3{font-size:18px!important}
      #redes .socialActions{justify-content:flex-start!important}
    }
  `;
  document.head.appendChild(style);
})();
