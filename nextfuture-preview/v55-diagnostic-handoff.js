// Nextfuture V5.5: traslado de datos del diagnostico a la solicitud.
(function () {
  'use strict';
  function byId(id) { return document.getElementById(id); }
  function transfer() {
    if (typeof diagState === 'undefined' || !diagState.device || !diagState.symptom) return;
    const brand = (byId('diagBrand')?.value || '').trim();
    const model = (byId('diagModel')?.value || '').trim();
    const symptom = typeof DIAG_DATA !== 'undefined'
      ? DIAG_DATA[diagState.device]?.symptoms?.[diagState.symptom]?.label : '';
    if (byId('rqDevice')) byId('rqDevice').value = diagState.device;
    if (byId('rqBrand') && brand) byId('rqBrand').value = brand;
    if (byId('rqModel') && model) byId('rqModel').value = model;
    const issue = byId('rqIssue');
    if (issue && (!issue.value.trim() || issue.dataset.nf55Generated === '1')) {
      issue.value = 'Diagnóstico previo: ' + (symptom || diagState.symptom) +
        '. Respuestas: ' + Object.entries(diagState.answers || {})
          .map(([question, answer]) => { const q = typeof DIAG_DATA !== 'undefined' ? DIAG_DATA[diagState.device]?.symptoms?.[diagState.symptom]?.questions?.find(x => x.id === question) : null; return (q?.text || question) + ': ' + (answer === 'yes' ? 'Sí' : answer === 'no' ? 'No' : answer); }).join('; ');
      issue.dataset.nf55Generated = '1';
    }
    issue?.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function init() {
    const root = byId('diagResultCard');
    if (!root) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'nf55Continue';
    button.className = 'btn btn-primary';
    button.textContent = 'Solicitar reparacion de este equipo';
    button.addEventListener('click', function () {
      transfer();
      window.location.hash = 'solicitud';
    });
    const observer = new MutationObserver(function () {
      const result = root.querySelector('.diag-result');
      if (result && !byId('nf55Continue')) result.appendChild(button);
    });
    observer.observe(root, { childList: true, subtree: true });
    byId('rqIssue')?.addEventListener('input', function(e) { if (e.isTrusted) e.target.dataset.nf55Generated = '0'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();