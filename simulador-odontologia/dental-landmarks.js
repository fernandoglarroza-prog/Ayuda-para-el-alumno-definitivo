// Landmark and schematic nerve fitting adapted from OMF Atlas (MIT License).
// Copyright (c) 2026 Ahmad Sofi-Mahmudi.
// Adapted for Ayuda para el Alumno's Simulador de Odontología.
//
// The points below are derived at runtime from the same BodyParts3D/Human Atlas
// assembly shown in the viewer. They are educational landmarks, not a patient-
// specific segmentation and not a source for clinical measurements.

const RIGHT = -1;
const LEFT = 1;

const mid = (a, b, t = 0.5) => a.map((v, i) => v + (b[i] - v) * t);
const shift = (p, dx = 0, dy = 0, dz = 0) => [p[0] + dx, p[1] + dy, p[2] + dz];

function toothNumber(name = '') {
  if (!/tooth/i.test(name)) return null;
  const quadrant = /Right upper/i.test(name)
    ? 1
    : /Left upper/i.test(name)
      ? 2
      : /Left lower/i.test(name)
        ? 3
        : 4;
  const position = /central/i.test(name)
    ? 1
    : /lateral/i.test(name)
      ? 2
      : /canine/i.test(name)
        ? 3
        : /first.*premolar/i.test(name)
          ? 4
          : /second.*premolar/i.test(name)
            ? 5
            : /first.*molar/i.test(name)
              ? 6
              : /second.*molar/i.test(name)
                ? 7
                : null;
  return position ? quadrant * 10 + position : null;
}

function extreme(vertices, within, score) {
  let best = null;
  let bestScore = -Infinity;
  for (const v of vertices) {
    if (!within(v)) continue;
    const value = score(v);
    if (value > bestScore) {
      bestScore = value;
      best = v;
    }
  }
  return best;
}

function findPart(parts, ids, pattern) {
  for (const id of ids) {
    const hit = parts.find((part) => part.id === id || part.conceptId === id);
    if (hit) return hit;
  }
  return parts.find((part) => pattern.test(part.name || '')) || null;
}

export function deriveDentalLandmarks(parts, readVertices) {
  const teeth = new Map();
  for (const part of parts) {
    const fdi = toothNumber(part.name || '');
    if (fdi && Array.isArray(part.bounds)) teeth.set(fdi, part.bounds);
  }
  if (teeth.size < 20) throw new Error('No hay suficientes dientes fuente para anclar los accidentes');

  const archCenter = (upper) => {
    const rows = [...teeth]
      .filter(([fdi]) => (fdi < 30) === upper)
      .map(([, bounds]) => bounds);
    if (!rows.length) return [0, 0];
    const sum = rows.reduce(
      (acc, [lo, hi]) => [acc[0] + (lo[0] + hi[0]) / 2, acc[1] + (lo[2] + hi[2]) / 2],
      [0, 0]
    );
    return [sum[0] / rows.length, sum[1] / rows.length];
  };

  const tooth = (fdi) => {
    const bounds = teeth.get(fdi);
    if (!bounds) throw new RangeError(`No se encontró el diente fuente FDI ${fdi}`);
    const [lo, hi] = bounds;
    const upper = fdi < 30;
    const x = (lo[0] + hi[0]) / 2;
    const z = (lo[2] + hi[2]) / 2;
    const center = archCenter(upper);
    const out = [x - center[0], z - center[1]];
    const length = Math.hypot(out[0], out[1]) || 1;
    return {
      apex: [x, upper ? hi[1] : lo[1], z],
      crown: [x, upper ? lo[1] : hi[1], z],
      center: [x, (lo[1] + hi[1]) / 2, z],
      lingual: (distance = 0) => [
        x - (out[0] / length) * ((hi[0] - lo[0]) / 2 + distance),
        (lo[1] + hi[1]) / 2,
        z - (out[1] / length) * ((hi[2] - lo[2]) / 2 + distance)
      ]
    };
  };

  const mandible = findPart(parts, ['FJ3289'], /^Mandible$/i);
  if (!mandible) throw new Error('No se encontró la mandíbula fuente');
  const mandibleVertices = readVertices(mandible);
  if (!mandibleVertices?.length) throw new Error('No se pudieron leer los vértices mandibulares');

  const sideOf = (s) => (v) => (s < 0 ? v[0] < -0.015 : v[0] > 0.015);
  const condyle = (s) => extreme(mandibleVertices, sideOf(s), (v) => v[1]);
  const coronoid = (s) => {
    const top = condyle(s);
    if (!top) return null;
    return extreme(mandibleVertices, (v) => sideOf(s)(v) && v[2] > top[2] + 0.01, (v) => v[1]);
  };
  const gonion = (s) => extreme(mandibleVertices, (v) => sideOf(s)(v) && v[2] < 0.02, (v) => -v[1]);

  const molarOcclusal = Math.max(tooth(37).crown[1], tooth(47).crown[1]);
  const mandibularForamen = (s) => {
    const band = (v) =>
      sideOf(s)(v) && Math.abs(v[1] - molarOcclusal) < 0.005 && v[2] > -0.004 && v[2] < 0.018;
    const medial = extreme(mandibleVertices, band, (v) => -Math.abs(v[0]));
    const at = medial || [s * 0.034, molarOcclusal, 0.012];
    return [at[0] - s * 0.0015, at[1], at[2]];
  };

  const mentalForamen = (s) => {
    const first = tooth(s < 0 ? 44 : 34);
    const second = tooth(s < 0 ? 45 : 35);
    const z = (first.apex[2] + second.apex[2]) / 2;
    const y = Math.min(first.apex[1], second.apex[1]) - 0.0022;
    const band = (v) => sideOf(s)(v) && Math.abs(v[2] - z) < 0.005 && Math.abs(v[1] - y) < 0.006;
    const buccal = extreme(mandibleVertices, band, (v) => Math.abs(v[0]));
    return buccal ? [buccal[0], y, z] : [s * 0.022, y, z];
  };

  const maxilla = (s) => findPart(
    parts,
    s < 0 ? ['FJ3375'] : ['FJ3269'],
    s < 0 ? /Right maxilla|right maxillary bone/i : /Left maxilla|left maxillary bone/i
  );

  const infraorbitalForamen = (s) => {
    const bone = maxilla(s);
    if (!bone?.bounds) return null;
    const canine = tooth(s < 0 ? 13 : 23);
    const [, hi] = bone.bounds;
    return [canine.apex[0] * 1.05, hi[1] - 0.009, canine.apex[2] - 0.002];
  };

  const pterygopalatineFossa = (s) => {
    const bone = maxilla(s);
    if (!bone?.bounds) return null;
    const molar = tooth(s < 0 ? 17 : 27);
    const [lo] = bone.bounds;
    const tuberosity = [molar.center[0], molar.apex[1] + 0.002, lo[2] + 0.002];
    return [tuberosity[0] * 0.86, tuberosity[1] + 0.005, tuberosity[2] - 0.008];
  };

  const foramenOvale = (s) => {
    const fossa = pterygopalatineFossa(s);
    return fossa ? [fossa[0] * 0.92, fossa[1] + 0.014, fossa[2] - 0.012] : null;
  };

  const landmarkPoints = {
    condilo_mandibular: [condyle(RIGHT), condyle(LEFT)],
    coronoides_mandibular: [coronoid(RIGHT), coronoid(LEFT)],
    angulo_mandibular: [gonion(RIGHT), gonion(LEFT)],
    foramen_mandibular: [mandibularForamen(RIGHT), mandibularForamen(LEFT)],
    foramen_mentoniano: [mentalForamen(RIGHT), mentalForamen(LEFT)],
    foramen_infraorbitario: [infraorbitalForamen(RIGHT), infraorbitalForamen(LEFT)],
    foramen_oval: [foramenOvale(RIGHT), foramenOvale(LEFT)]
  };

  for (const [key, values] of Object.entries(landmarkPoints)) {
    landmarkPoints[key] = values.filter((point) => Array.isArray(point) && point.every(Number.isFinite));
  }

  const inferiorAlveolarPath = (s) => {
    const under = (fdi, drop) => shift(tooth(fdi).apex, 0, -drop, 0);
    const right = s < 0;
    return [
      mid(foramenOvale(s), mandibularForamen(s), 0.55),
      mandibularForamen(s),
      under(right ? 47 : 37, 0.0035),
      under(right ? 46 : 36, 0.0035),
      under(right ? 45 : 35, 0.003),
      mentalForamen(s)
    ];
  };

  const v3Path = (s) => [
    shift(foramenOvale(s), 0, 0.008, -0.003),
    foramenOvale(s),
    mid(foramenOvale(s), mandibularForamen(s), 0.55)
  ];

  const mentalNervePath = (s) => {
    const foramen = mentalForamen(s);
    return [
      foramen,
      shift(foramen, s * 0.003, 0.002, 0.005),
      shift(foramen, s * 0.004, 0.006, 0.010)
    ];
  };

  return {
    landmarkPoints,
    nervePaths: [
      { key: 'v3', name: 'Nervio mandibular (V3)', side: 'derecho', points: v3Path(RIGHT) },
      { key: 'v3', name: 'Nervio mandibular (V3)', side: 'izquierdo', points: v3Path(LEFT) },
      { key: 'ian', name: 'Nervio alveolar inferior', side: 'derecho', points: inferiorAlveolarPath(RIGHT) },
      { key: 'ian', name: 'Nervio alveolar inferior', side: 'izquierdo', points: inferiorAlveolarPath(LEFT) },
      { key: 'mental', name: 'Nervio mentoniano', side: 'derecho', points: mentalNervePath(RIGHT) },
      { key: 'mental', name: 'Nervio mentoniano', side: 'izquierdo', points: mentalNervePath(LEFT) }
    ]
  };
}
