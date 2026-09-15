(() => {
  let lastLevel = 'basic';
  const runner = () => document.getElementById('v1ExamRunner');

  // Remember the selected level so the result screen can safely start it again.
  document.addEventListener('click', (event) => {
    const levelButton = event.target.closest?.('[data-exam-level]');
    if (levelButton) lastLevel = levelButton.dataset.examLevel || lastLevel;
  }, true);

  // The original bank stores the correct option by semantic index. Reorder the
  // rendered buttons instead of changing those indices, so answer checking stays
  // correct while the visible position changes on every question.
  const shuffleChoices = () => {
    const host = runner();
    const choices = host?.querySelector('.v1ExamChoices');
    if (!choices || choices.dataset.shuffled === 'true') return;
    choices.dataset.shuffled = 'true';
    const buttons = [...choices.children];
    for (let i = buttons.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    }
    buttons.forEach((button) => choices.appendChild(button));
  };

  const observer = new MutationObserver(shuffleChoices);
  observer.observe(document.body, { childList: true, subtree: true });
  shuffleChoices();

  // Capture the repeat click before the old result listener evaluates the now
  // cleared internal exam state. Launch the remembered level through its public UI.
  document.addEventListener('click', (event) => {
    const repeat = event.target.closest?.('[data-repeat-exam]');
    if (!repeat) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const button = document.querySelector(`[data-exam-level="${lastLevel}"]`);
    button?.click();
  }, true);
})();