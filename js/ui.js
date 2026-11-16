import { CONFIG } from './config.js';

const tpl = document.getElementById('message-template');

export function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(CONFIG.LOCALE, {
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export function renderMessage(message, myReaction) {
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.dataset.id = message.id;
  node.querySelector('.message__author').textContent = message.author;
  node.querySelector('.message__time').textContent = formatTime(message.createdAt);
  node.querySelector('.message__text').textContent = message.text;

  const likeBtn = node.querySelector('[data-action="like"]');
  const dislikeBtn = node.querySelector('[data-action="dislike"]');
  likeBtn.querySelector('.reaction__count').textContent = message.likes;
  dislikeBtn.querySelector('.reaction__count').textContent = message.dislikes;

  if (myReaction === 'like') likeBtn.classList.add('active');
  if (myReaction === 'dislike') dislikeBtn.classList.add('active');

  return node;
}

export function updateReactionUI(cardEl, message, myReaction) {
  const likeBtn = cardEl.querySelector('[data-action="like"]');
  const dislikeBtn = cardEl.querySelector('[data-action="dislike"]');
  likeBtn.querySelector('.reaction__count').textContent = message.likes;
  dislikeBtn.querySelector('.reaction__count').textContent = message.dislikes;
  likeBtn.classList.toggle('active', myReaction === 'like');
  dislikeBtn.classList.toggle('active', myReaction === 'dislike');
}