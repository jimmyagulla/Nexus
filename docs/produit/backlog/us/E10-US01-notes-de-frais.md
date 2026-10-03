# E10-US01 — Notes de frais

| Champ                   | Valeur             |
| :---------------------- | :----------------- |
| Epic                    | E10                |
| Priorité de réalisation | 4                  |
| Besoin métier           | Complémentaire     |
| Dépend de               | E03-US01           |
| Parallèle avec          | E11-US01, E13-US01 |
| Parcours                | F                  |

En tant que salarié, je veux regrouper plusieurs dépenses dans une note de frais, afin que l'entreprise les valide puis enregistre leur remboursement.

## Pourquoi cette priorité

Le remboursement est un besoin réel, mais il vient après le coffre et la gestion RH courante. Le produit reste un coffre salarié utile sans cette story.

## Données

Une note a un libellé, un salarié, un statut et des dépenses. Une dépense a une date, une catégorie configurable, un montant en euros supérieur à zéro, une TVA facultative au plus égale au montant, un moyen de paiement, une description, un client, un projet ou un service, et un justificatif facultatif.

Le total est la somme des montants. Au moins un justificatif est présent sur la note au moment de la soumission. Les justificatifs restent sur la note.

Catégories de départ : Restaurant, Parking, Train, Autre. L'entreprise en ajoute dans Paramètres.

## Sous-tâches

### E10-US01-ST01 — Créer une note et ses dépenses

Le salarié actif crée une note en Brouillon et y ajoute une ou plusieurs dépenses. Une note sans dépense ne se soumet pas. Un montant nul répond `MONTANT_INVALIDE`. Une TVA supérieure au montant répond `TVA_INVALIDE`. Un salarié inactif reçoit `SALARIE_INACTIF`.

Acceptation : l'exemple Restaurant 45 €, Parking 12 €, Train 68 € constitue une note de trois dépenses.

### E10-US01-ST02 — Calculer le total

Le total affiché est la somme des montants, ici 125 €. Le salarié ne saisit pas le total. Il est recalculé à chaque ajout, modification ou retrait de dépense en brouillon.

Acceptation : retirer le train fait passer le total à 57 €.

### E10-US01-ST03 — Exiger un justificatif pour soumettre

La soumission sans aucun justificatif répond `DOCUMENT_MANQUANT`. Un fichier invalide répond `FICHIER_INVALIDE`. Le brouillon peut exister sans justificatif.

Acceptation : la note reste Brouillon tant que le justificatif manque.

### E10-US01-ST04 — Soumettre

La note passe à Soumise. Phrase : « Votre note de frais a été soumise. » Notification `note.soumise`. Le salarié ne modifie plus les dépenses. Un second envoi ne crée pas une seconde note.

Acceptation : l'employeur voit la note et ses justificatifs.

### E10-US01-ST05 — Traiter la note

L'employeur ouvre la note : elle passe de Soumise à En cours de validation. Il peut demander un complément sans autre changement de statut, notification `note.information`. Il valide ou refuse depuis En cours de validation. Valider notifie `note.validee`. Refuser notifie `note.refusee`. Une décision hors de ce statut répond `DEMANDE_DEJA_TRAITEE`.

Acceptation : une note seulement Soumise n'est pas remboursable tant qu'elle n'est pas Validée.

### E10-US01-ST06 — Rembourser intégralement

Depuis Validée, l'employeur enregistre le remboursement intégral. Statut Remboursée, phrase « La note de frais a été marquée comme remboursée. », notification `note.remboursee`. Pas de remboursement partiel. Pas de remboursement depuis un autre statut.

Acceptation : le montant remboursé est le total de la note.

### E10-US01-ST07 — Filtrer

Salarié : période, statut, sur ses notes. Employeur : salarié, période, montant, statut. État vide salarié : « Vous n'avez encore soumis aucune note de frais. » et l'action Créer une note de frais s'il est actif.

Acceptation : le montant filtré ne mélange pas les notes d'un autre salarié.

### E10-US01-ST08 — Notifier et historiser

Soumission, complément, validation, refus et remboursement sont historisés : qui, quoi, quand, total.

Acceptation : le journal ne qualifie pas cette note de frais professionnel.

## Indicateurs

`notes.a-traiter`, `notes.montant-attente`, `notes.en-cours`, `notes.montant-en-cours`.

## Hors périmètre

Frais professionnels, écriture comptable, virement.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Ne pas réutiliser les statuts de E11.
