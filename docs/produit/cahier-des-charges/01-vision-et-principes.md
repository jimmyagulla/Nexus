# 01 — Vision et principes

## Vision

La plateforme donne à une entreprise un espace RH centralisé.

Le salarié retrouve ses documents, ses bulletins, ses informations, ses congés, ses heures supplémentaires, ses justificatifs, ses notes de frais et ses frais professionnels, et il suit ses demandes.

L'employeur gère les salariés, leurs documents, les bulletins, les présences, les congés, les heures supplémentaires, les notes de frais, les frais professionnels, le registre du personnel et les échanges avec le cabinet comptable. Il suit les actions importantes.

Le cabinet comptable reçoit les documents qui lui sont destinés, en dépose, suit les échanges, et ne voit rien d'autre.

## Domaines couverts

- Documents administratifs des salariés
- Bulletins de salaire
- Contrats et avenants
- Informations personnelles
- Congés et absences
- Heures supplémentaires
- États de présence
- Notes de frais
- Frais professionnels
- Échanges de documents avec le cabinet comptable
- Gestion administrative des salariés
- Registre unique du personnel numérique

## Principes

1. **Un salarié, un espace nominatif.** Les données personnelles et les documents sont rattachés au salarié.
2. **L'entreprise est le périmètre.** Personne n'accède aux données d'une autre entreprise.
3. **Le salarié est propriétaire de son espace.** Il consulte ses informations et fait les actions autorisées.
4. **L'employeur garde la maîtrise administrative.** Il gère les données RH et les validations.
5. **Un document est contextualisé.** Il est rattaché à un salarié ou à un échange, à une catégorie, à un contexte, à un auteur, à une date et à des droits. Un fichier stocké sans ce contexte n'est pas un document du produit.
6. **Chaque workflow est traçable.** Qui, quoi, quand, et le avant/après lorsqu'une information change.
7. **Les frais restent de deux natures.** Note de frais et frais professionnels sont deux modules, deux formulaires, deux workflows.
8. **Le cabinet est hors du coffre RH.** Son espace et ses droits sont distincts des échanges avec les salariés.

## Sources de vérité pendant le développement

- Les maquettes, lorsqu'elles sont fournies : interface, écrans, navigation, expérience.
- Ce cahier des charges : rôles, données, règles, permissions, statuts, workflows.

Ne pas simplifier une fonctionnalité métier décrite. Une fonction décrite ici et absente d'une maquette fait partie du produit. Si deux écrans se contredisent, le workflow métier et une expérience homogène l'emportent.

Le produit est une plateforme RH évolutive.

## Résultat attendu

Une entreprise peut faire vivre les parcours prioritaires : ouvrir un salarié, publier un contrat, publier un bulletin, traiter un congé, des heures supplémentaires, une note de frais, un frais professionnel, un arrêt maladie et un échange avec le cabinet.

## Priorité du cahier des charges

Ces quatre niveaux décrivent l'ordre d'importance des domaines. Chaque user story du backlog porte en plus une priorité de réalisation de 1 à 5, définie dans [le backlog](../backlog/README.md). 1 se réalise en premier.

| Niveau | Socle                                                                                                                 |
| :----- | :-------------------------------------------------------------------------------------------------------------------- |
| 1      | Authentification, double authentification, entreprise, salariés, droits, espace salarié, coffre, documents, bulletins |
| 2      | Présences, congés, compteurs, demandes de congés, heures supplémentaires, informations personnelles                   |
| 3      | Notes de frais, frais professionnels, validation, suivi du remboursement                                              |
| 4      | Connexion cabinet, échanges, notifications, historique, registre unique du personnel                                  |
