// Leonida Trophy Road — offline tracker logic. All data is local; no requests leave the app.
// Progress, filter settings and 100% counters live in localStorage and can be exported/imported.
const STORE = 'leonida-trophy-road:v1';

const SOURCES = {
  'PowerPyx': 'https://www.powerpyx.com/gta-6-trophy-guide-roadmap/',
  'PowerPyx Collectibles': 'https://www.powerpyx.com/gta-6-collectible-guide-progress-database/',
  'Push Square': 'https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap',
  'Duuro Plays': 'https://duuro.net/blog/gta-6-trophy-guide',
  'Output Lag': 'https://outputlag.com/guides/gta-6-trophy-list/',
  'Sweat School': 'https://sweatschool.app/gta-6/trophies/trophies-and-achievements/',
  'GTABase': 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series',
  'Pro-Gamer': 'https://pro-gamer.gg/gta-6-collectible-cards-sets-guide'
};

const CHECKLIST = [
  { key: 'challenges', label: 'Challenges', target: 70, cap: 80, note: 'One Last Thing needs 50 of the 80.' },
  { key: 'stunts', label: 'Stunts', target: 300, note: 'Cunning Stunts pops at 250.' },
  { key: 'underwater', label: 'Underwater discoveries', target: 33, note: 'All 33 sites.' },
  { key: 'ranges', label: 'Shooting-range gold medals', target: 42, note: 'All 42 golds for The Shootist.' },
  { key: 'cards', label: 'Collectible Card sets', target: 15, cap: 18, note: 'Don’t Touch My Deck needs 3 full sets.' },
  { key: 'waink', label: 'WAiNK vehicle scans', target: 200, note: 'Base-model scans counted for 100%.' },
  { key: 'species', label: 'Wildlife & pet species', target: 100, note: 'Study animals with binoculars.' },
  { key: 'jobs', label: 'Optional jobs', target: 100, note: 'Pick up jobs that fit your route.' },
  { key: 'meditations', label: 'Meditations', target: 15, note: 'Positive Mental Attitude needs all 18.' }
];

const STEP_TEXT = {
  1: 'Step 1 — Story first. Play the chapters; take Lucia’s Chapter 1 balcony meditation and the timed Yago race before moving on.',
  2: 'Step 2 — 100% completion cleanup. Work the big counters in free roam after the credits.',
  3: 'Step 3 — Counter cleanup. Finish stranger strands, robberies, money goals and leftover odd trophies.'
};

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};
const icon = (id, cls = 'ico') => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#' + id);
  svg.append(use);
  return svg;
};

const [trophyDoc, guides] = await Promise.all([
  fetch('data/trophies.json').then((r) => r.json()),
  fetch('data/guides.json').then((r) => r.json())
]);
const trophies = trophyDoc.trophies;
const names = new Set(trophies.map((t) => t.name));

function defaults() {
  return {
    grade: 'all', kind: 'all', hideEarned: false, spoiler: false,
    search: '', tab: 'checklist', section: 'roadmap', selected: 'Positive Mental Attitude'
  };
}

function load() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE) ?? '{}') || {}; } catch { saved = {}; }
  const s = Object.assign(defaults(), saved.settings || {});
  if (!['all', 'platinum', 'gold', 'silver', 'bronze'].includes(s.grade)) s.grade = 'all';
  if (!['all', 'story', 'missable', 'collectibles', 'activities', 'online'].includes(s.kind)) s.kind = 'all';
  if (s.tab !== 'roadmap') s.tab = 'checklist';
  if (s.section !== 'completion') s.section = 'roadmap';
  if (!names.has(s.selected)) s.selected = 'Positive Mental Attitude';
  const earned = new Set(Array.isArray(saved.earned) ? saved.earned.filter((n) => names.has(n)) : []);
  const counters = {};
  for (const item of CHECKLIST) {
    const value = Number(saved.counters?.[item.key]);
    counters[item.key] = Number.isFinite(value) ? Math.max(0, Math.min(item.cap || item.target, Math.floor(value))) : 0;
  }
  return { earned, settings: s, counters };
}

const state = load();

// Deep links make each screenshot view reproducible without touching saved settings.
const params = new URLSearchParams(location.search);
const hash = location.hash.replace(/^#/, '');
if (['spoiler', 'roadmap', 'completion', 'checklist'].includes(hash)) {
  if (hash === 'spoiler') { state.settings.spoiler = true; state.settings.tab = 'checklist'; }
  else if (hash === 'completion') { state.settings.tab = 'roadmap'; state.settings.section = 'completion'; }
  else if (hash === 'roadmap') { state.settings.tab = 'roadmap'; state.settings.section = 'roadmap'; }
  else state.settings.tab = 'checklist';
}
if (['1', 'true', 'on'].includes((params.get('spoiler') || '').toLowerCase())) state.settings.spoiler = true;
if (params.get('tab') === 'roadmap') state.settings.tab = 'roadmap';
if (params.get('section') === 'completion') { state.settings.tab = 'roadmap'; state.settings.section = 'completion'; }
if (params.get('trophy') && names.has(params.get('trophy'))) state.settings.selected = params.get('trophy');

function save() {
  localStorage.setItem(STORE, JSON.stringify({
    earned: [...state.earned], settings: state.settings, counters: state.counters
  }));
}

function updateHash() {
  const target = state.settings.tab === 'roadmap'
    ? (state.settings.section === 'completion' ? '#completion' : '#roadmap')
    : (state.settings.spoiler ? '#spoiler' : '#checklist');
  history.replaceState(null, '', target + location.search);
}

let toastTimer;
function toast(message, isError = false) {
  const box = $('toast');
  box.textContent = message;
  box.classList.toggle('error', isError);
  box.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('show'), 3200);
}

function locked(t) {
  const g = guides[t.name] || {};
  return state.settings.spoiler && !state.earned.has(t.name) &&
    (Boolean(g.hidden) || (g.tags || []).includes('story'));
}

function shortHint(t, g, isLocked) {
  if (isLocked) return 'Masked by spoiler mode — mark it earned to reveal the name and guide.';
  const body = (g.guide || '').split('\nSources:')[0];
  const first = body.split('. ')[0] + (body.includes('. ') ? '.' : '');
  return first.length > 118 ? first.slice(0, 115).trimEnd() + '…' : first;
}

function roadmapStep(g) {
  const tags = g.tags || [];
  if (tags.includes('story')) return 1;
  if (tags.includes('collectible') || tags.includes('activity')) return 2;
  return 3;
}

function renderProgress() {
  const total = trophies.length;
  const count = state.earned.size;
  const pct = Math.round((count / total) * 100);
  $('progress-count').textContent = `${count} of ${total} earned`;
  $('progress-pct').textContent = `${pct}%`;
  $('progress-fill').style.width = `${pct}%`;
  $('progress-track').setAttribute('aria-valuenow', String(count));
}

function visibleTrophies() {
  const q = state.settings.search.trim().toLowerCase();
  return trophies.filter((t) => {
    const g = guides[t.name] || {};
    const s = state.settings;
    if (s.grade !== 'all' && t.grade !== s.grade) return false;
    if (s.kind === 'story' && !(g.tags || []).includes('story')) return false;
    if (s.kind === 'missable' && !g.missable) return false;
    if (s.kind === 'collectibles' && !(g.tags || []).includes('collectible')) return false;
    if (s.kind === 'activities' && !(g.tags || []).includes('activity')) return false;
    if (s.kind === 'online') return false; // The base-game list has no online trophies.
    if (s.hideEarned && state.earned.has(t.name)) return false;
    if (q) {
      const isLocked = locked(t);
      const haystack = isLocked
        ? 'hidden trophy spoiler'
        : `${t.name} ${t.description} ${g.guide || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function renderRows() {
  const tbody = $('rows');
  tbody.replaceChildren();
  const list = visibleTrophies();
  for (const t of list) {
    const g = guides[t.name] || {};
    const isLocked = locked(t);
    const isEarned = state.earned.has(t.name);
    const tr = el('tr');
    tr.dataset.name = t.name;
    if (t.name === state.settings.selected) tr.classList.add('selected');
    if (isEarned) tr.classList.add('is-earned');

    const got = el('td', 'col-got');
    const box = el('input');
    box.type = 'checkbox';
    box.dataset.action = 'toggle';
    box.checked = isEarned;
    box.setAttribute('aria-label', `Mark ${isLocked ? 'hidden trophy' : t.name} as earned`);
    got.append(box);

    const titleCell = el('td', 'trophy-cell');
    const title = el('button', 'trophy-title', isLocked ? '??? — Hidden trophy (spoiler)' : t.name);
    title.type = 'button';
    title.dataset.action = 'select';
    title.setAttribute('aria-label', `Open guide for ${isLocked ? 'hidden trophy' : t.name}`);
    titleCell.append(title);
    if (!isLocked) {
      titleCell.append(el('span', 'trophy-desc', t.description));
      const icons = el('span', 'trophy-icons');
      if (g.missable) {
        const w = icon('i-warn', 'ico icon-missable');
        w.setAttribute('aria-label', 'Potentially missable');
        icons.append(w);
      }
      if (g.hidden) {
        const e = icon('i-eye-off', 'ico icon-hidden');
        e.setAttribute('aria-label', 'Hidden on the console list');
        icons.append(e);
      }
      titleCell.append(icons);
    }

    const gradeCell = el('td');
    gradeCell.append(el('span', `chip grade-${t.grade}`, t.grade));
    const hintCell = el('td', 'hint-cell', shortHint(t, g, isLocked));
    tr.append(got, titleCell, gradeCell, hintCell);
    tbody.append(tr);
  }
  $('empty').hidden = list.length > 0;
  $('result-count').textContent = `Showing ${list.length} of ${trophies.length}`;
}

function renderDetail() {
  const t = trophies.find((x) => x.name === state.settings.selected) || trophies[0];
  const g = guides[t.name] || {};
  const isLocked = locked(t);
  const panel = $('detail');
  panel.replaceChildren();

  panel.append(el('div', 'detail-eyebrow', `Trophy ${String(t.id).padStart(2, '0')} / ${trophies.length} · ${t.grade}`));
  panel.append(el('h2', '', isLocked ? '??? — Hidden trophy (spoiler)' : t.name));
  panel.append(el('p', 'detail-desc', isLocked
    ? 'Mark this trophy earned to reveal its official name, description and guide.'
    : t.description));

  const badges = el('div', 'badges');
  badges.append(el('span', `chip grade-${t.grade}`, t.grade));
  if (g.missable) badges.append(el('span', 'badge warn', 'Potentially missable'));
  if ((g.tags || []).includes('story')) badges.append(el('span', 'badge', 'Story'));
  if (isLocked) badges.append(el('span', 'badge', 'Spoiler locked'));
  panel.append(badges);

  if (isLocked) {
    const box = el('div', 'locked');
    box.append(icon('i-lock'));
    box.append(el('span', '', 'Spoiler mode is on. This entry stays masked until you tick it as earned; the checklist row, description and guide are all hidden.'));
    panel.append(box);
    const reveal = el('button', 'btn reveal-btn', 'Mark earned and reveal');
    reveal.type = 'button';
    reveal.addEventListener('click', () => setEarned(t.name, true));
    panel.append(reveal);
  } else {
    if (g.missable) {
      const warning = el('div', 'warning');
      warning.append(icon('i-warn'));
      warning.append(el('span', '', 'Missable warning: Lucia’s balcony meditation is offered after “Down to Earth” in Chapter 1 and is gone after that chapter. Do it before Chapter 2 and keep the chapter save until the trophy pops.'));
      panel.append(warning);
    }
    const guideSection = el('div', 'detail-section');
    guideSection.append(el('h3', '', 'How to earn it'));
    guideSection.append(el('p', 'guide-text', g.guide || 'No guide is bundled for this trophy yet.'));
    panel.append(guideSection);
  }

  const position = el('div', 'detail-section');
  position.append(el('h3', '', 'Roadmap position'));
  position.append(el('p', 'guide-text', STEP_TEXT[roadmapStep(g)]));
  panel.append(position);

  const sourceSection = el('div', 'detail-section');
  sourceSection.append(el('h3', '', 'Sources (open in a new tab)'));
  const links = el('div', 'source-links');
  const used = (g.sources || []).filter((name) => SOURCES[name]);
  for (const name of used.length ? used : ['Push Square']) {
    const a = el('a', '', name);
    a.href = SOURCES[name];
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.append(icon('i-link'));
    links.append(a);
  }
  sourceSection.append(links);
  panel.append(sourceSection);
}

// A brief, non-blocking nod when the 55th trophy lands and the platinum completes.
let platinumHighlightTimer;
function flashPlatinumRow() {
  const row = [...$('rows').querySelectorAll('tr[data-name]')]
    .find((tr) => tr.dataset.name === 'Vice Got a Price!');
  if (!row) return; // A filter may hide the row, in which case there is nothing to highlight.
  clearTimeout(platinumHighlightTimer);
  row.classList.add('platinum-done');
  platinumHighlightTimer = setTimeout(() => row.classList.remove('platinum-done'), 4000);
}

function setEarned(name, value) {
  const wasEarned = state.earned.has(name);
  if (value) state.earned.add(name);
  else state.earned.delete(name);
  const platinumComplete = value && !wasEarned && state.earned.size === trophies.length;
  save();
  renderProgress();
  renderRows();
  renderDetail();
  if (platinumComplete) flashPlatinumRow();
  const box = [...$('rows').querySelectorAll('input[data-action="toggle"]')]
    .find((input) => input.closest('tr')?.dataset.name === name);
  if (box) box.focus();
}

function renderCounters() {
  const tbody = $('counter-rows');
  tbody.replaceChildren();
  for (const item of CHECKLIST) {
    const tr = el('tr');
    const labelCell = el('td');
    labelCell.append(el('strong', '', item.label));
    labelCell.append(el('span', 'counter-note', item.note));
    const targetCell = el('td');
    targetCell.append(el('span', 'target', `${item.target}${item.cap ? ` / ${item.cap}` : ''}`));
    const inputCell = el('td');
    const input = el('input');
    input.type = 'number';
    input.min = '0';
    input.max = String(item.cap || item.target);
    input.value = String(state.counters[item.key]);
    input.dataset.key = item.key;
    input.setAttribute('aria-label', `${item.label} reached (target ${item.target})`);
    inputCell.append(input);
    const barCell = el('td');
    const track = el('div', 'mini-track');
    const fill = el('div', 'mini-fill');
    track.append(fill);
    const label = el('span', 'mini-label');
    barCell.append(track, label);
    tr.append(labelCell, targetCell, inputCell, barCell);
    tbody.append(tr);
    item.refs = { input, track, fill, label };
    updateCounter(item);
  }
  updateCompletionSummary();
}

function updateCounter(item) {
  const value = state.counters[item.key];
  const pct = Math.min(100, Math.round((value / item.target) * 100));
  item.refs.input.value = String(value);
  item.refs.fill.style.width = `${pct}%`;
  item.refs.label.textContent = `${value} / ${item.target} · ${pct}%`;
  item.refs.track.classList.toggle('done', value >= item.target);
}

function updateCompletionSummary() {
  const done = CHECKLIST.filter((item) => state.counters[item.key] >= item.target).length;
  $('completion-summary').textContent = `${done} of ${CHECKLIST.length} targets reached`;
}

function syncControls() {
  $('grade').value = state.settings.grade;
  $('kind').value = state.settings.kind;
  $('search').value = state.settings.search;
  $('hide-earned').checked = state.settings.hideEarned;
  $('spoiler').checked = state.settings.spoiler;
  $('spoiler-state').textContent = state.settings.spoiler ? 'ON' : 'OFF';
  $('spoiler-state').classList.toggle('on', state.settings.spoiler);
  $('view-checklist').hidden = state.settings.tab !== 'checklist';
  $('view-roadmap').hidden = state.settings.tab !== 'roadmap';
  $('tab-checklist').setAttribute('aria-selected', String(state.settings.tab === 'checklist'));
  $('tab-roadmap').setAttribute('aria-selected', String(state.settings.tab === 'roadmap'));
  $('panel-steps').hidden = state.settings.section !== 'roadmap';
  $('panel-completion').hidden = state.settings.section !== 'completion';
  $('sub-roadmap').setAttribute('aria-selected', String(state.settings.section === 'roadmap'));
  $('sub-completion').setAttribute('aria-selected', String(state.settings.section === 'completion'));
}

function setTab(tab, section) {
  state.settings.tab = tab;
  if (section) state.settings.section = section;
  save();
  syncControls();
  updateHash();
}

function renderAll() {
  syncControls();
  renderProgress();
  renderRows();
  renderDetail();
}

// Checklist interactions
$('rows').addEventListener('click', (event) => {
  const box = event.target.closest('input[data-action="toggle"]');
  if (box) {
    setEarned(box.closest('tr').dataset.name, box.checked);
    return;
  }
  const row = event.target.closest('tr[data-name]');
  if (row && !event.target.closest('a')) {
    state.settings.selected = row.dataset.name;
    save();
    renderRows();
    renderDetail();
  }
});
$('rows').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    const title = event.target.closest('.trophy-title');
    if (title && event.target === title) {
      event.preventDefault();
      title.click();
    }
  }
});

$('search').addEventListener('input', (event) => {
  state.settings.search = event.target.value;
  save();
  renderRows();
});
$('search').addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    state.settings.search = '';
    event.target.value = '';
    save();
    renderRows();
  }
});
$('grade').addEventListener('change', (event) => {
  state.settings.grade = event.target.value;
  save();
  renderRows();
});
$('kind').addEventListener('change', (event) => {
  state.settings.kind = event.target.value;
  save();
  renderRows();
});
$('hide-earned').addEventListener('change', (event) => {
  state.settings.hideEarned = event.target.checked;
  save();
  renderRows();
});
$('spoiler').addEventListener('change', (event) => {
  state.settings.spoiler = event.target.checked;
  save();
  renderAll();
  updateHash();
});

// Tabs
$('tab-checklist').addEventListener('click', () => setTab('checklist'));
$('tab-roadmap').addEventListener('click', () => setTab('roadmap'));
$('sub-roadmap').addEventListener('click', () => setTab('roadmap', 'roadmap'));
$('sub-completion').addEventListener('click', () => setTab('roadmap', 'completion'));

// Editable counters
$('counter-rows').addEventListener('input', (event) => {
  const input = event.target.closest('input[data-key]');
  if (!input) return;
  const item = CHECKLIST.find((x) => x.key === input.dataset.key);
  if (!item) return;
  const raw = Number(input.value);
  const value = Number.isFinite(raw) ? Math.max(0, Math.min(item.cap || item.target, Math.floor(raw))) : 0;
  state.counters[item.key] = value;
  save();
  updateCounter(item);
  updateCompletionSummary();
});

// Export / import
$('export').addEventListener('click', () => {
  const payload = {
    app: 'Leonida Trophy Road', version: 1,
    earned: [...state.earned], settings: state.settings, counters: state.counters,
    exportedAt: new Date().toISOString()
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const a = el('a');
  a.href = url;
  a.download = 'leonida-trophy-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`Exported ${state.earned.size} earned trophies.`);
});

$('import').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const earned = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(earned)) throw new Error('no earned list in file');
    state.earned = new Set(earned.filter((name) => names.has(name)));
    const s = data.settings;
    if (s && typeof s === 'object') {
      const merged = Object.assign(defaults(), state.settings);
      for (const key of ['grade', 'kind', 'hideEarned', 'spoiler', 'search', 'tab', 'section', 'selected']) {
        if (Object.hasOwn(s, key)) merged[key] = s[key];
      }
      state.settings = merged;
      if (!['all', 'platinum', 'gold', 'silver', 'bronze'].includes(state.settings.grade)) state.settings.grade = 'all';
      if (!['all', 'story', 'missable', 'collectibles', 'activities', 'online'].includes(state.settings.kind)) state.settings.kind = 'all';
      if (state.settings.tab !== 'roadmap') state.settings.tab = 'checklist';
      if (state.settings.section !== 'completion') state.settings.section = 'roadmap';
      if (!names.has(state.settings.selected)) state.settings.selected = 'Positive Mental Attitude';
    }
    for (const item of CHECKLIST) {
      const value = Number(data.counters?.[item.key]);
      state.counters[item.key] = Number.isFinite(value) ? Math.max(0, Math.min(item.cap || item.target, Math.floor(value))) : 0;
    }
    save();
    renderAll();
    CHECKLIST.forEach(updateCounter);
    updateCompletionSummary();
    updateHash();
    toast(`Imported ${state.earned.size} earned trophies.`);
  } catch (error) {
    toast(`Import failed: ${error.message}`, true);
  }
  event.target.value = '';
});

renderAll();
renderCounters();

// Bring the preselected trophy into view on first paint so the guide and its row match on the cover view.
const initialRow = [...$('rows').querySelectorAll('tr')].find((tr) => tr.dataset.name === state.settings.selected);
if (initialRow && typeof initialRow.scrollIntoView === 'function') initialRow.scrollIntoView({ block: 'nearest' });
