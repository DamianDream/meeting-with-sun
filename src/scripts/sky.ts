const c = document.getElementById("sky") as HTMLCanvasElement;
const ctx = c.getContext("2d")!;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Star { x: number; y: number; r: number; p: number; speed: number; sparkle: boolean }

let W: number, H: number;
let stars: Star[] = [];

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

  // Земля
  const ex = narrow ? W * .78 : W * .62, ey = narrow ? H * .32 : H * .5;
  const eg = ctx.createRadialGradient(ex - 2, ey - 2, 1, ex, ey, 7);
  eg.addColorStop(0, "#bfe0ff"); eg.addColorStop(1, "#2b6fd6");
  ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(ex, ey, 6, 0, 6.29); ctx.fill();

  if (!reduce) requestAnimationFrame(draw);
}

addEventListener("resize", () => { resize(); if (reduce) draw(0); });
resize();
requestAnimationFrame(draw);
