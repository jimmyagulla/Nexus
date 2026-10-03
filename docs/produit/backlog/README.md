# Backlog

Les epics regroupent les user stories. La user story est l'unité qu'un agent réalise entière. Les sous-tâches se font dans cette story, dans l'ordre, sans devenir une story séparée.

Priorité de réalisation : **1 en premier, 5 en dernier**. Le chiffre mesure le besoin métier. Il ne remplace pas la dépendance.

| Valeur | Nom            | Besoin                                                         |
| :----- | :------------- | :------------------------------------------------------------- |
| 1      | Critique       | Ouvrir l'espace salarié et lui remettre documents et bulletins |
| 2      | Fort           | Rendre cet espace utilisable dès la mise en service            |
| 3      | Courant        | Faire vivre la gestion RH régulière                            |
| 4      | Complémentaire | Couvrir les frais et le registre une fois le coffre en place   |
| 5      | Périphérique   | Relier le cabinet comptable                                    |

Règle de prise : parmi les stories dont les dépendances sont faites, prendre d'abord la plus petite priorité. À priorité égale, les stories qui ne se citent pas entre elles sont parallèles.

Le statut en temps réel est dans [suivi.md](suivi.md) : à faire, en cours, terminée. Seul le skill `next-task` le modifie, pour que plusieurs agents prennent des unités différentes. Ne pas éditer ce statut à la main.

## Liste des user stories

| Story                                                | Epic                      | Priorité | Besoin         | Dépend de          | Parallèle possible avec                |
| :--------------------------------------------------- | :------------------------ | :------- | :------------- | :----------------- | :------------------------------------- |
| [E01-US01](us/E01-US01-entreprise.md)                | Entreprise                | 1        | Critique       | —                  | —                                      |
| [E02-US01](us/E02-US01-comptes-connexion-roles.md)   | Accès                     | 1        | Critique       | E01-US01           | —                                      |
| [E02-US02](us/E02-US02-double-authentification.md)   | Accès                     | 1        | Critique       | E02-US01           | E03-US01                               |
| [E03-US01](us/E03-US01-fiche-salarie.md)             | Salariés                  | 1        | Critique       | E02-US01           | E02-US02                               |
| [E03-US02](us/E03-US02-activation-espace.md)         | Salariés                  | 1        | Critique       | E02-US02, E03-US01 | E04-US01                               |
| [E04-US01](us/E04-US01-coffre-employeur.md)          | Coffre                    | 1        | Critique       | E03-US01           | E03-US02                               |
| [E05-US01](us/E05-US01-bulletins.md)                 | Bulletins                 | 1        | Critique       | E04-US01           | stories de priorité 2 déjà débloquées  |
| [E02-US03](us/E02-US03-gestion-des-acces.md)         | Accès                     | 2        | Fort           | E02-US01           | E14-US01, E16-US01, E16-US02           |
| [E04-US02](us/E04-US02-depot-salarie.md)             | Coffre                    | 2        | Fort           | E04-US01           | E14-US01, E16-US02                     |
| [E14-US01](us/E14-US01-notifications.md)             | Notifications             | 2        | Fort           | E02-US01           | E02-US03, E16-US01, E16-US02           |
| [E16-US01](us/E16-US01-tableau-de-bord-employeur.md) | Tableaux de bord          | 2        | Fort           | E02-US01           | E16-US02, E14-US01                     |
| [E16-US02](us/E16-US02-tableau-de-bord-salarie.md)   | Tableaux de bord          | 2        | Fort           | E02-US02           | E16-US01, E14-US01                     |
| [E06-US01](us/E06-US01-presences.md)                 | Présences                 | 3        | Courant        | E03-US01           | E07-US01, E08-US01, E09-US01, E15-US01 |
| [E07-US01](us/E07-US01-conges.md)                    | Congés                    | 3        | Courant        | E01-US01, E03-US01 | E06-US01, E08-US01, E09-US01           |
| [E08-US01](us/E08-US01-heures-supplementaires.md)    | Heures supplémentaires    | 3        | Courant        | E03-US01           | E06-US01, E07-US01, E09-US01           |
| [E09-US01](us/E09-US01-informations-personnelles.md) | Informations personnelles | 3        | Courant        | E03-US01           | E06-US01, E07-US01, E08-US01           |
| [E15-US01](us/E15-US01-historique.md)                | Historique                | 3        | Courant        | E02-US01           | E06-US01, E07-US01                     |
| [E10-US01](us/E10-US01-notes-de-frais.md)            | Notes de frais            | 4        | Complémentaire | E03-US01           | E11-US01, E13-US01                     |
| [E11-US01](us/E11-US01-frais-professionnels.md)      | Frais professionnels      | 4        | Complémentaire | E03-US01           | E10-US01, E13-US01                     |
| [E13-US01](us/E13-US01-registre-du-personnel.md)     | Registre                  | 4        | Complémentaire | E03-US01           | E10-US01, E11-US01                     |
| [E12-US01](us/E12-US01-connexion-cabinet.md)         | Cabinet comptable         | 5        | Périphérique   | E02-US01           | —                                      |
| [E12-US02](us/E12-US02-echanges-cabinet.md)          | Cabinet comptable         | 5        | Périphérique   | E12-US01           | —                                      |

## Epics

| Epic                                          | Intention                                                                   | Stories             | Priorité la plus haute |
| :-------------------------------------------- | :-------------------------------------------------------------------------- | :------------------ | :--------------------- |
| [E01](epics/E01-entreprise.md)                | L'entreprise est le périmètre de toutes les données                         | E01-US01            | 1                      |
| [E02](epics/E02-acces.md)                     | Chaque personne a un compte, un rôle et, pour le salarié, un second facteur | E02-US01 à E02-US03 | 1                      |
| [E03](epics/E03-salaries.md)                  | Un salarié, une fiche, un espace nominatif                                  | E03-US01, E03-US02  | 1                      |
| [E04](epics/E04-coffre.md)                    | Le coffre contextualise chaque document                                     | E04-US01, E04-US02  | 1                      |
| [E05](epics/E05-bulletins.md)                 | Les bulletins sont classés par année et par mois                            | E05-US01            | 1                      |
| [E06](epics/E06-presences.md)                 | Le mois de présence prépare la paie sans la calculer                        | E06-US01            | 3                      |
| [E07](epics/E07-conges.md)                    | Le compteur et la demande de congé suivent les règles de l'entreprise       | E07-US01            | 3                      |
| [E08](epics/E08-heures-supplementaires.md)    | Les heures supplémentaires ont leur propre validation                       | E08-US01            | 3                      |
| [E09](epics/E09-informations-personnelles.md) | Le salarié met à jour seulement ce qui lui est ouvert                       | E09-US01            | 3                      |
| [E10](epics/E10-notes-de-frais.md)            | La note de frais demande un remboursement                                   | E10-US01            | 4                      |
| [E11](epics/E11-frais-professionnels.md)      | Le frais professionnel n'est pas une note de frais                          | E11-US01            | 4                      |
| [E12](epics/E12-cabinet.md)                   | Le cabinet ne voit que les échanges qui lui sont destinés                   | E12-US01, E12-US02  | 5                      |
| [E13](epics/E13-registre.md)                  | Le registre unique reste cohérent avec les fiches                           | E13-US01            | 4                      |
| [E14](epics/E14-notifications.md)             | Les notifications ouvrent l'objet concerné                                  | E14-US01            | 2                      |
| [E15](epics/E15-historique.md)                | L'employeur relit qui a fait quoi                                           | E15-US01            | 3                      |
| [E16](epics/E16-tableaux-de-bord.md)          | Les tableaux de bord mènent à l'action                                      | E16-US01, E16-US02  | 2                      |

## Sous-tâches

Les sous-tâches héritent de la priorité de leur story.

### Priorité 1

- **E01-US01** — ST01 Créer l'entreprise. ST02 Isoler les données. ST03 Tenir le calendrier. ST04 Ouvrir Paramètres.
- **E02-US01** — ST01 Ouvrir l'entreprise et son premier employeur. ST02 Choisir le secret à l'activation. ST03 Se connecter. ST04 Attribuer le rôle. ST05 Bloquer après cinq échecs. ST06 Tracer la connexion.
- **E02-US02** — ST01 Enrôler le second facteur. ST02 Remettre les codes de récupération. ST03 Vérifier à chaque connexion salarié. ST04 Fermer l'espace tant que l'enrôlement manque. ST05 Laisser employeur et cabinet sans second facteur.
- **E03-US01** — ST01 Créer la fiche. ST02 Afficher la liste. ST03 Filtrer et rechercher. ST04 Modifier les informations employeur. ST05 Clôturer et réactiver. ST06 Afficher la dernière activité. ST07 Déposer la photo. ST08 Présenter les entrées vers les modules. ST09 Refuser l'ouverture de session à la place du salarié.
- **E03-US02** — ST01 Inviter le salarié actif. ST02 Activer le compte et choisir le mot de passe. ST03 Enchaîner l'enrôlement du second facteur. ST04 Ouvrir Mon espace. ST05 Invalider une invitation déjà utilisée. ST06 Refuser l'invitation d'un salarié inactif.
- **E04-US01** — ST01 Décrire le document. ST02 Déposer un document employeur. ST03 Enregistrer un brouillon puis transmettre. ST04 Consulter et télécharger. ST05 Remplacer. ST06 Archiver. ST07 Supprimer après confirmation. ST08 Demander un document au salarié. ST09 Rechercher et filtrer. ST10 Signaler un doublon potentiel. ST11 Afficher l'état vide. ST12 Notifier et historiser.
- **E05-US01** — ST01 Choisir le salarié, l'année et le mois. ST02 Joindre le document et publier. ST03 Classer par année puis par mois. ST04 Distinguer consulté et non consulté. ST05 Refuser un second bulletin sur la même période. ST06 Montrer le bulletin dans le coffre. ST07 Notifier le salarié. ST08 Retrouver les bulletins par année.

### Priorité 2

- **E02-US03** — ST01 Inviter un autre employeur. ST02 Désactiver un compte. ST03 Rétablir un compte. ST04 Consulter les comptes de l'entreprise.
- **E04-US02** — ST01 Choisir Déposer un document. ST02 Choisir la catégorie. ST03 Joindre le fichier et un commentaire. ST04 Confirmer l'envoi. ST05 Rendre le document visible à l'employeur. ST06 Refuser le dépôt d'un salarié inactif. ST07 Historiser le dépôt.
- **E14-US01** — ST01 Lister les notifications du destinataire. ST02 Ouvrir la cible. ST03 Marquer comme lue. ST04 Isoler par entreprise, rôle et personne. ST05 Afficher l'état vide.
- **E16-US01** — ST01 Afficher les indicateurs d'action. ST02 Ouvrir la liste filtrée. ST03 Montrer l'état vide d'un module absent. ST04 Réserver l'écran à l'employeur.
- **E16-US02** — ST01 Afficher la synthèse. ST02 Lister les actions requises. ST03 Ouvrir chaque fonction. ST04 Réserver l'écran au salarié après second facteur.

### Priorité 3

- **E06-US01** — ST01 Ouvrir le mois d'un salarié. ST02 Proposer les jours travaillés. ST03 Afficher congés, absences, arrêts et heures. ST04 Ajuster les jours travaillés. ST05 Laisser le salarié consulter ses mois. ST06 Filtrer côté employeur. ST07 Afficher l'état vide. ST08 Faire passer les heures Validée à Traitée.
- **E07-US01** — ST01 Configurer les types et le décompte. ST02 Saisir les jours acquis. ST03 Afficher le compteur. ST04 Enregistrer un brouillon. ST05 Calculer les jours. ST06 Envoyer la demande. ST07 Refuser solde, chevauchement, période et inactif. ST08 Accepter. ST09 Refuser. ST10 Demander et recevoir un complément. ST11 Annuler. ST12 Filtrer. ST13 Afficher les états vides. ST14 Notifier et historiser.
- **E08-US01** — ST01 Enregistrer un brouillon. ST02 Contrôler la date, les heures et le justificatif. ST03 Envoyer. ST04 Valider et rattacher au mois. ST05 Refuser. ST06 Interdire le retrait après envoi. ST07 Filtrer. ST08 Notifier et historiser.
- **E09-US01** — ST01 Afficher les deux régimes. ST02 Modifier les champs ouverts. ST03 Empêcher la modification des champs employeur. ST04 Historiser avant et après. ST05 Laisser l'employeur modifier les champs des deux régimes.
- **E15-US01** — ST01 Afficher le journal employeur. ST02 Filtrer. ST03 Montrer le avant/après. ST04 Limiter le cabinet à ses échanges. ST05 Empêcher le salarié de voir le journal d'entreprise.

### Priorité 4

- **E10-US01** — ST01 Créer une note et ses dépenses. ST02 Calculer le total. ST03 Exiger un justificatif pour soumettre. ST04 Soumettre. ST05 Traiter la note. ST06 Rembourser intégralement. ST07 Filtrer. ST08 Notifier et historiser.
- **E11-US01** — ST01 Configurer les types et le mode de montant. ST02 Créer la demande. ST03 Soumettre. ST04 Traiter jusqu'à Traité. ST05 Garder la séparation avec les notes de frais. ST06 Filtrer. ST07 Notifier et historiser.
- **E13-US01** — ST01 Reprendre les champs communs de la fiche. ST02 Tenir les champs propres au registre. ST03 Consulter, rechercher, filtrer. ST04 Ajouter et modifier. ST05 Propager les champs communs. ST06 Historiser. ST07 Exporter.

### Priorité 5

- **E12-US01** — ST01 Inviter le cabinet. ST02 Voir le statut de connexion. ST03 Activer l'accès. ST04 Révoquer. ST05 Limiter les droits aux échanges.
- **E12-US02** — ST01 Préparer et transmettre. ST02 Recevoir côté cabinet. ST03 Déposer une réponse du cabinet. ST04 Faire évoluer les statuts. ST05 Consulter l'historique de l'échange. ST06 Empêcher l'accès au coffre RH. ST07 Filtrer. ST08 Notifier.

## Prendre une story

1. Lire la story, son epic et les référentiels qu'elle cite.
2. Réaliser toutes ses sous-tâches.
3. Ne pas réaliser une story de priorité plus faible s'il reste une story de meilleure priorité déjà débloquée.
4. Ne pas étendre le périmètre. Un cas absent des référentiels est hors story.
