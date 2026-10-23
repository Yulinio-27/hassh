// ====== PERSONALIZA AQUI ======
const NOMBRE = "Mi Amor";
const MENSAJE = `Solo quería decirte que eres lo mejor que me ha pasado.

Gracias por existir, por tu sonrisa y por hacerme tan feliz.

Te amo, hoy y siempre. ❤️`;
const FRASES = [
  "Eres mi lugar favorito del mundo 🌹",
  "Contigo todo es mejor",
  "Mi corazón te eligió a ti",
  "Pienso en ti en cada momento",
  "Eres mi razón de sonreír",
  "Te amo más de lo que puedo decir"
];
// ===============================

const $ = id => document.getElementById(id);
$("nombre").textContent = NOMBRE;

// ---------- Petalos y luciernagas ----------
const canvas = $("petalos"), ctx = canvas.getContext("2d");
const COLORES = ["#e57399", "#f48fb1", "#c2185b", "#f8bbd0"];
let piezas = [];
function ajustar() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", ajustar); ajustar();

function pieza(x, y, tipo, explosion) {
  const p = {
    x, y, tipo, temp: explosion, k: Math.floor(Math.random() * 4),
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.1, fase: Math.random() * 6,
    r: tipo === "p" ? Math.random() * 4 + 4 : tipo === "g" ? Math.random() * 2 + 1 : 16 + Math.random() * 8,
    vx: explosion ? (Math.random() - 0.5) * 7 : (Math.random() - 0.5) * 0.4,
    vy: explosion ? -2 - Math.random() * 5 : Math.random() * 0.8 + 0.5
  };
  if (tipo === "g") { p.vy = -(Math.random() * 0.3 + 0.1); p.vx = (Math.random() - 0.5) * 0.3; }
  return p;
}
for (let i = 0; i < 40; i++) piezas.push(pieza(Math.random() * innerWidth, Math.random() * innerHeight, "p", false));
for (let i = 0; i < 40; i++) piezas.push(pieza(Math.random() * innerWidth, Math.random() * innerHeight, "g", false));

function soltar(x, y) {
  for (let i = 0; i < 24; i++) piezas.push(pieza(x, y, "p", true));
  ["🌹", "✨", "💗", "💗", "🤍", "❤️"].forEach(e => piezas.push(pieza(x, y, e, true)));
}
function lluvia(n) {
  for (let i = 0; i < n; i++) setTimeout(() => {
    const p = pieza(Math.random() * innerWidth, -10, Math.random() < 0.15 ? "❤️" : "p", true);
    p.vx = (Math.random() - 0.5) * 1.5; p.vy = 1 + Math.random() * 1.5;
    piezas.push(p);
  }, i * 120);
}

function dibujar(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  piezas.forEach(c => {
    c.x += c.vx; c.y += c.vy; c.rot += c.vr;
    if (c.tipo === "p") c.x += Math.sin(c.y / 50 + c.fase) * 0.5;
    if (c.temp) c.vy += 0.07;
    if (c.tipo === "p") {
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot);
      ctx.fillStyle = COLORES[c.k]; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.ellipse(0, 0, c.r * 1.4, c.r * 0.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); ctx.globalAlpha = 1;
    } else if (c.tipo === "g") {
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t / 700 + c.fase));
      ctx.fillStyle = ctx.shadowColor = "#ffd9a0"; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    } else { ctx.font = c.r + "px serif"; ctx.fillText(c.tipo, c.x, c.y); }
    if (!c.temp) {
      if (c.tipo === "p" && c.y > canvas.height) { c.y = -10; c.x = Math.random() * canvas.width; }
      if (c.tipo === "g" && c.y < -5) { c.y = canvas.height + 5; c.x = Math.random() * canvas.width; }
    }
  });
  piezas = piezas.filter(c => !(c.temp && c.y > canvas.height + 30));
  requestAnimationFrame(dibujar);
}
requestAnimationFrame(dibujar);

// ---------- Musica ----------
const musica = $("musica"), btnMusica = $("btnMusica");
btnMusica.onclick = () => {
  if (musica.paused) { musica.play(); btnMusica.classList.add("suena"); }
  else { musica.pause(); btnMusica.classList.remove("suena"); }
};

// ---------- Parte 1 -> 2 ----------
let listo = false, nFrase = 0;
function escribir(el, texto, ms, fin) {
  let i = 0;
  (function paso() {
    if (i < texto.length) { el.textContent += texto[i++]; setTimeout(paso, ms); }
    else if (fin) fin();
  })();
}
$("btnDecir").onclick = () => {
  $("parte1").classList.remove("activa");
  $("parte2").classList.add("activa");
  btnMusica.hidden = false;
  musica.play().then(() => btnMusica.classList.add("suena")).catch(() => {});
  setTimeout(() => escribir($("teamo"), "Te amo", 220, () => {
    escribir($("mensaje"), MENSAJE, 55, () => {
      listo = true; lluvia(40); $("pista").hidden = false;
    });
  }), 1200);
};

// ---------- Tocar la pantalla ----------
$("parte2").addEventListener("pointerdown", e => {
  if (e.target.closest("button")) return;
  soltar(e.clientX, e.clientY);
  if (!listo) return;
  const m = document.createElement("div");
  m.className = "msg"; m.textContent = FRASES[nFrase++ % FRASES.length];
  m.style.left = Math.min(Math.max(e.clientX, 140), innerWidth - 140) + "px";
  m.style.top = e.clientY + "px";
  document.body.appendChild(m);
  setTimeout(() => m.remove(), 3500);
});
