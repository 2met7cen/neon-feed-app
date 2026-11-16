import { CONFIG } from './config.js';
import { renderMessage, updateReactionUI } from './ui.js';

export function createFeedController({ listEl, sentinelEl, endEl, getState, onChange }) {
  let renderedCount = 0;
  let observer = null;

  function renderNextPage() {
    const state = getState();
    const slice = state.messages.slice(renderedCount, renderedCount + CONFIG.PAGE_SIZE);
    if (slice.length === 0) {
      endEl.hidden = renderedCount === 0 ? true : false;
      return false;
    }

    const frag = document.createDocumentFragment();
    for (const msg of slice) {
      frag.appendChild(renderMessage(msg, state.reactions[msg.id] ?? null));
    }
    listEl.appendChild(frag);
    renderedCount += slice.length;

    if (renderedCount >= state.messages.length) {
      endEl.hidden = false;
    }
    return true;
  }

  function setupObserver() {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) renderNextPage();
      }
    }, { rootMargin: '200px' });
    observer.observe(sentinelEl);
  }

  function handleReactionClick(e) {
    const btn = e.target.closest('.reaction');
    if (!btn) return;
    const card = btn.closest('.message');
    const id = card.dataset.id;
    const action = btn.dataset.action;
    onChange(id, action, card);
  }

  function init() {
    // первая страница сразу
    renderNextPage();
    setupObserver();
    listEl.addEventListener('click', handleReactionClick);
  }

  return {
    init,
    updateReactionUI,
    incrementRendered: () => { renderedCount++; },
  };
}
