// "Bit": a small robot that lives on the page. It is anchored to the document,
// so scrolling leaves it behind; once out of view it jumps or drops back in and
// cracks the floor. It follows the pointer with its eyes, wanders, thinks out
// loud, sleeps when ignored, can be picked up and thrown, and loses its temper
// when poked too often.

import type { I18n } from '@/lib/i18n';
import { LINES } from './lines';
import { glyph, impact, steam } from './fx';

const STORE_KEY = 'mascot';
const GRAVITY = 2600; // px/s²
const WALK_SPEED = 95; // px/s
const HEADER_H = 64;
const SLEEP_AFTER = 30_000;
const MOODS = ['happy', 'calm', 'curious', 'surprised', 'annoyed', 'angry', 'sleepy', 'dizzy', 'squint'] as const;
type Mood = (typeof MOODS)[number];
type Where = 'above' | 'below' | 'edge' | 'visible';

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const now = () => performance.now();
const text = (line: I18n) => (document.documentElement.lang === 'en' ? line.en : line.id);
/** Visible page width without scrollbar; unlike innerWidth it never grows with overflow. */
const viewW = () => document.documentElement.clientWidth;
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const mascotStore = {
  enabled: () => { try { return localStorage.getItem(STORE_KEY) !== 'off'; } catch { return true; } },
  set: (on: boolean) => { try { localStorage.setItem(STORE_KEY, on ? 'on' : 'off'); } catch { /* ignore */ } },
};

const SVG = `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <g stroke="currentColor" stroke-width="3.2" stroke-linecap="round">
    <path class="limb leg leg-l" d="M26 48v9"/><path class="limb leg leg-r" d="M38 48v9"/>
  </g>
  <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
    <path class="limb arm-l" d="M14 34l-6 6"/><path class="limb arm-r" d="M50 34l6 6"/>
  </g>
  <path d="M32 18v-7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  <circle class="bulb" cx="32" cy="9" r="3.4"/>
  <rect x="13" y="18" width="38" height="32" rx="10" fill="currentColor"/>
  <rect class="face" x="18.5" y="23.5" width="27" height="17" rx="5"/>
  <path class="brow brow-l" d="M23.5 26.2h5"/><path class="brow brow-r" d="M35.5 26.2h5"/>
  <g class="eyes">
    <ellipse class="eye" cx="27" cy="31.3" rx="2.5" ry="2.7"/>
    <ellipse class="eye" cx="37" cy="31.3" rx="2.5" ry="2.7"/>
    <path class="eye-x" d="M25 29.3l4 4m0-4l-4 4M35 29.3l4 4m0-4l-4 4"/>
  </g>
  <ellipse class="blush" cx="22.5" cy="36.3" rx="2.2" ry="1.4"/><ellipse class="blush" cx="41.5" cy="36.3" rx="2.2" ry="1.4"/>
  <path class="mouth m-smile" d="M29.5 36.3q2.5 2.2 5 0"/>
  <path class="mouth fill m-grin" d="M28.6 35.6h6.8q-.4 3.6-3.4 3.6t-3.4-3.6z"/>
  <ellipse class="mouth fill m-o" cx="32" cy="37" rx="1.7" ry="2"/>
  <path class="mouth m-frown" d="M29.3 38.4q2.7-2.4 5.4 0"/>
  <path class="mouth m-flat" d="M29.6 37.2h4.8"/>
  <path class="mouth m-wave" d="M28.8 37.4q1-1.2 2.1 0t2.1 0 2.1 0"/>
</svg>`;

class Bit {
  readonly el: HTMLDivElement;
  private body: HTMLDivElement;
  private bubble: HTMLDivElement;
  private size: number;
  private x = 0;
  private y = 0;
  private mood: Mood = 'happy';
  private baseMood: Mood = 'happy';
  private token = 0; // bumps whenever an action is interrupted
  private busy = false;
  private airborne = false;
  private held = false;
  private returning = false;
  private pokes: number[] = [];
  private lastInput = now();
  private lastSaid = 0;
  private alive = true;
  private walkAnim: Animation | null = null;
  private timers: { mood?: number; say?: number; zzz?: number; steam?: number } = {};
  private events = new AbortController();

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'bit mood-happy';
    this.el.innerHTML = `
      <div class="bit-say" role="status" aria-live="polite"></div>
      <div class="bit-flip"><span class="bit-shadow"></span><div class="bit-body">${SVG}</div></div>`;
    document.body.append(this.el);
    this.body = this.el.querySelector('.bit-body')!;
    this.bubble = this.el.querySelector('.bit-say')!;
    this.size = this.el.offsetWidth;
  }

  /* ---------- geometry ---------- */

  private get groundY() { return scrollY + innerHeight - this.size - 14; }
  private get maxY() { return document.documentElement.scrollHeight - this.size - 4; }
  clampX(x: number) { return Math.min(Math.max(x, 8), viewW() - this.size - 8); }

  place(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.el.style.transform = `translate(${x}px, ${y}px)`;
  }

  private face(dx: number) {
    if (Math.abs(dx) > 1) this.el.classList.toggle('left', dx < 0);
  }

  private visibility(): Where {
    const top = this.y - scrollY;
    if (top + this.size < HEADER_H) return 'above';
    if (top > innerHeight) return 'below';
    if (top < HEADER_H - 8 || top + this.size > innerHeight + 4) return 'edge';
    return 'visible';
  }

  /* ---------- expression ---------- */

  private setMood(mood: Mood, ms?: number) {
    for (const m of MOODS) this.el.classList.remove(`mood-${m}`);
    this.el.classList.add(`mood-${mood}`);
    this.mood = mood;
    clearTimeout(this.timers.mood);
    if (ms) this.timers.mood = window.setTimeout(() => this.setMood(this.baseMood), ms);
  }

  say(line: I18n, ms = 2600) {
    this.lastSaid = now();
    this.bubble.textContent = text(line);
    const width = this.bubble.offsetWidth;
    const left = this.x + this.size / 2 - width / 2;
    const shift = Math.max(8 - left, 0) - Math.max(left + width - (viewW() - 8), 0);
    this.bubble.style.setProperty('--say-x', `${-width / 2 + shift}px`);
    this.bubble.style.setProperty('--tail-x', `${Math.min(Math.max(width / 2 - shift, 14), width - 14)}px`);
    this.bubble.classList.add('on');
    clearTimeout(this.timers.say);
    this.timers.say = window.setTimeout(() => this.bubble.classList.remove('on'), ms);
  }

  private async pose(name: string, ms: number) {
    this.el.classList.add(name);
    await sleep(ms);
    this.el.classList.remove(name);
  }

  private lookAt(clientX: number, clientY: number) {
    const dx = clientX - (this.x + this.size / 2);
    const dy = clientY - (this.y - scrollY + this.size / 2);
    const dist = Math.hypot(dx, dy) || 1;
    const flip = this.el.classList.contains('left') ? -1 : 1;
    const reach = Math.min(dist / 60, 1) * 2.6;
    this.el.style.setProperty('--lx', `${((dx / dist) * reach * flip).toFixed(2)}px`);
    this.el.style.setProperty('--ly', `${((dy / dist) * reach * 0.8).toFixed(2)}px`);
    return { dx, dist };
  }

  /* ---------- movement ---------- */

  private stop() {
    this.token++;
    if (this.walkAnim) {
      const m = new DOMMatrix(getComputedStyle(this.el).transform);
      this.walkAnim.cancel();
      this.walkAnim = null;
      this.place(m.m41, m.m42);
    }
    this.el.classList.remove('walk');
  }

  private async walkTo(target: number, speed = WALK_SPEED) {
    const to = this.clampX(target);
    const from = this.x;
    if (Math.abs(to - from) < 4) return;
    const token = this.token;
    this.face(to - from);
    this.el.classList.add('walk');
    const anim = this.el.animate(
      [{ transform: `translate(${from}px, ${this.y}px)` }, { transform: `translate(${to}px, ${this.y}px)` }],
      { duration: (Math.abs(to - from) / speed) * 1000, easing: 'linear' },
    );
    this.walkAnim = anim;
    try {
      await anim.finished;
    } catch {
      return; // interrupted; stop() already placed us
    }
    this.walkAnim = null;
    this.el.classList.remove('walk');
    if (token === this.token) this.place(to, this.y);
  }

  private squash(strength: number) {
    const s = Math.min(strength, 1);
    this.body.animate([
      { transform: 'none' },
      { transform: `scale(${1 + 0.25 * s}, ${1 - 0.3 * s})` },
      { transform: `scale(${1 - 0.06 * s}, ${1 + 0.08 * s})` },
      { transform: 'none' },
    ], { duration: 420, easing: 'ease-out' });
  }

  /** Ballistic flight until landing on groundY. Resolves with the impact speed. */
  private fly({ vx = 0, vy = 0, groundY = this.groundY }: { vx?: number; vy?: number; groundY?: number }) {
    this.airborne = true;
    this.el.classList.add('air');
    const token = ++this.token;
    let px = this.x;
    let py = this.y;
    let rot = 0;
    let bounced = false;
    let landingSpeed = 0;
    let last = now();

    return new Promise<number>((resolve) => {
      const step = () => {
        if (token !== this.token || !this.alive) return resolve(0);
        const t = now();
        const dt = Math.min((t - last) / 1000, 0.04);
        last = t;

        vy += GRAVITY * dt;
        px += vx * dt;
        py += vy * dt;
        rot += vx * dt * 0.9;

        const maxX = viewW() - this.size - 8;
        if (px < 8 || px > maxX) {
          px = Math.min(Math.max(px, 8), maxX);
          vx = -vx * 0.45;
        }

        if (py >= groundY && vy > 0) {
          py = groundY;
          if (!landingSpeed) landingSpeed = vy;
          impact(px + this.size / 2, py + this.size - 2, bounced ? vy / 2600 : vy / 1700);
          this.squash(vy / 1600);
          if (!bounced && vy > 900) {
            bounced = true;
            vy = -vy * 0.26;
            vx *= 0.5;
          } else {
            this.place(px, py);
            this.body.style.rotate = '';
            this.airborne = false;
            this.el.classList.remove('air');
            return resolve(landingSpeed);
          }
        }

        this.place(px, py);
        this.body.style.rotate = `${(rot % 360).toFixed(1)}deg`;
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  private jumpTo(x: number, groundY: number, seconds: number) {
    const vx = (x - this.x) / seconds;
    const vy = (groundY - this.y - 0.5 * GRAVITY * seconds * seconds) / seconds;
    this.face(vx);
    return this.fly({ vx, vy, groundY });
  }

  /* ---------- scenes ---------- */

  async enter() {
    this.stop();
    this.busy = true;
    const ground = this.groundY;
    const target = this.clampX(rand(0.15, 0.85) * viewW());
    const style = pick(['walk', 'drop', 'drop', 'leap']);

    if (style === 'walk') {
      const fromLeft = Math.random() < 0.5;
      this.place(fromLeft ? -this.size : viewW(), ground);
      await this.walkTo(target, WALK_SPEED * 1.4);
    } else if (style === 'drop') {
      this.place(target, scrollY - this.size - 40);
      this.setMood('surprised');
      await this.fly({ groundY: ground });
    } else {
      this.place(target, scrollY + innerHeight + 10);
      const apex = ground - rand(140, 220);
      await this.fly({ vy: -Math.sqrt(2 * GRAVITY * (this.y - apex)), groundY: ground });
    }
    if (!this.alive) return;

    this.setMood('happy');
    this.say(pick(LINES.hello));
    await this.pose('wave', 1700);
    this.busy = false;
  }

  private async comeBack(from: Where) {
    if (this.airborne || this.held || this.returning) return;
    this.stop();
    this.returning = true;
    this.busy = true;
    const ground = this.groundY;
    const target = this.clampX(viewW() / 2 - this.size / 2 + rand(-0.3, 0.3) * viewW());

    let speed: number;
    if (from === 'above') {
      this.place(target, scrollY - this.size - 30);
      this.setMood('surprised');
      speed = await this.fly({ vx: rand(-60, 60), groundY: ground });
    } else if (from === 'below') {
      this.place(target, scrollY + innerHeight + 10);
      const apex = ground - rand(120, 200);
      speed = await this.fly({ vy: -Math.sqrt(2 * GRAVITY * (this.y - apex)), groundY: ground });
    } else {
      speed = await this.jumpTo(target, ground, 0.75);
    }
    await this.afterLanding(speed, LINES.backAgain);
    this.returning = false;
    this.busy = false;
  }

  private async afterLanding(speed: number, lines: I18n[]) {
    if (speed > 1700) {
      this.setMood('dizzy');
      this.say(pick(LINES.landed));
      await sleep(2200);
      this.setMood(this.baseMood);
    } else if (speed > 0) {
      this.setMood(this.baseMood === 'angry' ? 'angry' : 'happy');
      this.say(pick(lines));
    }
  }

  private stomp() {
    return this.fly({ vy: -520, groundY: this.y });
  }

  private async rage(pointerX: number) {
    this.stop();
    this.busy = true;
    this.baseMood = 'angry';
    this.setMood('angry');
    glyph(this.x + this.size * 0.7, this.y - 6, '!', 'fx-bang');
    this.say(pick(LINES.angry), 2400);
    this.timers.steam = window.setInterval(() => steam(this.x + this.size / 2 - 5, this.y + 2), 220);
    await this.stomp();
    await this.stomp();
    const away = pointerX < this.x + this.size / 2 ? viewW() : 0;
    await this.walkTo(away, WALK_SPEED * 1.6);
    this.face(away ? 1 : -1); // back turned to the pointer
    await sleep(3200);
    clearInterval(this.timers.steam);
    if (!this.alive) return;
    this.baseMood = 'happy';
    this.pokes = [];
    this.setMood('calm');
    this.say(pick(LINES.forgive));
    await sleep(1600);
    this.setMood('happy');
    this.busy = false;
  }

  private async poke(pointerX: number) {
    const t = now();
    this.pokes = this.pokes.filter((p) => t - p < 5000);
    this.pokes.push(t);
    const n = this.pokes.length;

    if (this.mood === 'sleepy') return this.wake();
    if (this.baseMood === 'angry') return steam(this.x + this.size / 2 - 5, this.y);
    if (n >= 5) return this.rage(pointerX);
    if (n >= 3) {
      this.setMood('annoyed', 2600);
      this.say(pick(LINES.annoyed));
      this.squash(0.4);
      return;
    }
    if (this.busy) return;
    this.setMood('happy');
    this.say(pick(LINES.poke), 1800);
    this.busy = true;
    await this.fly({ vy: -620, groundY: this.y });
    this.busy = false;
  }

  private async wake() {
    this.baseMood = 'happy';
    clearInterval(this.timers.zzz);
    this.setMood('surprised', 1400);
    glyph(this.x + this.size * 0.7, this.y - 4, '!', 'fx-bang');
    this.say(pick(LINES.wake));
    if (!this.busy && !this.airborne) {
      this.busy = true;
      await this.fly({ vy: -560, groundY: this.y });
      this.busy = false;
    }
  }

  private fallAsleep() {
    this.stop();
    this.baseMood = 'sleepy';
    this.setMood('sleepy');
    clearInterval(this.timers.zzz);
    this.timers.zzz = window.setInterval(() => {
      if (this.mood === 'sleepy') glyph(this.x + this.size * 0.62, this.y + 4, 'z');
    }, 1300);
  }

  private async idle() {
    const token = this.token;
    const roll = Math.random();
    if (roll < 0.4) {
      await this.walkTo(rand(0.08, 0.92) * viewW());
      if (token === this.token && Math.random() < 0.3) await this.fly({ vy: -480, groundY: this.y });
    } else if (roll < 0.55) {
      this.face(-1); await sleep(700); this.face(1); await sleep(700);
    } else if (roll < 0.75) {
      if (now() - this.lastSaid > 9000) {
        this.setMood('curious', 2600);
        this.say(pick(LINES.thoughts), 3000);
      }
    } else if (roll < 0.87) {
      await this.pose('stretch', 1200);
    } else {
      await this.pose('wave', 1300);
    }
  }

  async live() {
    while (this.alive) {
      await sleep(rand(2800, 6000));
      if (!this.alive || this.held || this.airborne || this.returning || document.hidden) continue;
      const where = this.visibility();
      if (where !== 'visible') {
        if (this.baseMood !== 'angry') this.comeBack(where);
        continue;
      }
      if (this.busy || this.mood === 'sleepy') continue;
      if (now() - this.lastInput > SLEEP_AFTER) { this.fallAsleep(); continue; }
      this.busy = true;
      try { await this.idle(); } finally { this.busy = false; }
    }
  }

  /* ---------- input ---------- */

  bind() {
    const signal = this.events.signal;
    let candidate: { x: number; y: number } | null = null;
    let samples: { x: number; y: number; t: number }[] = [];
    let pointerX = viewW() / 2;

    const markInput = () => {
      this.lastInput = now();
      if (this.mood === 'sleepy' && !this.held) this.wake();
    };

    this.body.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      candidate = { x: e.clientX, y: e.clientY };
      this.body.setPointerCapture(e.pointerId);
    }, { signal });

    this.body.addEventListener('pointermove', (e) => {
      if (!candidate) return;
      if (!this.held && Math.hypot(e.clientX - candidate.x, e.clientY - candidate.y) > 6) {
        this.stop();
        clearInterval(this.timers.zzz);
        this.baseMood = 'happy';
        this.held = true;
        this.busy = true;
        this.airborne = false;
        this.el.classList.add('held', 'air');
        this.setMood('surprised');
        this.say(pick(LINES.held), 2000);
      }
      if (this.held) {
        this.place(e.clientX - this.size / 2, e.clientY + scrollY - this.size * 0.2);
        samples.push({ x: e.clientX, y: e.clientY, t: now() });
        samples = samples.filter((s) => now() - s.t < 90);
      }
    }, { signal });

    const release = async () => {
      if (!candidate) return;
      candidate = null;
      if (!this.held) return this.poke(pointerX);
      this.held = false;
      this.el.classList.remove('held');
      const first = samples[0];
      const last = samples[samples.length - 1];
      samples = [];
      const dt = first && last ? (last.t - first.t) / 1000 : 0;
      const vx = dt > 0.01 ? Math.max(-1800, Math.min(1800, (last.x - first.x) / dt)) : 0;
      const vy = dt > 0.01 ? Math.max(-1800, Math.min(1400, (last.y - first.y) / dt)) : 0;
      const speed = await this.fly({ vx, vy, groundY: Math.min(this.groundY, this.maxY) });
      await this.afterLanding(speed, LINES.landed);
      this.busy = false;
      markInput();
    };
    this.body.addEventListener('pointerup', release, { signal });
    this.body.addEventListener('pointercancel', release, { signal });

    addEventListener('pointermove', (e) => {
      pointerX = e.clientX;
      markInput();
      if (this.mood === 'sleepy' || this.mood === 'dizzy') return;
      const { dx, dist } = this.lookAt(e.clientX, e.clientY);
      if (dist < 150 && !this.busy && !this.held && this.mood !== 'angry') this.face(dx);
    }, { passive: true, signal });

    addEventListener('keydown', markInput, { signal });

    let lastScrollY = scrollY;
    let lastScrollT = now();
    let settle = 0;
    addEventListener('scroll', () => {
      const t = now();
      const v = Math.abs(scrollY - lastScrollY) / Math.max(t - lastScrollT, 1);
      lastScrollY = scrollY;
      lastScrollT = t;
      markInput();

      if (v > 3 && this.visibility() === 'visible' && !this.busy && now() - this.lastSaid > 6000) {
        this.setMood('surprised', 1400);
        this.say(pick(LINES.scrolled), 1600);
        this.body.animate([{ rotate: '0deg' }, { rotate: '-12deg' }, { rotate: '9deg' }, { rotate: '0deg' }], { duration: 500 });
      }

      clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (this.held || this.airborne || this.baseMood === 'angry') return;
        const where = this.visibility();
        if (where !== 'visible') this.comeBack(where);
      }, 450);
    }, { passive: true, signal });

    addEventListener('resize', () => {
      if (!this.airborne && !this.held) this.place(this.clampX(this.x), this.y);
    }, { signal });

    addEventListener('themechange', (e) => {
      const dark = (e as CustomEvent<string>).detail === 'dark';
      this.setMood(dark ? 'surprised' : 'squint', 1600);
      this.say(pick(dark ? LINES.dark : LINES.light));
    }, { signal });

    const langWatch = new MutationObserver(() => {
      this.setMood('happy');
      this.say(pick(document.documentElement.lang === 'en' ? LINES.langEn : LINES.langId));
    });
    langWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    signal.addEventListener('abort', () => langWatch.disconnect());
  }

  async leave() {
    this.stop();
    clearInterval(this.timers.zzz);
    this.say(pick(LINES.bye), 1400);
    await sleep(600);
    await this.walkTo(this.x < viewW() / 2 ? -this.size - 20 : viewW() + 20, WALK_SPEED * 2);
    this.destroy();
  }

  destroy() {
    this.alive = false;
    this.token++;
    this.events.abort();
    for (const id of Object.values(this.timers)) { clearTimeout(id); clearInterval(id); }
    this.el.remove();
  }
}

export type MascotHandle = { navigated(): void; destroy(): void; leave(): Promise<void> };

/** Creates the mascot. Reduced motion → it stands still and only talks when clicked. */
export function mountMascot(): MascotHandle {
  const bit = new Bit();
  if (reducedMotion()) {
    bit.place(bit.clampX(viewW() - 120), scrollY + innerHeight - 80);
    bit.el.addEventListener('click', () => bit.say(pick(LINES.poke)));
  } else {
    bit.bind();
    bit.enter().then(() => bit.live());
  }
  return {
    navigated: () => { if (!reducedMotion()) bit.enter(); },
    destroy: () => bit.destroy(),
    leave: () => bit.leave(),
  };
}
