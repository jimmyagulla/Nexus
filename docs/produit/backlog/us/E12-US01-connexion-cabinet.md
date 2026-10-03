# E12-US01 — Connexion du cabinet comptable

| Champ                   | Valeur                     |
| :---------------------- | :------------------------- |
| Epic                    | E12                        |
| Priorité de réalisation | 5                          |
| Besoin métier           | Périphérique               |
| Dépend de               | E02-US01                   |
| Parallèle avec          | aucune autre story cabinet |
| Parcours                | I, partie connexion        |

En tant qu'employeur, je veux inviter mon cabinet et suivre l'état de cette connexion, afin de lui ouvrir ensuite un espace limité aux échanges.

## Pourquoi cette priorité

Le cabinet est un interlocuteur externe. L'entreprise tient son coffre, ses bulletins et sa gestion RH sans lui. C'est le besoin le plus tardif.

## Sous-tâches

### E12-US01-ST01 — Inviter le cabinet

L'employeur invite un cabinet. Un compte de rôle Cabinet comptable naît au statut Invité, et la connexion est au statut Invitation envoyée. Le cabinet active son compte comme un employeur, sans second facteur.

Acceptation : le compte créé n'a pas le rôle Employeur ni Salarié.

### E12-US01-ST02 — Voir le statut de connexion

L'employeur voit Invitation envoyée, Connecté ou Révoqué. Le salarié ne voit pas cette connexion.

Acceptation : un salarié qui ouvre Cabinet comptable reçoit `NON_AUTORISE`.

### E12-US01-ST03 — Activer l'accès

Lorsque le cabinet a activé son compte, la connexion passe à Connecté. Il voit alors seulement les entrées Documents reçus, Déposer un document et Historique des échanges. Tant que rien n'a été échangé, les listes sont vides.

Acceptation : aucune entrée Salariés, Documents, Bulletins, Congés ou Notes de frais n'est visible.

### E12-US01-ST04 — Révoquer

L'employeur révoque une invitation ou une connexion active. Le cabinet ne se connecte plus à cette entreprise. Les échanges déjà créés restent pour l'employeur et sont masqués au cabinet.

Acceptation : une connexion Révoqué ne permet plus au cabinet d'ouvrir un document.

### E12-US01-ST05 — Limiter les droits aux échanges

Les seuls droits ouvrables sont : consulter les échanges qui lui sont destinés, et déposer un document vers l'entreprise. Aucun réglage ne donne le coffre, les bulletins, les présences, les congés, les frais ou le registre.

Acceptation : une tentative d'ouvrir une fiche salarié répond `NON_AUTORISE`.

## Hors périmètre

Transmission d'un document, catégories d'échange au-delà de l'existence du canal.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`.
