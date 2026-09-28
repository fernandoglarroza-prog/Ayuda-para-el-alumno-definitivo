import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const index = JSON.parse(await fs.readFile(path.join(here, 'index.json'), 'utf8'));
const errors = [];
const warnings = [];

const requiredLevels = ['review', 'development', 'technical', 'oral'];
const majorTopics = new Set([
  'mandibula', 'maxilar', 'temporal', 'esfenoides',
  'fosa_infratemporal', 'fosa_pterigopalatina', 'v2', 'v3',
  'arteria_maxilar', 'atm', 'pterigoideo_lateral', 'piso_boca',
  'lengua', 'parotida', 'submandibular', 'primer_molar_superior',
  'primer_molar_inferior', 'conducto_mandibular_radiologia', 'seno_maxilar_radiologia',
  'denticion_temporaria', 'denticion_mixta', 'oclusion_morfologica',
  'arcos_contactos', 'periodonto_insercion', 'anatomia_interna_dentaria',
  'anatomia_desdentado'
]);

const allEntries = [];
for (const relativeFile of index.files) {
  const full = path.join(here, relativeFile);
  let data;
  try {
    data = JSON.parse(await fs.readFile(full, 'utf8'));
  } catch (err) {
    errors.push(`${relativeFile}: JSON inválido o ilegible (${err.message})`);
    continue;
  }
  if (!Array.isArray(data.entries)) {
    errors.push(`${relativeFile}: falta entries[]`);
    continue;
  }
  for (const entry of data.entries) allEntries.push({ ...entry, __file: relativeFile });
}

const byId = new Map();
for (const entry of allEntries) {
  if (!entry.id) {
    errors.push(`${entry.__file}: entrada sin id`);
    continue;
  }
  if (byId.has(entry.id)) errors.push(`ID duplicado: ${entry.id}`);
  byId.set(entry.id, entry);

  if (!entry.preferredName) errors.push(`${entry.id}: falta preferredName`);
  if (!entry.category) errors.push(`${entry.id}: falta category`);
  if (!Array.isArray(entry.paUnits) || !entry.paUnits.length) errors.push(`${entry.id}: falta paUnits`);
  if (!entry.terminology?.preferred) errors.push(`${entry.id}: falta terminology.preferred`);
  if (!entry.exam?.questions?.length) errors.push(`${entry.id}: falta al menos una pregunta de examen`);
  if (!Array.isArray(entry.sourceDocs) || !entry.sourceDocs.length) errors.push(`${entry.id}: falta sourceDocs`);

  for (const level of requiredLevels) {
    const value = entry.levels?.[level];
    if (!value) {
      errors.push(`${entry.id}: falta nivel ${level}`);
      continue;
    }
    if (!value.summary || value.summary.length < 20) errors.push(`${entry.id}/${level}: resumen demasiado corto`);
    if (!Array.isArray(value.blocks) || !value.blocks.length) errors.push(`${entry.id}/${level}: falta blocks[]`);
  }

  const techBlocks = entry.levels?.technical?.blocks?.length || 0;
  if (majorTopics.has(entry.id) && techBlocks < index.rules.minimumMajorTopicTechnicalBlocks) {
    errors.push(`${entry.id}: nivel técnico tiene ${techBlocks} bloques; mínimo ${index.rules.minimumMajorTopicTechnicalBlocks}`);
  }

  for (const sourceDoc of entry.sourceDocs || []) {
    try {
      await fs.access(path.join(root, sourceDoc));
    } catch {
      errors.push(`${entry.id}: sourceDoc inexistente: ${sourceDoc}`);
    }
  }
}

for (const entry of allEntries) {
  for (const rel of entry.relations || []) {
    if (!byId.has(rel.target)) errors.push(`${entry.id}: relación apunta a ID inexistente ${rel.target}`);
  }
}

const terminology = JSON.parse(await fs.readFile(path.join(here, index.terminology), 'utf8'));
const normalizedTerms = new Map();
const normalize = value => String(value || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().trim().replace(/\s+/g, ' ');

for (const term of terminology.terms || []) {
  if (!byId.has(term.target)) errors.push(`Terminología: target inexistente ${term.target} (${term.preferred})`);
  for (const variant of [term.preferred, ...(term.synonyms || []), ...(term.classicTerms || [])]) {
    const key = normalize(variant);
    if (!key) continue;
    const previous = normalizedTerms.get(key);
    if (previous && previous !== term.target) {
      warnings.push(`Término ambiguo '${variant}' apunta a ${previous} y ${term.target}`);
    } else {
      normalizedTerms.set(key, term.target);
    }
  }
}

const oralBankFiles = Array.isArray(index.oralBanks) && index.oralBanks.length ? index.oralBanks : [index.oralBank];
const oralQuestions = [];
for (const oralFile of oralBankFiles) {
  try {
    const bank = JSON.parse(await fs.readFile(path.join(here, oralFile), 'utf8'));
    oralQuestions.push(...(bank.questions || []));
  } catch (err) {
    errors.push(`${oralFile}: banco oral inválido o ilegible (${err.message})`);
  }
}

const oralIds = new Set();
for (const question of oralQuestions) {
  if (!question.id) errors.push('Banco oral: pregunta sin id');
  if (oralIds.has(question.id)) errors.push(`Banco oral: ID duplicado ${question.id}`);
  oralIds.add(question.id);
  if (!byId.has(question.topic)) errors.push(`Banco oral: topic inexistente ${question.topic}`);
  if (!question.prompt) errors.push(`Banco oral ${question.id}: falta prompt`);
  if (!Array.isArray(question.mustInclude) || question.mustInclude.length < 3) {
    errors.push(`Banco oral ${question.id}: mustInclude insuficiente`);
  }
}

const statuses = allEntries.reduce((acc, e) => {
  acc[e.status] = (acc[e.status] || 0) + 1;
  return acc;
}, {});

console.log(`Contenido V2: ${allEntries.length} fichas estructuradas`);
console.log(`Preguntas orales: ${oralQuestions.length}`);
console.log('Estados:', statuses);
if (warnings.length) {
  console.warn(`\nAdvertencias (${warnings.length}):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error(`\nErrores (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('\n✓ Validación estructural superada.');
}
