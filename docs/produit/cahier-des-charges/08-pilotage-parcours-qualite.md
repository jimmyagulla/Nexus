# 08 — Pilotage, parcours, qualité

## Tableau de bord employeur

Orienté vers les actions à faire. Il affiche les volumes salariés, documents, congés en attente, heures à valider, notes de frais à traiter et leur montant, frais professionnels à traiter, et les échanges cabinet à transmettre, reçus ou non consultés.

Chaque indicateur ouvre directement la liste concernée, déjà filtrée.

## Tableau de bord salarié

Vision synthétique : documents disponibles et nouveaux, dernier bulletin, compteur de congés et demandes en cours, compteur d'heures et demandes en attente, notes de frais et montant en cours, frais professionnels en cours, actions qui attendent le salarié.

## Notifications

Événements utiles, visibles dans l'application, ouvrant l'élément concerné. Exemples : nouveau bulletin, nouveau document, congé accepté ou refusé, heures validées, note de frais validée ou refusée, document du cabinet, demande d'information, document à compléter.

Le catalogue complet est le [référentiel notifications](../referentiels/notifications.md).

## Recherche et filtres

Chaque module a les siens. Il n'y a pas de recherche unique inter-modules.

Exemples :

| Module            | Filtres                                              |
| :---------------- | :--------------------------------------------------- |
| Documents         | salarié, catégorie, date, type, statut               |
| Congés            | salarié, période, type, statut                       |
| Notes de frais    | salarié, période, montant, statut                    |
| Cabinet comptable | type de document, date, sens de transmission, statut |

## Historique

Les actions importantes sont lisibles, par exemple :

- 03/10/2026 — Marie Dupont a déposé un arrêt maladie.
- 03/10/2026 — Jean Martin a consulté son bulletin de septembre.
- 02/10/2026 — Sophie Durand a envoyé une demande de congé.
- 02/10/2026 — La demande de congé de Sophie Durand a été acceptée.
- 01/10/2026 — 5 documents ont été transmis au cabinet comptable.

Chaque entrée identifie qui, quoi, quand, et le avant/après si une valeur change.

## Workflows

Les statuts autorisés sont exclusivement ceux du [référentiel statuts](../referentiels/statuts.md). Les mêmes mots désignent les mêmes situations dans toute l'application.

## Erreurs métier

L'interface explique, sans vocabulaire technique : fichier invalide, document manquant, information obligatoire absente, demande déjà traitée, demande de congé impossible, solde insuffisant, doublon potentiel, utilisateur non autorisé, document non accessible, échec de transmission, demande annulée, salarié inactif.

Les phrases figées sont dans le [référentiel des messages](../referentiels/erreurs-et-etats-vides.md).

## États vides

Chaque module a un état sans données, avec l'action pertinente si l'utilisateur a le droit de la faire.

Exemples : aucun bulletin, aucune demande de congé, aucune note de frais, aucun document.

## Qualité d'expérience

Prévoir le chargement, l'erreur, l'état vide et la confirmation d'une action sensible. Un second envoi ne crée pas un second objet.

## Parcours prioritaires

| Parcours | Intention                                        | User story | Priorité |
| :------- | :----------------------------------------------- | :--------- | :------- |
| A        | Créer le salarié et ouvrir son accès             | E03-US02   | 1        |
| B        | Déposer un contrat                               | E04-US01   | 1        |
| C        | Publier un bulletin                              | E05-US01   | 1        |
| D        | Demander puis trancher un congé                  | E07-US01   | 3        |
| E        | Déclarer puis valider des heures supplémentaires | E08-US01   | 3        |
| F        | Soumettre puis rembourser une note de frais      | E10-US01   | 4        |
| G        | Soumettre puis traiter un frais professionnel    | E11-US01   | 4        |
| H        | Déposer un arrêt maladie                         | E04-US02   | 2        |
| I        | Échanger un document avec le cabinet             | E12-US02   | 5        |

Le détail pas à pas de chaque parcours est dans la tâche correspondante.
