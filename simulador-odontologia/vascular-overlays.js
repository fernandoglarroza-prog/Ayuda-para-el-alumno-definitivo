// Schematic arterial fitting adapted from OMF Atlas (MIT License).
// Copyright (c) 2026 Ahmad Sofi-Mahmudi.
// Adapted for Ayuda para el Alumno's Simulador de Odontología.
//
// These paths are derived at runtime from the same BodyParts3D skull and teeth
// shown in the viewer. They are teaching geometry, not vascular segmentation,
// patient-specific anatomy, diagnostic information or clinical measurements.

const RIGHT = -1;
const LEFT = 1;
const shift = (p, dx = 0, dy = 0, dz = 0) => [p[0] + dx, p[1] + dy, p[2] + dz];

function toothNumber(name = '') {
  if (!/tooth/i.test(name)) return null;
  const quadrant = /Right upper/i.test(name) ? 1 : /Left upper/i.test(name) ? 2 : /Left lower/i.test(name) ? 3 : 4;
  const position = /central/i.test(name) ? 1 : /lateral/i.test(name) ? 2 : /canine/i.test(name) ? 3 : /first.*premolar/i.test(name) ? 4 : /second.*premolar/i.test(name) ? 5 : /first.*molar/i.test(name) ? 6 : /second.*molar/i.test(name) ? 7 : null;
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

export function deriveVascularPaths(parts, readVertices) {
  const teeth = new Map();
  for (const part of parts) {
    const fdi = toothNumber(part.name || '');
    if (fdi && Array.isArray(part.bounds)) teeth.set(fdi, part.bounds);
  }
  if (teeth.size < 20) return [];

  const archCenter = (upper) => {
    const rows = [...teeth].filter(([fdi]) => (fdi < 30) === upper).map(([, bounds]) => bounds);
    const sum = rows.reduce((acc, [lo, hi]) => [acc[0] + (lo[0] + hi[0]) / 2, acc[1] + (lo[2] + hi[2]) / 2], [0, 0]);
    return rows.length ? [sum[0] / rows.length, sum[1] / rows.length] : [0, 0];
  };

  const tooth = (fdi) => {
    const bounds = teeth.get(fdi);
    if (!bounds) throw new RangeError(`No source tooth ${fdi}`);
    const [lo, hi] = bounds;
    const upper = fdi < 30;
    const x = (lo[0] + hi[0]) / 2;
    const z = (lo[2] + hi[2]) / 2;
    const center = archCenter(upper);
    const out = [x - center[0], z - center[1]];
    const length = Math.hypot(out[0], out[1]) || 1;
    return {
      apex: [x, upper ? hi[1] : lo[1], z],
      center: [x, (lo[1] + hi[1]) / 2, z],
      buccal: (distance = 0) => [
        x + (out[0] / length) * ((hi[0] - lo[0]) / 2 + distance),
        (lo[1] + hi[1]) / 2,
        z + (out[1] / length) * ((hi[2] - lo[2]) / 2 + distance)
      ]
    };
  };

  const mandible = findPart(parts, ['FJ3289'], /^Mandible$/i);
  if (!mandible) return [];
  const vertices = readVertices(mandible);
  if (!vertices?.length) return [];
  const sideOf = (s) => (v) => (s < 0 ? v[0] < -0.015 : v[0] > 0.015);
  const condyle = (s) => extreme(vertices, sideOf(s), (v) => v[1]);
  const molarOcclusal = Math.max(tooth(37).center[1], tooth(47).center[1]);
  const mandibularForamen = (s) => {
    const band = (v) => sideOf(s)(v) && Math.abs(v[1] - molarOcclusal) < 0.007 && v[2] > -0.006 && v[2] < 0.020;
    const medial = extreme(vertices, band, (v) => -Math.abs(v[0]));
    const at = medial || [s * 0.034, molarOcclusal, 0.012];
    return [at[0] - s * 0.0015, at[1], at[2]];
  };
  const mentalForamen = (s) => {
    const first = tooth(s < 0 ? 44 : 34);
    const second = tooth(s < 0 ? 45 : 35);
    const z = (first.apex[2] + second.apex[2]) / 2;
    const y = Math.min(first.apex[1], second.apex[1]) - 0.0022;
    return [s * 0.022, y, z];
  };
  const maxilla = (s) => findPart(parts, s < 0 ? ['FJ3375'] : ['FJ3269'], s < 0 ? /Right maxilla|right maxillary bone/i : /Left maxilla|left maxillary bone/i);
  const tuberosity = (s) => {
    const bone = maxilla(s);
    if (!bone?.bounds) return null;
    const molar = tooth(s < 0 ? 17 : 27);
    const [lo] = bone.bounds;
    return [molar.center[0], molar.apex[1] + 0.002, lo[2] + 0.002];
  };
  const pterygopalatineFossa = (s) => {
    const at = tuberosity(s);
    return at ? [at[0] * 0.86, at[1] + 0.005, at[2] - 0.008] : null;
  };

  const maxillaryArtery = (s) => {
    const head = condyle(s);
    const fossa = pterygopalatineFossa(s);
    if (!head || !fossa) return [];
    return [
      [head[0] * 0.94, head[1] - 0.018, head[2] - 0.012],
      [head[0] * 0.86, head[1] - 0.014, head[2] + 0.002],
      [fossa[0] * 1.25, fossa[1] + 0.004, fossa[2] - 0.004],
      fossa
    ];
  };

  const inferiorAlveolarArtery = (s) => {
    const under = (fdi, drop) => shift(tooth(fdi).apex, 0, -drop, 0);
    const right = s < 0;
    const foramen = mandibularForamen(s);
    return [
      [foramen[0] - s * 0.004, foramen[1] + 0.012, foramen[2] - 0.004],
      shift(foramen, 0, 0.0012, 0.0008),
      under(right ? 47 : 37, 0.0028),
      under(right ? 46 : 36, 0.0028),
      shift(mentalForamen(s), 0, 0.0009, -0.001)
    ];
  };

  const posteriorSuperiorAlveolarArtery = (s) => {
    const fossa = pterygopalatineFossa(s);
    const tube = tuberosity(s);
    if (!fossa || !tube) return [];
    const second = tooth(s < 0 ? 17 : 27);
    const first = tooth(s < 0 ? 16 : 26);
    return [
      shift(fossa, s * 0.004, 0.001, 0.002),
      shift(tube, s * 0.002, 0, 0.002),
      shift(second.buccal(0.002), 0, 0.006, 0),
      shift(first.buccal(0.002), 0, 0.006, 0)
    ];
  };

  const make = (key, name, side, points, caliber) => ({ key, name, side, points, caliber, schematic: true });
  return [
    make('maxillary_artery', 'Arteria maxilar', 'derecha', maxillaryArtery(RIGHT), 'artery'),
    make('maxillary_artery', 'Arteria maxilar', 'izquierda', maxillaryArtery(LEFT), 'artery'),
    make('inferior_alveolar_artery', 'Arteria alveolar inferior', 'derecha', inferiorAlveolarArtery(RIGHT), 'small'),
    make('inferior_alveolar_artery', 'Arteria alveolar inferior', 'izquierda', inferiorAlveolarArtery(LEFT), 'small'),
    make('posterior_superior_alveolar_artery', 'Arteria alveolar superior posterior', 'derecha', posteriorSuperiorAlveolarArtery(RIGHT), 'small'),
    make('posterior_superior_alveolar_artery', 'Arteria alveolar superior posterior', 'izquierda', posteriorSuperiorAlveolarArtery(LEFT), 'small')
  ].filter((entry) => entry.points.length >= 2 && entry.points.every((p) => Array.isArray(p) && p.every(Number.isFinite)));
}