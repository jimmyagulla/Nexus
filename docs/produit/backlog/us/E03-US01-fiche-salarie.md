# E03-US01 — Fiche salarié et cycle de vie

| Champ                   | Valeur              |
| :---------------------- | :------------------ |
| Epic                    | E03                 |
| Priorité de réalisation | 1                   |
| Besoin métier           | Critique            |
| Dépend de               | E02-US01            |
| Parallèle avec          | E02-US02            |
| Parcours                | A, jusqu'à la fiche |

En tant qu'employeur, je veux créer et tenir la fiche d'un salarié, afin de lui rattacher ensuite un espace et des documents.

## Pourquoi cette priorité

Le coffre est nominatif. Sans fiche, il n'y a personne à qui remettre un contrat ou un bulletin.

## Données

| Champ             | Obligatoire               | Qui le modifie                                                              |
| :---------------- | :------------------------ | :-------------------------------------------------------------------------- |
| Prénom            | oui                       | Employeur                                                                   |
| Nom               | oui                       | Employeur                                                                   |
| Photo             | non                       | Employeur                                                                   |
| Poste             | oui                       | Employeur                                                                   |
| Service           | non                       | Employeur                                                                   |
| Type de contrat   | oui                       | Employeur, liste configurable, défaut CDI, CDD, Apprentissage, Stage, Autre |
| Date d'entrée     | oui                       | Employeur                                                                   |
| Date de sortie    | oui si la fiche est close | Employeur                                                                   |
| Statut            | oui                       | Actif ou Inactif, selon la clôture                                          |
| Coordonnées       | non                       | Affichées ici, régime d'édition en E09-US01                                 |
| Dernière activité | non                       | Non saisissable                                                             |

La liste montre au minimum ces champs. Sans activité : « Jamais connecté ».

## Sous-tâches

### E03-US01-ST01 — Créer la fiche

L'employeur crée un salarié Actif de son entreprise. Les champs obligatoires manquants répondent `INFORMATION_OBLIGATOIRE`. La création n'ouvre pas encore le compte : c'est E03-US02.

Acceptation : le salarié apparaît dans la liste, statut Actif, dernière activité « Jamais connecté ».

### E03-US01-ST02 — Afficher la liste

La liste de l'entreprise montre chaque fiche avec les colonnes minimales. Elle est triée par nom puis prénom. Une entreprise sans salarié montre « Aucun salarié n'est enregistré. » et l'action Créer un salarié.

Acceptation : un salarié d'une autre entreprise n'apparaît pas.

### E03-US01-ST03 — Filtrer et rechercher

Filtres : nom, prénom, poste, service, statut, type de contrat. Le filtre ne renvoie que l'entreprise courante.

Acceptation : un filtre Inactif masque les fiches Actif.

### E03-US01-ST04 — Modifier les informations employeur

L'employeur modifie les champs dont il a la charge. Chaque modification est historisée avec avant et après. Le salarié ne modifie pas ces champs dans cette story.

Acceptation : changer le poste garde l'ancien poste dans l'historique.

### E03-US01-ST05 — Clôturer et réactiver

Renseigner une date de sortie aujourd'hui ou passée passe la fiche à Inactif. Une date future laisse Actif jusqu'à cette date, puis Inactif. Retirer la date de sortie repasse la fiche à Actif. Les deux changements sont historisés.

Acceptation : un salarié dont la sortie est demain reste Actif aujourd'hui.

### E03-US01-ST06 — Afficher la dernière activité

La date avance à chaque connexion réussie du salarié et à chaque action métier qu'il réalise. L'employeur ne la saisit pas.

Acceptation : avant la première connexion, le libellé reste « Jamais connecté ».

### E03-US01-ST07 — Déposer la photo

L'employeur ajoute ou retire une photo. Les formats suivent la règle des fichiers. Le salarié ne change pas sa photo.

Acceptation : sans photo, la liste reste lisible. Un fichier refusé répond `FICHIER_INVALIDE`.

### E03-US01-ST08 — Présenter les entrées vers les modules

La fiche propose les entrées du référentiel navigation dont la colonne « fiche salarié » est oui. Cette story ne réalise pas les modules cibles. L'entrée mène au module filtré sur ce salarié lorsque le module existe.

Acceptation : les libellés sont ceux du référentiel, sans synonyme.

### E03-US01-ST09 — Refuser l'ouverture de session à la place du salarié

Aucune action de la fiche ne connecte l'employeur comme le salarié. L'employeur reste dans l'espace entreprise.

Acceptation : après avoir ouvert une fiche, l'acteur est toujours l'employeur.

## Indicateurs

`salaries.total`, `salaries.nouveaux`, `salaries.departs`.

## Hors périmètre

Activation du compte, coffre, registre réglementaire complet.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`.
