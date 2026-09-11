(()=>{
  const section=document.querySelector('#redes');
  if(!section)return;
  const grid=section.querySelector('.socialGrid');
  if(!grid)return;

  if(!document.querySelector('link[data-social-compact]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./social.css?v=20260911d';
    link.dataset.socialCompact='1';
    document.head.appendChild(link);
  }

  const instagramIcon=`<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.8" r="1.2" fill="currentColor"/></svg>`;
  const facebookIcon=`<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.2H8.2v3h2.6v8h3z"/></svg>`;

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
      <img class="socialCardLogo ceLogo" src="./ce-logo.svg?v=20260911d" width="48" height="48" alt="Logo del Centro de Estudiantes de la Universidad Nacional del Oeste">
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
