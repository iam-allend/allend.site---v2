// Hero laptop: a playlist of short scenes, one per discipline.
//   code      — an editor types a snippet, then the API result appears
//   design    — a cursor builds a logo from shapes in a vector editor
//   hardware  — screws out, cover off, RAM/SSD in, fresh paste, fan spins up
// Each scene is an async function driven by a Run; switching scenes cancels the run.

import type { I18n } from '@/lib/i18n';

type Token = [kind: '' | 'kw' | 'fn' | 'str' | 'cls', text: string];
type Ui = { device: HTMLElement; result: HTMLElement; showResult(html: string): void };
type Scene = (run: Run, ui: Ui) => Promise<void>;

const CANCELLED = Symbol('cancelled');
const HOLD_MS = 3200;

const $ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode) => ctx.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode) => [...ctx.querySelectorAll<T>(sel)];
const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ESC[c]);
/** Escaped text of a bilingual value in the page language. */
const t = (v: I18n) => esc(document.documentElement.lang === 'en' ? v.en : v.id);
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

class Run {
  cancelled = false;
  constructor(readonly instant: boolean, private visible: () => boolean) {}

  cancel() { this.cancelled = true; }

  check() { if (this.cancelled) throw CANCELLED; }

  async wait(ms: number) {
    if (!this.instant) await sleep(ms);
    while (!this.instant && !this.cancelled && !this.visible()) await sleep(300);
    this.check();
  }

  async animate(el: Element, keyframes: Keyframe[], ms: number, options: KeyframeAnimationOptions = {}) {
    const anim = el.animate(keyframes, {
      duration: this.instant ? 0 : ms,
      easing: 'cubic-bezier(.4, 0, .2, 1)',
      fill: 'forwards',
      ...options,
    });
    try { await anim.finished; } catch { throw CANCELLED; }
    this.check();
  }
}

/* ---------- code ---------- */

const SNIPPETS: Record<'attendance' | 'journals', { tabs: string[]; status: string; lines: Token[][]; result: () => string }> = {
  attendance: {
    tabs: ['routes/api.php', 'Attendance.php'],
    status: 'PHP · Laravel',
    lines: [
      [['kw', 'Route'], ['', '::'], ['fn', 'get'], ['', '('], ['str', "'/attendance/today'"], ['', ', '], ['kw', 'function'], ['', ' () {']],
      [['', '    '], ['kw', 'return'], ['', ' '], ['cls', 'Attendance'], ['', '::'], ['fn', 'with'], ['', '('], ['str', "'employee'"], ['', ')']],
      [['', '        ->'], ['fn', 'whereDate'], ['', '('], ['str', "'check_in'"], ['', ', '], ['fn', 'today'], ['', '())']],
      [['', '        ->'], ['fn', 'latest'], ['', '('], ['str', "'check_in'"], ['', ')']],
      [['', '        ->'], ['fn', 'get'], ['', '();']],
      [['', '});']],
    ],
    result: () => `
      <header><span class="data">GET /attendance/today</span><span class="ok">200</span></header>
      <ul>
        <li><i>RA</i><span><b>Rina A.</b><small>07:52</small></span><em>${t({ id: 'Tepat waktu', en: 'On time' })}</em></li>
        <li><i>DS</i><span><b>Dimas S.</b><small>07:58</small></span><em>${t({ id: 'Tepat waktu', en: 'On time' })}</em></li>
        <li><i>YP</i><span><b>Yoga P.</b><small>08:14</small></span><em class="late">${t({ id: 'Terlambat', en: 'Late' })}</em></li>
      </ul>`,
  },
  journals: {
    tabs: ['actions/journals.ts', 'page.tsx'],
    status: 'TypeScript · Next.js',
    lines: [
      [['kw', 'export async function'], ['', ' '], ['fn', 'searchJournals'], ['', '(q: '], ['cls', 'string'], ['', ') {']],
      [['', '  '], ['kw', 'const'], ['', ' { data } = '], ['kw', 'await'], ['', ' supabase']],
      [['', '    .'], ['fn', 'from'], ['', '('], ['str', "'journals'"], ['', ')']],
      [['', '    .'], ['fn', 'select'], ['', '('], ['str', "'id, title, year'"], ['', ')']],
      [['', '    .'], ['fn', 'ilike'], ['', '('], ['str', "'title'"], ['', ', '], ['str', '`%${q}%`'], ['', ')']],
      [['', '    .'], ['fn', 'limit'], ['', '(10);']],
      [['', '  '], ['kw', 'return'], ['', ' data;']],
      [['', '}']],
    ],
    result: () => `
      <header><span class="data">searchJournals('web')</span><span class="ok">3 ${t({ id: 'hasil', en: 'results' })}</span></header>
      <ul>
        <li><i>J</i><span><b>${t({ id: 'Sistem Absensi Berbasis Web', en: 'Web-Based Attendance System' })}</b><small>2025</small></span><em>PDF</em></li>
        <li><i>J</i><span><b>${t({ id: 'Optimasi Query PostgreSQL', en: 'Optimising PostgreSQL Queries' })}</b><small>2025</small></span><em>PDF</em></li>
        <li><i>J</i><span><b>${t({ id: 'Desain Dashboard Admin', en: 'Admin Dashboard Design' })}</b><small>2024</small></span><em>PDF</em></li>
      </ul>`,
  },
};

const charCount = (lines: Token[][]) => lines.flat().reduce((n, [, s]) => n + s.length, 0);

function codeFrame(lines: Token[][], count: number) {
  let left = count;
  const out: string[] = [];
  for (const line of lines) {
    if (left <= 0) break;
    let html = '';
    for (const [kind, str] of line) {
      if (left <= 0) break;
      const part = esc(str.slice(0, left));
      left -= str.length;
      html += kind ? `<span class="tk-${kind}">${part}</span>` : part;
    }
    out.push(html);
  }
  if (count < charCount(lines)) {
    const last = Math.max(out.length - 1, 0);
    out[last] = (out[last] ?? '') + '<span class="caret"></span>';
  }
  return out.join('\n');
}

const codeScene = (key: keyof typeof SNIPPETS): Scene => async (run, ui) => {
  const { lines, result } = SNIPPETS[key];
  const code = $('[data-code]', ui.device);
  $('[data-lines]', ui.device).textContent = lines.map((_, i) => i + 1).join('\n');
  const total = charCount(lines);
  for (let n = 0; n <= total; n += run.instant ? total : 2) {
    code.innerHTML = codeFrame(lines, n);
    await run.wait(32);
  }
  code.innerHTML = codeFrame(lines, total);
  await run.wait(300);
  ui.showResult(result());
};

/* ---------- design ---------- */

const designScene: Scene = async (run, ui) => {
  const svg = $<SVGSVGElement>('.ai', ui.device);
  const cursor = $<SVGGElement>('.cursor', svg);
  const toolHl = $<SVGRectElement>('.tool-hl', svg);
  const layers = $$<SVGGElement>('.lyr', svg);
  const anchors = $$<SVGRectElement>('.anchor', svg);
  let pos = [160, 100];

  const at = () => `translate(${pos[0]}px, ${pos[1]}px)`;
  const move = (x: number, y: number, ms = 450) => {
    const from = at();
    pos = [x, y];
    return run.animate(cursor, [{ transform: from }, { transform: at() }], ms);
  };
  const click = () => run.animate(cursor, [
    { transform: `${at()} scale(1)` }, { transform: `${at()} scale(.8)` }, { transform: `${at()} scale(1)` },
  ], 160);
  const pickTool = async (index: number) => {
    await move(12, 14 + index * 22, 420);
    await click();
    run.animate(toolHl, [{ transform: `translateY(${index * 22}px)` }], 120).catch(() => {});
  };
  const grow = (el: Element, ms: number) => run.animate(el, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], ms);
  const showLayer = (i: number) =>
    run.animate(layers[i], [{ opacity: 0, transform: 'translateX(-4px)' }, { opacity: 1, transform: 'none' }], 250).catch(() => {});

  await run.animate(cursor, [{ transform: at() }], 0);

  await pickTool(1);
  await move(78, 46, 380);
  await Promise.all([move(156, 118, 700), grow($('.s-rect', svg), 700)]);
  showLayer(0);

  await pickTool(2);
  await move(124, 24, 380);
  await Promise.all([move(180, 80, 650), grow($('.s-circle', svg), 650)]);
  showLayer(1);

  await pickTool(3);
  const points: [number, number][] = [[70, 136], [104, 92], [138, 136]];
  for (const [i, [x, y]] of points.entries()) {
    await move(x, y, 320);
    await click();
    run.animate(anchors[i], [{ opacity: 0 }, { opacity: 1 }], 100).catch(() => {});
  }
  await run.animate($('.s-tri', svg), [{ transform: 'scaleY(0)', opacity: 0 }, { transform: 'scaleY(1)', opacity: 1 }], 380);
  for (const a of anchors) run.animate(a, [{ opacity: 0 }], 200).catch(() => {});
  showLayer(2);

  await pickTool(0);
  await move(152, 52, 400);
  await Promise.all([
    move(160, 58, 420),
    run.animate($('.s-circle', svg), [{ transform: 'translate(0, 0)' }, { transform: 'translate(8px, 6px)' }], 420),
  ]);

  await run.animate($('.s-text', svg), [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], 350);
  showLayer(3);
  await run.animate($('.sel', svg), [{ opacity: 0 }, { opacity: 1 }], 250);
  await move(214, 150, 500);

  ui.showResult(`
    <header><span class="data">logo-am.svg</span><span class="ok">${t({ id: 'Diekspor', en: 'Exported' })}</span></header>
    <div class="swatches">
      <span><i style="background:#2A2923"></i>2A2923</span>
      <span><i style="background:#F0855E"></i>F0855E</span>
      <span><i style="background:#D9C27A"></i>D9C27A</span>
      <span><i style="background:#ECE8DC"></i>ECE8DC</span>
    </div>
    <p class="meta">${t({ id: '4 layer · 1 artboard · vektor', en: '4 layers · 1 artboard · vector' })}</p>`);
};

/* ---------- hardware ---------- */

const HW_STEPS: I18n[] = [
  { id: 'Buka casing (4 baut)', en: 'Open the case (4 screws)' },
  { id: 'RAM 8 → 16 GB', en: 'RAM 8 → 16 GB' },
  { id: 'Pasang SSD NVMe 512 GB', en: 'Fit 512 GB NVMe SSD' },
  { id: 'Ganti thermal paste', en: 'Replace thermal paste' },
  { id: 'Suhu CPU 92 → 64 °C', en: 'CPU temp 92 → 64 °C' },
];

const hardwareScene: Scene = async (run, ui) => {
  const svg = $<SVGSVGElement>('.hw', ui.device);
  const driver = $<SVGGElement>('.driver', svg);
  const temp = $<SVGTextElement>('[data-temp]', svg);
  let pos = [330, 120];

  temp.textContent = '92°C';
  ui.showResult(`
    <header><span class="data">${t({ id: 'Servis', en: 'Service' })} #0142</span><span class="ok" data-hw-state>${t({ id: 'Proses', en: 'In progress' })}</span></header>
    <ol>${HW_STEPS.map((s) => `<li>${t(s)}</li>`).join('')}</ol>`);
  const tick = (i: number) => $$('ol li', ui.result)[i]?.classList.add('done');

  const moveDriver = (x: number, y: number, ms = 360) => {
    const from = `translate(${pos[0]}px, ${pos[1]}px)`;
    pos = [x, y];
    return run.animate(driver, [{ transform: from }, { transform: `translate(${x}px, ${y}px)` }], ms);
  };

  await run.wait(500);
  for (const screw of $$<SVGGElement>('.screw', svg)) {
    const c = $<SVGCircleElement>('circle', screw);
    await moveDriver(Number(c.getAttribute('cx')), Number(c.getAttribute('cy')));
    await Promise.all([
      run.animate(screw, [{ transform: 'rotate(0)' }, { transform: 'rotate(-720deg)' }], 420, { easing: 'linear' }),
      run.animate(driver, [
        { transform: `translate(${pos[0]}px, ${pos[1]}px)` },
        { transform: `translate(${pos[0]}px, ${pos[1] - 3}px)` },
        { transform: `translate(${pos[0]}px, ${pos[1]}px)` },
      ], 420),
    ]);
    await run.animate(screw, [{ transform: 'rotate(-720deg) scale(1)', opacity: 1 }, { transform: 'rotate(-720deg) scale(0)', opacity: 0 }], 140);
  }
  await moveDriver(340, -10, 380);
  await run.animate($('g.cover', svg), [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }], 500);
  tick(0);

  await run.animate($('.ram-new', svg), [{ transform: 'translateY(-80px)' }, { transform: 'translateY(2px)', offset: 0.85 }, { transform: 'none' }], 650);
  tick(1);
  await run.animate($('g.ssd', svg), [{ transform: 'translateX(170px)' }, { transform: 'none' }], 700);
  tick(2);
  await run.animate($('.paste', svg), [{ transform: 'scale(0)' }, { transform: 'scale(1.15)', offset: 0.7 }, { transform: 'scale(1)' }], 450);
  tick(3);

  if (!run.instant) {
    $('.fan', svg).animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 260, iterations: Infinity });
  }
  for (let c = 92; c >= 64; c -= run.instant ? 28 : 1) {
    temp.textContent = `${c}°C`;
    await run.wait(45);
  }
  tick(4);
  $('[data-hw-state]', ui.result).innerHTML = t({ id: 'Selesai', en: 'Done' });
};

/* ---------- controller ---------- */

type Item = { key: string; scene: 'code' | 'design' | 'hardware'; play: Scene; tabs: string[]; status: string };

const PLAYLIST: Item[] = [
  { key: 'attendance', scene: 'code', play: codeScene('attendance'), ...SNIPPETS.attendance },
  { key: 'design', scene: 'design', play: designScene, tabs: ['logo-am.ai', 'palette.ai'], status: 'Artboard 1 · 100%' },
  { key: 'journals', scene: 'code', play: codeScene('journals'), ...SNIPPETS.journals },
  { key: 'hardware', scene: 'hardware', play: hardwareScene, tabs: ['servis/laptop-0142', 'checklist.md'], status: 'Diagnostics' },
];

/** Starts the playlist inside `device`. Returns a cleanup function. */
export function startHeroScenes(device: HTMLElement): () => void {
  const instant = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const result = $('[data-result]', device);
  const ui: Ui = {
    device,
    result,
    showResult(html) {
      result.innerHTML = html;
      result.classList.add('on');
    },
  };

  let onScreen = true;
  const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; });
  io.observe(device);
  const visible = () => onScreen && !document.hidden;

  let current = 0;
  let run: Run | null = null;

  const reset = () => {
    for (const anim of device.getAnimations({ subtree: true })) anim.cancel();
    result.classList.remove('on');
    $('[data-code]', device).innerHTML = '';
  };

  async function play(index: number) {
    run?.cancel();
    reset();
    current = index;
    const item = PLAYLIST[index];

    for (const s of $$('[data-scene]', device)) s.classList.toggle('on', s.dataset.scene === item.scene);
    for (const b of $$('[data-goto]', device)) b.setAttribute('aria-pressed', String(b.dataset.goto === item.scene));
    $('[data-tabs]', device).innerHTML = item.tabs.map((name) => `<span>${esc(name)}</span>`).join('');
    $('[data-status]', device).textContent = item.status;

    const thisRun = new Run(instant, visible);
    run = thisRun;
    try {
      await item.play(thisRun, ui);
      await thisRun.wait(HOLD_MS);
    } catch (err) {
      if (err === CANCELLED) return;
      throw err;
    }
    if (!instant) play((index + 1) % PLAYLIST.length);
  }

  const onClick = (e: MouseEvent) => {
    const btn = (e.target as Element).closest<HTMLElement>('[data-goto]');
    if (!btn) return;
    for (let step = 1; step <= PLAYLIST.length; step++) {
      const i = (current + step) % PLAYLIST.length;
      if (PLAYLIST[i].scene === btn.dataset.goto) return void play(i);
    }
  };
  device.addEventListener('click', onClick);
  play(0);

  return () => {
    run?.cancel();
    io.disconnect();
    device.removeEventListener('click', onClick);
    for (const anim of device.getAnimations({ subtree: true })) anim.cancel();
  };
}
