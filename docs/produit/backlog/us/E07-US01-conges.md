# E07-US01 — Congés et absences

| Champ                   | Valeur                       |
| :---------------------- | :--------------------------- |
| Epic                    | E07                          |
| Priorité de réalisation | 3                            |
| Besoin métier           | Courant                      |
| Dépend de               | E01-US01, E03-US01           |
| Parallèle avec          | E06-US01, E08-US01, E09-US01 |
| Parcours                | D                            |

En tant que salarié, je veux demander un congé à partir de mon compteur, afin que l'employeur l'accepte ou le refuse et que mon solde suive le résultat.

## Pourquoi cette priorité

Le coffre n'a pas besoin des congés pour ouvrir. Les demandes font partie de la gestion RH régulière, au même rang que les présences et les heures.

## Compteur

| Ligne       | Calcul                                                      |
| :---------- | :---------------------------------------------------------- |
| Acquis      | Saisi par l'employeur, zéro au départ                       |
| Pris        | Somme des jours des demandes Acceptée des types décomptés   |
| En attente  | Somme des jours des demandes En attente des types décomptés |
| Disponibles | Acquis − pris − en attente                                  |

Types par défaut : Congés payés décompté, RTT non décompté, Absence exceptionnelle non décomptée, Autre non décomptée. L'arrêt maladie n'est pas un type.

Jours = début et fin inclus, hors jours non travaillés et hors fériés. Pas de demi-journée. Le salarié ne saisit pas le nombre.

## Sous-tâches

### E07-US01-ST01 — Configurer les types et le décompte

Dans Paramètres, l'employeur ajoute un type et choisit s'il décompte le solde. Il ne supprime pas un type déjà utilisé par une demande. Le calendrier de E01 est consommé, pas recopié.

Acceptation : un type non décompté n'apparaît pas dans le calcul du solde.

### E07-US01-ST02 — Saisir les jours acquis

L'employeur enregistre les jours acquis du salarié. La modification garde l'avant et l'après. Le salarié ne saisit pas les acquis.

Acceptation : le compteur disponible suit la nouvelle valeur.

### E07-US01-ST03 — Afficher le compteur

Le salarié voit acquis, pris, disponibles et en attente. L'employeur voit le même compteur sur la fiche.

Acceptation : une demande brouillon ne change pas le compteur.

### E07-US01-ST04 — Enregistrer un brouillon

Le salarié enregistre type, début, fin et commentaire facultatif. Le brouillon est invisible de l'employeur. Il peut l'annuler, statut Annulée.

Acceptation : l'employeur ne voit pas le brouillon dans sa liste.

### E07-US01-ST05 — Calculer les jours

Le nombre affiché suit le calendrier. Il est relu avant l'envoi. Zéro jour répond `CONGE_IMPOSSIBLE`. Une fin antérieure au début répond `PERIODE_INVALIDE`.

Acceptation : un samedi-dimanche seuls, avec le calendrier par défaut, donnent zéro jour et ne partent pas.

### E07-US01-ST06 — Envoyer la demande

L'envoi passe à En attente, affiche « Votre demande de congé a été envoyée. », augmente les jours en attente si le type est décompté, et notifie `conge.en-attente`. Un second envoi ne crée pas une seconde demande. Le salarié ne modifie plus les dates.

Acceptation : la demande est visible de l'employeur au statut En attente.

### E07-US01-ST07 — Refuser solde, chevauchement, période et inactif

Un type décompté dont les jours dépassent les disponibles répond `SOLDE_INSUFFISANT`. Un chevauchement avec une demande En attente ou Acceptée du même salarié répond `CONGE_IMPOSSIBLE`. Un salarié inactif répond `SALARIE_INACTIF`.

Acceptation : aucune de ces demandes n'atteint En attente.

### E07-US01-ST08 — Accepter

L'employeur accepte une demande En attente. Statut Acceptée, phrase « La demande de congé a été acceptée. », notification `conge.accepte`, fait d'absence publié, jours déplacés de en attente vers pris si le type est décompté. Toute autre décision sur cette demande répond `DEMANDE_DEJA_TRAITEE`.

Acceptation : le fait d'absence est disponible pour la présence du mois concerné.

### E07-US01-ST09 — Refuser

L'employeur refuse une demande En attente, avec un commentaire. Statut Refusée, phrase « La demande de congé a été refusée. », notification `conge.refuse`. Les jours en attente sont retirés. Aucun fait d'absence.

Acceptation : le disponible revient au niveau d'avant l'envoi pour un type décompté.

### E07-US01-ST10 — Demander et recevoir un complément

L'employeur pose une question sans changer le statut. Notification `conge.information`, action requise. Le salarié répond. Notification `conge.reponse` à l'employeur auteur. Le statut reste En attente.

Acceptation : la demande n'est ni acceptée ni refusée par la question.

### E07-US01-ST11 — Annuler

Le salarié annule une demande En attente : statut Annulée, jours en attente retirés, phrase `DEMANDE_ANNULEE` si quelqu'un agit encore dessus. L'employeur annule une demande Acceptée : le fait d'absence est retiré et les jours pris reviennent au disponible. Le salarié ne peut pas annuler une demande Acceptée.

Acceptation : après annulation d'une acceptation, la présence ne montre plus cette absence.

### E07-US01-ST12 — Filtrer

Salarié : période, type, statut, sur ses demandes. Employeur : salarié, période, type, statut.

Acceptation : le filtre salarié ne montre pas les demandes d'un collègue.

### E07-US01-ST13 — Afficher les états vides

Salarié : « Vous n'avez aucune demande de congé en cours. » et l'action Demander un congé s'il est actif. Employeur : « Aucune demande de congé à traiter. »

Acceptation : l'action est absente pour un salarié inactif.

### E07-US01-ST14 — Notifier et historiser

Chaque envoi, acceptation, refus, annulation et changement de compteur acquis écrit un audit. Phrase du type « Sophie Durand a envoyé une demande de congé. » puis « La demande de congé de Sophie Durand a été acceptée. »

Acceptation : l'historique distingue l'envoi et la décision.

## Indicateurs

`conges.disponibles`, `conges.en-cours`, `conges.en-attente`.

## Hors périmètre

Arrêt maladie documentaire, heures supplémentaires, calcul de paie.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`.
