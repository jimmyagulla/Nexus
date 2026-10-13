# Suivi

La tâche exécutable est la user story. Les sous-tâches restent dans son fichier `.md`, dans l'ordre, pour le même agent.

Les stories d'un même lot se lancent ensemble. Un lot plus loin se lance aussi : le lot montre le parallèle, il ne bloque pas. `Dépend de`, dans la story, décrit l'intégration. Ce n'est pas un verrou.

Avant de créer le worktree, dans le clone principal, relire ce fichier. Passer la story nommée à `en cours` et remplir la branche. Une story `en cours` ou `terminée` ne se reprend pas. Écrire ce fichier seulement dans le clone principal, jamais depuis un worktree, et ne pas le committer avec le code de la story.

## Lot 1

| Id       | Story                               | Statut   | Branche             |
| :------- | :---------------------------------- | :------- | :------------------ |
| E01-US01 | Entreprise, périmètre et calendrier | terminée | next/e01-us01-socle |

## Lot 2

| Id       | Story                       | Statut   | Branche       |
| :------- | :-------------------------- | :------- | :------------ |
| E02-US01 | Comptes, connexion et rôles | en cours | next/e03-us01 |

## Lot 3

| Id       | Story                              | Statut   | Branche                               |
| :------- | :--------------------------------- | :------- | :------------------------------------ |
| E02-US02 | Double authentification du salarié | en cours | chat/e02-us02-double-authentification |
| E03-US01 | Fiche salarié                      | à faire  |                                       |

## Lot 4

| Id       | Story                  | Statut   | Branche                         |
| :------- | :--------------------- | :------- | :------------------------------ |
| E03-US02 | Activation de l'espace | en cours | chat/e03-us02-activation-espace |
| E04-US01 | Coffre employeur       | à faire  |                                 |

## Lot 5

| Id       | Story     | Statut   | Branche                 |
| :------- | :-------- | :------- | :---------------------- |
| E05-US01 | Bulletins | en cours | chat/e05-us01-bulletins |

## Lot 6

| Id       | Story                     | Statut   | Branche                         |
| :------- | :------------------------ | :------- | :------------------------------ |
| E02-US03 | Gestion des accès         | en cours | chat/e02-us03-gestion-des-acces |
| E04-US02 | Dépôt salarié             | à faire  |                                 |
| E12-US01 | Connexion cabinet         | à faire  |                                 |
| E14-US01 | Notifications             | à faire  |                                 |
| E16-US01 | Tableau de bord employeur | à faire  |                                 |
| E16-US02 | Tableau de bord salarié   | à faire  |                                 |

## Lot 7

| Id       | Story                     | Statut   | Branche                  |
| :------- | :------------------------ | :------- | :----------------------- |
| E06-US01 | Présences                 | en cours | chat/e06-us01-presences  |
| E07-US01 | Congés                    | à faire  |                          |
| E08-US01 | Heures supplémentaires    | à faire  |                          |
| E09-US01 | Informations personnelles | à faire  |                          |
| E15-US01 | Historique                | à faire  |                          |

## Lot 8

| Id       | Story                 | Statut   | Branche                      |
| :------- | :-------------------- | :------- | :--------------------------- |
| E10-US01 | Notes de frais        | en cours | chat/e10-us01-notes-de-frais |
| E11-US01 | Frais professionnels  | à faire  |                              |
| E13-US01 | Registre du personnel | à faire  |                              |

## Lot 9

| Id       | Story            | Statut   | Branche                         |
| :------- | :--------------- | :------- | :------------------------------ |
| E12-US02 | Échanges cabinet | en cours | chat/e12-us02-echanges-cabinet  |
