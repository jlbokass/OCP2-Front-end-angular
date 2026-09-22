# Rapport de couverture E2E

## Méthode

Cette mesure est une couverture fonctionnelle des parcours, distincte du taux de réussite des tests Cypress.

Formule :

```text
parcours requis couverts / parcours requis × 100
```

La couverture des écrans est mesurée séparément.

## Parcours

| ID | Parcours | Spec | Couvert |
|---|---|---|---|
| E2E-01 | Homepage | cypress/e2e/01-home.cy.ts | Oui |
| E2E-02 | Inscription valide | cypress/e2e/02-register.cy.ts | Oui |
| E2E-03 | Validation du formulaire inscription | cypress/e2e/02-register.cy.ts | Oui |
| E2E-04 | Connexion valide | cypress/e2e/03-login.cy.ts | Oui |
| E2E-05 | Connexion invalide | cypress/e2e/03-login.cy.ts | Oui |
| E2E-06 | Accès protégé sans session | cypress/e2e/04-students.cy.ts | Oui |
| E2E-07 | Liste des étudiants | cypress/e2e/04-students.cy.ts | Oui |
| E2E-08 | Création étudiant | cypress/e2e/04-students.cy.ts | Oui |
| E2E-09 | Détail étudiant | cypress/e2e/04-students.cy.ts | Oui |
| E2E-10 | Modification étudiant | cypress/e2e/04-students.cy.ts | Oui |
| E2E-11 | Suppression étudiant | cypress/e2e/04-students.cy.ts | Oui |

```text
Parcours couverts : 11 / 11
Couverture E2E    : 100.0 %
Seuil requis      : 80 %
```

## Écrans

| Écran | Spec | Couvert |
|---|---|---|
| `/` | cypress/e2e/01-home.cy.ts | Oui |
| `/register` | cypress/e2e/02-register.cy.ts | Oui |
| `/login` | cypress/e2e/03-login.cy.ts | Oui |
| `/students` | cypress/e2e/04-students.cy.ts | Oui |
| `/students/new` | cypress/e2e/04-students.cy.ts | Oui |
| `/students/:id` | cypress/e2e/04-students.cy.ts | Oui |
| `/students/:id/edit` | cypress/e2e/04-students.cy.ts | Oui |

```text
Écrans couverts : 7 / 7
Couverture écrans : 100.0 %
Objectif           : 100 %
```

## Interprétation

Ce rapport vérifie que les parcours et écrans prévus sont représentés dans la suite Cypress.

Le résultat d'exécution Cypress reste une preuve séparée : tous les scénarios implémentés doivent également réussir.
