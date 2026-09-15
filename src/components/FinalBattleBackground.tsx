import { useEffect, useRef, useState } from 'react';
import { BEATS, battle } from '../lib/battleState';

// Ender's final battle, drawn the way the Command School simulator shows it: every ship a point of light.
// A small formation sweeps in from the left, cuts through the Formic swarm, fires the Little Doctor at
// their homeworld, and the field takes the planet apart and the swarm with it. Plays once, then rests on
// the wreckage, which stays stirrable with the cursor.

type Status = 'playing' | 'paused' | 'done';
type V3 = [number, number, number];

const T = BEATS; // shared with the page overlays that react to the battle
// The story runs until the name has re-formed, so it never ends mid-drift.
const storyEnd = () => Math.max(T.end, battle.nameHome + .5);
const STANDOFF = 1.4;

// Site palette (tailwind.config.js): Ender's fleet is primary lavender, the Formics and their world are
// comment slate, and pink is reserved for the Little Doctor's field.
const COLORS = ['#44475a', '#6272a4', '#8f9ccb', '#b39dff', '#f8f8f2', '#ff79c6'];
const DIM = 0, SLATE = 1, MIST = 2, LAVENDER = 3, WHITE = 4, PINK = 5;
const ALPHA_STEPS = 12;

// Aftermath: every shard has left the flash by T.fire + .15 + T.spread + .75 = 10, so from CALM the nebula can
// start to turn about the planet's old axis, inner shells faster. A few embers of the field flare and cool.
// The wider the ramp from CALM to T.end, the gentler a rewind unwinds the spin.
const CALM = 10.5;
const LANE_SPIN = [.055, .04, .032, .024]; // rad/s: core, inner nebula, band, outer nebula
const EMBERS = 8;
const BAND = [[.4, .014], [.22, .018], [.08, .03]]; // soft band strokes: width in radii, alpha

// Particle budget. Lower tiers thin the planet and swarm and cap the canvas resolution; tier 0 is the full picture.
const STARS = 700;
const PLANET = 6500;
const SWARM = 5000;
const TIERS = [{ count: 1, dpr: 2 }, { count: .6, dpr: 1.5 }, { count: .35, dpr: 1 }];
const PAINT_BUDGET = 8; // ms of paint() per frame, averaged, before stepping down a tier

// Cursor: particles are pushed, swirled, and dragged along with the pointer, then spring home.
const REACH = 150;
const PUSH = 2400;
const SWIRL = 900;
const DRAG = 6;
const SPRING = 14;
const DAMPING = 4.2;

const clamp = (value: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, value));
const smooth = (u: number) => {
  const t = clamp(u);
  return t * t * (3 - 2 * t);
};
const easeOut = (u: number) => 1 - (1 - clamp(u)) ** 3;
const span = (t: number, from: number, to: number) => clamp((t - from) / (to - from));
// Each visit shifts the noise field and turns the planet, so every visit is a different battle; within a visit
// everything stays a pure function of t.
let visit = 0;
let turned = .8;
const noise = (x: number, y: number) => {
  const value = Math.sin((x + visit) * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};
const normalize = ([x, y, z]: V3): V3 => {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
};
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const along = (origin: V3, ...terms: Array<[V3, number]>): V3 => {
  const out: V3 = [origin[0], origin[1], origin[2]];
  terms.forEach(([dir, amount]) => {
    out[0] += dir[0] * amount;
    out[1] += dir[1] * amount;
    out[2] += dir[2] * amount;
  });
  return out;
};

// View space: x right, y down, z toward the viewer; one unit is one planet radius.
// The fleet strikes the planet's lower-left face. On wide screens it runs in from the left along the open band under
// the text; on phones held upright, where the text spans the width, it climbs in from the bottom-left corner instead.
const LIGHT = normalize([-.6, -.55, .6]);
const STRIKE = normalize([-.5, .72, .48]);
const APPROACH = { wide: [[-8.6, .5, .6], [-5, 1.15, 1.2], [-2.6, 1.35, 1.3]], tall: [[-4, 3.3, .6], [-2.9, 2.9, 1], [-1.8, 2.2, 1.2]] };
const tallView = (width: number, height: number) => width < 760 && height > width * 1.5;
let HIT: V3, WALL: V3, P0: V3, P1: V3, P2: V3, P3: V3;
// Each visit swings the strike about the view axis, -15° to +10° (further round puts it under the reading column on
// small laptops), and bows the approach a little to either side; the last leg follows the strike round.
const aim = (tall: boolean) => {
  const swing = -.26 + noise(1, 98) * .43;
  const bow = (noise(2, 98) - (tall ? .5 : .25)) * .4; // wide: mostly downward, away from the text
  const c = Math.cos(swing);
  const s = Math.sin(swing);
  HIT = [STRIKE[0] * c - STRIKE[1] * s, STRIKE[0] * s + STRIKE[1] * c, STRIKE[2]];
  WALL = [HIT[0] * 1.9, HIT[1] * 1.9, HIT[2] * 1.9];
  P3 = [HIT[0] * 1.42, HIT[1] * 1.42, HIT[2] * 1.42];
  const [start, mid, last] = APPROACH[tall ? 'tall' : 'wide'] as V3[];
  const dx = P3[0] - start[0];
  const dy = P3[1] - start[1];
  const nx = -dy / Math.hypot(dx, dy) * bow;
  const ny = dx / Math.hypot(dx, dy) * bow;
  P0 = start;
  P1 = [mid[0] + nx, mid[1] + ny, mid[2]];
  P2 = [0, 1, 2].map(k => last[k] + (P3[k] - STRIKE[k] * 1.42) * .7 + [nx, ny, 0][k] * .6) as V3;
};
const TILT = -.3;
const TILT_C = Math.cos(TILT);
const TILT_S = Math.sin(TILT);
const FOCAL = 9;

// Orbital frame to view: spin about the planet's axis, then tip the axis toward the viewer.
const orbitToView = (x: number, y: number, z: number, spin: number, out: V3) => {
  const c = Math.cos(spin);
  const s = Math.sin(spin);
  const rx = x * c + z * s;
  const rz = -x * s + z * c;
  out[0] = rx;
  out[1] = y * TILT_C - rz * TILT_S;
  out[2] = y * TILT_S + rz * TILT_C;
};
const planetSpin = (t: number) => turned + Math.min(t, T.fire) * .05;
const waveRadius = (t: number) => 1 + 1.6 * (t - T.wave);
const fieldAngle = (t: number) => Math.PI * ((t - T.fire - .15) / T.spread) ** 2;

const fleetProgress = (t: number) => smooth(span(t, T.advance, T.arrive));
const fleetAt = (t: number, out: V3) => {
  const u = fleetProgress(t);
  const v = 1 - u;
  const a = v * v * v;
  const b = 3 * v * v * u;
  const c = 3 * v * u * u;
  const d = u * u * u;
  for (let k = 0; k < 3; k++) out[k] = a * P0[k] + b * P1[k] + c * P2[k] + d * P3[k];
};
const fleetHeading = (t: number): V3 => {
  const u = fleetProgress(t);
  const v = 1 - u;
  return normalize([0, 1, 2].map(k =>
    3 * v * v * (P1[k] - P0[k]) + 6 * v * u * (P2[k] - P1[k]) + 3 * u * u * (P3[k] - P2[k])) as V3);
};

type Ship = { right: number; up: number; along: number; lead: boolean; death: number; seed: number };

export default function FinalBattleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>('playing');
  const statusRef = useRef<Status>('playing');
  const replayRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const tmp: V3 = [0, 0, 0];
    visit = Math.floor(Math.random() * 1000);
    turned = noise(0, 99) * Math.PI * 2;
    let tall = tallView(canvas.clientWidth, canvas.clientHeight);
    aim(tall);

    // Starting tier from cheap signals; the paint probe in render() can step down from there.
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const memory = nav.deviceMemory || 8;
    const signals = [
      (nav.hardwareConcurrency || 8) <= 4,
      memory <= 4,
      memory <= 2,
      !!nav.connection?.saveData,
      window.innerWidth * window.innerHeight < 480000, // phone-sized; the planet is drawn smaller there too
    ].filter(Boolean).length;
    let tier = signals >= 3 ? 2 : signals ? 1 : 0;

    // ---- Stars: screen-space backdrop.
    const NS = STARS;
    const SX = new Float32Array(NS);
    const SY = new Float32Array(NS);
    const SA = new Float32Array(NS);
    for (let i = 0; i < NS; i++) {
      SX[i] = noise(i, 3);
      SY[i] = noise(i, 7);
      SA[i] = .06 + noise(i, 11) ** 2.4 * .45;
    }

    // ---- Planet: a Fibonacci sphere with continents from layered sines. The lattice depends on the count, so a
    // tier change rebuilds it whole.
    let NP = 0;
    let PX = new Float32Array(0);
    let PY = PX;
    let PZ = PX;
    let PL = PX;
    let PT = PX; // when the field reaches this point
    let FX = PX; // view position at the moment of fire
    let FY = PX;
    let FZ = PX;
    const field = () => {
      for (let i = 0; i < NP; i++) {
        const angle = Math.acos(clamp(FX[i] * HIT[0] + FY[i] * HIT[1] + FZ[i] * HIT[2], -1, 1));
        PT[i] = T.fire + .15 + T.spread * Math.sqrt(angle / Math.PI);
      }
    };
    const buildPlanet = (count: number) => {
      NP = count;
      [PX, PY, PZ, PL, PT, FX, FY, FZ] = Array.from({ length: 8 }, () => new Float32Array(NP));
      for (let i = 0; i < NP; i++) {
        const y = 1 - 2 * (i + .5) / NP;
        const r = Math.sqrt(1 - y * y);
        const phi = i * 2.399963;
        const x = Math.cos(phi) * r;
        const z = Math.sin(phi) * r;
        PX[i] = x;
        PY[i] = y;
        PZ[i] = z;
        const relief = Math.sin(x * 3.1 + 1.3) * Math.sin(y * 2.6 + .4) * Math.sin(z * 3.4 + 2.1)
          + .45 * Math.sin(x * 7.1 + z * 5.3 + 1) * Math.sin(y * 6.2 + .7)
          + .2 * Math.sin(x * 13 + y * 11 + z * 9);
        PL[i] = relief > .08 ? 1 : .38;
        orbitToView(x, y, z, planetSpin(T.fire), tmp);
        FX[i] = tmp[0];
        FY[i] = tmp[1];
        FZ[i] = tmp[2];
      }
      field();
    };

    // ---- Formic swarm: clumped shells in slow orbit that mass into a wall ahead of the fleet. Every ship derives
    // from its own index, so a lower tier just draws a prefix of the ships built at the starting tier.
    const NW_BUILT = Math.round(SWARM * TIERS[tier].count);
    let NW = NW_BUILT;
    const WX = new Float32Array(NW);
    const WY = new Float32Array(NW);
    const WZ = new Float32Array(NW);
    const WO = new Float32Array(NW);
    const WS = new Float32Array(NW);
    const WR = new Float64Array(NW); // orbit radius, which the spin preserves
    const WD = new Float32Array(NW); // death: shot down in the breach, or caught by the blast
    const clusters: V3[] = Array.from({ length: 40 }, (_, i) => {
      const y = 1 - 2 * (i + .5) / 40;
      const r = Math.sqrt(1 - y * y);
      return normalize([Math.cos(i * 2.4) * r + noise(i, 1) * .3, y, Math.sin(i * 2.4) * r + noise(i, 2) * .3]);
    });
    // Ships facing the strike are pulled 60% of the way into the wall at full massing (.48 = .6 * .8).
    const swarmMass = (t: number) => smooth(span(t, 1.8, 5.8)) * .48;
    const swarmAt = (i: number, t: number, out: V3, mass = swarmMass(t)) => {
      orbitToView(WX[i], WY[i], WZ[i], WO[i] * t, out);
      const facing = (out[0] * HIT[0] + out[1] * HIT[1] + out[2] * HIT[2]) / WR[i];
      if (facing <= 0 || mass === 0) return;
      const pull = mass * facing * facing;
      for (let k = 0; k < 3; k++) out[k] += (WALL[k] - out[k]) * pull;
    };
    const center: V3 = [0, 0, 0];
    for (let i = 0; i < NW; i++) {
      const random: V3 = [noise(i, 21) * 2 - 1, noise(i, 22) * 2 - 1, noise(i, 23) * 2 - 1];
      const home = clusters[i % clusters.length];
      const dir = noise(i, 24) < .72
        ? normalize([home[0] + random[0] * .36, home[1] + random[1] * .36, home[2] + random[2] * .36])
        : normalize(random);
      const radius = 1.5 + noise(i, 5) ** .8 * 1.4;
      WX[i] = dir[0] * radius;
      WY[i] = dir[1] * radius;
      WZ[i] = dir[2] * radius;
      WO[i] = .025 + noise(i, 6) * .035;
      WS[i] = noise(i, 27);
      WR[i] = Math.hypot(WX[i], WY[i], WZ[i]);
    }

    // Deaths in the breach mean sampling each ship against the fleet's path (~45 steps a ship), but they all fall
    // after T.contact, so render() scans for a slice of each frame instead of holding up the first one. A time
    // budget rather than a ship count, since the first, unoptimized passes run ~40x slower than warm ones.
    const breach: number[] = [];
    for (let t = T.contact; t < T.arrive + .3; t += .05) breach.push(t);
    const breachFleet = breach.map((): V3 => [0, 0, 0]);
    const breachMass = breach.map(t => swarmMass(t));
    let scanned = 0;
    // Every death that hangs on the line of attack: the blast, from where each ship is at the moment of fire, then
    // the breach, rescanned from the start. Redone whenever aim() changes the line.
    const doom = () => {
      for (let i = 0; i < WD.length; i++) {
        swarmAt(i, T.fire, tmp);
        WD[i] = T.wave + (Math.hypot(tmp[0], tmp[1], tmp[2]) - 1) / 1.6 + WS[i] * .15;
      }
      breach.forEach((t, k) => fleetAt(t, breachFleet[k]));
      scanned = 0;
    };
    doom();
    const scanBreach = (budget: number) => {
      for (const stop = performance.now() + budget; scanned < NW && performance.now() < stop; scanned++) {
        for (let k = 0; k < breach.length; k++) {
          swarmAt(scanned, breach[k], tmp, breachMass[k]);
          const at = breachFleet[k];
          const dx = tmp[0] - at[0];
          const dy = tmp[1] - at[1];
          const dz = tmp[2] - at[2];
          if (dx * dx + dy * dy + dz * dz < .34 * .34) {
            WD[scanned] = Math.min(WD[scanned], breach[k]);
            break;
          }
        }
      }
    };

    // ---- Ender's formation: three rings around the line of attack.
    const fleet: Ship[] = [];
    [[.09, 6], [.21, 16], [.34, 26]].forEach(([radius, count], ring) => {
      for (let j = 0; j < count; j++) {
        const seed = noise(ring * 40 + j, 31);
        const angle = j / count * Math.PI * 2 + ring * .3;
        const lost = ring > 0 && seed < .4;
        fleet.push({
          right: Math.cos(angle) * radius,
          up: Math.sin(angle) * radius,
          along: -ring * .08 + (noise(j, ring) - .5) * .06,
          lead: ring === 0,
          death: lost
            ? T.contact + .3 + noise(j, ring + 9) * (T.arrive - T.contact - .3)
            : T.wave + .15 + seed * .3,
          seed,
        });
      }
    });

    // ---- Cursor displacement for every particle and ship, sprung back to rest, laid out stars | planet | swarm |
    // ships. build() sizes everything for the current tier, carrying over the springs that still line up.
    let SHIP0 = 0;
    let OX = new Float32Array(0);
    let OY = OX;
    let VX = OX;
    let VY = OX;
    const build = () => {
      const was = { NP, SHIP0 };
      const count = TIERS[tier].count;
      if (Math.round(PLANET * count) !== NP) buildPlanet(Math.round(PLANET * count));
      NW = Math.min(NW, Math.round(SWARM * count));
      SHIP0 = NS + NP + NW;
      [OX, OY, VX, VY] = [OX, OY, VX, VY].map(old => {
        const next = new Float32Array(SHIP0 + fleet.length);
        if (old.length) {
          next.set(old.subarray(0, NS));
          next.set(old.subarray(NS + was.NP, NS + was.NP + NW), NS + NP);
          next.set(old.subarray(was.SHIP0), SHIP0);
        }
        return next;
      });
    };
    build();

    let width = 0;
    let height = 0;
    const paths: Array<Path2D | null> = new Array(COLORS.length * ALPHA_STEPS).fill(null);
    const dot = (x: number, y: number, half: number, alpha: number, color: number) => {
      if (alpha < .025 || x < -10 || y < -10 || x > width + 10 || y > height + 10) return;
      const key = color * ALPHA_STEPS + Math.min(ALPHA_STEPS - 1, Math.floor(alpha * ALPHA_STEPS));
      let path = paths[key];
      if (!path) path = paths[key] = new Path2D();
      path.rect(x - half, y - half, half * 2, half * 2);
    };

    // ---- Framing: the planet sits right of the reading column; on upright phones, right of centre and low, leaving
    // the bottom-left for the fleet's climb in. Turning the phone swaps approaches, so everything aimed is redone.
    let dpr = 1;
    let unit = 1;
    let anchorX = 0;
    let anchorY = 0;
    let dotScale = 1;
    let reach = REACH;
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, TIERS[tier].dpr);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (tallView(width, height) !== tall) {
        tall = !tall;
        aim(tall);
        field();
        doom();
      }
      unit = tall ? width * .2 : Math.min(height * .2, width * .125);
      anchorX = width * (tall ? .7 : .8);
      anchorY = height * (tall ? .63 : .58);
      dotScale = clamp(unit / 180, .7, 1.3);
      reach = REACH * clamp(unit / 180, .8, 1.3);
      battle.anchorX = anchorX;
      battle.anchorY = anchorY;
      battle.unit = unit;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let px = 0;
    let py = 0;
    let depth = 1;
    const project = (x: number, y: number, z: number) => {
      depth = FOCAL / (FOCAL - z);
      px = anchorX + x * unit * depth;
      py = anchorY + y * unit * depth;
    };
    const projectV = (v: V3): [number, number] => {
      project(v[0], v[1], v[2]);
      return [px, py];
    };

    let pointer = { x: -1e4, y: -1e4 };
    let pointerVX = 0;
    let pointerVY = 0;
    let lastMove = 0;
    const move = (event: PointerEvent) => {
      const now = performance.now();
      if (pointer.x > -1e3 && lastMove) {
        const dt = Math.max(8, now - lastMove) / 1000;
        pointerVX = clamp(pointerVX * .5 + (event.clientX - pointer.x) / dt * .5, -2500, 2500);
        pointerVY = clamp(pointerVY * .5 + (event.clientY - pointer.y) / dt * .5, -2500, 2500);
      }
      pointer = { x: event.clientX, y: event.clientY };
      lastMove = now;
    };
    const leave = () => {
      pointer = { x: -1e4, y: -1e4 };
      pointerVX = pointerVY = 0;
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);

    let step = 0;
    let still = false;
    let damp = 1;
    const displace = (i: number) => {
      let offX = OX[i];
      let offY = OY[i];
      if (!still) {
        let vx = VX[i];
        let vy = VY[i];
        const dx = px - pointer.x;
        const dy = py - pointer.y;
        const d2 = dx * dx + dy * dy;
        const near = d2 < reach * reach;
        if (near || offX !== 0 || offY !== 0 || vx !== 0 || vy !== 0) {
          if (near && d2 > .01) {
            const d = Math.sqrt(d2);
            const falloff = (1 - d / reach) ** 2 * step;
            vx += (dx / d * PUSH - dy / d * SWIRL + pointerVX * DRAG) * falloff;
            vy += (dy / d * PUSH + dx / d * SWIRL + pointerVY * DRAG) * falloff;
          }
          vx = (vx - offX * SPRING * step) * damp;
          vy = (vy - offY * SPRING * step) * damp;
          offX += vx * step;
          offY += vy * step;
          if (Math.abs(offX) + Math.abs(offY) < .02 && Math.abs(vx) + Math.abs(vy) < .5) offX = offY = vx = vy = 0;
          OX[i] = offX;
          OY[i] = offY;
          VX[i] = vx;
          VY[i] = vy;
        }
      }
      px += offX;
      py += offY;
    };

    // A Formic ship going up: pink field, white flash, then a wreck that cools into dust behind the nebula.
    const burn = (age: number, half: number) => {
      if (age < .15) dot(px, py, half * 1.8, 1, PINK);
      else if (age < .45) dot(px, py, half * 1.3, .85, WHITE);
      else dot(px, py, half, .16 + .14 * (1 - span(age, 1.6, 5)) + .24 * (1 - span(age, .45, 1.6)), SLATE);
    };

    // ---- Aftermath: where each shard of the planet comes to rest, rebuilt lazily whenever the planet is. About a
    // third fall into a band around the old equator; the rest fly straight out to radii set by lobes that wind
    // with distance, so the nebula reads as spiral structure without any shard veering off its blast line.
    const AXIS = normalize([.26, .9, -.35]); // the planet's axis, rolled so the band dips toward the fleet's path
    const RIM = normalize(cross(AXIS, [0, 0, 1]));
    const RIM2 = cross(AXIS, RIM);
    let restOf: Float32Array | null = null;
    let RX = new Float32Array(0);
    let RY = RX;
    let RZ = RX;
    let RA = RX; // resting alpha
    let RC = new Uint8Array(0); // resting color
    let RL = RC; // spin lane, indexing LANE_SPIN
    let RE = new Int8Array(0); // ember slot, or -1
    let embers = 0;
    const EP = new Float32Array(EMBERS); // flare period
    const EF = new Float32Array(EMBERS); // flare phase
    const EX = new Float32Array(EMBERS); // this frame's position, heat and depth, for the halos
    const EY = new Float32Array(EMBERS);
    const EH = new Float32Array(EMBERS);
    const ED = new Float32Array(EMBERS);
    for (let e = 0; e < EMBERS; e++) {
      EP[e] = 30 + noise(e, 46) * 30;
      EF[e] = noise(e, 47);
    }
    const rest = () => {
      restOf = FX;
      [RX, RY, RZ, RA] = Array.from({ length: 4 }, () => new Float32Array(NP));
      RC = new Uint8Array(NP);
      RL = new Uint8Array(NP);
      RE = new Int8Array(NP).fill(-1);
      embers = 0;
      const [ax, ay, az] = AXIS;
      for (let i = 0; i < NP; i++) {
        const x = FX[i];
        const y = FY[i];
        const z = FZ[i];
        const h = x * ax + y * ay + z * az;
        const s1 = noise(i, 41);
        const s3 = noise(i, 43);
        const s4 = noise(i, 44);
        if (noise(i, 42) < .6 * (1 - Math.abs(h))) {
          // Band: flattened into the equatorial plane, densest at 1.8 radii.
          const r = 1.8 + (s3 + s4 - 1) * .4;
          const ux = x - h * ax;
          const uy = y - h * ay;
          const uz = z - h * az;
          const scale = r / (Math.hypot(ux, uy, uz) || 1);
          const lift = (s1 - .5) * .08;
          RX[i] = ux * scale + ax * lift;
          RY[i] = uy * scale + ay * lift;
          RZ[i] = uz * scale + az * lift;
          RA[i] = .3 + .3 * (1 - Math.abs(r - 1.8) / .4);
          RC[i] = Math.abs(r - 1.8) < .16 ? MIST : SLATE;
          RL[i] = 2;
        } else {
          // Nebula: lobes sampled further round the axis the farther out a shard lands; squashed along the axis.
          const c = Math.cos(1.6 * s3);
          const s = Math.sin(1.6 * s3);
          const qx = x * c + (ay * z - az * y) * s + ax * h * (1 - c);
          const qy = y * c + (az * x - ax * z) * s + ay * h * (1 - c);
          const qz = z * c + (ax * y - ay * x) * s + az * h * (1 - c);
          const lobe = (.5 + .5 * Math.sin(qx * 3.3 + qy * 2.1 + 1) * Math.sin(qz * 2.7 - qy * 3.1 + 2)) ** 2;
          const r = .6 + s3 ** .9 * (.7 + 1.4 * lobe);
          RX[i] = r * (x - .4 * h * ax);
          RY[i] = r * (y - .4 * h * ay);
          RZ[i] = r * (z - .4 * h * az);
          RA[i] = (.2 + .4 * lobe) * (1 - .4 * span(r, 1.2, 2.8));
          RC[i] = lobe > .45 && s1 > .25 ? MIST : SLATE;
          RL[i] = r < 1.1 ? 0 : r < 1.9 ? 1 : 3;
          if (embers < EMBERS && r < 2 && s4 < .002 * PLANET / NP) RE[i] = embers++;
        }
      }
    };

    // The nebula's spin integrates ambient time, so it never jumps, and only advances while the debris is calm.
    // Rewinding toward the blast scales it back (at most half a turn: it's wrapped while fully calm) to exactly
    // zero before any shard is still in the flash, so the explosion stays a pure function of t.
    const spun = new Float64Array(LANE_SPIN.length);
    const TURN = new Float32Array(LANE_SPIN.length * 9); // a rotation matrix per lane
    let calm = 0;
    let calmT = -1;
    let calmAt = 0;
    const settle = (t: number) => {
      if (restOf !== FX) rest();
      if (t === calmT && ambient === calmAt) return;
      calm = smooth(span(t, CALM, T.end));
      const dt = clamp(ambient - calmAt, 0, .25);
      calmT = t;
      calmAt = ambient;
      const [x, y, z] = AXIS;
      for (let l = 0; l < LANE_SPIN.length; l++) {
        let a = calm ? spun[l] + LANE_SPIN[l] * dt * calm : 0;
        if (calm === 1 && a > Math.PI) a -= Math.PI * 2;
        spun[l] = a;
        const c = Math.cos(a * calm);
        const s = Math.sin(a * calm);
        const C = 1 - c;
        const m = l * 9;
        TURN[m] = c + x * x * C;
        TURN[m + 1] = x * y * C - z * s;
        TURN[m + 2] = x * z * C + y * s;
        TURN[m + 3] = y * x * C + z * s;
        TURN[m + 4] = c + y * y * C;
        TURN[m + 5] = y * z * C - x * s;
        TURN[m + 6] = z * x * C - y * s;
        TURN[m + 7] = z * y * C + x * s;
        TURN[m + 8] = c + z * z * C;
      }
    };

    // One soft pink sprite serves every ember's halo, so they cost no gradients per frame.
    const halo = document.createElement('canvas');
    halo.width = halo.height = 32;
    const haloCtx = halo.getContext('2d');
    if (haloCtx) {
      const gradient = haloCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,121,198,1)');
      gradient.addColorStop(.3, 'rgba(255,121,198,.35)');
      gradient.addColorStop(1, 'rgba(255,121,198,0)');
      haloCtx.fillStyle = gradient;
      haloCtx.fillRect(0, 0, 32, 32);
    }

    const glow = (x: number, y: number, radius: number, stops: Array<[number, string]>) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      stops.forEach(([at, color]) => gradient.addColorStop(at, color));
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    let disposed = false;
    let frame = 0;
    let last = 0;
    let ambient = 0;
    let story = 0;
    let rewinding = false;
    let doneSent = false;

    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);
      const t = story;
      const appear = reduced.matches ? 1 : smooth(ambient / .6);
      damp = Math.exp(-DAMPING * step);
      const decay = Math.exp(-10 * step);
      pointerVX *= decay;
      pointerVY *= decay;
      paths.fill(null);

      // Planet body and atmosphere, fading as the field takes it.
      const body = (1 - span(t, T.fire + .3, T.fire + 2.2)) * appear;
      if (body > 0) {
        ctx.globalAlpha = body;
        glow(anchorX, anchorY, unit * 1.2, [
          [0, 'rgba(15,17,29,.92)'], [.8, 'rgba(15,17,29,.92)'],
          [.84, 'rgba(143,156,203,.2)'], [.9, 'rgba(98,114,164,.08)'], [1, 'rgba(98,114,164,0)'],
        ]);
        ctx.globalAlpha = 1;
      }
      const core = span(t, T.fire + .2, T.fire + 1.6) * (1 - span(t, T.fire + 2.4, T.fire + 5.5));
      if (core > 0) {
        glow(anchorX, anchorY, unit * (1.2 + core * .9), [
          [0, `rgba(255,121,198,${.38 * core})`], [.45, `rgba(255,121,198,${.14 * core})`], [1, 'rgba(255,121,198,0)'],
        ]);
      }

      const intact = t < T.fire + .5;
      const disk2 = (unit * .98) ** 2;
      for (let i = 0; i < NS; i++) {
        px = SX[i] * width;
        py = SY[i] * height;
        if (intact && (px - anchorX) ** 2 + (py - anchorY) ** 2 < disk2) continue;
        displace(i);
        dot(px, py, .35 + SA[i] * 1.1, SA[i] * appear, SA[i] > .28 ? SLATE : DIM);
      }

      const spin = planetSpin(t);
      for (let i = 0; i < NP; i++) {
        const age = t - PT[i];
        if (age < 0) {
          orbitToView(PX[i], PY[i], PZ[i], spin, tmp);
          if (tmp[2] < -.05) continue;
          const lit = Math.max(0, tmp[0] * LIGHT[0] + tmp[1] * LIGHT[1] + tmp[2] * LIGHT[2]) * PL[i];
          const rim = (1 - tmp[2]) ** 5;
          project(tmp[0], tmp[1], tmp[2]);
          displace(NS + i);
          dot(px, py, .72 * dotScale, (.08 + .6 * lit + .28 * rim) * appear, lit > .45 ? MIST : lit > .1 ? SLATE : DIM);
        } else if (age < .75) {
          const lift = 1 + age * .18;
          project(FX[i] * lift, FY[i] * lift, FZ[i] * lift);
          displace(NS + i);
          if (age < .3) dot(px, py, 1.05 * dotScale, .95, PINK);
          else dot(px, py, .9 * dotScale, .9 - (age - .3), WHITE);
        } else {
          // Debris flies from where the flash left it (lift 1.135) to its place in the nebula, which turns once
          // calm: the page's resting state.
          settle(t);
          const k = easeOut((age - .75) / 4.5);
          const j = 1.135 * (1 - k);
          const x = FX[i] * j + RX[i] * k;
          const y = FY[i] * j + RY[i] * k;
          const z = FZ[i] * j + RZ[i] * k;
          const m = RL[i] * 9;
          const vz = TURN[m + 6] * x + TURN[m + 7] * y + TURN[m + 8] * z;
          project(TURN[m] * x + TURN[m + 1] * y + TURN[m + 2] * z, TURN[m + 3] * x + TURN[m + 4] * y + TURN[m + 5] * z, vz);
          displace(NS + i);
          // Far side dimmer, near side a little larger.
          const near = .78 + .12 * clamp(vz, -2.5, 2);
          const hot = 1 - smooth((age - .75) / 3.2);
          dot(px, py, .85 * dotScale * (.4 + .6 * depth), (RA[i] + (.72 - RA[i]) * hot) * near, age < 2 ? MIST : RC[i]);
          const e = RE[i];
          if (e >= 0) {
            // The field's residue: hot out of the blast, then long, slow flares once calm.
            const u = (ambient / EP[e] + EF[e]) % 1;
            const heat = Math.max(1 - smooth((age - .75) / 3.5), calm * smooth(u / .08) * (1 - u) ** 3);
            EX[e] = px;
            EY[e] = py;
            EH[e] = heat;
            ED[e] = depth;
            dot(px, py, .7 * dotScale * depth, heat * .7, PINK);
          }
        }
      }

      const mass = swarmMass(t);
      for (let i = 0; i < NW; i++) {
        swarmAt(i, t, tmp, mass);
        const age = t - WD[i];
        if (age >= 0) {
          const drift = 1 + Math.min(age, 6) * .05;
          project(tmp[0] * drift, tmp[1] * drift, tmp[2] * drift);
          displace(NS + NP + i);
          burn(age, .7 * dotScale);
          continue;
        }
        if (intact && tmp[2] < 0 && tmp[0] * tmp[0] + tmp[1] * tmp[1] < 1) continue;
        project(tmp[0], tmp[1], tmp[2]);
        displace(NS + NP + i);
        const near = clamp(.6 + tmp[2] * .15);
        dot(px, py, (.7 + WS[i] * .45) * dotScale * depth, (.4 + .45 * WS[i]) * near * appear, WS[i] > .8 ? MIST : SLATE);
      }

      paths.forEach((path, key) => {
        if (!path) return;
        ctx.globalAlpha = (key % ALPHA_STEPS + .5) / ALPHA_STEPS;
        ctx.fillStyle = COLORS[Math.floor(key / ALPHA_STEPS)];
        ctx.fill(path);
      });
      ctx.globalAlpha = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'lighter';

      // The edge of the Little Doctor's field, traced across the sphere.
      const theta = fieldAngle(t);
      if (t > T.fire + .15 && theta < Math.PI * .97) {
        const a = normalize(cross(HIT, [0, 1, 0]));
        const b = cross(HIT, a);
        const fade = 1 - smooth(theta / Math.PI * 1.1 - .1);
        [[5 * dotScale, .16], [1.3 * dotScale, .9]].forEach(([lineWidth, alpha]) => {
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = `rgba(255,121,198,${alpha * fade})`;
          ctx.beginPath();
          let drawing = false;
          for (let k = 0; k <= 160; k++) {
            const phi = k / 160 * Math.PI * 2;
            const lift = 1.01;
            const p = along([0, 0, 0], [HIT, Math.cos(theta) * lift], [a, Math.cos(phi) * Math.sin(theta) * lift], [b, Math.sin(phi) * Math.sin(theta) * lift]);
            if (p[2] < -.02) {
              drawing = false;
              continue;
            }
            const [x, y] = projectV(p);
            if (drawing) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            drawing = true;
          }
          ctx.stroke();
        });
      }

      // Blast front
      const front = span(t, T.wave, T.wave + 2.6);
      if (front > 0 && front < 1) {
        const radius = waveRadius(t) * unit;
        [[6 * dotScale, .1], [1.4 * dotScale, .5]].forEach(([lineWidth, alpha]) => {
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = front < .45
            ? `rgba(255,121,198,${alpha * (1 - front) ** 1.5})`
            : `rgba(143,156,203,${alpha * (1 - front) ** 1.5})`;
          ctx.beginPath();
          ctx.ellipse(anchorX, anchorY, radius, radius * .92, 0, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      // Aftermath: a faint glow along the band, far half dimmer, and halos on the cooling embers.
      const band = smooth(span(t, T.wave + 1.5, T.end));
      if (band > 0) {
        // z along the ring peaks at angle `top`; split there so each half is one unbroken stroke.
        const top = Math.atan2(RIM2[2], RIM[2]);
        for (let pass = 0; pass < BAND.length * 2; pass++) {
          const far = pass >= BAND.length;
          const [lineWidth, alpha] = BAND[pass % BAND.length];
          ctx.lineWidth = lineWidth * unit;
          ctx.strokeStyle = `rgba(143,156,203,${alpha * band * (far ? .45 : 1)})`;
          ctx.beginPath();
          for (let k = 0; k <= 48; k++) {
            const phi = top + (far ? Math.PI : 0) + (k / 48 - .5) * Math.PI;
            const c = Math.cos(phi) * 1.8;
            const s = Math.sin(phi) * 1.8;
            project(RIM[0] * c + RIM2[0] * s, RIM[1] * c + RIM2[1] * s, RIM[2] * c + RIM2[2] * s);
            if (k) ctx.lineTo(px, py);
            else ctx.moveTo(px, py);
          }
          ctx.stroke();
        }
      }
      for (let e = 0; e < embers; e++) {
        const heat = EH[e];
        EH[e] = 0; // written again next frame only if the ember is still debris
        if (heat < .02) continue;
        const r = (4 + 6 * heat) * dotScale * ED[e];
        ctx.globalAlpha = heat * .4;
        ctx.drawImage(halo, EX[e] - r, EY[e] - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;

      // Ender's fleet: darts with engine glow and trails, oriented along the line of attack.
      fleetAt(t, center);
      const heading = fleetHeading(t);
      const right = normalize([heading[1], -heading[0], 0]);
      const up = cross(right, heading);
      const behind: V3 = [0, 0, 0];
      fleetAt(t - .15, behind);
      const trail = Math.hypot(center[0] - behind[0], center[1] - behind[1], center[2] - behind[2]) * 2.2;
      const L = .04;
      const W = .02;
      fleet.forEach((ship, index) => {
        const alive = t < ship.death;
        const hub: V3 = [0, 0, 0];
        let dir = heading;
        let side = right;
        let lift = up;
        if (alive) {
          hub[0] = center[0];
          hub[1] = center[1];
          hub[2] = center[2];
        } else {
          fleetAt(ship.death, hub);
          dir = fleetHeading(ship.death);
          side = normalize([dir[1], -dir[0], 0]);
          lift = cross(side, dir);
        }
        const pos = along(hub, [side, ship.right], [lift, ship.up], [dir, ship.along]);
        project(pos[0], pos[1], pos[2]);
        const baseX = px;
        const baseY = py;
        displace(SHIP0 + index);
        const shiftX = px - baseX;
        const shiftY = py - baseY;
        const at = (v: V3): [number, number] => {
          const [x, y] = projectV(v);
          return [x + shiftX, y + shiftY];
        };

        if (!alive) {
          const age = t - ship.death;
          if (age > 1.1) return;
          const [x, y] = at(pos);
          if (age < .6) {
            ctx.lineWidth = dotScale;
            ctx.strokeStyle = `rgba(255,121,198,${.85 * (1 - age / .6)})`;
            ctx.beginPath();
            ctx.arc(x, y, (2 + age * 30) * dotScale, 0, Math.PI * 2);
            ctx.stroke();
          }
          if (age < .18) glow(x, y, 9 * dotScale, [[0, 'rgba(248,248,242,.95)'], [1, 'rgba(255,121,198,0)']]);
          for (let k = 0; k < 7; k++) {
            const angle = noise(index, k) * Math.PI * 2;
            const distance = age * (22 + noise(k, index) * 30) * dotScale;
            ctx.globalAlpha = .75 * (1 - age / 1.1);
            ctx.fillStyle = k % 2 ? COLORS[LAVENDER] : COLORS[WHITE];
            ctx.fillRect(x + Math.cos(angle) * distance - .6, y + Math.sin(angle) * distance - .6, 1.2, 1.2);
          }
          ctx.globalAlpha = 1;
          return;
        }

        const tail = along(pos, [dir, -L * .55]);
        const [tx, ty] = at(tail);
        if (trail > .01) {
          const [ex, ey] = at(along(tail, [dir, -trail]));
          const gradient = ctx.createLinearGradient(tx, ty, ex, ey);
          gradient.addColorStop(0, `rgba(179,157,255,${.55 * appear})`);
          gradient.addColorStop(1, 'rgba(179,157,255,0)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.1 * dotScale;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
        const engine = 3.6 * dotScale * depth * (.8 + .2 * Math.sin(ambient * 18 + ship.seed * 20));
        glow(tx, ty, engine, [[0, `rgba(248,248,242,${.9 * appear})`], [.4, `rgba(179,157,255,${.35 * appear})`], [1, 'rgba(179,157,255,0)']]);

        ctx.globalCompositeOperation = 'source-over';
        const [nx, ny] = at(along(pos, [dir, L]));
        const [ax, ay] = at(along(pos, [dir, -L * .75], [side, W]));
        const [bx, by] = at(along(pos, [dir, -L * .75], [side, -W]));
        ctx.globalAlpha = appear;
        ctx.fillStyle = ship.lead ? COLORS[WHITE] : COLORS[LAVENDER];
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(ax, ay);
        ctx.lineTo(tx, ty);
        ctx.lineTo(bx, by);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'lighter';
      });

      // The Little Doctor: charge, beam, and the first point of contact.
      const charge = span(t, T.fire - .5, T.fire) * (1 - span(t, T.fire, T.fire + .25));
      if (charge > 0) {
        const [x, y] = projectV(center);
        glow(x, y, (4 + charge * 18) * dotScale, [[0, `rgba(248,248,242,${.8 * charge})`], [.3, `rgba(255,121,198,${.5 * charge})`], [1, 'rgba(255,121,198,0)']]);
      }
      const beam = t - T.fire;
      if (beam >= 0 && beam < .8) {
        const fade = 1 - beam / .8;
        const [sx, sy] = projectV(center);
        const [hx, hy] = projectV(HIT);
        [[6 * dotScale, .22], [1.4 * dotScale, 1]].forEach(([lineWidth, alpha]) => {
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = `rgba(255,121,198,${alpha * fade})`;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(hx, hy);
          ctx.stroke();
        });
        glow(hx, hy, 26 * dotScale, [[0, `rgba(248,248,242,${fade})`], [.25, `rgba(255,121,198,${.6 * fade})`], [1, 'rgba(255,121,198,0)']]);
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    };

    const render = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(render);
      if (document.hidden) {
        last = 0;
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, .25) : 0;
      last = now;
      step = Math.min(dt, .05);

      if (replayRef.current) {
        replayRef.current = false;
        rewinding = true;
      }
      still = statusRef.current === 'paused' || reduced.matches;
      if (reduced.matches) {
        story = STANDOFF;
      } else if (!still) {
        ambient += dt;
        if (rewinding) {
          story = Math.max(0, story - dt * 5);
          if (story === 0) {
            rewinding = false;
            doneSent = false;
          }
        } else {
          story = Math.min(storyEnd(), story + dt);
        }
      }
      if (!doneSent && !rewinding && story >= storyEnd()) {
        doneSent = true;
        setStatus(current => (current === 'playing' ? 'done' : current));
      }
      // Breach deaths are all >= T.contact, so an unfinished scan is invisible until then; finish it if we get there.
      scanBreach(story >= T.contact ? Infinity : 1.5);
      // Publish for the readouts and the name burst.
      let formics = 0;
      for (let i = 0; i < NW; i++) if (WD[i] > story) formics++;
      battle.t = story;
      battle.formics = formics;
      battle.fleet = fleet.reduce((alive, ship) => alive + (story < ship.death ? 1 : 0), 0);
      const start = performance.now();
      paint();
      probe(now, performance.now() - start, dt);
    };

    // Adaptive quality: from .35s after the first frame (past warm-up, and far enough into the fade-in that dots
    // aren't culled at low alpha) average paint() over quarter-second windows and step down a tier while over
    // budget. Mostly-long frames count too, given a moderate paint cost, since rasterizing happens off the main thread.
    // Stops at the first window in budget or at 1.5s, before the fleet is on screen, so a drop reads as fade-in.
    let probeEnd = 0;
    let windowAt = 0;
    let cost = 0;
    let samples = 0;
    let slow = 0;
    const probe = (now: number, paintMs: number, dt: number) => {
      if (!probeEnd) {
        windowAt = now + 350;
        probeEnd = now + 1500;
      }
      if (now < windowAt || now > probeEnd) return;
      cost += paintMs;
      samples++;
      if (dt > .04) slow++;
      if (now - windowAt < 250 || samples < 3) return;
      const mean = cost / samples;
      const over = mean > PAINT_BUDGET || (slow > samples * .75 && mean > PAINT_BUDGET / 4);
      cost = samples = slow = 0;
      if (!over || tier === TIERS.length - 1) {
        probeEnd = -1;
        return;
      }
      tier++;
      build();
      resize();
      windowAt = now + 50; // let the rebuilt frame settle
    };

    const wake = () => {
      last = 0;
    };
    document.addEventListener('visibilitychange', wake);
    reduced.addEventListener('change', wake);
    setReady(true);
    frame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', wake);
      reduced.removeEventListener('change', wake);
      battle.t = 0;
      battle.unit = 0;
    };
  }, []);

  const toggle = () => {
    if (status === 'done') {
      replayRef.current = true;
      setStatus('playing');
    } else {
      setStatus(status === 'paused' ? 'playing' : 'paused');
    }
  };

  return (
    <>
      <div className="sculpture-backdrop" aria-hidden="true">
        <canvas ref={canvasRef} className={ready ? 'sculpture-canvas ready' : 'sculpture-canvas'} />
        <div className="sculpture-vignette" />
      </div>
      <button
        className="sculpture-pause"
        onClick={toggle}
        aria-label={
          status === 'done' ? 'Replay background animation'
            : status === 'paused' ? 'Play background animation' : 'Pause background animation'
        }
      >
        {status === 'done' ? '↻' : status === 'paused' ? '▷' : 'Ⅱ'}
      </button>
    </>
  );
}
