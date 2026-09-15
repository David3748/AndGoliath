import { useEffect, useRef } from 'react';
import { BEATS, WAVE_SPEED, battle } from '../lib/battleState';

// The name is drawn in dots from start to finish (the real text stays in the DOM, transparent, for
// screen readers and selection). When the Little Doctor's blast front sweeps past, it blows apart,
// nearest letters first, and drifts back together. A pure function of the battle clock, so replay
// and rewind reverse it.

const LIFE = 3.2; // seconds from impact until a dot is home again
const STEP = 1.2; // sampling pitch in CSS pixels
const DOT = .55; // half-size of a dot in CSS pixels
const COLORS = ['#b39dff', '#ff79c6', '#f8f8f2'];

const smooth = (u: number) => {
  const t = Math.max(0, Math.min(1, u));
  return t * t * (3 - 2 * t);
};
const noise = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export default function NameBurst({ children }: { children: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const text = textRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!text || !canvas) return;
    if (!ctx) {
      text.style.color = 'inherit';
      return;
    }

    // Home positions relative to the text box, and where that box sits inside the canvas.
    let homeX = new Float32Array(0);
    let homeY = new Float32Array(0);
    let seeds = new Float32Array(0);
    let offsetX = 0;
    let offsetY = 0;
    let dpr = 1;
    let settled = false;

    const draw = (bursting: boolean, box: DOMRect, t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      const paths = COLORS.map(() => new Path2D());
      for (let i = 0; i < homeX.length; i++) {
        let x = homeX[i];
        let y = homeY[i];
        let color = 0;
        if (bursting) {
          const dx = box.left + x - battle.anchorX;
          const dy = box.top + y - battle.anchorY;
          const age = t - (BEATS.wave + (Math.hypot(dx, dy) / battle.unit - 1) / WAVE_SPEED);
          if (age > 0) {
            const seed = seeds[i];
            const out = (1 - Math.exp(-age * 5)) * (1 - smooth((age - .9) / (LIFE - 1.1)));
            const angle = Math.atan2(dy, dx) + (seed - .5) * 1.3;
            const distance = (50 + noise(seed, 7) * 230) * out;
            const curl = Math.sin(age * 3 + seed * 6) * 20 * out;
            x += Math.cos(angle) * distance - Math.sin(angle) * curl;
            y += Math.sin(angle) * distance + Math.cos(angle) * curl;
            color = age < .12 ? 1 : age < .4 ? 2 : 0;
          }
        }
        paths[color].rect(x + offsetX - DOT, y + offsetY - DOT, DOT * 2, DOT * 2);
      }
      paths.forEach((path, color) => {
        ctx.fillStyle = COLORS[color];
        ctx.fill(path);
      });
      settled = !bursting;
    };

    const sample = () => {
      const node = text.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE) return;
      const box = text.getBoundingClientRect();
      const frame = canvas.getBoundingClientRect();
      if (!box.width || !frame.width) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(frame.width * dpr);
      canvas.height = Math.round(frame.height * dpr);
      offsetX = box.left - frame.left;
      offsetY = box.top - frame.top;

      // Draw each glyph where the browser laid it out, so the dots sit exactly on the letters.
      const mask = document.createElement('canvas');
      mask.width = Math.ceil(box.width * dpr);
      mask.height = Math.ceil(box.height * dpr);
      const drawing = mask.getContext('2d', { willReadFrequently: true });
      if (!drawing) return;
      const style = getComputedStyle(text);
      drawing.scale(dpr, dpr);
      drawing.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      drawing.fillStyle = '#fff';
      const ascent = drawing.measureText('Hg').fontBoundingBoxAscent;
      const range = document.createRange();
      const content = node.textContent ?? '';
      for (let i = 0; i < content.length; i++) {
        if (content[i] === ' ') continue;
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const glyph = range.getBoundingClientRect();
        drawing.fillText(content[i], glyph.left - box.left, glyph.top - box.top + ascent);
      }

      const pixels = drawing.getImageData(0, 0, mask.width, mask.height).data;
      const xs: number[] = [];
      const ys: number[] = [];
      for (let y = 0; y < box.height; y += STEP) {
        for (let x = 0; x < box.width; x += STEP) {
          if (pixels[(Math.floor(y * dpr) * mask.width + Math.floor(x * dpr)) * 4 + 3] > 110) {
            xs.push(x);
            ys.push(y);
          }
        }
      }
      homeX = Float32Array.from(xs);
      homeY = Float32Array.from(ys);
      seeds = Float32Array.from(xs, (x, i) => noise(x, ys[i]));
      // Draw the resting name right away rather than waiting for a frame, so it's there from the start.
      draw(false, box, battle.t);
    };

    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      if (!homeX.length) return;
      const t = battle.t;
      const box = text.getBoundingClientRect();

      // Only the stretch around the blast needs per-frame work; at rest the name is drawn once.
      let bursting = false;
      if (battle.unit) {
        const near = Math.hypot(box.right - battle.anchorX, box.bottom - battle.anchorY) / battle.unit;
        const far = Math.hypot(box.left - battle.anchorX, box.top - battle.anchorY) / battle.unit;
        const first = BEATS.wave + (Math.min(near, far) - 1) / WAVE_SPEED - .3;
        const last = BEATS.wave + (Math.max(near, far) - 1) / WAVE_SPEED + .3 + LIFE;
        bursting = t >= first && t <= last;
        // A dot is home once its drift eases out, .2s before LIFE; the farthest corner bounds every dot.
        battle.nameHome = BEATS.wave + (Math.max(near, far) - 1) / WAVE_SPEED + LIFE - .2;
      }
      if (bursting || !settled) draw(bursting, box, t);
    };

    const observer = new ResizeObserver(sample);
    observer.observe(text);
    observer.observe(canvas);
    document.fonts?.ready.then(sample);
    sample();
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      battle.nameHome = 0;
    };
  }, []);

  return (
    <span className="name-burst">
      <span className="name-burst-text" ref={textRef}>{children}</span>
      <canvas className="name-burst-canvas" ref={canvasRef} aria-hidden="true" />
    </span>
  );
}
