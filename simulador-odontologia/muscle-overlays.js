// Esquemas educativos de los músculos de la masticación.
// Todos los puntos se derivan en tiempo de ejecución de los límites de las
// piezas óseas del mismo atlas y de los accidentes mandibulares ya calculados.
// No representan segmentación muscular de un paciente ni sirven para medición clínica.

const RIGHT = -1;
const LEFT = 1;

const center = ([lo, hi]) => [
  (lo[0] + hi[0]) / 2,
  (lo[1] + hi[1]) / 2,
  (lo[2] + hi[2]) / 2
];

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const shift = (p, dx = 0, dy = 0, dz = 0) => [p[0] + dx, p[1] + dy, p[2] + dz];

function byName(parts, regex) {
  return parts.find((part) => regex.test(part.name || '')) || null;
}

function sideBone(parts, side, rightId, leftId, fallback) {
  const id = side === RIGHT ? rightId : leftId;
  return parts.find((part) => part.id === id || part.conceptId === id)
    || byName(parts, side === RIGHT ? new RegExp(`Right.*${fallback}`, 'i') : new RegExp(`Left.*${fallback}`, 'i'));
}

function pointFromBounds(bounds, fx = 0.5, fy = 0.5, fz = 0.5) {
  if (!Array.isArray(bounds) || bounds.length !== 2) return null;
  const [lo, hi] = bounds;
  return [
    lo[0] + (hi[0] - lo[0]) * fx,
    lo[1] + (hi[1] - lo[1]) * fy,
    lo[2] + (hi[2] - lo[2]) * fz
  ];
}

export function deriveMasticatoryMuscles(parts, landmarkPoints = {}) {
  const condyles = landmarkPoints.condilo_mandibular || [];
  const coronoids = landmarkPoints.coronoides_mandibular || [];
  const gonions = landmarkPoints.angulo_mandibular || [];
  const sphenoid = byName(parts, /sphenoid bone/i);
  const temporalMid = (side) => sideBone(parts, side, 'FJ3386', 'FJ3281', 'temporal bone');
  const zygomatic = (side) => sideBone(parts, side, 'FJ3392', 'FJ3287', 'zygomatic bone');

  const muscles = [];
  for (const [index, side] of [RIGHT, LEFT].entries()) {
    const hand = side === RIGHT ? 'derecho' : 'izquierdo';
    const condyle = condyles[index];
    const coronoid = coronoids[index];
    const gonion = gonions[index];
    const zyg = zygomatic(side);
    const temp = temporalMid(side);
    if (!condyle || !coronoid || !gonion || !zyg?.bounds || !temp?.bounds || !sphenoid?.bounds) continue;

    const zygOrigin = pointFromBounds(
      zyg.bounds,
      side === RIGHT ? 0.22 : 0.78,
      0.30,
      0.54
    );
    const masseterInsertion = shift(gonion, side * 0.0016, 0.0075, 0.004);
    muscles.push({
      key: 'masetero',
      name: 'Músculo masetero',
      side: hand,
      start: zygOrigin,
      end: masseterInsertion,
      width: 0.0064,
      depth: 0.0038,
      note: 'Origen esquemático en arco cigomático e inserción sobre cara lateral de rama y ángulo mandibular.'
    });

    const tempOrigin = pointFromBounds(
      temp.bounds,
      side === RIGHT ? 0.12 : 0.88,
      0.78,
      0.55
    );
    muscles.push({
      key: 'musculo_temporal',
      name: 'Músculo temporal',
      side: hand,
      start: tempOrigin,
      end: shift(coronoid, 0, -0.003, 0.002),
      width: 0.0090,
      depth: 0.0032,
      note: 'Representación fusiforme simplificada de un músculo real con forma de abanico.'
    });

    const [sLo, sHi] = sphenoid.bounds;
    const pterygoidX = side === RIGHT
      ? sLo[0] + (sHi[0] - sLo[0]) * 0.30
      : sLo[0] + (sHi[0] - sLo[0]) * 0.70;
    const medialOrigin = [pterygoidX, sLo[1] + (sHi[1] - sLo[1]) * 0.18, sLo[2] + (sHi[2] - sLo[2]) * 0.42];
    const medialInsertion = shift(gonion, -side * 0.0030, 0.006, -0.001);
    muscles.push({
      key: 'pterigoideo_medial',
      name: 'Músculo pterigoideo medial',
      side: hand,
      start: medialOrigin,
      end: medialInsertion,
      width: 0.0048,
      depth: 0.0032,
      note: 'Trayecto educativo desde región pterigoidea hacia cara medial del ángulo mandibular.'
    });

    const lateralOrigin = [pterygoidX, sLo[1] + (sHi[1] - sLo[1]) * 0.32, sLo[2] + (sHi[2] - sLo[2]) * 0.56];
    const condylarNeck = mix(condyle, coronoid, 0.18);
    muscles.push({
      key: 'pterigoideo_lateral',
      name: 'Músculo pterigoideo lateral',
      side: hand,
      start: lateralOrigin,
      end: shift(condylarNeck, -side * 0.0015, -0.003, 0.001),
      width: 0.0044,
      depth: 0.0030,
      note: 'Representación simplificada de sus fascículos hacia cuello condilar y complejo disco-cápsula.'
    });
  }
  return muscles;
}
