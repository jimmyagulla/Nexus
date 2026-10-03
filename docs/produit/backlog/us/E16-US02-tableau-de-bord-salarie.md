# E16-US02 — Tableau de bord salarié

| Champ                   | Valeur                      |
| :---------------------- | :-------------------------- |
| Epic                    | E16                         |
| Priorité de réalisation | 2                           |
| Besoin métier           | Fort                        |
| Dépend de               | E02-US02                    |
| Parallèle avec          | E16-US01, E14-US01          |
| Parcours                | accueil de l'espace salarié |

En tant que salarié, je veux voir ma situation et les actions qui me concernent, afin d'ouvrir chaque fonction de mon espace.

## Pourquoi cette priorité

L'espace personnel est promis dès la mise en service. Son accueil vient juste après l'ouverture du compte. Il ne remplace pas le coffre : il y mène.

## Sous-tâches

### E16-US02-ST01 — Afficher la synthèse

Mon espace montre les indicateurs salarié : documents disponibles et nouveaux, dernier bulletin, compteur de congés et demandes en cours, compteur d'heures et demandes en attente, notes de frais et montant en cours, frais professionnels en cours. Les valeurs viennent des stories sources.

Acceptation : le dernier bulletin affiché est `bulletin.dernier`, pas un document d'une autre catégorie.

### E16-US02-ST02 — Lister les actions requises

Le bloc Actions reprend `actions.requises` : notifications non lues marquées action requise. Chaque ligne ouvre la cible. S'il n'y en a pas, le bloc le dit sans inventer une action.

Acceptation : une demande d'information sur un congé apparaît ici tant qu'elle n'est pas lue.

### E16-US02-ST03 — Ouvrir chaque fonction

Chaque indicateur ouvre l'entrée de navigation correspondante, filtrée sur le salarié connecté. Les libellés sont ceux du référentiel : Mes documents, Mes bulletins de salaire, Mes présences, Mes congés & absences, Mes heures supplémentaires, Mes notes de frais, Mes frais professionnels, Mes informations.

Acceptation : le salarié n'arrive jamais sur la liste d'un autre salarié.

### E16-US02-ST04 — Réserver l'écran au salarié après second facteur

L'écran n'est visible qu'après la connexion salarié et le second facteur. L'employeur ne le voit pas en prenant la place du salarié. Un module source absent montre son état vide, pas un chiffre de remplacement.

Acceptation : un salarié non enrôlé n'atteint pas Mon espace.

## Hors périmètre

Dépôt, publication, validation. Ces actions restent dans leurs stories.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Assembler les indicateurs sans réécrire leur règle.
