# E13-US01 — Registre unique du personnel

| Champ                   | Valeur             |
| :---------------------- | :----------------- |
| Epic                    | E13                |
| Priorité de réalisation | 4                  |
| Besoin métier           | Complémentaire     |
| Dépend de               | E03-US01           |
| Parallèle avec          | E10-US01, E11-US01 |
| Parcours                | tenue du registre  |

En tant qu'employeur, je veux tenir le registre unique du personnel au même endroit que les fiches, afin de consulter, filtrer et exporter les informations réglementaires sans les désaccorder des salariés.

## Pourquoi cette priorité

Tenir le registre est une obligation administrative réelle. Elle vient après le coffre : l'entreprise peut remettre des documents avant d'avoir complété les champs propres au registre. Elle est au même rang que les flux financiers, pas au rang du cabinet.

## Champs

Communs avec la fiche, fiche source : nom, prénoms, emploi, type de contrat, date d'entrée, date de sortie.

Propres au registre : date de naissance, sexe, nationalité, type et numéro d'autorisation de travail si renseignés, mention de temps partiel, maître d'apprentissage, entreprise de travail temporaire.

## Sous-tâches

### E13-US01-ST01 — Reprendre les champs communs de la fiche

Chaque fiche a une ligne de registre. Les champs communs affichent la valeur de la fiche. Créer un salarié crée la ligne. Il n'existe pas une seconde identité.

Acceptation : changer le nom sur la fiche change le nom au registre.

### E13-US01-ST02 — Tenir les champs propres au registre

L'employeur renseigne les champs propres. Ils ne sont pas modifiables par le salarié dans Mes informations. Un champ propre vide reste vide, sans valeur inventée.

Acceptation : la nationalité absente n'est pas remplacée par une valeur par défaut.

### E13-US01-ST03 — Consulter, rechercher, filtrer

L'employeur recherche par nom, prénom, emploi, type de contrat et statut d'entrée ou de sortie. Il filtre sur l'entreprise courante. Le salarié et le cabinet n'ouvrent pas le registre.

Acceptation : un salarié qui ouvre le registre reçoit `NON_AUTORISE`.

### E13-US01-ST04 — Ajouter et modifier

L'employeur complète une ligne et modifie un champ commun depuis le registre. La modification est la même que sur la fiche. Les champs obligatoires de la fiche restent obligatoires.

Acceptation : une date d'entrée effacée depuis le registre est refusée par `INFORMATION_OBLIGATOIRE`.

### E13-US01-ST05 — Propager les champs communs

La propagation est immédiate dans les deux sens pour les champs communs. Les champs propres ne remontent pas comme des champs de contrat ou de poste.

Acceptation : le poste de la fiche et l'emploi du registre restent alignés après une modification d'un seul côté.

### E13-US01-ST06 — Historiser

Chaque modification garde qui, quand, champ, ancienne valeur et nouvelle valeur.

Acceptation : l'historique d'une nationalité ne se confond pas avec celui d'un document.

### E13-US01-ST07 — Exporter

L'employeur exporte les colonnes des lignes actuellement filtrées, dans un fichier tabulaire. L'export est historisé. Il ne contient pas les salariés d'une autre entreprise, ni les lignes exclues par le filtre.

Acceptation : un filtre sur un seul salarié exporte une seule ligne de données, plus les en-têtes.

État vide : « Le registre du personnel ne contient encore aucun salarié. » avec l'action Ajouter au registre, qui crée la fiche si elle n'existe pas encore.

## Hors périmètre

Dossier de paie, déclarations sociales, accès salarié au registre.

## Technique

Story métier. Steering skills du code touché, puis `hexagonal-slice`, `hexagonal-monorepo`, `tdd`, `skill-priority`. Ne pas dupliquer la fiche.
