(()=>{
  const studentSection=document.querySelector('#estudiantes');
  if(!studentSection||document.querySelector('#uno-protocolo'))return;

  const protocolUrl='https://uno.edu.ar/images/documentos/2026/salud_mental/Protocolo%20Salud%20Mental.pdf';
  const resourcesUrl='https://uno.edu.ar/images/documentos/2026/salud_mental/RECURSERO%20SALUD%20MENTAL%202026_v2_compressed.pdf';
  const officialUrl='https://uno.edu.ar/misarticulos/1999-protocolo-de-salud-mental-de-la-uno.html';

  const nav=document.querySelector('#mainNav');
  if(nav&&!nav.querySelector('a[href="#uno-protocolo"]')){
    const link=document.createElement('a');
    link.href='#uno-protocolo';
    link.textContent='Salud mental UNO';
    const voices=nav.querySelector('a[href="#voces"]');
    nav.insertBefore(link,voices||null);
    link.addEventListener('click',()=>{
      nav.classList.remove('open');
      document.querySelector('.menuBtn')?.setAttribute('aria-expanded','false');
    });
  }

  const section=document.createElement('section');
  section.id='uno-protocolo';
  section.className='section unoProtocolSection';
  section.innerHTML=`
    <div class="wrap">
      <div class="sectionHead">
        <span class="eyebrow">Un recurso oficial de tu universidad</span>
        <h2>Salud mental en la UNO</h2>
        <p>La Universidad Nacional del Oeste cuenta con un protocolo para orientar la primera escucha ante situaciones de crisis por motivos de salud mental y con un recursero actualizado de instituciones y programas de asistencia.</p>
      </div>

      <div class="unoProtocolHero">
        <div class="unoProtocolIntro">
          <span class="unoOfficialBadge">UNO · Información oficial</span>
          <h3>Protocolo de actuación ante situaciones de crisis por motivos de Salud Mental</h3>
          <p>Se aplica a estudiantes, docentes, no docentes, autoridades y participantes de la comunidad universitaria. Su objetivo es ofrecer herramientas y recomendaciones para acompañar una primera escucha y orientar los pasos siguientes.</p>
          <div class="unoProtocolActions">
            <a class="btn primary" href="${protocolUrl}" target="_blank" rel="noopener noreferrer">Descargar protocolo oficial</a>
            <a class="btn secondary" href="${resourcesUrl}" target="_blank" rel="noopener noreferrer">Abrir Recursero 2026</a>
          </div>
        </div>
        <div class="unoProtocolMark" aria-hidden="true"><span>🎓</span><b>UNO</b><small>Primera escucha · orientación · cuidado</small></div>
      </div>

      <div class="unoProtocolGrid">
        <article class="unoProtocolCard">
          <span class="unoProtocolIcon">👂</span>
          <h3>¿Qué propone una primera escucha?</h3>
          <p>Recibir, acompañar y dar lugar a que la persona pueda expresar lo que está viviendo, con una escucha digna, receptiva y humanitaria.</p>
        </article>
        <article class="unoProtocolCard">
          <span class="unoProtocolIcon">🤝</span>
          <h3>Durante una situación de crisis</h3>
          <p>El protocolo recomienda preservar la privacidad, escuchar sin interrumpir, no dejar sola a la persona y, cuando corresponda, contactar referentes de confianza o áreas institucionales.</p>
        </article>
        <article class="unoProtocolCard urgentUnoCard">
          <span class="unoProtocolIcon">☎</span>
          <h3>Si existe riesgo cierto e inminente</h3>
          <p>La guía institucional indica recurrir a emergencias médicas o al <strong>911</strong>. Para una situación urgente también podés consultar <a href="#ayuda-ahora">Necesito ayuda ahora</a>.</p>
        </article>
      </div>

      <div class="unoProtocolBottom">
        <div>
          <b>Bienestar de la UNO</b>
          <p>Para consultas vinculadas con el protocolo, la Universidad informa el correo <a href="mailto:bienestar@uno.edu.ar">bienestar@uno.edu.ar</a>.</p>
        </div>
        <a href="${officialUrl}" target="_blank" rel="noopener noreferrer">Ver publicación oficial de la UNO →</a>
      </div>

      <div class="unoProtocolNote"><b>Importante:</b> nuestro formulario anónimo “Quiero contar lo que me pasa” es un espacio comunitario de expresión y moderación; <strong>no reemplaza el Protocolo de Salud Mental de la UNO ni funciona como canal de urgencias de la Universidad</strong>.</div>
    </div>`;
  studentSection.insertAdjacentElement('afterend',section);

  const style=document.createElement('style');
  style.textContent=`
    .unoProtocolSection{background:linear-gradient(180deg,#f7fcfa,#fffaf3)}
    .unoProtocolHero{display:grid;grid-template-columns:1.35fr .65fr;gap:18px;align-items:stretch;margin-bottom:18px}
    .unoProtocolIntro,.unoProtocolMark,.unoProtocolCard,.unoProtocolBottom,.unoProtocolNote{border:1px solid #d5e7e2;border-radius:22px}
    .unoProtocolIntro{background:#fff;padding:26px;box-shadow:0 10px 28px rgba(32,72,78,.06)}
    .unoOfficialBadge{display:inline-flex;background:#e4f4ef;color:#287970;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:850;letter-spacing:.05em;text-transform:uppercase}
    .unoProtocolIntro h3{font-family:Georgia,serif;font-size:31px;line-height:1.08;margin:13px 0 10px}
    .unoProtocolIntro p,.unoProtocolCard p,.unoProtocolBottom p,.unoProtocolNote{color:#5d7075;line-height:1.65}
    .unoProtocolActions{display:flex;gap:9px;flex-wrap:wrap;margin-top:19px}
    .unoProtocolMark{background:linear-gradient(145deg,#dff3ec,#dff1fa);padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
    .unoProtocolMark span{font-size:58px}.unoProtocolMark b{font-family:Georgia,serif;font-size:42px;margin:3px 0}.unoProtocolMark small{max-width:190px;color:#4f7376;font-weight:750;line-height:1.4}
    .unoProtocolGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}
    .unoProtocolCard{background:#fff;padding:21px}.unoProtocolIcon{font-size:31px}.unoProtocolCard h3{font-size:20px;margin:11px 0 7px}.unoProtocolCard p{margin:0}.unoProtocolCard a{font-weight:800}
    .urgentUnoCard{background:#fff4f0;border-color:#efd2cb}
    .unoProtocolBottom{margin-top:15px;background:#eef8f5;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;gap:20px}.unoProtocolBottom p{margin:5px 0 0}.unoProtocolBottom a{font-weight:850;color:#277a78;text-decoration:none;white-space:nowrap}
    .unoProtocolNote{margin-top:13px;padding:15px 17px;background:#fff9e8;border-color:#eee0b8;font-size:13px}
    @media(max-width:900px){.unoProtocolHero{grid-template-columns:1fr}.unoProtocolGrid{grid-template-columns:1fr}.unoProtocolMark{min-height:190px}}
    @media(max-width:620px){.unoProtocolIntro{padding:20px}.unoProtocolIntro h3{font-size:27px}.unoProtocolActions{display:grid}.unoProtocolBottom{align-items:flex-start;flex-direction:column}.unoProtocolBottom a{white-space:normal}}
  `;
  document.head.appendChild(style);
})();
