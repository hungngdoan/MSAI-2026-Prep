import { Renderer } from './renderer.js';
import { Store } from './store.js';

async function loadStudyPlan() {
  const response = await fetch('./data/study-plan.json');
  return response.json();
}

async function loadCommittedProgress() {
  try {
    const response = await fetch('./progress.json', { cache: 'no-store' });
    if (!response.ok) return {};
    return response.json();
  } catch {
    return {};
  }
}

async function init() {
  const [data, committedProgress] = await Promise.all([
    loadStudyPlan(),
    loadCommittedProgress()
  ]);
  const container = document.getElementById('main-content');
  const sidebar = document.getElementById('sidebar');

  Store.seed(committedProgress);
  Renderer.init(container, sidebar, data);
  Renderer.bindEvents();
}

function armDragonEntrance() {
  const dragon = document.querySelector('.hero-dragon');
  if (!dragon) return;
  if (dragon.complete && dragon.naturalWidth > 0) {
    dragon.classList.add('loaded');
  } else {
    dragon.addEventListener('load', () => dragon.classList.add('loaded'), { once: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  armDragonEntrance();
  init();
});
