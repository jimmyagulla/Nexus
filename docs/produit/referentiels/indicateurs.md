# Indicateurs

Le module source calcule. Le tableau de bord affiche et ouvre la cible filtrée. Tant que le module source n'existe pas, l'emplacement montre l'état vide du module, sans valeur inventée.

## Employeur

| Identifiant               | Valeur                                          | Cible filtrée                     | Source   |
| :------------------------ | :---------------------------------------------- | :-------------------------------- | :------- |
| `salaries.total`          | Salariés de l'entreprise                        | Salariés                          | E03-US01 |
| `salaries.nouveaux`       | Date d'entrée dans les 30 derniers jours        | Salariés, ce filtre               | E03-US01 |
| `salaries.departs`        | Date de sortie dans les 30 derniers jours       | Salariés, ce filtre               | E03-US01 |
| `documents.nouveaux`      | Documents transmis depuis 7 jours, non archivés | Documents, ce filtre              | E04-US01 |
| `documents.non-consultes` | Statut Transmis                                 | Documents, statut Transmis        | E04-US01 |
| `documents.a-traiter`     | Déposés par un salarié, statut Transmis         | Documents, ce filtre              | E04-US02 |
| `conges.en-attente`       | Demandes En attente                             | Congés & absences, ce statut      | E07-US01 |
| `heures.a-valider`        | Déclarations En attente de validation           | Heures supplémentaires, ce statut | E08-US01 |
| `notes.a-traiter`         | Notes Soumise ou En cours de validation         | Notes de frais, ces statuts       | E10-US01 |
| `notes.montant-attente`   | Somme des totaux de ces notes                   | Même liste                        | E10-US01 |
| `frais.a-traiter`         | Demandes Soumis ou En cours de traitement       | Frais professionnels, ces statuts | E11-US01 |
| `cabinet.a-transmettre`   | Échanges À transmettre                          | Cabinet comptable, ce statut      | E12-US02 |
| `cabinet.recus`           | Entrants au statut Reçu ou Consulté             | Cabinet comptable, sens reçu      | E12-US02 |
| `cabinet.non-consultes`   | Entrants au statut Reçu                         | Cabinet comptable, statut Reçu    | E12-US02 |

## Salarié

| Identifiant                 | Valeur                                                     | Cible                           | Source   |
| :-------------------------- | :--------------------------------------------------------- | :------------------------------ | :------- |
| `mes-documents.disponibles` | Documents visibles non archivés                            | Mes documents                   | E04-US01 |
| `mes-documents.nouveaux`    | Documents au statut Transmis                               | Mes documents, non consultés    | E04-US01 |
| `bulletin.dernier`          | Bulletin le plus récent par période                        | Ce bulletin                     | E05-US01 |
| `conges.disponibles`        | Jours disponibles                                          | Mes congés & absences           | E07-US01 |
| `conges.en-cours`           | Demandes En attente                                        | Mes congés, ce statut           | E07-US01 |
| `heures.compteur`           | Heures Validée + Traitée de l'année civile                 | Mes heures supplémentaires      | E08-US01 |
| `heures.en-attente`         | Nombre de déclarations En attente de validation            | Mes heures, ce statut           | E08-US01 |
| `notes.en-cours`            | Notes Soumise, En cours de validation ou Validée           | Mes notes de frais              | E10-US01 |
| `notes.montant-en-cours`    | Somme des totaux de ces notes                              | Même liste                      | E10-US01 |
| `frais.en-cours`            | Demandes Soumis, En cours de traitement ou Validé          | Mes frais professionnels        | E11-US01 |
| `actions.requises`          | Notifications non lues dont le type est une action requise | La cible de chaque notification | E14-US01 |
