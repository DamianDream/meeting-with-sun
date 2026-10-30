const c = document.getElementById("sky") as HTMLCanvasElement;
const ctx = c.getContext("2d")!;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Star { x: number; y: number; r: number; p: number; speed: number; sparkle: boolean }

let W: number, H: number;
let stars: Star[] = [];

// Наведение на Землю: курсор отслеживаем на window, а не на canvas —
// у #sky стоит pointer-events:none, чтобы фон не мешал кликам по контенту.
const EARTH_R = 7;
const EARTH_HOVER_RADIUS = 26;
let mouseX = -9999, mouseY = -9999;
let earthHoverT = 0;
let earthSpin = 0;
let earthHoverPrev = false;

addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });
addEventListener("mouseleave", () => { mouseX = -9999; mouseY = -9999; });

// Материки и облака заданы долготой на старте (lon0) и широтой (lat, фикс.
// по вертикали — не меняется при вращении, т.к. ось вращения вертикальная).
// При рендере долгота увеличивается на earthSpin, а видимая позиция/ширина
// считается как проекция точки на сфере — так пятна едут по горизонтали и
// сжимаются/прячутся у края, как настоящий вращающийся глобус, а не крутятся
// колесом в плоскости экрана.
interface Patch { lon0: number; lat: number; w: number; h: number; color: string }

// Крупные цельные материки, как на флэт-иконках глобуса — 2-3 больших пятна
// на полушарие, а не россыпь мелких точек.
const LANDMASSES: Patch[] = [
  { lon0: -.1, lat: .2, w: .62, h: .66, color: "#8bc34a" },
  { lon0: -.7, lat: -.4, w: .4, h: .44, color: "#5ea23f" },
  { lon0: 1.9, lat: .1, w: .46, h: .58, color: "#8bc34a" },
  { lon0: 2.5, lat: -.45, w: .28, h: .32, color: "#5ea23f" },
];

// рисует пятно на сфере радиуса r с центром в текущем начале координат
function drawPatch(p: Patch, r: number, alphaMul: number) {
  const lon = p.lon0 + earthSpin;
  const cosLon = Math.cos(lon);
  const visibility = Math.max(0, Math.min(1, (cosLon + .12) / .4));
  if (visibility <= 0) return;
  const x = Math.sin(lon) * r * .86;
  const y = p.lat * r * .82;
  const squish = Math.max(.08, Math.abs(cosLon));
  ctx.globalAlpha = visibility * alphaMul;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.ellipse(x, y, p.w * r * squish, p.h * r, 0, 0, 6.29);
  ctx.fill();
}

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.round(W * H / 3500) }, () => {
    const sparkle = Math.random() < 0.06;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: sparkle ? Math.random() * 0.7 + 1 : Math.random() * 1.2 + .2,
      p: Math.random() * 6.28,
      speed: 900 + Math.random() * 1700,
      sparkle,
    };
  });
}

function draw(t: number) {
  ctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    const phase = Math.sin(t / s.speed + s.p);
    ctx.fillStyle = "#e9e2ff";
    if (s.sparkle) {
      // немногие звёзды мерцают резче и на пике вспыхивают лучиком, как настоящие
      const twinkle = Math.max(0, phase);
      ctx.globalAlpha = .25 + .65 * twinkle * twinkle;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.29); ctx.fill();
      if (phase > .85) {
        const glint = (phase - .85) / .15;
        const len = s.r * 4.5;
        ctx.globalAlpha = glint * .85;
        ctx.strokeStyle = "#e9e2ff";
        ctx.lineWidth = .6;
        ctx.beginPath();
        ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y);
        ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len);
        ctx.stroke();
      }
    } else {
      ctx.globalAlpha = .35 + .35 * phase;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.29); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  const narrow = W < 700;
  const R = Math.max(W, H) * (narrow ? .42 : .38) * (1 + .015 * Math.sin(t / 2600));
  const cx = W + R * (narrow ? .35 : .25), cy = narrow ? -R * .15 : H * .45;
  // лёгкое "дыхание" жара поверх дыхания радиуса — своя, более быстрая частота,
  // чтобы не выглядело механически синхронным
  const heat = .5 + .5 * Math.sin(t / 820);
  const g = ctx.createRadialGradient(cx, cy, R * .2, cx, cy, R * 1.6);
  g.addColorStop(0, `rgba(255,${190 + Math.round(heat * 14)},${110 + Math.round(heat * 10)},${(.88 + heat * .12).toFixed(3)})`);
  g.addColorStop(.45, `rgba(255,120,60,${(.48 + heat * .14).toFixed(3)})`);
  g.addColorStop(.62, `rgba(230,70,40,${(.14 + heat * .07).toFixed(3)})`);
  g.addColorStop(1, "rgba(8,7,13,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.6, 0, 6.29); ctx.fill();

  // Земля: при наведении курсора увеличивается и начинает вращаться
  const ex = narrow ? W * .78 : W * .62, ey = narrow ? H * .32 : H * .5;
  const dist = Math.hypot(mouseX - ex, mouseY - ey);
  const hovering = dist < EARTH_HOVER_RADIUS;
  earthHoverT += ((hovering ? 1 : 0) - earthHoverT) * .12;
  // Один оборот примерно за 14 секунд при полном наведении — похоже на
  // медленное вращение планеты, а не на бешено крутящийся шарик.
  if (earthHoverT > .001) earthSpin += earthHoverT * .0075;
  if (hovering !== earthHoverPrev) {
    document.body.style.cursor = hovering ? "pointer" : "";
    earthHoverPrev = hovering;
  }

  const scale = 1 + earthHoverT * 2.6;
  const r = EARTH_R * scale;

  ctx.save();
  ctx.translate(ex, ey);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.29); ctx.clip();

  // насыщенный океан-градиент — светлый блик сверху-слева, глубокий синий у края,
  // как на плоских векторных иконках глобуса
  const eg = ctx.createRadialGradient(-r * .35, -r * .35, r * .1, 0, 0, r);
  eg.addColorStop(0, "#9fdcff");
  eg.addColorStop(.55, "#2f8fe0");
  eg.addColorStop(1, "#154f9e");
  ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.29); ctx.fill();

  if (earthHoverT > .05) {
    for (const land of LANDMASSES) drawPatch(land, r, earthHoverT);
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  if (!reduce) requestAnimationFrame(draw);
}

addEventListener("resize", () => { resize(); if (reduce) draw(0); });
resize();
requestAnimationFrame(draw);
