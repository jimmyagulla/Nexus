# E12-US02 — Échanges de documents avec le cabinet

| Champ                   | Valeur                         |
| :---------------------- | :----------------------------- |
| Epic                    | E12                            |
| Priorité de réalisation | 5                              |
| Besoin métier           | Périphérique                   |
| Dépend de               | E12-US01                       |
| Parallèle avec          | aucune, elle suit la connexion |
| Parcours                | I                              |

En tant qu'employeur, je veux transmettre un document à mon cabinet et recevoir les siens, afin de suivre chaque envoi sans ouvrir le coffre des salariés.

## Pourquoi cette priorité

Même besoin périphérique que la connexion. L'échange n'a pas de sens tant que le cabinet n'est pas relié, et il reste après tout le cœur RH.

## Échange

Document, expéditeur, destinataire, date, catégorie d'échange configurable, sens, statut, historique. Ce document n'est pas un document de coffre.

Sens : Entreprise vers cabinet, ou Cabinet vers entreprise.

## Sous-tâches

### E12-US02-ST01 — Préparer et transmettre

L'employeur crée un Brouillon, le marque À transmettre, joint le fichier, choisit la catégorie, puis transmet. Le statut devient Transmis, puis Reçu dès que le cabinet connecté peut le voir. Phrase : « Le document a été transmis au cabinet comptable. » Un fichier invalide répond `FICHIER_INVALIDE`. Un échec répond `TRANSMISSION_ECHOUEE` et laisse l'échange À transmettre.

Acceptation : le cabinet ne voit pas le brouillon ni l'échange encore À transmettre.

### E12-US02-ST02 — Recevoir côté cabinet

Le cabinet voit les échanges dont il est destinataire. Il consulte et télécharge. La première ouverture passe de Reçu à Consulté. Il ne voit pas les échanges d'une autre entreprise.

Acceptation : un document non destiné à ce cabinet répond `DOCUMENT_INACCESSIBLE`.

### E12-US02-ST03 — Déposer une réponse du cabinet

Le cabinet dépose un document vers l'entreprise. L'échange naît Transmis puis Reçu pour l'employeur. L'entreprise est notifiée. Le cabinet révoqué ne dépose plus.

Acceptation : l'employeur voit le sens Cabinet vers entreprise.

### E12-US02-ST04 — Faire évoluer les statuts

Les seules transitions sont celles du référentiel échange. Brouillon, À transmettre, Transmis, Reçu, Consulté. Aucun statut du coffre RH n'est réutilisé.

Acceptation : un échange n'est jamais Archivé ni Remboursé.

### E12-US02-ST05 — Consulter l'historique de l'échange

Chaque transmission, réception et consultation est lisible : qui, quoi, quand. Une transmission groupée peut se lire « 5 documents ont été transmis au cabinet comptable. »

Acceptation : l'historique d'un échange ne contient pas les consultations de bulletins.

### E12-US02-ST06 — Empêcher l'accès au coffre RH

Aucun échange ne donne au cabinet un document du coffre salarié, un bulletin, une fiche ou une note de frais. Transmettre un fichier au cabinet en crée une copie d'échange, sans droit de parcours dans le coffre.

Acceptation : depuis un échange, le cabinet n'ouvre pas la fiche du salarié cité dans un nom de fichier.

### E12-US02-ST07 — Filtrer

Filtres : type de document, date, sens de transmission, statut. État vide : « Aucun document n'a encore été échangé avec le cabinet. » L'employeur a l'action Nouveau document. Le cabinet a l'action Déposer un document.

Acceptation : le sens filtré ne mélange pas les deux directions.

### E12-US02-ST08 — Notifier

Quand l'échange devient Reçu, le destinataire reçoit `cabinet.document.recu`. L'ouvrir mène à cet échange.

Acceptation : le salarié ne reçoit pas cette notification.

## Indicateurs

`cabinet.a-transmettre`, `cabinet.recus`, `cabinet.non-consultes`.

## Hors périmètre

Invitation et révocation, déjà portées par E12-US01. Tenue comptable.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Ne pas réutiliser le document de coffre.
