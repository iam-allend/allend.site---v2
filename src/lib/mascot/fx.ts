// One-shot particle effects positioned in document coordinates.

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function spawn(className: string, x: number, y: number, html = '') {
  const el = document.createElement('div');
  el.className = `fx ${className}`;
  el.innerHTML = html;
  el.style.transform = `translate(${x}px, ${y}px)`;
  document.body.append(el);
  return el;
}

const play = (el: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) =>
  el.animate(keyframes, { fill: 'forwards', ...options }).finished.then(() => el.remove(), () => el.remove());

function crackPath(spread: number) {
  const rays = 5 + Math.round(Math.random() * 2);
  let d = '';
  for (let i = 0; i < rays; i++) {
    // Fan the rays across the ground, mostly sideways, slightly downward.
    const angle = Math.PI * (0.05 + (0.9 * i) / (rays - 1)) + rand(-0.12, 0.12);
    let px = 0;
    let py = 0;
    d += 'M0 0';
    const steps = 3;
    for (let s = 1; s <= steps; s++) {
      const len = (spread / steps) * rand(0.7, 1.2);
      px += Math.cos(angle) * len * -1 + rand(-4, 4);
      py += Math.abs(Math.sin(angle)) * len * 0.22 + rand(-1, 2);
      d += `L${px.toFixed(1)} ${py.toFixed(1)}`;
    }
  }
  return d;
}

/** Ground impact at (x, y): crack lines, dust puffs, flying debris. strength 0..1 */
export function impact(x: number, y: number, strength = 1) {
  const s = Math.max(0.25, Math.min(1, strength));

  if (s > 0.45) {
    const spread = 34 + 38 * s;
    const crack = spawn('fx-crack', x, y, `<svg width="1" height="1" class="fx-crack"><path d="${crackPath(spread)}"/></svg>`);
    const path = crack.querySelector('path')!;
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], { duration: 160, fill: 'forwards', easing: 'ease-out' });
    play(crack, [{ opacity: 1 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }], { duration: 1800 });
  }

  const puffs = Math.round(4 + 4 * s);
  for (let i = 0; i < puffs; i++) {
    const dir = i % 2 ? 1 : -1;
    const size = rand(0.5, 1.2) * (0.7 + s * 0.6);
    const dust = spawn('fx-dust', x - 9, y - 12);
    play(dust, [
      { transform: `translate(${x - 9}px, ${y - 12}px) scale(${size * 0.4})`, opacity: 0.85 },
      { transform: `translate(${x - 9 + dir * rand(18, 52) * s}px, ${y - 12 - rand(4, 18)}px) scale(${size * 1.5})`, opacity: 0 },
    ], { duration: rand(650, 950), easing: 'cubic-bezier(.2,.8,.2,1)' });
  }

  const chips = Math.round(5 + 9 * s);
  for (let i = 0; i < chips; i++) {
    const chip = spawn(`fx-chip${Math.random() < 0.18 ? ' alt' : ''}`, x, y - 3);
    const vx = rand(-120, 120) * s;
    const vy = rand(-220, -110) * s;
    const spin = rand(-540, 540);
    const frames: Keyframe[] = [];
    for (let k = 0; k <= 10; k++) {
      const t = (k / 10) * 0.7;
      const px = x + vx * t;
      const py = Math.min(y - 3 + vy * t + 0.5 * 900 * t * t, y + 2);
      frames.push({ transform: `translate(${px}px, ${py}px) rotate(${spin * t}deg)`, opacity: k > 7 ? 1 - (k - 7) / 3 : 1 });
    }
    play(chip, frames, { duration: 700, easing: 'linear' });
  }
}

/** Small puff that rises from (x, y). */
export function steam(x: number, y: number) {
  const el = spawn('fx-steam', x, y);
  const drift = rand(-14, 14);
  play(el, [
    { transform: `translate(${x}px, ${y}px) scale(.4)`, opacity: 0.6 },
    { transform: `translate(${x + drift}px, ${y - 34}px) scale(1.6)`, opacity: 0 },
  ], { duration: 900, easing: 'ease-out' });
}

/** Floating letter (z for sleep, ! for surprise). */
export function glyph(x: number, y: number, char: string, className = 'fx-zzz') {
  const el = spawn(className, x, y, char);
  play(el, [
    { transform: `translate(${x}px, ${y}px) scale(.6)`, opacity: 0 },
    { transform: `translate(${x + 6}px, ${y - 14}px) scale(1)`, opacity: 1, offset: 0.3 },
    { transform: `translate(${x + 16}px, ${y - 40}px) scale(1.2)`, opacity: 0 },
  ], { duration: 1600, easing: 'ease-out' });
}
