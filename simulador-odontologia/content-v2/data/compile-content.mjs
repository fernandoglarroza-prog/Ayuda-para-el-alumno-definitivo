import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const index = JSON.parse(await fs.readFile(path.join(here, 'index.json'), 'utf8'));
const entries = [];

for (const relativeFile of index.files) {
  const data = JSON.parse(await fs.readFile(path.join(here, relativeFile), 'utf8'));
  entries.push(...data.entries);
}

const terminology = JSON.parse(await fs.readFile(path.join(here, index.terminology), 'utf8'));
const oralBank = JSON.parse(await fs.readFile(path.join(here, index.oralBank), 'utf8'));

const compiled = {
  version: index.version,
  generatedAt: new Date().toISOString(),
  entries,
  terminology: terminology.terms,
  oralBank: oralBank.questions,
  gradingScale: oralBank.gradingScale,
  editorialRules: terminology.editorialRules,
  runtime: {
    source: 'content-v2/data/index.json',
    uiIntegrated: false,
    note: 'Archivo generado; no editar manualmente. La fuente de verdad son los JSON enumerados en index.json.'
  }
};

await fs.writeFile(path.join(here, 'compiled-v2.json'), JSON.stringify(compiled, null, 2) + '\n');
console.log(`✓ compiled-v2.json generado con ${entries.length} fichas y ${oralBank.questions.length} preguntas.`);
