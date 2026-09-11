(()=>{
  const section=document.querySelector('#redes');
  if(!section)return;
  const grid=section.querySelector('.socialGrid');
  if(!grid)return;

  if(!document.querySelector('link[data-social-compact]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./social.css?v=20260911h';
    link.dataset.socialCompact='1';
    document.head.appendChild(link);
  }

  const instagramIcon=`<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.8" r="1.2" fill="currentColor"/></svg>`;
  const facebookIcon=`<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.2H8.2v3h2.6v8h3z"/></svg>`;
  const centroLogo=`<svg viewBox="0 0 240 240" role="img" aria-label="Logo del Centro de Estudiantes de la Universidad Nacional del Oeste">
    <defs>
      <path id="ceTopArc" d="M 34 120 A 86 86 0 0 1 206 120"/>
      <path id="ceBottomArc" d="M 206 120 A 86 86 0 0 1 34 120"/>
    </defs>
    <circle cx="120" cy="120" r="111" fill="#8ed7e8"/>
    <circle cx="120" cy="120" r="91" fill="#fff"/>
    <circle cx="25" cy="120" r="7" fill="#fff"/>
    <circle cx="215" cy="120" r="7" fill="#fff"/>
    <text fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="15.5" letter-spacing="1.8" text-anchor="middle"><textPath href="#ceTopArc" startOffset="50%">CENTRO DE ESTUDIANTES</textPath></text>
    <text fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="11.1" letter-spacing=".9" text-anchor="middle"><textPath href="#ceBottomArc" startOffset="50%">UNIVERSIDAD NACIONAL DEL OESTE</textPath></text>
    <text x="45" y="146" fill="#93dbea" font-family="Arial Black,Arial,Helvetica,sans-serif" font-size="72" font-weight="900">UNO</text>
    <g transform="translate(171 119)" fill="#f7ad2f">
      <circle r="28"/>
      <path d="M0-49 7-27-7-27ZM0 49 7 27-7 27ZM49 0 27 7 27-7ZM-49 0-27 7-27-7ZM35-35 25-15 15-25ZM35 35 15 25 25 15ZM-35 35-25 15-15 25ZM-35-35-15-25-25-15ZM19-46 17-23 5-29ZM46-19 29-5 23-17ZM46 19 23 17 29 5ZM19 46 5 29 17 23ZM-19 46-17 23-5 29ZM-46 19-29 5-23 17ZM-46-19-23-17-29-5ZM-19-46-5-29-17-23Z"/>
    </g>
  </svg>`;

  grid.innerHTML=`
    <article class="socialCard socialCardMente">
      <img class="socialCardLogo mentalLogo" src="./logo.webp" width="44" height="44" alt="Logo de Una mente sana es posible">
      <div class="compactSocialBody">
        <a class="simpleInstagramLink" href="https://www.instagram.com/unamentesanaesposible/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Una mente sana es posible">
          <span class="instagramMark">${instagramIcon}</span>
          <b>Nuestro Instagram</b>
        </a>
      </div>
    </article>

    <article class="socialCard socialCardCentro">
      <span class="ceLogo ceLogoSvg">${centroLogo}</span>
      <div class="compactSocialBody">
        <h3>Centro de Estudiantes</h3>
        <div class="socialActions socialActionsBrand">
          <a href="https://www.instagram.com/ce.uno/" target="_blank" rel="noopener noreferrer" aria-label="Instagram del Centro de Estudiantes"><span class="brandIcon">${instagramIcon}</span>Instagram</a>
          <a href="https://www.facebook.com/CE.NuevaUNO/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook del Centro de Estudiantes"><span class="brandIcon">${facebookIcon}</span>Facebook</a>
        </div>
      </div>
    </article>`;

  section.querySelector('.socialNote')?.remove();
})();
