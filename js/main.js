import { CONFIG } from './config.js';
import { fetchFeed, persistFeed, createMessage } from './api.js';
import { createComposer } from './composer.js';
import { createFeedController } from './feed.js';
import { updateReactionUI, renderMessage } from './ui.js';

const state = {
  data: { messages: [], reactions: {} },
};

function getState() {
  return state.data;
}

async function bootstrap() {
  try {
    state.data = await fetchFeed();
  } catch (err) {
    console.error(err);
    alert('Не удалось загрузить ленту');
    return;
  }

  // ---- лента ----
  const feedController = createFeedController({
    listEl: document.getElementById('feed-list'),
    sentinelEl: document.getElementById('feed-sentinel'),
    endEl: document.getElementById('feed-end'),
    getState,
    onChange: handleReaction,
  });
  feedController.init();

  // ---- композер ----
  const composer = createComposer({
    inputEl: document.getElementById('composer-input'),
    btnEl: document.getElementById('publish-btn'),
    counterEl: document.getElementById('char-count'),
    onPublish: handlePublish,
  });
  composer.init();

  // ---- логика новых сообщений ----
  function handlePublish(text) {
    const msg = createMessage({ author: 'YOU', text });
    state.data.messages.unshift(msg);
    persistFeed(state.data);
    prependMessage(msg);
    feedController.incrementRendered();
  }

  function prependMessage(msg) {
    const listEl = document.getElementById('feed-list');
    const card = renderMessage(msg, null);
    listEl.prepend(card);
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ---- логика реакций ----
  function handleReaction(id, action, cardEl) {
    const msg = state.data.messages.find(m => m.id === id);
    if (!msg) return;

    const prev = state.data.reactions[id] ?? null;
    const next = prev === action ? null : action;

    // снимаем прошлый голос
    if (prev === 'like') msg.likes = Math.max(0, msg.likes - 1);
    if (prev === 'dislike') msg.dislikes = Math.max(0, msg.dislikes - 1);
    // ставим новый
    if (next === 'like') msg.likes += 1;
    if (next === 'dislike') msg.dislikes += 1;

    state.data.reactions[id] = next;
    persistFeed(state.data);

    updateReactionUI(cardEl, msg, next);
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);
