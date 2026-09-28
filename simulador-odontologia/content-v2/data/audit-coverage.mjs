import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const index = JSON.parse(await fs.readFile(path.join(here, 'index.json'), 'utf8'));

const entries = [];
for (const relativeFile of index.files) {
  const data = JSON.parse(await fs.readFile(path.join(here, relativeFile), 'utf8'));
  for (const entry of data.entries || []) entries.push({ ...entry, __file: relativeFile });
}

const oralBanks = index.oralBanks?.length ? index.oralBanks : [index.oralBank];
const questions = [];
for (const relativeFile of oralBanks) {
  const data = JSON.parse(await fs.readFile(path.join(here, relativeFile), 'utf8'));
  for (const question of data.questions || []) questions.push({ ...question, __file: relativeFile });
}

const byId = new Map(entries.map(entry => [entry.id, entry]));
const unitMap = new Map();
const categoryMap = new Map();
const statusMap = new Map();

for (const entry of entries) {
  categoryMap.set(entry.category, (categoryMap.get(entry.category) || 0) + 1);
  statusMap.set(entry.status, (statusMap.get(entry.status) || 0) + 1);
  for (const unit of entry.paUnits || ['Sin unidad']) {
    if (!unitMap.has(unit)) unitMap.set(unit, { entries: new Set(), questions: new Set(), technicalBlocks: 0, pendingNotes: 0, categories: new Map() });
    const row = unitMap.get(unit);
    row.entries.add(entry.id);
    row.technicalBlocks += entry.levels?.technical?.blocks?.length || 0;
    row.pendingNotes += (entry.validationNotes || []).length;
    row.categories.set(entry.category, (row.categories.get(entry.category) || 0) + 1);
  }
}

for (const question of questions) {
  const entry = byId.get(question.topic);
  if (!entry) continue;
  for (const unit of entry.paUnits || ['Sin unidad']) {
    if (!unitMap.has(unit)) unitMap.set(unit, { entries: new Set(), questions: new Set(), technicalBlocks: 0, pendingNotes: 0, categories: new Map() });
    unitMap.get(unit).questions.add(question.id);
  }
}

const units = [...unitMap.entries()].map(([unit, row]) => ({
  unit,
  entries: row.entries.size,
  oralQuestions: row.questions.size,
  technicalBlocks: row.technicalBlocks,
  pendingValidationNotes: row.pendingNotes,
  categories: Object.fromEntries([...row.categories.entries()].sort((a, b) => b[1] - a[1]))
})).sort((a, b) => a.unit.localeCompare(b.unit, 'es'));

const entriesWithoutGlobalOral = entries.filter(entry => !questions.some(q => q.topic === entry.id)).map(entry => entry.id);
const entriesPendingCatedra = entries.filter(entry => entry.status === 'pending-catedra').map(entry => entry.id);
const entriesWithValidationNotes = entries.filter(entry => (entry.validationNotes || []).length).map(entry => ({ id: entry.id, notes: entry.validationNotes }));

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    entries: entries.length,
    oralQuestions: questions.length,
    categories: Object.fromEntries([...categoryMap.entries()].sort((a, b) => b[1] - a[1])),
    statuses: Object.fromEntries([...statusMap.entries()].sort((a, b) => b[1] - a[1])),
    entriesWithoutGlobalOral: entriesWithoutGlobalOral.length,
    pendingCatedra: entriesPendingCatedra.length,
    withValidationNotes: entriesWithValidationNotes.length
  },
  units,
  entriesWithoutGlobalOral,
  entriesWithValidationNotes
};

await fs.writeFile(path.join(here, 'coverage-report.json'), JSON.stringify(report, null, 2) + '\n');

console.log(`Auditoría V2 · ${entries.length} fichas · ${questions.length} preguntas orales`);
console.log(`Estados: ${[...statusMap.entries()].map(([k, v]) => `${k}=${v}`).join(' · ')}`);
console.log(`Fichas sin pregunta en banco global: ${entriesWithoutGlobalOral.length}`);
console.log(`Fichas con notas de validación: ${entriesWithValidationNotes.length}`);
console.log('\nCobertura por unidad:');
for (const row of units) {
  console.log(`- ${row.unit}: ${row.entries} fichas · ${row.technicalBlocks} bloques técnicos · ${row.oralQuestions} preguntas · ${row.pendingValidationNotes} notas pendientes`);
}

const weakest = [...units]
  .filter(row => row.entries > 0)
  .sort((a, b) => (a.technicalBlocks / a.entries) - (b.technicalBlocks / b.entries))
  .slice(0, 5);
console.log('\nUnidades con menor densidad técnica media:');
for (const row of weakest) {
  console.log(`- ${row.unit}: ${(row.technicalBlocks / row.entries).toFixed(1)} bloques técnicos/ficha`);
}
