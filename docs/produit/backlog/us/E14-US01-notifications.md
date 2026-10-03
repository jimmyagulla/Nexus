# E14-US01 — Notifications dans l'application

| Champ                   | Valeur                                      |
| :---------------------- | :------------------------------------------ |
| Epic                    | E14                                         |
| Priorité de réalisation | 2                                           |
| Besoin métier           | Fort                                        |
| Dépend de               | E02-US01                                    |
| Parallèle avec          | E02-US03, E16-US01, E16-US02                |
| Parcours                | tous les parcours qui préviennent quelqu'un |

En tant qu'utilisateur, je veux voir mes notifications et ouvrir l'élément concerné, afin de traiter ce qui m'attend sans chercher dans chaque module.

## Pourquoi cette priorité

Dès la mise en service, un bulletin publié ou un document déposé doit pouvoir être signalé. Le coffre peut créer le fait avant cet écran. L'écran est nécessaire pour que le salarié s'en serve vraiment.

## Sous-tâches

### E14-US01-ST01 — Lister les notifications du destinataire

L'utilisateur voit ses notifications, les plus récentes d'abord, avec une phrase métier et la date. Il ne voit pas celles d'un collègue. Les types sont exclusivement ceux du catalogue.

Acceptation : une notification `bulletin.nouveau` n'apparaît que chez le salarié désigné.

### E14-US01-ST02 — Ouvrir la cible

Choisir une notification ouvre l'objet cible si l'utilisateur y a droit, et la marque lue. S'il n'y a plus droit, la phrase est `NON_AUTORISE` et la notification reste consultable comme information.

Acceptation : ouvrir un nouveau bulletin mène à ce bulletin, pas à la liste générale.

### E14-US01-ST03 — Marquer comme lue

L'utilisateur marque une notification lue sans l'ouvrir, ou marque comme lues celles qu'il sélectionne. Une notification lue ne disparaît pas. Elle n'est plus comptée dans `actions.requises`.

Acceptation : une action requise lue quitte la liste d'actions du tableau de bord salarié.

### E14-US01-ST04 — Isoler par entreprise, rôle et personne

Une notification porte l'entreprise du destinataire. Le cabinet ne reçoit que `cabinet.document.recu`. Le salarié ne reçoit pas les notifications employeur, et l'inverse non plus, sauf les types du catalogue qui le désignent.

Acceptation : deux entreprises ne partagent pas une file de notifications.

### E14-US01-ST05 — Afficher l'état vide

« Vous n'avez aucune notification. » Aucune action de création n'est proposée.

Acceptation : le message s'affiche pour un utilisateur qui n'a encore rien reçu, y compris si d'autres modules ne sont pas livrés.

## Hors périmètre

Envoi d'e-mail, création des faits métier des autres stories, choix des types.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Afficher le catalogue sans le redéfinir.
