import { Store } from './store.js';

const TYPE_BADGES = {
  Read: { label: 'READ', cls: 'badge-read' },
  Exercise: { label: 'EXERCISE', cls: 'badge-exercise' },
  Python: { label: 'CODE', cls: 'badge-code' },
  Review: { label: 'REVIEW', cls: 'badge-review' },
  Both: { label: 'CODE + REVIEW', cls: 'badge-both' }
};

const RANKS = [
  { min: 0, name: 'EARTHLING', color: '#666', note: 'First step in the chamber.' },
  { min: 750, name: 'SAIYAN CHILD', color: '#aa8833', note: 'Power awakening.' },
  { min: 2250, name: 'SAIYAN WARRIOR', color: '#cc9900', note: 'Consistency is showing.' },
  { min: 4500, name: 'SUPER SAIYAN', color: '#ffc200', note: 'The math is catching fire.' },
  { min: 7500, name: 'SUPER SAIYAN 2', color: '#ffdd44', note: 'Sparks are flying.' },
  { min: 10500, name: 'SUPER SAIYAN 3', color: '#ff6a00', note: 'Maximum study output.' },
  { min: 13500, name: 'ULTRA INSTINCT', color: '#e0d0d0', note: 'Automatic mastery mode.' }
];

function todayIso() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function dateFromIso(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(iso, options = { month: 'short', day: 'numeric' }) {
  if (!iso) return '';
  return dateFromIso(iso).toLocaleDateString('en-US', options);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function splitPtTasks(text) {
  return String(text ?? '')
    .split(/(?<=[.?!])\s+(?=[A-Z(])/)
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter((part) => part.length > 0);
}

function shortStamp(iso) {
  if (!iso) return { weekday: '', md: '' };
  const d = dateFromIso(iso);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const md = `${d.getMonth() + 1}/${d.getDate()}`;
  return { weekday, md };
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    ok ? resolve() : reject(new Error('Copy failed'));
  });
}

export const Renderer = {
  container: null,
  sidebar: null,
  data: null,
  openWeeks: new Set(),
  currentWeek: 1,
  eventsBound: false,

  init(containerEl, sidebarEl, studyData) {
    this.container = containerEl;
    this.sidebar = sidebarEl;
    this.data = studyData;
    this.currentWeek = this._getCurrentWeek();
    this._openDefaultWeeks();
    this.render();
  },

  render() {
    this.currentWeek = this._getCurrentWeek();
    this.renderMain();
    this.renderSidebar();
  },

  renderMain() {
    const weeks = this._groupByWeek();
    this.container.innerHTML = '';

    for (const [week, tasks] of Object.entries(weeks)) {
      const chapter = this._chapterForWeek(Number(week));
      const progress = Store.getWeekProgress(Number(week), this.data.tasks);
      const section = this._createWeekSection(Number(week), chapter, tasks, progress);
      this.container.appendChild(section);
    }
  },

  renderSidebar() {
    const stats = this._getStats();
    const rank = this._rankFor(stats.power);
    this.sidebar.innerHTML = '';
    this._updateStreakBar(stats, rank);
    this._renderPowerLevel(stats);
    this._renderDragonBalls(stats);
    this._renderRank(rank);
    this._renderToday();
    this._renderStats(stats);
    this._renderChapterProgress();

    const footerCount = document.getElementById('fS');
    if (footerCount) footerCount.textContent = stats.done;
  },

  bindEvents() {
    if (this.eventsBound) return;
    this.eventsBound = true;

    this.container.addEventListener('click', (event) => {
      const row = event.target.closest('.tr');
      if (!row) return;
      const id = row.dataset.id;
      const state = Store.toggleTask(id);
      this.render();
      this._toast(state ? `Mission logged: ${formatDate(state.completedAt, { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Mission reopened');
    });

    document.getElementById('nav-expand')?.addEventListener('click', () => this.expandAll());
    document.getElementById('nav-collapse')?.addEventListener('click', () => this.collapseAll());
    document.getElementById('nav-export')?.addEventListener('click', () => this.exportProgress());
    document.getElementById('nav-current')?.addEventListener('click', () => this.jumpToCurrent());
  },

  expandAll() {
    for (const week of Object.keys(this._groupByWeek())) this.openWeeks.add(Number(week));
    this.renderMain();
    this._toast('All weeks expanded');
  },

  collapseAll() {
    this.openWeeks.clear();
    this.openWeeks.add(this.currentWeek);
    this.renderMain();
    this._toast('Current week kept open');
  },

  exportProgress() {
    const completed = Store.getAll();
    const payload = {
      exportedAt: new Date().toISOString(),
      plan: this.data.meta.title,
      completed
    };

    copyToClipboard(JSON.stringify(payload, null, 2))
      .then(() => this._toast('Progress copied to clipboard'))
      .catch(() => {
        window.prompt('Copy progress backup:', JSON.stringify(payload, null, 2));
        this._toast('Progress export ready');
      });
  },

  jumpToCurrent() {
    this.openWeeks.add(this.currentWeek);
    this.renderMain();
    requestAnimationFrame(() => {
      const today = todayIso();
      const target = this.container.querySelector(`[data-task-date="${today}"]`) || document.getElementById(`week-${this.currentWeek}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  },

  _groupByWeek() {
    const grouped = {};
    for (const task of this.data.tasks) {
      if (!grouped[task.week]) grouped[task.week] = [];
      grouped[task.week].push(task);
    }
    return Object.fromEntries(
      Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b))
    );
  },

  _chapterForWeek(week) {
    return this.data.chapters.find((chapter) => {
      const [start, end = start] = chapter.weeks.split('-').map(Number);
      return week >= start && week <= end;
    });
  },

  _getCurrentWeek() {
    const weeks = this._groupByWeek();
    const today = todayIso();
    let firstFuture = null;
    let firstIncomplete = null;
    let lastWeek = 1;

    for (const [weekKey, tasks] of Object.entries(weeks)) {
      const week = Number(weekKey);
      lastWeek = week;
      const dates = tasks.map((task) => task.date).filter(Boolean).sort();
      const start = dates[0];
      const end = dates[dates.length - 1];
      const progress = Store.getWeekProgress(week, this.data.tasks);

      if (start <= today && today <= end) return week;
      if (!firstFuture && start > today) firstFuture = week;
      if (!firstIncomplete && progress.done < progress.total) firstIncomplete = week;
    }

    return firstFuture || firstIncomplete || lastWeek;
  },

  _openDefaultWeeks() {
    this.openWeeks.clear();
    for (const week of Object.keys(this._groupByWeek())) {
      if (Number(week) <= this.currentWeek) this.openWeeks.add(Number(week));
    }
  },

  _createWeekSection(week, chapter, tasks, progress) {
    const sec = document.createElement('div');
    sec.className = `sec${week === this.currentWeek ? ' current' : ''}`;
    sec.id = `week-${week}`;

    const isFull = progress.done === progress.total && progress.total > 0;
    const countCls = isFull ? 'sec-cnt full' : 'sec-cnt';
    const isOpen = this.openWeeks.has(week);
    const [firstTask, lastTask] = [tasks[0], tasks[tasks.length - 1]];
    const dateRange = `${formatDate(firstTask.date)} - ${formatDate(lastTask.date)}`;

    sec.innerHTML = `
      <div class="sec-head" data-week="${week}">
        <div class="db"><span class="st">${week}</span></div>
        <h2>BLOCK ${week} // ${escapeHtml(chapter ? chapter.title.toUpperCase() : 'BUFFER')}</h2>
        <span class="sec-cnt week-date">${dateRange}</span>
        <span class="${countCls}">${progress.done}/${progress.total}</span>
        <span class="arr ${isOpen ? '' : 'shut'}">&#9660;</span>
      </div>
      <div class="sec-body" style="${isOpen ? 'max-height:none' : 'max-height:0'}">
        ${tasks.map((task) => this._createTaskRow(task)).join('')}
      </div>
    `;

    const head = sec.querySelector('.sec-head');
    const body = sec.querySelector('.sec-body');
    const arrow = sec.querySelector('.arr');

    head.addEventListener('click', () => {
      const nextOpen = !this.openWeeks.has(week);
      if (nextOpen) {
        this.openWeeks.add(week);
        body.style.maxHeight = `${body.scrollHeight}px`;
        arrow.classList.remove('shut');
        setTimeout(() => {
          if (this.openWeeks.has(week)) body.style.maxHeight = 'none';
        }, 300);
      } else {
        this.openWeeks.delete(week);
        body.style.maxHeight = `${body.scrollHeight}px`;
        requestAnimationFrame(() => {
          body.style.maxHeight = '0px';
          arrow.classList.add('shut');
        });
      }
    });

    return sec;
  },

  _createTaskRow(task) {
    const state = Store.getTask(task.id);
    const today = todayIso();
    const doneCls = state ? ' dn' : '';
    const currentCls = task.date === today ? ' current' : '';
    const futureCls = task.date > today ? ' future' : '';
    const checkMark = state ? '&#10003;' : '';
    const badge = TYPE_BADGES[task.type] || { label: task.type, cls: 'badge-read' };
    const dateStamp = state ? `<span class="date-stamp">DONE ${formatDate(state.completedAt, { month: 'short', day: 'numeric', year: 'numeric' })}</span>` : '';
    const deliverable = task.deliverable ? `<span class="deliverable-pill">${escapeHtml(task.deliverable)}</span>` : '';
    const ptStatusLabel = state ? 'CLEARED' : (task.date === today ? 'ACTIVE' : (task.date > today ? 'INCOMING' : 'MISSED'));
    const ptStatusCls = state ? 'done' : (task.date === today ? 'current' : (task.date > today ? 'future' : 'pending'));
    const stampStatus = state ? 'done' : (task.date === today ? 'current' : (task.date > today ? 'future' : 'missed'));
    const stamp = shortStamp(task.date);
    const stampHtml = `
        <div class="task-date-stamp stamp-${stampStatus}" aria-label="${escapeHtml(task.date)}">
          <span class="stamp-day">${escapeHtml(stamp.weekday)}</span>
          <span class="stamp-md">${escapeHtml(stamp.md)}</span>
        </div>`;
    const ptBullets = task.ptChapter
      ? splitPtTasks(task.ptTasks).map((line) => `<li>${escapeHtml(line)}</li>`).join('')
      : '';
    const sswBullets = task.sswChapter
      ? splitPtTasks(task.sswTasks).map((line) => `<li>${escapeHtml(line)}</li>`).join('')
      : '';
    const ptTrack = task.ptChapter ? `
          <div class="pt-track">
            <div class="pt-track-head">
              <span class="pt-chip">${escapeHtml(task.ptChapter)}</span>
              <strong class="pt-topic">${escapeHtml(task.ptTopic)}</strong>
              <span class="pt-status pt-status-${ptStatusCls}">${ptStatusLabel}</span>
              <span class="pt-mins">${escapeHtml(task.ptMinutes)}m</span>
            </div>
            <ul class="pt-tasks-list">${ptBullets}</ul>
          </div>
        ` : '';
    const sswTrack = task.sswChapter ? `
          <div class="pt-track ssw-track">
            <div class="pt-track-head">
              <span class="pt-chip">${escapeHtml(task.sswChapter)}</span>
              <strong class="pt-topic">${escapeHtml(task.sswSection)}</strong>
              <span class="pt-status pt-status-${ptStatusCls}">${ptStatusLabel}</span>
              <span class="pt-mins">${escapeHtml(task.sswMinutes)}m</span>
            </div>
            <ul class="pt-tasks-list">${sswBullets}</ul>
          </div>
        ` : '';

    return `
      <div class="tr${doneCls}${currentCls}${futureCls}" data-id="${escapeHtml(task.id)}" data-task-date="${escapeHtml(task.date)}">
        <div class="ck">${checkMark}</div>
        <div class="task-info">
          <span class="tt">${escapeHtml(task.topic)}</span>
          <span class="task-desc">${escapeHtml(task.description)}</span>
          <div class="task-meta">
            <span class="pri ${badge.cls}">${escapeHtml(badge.label)}</span>
            <span class="xp">${task.minutes}m</span>
            ${dateStamp}
            <span class="source-pill">${escapeHtml(task.source)}</span>
            <span class="source-pill">${escapeHtml(task.sections)}</span>
            ${deliverable}
          </div>
          ${ptTrack}
          ${sswTrack}
        </div>
        ${stampHtml}
      </div>
    `;
  },

  _taskMinutes(task) {
    return Number(task.minutes || 0) + Number(task.ptMinutes || 0) + Number(task.sswMinutes || 0);
  },

  _getStats() {
    const total = this.data.tasks.length;
    const completed = this.data.tasks
      .map((task) => ({ task, state: Store.getTask(task.id) }))
      .filter((item) => item.state);
    const done = completed.length;
    const today = todayIso();
    const todayDone = completed.filter((item) => item.state.completedAt === today).length;
    const minutes = completed.reduce((sum, item) => sum + this._taskMinutes(item.task), 0);
    const todayMinutes = completed
      .filter((item) => item.state.completedAt === today)
      .reduce((sum, item) => sum + this._taskMinutes(item.task), 0);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const dateSet = new Set(completed.map((item) => item.state.completedAt));
    let streak = 0;
    const check = new Date(today + 'T00:00:00');
    if (!dateSet.has(today)) check.setDate(check.getDate() - 1);
    while (dateSet.has(check.toISOString().slice(0, 10))) {
      streak++;
      check.setDate(check.getDate() - 1);
    }
    return {
      total,
      done,
      left: total - done,
      pct,
      minutes,
      streak,
      todayDone,
      todayMinutes,
      power: done * 150,
      todayPower: todayDone * 150
    };
  },

  _rankFor(power) {
    return RANKS.reduce((best, rank) => (power >= rank.min ? rank : best), RANKS[0]);
  },

  _updateStreakBar(stats, rank) {
    document.getElementById('skXP').textContent = `${stats.streak} day${stats.streak !== 1 ? 's' : ''}`;
    document.getElementById('skDone').textContent = `${stats.done}/${stats.total}`;
    document.getElementById('skPct').textContent = `${stats.pct}%`;
    const rankEl = document.getElementById('skRank');
    rankEl.textContent = rank.name;
    rankEl.style.color = rank.color;
  },

  _renderPowerLevel(stats) {
    const box = document.createElement('div');
    box.className = 'sec';
    box.innerHTML = `
      <div class="sec-head"><div class="db"><span class="st">Z</span></div><h2>POWER LEVEL</h2></div>
      <div class="pl-box">
        <div class="pl-n">${stats.power.toLocaleString()}</div>
        <div class="pl-lab">COMBAT POWER</div>
        <div class="bar-w"><div class="bar-f" style="width:${stats.pct}%"></div></div>
        <div class="bar-sub">${stats.done} / ${stats.total} missions</div>
      </div>
    `;
    this.sidebar.appendChild(box);
  },

  _renderDragonBalls(stats) {
    const collected = Math.min(7, Math.floor((stats.pct * 7) / 100));
    const balls = Array.from({ length: 7 }, (_, index) => {
      const ball = index + 1;
      return `<div class="dbi ${ball <= collected ? 'on' : ''}">${ball}</div>`;
    }).join('');

    const box = document.createElement('div');
    box.className = 'sec';
    box.innerHTML = `
      <div class="sec-head"><div class="db"><span class="st">7</span></div><h2>DRAGON BALLS</h2></div>
      <div class="sw">
        <div class="dbr">${balls}</div>
        <div class="db-msg">${collected === 7 ? 'ALL 7 COLLECTED' : `${collected}/7 collected`}</div>
      </div>
    `;
    this.sidebar.appendChild(box);
  },

  _renderRank(rank) {
    const activeIndex = RANKS.findIndex((item) => item.name === rank.name);
    const tiers = RANKS.map((_, index) => `<div class="rnk-tier ${index <= activeIndex ? 'lit' : ''}"></div>`).join('');

    const box = document.createElement('div');
    box.className = 'sec';
    box.innerHTML = `
      <div class="sec-head"><div class="db"><span class="st">R</span></div><h2>SAIYAN RANK</h2></div>
      <div class="rnk">
        <div class="rnk-n" style="color:${rank.color}">${rank.name}</div>
        <div class="rnk-d">${rank.note}</div>
        <div class="rnk-tiers">${tiers}</div>
      </div>
    `;
    this.sidebar.appendChild(box);
  },

  _renderToday() {
    const today = todayIso();
    const planned = this.data.tasks.filter((task) => task.date === today);
    const nextTask = this.data.tasks.find((task) => task.date >= today && !Store.getTask(task.id));
    const now = dateFromIso(today);
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const fullDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const rows = planned.length
      ? planned.map((task) => `<div class="today-row"><strong>${escapeHtml(task.topic)}</strong><span>${this._taskMinutes(task)}m</span></div>`).join('')
      : `<div class="today-row"><strong>${escapeHtml(nextTask ? nextTask.topic : 'All missions complete')}</strong><span>${nextTask ? formatDate(nextTask.date, { month: 'short', day: 'numeric' }) : 'DONE'}</span></div>`;

    const box = document.createElement('div');
    box.className = 'sec';
    box.innerHTML = `
      <div class="sec-head"><div class="db"><span class="st">D</span></div><h2>TODAY</h2></div>
      <div class="dt">
        <div class="dt-day">${dayName}</div>
        <div class="dt-full">${fullDate}</div>
        <div class="today-list">${rows}</div>
      </div>
    `;
    this.sidebar.appendChild(box);
  },

  _renderStats(stats) {
    const box = document.createElement('div');
    box.className = 'sec';
    box.innerHTML = `
      <div class="sec-head"><div class="db"><span class="st">S</span></div><h2>BATTLE STATS</h2></div>
      <div class="sw">
        <div class="st-r"><span class="st-l">Total Missions</span><span class="st-v">${stats.total}</span></div>
        <div class="st-r"><span class="st-l">Completed</span><span class="st-v">${stats.done}</span></div>
        <div class="st-r"><span class="st-l">Remaining</span><span class="st-v">${stats.left}</span></div>
        <div class="st-r"><span class="st-l">Study Minutes</span><span class="st-v">${stats.minutes}</span></div>
        <div class="st-r"><span class="st-l">Completion</span><span class="st-v">${stats.pct}%</span></div>
      </div>
    `;
    this.sidebar.appendChild(box);
  },

  _renderChapterProgress() {
    const box = document.createElement('div');
    box.className = 'sec';
    const rows = this.data.chapters.map((chapter) => {
      const prog = Store.getChapterProgress(chapter.id, this.data.tasks);
      const pct = prog.total > 0 ? Math.round((prog.done / prog.total) * 100) : 0;
      const fullCls = pct === 100 ? ' ch-full' : '';
      return `
        <div class="ch-row${fullCls}">
          <span class="ch-name">${escapeHtml(chapter.title)}</span>
          <span class="ch-pct">${pct}%</span>
          <div class="ch-bar"><div class="ch-fill" style="width:${pct}%"></div></div>
        </div>
      `;
    }).join('');

    box.innerHTML = `
      <div class="sec-head"><div class="db"><span class="st">C</span></div><h2>CHAPTERS</h2></div>
      <div class="sw">${rows}</div>
    `;
    this.sidebar.appendChild(box);
  },

  _toast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
};
