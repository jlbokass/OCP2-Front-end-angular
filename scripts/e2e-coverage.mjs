import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const specsRoot = path.join(root, 'cypress', 'e2e');
const reportDir = path.join(root, 'reports');
const reportPath = path.join(reportDir, 'e2e-coverage.md');

const journeys = [
  ['E2E-01', 'Homepage'],
  ['E2E-02', 'Inscription valide'],
  ['E2E-03', 'Validation du formulaire inscription'],
  ['E2E-04', 'Connexion valide'],
  ['E2E-05', 'Connexion invalide'],
  ['E2E-06', 'Accès protégé sans session'],
  ['E2E-07', 'Liste des étudiants'],
  ['E2E-08', 'Création étudiant'],
  ['E2E-09', 'Détail étudiant'],
  ['E2E-10', 'Modification étudiant'],
  ['E2E-11', 'Suppression étudiant']
];

const screens = [
  '/',
  '/register',
  '/login',
  '/students',
  '/students/new',
  '/students/:id',
  '/students/:id/edit'
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return walk(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith('.cy.ts')) {
        return [fullPath];
      }

      return [];
    });
}

const files = walk(specsRoot);
const journeyLocations = new Map();
const screenLocations = new Map();

for (const file of files) {
  const relative = path.relative(root, file);
  const source = fs.readFileSync(file, 'utf8');

  for (const match of source.matchAll(/@coverage\s+(E2E-\d+)/g)) {
    journeyLocations.set(match[1], relative);
  }

  for (const match of source.matchAll(/@screen\s+([^\s]+)/g)) {
    screenLocations.set(match[1], relative);
  }
}

const coveredJourneys = journeys.filter(
  ([id]) => journeyLocations.has(id)
);

const coveredScreens = screens.filter(
  route => screenLocations.has(route)
);

const journeyCoverage =
  (coveredJourneys.length / journeys.length) * 100;

const screenCoverage =
  (coveredScreens.length / screens.length) * 100;

const journeyRows = journeys.map(([id, label]) => {
  const file = journeyLocations.get(id);

  return `| ${id} | ${label} | ${file ?? '—'} | ${file ? 'Oui' : 'Non'} |`;
}).join('\n');

const screenRows = screens.map(route => {
  const file = screenLocations.get(route);

  return `| \`${route}\` | ${file ?? '—'} | ${file ? 'Oui' : 'Non'} |`;
}).join('\n');

const report = `# Rapport de couverture E2E

## Méthode

Cette mesure est une couverture fonctionnelle des parcours, distincte du taux de réussite des tests Cypress.

Formule :

\`\`\`text
parcours requis couverts / parcours requis × 100
\`\`\`

La couverture des écrans est mesurée séparément.

## Parcours

| ID | Parcours | Spec | Couvert |
|---|---|---|---|
${journeyRows}

\`\`\`text
Parcours couverts : ${coveredJourneys.length} / ${journeys.length}
Couverture E2E    : ${journeyCoverage.toFixed(1)} %
Seuil requis      : 80 %
\`\`\`

## Écrans

| Écran | Spec | Couvert |
|---|---|---|
${screenRows}

\`\`\`text
Écrans couverts : ${coveredScreens.length} / ${screens.length}
Couverture écrans : ${screenCoverage.toFixed(1)} %
Objectif           : 100 %
\`\`\`

## Interprétation

Ce rapport vérifie que les parcours et écrans prévus sont représentés dans la suite Cypress.

Le résultat d'exécution Cypress reste une preuve séparée : tous les scénarios implémentés doivent également réussir.
`;

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, report);

console.log(
  `E2E journey coverage: ${journeyCoverage.toFixed(1)}% ` +
  `(${coveredJourneys.length}/${journeys.length})`
);

console.log(
  `E2E screen coverage: ${screenCoverage.toFixed(1)}% ` +
  `(${coveredScreens.length}/${screens.length})`
);

console.log(`Report: ${path.relative(root, reportPath)}`);

if (journeyCoverage < 80 || screenCoverage < 100) {
  process.exitCode = 1;
}
