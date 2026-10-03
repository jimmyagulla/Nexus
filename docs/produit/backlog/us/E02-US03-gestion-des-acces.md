# E02-US03 — Gestion des accès utilisateurs

| Champ                   | Valeur                                 |
| :---------------------- | :------------------------------------- |
| Epic                    | E02                                    |
| Priorité de réalisation | 2                                      |
| Besoin métier           | Fort                                   |
| Dépend de               | E02-US01                               |
| Parallèle avec          | E14-US01, E16-US01, E16-US02           |
| Parcours                | gestion courante des comptes employeur |

En tant qu'employeur, je veux inviter d'autres employeurs et couper un accès, afin de maîtriser qui entre dans l'entreprise.

## Pourquoi cette priorité

Le premier employeur suffit à ouvrir le coffre. Gérer les collègues est nécessaire dès que l'entreprise n'est plus seule, donc dès la mise en service élargie, pas pour le tout premier document.

## Sous-tâches

### E02-US03-ST01 — Inviter un autre employeur

L'employeur invite une personne avec le rôle Employeur. Le compte naît Invité. L'invité active son accès comme dans E02-US01, sans second facteur.

Acceptation : le nouvel employeur, une fois actif, voit la même entreprise et pas une autre.

### E02-US03-ST02 — Désactiver un compte

L'employeur passe un compte Actif à Désactivé. La personne ne se connecte plus. Ses données restent. On ne désactive pas le dernier employeur Actif de l'entreprise.

Acceptation : le compte désactivé échoue à la connexion. Le dernier employeur actif ne peut pas être désactivé.

### E02-US03-ST03 — Rétablir un compte

L'employeur repasse un compte Désactivé à Actif, y compris après un blocage de cinq échecs. Le compteur d'échecs repart à zéro.

Acceptation : la personne bloque se reconnecte après rétablissement, avec son secret.

### E02-US03-ST04 — Consulter les comptes de l'entreprise

L'employeur voit les comptes de son entreprise : identifiant, rôle, statut. Il ne voit pas leur secret. Le salarié et le cabinet ne voient pas cette liste.

Acceptation : un salarié qui ouvre cette liste reçoit `NON_AUTORISE`.

## Hors périmètre

Invitation d'un salarié, invitation du cabinet, droits par document.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Aucun rôle supplémentaire.
