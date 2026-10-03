# E02-US01 — Comptes, connexion et rôles

| Champ                   | Valeur                                         |
| :---------------------- | :--------------------------------------------- |
| Epic                    | E02                                            |
| Priorité de réalisation | 1                                              |
| Besoin métier           | Critique                                       |
| Dépend de               | E01-US01                                       |
| Parallèle avec          | aucune tant que le premier compte n'existe pas |
| Parcours                | A, pour la partie compte employeur             |

En tant qu'employeur, je veux un compte individuel rattaché à mon entreprise, afin d'accéder seulement à ce que mon rôle autorise.

## Pourquoi cette priorité

Le coffre et les bulletins ne peuvent pas être remis tant que personne ne peut se connecter dans le bon périmètre.

## Données

| Donnée      | Règle                                                                   |
| :---------- | :---------------------------------------------------------------------- |
| Identifiant | Unique dans l'entreprise, obligatoire                                   |
| Secret      | Choisi par la personne à l'activation, jamais inscrit dans l'invitation |
| Rôle        | Employeur, Salarié ou Cabinet comptable                                 |
| Statut      | Invité, Actif, Désactivé                                                |
| Entreprise  | Une seule                                                               |

Le compte salarié est créé par E03-US02. Le compte cabinet est créé par E12-US01. Cette story livre le compte employeur et les règles communes de connexion.

## Sous-tâches

### E02-US01-ST01 — Ouvrir l'entreprise et son premier employeur

La création de l'entreprise crée le premier compte Employeur au statut Invité. Il n'existe pas d'entreprise sans ce premier employeur, ni d'employeur sans entreprise.

Acceptation : après création, un seul employeur est rattaché, au statut Invité.

### E02-US01-ST02 — Choisir le secret à l'activation

La personne active son compte avec un moyen personnel à usage unique, choisit son secret, puis le compte passe à Actif. Le moyen déjà utilisé répond `INVITATION_INVALIDE`. L'invitation ne contient pas le secret définitif.

Acceptation : le secret choisi permet une connexion. L'ancien moyen d'activation ne le permet plus.

### E02-US01-ST03 — Se connecter

Un compte Actif se connecte avec son identifiant et son secret. Un compte Invité ou Désactivé ne se connecte pas. Un secret incorrect ne dit pas si l'identifiant existe.

Acceptation : le bon couple ouvre l'espace de l'entreprise. Un mauvais secret reste sur la connexion.

### E02-US01-ST04 — Attribuer le rôle

Le rôle est fixé à la création du compte et détermine l'espace : entreprise, salarié ou cabinet. Cette story n'ouvre que l'espace employeur. Elle refuse tout rôle hors des trois rôles du référentiel.

Acceptation : le premier compte arrive sur l'espace entreprise et ne voit pas l'espace salarié.

### E02-US01-ST05 — Bloquer après cinq échecs

Au cinquième secret incorrect consécutif, le compte ne peut plus se connecter. La phrase est `COMPTE_BLOQUE`. Une connexion réussie remet le compteur à zéro. Le déblocage par un employeur est E02-US03.

Acceptation : quatre échecs laissent encore essayer. Le cinquième bloque, même avec le bon secret ensuite.

### E02-US01-ST06 — Tracer la connexion

Chaque connexion réussie écrit un audit d'action `connexion` : qui, quand, entreprise.

Acceptation : le journal de cette connexion identifie l'employeur et le moment.

## Hors périmètre

Second facteur, invitation d'un autre employeur, fiche salarié.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Aucun statut, rôle, libellé ou message hors référentiels.
