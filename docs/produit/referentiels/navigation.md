# Navigation

Libellés imposés. Une story ajoute son entrée. Elle ne renomme pas celle d'une autre.

## Espace entreprise

Visible du rôle Employeur.

| Libellé                | Story    | Entrée depuis la fiche salarié |
| :--------------------- | :------- | :----------------------------- |
| Tableau de bord        | E16-US01 | non                            |
| Salariés               | E03-US01 | non, c'est la liste            |
| Documents              | E04-US01 | oui, filtré sur le salarié     |
| Bulletins de salaire   | E05-US01 | oui, salarié déjà choisi       |
| Présences              | E06-US01 | oui, filtré sur le salarié     |
| Congés & absences      | E07-US01 | oui, filtré sur le salarié     |
| Heures supplémentaires | E08-US01 | oui, filtré sur le salarié     |
| Notes de frais         | E10-US01 | oui, filtré sur le salarié     |
| Frais professionnels   | E11-US01 | oui, filtré sur le salarié     |
| Registre du personnel  | E13-US01 | oui, ligne du salarié          |
| Cabinet comptable      | E12-US01 | non                            |
| Historique             | E15-US01 | oui, filtré sur le salarié     |
| Paramètres             | E01-US01 | non                            |

## Espace salarié

Visible du rôle Salarié, après second facteur.

| Libellé                    | Story                                          |
| :------------------------- | :--------------------------------------------- |
| Mon espace                 | E16-US02                                       |
| Mes documents              | E04-US01 pour consulter, E04-US02 pour déposer |
| Mes bulletins de salaire   | E05-US01                                       |
| Mes présences              | E06-US01                                       |
| Mes congés & absences      | E07-US01                                       |
| Mes heures supplémentaires | E08-US01                                       |
| Mes notes de frais         | E10-US01                                       |
| Mes frais professionnels   | E11-US01                                       |
| Mes informations           | E09-US01                                       |

## Espace cabinet

Visible du rôle Cabinet comptable, connexion au statut Connecté.

| Libellé                 | Story    |
| :---------------------- | :------- |
| Documents reçus         | E12-US02 |
| Déposer un document     | E12-US02 |
| Historique des échanges | E12-US02 |

Le cabinet ne voit aucune entrée de l'espace entreprise ni de l'espace salarié.
