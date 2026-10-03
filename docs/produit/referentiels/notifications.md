# Notifications

Chaque notification est visible dans l'application, non lue à la création, et ouvre l'objet cible. L'ouvrir la marque lue. Le destinataire peut aussi la marquer lue sans ouvrir.

`Action requise` = elle apparaît dans les actions du tableau de bord salarié.

| Type                    | Destinataire                    | Cible                       | Action requise | Déclencheur                                    |
| :---------------------- | :------------------------------ | :-------------------------- | :------------- | :--------------------------------------------- |
| `document.nouveau`      | Salarié propriétaire            | Document                    | non            | L'employeur remet un document                  |
| `document.depose`       | Employeurs de l'entreprise      | Document                    | non            | Le salarié dépose un document                  |
| `document.a-completer`  | Salarié                         | Dépôt, catégorie préchoisie | oui            | L'employeur demande un document                |
| `bulletin.nouveau`      | Salarié                         | Bulletin                    | non            | Un bulletin est publié                         |
| `conge.en-attente`      | Employeurs                      | Demande                     | non            | Le salarié envoie un congé                     |
| `conge.accepte`         | Salarié                         | Demande                     | non            | L'employeur accepte                            |
| `conge.refuse`          | Salarié                         | Demande                     | non            | L'employeur refuse                             |
| `conge.information`     | Salarié                         | Demande                     | oui            | L'employeur demande un complément              |
| `conge.reponse`         | Employeur auteur de la question | Demande                     | non            | Le salarié répond                              |
| `heures.en-attente`     | Employeurs                      | Déclaration                 | non            | Le salarié envoie des heures                   |
| `heures.validees`       | Salarié                         | Déclaration                 | non            | Validation, y compris passage direct à Traitée |
| `heures.refusees`       | Salarié                         | Déclaration                 | non            | Refus                                          |
| `note.soumise`          | Employeurs                      | Note                        | non            | Soumission                                     |
| `note.validee`          | Salarié                         | Note                        | non            | Validation                                     |
| `note.refusee`          | Salarié                         | Note                        | non            | Refus                                          |
| `note.remboursee`       | Salarié                         | Note                        | non            | Remboursement                                  |
| `note.information`      | Salarié                         | Note                        | oui            | Complément demandé                             |
| `frais.soumis`          | Employeurs                      | Demande                     | non            | Soumission                                     |
| `frais.valide`          | Salarié                         | Demande                     | non            | Validation                                     |
| `frais.refuse`          | Salarié                         | Demande                     | non            | Refus                                          |
| `frais.traite`          | Salarié                         | Demande                     | non            | Passage à Traité                               |
| `frais.information`     | Salarié                         | Demande                     | oui            | Complément demandé                             |
| `cabinet.document.recu` | Destinataire de l'échange       | Échange                     | non            | Un document d'échange devient Reçu             |

Les phrases affichées reprennent le fait métier, par exemple « Nouveau bulletin de salaire » ou « Demande de congé acceptée ». Elles ne contiennent pas de terme technique.
