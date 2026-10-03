/*
  Warnings:

  - You are about to drop the column `objectLabel` on the `AuditEvent` table. All the data in the column will be lost.
  - You are about to drop the column `readablePhrase` on the `AuditEvent` table. All the data in the column will be lost.
  - Added the required column `subject` to the `AuditEvent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "before" TEXT,
    "after" TEXT,
    "actorId" TEXT,
    "occurredAt" DATETIME NOT NULL,
    CONSTRAINT "AuditEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AuditEvent" ("action", "after", "before", "companyId", "id", "occurredAt") SELECT "action", "after", "before", "companyId", "id", "occurredAt" FROM "AuditEvent";
DROP TABLE "AuditEvent";
ALTER TABLE "new_AuditEvent" RENAME TO "AuditEvent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
