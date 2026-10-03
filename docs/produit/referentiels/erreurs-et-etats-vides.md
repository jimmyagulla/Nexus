# Messages et états vides

Les phrases ci-dessous sont affichées telles quelles. Pas de vocabulaire technique, pas de cause interne.

## Erreurs

| Identifiant               | Phrase                                                                     |
| :------------------------ | :------------------------------------------------------------------------- |
| `FICHIER_INVALIDE`        | Ce fichier ne peut pas être accepté. Vérifiez son format et réessayez.     |
| `DOCUMENT_MANQUANT`       | Ajoutez le document attendu avant de valider.                              |
| `INFORMATION_OBLIGATOIRE` | Renseignez les informations obligatoires.                                  |
| `DEMANDE_DEJA_TRAITEE`    | Cette demande a déjà été traitée.                                          |
| `CONGE_IMPOSSIBLE`        | Cette demande de congé n'est pas possible.                                 |
| `SOLDE_INSUFFISANT`       | Le solde de congés disponible est insuffisant.                             |
| `DOUBLON_POTENTIEL`       | Un élément semblable existe déjà.                                          |
| `NON_AUTORISE`            | Vous n'avez pas accès à cet élément.                                       |
| `DOCUMENT_INACCESSIBLE`   | Ce document n'est pas accessible.                                          |
| `TRANSMISSION_ECHOUEE`    | La transmission n'a pas abouti. Vous pouvez réessayer.                     |
| `DEMANDE_ANNULEE`         | Cette demande est annulée.                                                 |
| `SALARIE_INACTIF`         | Ce salarié est inactif. Cette action n'est plus possible.                  |
| `PERIODE_INVALIDE`        | La date de fin doit être postérieure ou égale à la date de début.          |
| `HEURES_INVALIDES`        | Indiquez un nombre d'heures supérieur à zéro.                              |
| `MONTANT_INVALIDE`        | Indiquez un montant supérieur à zéro.                                      |
| `TVA_INVALIDE`            | La TVA ne peut pas dépasser le montant.                                    |
| `BULLETIN_DOUBLON`        | Un bulletin existe déjà pour ce salarié sur cette période.                 |
| `COMPTE_BLOQUE`           | La connexion est bloquée. Un employeur doit rétablir l'accès.              |
| `SECOND_FACTEUR_REQUIS`   | La vérification complémentaire est nécessaire pour accéder à votre espace. |
| `INVITATION_INVALIDE`     | Ce lien d'activation n'est plus utilisable.                                |

## Confirmations

| Situation               | Phrase                                                    |
| :---------------------- | :-------------------------------------------------------- |
| Document remis          | Le document a été transmis.                               |
| Document salarié déposé | Votre document a été transmis à l'entreprise.             |
| Suppression de document | Confirmez-vous la suppression de ce document ?            |
| Bulletin publié         | Le bulletin de salaire a été mis à disposition.           |
| Congé envoyé            | Votre demande de congé a été envoyée.                     |
| Congé accepté           | La demande de congé a été acceptée.                       |
| Congé refusé            | La demande de congé a été refusée.                        |
| Heures envoyées         | Votre déclaration d'heures supplémentaires a été envoyée. |
| Note soumise            | Votre note de frais a été soumise.                        |
| Note remboursée         | La note de frais a été marquée comme remboursée.          |
| Frais soumis            | Votre demande de frais professionnels a été soumise.      |
| Frais traité            | La demande de frais professionnels a été traitée.         |
| Échange transmis        | Le document a été transmis au cabinet comptable.          |
| Activation              | Votre espace est ouvert.                                  |

## États vides

L'action n'apparaît que si l'acteur a le droit de la faire.

| Situation                          | Phrase                                                      | Action                  |
| :--------------------------------- | :---------------------------------------------------------- | :---------------------- |
| Aucun salarié                      | Aucun salarié n'est enregistré.                             | Créer un salarié        |
| Aucun document, salarié            | Aucun document n'est disponible dans votre espace.          | Déposer un document     |
| Aucun document, employeur          | Aucun document n'est disponible.                            | Ajouter un document     |
| Aucun bulletin, salarié            | Aucun bulletin de salaire n'est disponible pour le moment.  | aucune                  |
| Aucun bulletin, employeur          | Aucun bulletin de salaire n'a été publié.                   | Ajouter un bulletin     |
| Aucune présence                    | Aucun état de présence n'est disponible pour cette période. | aucune                  |
| Aucun congé, salarié               | Vous n'avez aucune demande de congé en cours.               | Demander un congé       |
| Aucun congé, employeur             | Aucune demande de congé à traiter.                          | aucune                  |
| Aucune heure, salarié              | Vous n'avez aucune déclaration d'heures supplémentaires.    | Déclarer                |
| Aucune note, salarié               | Vous n'avez encore soumis aucune note de frais.             | Créer une note de frais |
| Aucun frais professionnel, salarié | Vous n'avez aucune demande de frais professionnels.         | Créer une demande       |
| Aucun échange cabinet              | Aucun document n'a encore été échangé avec le cabinet.      | Nouveau document        |
| Aucune notification                | Vous n'avez aucune notification.                            | aucune                  |
| Historique vide                    | Aucune action n'a encore été enregistrée.                   | aucune                  |
| Registre vide                      | Le registre du personnel ne contient encore aucun salarié.  | Ajouter au registre     |

## Chargement

Toute liste et toute validation montrent un état d'attente. Pendant cet état, l'action ne peut pas être relancée.
