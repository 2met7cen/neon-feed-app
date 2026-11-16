import { CONFIG } from './config.js';
import { storage } from './storage.js';

/**
 * Возвращает полный «снапшот» состояния:
 * { messages: Message[], reactions: { [msgId]: 'like'|'dislike'|null } }
 */
export async function fetchFeed() {
  const cached = storage.loadState();
  if (cached) return cached;

  const res = await fetch(CONFIG.ENDPOINT);
  if (!res.ok) throw new Error(`Не удалось загрузить ленту: ${res.status}`);
  const messages = await res.json();

  const state = { messages, reactions: {} };
  storage.saveState(state);
  return state;
}

export function persistFeed(state) {
  storage.saveState(state);
}

export function createMessage({ author, text }) {
  return {
    id: (crypto.randomUUID?.() ?? 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2)),
    author,
    text,
    createdAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
  };
}
