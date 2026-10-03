# E01-US01 — Entreprise, périmètre et calendrier

| Champ                   | Valeur                                 |
| :---------------------- | :------------------------------------- |
| Epic                    | E01                                    |
| Priorité de réalisation | 1                                      |
| Besoin métier           | Critique                               |
| Dépend de               | —                                      |
| Parallèle avec          | aucune, cette story ouvre le périmètre |
| Parcours                | socle de tous les parcours             |

En tant qu'employeur fondateur, je veux créer mon entreprise et son calendrier, afin que toutes les données RH restent dans ce périmètre.

## Pourquoi cette priorité

Sans entreprise isolée, aucun coffre, aucun salarié et aucun bulletin n'a de sens. C'est le premier besoin.

## Données

| Donnée                         | Règle                                     |
| :----------------------------- | :---------------------------------------- |
| Nom                            | Obligatoire                               |
| Jours habituels non travaillés | Samedi et dimanche au départ, modifiables |
| Jour férié                     | Date et libellé, liste vide au départ     |

## Sous-tâches

### E01-US01-ST01 — Créer l'entreprise

L'employeur fondateur enregistre le nom. Sans nom, la phrase `INFORMATION_OBLIGATOIRE` s'affiche. L'entreprise existe ensuite comme périmètre unique de ses futurs salariés, documents et réglages.

Acceptation : un nom vide est refusé. Un nom renseigné crée une entreprise identifiable.

### E01-US01-ST02 — Isoler les données

Toute donnée métier porte cette entreprise. Une personne de l'entreprise A ne voit rien de l'entreprise B, ni par une liste, ni par une recherche, ni par un lien direct. Le refus est `NON_AUTORISE`, sans dire si l'élément existe.

Acceptation : un objet de A consulté depuis B produit le même refus qu'un objet inconnu.

### E01-US01-ST03 — Tenir le calendrier

L'employeur consulte et modifie les jours habituels non travaillés. Il ajoute, modifie et retire des jours fériés datés. Le calendrier sert plus tard aux congés et aux présences. Cette story ne calcule ni congé ni présence.

Acceptation : un férié retiré ne fait plus partie du calendrier. Le changement est historisé avec l'ancienne et la nouvelle valeur.

### E01-US01-ST04 — Ouvrir Paramètres

L'entrée Paramètres présente le nom et le calendrier. Les futurs réglages des modules s'y ajoutent sans remplacer cet écran. Tant qu'un module n'est pas livré, son réglage n'apparaît pas.

Acceptation : l'employeur ouvre Paramètres et retrouve le nom et le calendrier qu'il a enregistrés.

## Hors périmètre

Types de congé, catégories de frais, connexion du cabinet, comptes utilisateurs.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Aucun statut, rôle, libellé ou message hors référentiels.
