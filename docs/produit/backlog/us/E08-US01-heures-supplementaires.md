# E08-US01 — Heures supplémentaires

| Champ                   | Valeur                       |
| :---------------------- | :--------------------------- |
| Epic                    | E08                          |
| Priorité de réalisation | 3                            |
| Besoin métier           | Courant                      |
| Dépend de               | E03-US01                     |
| Parallèle avec          | E06-US01, E07-US01, E09-US01 |
| Parcours                | E                            |

En tant que salarié, je veux déclarer des heures supplémentaires, afin que l'employeur les valide et qu'elles entrent dans ma présence.

## Pourquoi cette priorité

Les heures complètent la gestion RH régulière. Elles ne conditionnent ni le coffre ni le bulletin déjà publié.

## Données

Date obligatoire, nombre d'heures supérieur à zéro avec au plus deux décimales, commentaire facultatif, justificatif facultatif attaché à la déclaration. Pas de montant.

## Sous-tâches

### E08-US01-ST01 — Enregistrer un brouillon

Le salarié enregistre la déclaration en Brouillon. Elle est invisible de l'employeur. Il peut la supprimer. La suppression est historisée et retire la déclaration, sans statut supplémentaire.

Acceptation : l'employeur ne voit pas le brouillon.

### E08-US01-ST02 — Contrôler la date, les heures et le justificatif

La date est obligatoire. Les heures nulles ou négatives répondent `HEURES_INVALIDES`. Un justificatif joint suit la règle des fichiers, sinon `FICHIER_INVALIDE`. Il n'entre pas dans le coffre.

Acceptation : une déclaration sans justificatif reste envoyable.

### E08-US01-ST03 — Envoyer

L'envoi passe à En attente de validation, affiche « Votre déclaration d'heures supplémentaires a été envoyée. » et notifie `heures.en-attente`. Un second envoi ne duplique pas. Un salarié inactif reçoit `SALARIE_INACTIF`.

Acceptation : l'employeur voit la déclaration en attente.

### E08-US01-ST04 — Valider et rattacher au mois

Si le mois de présence existe, l'employeur valide et le statut devient Traitée. Sinon il devient Validée, et passera à Traitée à l'ouverture du mois par E06. Dans les deux cas, le fait d'heures est publié et le salarié reçoit `heures.validees`.

Acceptation : les heures validées sont lisibles dans la présence quand le mois existe.

### E08-US01-ST05 — Refuser

L'employeur refuse une déclaration en attente. Statut Refusée, notification `heures.refusees`, pas de fait d'heures. Une décision sur une déclaration déjà tranchée répond `DEMANDE_DEJA_TRAITEE`.

Acceptation : la présence ne gagne aucune heure.

### E08-US01-ST06 — Interdire le retrait après envoi

Le salarié ne supprime plus une déclaration En attente, Validée, Refusée ou Traitée. Il peut seulement la consulter.

Acceptation : l'action de suppression est absente après l'envoi.

### E08-US01-ST07 — Filtrer

Salarié : période et statut, sur ses déclarations. Employeur : salarié, période, statut. État vide : « Vous n'avez aucune déclaration d'heures supplémentaires. » et l'action Déclarer s'il est actif.

Acceptation : le filtre ne montre pas les déclarations d'un autre salarié.

### E08-US01-ST08 — Notifier et historiser

Envoi, validation, refus et passage à Traitée sont historisés avec l'acteur, la date et le nombre d'heures.

Acceptation : le journal distingue la validation et le rattachement au mois quand ils ne sont pas simultanés.

## Indicateurs

`heures.compteur`, `heures.en-attente`, `heures.a-valider`.

## Hors périmètre

Congés, note de frais, montant ou majoration.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`.
