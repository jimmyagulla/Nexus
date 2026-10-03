# E06-US01 — États de présence

| Champ                   | Valeur                                 |
| :---------------------- | :------------------------------------- |
| Epic                    | E06                                    |
| Priorité de réalisation | 3                                      |
| Besoin métier           | Courant                                |
| Dépend de               | E03-US01                               |
| Parallèle avec          | E07-US01, E08-US01, E09-US01, E15-US01 |
| Parcours                | alimentation des parcours D et E       |

En tant qu'employeur, je veux un état de présence mensuel par salarié, afin de préparer les éléments utiles au bulletin sans calculer le salaire.

## Pourquoi cette priorité

Le coffre et les bulletins fonctionnent sans cet état. Il devient nécessaire dans la gestion RH régulière, quand les absences et les heures doivent être rassemblées.

## Données du mois

Salarié, mois civil, jours travaillés, absences, congés, arrêts, autres événements, heures supplémentaires.

Jours travaillés proposés = jours du mois, moins les jours non travaillés du calendrier, moins les jours couverts par un fait d'absence. L'employeur peut ajuster ce nombre. L'ajustement garde l'avant et l'après.

## Sous-tâches

### E06-US01-ST01 — Ouvrir le mois d'un salarié

L'employeur ouvre une ligne pour un salarié et un mois. Une seconde ligne pour le même couple est un doublon : `DOUBLON_POTENTIEL`, sans création.

Acceptation : un seul état existe pour ce salarié et ce mois.

### E06-US01-ST02 — Proposer les jours travaillés

À l'ouverture, le nombre proposé suit le calendrier de l'entreprise et les faits d'absence déjà publiés. Sans fait, seuls le calendrier et les jours du mois comptent.

Acceptation : un dimanche du calendrier par défaut n'est pas compté comme travaillé.

### E06-US01-ST03 — Afficher congés, absences, arrêts et heures

Les faits d'absence apparaissent en congés ou en absences selon leur type. Les documents Arrêt maladie dont la date tombe dans le mois apparaissent en arrêts. Les faits d'heures apparaissent en heures supplémentaires. Sans fait, la rubrique est vide, pas estimée.

Acceptation : une absence acceptée puis annulée disparaît de l'état.

### E06-US01-ST04 — Ajuster les jours travaillés

L'employeur corrige le nombre de jours travaillés. La valeur proposée reste visible comme valeur d'origine dans l'historique. Le salarié ne corrige pas.

Acceptation : l'historique montre l'ancienne et la nouvelle valeur.

### E06-US01-ST05 — Laisser le salarié consulter ses mois

Le salarié consulte ses états, sans ceux des autres. Un lien direct vers un autre salarié répond `NON_AUTORISE`.

Acceptation : la liste du salarié ne contient que ses mois.

### E06-US01-ST06 — Filtrer côté employeur

Filtres : salarié, période. L'employeur voit les salariés de son entreprise seulement.

Acceptation : la période filtrée ne montre pas les autres mois.

### E06-US01-ST07 — Afficher l'état vide

« Aucun état de présence n'est disponible pour cette période. » Pas d'action pour le salarié. L'employeur peut ouvrir le mois.

Acceptation : le message s'affiche quand aucune ligne ne correspond.

### E06-US01-ST08 — Faire passer les heures Validée à Traitée

Ouvrir le mois rattache les faits d'heures Validée de ce mois et les fait passer à Traitée, selon E08. Cette story ne valide pas une déclaration encore en attente.

Acceptation : une déclaration seulement Validée devient Traitée à l'ouverture de son mois. Une déclaration en attente ne change pas.

## Hors périmètre

Saisie libre d'un congé, calcul d'un montant, publication du bulletin.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Consommer les faits d'absence et d'heures sans les redéfinir.
