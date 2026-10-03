# E11-US01 — Frais professionnels

| Champ                   | Valeur             |
| :---------------------- | :----------------- |
| Epic                    | E11                |
| Priorité de réalisation | 4                  |
| Besoin métier           | Complémentaire     |
| Dépend de               | E03-US01           |
| Parallèle avec          | E10-US01, E13-US01 |
| Parcours                | G                  |

En tant que salarié, je veux déclarer un frais professionnel qui n'est pas une note de frais, afin que l'entreprise le traite selon ses propres règles.

## Pourquoi cette priorité

Même rang que la note de frais : utile, distinct, et non nécessaire pour ouvrir le coffre. Les deux stories restent séparées et parallèles.

## Données

Une demande, pas une liste de dépenses. Type configuré par l'entreprise, période, description, commentaire, justificatif facultatif.

Deux modes de type :

| Mode          | Saisie du salarié                                 | Montant                                     |
| :------------ | :------------------------------------------------ | :------------------------------------------ |
| Montant saisi | le montant                                        | le montant saisi, supérieur à zéro          |
| Quantité      | une quantité et le libellé prévu par l'entreprise | quantité × montant unitaire de l'entreprise |

Le statut final est Traité. Le mot Remboursée n'apparaît pas.

## Sous-tâches

### E11-US01-ST01 — Configurer les types et le mode de montant

Dans Paramètres, l'employeur crée un type, son mode, et le montant unitaire si le mode est Quantité. Ce catalogue n'est pas celui des catégories de notes de frais. Un type déjà utilisé n'est pas supprimé.

Acceptation : un type de note de frais n'est pas proposé dans ce formulaire.

### E11-US01-ST02 — Créer la demande

Le salarié actif choisit le type, la période, la description et le commentaire. La période invalide répond `PERIODE_INVALIDE`. Le montant invalide répond `MONTANT_INVALIDE`. Le brouillon est invisible de l'employeur. Un salarié inactif reçoit `SALARIE_INACTIF`.

Acceptation : en mode Quantité, le salarié ne saisit pas le montant unitaire.

### E11-US01-ST03 — Soumettre

La demande passe à Soumis. Phrase : « Votre demande de frais professionnels a été soumise. » Notification `frais.soumis`. Un justificatif, s'il est joint, suit la règle des fichiers et reste sur la demande. Un second envoi ne duplique pas.

Acceptation : l'employeur voit une demande Soumis, pas une note de frais.

### E11-US01-ST04 — Traiter jusqu'à Traité

L'employeur prend la demande : Soumis devient En cours de traitement. Il peut demander un complément, notification `frais.information`, sans autre statut. Il valide (`frais.valide`) ou refuse (`frais.refuse`). Depuis Validé seulement, il passe à Traité, phrase « La demande de frais professionnels a été traitée. », notification `frais.traite`. Une mauvaise transition répond `DEMANDE_DEJA_TRAITEE`.

Acceptation : Traité est l'état final. Il n'existe pas d'étape Remboursée.

### E11-US01-ST05 — Garder la séparation avec les notes de frais

Les listes, les formulaires, les statuts et les indicateurs ne se mélangent pas. Une note n'apparaît pas dans Frais professionnels, et l'inverse non plus.

Acceptation : le total d'une note de frais ne change aucun indicateur de cette story.

### E11-US01-ST06 — Filtrer

Salarié : période et statut. Employeur : salarié, période, type, statut. État vide : « Vous n'avez aucune demande de frais professionnels. » et l'action Créer une demande s'il est actif.

Acceptation : le filtre statut propose les statuts de cette story seulement.

### E11-US01-ST07 — Notifier et historiser

Soumission, complément, validation, refus et passage à Traité sont historisés sans le vocabulaire du remboursement.

Acceptation : la phrase d'historique parle de frais professionnels.

## Indicateurs

`frais.a-traiter`, `frais.en-cours`.

## Hors périmètre

Notes de frais, virement, écriture comptable.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`.
