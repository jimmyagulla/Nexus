# E09-US01 — Informations personnelles

| Champ                   | Valeur                       |
| :---------------------- | :--------------------------- |
| Epic                    | E09                          |
| Priorité de réalisation | 3                            |
| Besoin métier           | Courant                      |
| Dépend de               | E03-US01                     |
| Parallèle avec          | E06-US01, E07-US01, E08-US01 |
| Parcours                | tenue à jour des coordonnées |

En tant que salarié, je veux mettre à jour mon adresse, mon téléphone et mon e-mail personnel, afin que l'entreprise dispose de coordonnées justes sans que je modifie ma situation administrative.

## Pourquoi cette priorité

La fiche employeur suffit à ouvrir le coffre. La mise à jour par le salarié devient utile dans la vie courante du dossier, pas pour le premier dépôt.

## Régimes

| Champ                                                               | Salarié  | Employeur |
| :------------------------------------------------------------------ | :------- | :-------- |
| Adresse                                                             | modifie  | modifie   |
| Téléphone                                                           | modifie  | modifie   |
| E-mail personnel                                                    | modifie  | modifie   |
| E-mail professionnel, poste, service, contrat, dates, statut, photo | consulte | modifie   |

Le salarié voit les champs fermés avec l'indication qu'il doit s'adresser à l'entreprise pour les changer.

## Sous-tâches

### E09-US01-ST01 — Afficher les deux régimes

Mes informations sépare les champs ouverts et les champs consultables. Les champs de la fiche E03 sont relus, pas recopiés dans un second dossier.

Acceptation : le poste affiché est celui de la fiche, y compris juste après une modification employeur.

### E09-US01-ST02 — Modifier les champs ouverts

Le salarié enregistre adresse, téléphone et e-mail personnel. Un champ obligatoire laissé vide répond `INFORMATION_OBLIGATOIRE`. L'enregistrement est confirmé et visible de l'employeur sur la fiche.

Acceptation : la liste employeur montre la nouvelle adresse.

### E09-US01-ST03 — Empêcher la modification des champs employeur

Le salarié ne peut pas enregistrer un changement de poste, de contrat, de dates ou de statut. L'action n'aboutit pas et répond `NON_AUTORISE` si elle est forcée.

Acceptation : la fiche garde la valeur employeur.

### E09-US01-ST04 — Historiser avant et après

Chaque enregistrement, qu'il vienne du salarié ou de l'employeur, écrit qui, quand, ancienne valeur et nouvelle valeur.

Acceptation : l'historique permet de relire l'adresse précédente.

### E09-US01-ST05 — Laisser l'employeur modifier les champs des deux régimes

L'employeur corrige aussi l'adresse, le téléphone et l'e-mail personnel. Le salarié en voit le résultat. Cette story ne crée pas de demande de validation.

Acceptation : une adresse saisie par l'employeur est celle que le salarié consulte.

## Hors périmètre

Photo, registre de naissance et nationalité, changement de contrat.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Ne pas créer une seconde fiche.
