# Contrats partagés

Une user story propriétaire écrit le contrat. Les autres le consomment. Personne ne crée un second objet pour la même réalité.

| Contrat             | Propriétaire         | Contenu minimum                                                                                                | Consommé par                       |
| :------------------ | :------------------- | :------------------------------------------------------------------------------------------------------------- | :--------------------------------- |
| Entreprise          | E01-US01             | Identité, calendrier, isolement                                                                                | Toutes                             |
| Compte              | E02-US01             | Utilisateur, rôle, statut de compte, entreprise                                                                | E02-US02, E02-US03, E03-US02       |
| Second facteur      | E02-US02             | Enrôlement salarié obligatoire                                                                                 | E03-US02                           |
| Fiche salarié       | E03-US01             | Identité, statut Actif ou Inactif, entreprise                                                                  | Toutes les stories salarié         |
| Document de coffre  | E04-US01             | Fichier contextualisé rattaché à un salarié                                                                    | E04-US02, E05-US01                 |
| Bulletin            | E05-US01             | Période, document de coffre, consulté ou non                                                                   | E16                                |
| Fait d'absence      | E07-US01             | Salarié, début, fin, type, jours, demande source. Présent seulement si le congé est Accepté. Retiré si Annulé. | E06-US01                           |
| Fait d'heures       | E08-US01             | Salarié, date, heures, déclaration source. Présent si Validée ou Traitée.                                      | E06-US01                           |
| Présence            | E06-US01             | Mois civil par salarié                                                                                         | E08-US01 pour le passage à Traitée |
| Note de frais       | E10-US01             | Note et dépenses                                                                                               | E16                                |
| Frais professionnel | E11-US01             | Demande distincte de la note de frais                                                                          | E16                                |
| Connexion cabinet   | E12-US01             | Invitation, connexion, révocation                                                                              | E12-US02                           |
| Échange cabinet     | E12-US02             | Document d'échange, sens, statut. Distinct du coffre.                                                          | E16                                |
| Registre            | E13-US01             | Champs réglementaires cohérents avec la fiche                                                                  | E03-US01 pour les champs communs   |
| Notification        | E14-US01             | Type du catalogue, destinataire, cible, lue ou non                                                             | Toutes les stories qui notifient   |
| Audit               | E15-US01             | Qui, quoi, quand, avant/après, phrase lisible                                                                  | Toutes les stories qui tracent     |
| Indicateur          | E16-US01 et E16-US02 | Valeur publiée par le module source, affichée sans recalcul                                                    | Modules sources                    |

## Règles de consommation

- Toute donnée métier porte l'entreprise du contrat Entreprise.
- Un module qui a besoin d'un salarié référence la fiche. Il ne crée pas une autre fiche.
- Le bulletin référence un document de coffre de catégorie Bulletin de salaire.
- L'échange cabinet ne référence pas un document de coffre.
- Le justificatif d'une demande d'heures ou de frais n'est pas un document de coffre.
- La story source publie le fait. La story consommatrice l'affiche. Elle ne change pas le statut de la demande source, sauf le passage Validée → Traitée décrit dans E08-US01.
- Notification et audit ont un propriétaire d'écran. Le fait est néanmoins créé par la story qui déclenche l'événement, avec la forme de ce contrat.

## Forme d'un fait de notification

Type du [catalogue](notifications.md), destinataire, entreprise, objet cible, date, lu ou non lu.

## Forme d'un fait d'audit

Date, acteur, entreprise, action, objet, phrase lisible en français, avant et après si une valeur change.

Actions autorisées : connexion, ajout d'un document, téléchargement, modification d'une information, dépôt d'un document, validation, refus, transmission, suppression, modification d'un statut.

## Forme d'un indicateur

Identifiant du [catalogue](indicateurs.md), entreprise, salarié si l'indicateur est personnel, valeur. Le tableau de bord ouvre la cible déjà filtrée. Il ne réapplique pas la règle métier.
