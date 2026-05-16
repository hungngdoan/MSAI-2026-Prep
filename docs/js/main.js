import { Renderer } from './renderer.js';
import { Store } from './store.js';

async function loadStudyPlan() {
  const response = await fetch('./data/study-plan.json');
  return response.json();
}

async function loadCommittedProgress() {
  try {
    const response = await fetch('./data/progress.json', { cache: 'no-store' });
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

document.addEventListener('DOMContentLoaded', init);
