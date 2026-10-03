---
name: api-db
description: Règles de persistance Prisma pour apps/api.
---

# API — base de données (Prisma)

## Audit

- Stocker des **événements typés** : `action` et `subject` en **enums Prisma** (`AuditAction`, `AuditSubject`), alignés 1:1 avec `libs/domain/src/audit/*` ; `before`, `after` (JSON `AuditValue`), `actorId`, `occurredAt`.
- Ne pas ajouter d’action ou de subject en `String` libre : étendre les enums schéma + domaine + migration.
- **Interdit** : toute colonne ou payload contenant une **phrase lisible**, un libellé UI, ou du texte métier formaté pour l’humain. La phrase du journal (E15) est construite côté **presenter** dashboard à partir des valeurs typées.

## Général

- Schéma et migrations dans `apps/api/prisma/`.
- Client généré dans `apps/api/src/infrastructure/prisma/generated` (non versionné).
- Données métier structurées (JSON) = faits ; pas de copie de copywriting produit en base.
