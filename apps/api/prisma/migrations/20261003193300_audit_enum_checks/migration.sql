-- Enums Prisma (SQLite) : contraintes CHECK sur action et subject.
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "action" TEXT NOT NULL CHECK("action" IN ('modification', 'ajout', 'suppression')),
    "subject" TEXT NOT NULL CHECK("subject" IN ('company_name', 'company_calendar_non_working_weekdays', 'company_calendar_holiday')),
    "before" TEXT,
    "after" TEXT,
    "actorId" TEXT,
    "occurredAt" DATETIME NOT NULL,
    CONSTRAINT "AuditEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AuditEvent" ("id", "companyId", "action", "subject", "before", "after", "actorId", "occurredAt")
SELECT "id", "companyId", "action", "subject", "before", "after", "actorId", "occurredAt" FROM "AuditEvent";
DROP TABLE "AuditEvent";
ALTER TABLE "new_AuditEvent" RENAME TO "AuditEvent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
