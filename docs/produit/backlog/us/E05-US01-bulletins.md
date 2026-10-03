# E05-US01 — Publier et consulter les bulletins

| Champ                   | Valeur                                                            |
| :---------------------- | :---------------------------------------------------------------- |
| Epic                    | E05                                                               |
| Priorité de réalisation | 1                                                                 |
| Besoin métier           | Critique                                                          |
| Dépend de               | E04-US01                                                          |
| Parallèle avec          | les stories de priorité 2 déjà débloquées, jamais avant le coffre |
| Parcours                | C                                                                 |

En tant qu'employeur, je veux mettre un bulletin à disposition d'un salarié pour un mois donné, afin qu'il le retrouve par année et sache s'il l'a consulté.

## Pourquoi cette priorité

Le bulletin est, avec le contrat, la pièce que le coffre doit remettre. Le produit ne tient pas sa promesse sans ce classement.

## Données

| Information                | Règle                                             |
| :------------------------- | :------------------------------------------------ |
| Salarié                    | Obligatoire, de l'entreprise                      |
| Année                      | Obligatoire                                       |
| Mois                       | Obligatoire                                       |
| Date de mise à disposition | Moment de la publication                          |
| Document                   | Document de coffre, catégorie Bulletin de salaire |
| Consultation               | Non consulté, puis Consulté                       |

## Sous-tâches

### E05-US01-ST01 — Choisir le salarié, l'année et le mois

L'employeur sélectionne le salarié, l'année et le mois. Un champ manquant répond `INFORMATION_OBLIGATOIRE`. Le salarié ne fait pas cette sélection pour publier.

Acceptation : la période affichée est celle qui a été choisie, pas la date du jour imposée.

### E05-US01-ST02 — Joindre le document et publier

L'employeur importe le fichier et valide. Le bulletin est Non consulté. La phrase est « Le bulletin de salaire a été mis à disposition. » Le dépôt général du coffre ne propose pas cette catégorie.

Acceptation : le bulletin existe pour ce salarié et ce mois, avec un document de coffre rattaché.

### E05-US01-ST03 — Classer par année puis par mois

L'affichage groupe les années, de la plus récente à la plus ancienne, puis les mois dans le même sens. Exemple : 2026 septembre, août, juillet, puis 2025 décembre, novembre.

Acceptation : un bulletin de septembre 2026 apparaît sous 2026, avant août 2026.

### E05-US01-ST04 — Distinguer consulté et non consulté

Le salarié consulte et télécharge son bulletin. La première ouverture le passe à Consulté, ainsi que le document de coffre. L'employeur voit ce statut. Il ne le force pas à la main.

Acceptation : avant ouverture, le statut est Non consulté. Après ouverture, il reste Consulté.

### E05-US01-ST05 — Refuser un second bulletin sur la même période

Même salarié, même année, même mois : `BULLETIN_DOUBLON`. Le remplacement du fichier passe par le remplacement du document de coffre, pas par un second bulletin.

Acceptation : la seconde publication ne crée pas une seconde ligne.

### E05-US01-ST06 — Montrer le bulletin dans le coffre

Le bulletin apparaît dans Mes documents, catégorie Bulletin de salaire, avec les mêmes droits de consultation. Il reste aussi dans le classement par année.

Acceptation : le salarié le trouve par les deux entrées. Un autre salarié non.

### E05-US01-ST07 — Notifier le salarié

Publication : notification `bulletin.nouveau`. Audit d'ajout. Consultation : phrase du type « Jean Martin a consulté son bulletin de septembre. »

Acceptation : seul le salarié concerné est notifié.

### E05-US01-ST08 — Retrouver les bulletins par année

Le salarié filtre par année. L'employeur filtre par salarié et par année. État vide salarié : « Aucun bulletin de salaire n'est disponible pour le moment. » sans action de dépôt. État vide employeur : « Aucun bulletin de salaire n'a été publié. » avec Ajouter un bulletin.

Acceptation : l'année sans bulletin n'affiche pas ceux d'une autre année.

## Indicateur

`bulletin.dernier` : le plus récent par période.

## Hors périmètre

Calcul de la paie, génération du fichier de bulletin, présence.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Le document de coffre n'est pas redéfini.
