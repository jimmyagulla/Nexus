# E03-US02 — Activation de l'espace salarié

| Champ                   | Valeur             |
| :---------------------- | :----------------- |
| Epic                    | E03                |
| Priorité de réalisation | 1                  |
| Besoin métier           | Critique           |
| Dépend de               | E02-US02, E03-US01 |
| Parallèle avec          | E04-US01           |
| Parcours                | A                  |

En tant qu'employeur, je veux remettre au salarié un accès personnel, afin qu'il ouvre seul son espace après avoir choisi son secret et son second facteur.

## Pourquoi cette priorité

La fiche sans accès ne tient pas la promesse d'un espace salarié. Cette story est le reste du parcours A.

## Sous-tâches

### E03-US02-ST01 — Inviter le salarié actif

Depuis la fiche Actif, l'employeur envoie une invitation personnelle. Un compte Salarié Invité est rattaché à cette fiche et à cette entreprise. Une fiche n'a qu'un compte.

Acceptation : l'invitation désigne ce salarié et aucune autre fiche.

### E03-US02-ST02 — Activer le compte et choisir le mot de passe

Le salarié utilise l'invitation, choisit son secret, et le compte passe à Actif. L'invitation ne contient pas le secret. Une invitation consommée répond `INVITATION_INVALIDE`.

Acceptation : le secret choisi est celui qui sera redemandé à la prochaine connexion.

### E03-US02-ST03 — Enchaîner l'enrôlement du second facteur

Sitôt le secret choisi, le salarié enrôle le second facteur selon E02-US02. Il ne choisit pas de reporter.

Acceptation : abandonner l'enrôlement laisse le compte sans accès à Mon espace.

### E03-US02-ST04 — Ouvrir Mon espace

Lorsque le second facteur est confirmé, le salarié arrive sur Mon espace. La confirmation affichée est « Votre espace est ouvert. » La dernière activité de la fiche est renseignée.

Acceptation : l'espace présenté est le sien, vide des documents s'il n'y en a pas encore.

### E03-US02-ST05 — Invalider une invitation déjà utilisée

Un second usage du même moyen d'activation échoue. L'employeur peut émettre une nouvelle invitation si le compte est encore Invité.

Acceptation : deux personnes ne peuvent pas activer la même invitation.

### E03-US02-ST06 — Refuser l'invitation d'un salarié inactif

L'action d'inviter un salarié Inactif est refusée avec `SALARIE_INACTIF`. Un compte déjà actif dont la fiche passe Inactif peut encore se connecter pour consulter, et ne peut plus créer de nouvelles démarches. Cette interdiction de création est portée par chaque story concernée.

Acceptation : le bouton d'invitation n'aboutit pas sur une fiche inactive.

## Hors périmètre

Dépôt de documents, bulletins, contenu des tableaux de bord au-delà de l'arrivée dans l'espace.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Le canal qui porte l'invitation n'est pas fixé ici.
