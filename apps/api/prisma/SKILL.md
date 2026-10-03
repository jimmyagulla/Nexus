---
name: api-db
description: Règles de persistance Prisma pour apps/api.
---

# API — base de données (Prisma)

## Audit

- Stocker des **événements typés** : `action`, `subject`, `before`, `after` (JSON de valeurs `AuditValue`), `actorId`, `occurredAt`.
- **Interdit** : toute colonne ou payload contenant une **phrase lisible**, un libellé UI, ou du texte métier formaté pour l’humain. La phrase du journal (E15) est construite côté **presenter** dashboard à partir des valeurs typées.

## Général

- Schéma et migrations dans `apps/api/prisma/`.
- Client généré dans `apps/api/src/infrastructure/prisma/generated` (non versionné).
- Données métier structurées (JSON) = faits ; pas de copie de copywriting produit en base.
