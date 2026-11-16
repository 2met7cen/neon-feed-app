import { CONFIG } from './config.js';

export function createComposer({ inputEl, btnEl, counterEl, onPublish }) {
  function updateCounter() {
    const len = inputEl.value.length;
    counterEl.textContent = len;
    const wrap = counterEl.parentElement;
    wrap.classList.toggle('warn', len > CONFIG.MAX_CHARS * 0.8);
    wrap.classList.toggle('limit', len >= CONFIG.MAX_CHARS);
    btnEl.disabled = inputEl.value.trim().length === 0;
  }

  function handleInput() {
    if (inputEl.value.length > CONFIG.MAX_CHARS) {
      inputEl.value = inputEl.value.slice(0, CONFIG.MAX_CHARS);
    }
    updateCounter();
  }

  function handlePublish() {
    const text = inputEl.value.trim();
    if (!text) return;
    onPublish(text.slice(0, CONFIG.MAX_CHARS));
    inputEl.value = '';
    updateCounter();
  }

  function init() {
    inputEl.addEventListener('input', handleInput);
    btnEl.addEventListener('click', handlePublish);
    updateCounter();
  }

  return { init };
}