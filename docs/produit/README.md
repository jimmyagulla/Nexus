# Plateforme RH — coffre numérique salarié

Documentation métier du produit. Elle sert de source unique aux agents qui implémentent le backlog.

## Lire dans cet ordre

1. [Cahier des charges](cahier-des-charges/README.md) — intention, acteurs, domaines, parcours.
2. [Règles retenues](referentiels/regles-retenues.md) — choix qui ferment les points laissés ouverts par le cahier des charges.
3. Référentiels — contrats, statuts, permissions, navigation, notifications, indicateurs, messages.
4. [Backlog](backlog/README.md) — epics, user stories priorisées, sous-tâches, [suivi](backlog/suivi.md).

Le skill projet `next-task` prend la prochaine epic réalisable, la réserve dans le suivi, et la réalise. `/next-task story` prend une seule user story.

## Rôle de chaque niveau

| Niveau       | Rôle                                                        | Un agent l'utilise pour                             |
| :----------- | :---------------------------------------------------------- | :-------------------------------------------------- |
| Cahier       | Intention et périmètre produit                              | Comprendre pourquoi la story existe                 |
| Référentiels | Vocabulaire partagé entre stories parallèles                | Ne pas inventer un statut, un libellé ou un message |
| Epic         | Frontière du domaine et contrat commun à ses user stories   | Savoir ce qui ne doit pas être redéfini             |
| User story   | Unité d'implémentation autonome, avec une priorité de 1 à 5 | Réaliser le comportement de bout en bout            |
| Sous-tâche   | Comportement livrable à l'intérieur de la user story        | Découper le travail sans ouvrir une autre story     |

En cas d'écart, appliquer cet ordre :

1. La **user story** fixe le périmètre à réaliser.
2. Le **référentiel** fixe les statuts, permissions, libellés, messages et contrats partagés.
3. Le **cahier des charges** fixe l'intention.
4. Les **règles retenues** ferment une ambiguïté. Elles priment sur une lecture incomplète du cahier des charges.

## Ce que les agents développent

Chaque user story se développe entière, métier compris : données, règles, droits, statuts, erreurs, états vides, notifications, historique et indicateurs qui lui appartiennent.

Les user stories sans dépendance mutuelle se rejoignent par les [contrats partagés](referentiels/contrats-partages.md). Une story consomme un contrat dont elle n'est pas propriétaire. Elle ne le recrée pas.

Le technique n'est pas décrit ici. L'agent qui code applique les steering skills du dossier qu'il touche, puis les skills projet `hexagonal-slice`, `hexagonal-monorepo`, `tdd` et `skill-priority`.

## Maquettes

Les maquettes sont la référence visuelle lorsqu'elles sont fournies. Elles ne sont pas dans ce dépôt. Jusqu'à leur arrivée, les libellés et la navigation de cette documentation font foi pour l'expérience. Les données obligatoires, les droits et les workflows restent ceux de cette documentation même si une maquette est plus tard ajoutée.

## Priorité produit du cahier des charges

Le cahier des charges regroupe le produit en quatre grands niveaux. Le découpage de réalisation, lui, est porté par chaque user story.

| Niveau | Contenu                                                                                           |
| :----- | :------------------------------------------------------------------------------------------------ |
| 1      | Accès, entreprise, salariés, droits, coffre, documents, bulletins, tableaux de bord               |
| 2      | Présences, congés, heures supplémentaires, informations personnelles                              |
| 3      | Notes de frais, frais professionnels                                                              |
| 4      | Cabinet comptable, registre unique du personnel, notifications transverses, historique transverse |

## Priorité de réalisation des user stories

Chaque user story a une priorité de **1 à 5**. **1 est réalisé en premier.** Le chiffre exprime le besoin métier, pas la dépendance technique : une story de priorité 1 peut attendre qu'une autre story de priorité 1 existe.

| Valeur | Nom            | Besoin métier                                                                                           |
| :----- | :------------- | :------------------------------------------------------------------------------------------------------ |
| 1      | Critique       | Sans elle, l'entreprise ne peut pas ouvrir un espace salarié ni lui remettre un document ou un bulletin |
| 2      | Fort           | Nécessaire pour que le salarié utilise son espace dès la mise en service                                |
| 3      | Courant        | Gestion RH régulière                                                                                    |
| 4      | Complémentaire | Flux financier ou obligation administrative, après le coffre                                            |
| 5      | Périphérique   | Interlocuteur externe, non bloquant pour le cœur du produit                                             |

Les sous-tâches gardent la priorité de leur user story. Le détail et l'ordre de prise sont dans le [backlog](backlog/README.md).
