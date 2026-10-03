# Statuts

Seuls ces libellés existent. Une transition absente de ce fichier est interdite.

## Compte

| Statut    | Sens                                                          |
| :-------- | :------------------------------------------------------------ |
| Invité    | Le moyen d'activation a été remis, le compte n'est pas ouvert |
| Actif     | La personne peut se connecter                                 |
| Désactivé | La personne ne peut plus se connecter                         |

Transitions : Invité → Actif. Actif → Désactivé. Désactivé → Actif.

## Salarié

| Statut  | Sens                                         |
| :------ | :------------------------------------------- |
| Actif   | La fiche est ouverte aux nouvelles démarches |
| Inactif | La fiche est close aux nouvelles démarches   |

## Document de coffre

| Statut    | Sens                                                         |
| :-------- | :----------------------------------------------------------- |
| Brouillon | Visible du seul auteur, pas encore remis                     |
| Transmis  | Remis au destinataire, pas encore ouvert                     |
| Consulté  | Ouvert au moins une fois par le destinataire                 |
| Archivé   | Retiré des compteurs courants, encore consultable par filtre |

Transitions :

| De                   | Vers     | Qui                               |
| :------------------- | :------- | :-------------------------------- |
| Brouillon            | Transmis | Auteur qui remet                  |
| Transmis             | Consulté | Destinataire qui ouvre            |
| Transmis             | Archivé  | Employeur                         |
| Consulté             | Archivé  | Employeur                         |
| Transmis ou Consulté | Transmis | Employeur qui remplace le fichier |

La suppression retire le document des listes. Ce n'est pas un statut.

## Bulletin

Le bulletin porte en plus `Non consulté` ou `Consulté`.

`Non consulté` correspond au document Transmis. `Consulté` correspond au document Consulté. L'archivage du document retire le bulletin des compteurs courants.

## Congé

| Statut     | Sens                                         |
| :--------- | :------------------------------------------- |
| Brouillon  | Visible du seul salarié                      |
| En attente | Remis à l'employeur                          |
| Acceptée   | Absence publiée, compteur mis à jour         |
| Refusée    | Terminée sans absence                        |
| Annulée    | Terminée, effet retiré s'il avait été publié |

| De         | Vers       | Qui       |
| :--------- | :--------- | :-------- |
| Brouillon  | En attente | Salarié   |
| Brouillon  | Annulée    | Salarié   |
| En attente | Acceptée   | Employeur |
| En attente | Refusée    | Employeur |
| En attente | Annulée    | Salarié   |
| Acceptée   | Annulée    | Employeur |

Refusée et Annulée sont terminaux. Accepter ou refuser une demande qui n'est plus En attente est une demande déjà traitée.

## Heures supplémentaires

| Statut                   | Sens                                                 |
| :----------------------- | :--------------------------------------------------- |
| Brouillon                | Visible du seul salarié                              |
| En attente de validation | Remis à l'employeur                                  |
| Validée                  | Acceptée, pas encore rattachée à un mois de présence |
| Refusée                  | Terminée                                             |
| Traitée                  | Rattachée au mois de présence                        |

| De                       | Vers                     | Qui                                                      |
| :----------------------- | :----------------------- | :------------------------------------------------------- |
| Brouillon                | En attente de validation | Salarié                                                  |
| En attente de validation | Validée                  | Employeur, seulement si le mois de présence n'existe pas |
| En attente de validation | Traitée                  | Employeur, si le mois de présence existe                 |
| Validée                  | Traitée                  | Ouverture du mois de présence concerné                   |
| En attente de validation | Refusée                  | Employeur                                                |

Le brouillon peut être supprimé par le salarié. Refusée et Traitée sont terminaux.

## Note de frais

| Statut                 | Sens                               |
| :--------------------- | :--------------------------------- |
| Brouillon              | Visible du seul salarié            |
| Soumise                | Remise, pas encore prise en charge |
| En cours de validation | Prise en charge par l'employeur    |
| Validée                | Acceptée, pas encore remboursée    |
| Refusée                | Terminée sans remboursement        |
| Remboursée             | Remboursement intégral enregistré  |

| De                     | Vers                   | Qui                                  |
| :--------------------- | :--------------------- | :----------------------------------- |
| Brouillon              | Soumise                | Salarié                              |
| Soumise                | En cours de validation | Employeur qui commence le traitement |
| En cours de validation | Validée                | Employeur                            |
| En cours de validation | Refusée                | Employeur                            |
| Validée                | Remboursée             | Employeur                            |

## Frais professionnels

| Statut                 | Sens                             |
| :--------------------- | :------------------------------- |
| Brouillon              | Visible du seul salarié          |
| Soumis                 | Remis, pas encore pris en charge |
| En cours de traitement | Pris en charge                   |
| Validé                 | Accepté, pas encore soldé        |
| Refusé                 | Terminé                          |
| Traité                 | Soldé                            |

| De                     | Vers                   | Qui                    |
| :--------------------- | :--------------------- | :--------------------- |
| Brouillon              | Soumis                 | Salarié                |
| Soumis                 | En cours de traitement | Employeur qui commence |
| En cours de traitement | Validé                 | Employeur              |
| En cours de traitement | Refusé                 | Employeur              |
| Validé                 | Traité                 | Employeur              |

Les libellés Soumise et Soumis ne sont pas interchangeables. Les libellés Remboursée et Traité ne sont pas interchangeables.

## Échange cabinet

| Statut        | Sens                                               |
| :------------ | :------------------------------------------------- |
| Brouillon     | Visible du seul expéditeur                         |
| À transmettre | Prêt, pas encore envoyé                            |
| Transmis      | Envoyé                                             |
| Reçu          | Disponible chez le destinataire, pas encore ouvert |
| Consulté      | Ouvert par le destinataire                         |

| De            | Vers          | Qui                                              |
| :------------ | :------------ | :----------------------------------------------- |
| Brouillon     | À transmettre | Expéditeur                                       |
| À transmettre | Transmis      | Expéditeur                                       |
| Transmis      | Reçu          | Automatique dès que le destinataire peut le voir |
| Reçu          | Consulté      | Destinataire qui ouvre                           |

Un dépôt direct du cabinet entre au statut Transmis, puis Reçu pour l'entreprise.

## Connexion cabinet

| Statut             | Sens                                     |
| :----------------- | :--------------------------------------- |
| Invitation envoyée | Le cabinet n'a pas encore activé l'accès |
| Connecté           | L'accès est ouvert                       |
| Révoqué            | L'accès est fermé                        |

Transitions : Invitation envoyée → Connecté, Invitation envoyée → Révoqué, Connecté → Révoqué.
