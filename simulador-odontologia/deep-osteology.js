(() => {
  const addCss = (id, href) => {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  const addScript = (id, src, onload) => {
    const existing = document.getElementById(id);
    if (existing) {
      if (onload) onload();
      return existing;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = false;
    if (onload) script.addEventListener('load', onload, { once: true });
    document.body.appendChild(script);
    return script;
  };

  addCss('academic-v2-css', '/simulador-odontologia/academic-v2.css');
  addCss('academic-v2-sync-css', '/simulador-odontologia/academic-v2-sync.css');
  addCss('academic-study-route-css', '/simulador-odontologia/academic-study-route.css');
  addCss('academic-partial-v2-css', '/simulador-odontologia/academic-partial-v2.css');
  addCss('academic-recovery-v2-css', '/simulador-odontologia/academic-recovery-v2.css');

  addScript('academic-v2-js', '/simulador-odontologia/academic-v2.js', () => {
    addScript('academic-v2-sync-js', '/simulador-odontologia/academic-v2-sync.js');
    addScript('academic-study-route-js', '/simulador-odontologia/academic-study-route.js');
    addScript('academic-partial-v2-js', '/simulador-odontologia/academic-partial-v2.js');
    addScript('academic-recovery-v2-js', '/simulador-odontologia/academic-recovery-v2.js');
  });
})();
