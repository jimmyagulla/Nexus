# E02-US02 — Double authentification du salarié

| Champ                   | Valeur   |
| :---------------------- | :------- |
| Epic                    | E02      |
| Priorité de réalisation | 1        |
| Besoin métier           | Critique |
| Dépend de               | E02-US01 |
| Parallèle avec          | E03-US01 |
| Parcours                | A        |

En tant que salarié, je veux prouver mon identité par un second facteur, afin que mon espace nominatif ne s'ouvre pas avec le seul mot de passe.

## Pourquoi cette priorité

Le cahier des charges ferme l'espace salarié tant que cette vérification n'est pas faite. Sans elle, le parcours d'ouverture du coffre personnel est incomplet.

## Règles

Le second facteur est un code issu de l'enrôlement, sans envoi par e-mail ni SMS. Des codes de récupération à usage unique sont montrés une seule fois. Employeur et cabinet ne passent pas par ce facteur.

## Sous-tâches

### E02-US02-ST01 — Enrôler le second facteur

Après le choix de son secret, le salarié enrôle le second facteur avant toute page de son espace. Il confirme avec un code valide. Tant que la confirmation échoue, l'enrôlement n'est pas terminé.

Acceptation : un code valide termine l'enrôlement. Un code invalide le laisse en cours.

### E02-US02-ST02 — Remettre les codes de récupération

À la confirmation, des codes de récupération à usage unique sont affichés une seule fois. Chaque code consommé ne fonctionne plus. Le salarié peut s'en servir à la place du code habituel.

Acceptation : le second affichage des codes n'a plus lieu. Un code déjà utilisé est refusé.

### E02-US02-ST03 — Vérifier à chaque connexion salarié

Le salarié saisit d'abord son identifiant et son secret, puis le second facteur, puis seulement son espace. L'ordre ne s'inverse pas.

Acceptation : le secret correct sans second facteur n'ouvre pas Mon espace.

### E02-US02-ST04 — Fermer l'espace tant que l'enrôlement manque

Un salarié Actif non enrôlé qui se connecte est conduit à l'enrôlement. Toute autre destination répond `SECOND_FACTEUR_REQUIS`.

Acceptation : aucune donnée personnelle n'est visible avant l'enrôlement réussi.

### E02-US02-ST05 — Laisser employeur et cabinet sans second facteur

La connexion employeur et la connexion cabinet s'arrêtent au secret. Cette story ne leur demande pas de code.

Acceptation : l'employeur entre dans son espace sans second facteur.

## Hors périmètre

Création de la fiche, invitation, contenus du coffre.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Le mécanisme du code reste un choix technique conforme au comportement décrit. Aucun envoi du code par e-mail ou SMS.
