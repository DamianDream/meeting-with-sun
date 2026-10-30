const YEAR = 31557600n; // юлианский год, с
const DAY = 86400n;
const START2008 = 1199145600n; // 2008-01-01T00:00:00Z
const TARGET = START2008 + 7590000000n * YEAR;
const BIRTH_BEFORE_NOW_Y = 4.57e9;
const TOTAL_Y = BIRTH_BEFORE_NOW_Y + 7.59e9 - (2026 - 2008);

const $ = (id: string) => document.getElementById(id);
const fmt = (n: bigint) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const pad = (n: bigint, l: number) => n.toString().padStart(l, "0");

function tick() {
  const nowMs = Date.now();
  const nowS = BigInt(Math.floor(nowMs / 1000));
  let rem = TARGET - nowS;
  const ms = 999 - (nowMs % 1000);
  const y = rem / YEAR; rem %= YEAR;
  const d = rem / DAY; rem %= DAY;
  const h = rem / 3600n; rem %= 3600n;
  const m = rem / 60n; const s = rem % 60n;

  const years = $("years");
  if (years?.firstChild) years.firstChild.nodeValue = fmt(y);
  $("d")!.textContent = pad(d, 3);
  $("h")!.textContent = pad(h, 2);
  $("m")!.textContent = pad(m, 2);
  $("s")!.textContent = pad(s, 2);
  $("ms")!.textContent = pad(BigInt(ms), 3);

  const left = Number(y);
  const pct = (1 - left / TOTAL_Y) * 100;
  ($("bar") as HTMLElement).style.width = pct.toFixed(4) + "%";
  $("pct")!.textContent = pct.toFixed(6).replace(".", ",") + "%";

  requestAnimationFrame(tick);
}

tick();
