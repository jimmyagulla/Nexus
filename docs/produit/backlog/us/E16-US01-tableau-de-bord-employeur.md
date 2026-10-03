# E16-US01 — Tableau de bord employeur

| Champ                   | Valeur                        |
| :---------------------- | :---------------------------- |
| Epic                    | E16                           |
| Priorité de réalisation | 2                             |
| Besoin métier           | Fort                          |
| Dépend de               | E02-US01                      |
| Parallèle avec          | E16-US02, E14-US01            |
| Parcours                | accueil des actions employeur |

En tant qu'employeur, je veux voir les actions qui m'attendent, afin d'ouvrir directement la liste concernée.

## Pourquoi cette priorité

L'employeur peut déposer un document sans tableau de bord. Dès la mise en service, l'accueil doit pourtant le mener aux actions. Les chiffres arrivent avec les modules sources. Cette story ne les recalcule pas.

## Sous-tâches

### E16-US01-ST01 — Afficher les indicateurs d'action

L'écran montre les indicateurs employeur du référentiel : salariés, documents, congés, heures, notes de frais, frais professionnels, cabinet. Chaque valeur vient de sa story source.

Acceptation : le libellé de chaque bloc est celui du référentiel navigation ou de l'indicateur, sans reformulation.

### E16-US01-ST02 — Ouvrir la liste filtrée

Activer un indicateur ouvre le module cible avec le filtre décrit dans le catalogue. Le tableau de bord n'applique pas une seconde règle de calcul.

Acceptation : `conges.en-attente` ouvre Congés & absences déjà filtrées sur En attente.

### E16-US01-ST03 — Montrer l'état vide d'un module absent

Si la story source n'a pas encore publié d'indicateur, le bloc affiche l'état vide de ce module et n'affiche pas un zéro présenté comme un calcul. Quand la source existe et que la valeur est réellement zéro, le zéro est affiché et reste cliquable.

Acceptation : avant la livraison des congés, le bloc congés ne prétend pas qu'il n'y a aucune demande.

### E16-US01-ST04 — Réserver l'écran à l'employeur

Le salarié et le cabinet ne voient pas ce tableau de bord. Un accès direct répond `NON_AUTORISE`.

Acceptation : le salarié arrive sur Mon espace, pas sur cet écran.

## Hors périmètre

Calcul des soldes, des montants et des compteurs de documents.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Assembler les indicateurs sans réécrire leur règle.
