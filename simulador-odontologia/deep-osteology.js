(() => {
  const CSS_ID = 'academic-v2-css';
  const SCRIPT_ID = 'academic-v2-js';

  if (!document.getElementById(CSS_ID)) {
    const link = document.createElement('link');
    link.id = CSS_ID;
    link.rel = 'stylesheet';
    link.href = '/simulador-odontologia/academic-v2.css';
    document.head.appendChild(link);
  }

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = '/simulador-odontologia/academic-v2.js';
    script.async = false;
    document.body.appendChild(script);
  }
})();
