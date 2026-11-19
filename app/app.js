// Leonida Legend — GTA VI trophy guide. Static, offline, no network beyond data/trophies.json.
// Progress is saved in localStorage by trophy id; export/import moves it between devices.
const KEY = 'leonida-legend-progress-v1';
const TOTAL_POINTS = 1350;
const CIRC = 326.7; // 2 * PI * 52, the progress ring circumference

const grid = document.getElementById('grid');
const qEl = document.getElementById('q');
const gradeEl = document.getElementById('grade');
const categoryEl = document.getElementById('category');
const statusEl = document.getElementById('status');
const spoilersEl = document.getElementById('spoilers');
const emptyEl = document.getElementById('empty');

const params = new URLSearchParams(location.search);
let earned = new Set();
try {
  earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
} catch {
  earned = new Set();
}

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

// Query params preset the view (used by the screenshots and by shared links).
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('category')) categoryEl.value = params.get('category');
if (params.get('status')) statusEl.value = params.get('status');
if (params.get('q')) qEl.value = params.get('q');
if (params.get('spoilers') === '0') spoilersEl.checked = false;

// Category filter options come from the data, in first-appearance order.
for (const c of [...new Set(trophies.map((t) => t.category))]) {
  const opt = document.createElement('option');
  opt.value = c;
  opt.textContent = c;
  categoryEl.append(opt);
}
if (params.get('category')) categoryEl.value = params.get('category');

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function hidden(t) {
  // Spoilers on (the default): a secret trophy stays hidden until earned.
  return t.secret && spoilersEl.checked && !earned.has(t.id);
}

function render() {
  const q = qEl.value.trim().toLowerCase();
  const grade = gradeEl.value;
  const category = categoryEl.value;
  const status = statusEl.value;
  grid.replaceChildren();
  let shown = 0;

  for (const t of trophies) {
    if (grade !== 'all' && t.grade !== grade) continue;
    if (category !== 'all' && t.category !== category) continue;
    if (status === 'earned' && !earned.has(t.id)) continue;
    if (status === 'unearned' && earned.has(t.id)) continue;
    if (status === 'missable' && !t.missable) continue;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.category).toLowerCase().includes(q)) continue;

    const card = document.createElement('article');
    card.className = `card grade-${t.grade}` + (earned.has(t.id) ? ' earned' : '');

    const head = document.createElement('div');
    head.className = 'card-head';
    const h = document.createElement('h3');
    h.textContent = hidden(t) ? 'Hidden trophy' : t.name;
    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = `#${t.id}`;
    head.append(h, num);
    card.append(head);

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = hidden(t) ? 'A secret trophy. Earn it — or turn off “Hide spoilers” — to reveal it.' : t.description;
    card.append(desc);

    const chips = document.createElement('div');
    chips.className = 'chips';
    for (const [label, cls] of [
      [t.grade, `grade-${t.grade}`],
      [t.category, ''],
      [`${t.points} pts`, ''],
    ]) {
      const chip = document.createElement('span');
      chip.className = `chip ${cls}`.trim();
      chip.textContent = label;
      chips.append(chip);
    }
    if (t.secret) {
      const chip = document.createElement('span');
      chip.className = 'chip secret';
      chip.textContent = 'Secret';
      chips.append(chip);
    }
    if (t.missable) {
      const chip = document.createElement('span');
      chip.className = 'chip missable';
      chip.textContent = 'Possibly missable';
      chips.append(chip);
    }
    card.append(chips);

    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = hidden(t) ? 'Guide hidden with the trophy.' : t.guide;
    card.append(guide);

    if (t.missable && !hidden(t)) {
      const note = document.createElement('p');
      note.className = 'missable-note';
      note.textContent = `⚠ ${t.missable_note}`;
      card.append(note);
    }

    const rarity = document.createElement('p');
    rarity.className = 'rarity';
    rarity.textContent = `Launch-day rarity (Exophase, 2026-11-19): ${t.rarity_pct.toFixed(2)}% of tracked players`;
    card.append(rarity);

    const row = document.createElement('label');
    row.className = 'earned-row';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      save();
      render();
    });
    row.append(box, document.createTextNode(earned.has(t.id) ? 'Earned' : 'Mark as earned'));
    card.append(row);

    grid.append(card);
    shown += 1;
  }

  const earnedCount = earned.size;
  const earnedPoints = trophies.filter((t) => earned.has(t.id)).reduce((s, t) => s + t.points, 0);
  const pct = Math.round((earnedCount / trophies.length) * 100);
  document.getElementById('progress').textContent = `${earnedCount} of ${trophies.length} earned`;
  document.getElementById('points').textContent = `${earnedPoints.toLocaleString()} / ${TOTAL_POINTS.toLocaleString()} points`;
  document.getElementById('shown').textContent = `${shown} shown`;
  document.getElementById('ringPct').textContent = `${pct}%`;
  document.getElementById('ringCount').textContent = `${earnedCount} / ${trophies.length}`;
  document.getElementById('ringFg').style.strokeDashoffset = String(CIRC * (1 - earnedCount / trophies.length));
  emptyEl.hidden = shown !== 0;
  window.__shotReady = true;
}

for (const el of [qEl, gradeEl, categoryEl, statusEl, spoilersEl]) {
  el.addEventListener(el === qEl ? 'input' : 'change', render);
}

document.getElementById('export').addEventListener('click', () => {
  const payload = { game: doc.game, exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'leonida-legend-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(trophies.map((t) => t.id));
    earned = new Set(ids.filter((id) => valid.has(id)));
    save();
    render();
  } catch {
    alert('That file is not a valid Leonida Legend progress export.');
  }
  e.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (!earned.size || confirm('Clear all earned trophies? This cannot be undone.')) {
    earned = new Set();
    save();
    render();
  }
});

render();
