(()=>{
  const section=document.querySelector('#redes');
  if(!section)return;
  const grid=section.querySelector('.socialGrid');
  if(!grid)return;

  const instagramIcon=`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.8" r="1.2" fill="currentColor"/></svg>`;
  const facebookIcon=`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.2H8.2v3h2.6v8h3z"/></svg>`;

  grid.innerHTML=`
    <article class="socialCard socialCardMente">
      <img class="socialCardLogo socialCardLogoLarge" src="./logo.webp" alt="Logo de Una mente sana es posible">
      <a class="simpleInstagramLink" href="https://www.instagram.com/unamentesanaesposible/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Una mente sana es posible">
        <span class="instagramMark">${instagramIcon}</span>
        <b>Nuestro Instagram</b>
      </a>
    </article>

    <article class="socialCard socialCardCentro">
      <img class="socialCardLogo ceLogo" src="./ce-logo.svg" alt="Logo del Centro de Estudiantes de la Universidad Nacional del Oeste">
      <div class="socialCardBody">
        <h3>Centro de Estudiantes</h3>
        <div class="socialActions socialActionsBrand">
          <a href="https://www.instagram.com/ce.uno/" target="_blank" rel="noopener noreferrer" aria-label="Instagram del Centro de Estudiantes">
            <span class="brandIcon">${instagramIcon}</span>Instagram
          </a>
          <a href="https://www.facebook.com/CE.NuevaUNO/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook del Centro de Estudiantes">
            <span class="brandIcon">${facebookIcon}</span>Facebook
          </a>
        </div>
      </div>
    </article>`;

  section.querySelector('.socialNote')?.remove();

  const style=document.createElement('style');
  style.textContent=`
    .socialCardMente{display:flex!important;flex-direction:column;justify-content:center;align-items:center;text-align:center;min-height:245px}
    .socialCardLogoLarge{width:112px!important;height:112px!important}
    .simpleInstagramLink{margin-top:16px;display:inline-flex;align-items:center;gap:9px;text-decoration:none;color:#235f69;font-size:17px}
    .instagramMark,.brandIcon{display:inline-flex;width:25px;height:25px;flex:0 0 25px}
    .instagramMark svg,.brandIcon svg{width:100%;height:100%}
    .socialCardCentro{grid-template-columns:120px 1fr!important;gap:22px!important}
    .socialCardCentro .ceLogo{width:118px!important;height:118px!important;border-radius:50%!important;object-fit:cover!important}
    .socialCardCentro h3{margin-bottom:14px!important}
    .socialActionsBrand a{gap:8px}
    @media(max-width:760px){.socialCardCentro{grid-template-columns:1fr!important;text-align:center}.socialCardCentro .ceLogo{margin:auto}.socialActionsBrand{justify-content:center}}
  `;
  document.head.appendChild(style);
})();
