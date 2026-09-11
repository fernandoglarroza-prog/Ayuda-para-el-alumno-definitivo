(()=>{
  const section=document.querySelector('#redes');
  if(!section)return;
  const grid=section.querySelector('.socialGrid');
  if(!grid)return;

  if(!document.querySelector('link[data-social-compact]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./social.css?v=20260911f';
    link.dataset.socialCompact='1';
    document.head.appendChild(link);
  }

  const instagramIcon=`<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.8" r="1.2" fill="currentColor"/></svg>`;
  const facebookIcon=`<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.2H8.2v3h2.6v8h3z"/></svg>`;
  const ceLogo='data:image/webp;base64,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';

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
      <img class="socialCardLogo ceLogo" src="${ceLogo}" width="48" height="48" alt="Logo del Centro de Estudiantes de la Universidad Nacional del Oeste">
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
