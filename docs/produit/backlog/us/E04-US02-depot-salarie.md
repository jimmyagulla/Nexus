# E04-US02 — Dépôt de documents par le salarié

| Champ                   | Valeur             |
| :---------------------- | :----------------- |
| Epic                    | E04                |
| Priorité de réalisation | 2                  |
| Besoin métier           | Fort               |
| Dépend de               | E04-US01           |
| Parallèle avec          | E14-US01, E16-US02 |
| Parcours                | H                  |

En tant que salarié, je veux transmettre un arrêt maladie à mon entreprise, afin qu'il soit disponible pour les personnes autorisées et qu'il reste dans l'historique.

## Pourquoi cette priorité

L'entreprise peut déjà remettre des documents sans ce dépôt. Le recevoir du salarié est attendu dès la mise en service, juste après le coffre employeur.

## Sous-tâches

### E04-US02-ST01 — Choisir Déposer un document

Depuis Mes documents, le salarié actif lance le dépôt. Le salarié inactif voit l'action refusée par `SALARIE_INACTIF`.

Acceptation : l'action est absente ou refusée pour un compte qui n'est pas un salarié actif.

### E04-US02-ST02 — Choisir la catégorie

Catégories : Arrêt maladie, Justificatif, Document administratif, Autre document demandé. Si une demande `document.a-completer` a ouvert l'écran, la catégorie est préchoisie. Le salarié ne choisit pas une catégorie employeur.

Acceptation : Contrat de travail n'est pas proposé.

### E04-US02-ST03 — Joindre le fichier et un commentaire

Le fichier est obligatoire et suit la règle des formats. Le commentaire est facultatif. Les manques répondent `DOCUMENT_MANQUANT`, `FICHIER_INVALIDE` ou `INFORMATION_OBLIGATOIRE`.

Acceptation : un commentaire seul, sans fichier, n'est pas transmissible.

### E04-US02-ST04 — Confirmer l'envoi

Valider passe le document à Transmis, affiche « Votre document a été transmis à l'entreprise. » et n'accepte pas un second envoi identique.

Acceptation : un double clic laisse un seul document.

### E04-US02-ST05 — Rendre le document visible à l'employeur

Le document apparaît pour les employeurs de l'entreprise, rattaché au salarié, avec son auteur. Il alimente `documents.a-traiter` tant qu'il est Transmis. Les autres salariés ne le voient pas.

Acceptation : l'employeur ouvre le document. Un autre salarié reçoit `DOCUMENT_INACCESSIBLE`.

### E04-US02-ST06 — Refuser le dépôt d'un salarié inactif

Même si l'écran était encore ouvert, la validation d'un salarié devenu inactif répond `SALARIE_INACTIF` et ne crée rien.

Acceptation : aucun document nouveau n'est visible côté entreprise.

### E04-US02-ST07 — Historiser le dépôt

Audit de dépôt, phrase du type « 03/10/2026 — Marie Dupont a déposé un arrêt maladie. » Notification employeur `document.depose`. Si le document répond à une demande de pièce, l'action requise correspondante est soldée.

Acceptation : l'historique identifie qui, quoi et quand.

## Hors périmètre

Remplacement et suppression par le salarié, classement des bulletins.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Le document créé respecte le contrat de E04-US01.
