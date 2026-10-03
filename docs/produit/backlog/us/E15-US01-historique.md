# E15-US01 — Historique transverse

| Champ                   | Valeur                            |
| :---------------------- | :-------------------------------- |
| Epic                    | E15                               |
| Priorité de réalisation | 3                                 |
| Besoin métier           | Courant                           |
| Dépend de               | E02-US01                          |
| Parallèle avec          | E06-US01, E07-US01                |
| Parcours                | relecture des actions importantes |

En tant qu'employeur, je veux relire les actions importantes de mon entreprise, afin de savoir qui a fait quoi, et quelle valeur a changé.

## Pourquoi cette priorité

Chaque story critique écrit déjà ses traces. L'écran qui les rassemble sert la gestion courante, une fois que les actions existent. Il ne bloque pas le premier dépôt.

## Sous-tâches

### E15-US01-ST01 — Afficher le journal employeur

L'entrée Historique liste les audits de l'entreprise, du plus récent au plus ancien. Chaque ligne identifie qui, quoi et quand, dans une phrase française. Exemples du cahier des charges : dépôt d'un arrêt, consultation d'un bulletin, envoi puis acceptation d'un congé, transmission groupée au cabinet.

Acceptation : une action d'une autre entreprise n'apparaît pas.

### E15-US01-ST02 — Filtrer

Filtres : salarié concerné, acteur, action, période. Le filtre action utilise les actions du contrat d'audit, pas des synonymes.

Acceptation : filtrer sur un salarié masque les actions qui ne le concernent pas.

### E15-US01-ST03 — Montrer le avant/après

Quand le fait porte une ancienne et une nouvelle valeur, la ligne les montre. Une consultation sans changement de valeur n'invente pas de avant/après.

Acceptation : la modification d'une adresse montre les deux valeurs. Le téléchargement d'un bulletin non.

### E15-US01-ST04 — Limiter le cabinet à ses échanges

Le cabinet ne voit pas ce journal. Il consulte seulement l'historique de ses échanges, livré par E12-US02. S'il ouvre Historique de l'entreprise, la réponse est `NON_AUTORISE`.

Acceptation : une consultation de bulletin n'est pas visible par le cabinet.

### E15-US01-ST05 — Empêcher le salarié de voir le journal d'entreprise

Le salarié n'a pas l'entrée Historique. L'historique d'un document reste sur le document. Un lien direct vers le journal répond `NON_AUTORISE`.

Acceptation : le salarié ne découvre pas les actions d'un collègue par cet écran.

État vide : « Aucune action n'a encore été enregistrée. »

## Hors périmètre

Écriture des audits métier, déjà portée par chaque story. Historique interne d'un document ou d'un échange.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Consommer les faits d'audit sans créer un second journal par module.
