const STORAGE_KEY = 'pytorch-progress-v1';
const EPHEMERAL = (() => {
  const host = location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1' && host !== '';
})();

function todayIso() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const Store = {
  _cache: null,

  _load() {
    if (this._cache) return this._cache;
    if (EPHEMERAL) {
      this._cache = {};
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      return this._cache;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._cache = raw ? JSON.parse(raw) : {};
    } catch {
      this._cache = {};
    }
    return this._cache;
  },

  _save() {
    if (EPHEMERAL) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
  },

  seed(seedData = {}) {
    const seed = seedData.completed && typeof seedData.completed === 'object'
      ? seedData.completed
      : seedData;
    const localData = this._load();
    this._cache = { ...seed, ...localData };
    this._save();
  },

  getAll() {
    return { ...this._load() };
  },

  getTask(taskId) {
    const data = this._load();
    return data[taskId] || null;
  },

  completeTask(taskId, notes = '') {
    const data = this._load();
    data[taskId] = {
      completedAt: todayIso(),
      notes
    };
    this._save();
  },

  uncompleteTask(taskId) {
    const data = this._load();
    delete data[taskId];
    this._save();
  },

  toggleTask(taskId) {
    if (this.getTask(taskId)) {
      this.uncompleteTask(taskId);
      return null;
    }
    this.completeTask(taskId);
    return this.getTask(taskId);
  },

  getChapterProgress(chapterId, tasks) {
    const chapterTasks = tasks.filter(t => t.chapter === chapterId);
    const completed = chapterTasks.filter(t => this.getTask(t.id));
    return { total: chapterTasks.length, done: completed.length };
  },

  getWeekProgress(week, tasks) {
    const weekTasks = tasks.filter(t => t.week === week);
    const completed = weekTasks.filter(t => this.getTask(t.id));
    return { total: weekTasks.length, done: completed.length };
  },

  getTotalProgress(tasks) {
    const completed = tasks.filter(t => this.getTask(t.id));
    return { total: tasks.length, done: completed.length };
  },

  exportData() {
    return JSON.stringify(this._load(), null, 2);
  },

  importData(json) {
    this._cache = JSON.parse(json);
    this._save();
  }
};
