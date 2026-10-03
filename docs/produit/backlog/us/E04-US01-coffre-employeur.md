# E04-US01 — Coffre : dépôt employeur et consultation

| Champ                   | Valeur   |
| :---------------------- | :------- |
| Epic                    | E04      |
| Priorité de réalisation | 1        |
| Besoin métier           | Critique |
| Dépend de               | E03-US01 |
| Parallèle avec          | E03-US02 |
| Parcours                | B        |

En tant qu'employeur, je veux déposer un contrat dans le coffre d'un salarié, afin qu'il le consulte et le télécharge dans son espace, et que cette consultation soit tracée.

## Pourquoi cette priorité

Le coffre est le cœur du produit. Remettre un document nominatif est le besoin pour lequel la plateforme existe, au même titre que le bulletin.

## Document

| Information          | Règle                                                                                                   |
| :------------------- | :------------------------------------------------------------------------------------------------------ |
| Nom                  | Obligatoire                                                                                             |
| Catégorie            | Contrat de travail, Avenant, Document mutuelle, Attestation, Document administratif, Courrier RH, Autre |
| Date                 | Obligatoire                                                                                             |
| Auteur               | Utilisateur qui dépose                                                                                  |
| Propriétaire         | Fiche salarié de l'entreprise                                                                           |
| Statut               | Référentiel document                                                                                    |
| Date de dépôt        | Moment de la transmission                                                                               |
| Date de consultation | Première ouverture par le salarié, sinon vide                                                           |
| Commentaire          | Facultatif                                                                                              |

Le bulletin de salaire ne se dépose pas ici.

## Sous-tâches

### E04-US01-ST01 — Décrire le document

Un document sans salarié, sans nom, sans catégorie ou sans date n'existe pas. Le fichier joint suit la règle des formats. Un fichier refusé répond `FICHIER_INVALIDE`. Un enregistrement sans fichier répond `DOCUMENT_MANQUANT`.

Acceptation : un document incomplet n'apparaît ni chez l'employeur ni chez le salarié.

### E04-US01-ST02 — Déposer un document employeur

Parcours B : choisir le salarié, ouvrir son espace documentaire, ajouter un document, choisir Contrat de travail ou une autre catégorie employeur, importer le fichier, valider. Le document devient visible dans Mes documents.

Acceptation : le salarié concerné le voit. Un autre salarié de la même entreprise ne le voit pas.

### E04-US01-ST03 — Enregistrer un brouillon puis transmettre

L'employeur peut garder un Brouillon, visible de lui seul. La transmission passe le statut à Transmis et fixe la date de dépôt. La phrase est « Le document a été transmis. » Un second clic ne crée pas un second document.

Acceptation : le brouillon est absent de Mes documents. Le document transmis y est présent.

### E04-US01-ST04 — Consulter et télécharger

L'employeur consulte tous les documents de l'entreprise. Le salarié consulte et télécharge les siens. La première consultation par le salarié passe le statut à Consulté et fige la date de consultation. Chaque consultation et chaque téléchargement sont historisés. Un document d'un autre salarié répond `DOCUMENT_INACCESSIBLE`.

Acceptation : rouvrir un document déjà consulté ne change plus la date de première consultation, et ajoute une ligne d'historique.

### E04-US01-ST05 — Remplacer

L'employeur remplace le fichier d'un document Transmis ou Consulté. L'identité du document reste. Le statut redevient Transmis, la date de consultation est effacée, le salarié reçoit `document.nouveau`.

Acceptation : l'ancien fichier n'est plus celui qui est téléchargé. L'historique garde la trace du remplacement.

### E04-US01-ST06 — Archiver

L'employeur passe un document Transmis ou Consulté à Archivé. Il sort des compteurs de documents disponibles et reste visible avec le filtre Archivé.

Acceptation : le compteur du salarié diminue. Le document se retrouve par le filtre.

### E04-US01-ST07 — Supprimer après confirmation

L'employeur confirme avec « Confirmez-vous la suppression de ce document ? ». Le document quitte les listes. L'audit de suppression reste. Le salarié ne le voit plus. Annuler la confirmation ne change rien.

Acceptation : après confirmation, ni l'employeur ni le salarié ne le retrouvent dans les listes.

### E04-US01-ST08 — Demander un document au salarié

L'employeur demande un document : catégorie salarié et commentaire. Le salarié reçoit `document.a-completer`, action requise, vers le dépôt de cette catégorie. Le dépôt lui-même est E04-US02.

Acceptation : la notification désigne la catégorie demandée.

### E04-US01-ST09 — Rechercher et filtrer

Filtres employeur : salarié, catégorie, date, type, statut. Filtres salarié : catégorie, date, type, statut, limités à ses documents.

Acceptation : un filtre ne révèle pas un document hors droit.

### E04-US01-ST10 — Signaler un doublon potentiel

Même salarié, même catégorie, même nom, même date : `DOUBLON_POTENTIEL`. L'employeur peut confirmer qu'il s'agit d'un autre document. Cette confirmation crée le document.

Acceptation : sans confirmation, rien n'est créé. Avec confirmation, le document existe.

### E04-US01-ST11 — Afficher l'état vide

Salarié : « Aucun document n'est disponible dans votre espace. » L'action Déposer un document apparaît avec E04-US02. Employeur : « Aucun document n'est disponible. » et l'action Ajouter un document.

Acceptation : l'état vide propose l'action autorisée et pas l'action de l'autre rôle.

### E04-US01-ST12 — Notifier et historiser

Transmission au salarié : notification `document.nouveau` et audit d'ajout. Téléchargement : audit de téléchargement. Suppression : audit de suppression. Les phrases sont lisibles, sur le modèle « Marie Dupont a déposé un contrat de travail. »

Acceptation : le salarié non concerné ne reçoit pas la notification.

## Indicateurs

`documents.nouveaux`, `documents.non-consultes`, `mes-documents.disponibles`, `mes-documents.nouveaux`.

## Hors périmètre

Dépôt par le salarié, publication d'un bulletin, envoi au cabinet.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`.
