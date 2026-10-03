# 02 — Acteurs, organisation, sécurité

## Employeur

Vision globale de son entreprise. Il consulte les salariés, gère leurs espaces, dépose et consulte les documents, gère les bulletins, consulte les présences, gère les congés, valide les heures supplémentaires, traite les notes de frais et les frais professionnels, gère le registre, échange avec le cabinet, consulte l'historique et gère les accès.

Il n'ouvre jamais la session d'un salarié. Il agit dans l'espace entreprise, sur des données filtrées.

## Salarié

Espace nominatif. Il consulte et télécharge ses documents et ses bulletins, consulte ses présences et son compteur de congés, demande des congés, déclare des heures supplémentaires, dépose des documents, modifie les informations personnelles autorisées, dépose des notes de frais, déclare des frais professionnels et suit ses demandes.

Il ne voit aucune information d'un autre salarié.

## Cabinet comptable

Accès limité à ce qui lui est destiné. Il reçoit les documents transmis par l'entreprise, dépose des documents pour l'entreprise, consulte les documents explicitement autorisés et suit l'état des transmissions.

Il n'a pas l'ensemble des données RH.

## Organisation des espaces

Espace entreprise :

Tableau de bord, Salariés, Documents, Bulletins de salaire, Présences, Congés & absences, Heures supplémentaires, Notes de frais, Frais professionnels, Registre du personnel, Cabinet comptable, Historique, Paramètres.

Espace salarié :

Mon espace, Mes documents, Mes bulletins de salaire, Mes présences, Mes congés & absences, Mes heures supplémentaires, Mes notes de frais, Mes frais professionnels, Mes informations.

Les libellés exacts sont dans le [référentiel navigation](../referentiels/navigation.md).

## Connexion

Chaque utilisateur a un compte individuel et une authentification sécurisée.

Le salarié passe par une double authentification avant d'ouvrir son espace : identifiants, second facteur, puis accès. Tant que le second facteur n'est pas en place, l'espace salarié reste fermé.

L'employeur et le cabinet ne sont pas soumis à cette obligation.

## Droits

Les droits dépendent du rôle, de l'utilisateur, de l'entreprise et, pour le cabinet, des échanges qui lui sont explicitement destinés.

Moindre accès : chacun ne voit que ce que son rôle exige. Une URL, une recherche ou un autre écran ne permet pas de contourner cette limite. Un refus ne révèle pas si l'élément existe.

Le détail est dans le [référentiel permissions](../referentiels/permissions.md).

## Historique de sécurité

Tracer au minimum : connexion, ajout d'un document, téléchargement, modification d'une information, dépôt, validation, refus, transmission, suppression, changement de statut.

Le détail des phrases et des porteurs est dans le [contrat d'audit](../referentiels/contrats-partages.md).
