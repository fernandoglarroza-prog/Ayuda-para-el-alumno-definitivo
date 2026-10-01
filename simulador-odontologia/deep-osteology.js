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

  const ensureExamPrepNav = () => {
    if (document.getElementById('examPrepNav')) return;
    const nav = document.querySelector('.simModes');
    if (!nav) return;
    const button = document.createElement('button');
    button.id = 'examPrepNav';
    button.type = 'button';
    button.className = 'simMode examPrepNav';
    button.textContent = 'Preparar parcial';
    button.setAttribute('aria-label', 'Abrir plan de preparación para el parcial');
    button.addEventListener('click', () => {
      document.querySelector('.simMode[data-mode="estudiar"]')?.click();
      setTimeout(() => document.getElementById('academicExamPrepV2')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    });
    nav.appendChild(button);
  };

  addCss('academic-v2-css', '/simulador-odontologia/academic-v2.css');
  addCss('academic-v2-sync-css', '/simulador-odontologia/academic-v2-sync.css');
  addCss('academic-study-route-css', '/simulador-odontologia/academic-study-route.css');
  addCss('academic-partial-v2-css', '/simulador-odontologia/academic-partial-v2.css');
  addCss('academic-recovery-v2-css', '/simulador-odontologia/academic-recovery-v2.css');
  addCss('academic-mastery-v2-css', '/simulador-odontologia/academic-mastery-v2.css');
  addCss('academic-session-plan-v2-css', '/simulador-odontologia/academic-session-plan-v2.css');
  addCss('academic-spaced-v2-css', '/simulador-odontologia/academic-spaced-v2.css');
  addCss('academic-exam-prep-v2-css', '/simulador-odontologia/academic-exam-prep-v2.css');

  addScript('academic-v2-js', '/simulador-odontologia/academic-v2.js', () => {
    addScript('academic-v2-sync-js', '/simulador-odontologia/academic-v2-sync.js');
    addScript('academic-mastery-v2-js', '/simulador-odontologia/academic-mastery-v2.js', () => {
      addScript('academic-spaced-v2-js', '/simulador-odontologia/academic-spaced-v2.js', () => {
        addScript('academic-session-plan-v2-js', '/simulador-odontologia/academic-session-plan-v2.js', () => {
          addScript('academic-exam-prep-v2-js', '/simulador-odontologia/academic-exam-prep-v2.js', ensureExamPrepNav);
        });
      });
      addScript('academic-study-route-js', '/simulador-odontologia/academic-study-route.js');
      addScript('academic-partial-v2-js', '/simulador-odontologia/academic-partial-v2.js');
      addScript('academic-recovery-v2-js', '/simulador-odontologia/academic-recovery-v2.js');
    });
  });
})();
