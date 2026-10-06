// Genera el pitch deck en PowerPoint: presentacion/EL_ANDEN_CAFE_Pitch.pptx
// Uso: node presentacion/build-pptx.mjs
import pptxgen from 'pptxgenjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const F = (n) => path.join(__dirname, 'frames', `f${String(n).padStart(3, '0')}.png`);

// Paleta (sin '#', formato pptxgenjs)
const C = {
  abyss: '030705',
  forest: '0A140F',
  plate: '0F1D16',
  gold: 'FFE259',
  molten: 'FFA751',
  emerald: '00FFA3',
  sapphire: '00E5FF',
  white: 'FFFFFF',
  dim: '9FB3A8',
};
// Fuentes seguras en Windows / Office
const HEAD = 'Impact';
const MONO = 'Consolas';
const SERIF = 'Georgia';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
pptx.title = 'EL ANDÉN CAFÉ: THE MIDNIGHT STEAM — Cinematic Brand Film';
pptx.company = 'El Andén Café';

pptx.defineSlideMaster({
  title: 'BASE',
  background: { color: C.abyss },
  objects: [
    { rect: { x: 0, y: 7.38, w: 13.333, h: 0.02, fill: { color: C.gold, transparency: 70 } } },
    {
      text: {
        text: 'EL ANDÉN CAFÉ // THE MIDNIGHT STEAM',
        options: { x: 0.5, y: 7.0, w: 8, h: 0.3, fontFace: MONO, fontSize: 9, color: C.gold, transparency: 40, charSpacing: 3 },
      },
    },
  ],
  slideNumber: { x: 12.3, y: 7.0, w: 0.6, h: 0.3, fontFace: MONO, fontSize: 9, color: C.emerald, align: 'right' },
});

const kicker = (s, t, y = 0.55) =>
  s.addText(t, { x: 0.6, y, w: 12, h: 0.35, fontFace: MONO, fontSize: 12, color: C.emerald, charSpacing: 4, bold: true });
const title = (s, t, y = 0.9, size = 40) =>
  s.addText(t, { x: 0.6, y, w: 12.2, h: 1.0, fontFace: HEAD, fontSize: size, color: C.white, charSpacing: 2 });
const body = (s, t, opts = {}) =>
  s.addText(t, { x: 0.6, y: 2.0, w: 6, h: 3, fontFace: SERIF, fontSize: 16, color: C.dim, valign: 'top', paraSpaceAfter: 8, ...opts });

// ── 1. PORTADA ─────────────────────────────────────────────
{
  const s = pptx.addSlide({ masterName: 'BASE' });
  s.addImage({ path: F(860), x: 0, y: 0, w: 13.333, h: 7.5 });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.abyss, transparency: 35 } });
  s.addText('CINEMATIC BRAND FILM  ·  15 s  ·  60 FPS  ·  100% SILENCIOSO', {
    x: 0, y: 2.2, w: 13.333, h: 0.4, align: 'center', fontFace: MONO, fontSize: 13, color: C.emerald, charSpacing: 5, bold: true,
  });
  s.addText('EL ANDÉN CAFÉ', { x: 0, y: 2.7, w: 13.333, h: 1.3, align: 'center', fontFace: HEAD, fontSize: 80, color: C.gold, charSpacing: 8 });
  s.addText('THE MIDNIGHT STEAM', { x: 0, y: 3.9, w: 13.333, h: 0.7, align: 'center', fontFace: HEAD, fontSize: 32, color: C.white, charSpacing: 14 });
  s.addText('“Una pausa antes de seguir”', { x: 0, y: 4.8, w: 13.333, h: 0.6, align: 'center', fontFace: SERIF, italic: true, fontSize: 22, color: C.molten });
}

// ── 2. EL RETO ─────────────────────────────────────────────
{
  const s = pptx.addSlide({ masterName: 'BASE' });
  kicker(s, '01 // EL RETO');
  title(s, 'UN FILM SIN UN SOLO SONIDO.');
  body(s, 'Sin música, sin voz y sin efectos de sonido, la imagen tiene que hacer todo el trabajo: marcar el ritmo, provocar impacto y sostener la atención durante 15 segundos.', { w: 11.5, h: 1.2 });
  const pillars = [
    ['CONTRASTE LUMÍNICO', 'Picos de exposición, flash blanco de 3 frames y oro hiperbrillante sobre negro abisal.', C.gold],
    ['ÓPTICA ANAMÓRFICA', 'Aberración cromática RGB y destellos horizontales que funcionan como “golpes” visuales.', C.sapphire],
    ['TIPOGRAFÍA CINÉTICA', 'Texto que entra con resorte, se desintegra y se dibuja; él lleva el ritmo.', C.emerald],
  ];
  pillars.forEach(([h, t, col], i) => {
    const x = 0.6 + i * 4.1;
    s.addShape(pptx.ShapeType.rect, { x, y: 3.6, w: 3.8, h: 2.8, fill: { color: C.plate }, line: { color: col, width: 1 } });
    s.addShape(pptx.ShapeType.rect, { x, y: 3.6, w: 3.8, h: 0.06, fill: { color: col } });
    s.addText(h, { x: x + 0.25, y: 3.85, w: 3.3, h: 0.5, fontFace: HEAD, fontSize: 20, color: col, charSpacing: 2 });
    s.addText(t, { x: x + 0.25, y: 4.45, w: 3.3, h: 1.8, fontFace: SERIF, fontSize: 14, color: C.dim, valign: 'top' });
  });
}

// ── 3. CONCEPTO ────────────────────────────────────────────
{
  const s = pptx.addSlide({ masterName: 'BASE' });
  s.addImage({ path: F(195), x: 6.9, y: 0, w: 6.433, h: 7.5, sizing: { type: 'cover', w: 6.433, h: 7.5 } });
  kicker(s, '02 // CONCEPTO');
  s.addText('EL MUNDO CORRE.', { x: 0.6, y: 1.2, w: 6, h: 0.9, fontFace: HEAD, fontSize: 44, color: C.white, charSpacing: 3 });
  s.addText('NOSOTROS PARAMOS.', { x: 0.6, y: 2.0, w: 6, h: 0.9, fontFace: HEAD, fontSize: 44, color: C.gold, charSpacing: 3 });
  body(s, [
    { text: 'El andén es el único lugar de una estación donde se permite esperar. ', options: {} },
    { text: 'El Andén Café convierte esa espera en un ritual: la velocidad del tren contra la paciencia de un espresso bien hecho.', options: { breakLine: true } },
    { text: ' ', options: { breakLine: true } },
    { text: 'El film va de la máquina al grano: de la locomotora, que es prisa, a la cafetera, que es precisión.', options: {} },
  ], { y: 3.2, w: 5.9, h: 3.2 });
}

// ── 4. PALETA Y TIPOGRAFÍA ─────────────────────────────────
{
  const s = pptx.addSlide({ masterName: 'BASE' });
  kicker(s, '03 // SISTEMA VISUAL');
  title(s, 'PALETA DE ALTO CONTRASTE');
  const sw = [
    ['030705', 'CARBÓN ABISAL', 'Fondo'],
    ['0A140F', 'BOSQUE NOCTURNO', 'Fondo'],
    ['FFE259', 'ORO FUNDIDO', 'Luz principal'],
    ['FFA751', 'ÁMBAR', 'Luz cálida'],
    ['00FFA3', 'ESMERALDA NEÓN', 'Advertencia / HUD'],
    ['00E5FF', 'ZAFIRO', 'Destello anamórfico'],
  ];
  sw.forEach(([hex, name, role], i) => {
    const x = 0.6 + i * 2.05;
    s.addShape(pptx.ShapeType.rect, { x, y: 2.1, w: 1.85, h: 2.0, fill: { color: hex }, line: { color: '2A3A32', width: 1 } });
    s.addText(name, { x, y: 4.2, w: 1.95, h: 0.35, fontFace: HEAD, fontSize: 13, color: C.white });
    s.addText(`#${hex}`, { x, y: 4.5, w: 1.95, h: 0.3, fontFace: MONO, fontSize: 11, color: C.gold });
    s.addText(role, { x, y: 4.78, w: 1.95, h: 0.3, fontFace: SERIF, fontSize: 11, color: C.dim });
  });
  const ty = [
    ['GROTESCA CONDENSADA', 'EL MUNDO CORRE.', HEAD, 'Impacto: titulares en mayúscula sostenida'],
    ['MONOESPACIADA TÉCNICA', '[ 02 // PRESIÓN EXACTA ]', MONO, 'Precisión: lecturas HUD y telemetría'],
    ['SERIF CALIGRÁFICA', 'Una pausa antes de seguir', SERIF, 'Calidez: firma de marca'],
  ];
  ty.forEach(([lab, sample, face, note], i) => {
    const x = 0.6 + i * 4.1;
    s.addText(lab, { x, y: 5.35, w: 3.9, h: 0.3, fontFace: MONO, fontSize: 9, color: C.emerald, charSpacing: 3 });
    s.addText(sample, { x, y: 5.65, w: 3.9, h: 0.55, fontFace: face, fontSize: face === MONO ? 14 : 20, italic: face === SERIF, color: C.gold });
    s.addText(note, { x, y: 6.2, w: 3.9, h: 0.3, fontFace: SERIF, fontSize: 11, color: C.dim });
  });
}

// ── 5. ESTRUCTURA EN 4 ACTOS ───────────────────────────────
{
  const s = pptx.addSlide({ masterName: 'BASE' });
  kicker(s, '04 // ESTRUCTURA');
  title(s, '900 FRAMES · 4 ACTOS');
  const acts = [
    ['I', 'LA IGNICIÓN', '0 – 3.5 s', 210, C.molten, 'Oscuridad, chispa, flash de 3 frames. El farol revela el túnel. “EL MUNDO CORRE.”'],
    ['II', 'LA MÁQUINA', '3.5 – 8.0 s', 270, C.gold, 'Dolly zoom tipo Vértigo, locomotora vectorial en movimiento, vapor que se vuelve espresso. HUD técnico.'],
    ['III', 'EL COLAPSO', '8.0 – 12.0 s', 240, C.emerald, 'Implosión gravitacional, onda de choque, se forja el sello y lo cruza un destello anamórfico.'],
    ['IV', 'EL SELLO', '12.0 – 15.0 s', 180, C.sapphire, 'El emblema respira. Caligrafía viva. Viñeta y fundido a negro en el frame 885.'],
  ];
  const totalW = 12.1;
  let x = 0.6;
  acts.forEach(([n, name, time, frames, col, desc]) => {
    const w = (frames / 900) * totalW;
    s.addShape(pptx.ShapeType.rect, { x, y: 2.2, w: w - 0.05, h: 0.5, fill: { color: col } });
    s.addText(`ACTO ${n}`, { x, y: 2.2, w: w - 0.05, h: 0.5, align: 'center', fontFace: HEAD, fontSize: 16, color: C.abyss });
    s.addText(name, { x, y: 2.9, w: w - 0.1, h: 0.45, fontFace: HEAD, fontSize: 18, color: col });
    s.addText(`${time}  ·  ${frames} f`, { x, y: 3.32, w: w - 0.1, h: 0.3, fontFace: MONO, fontSize: 10, color: C.white });
    s.addText(desc, { x, y: 3.7, w: w - 0.15, h: 2.4, fontFace: SERIF, fontSize: 13, color: C.dim, valign: 'top' });
    x += w;
  });
}

// ── 6–9. ACTOS (uno por slide) ─────────────────────────────
const actSlides = [
  {
    k: 'ACTO I // FRAMES 0–210', t: 'LA IGNICIÓN EN LA PENUMBRA', a: 46, b: 100, col: C.molten,
    bullets: ['Chispa (f18) y flash blanco de exposición (f45–48)', 'Farol victoriano con lente Fresnel y haz volumétrico', 'Túnel de arcos en un punto de fuga · perspective 1200px', '“CORRE” se desintegra en líneas de velocidad'],
  },
  {
    k: 'ACTO II // FRAMES 210–480', t: 'LA MÁQUINA Y EL GRANO', a: 320, b: 430, col: C.gold,
    bullets: ['Dolly zoom: scale + perspectiveOrigin', 'Biela-manivela calculada por frame, engranajes 18:12', 'Vapor de locomotora → vapor de espresso (feDisplacementMap)', 'HUD: Tostado lento · Presión exacta · Alta montaña'],
  },
  {
    k: 'ACTO III // FRAMES 480–720', t: 'EL COLAPSO Y LA SÍNTESIS', a: 515, b: 640, col: C.emerald,
    bullets: ['Implosión con aceleración bezier(0.7, 0, 0.84, 0)', 'Onda de choque oro + esmeralda en el impacto (f535)', 'El aro dorado gira −90° → 0° y sella la lente', 'Destello anamórfico cruza el emblema (f620–700)'],
  },
  {
    k: 'ACTO IV // FRAMES 720–900', t: 'EL SELLO INMORTAL', a: 770, b: 860, col: C.sapphire,
    bullets: ['Pulso magnético del emblema: scale 1.000 ↔ 1.014', '“Una pausa antes de seguir” trazada con strokeDashoffset', 'La viñeta cierra hasta dejar solo farol y texto', 'Fundido a negro absoluto en el frame 885'],
  },
];
actSlides.forEach(({ k, t, a, b, col, bullets }) => {
  const s = pptx.addSlide({ masterName: 'BASE' });
  kicker(s, k);
  s.addText(t, { x: 0.6, y: 0.9, w: 12.2, h: 0.8, fontFace: HEAD, fontSize: 34, color: col, charSpacing: 2 });
  s.addImage({ path: F(a), x: 0.6, y: 1.9, w: 6.0, h: 3.375 });
  s.addImage({ path: F(b), x: 6.75, y: 1.9, w: 6.0, h: 3.375 });
  s.addText(`f${a}`, { x: 0.6, y: 5.3, w: 2, h: 0.25, fontFace: MONO, fontSize: 9, color: C.dim });
  s.addText(`f${b}`, { x: 6.75, y: 5.3, w: 2, h: 0.25, fontFace: MONO, fontSize: 9, color: C.dim });
  s.addText(
    bullets.map((txt) => ({ text: txt, options: { bullet: { code: '25B8' }, breakLine: true } })),
    { x: 0.6, y: 5.6, w: 12.2, h: 1.3, fontFace: SERIF, fontSize: 14, color: C.white, valign: 'top' },
  );
});

// ── 10. MOTOR ÓPTICO ───────────────────────────────────────
{
  const s = pptx.addSlide({ masterName: 'BASE' });
  kicker(s, '05 // MOTOR ÓPTICO');
  title(s, 'CÓMO SE COMPENSA EL SILENCIO');
  const cards = [
    ['ABERRACIÓN CROMÁTICA', 'Canales R, G y B separados con feColorMatrix y recombinados en modo screen. Desfase de 2 a 4 px en los momentos de impacto.', C.sapphire],
    ['DESTELLO ANAMÓRFICO', 'Destello horizontal zafiro y oro que cruza la pantalla con interpolación exponencial.', C.gold],
    ['DISTORSIÓN DE CALOR', 'feTurbulence + feDisplacementMap con baseFrequency animada por frame: el vapor refracta la luz.', C.molten],
    ['POLVO DORADO', '55–85 partículas deterministas (seno/coseno) suspendidas en el haz del farol. Mismo resultado en cada render.', C.emerald],
  ];
  cards.forEach(([h, t, col], i) => {
    const x = 0.6 + (i % 2) * 6.15;
    const y = 2.1 + Math.floor(i / 2) * 2.35;
    s.addShape(pptx.ShapeType.rect, { x, y, w: 5.95, h: 2.15, fill: { color: C.plate }, line: { color: col, width: 1 } });
    s.addShape(pptx.ShapeType.rect, { x, y, w: 0.07, h: 2.15, fill: { color: col } });
    s.addText(h, { x: x + 0.3, y: y + 0.2, w: 5.4, h: 0.45, fontFace: HEAD, fontSize: 20, color: col });
    s.addText(t, { x: x + 0.3, y: y + 0.7, w: 5.4, h: 1.35, fontFace: SERIF, fontSize: 14, color: C.dim, valign: 'top' });
  });
}

// ── 11. ESPECIFICACIONES ───────────────────────────────────
{
  const s = pptx.addSlide({ masterName: 'BASE' });
  kicker(s, '06 // ESPECIFICACIONES');
  title(s, 'FICHA TÉCNICA');
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.abyss, fill: { color: C.gold }, fontFace: HEAD, fontSize: 14 } });
  const row = (a, b) => [
    { text: a, options: { color: C.gold, fontFace: MONO, fontSize: 12 } },
    { text: b, options: { color: C.white, fontFace: SERIF, fontSize: 13 } },
  ];
  s.addTable(
    [
      [hdr('PARÁMETRO'), hdr('VALOR')],
      row('Duración', '900 frames · 15.0 s exactos'),
      row('Frame rate', '60 fps'),
      row('Resolución', '1920×1080 (encuadre 2.39:1) · versión 4K 3840×2160'),
      row('Audio', 'Ninguno: 100% silencioso por diseño'),
      row('Stack', 'Remotion 4 · React 18 · TypeScript estricto'),
      row('Arte', '100% SVG paramétrico, sin imágenes rasterizadas'),
      row('Animación', 'Función pura de frame y fps; spring() y bezier(0.16, 1, 0.3, 1)'),
      row('Salida', 'MP4 H.264'),
    ],
    { x: 0.6, y: 2.0, w: 12.1, colW: [3.2, 8.9], rowH: 0.48, fill: { color: C.plate }, border: { type: 'solid', color: '22332A', pt: 1 }, valign: 'middle' },
  );
}

// ── 12. ENTREGABLES ────────────────────────────────────────
{
  const s = pptx.addSlide({ masterName: 'BASE' });
  kicker(s, '07 // ENTREGABLES');
  title(s, 'QUÉ SE ENTREGA');
  const items = [
    ['MASTER 1080p', 'el-anden-cafe.mp4 · H.264 · 60 fps'],
    ['MASTER 4K', 'Composición MainComposition-4K lista para render'],
    ['CÓDIGO FUENTE', 'Proyecto Remotion modular: actos, ópticas, partículas y SVG'],
    ['PRESENTACIÓN', 'Este deck en PPTX + versión HTML + página interactiva'],
  ];
  items.forEach(([h, t], i) => {
    const y = 2.1 + i * 1.1;
    s.addText(String(i + 1).padStart(2, '0'), { x: 0.6, y, w: 0.9, h: 0.8, fontFace: HEAD, fontSize: 36, color: C.emerald });
    s.addText(h, { x: 1.6, y, w: 5, h: 0.45, fontFace: HEAD, fontSize: 20, color: C.gold });
    s.addText(t, { x: 1.6, y: y + 0.42, w: 6, h: 0.4, fontFace: SERIF, fontSize: 14, color: C.dim });
  });
  s.addImage({ path: F(640), x: 7.4, y: 2.1, w: 5.3, h: 2.98 });
}

// ── 13. CIERRE ─────────────────────────────────────────────
{
  const s = pptx.addSlide({ masterName: 'BASE' });
  s.addImage({ path: F(770), x: 0, y: 0, w: 13.333, h: 7.5 });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.abyss, transparency: 55 } });
  s.addText('Una pausa antes de seguir.', { x: 0, y: 3.1, w: 13.333, h: 1.0, align: 'center', fontFace: SERIF, italic: true, fontSize: 44, color: C.gold });
  s.addText('GRACIAS', { x: 0, y: 4.2, w: 13.333, h: 0.6, align: 'center', fontFace: HEAD, fontSize: 24, color: C.white, charSpacing: 16 });
}

const out = path.join(__dirname, 'EL_ANDEN_CAFE_Pitch.pptx');
await pptx.writeFile({ fileName: out });
console.log('OK →', out);
