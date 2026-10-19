-- Database-side guards of the expense reports feature that a Prisma schema
-- cannot express, so `prisma db pull` never brings them back: CHECK
-- constraints, Row Level Security and the Storage bucket (storage schema,
-- owned by Supabase). Idempotent; `pnpm prisma:push` runs it right after the
-- push, `pnpm prisma:sql` runs it alone.
-- Rules mirror libs/domain/src/value-objects/expense-amount.ts,
-- expense-vat-rate.ts, expense-report-limits.ts and
-- expense-report-proof-format.ts; change both together.

-- Amounts: text with a dot and two decimals, up to 99 999,99 €.
ALTER TABLE "ExpenseReport" DROP CONSTRAINT IF EXISTS "ExpenseReport_amount_check";
ALTER TABLE "ExpenseReport"
  ADD CONSTRAINT "ExpenseReport_amount_check"
  CHECK ("amount" ~ '^[0-9]{1,5}\.[0-9]{2}$' AND "amount" <> '0.00');

ALTER TABLE "ExpenseReport" DROP CONSTRAINT IF EXISTS "ExpenseReport_vat_check";
ALTER TABLE "ExpenseReport"
  ADD CONSTRAINT "ExpenseReport_vat_check"
  CHECK (
    ("vatRate" IS NULL AND "vatAmount" IS NULL)
    OR ("vatRate" IN (5, 10, 20) AND "vatAmount" ~ '^[0-9]{1,5}\.[0-9]{2}$')
  );

ALTER TABLE "ExpenseReport" DROP CONSTRAINT IF EXISTS "ExpenseReport_description_check";
ALTER TABLE "ExpenseReport"
  ADD CONSTRAINT "ExpenseReport_description_check"
  CHECK (char_length(btrim("description")) BETWEEN 1 AND 250);

ALTER TABLE "ExpenseReport" DROP CONSTRAINT IF EXISTS "ExpenseReport_project_check";
ALTER TABLE "ExpenseReport"
  ADD CONSTRAINT "ExpenseReport_project_check"
  CHECK ("project" IS NULL OR char_length(btrim("project")) BETWEEN 1 AND 50);

-- A receipt is described entirely, or not at all; only scans and photos.
ALTER TABLE "ExpenseReport" DROP CONSTRAINT IF EXISTS "ExpenseReport_proof_check";
ALTER TABLE "ExpenseReport"
  ADD CONSTRAINT "ExpenseReport_proof_check"
  CHECK (
    ("proofFileName" IS NULL AND "proofFormat" IS NULL AND "proofSizeBytes" IS NULL AND "proofStorageKey" IS NULL)
    OR (
      "proofFileName" IS NOT NULL AND "proofStorageKey" IS NOT NULL
      AND "proofFormat" IN ('PDF', 'JPEG', 'PNG')
      AND "proofSizeBytes" > 0 AND "proofSizeBytes" <= 10485760
    )
  );

-- Refunded and refused reports carry their processing date, the others none.
ALTER TABLE "ExpenseReport" DROP CONSTRAINT IF EXISTS "ExpenseReport_processedAt_check";
ALTER TABLE "ExpenseReport"
  ADD CONSTRAINT "ExpenseReport_processedAt_check"
  CHECK (("status" IN ('REFUNDED', 'REJECTED')) = ("processedAt" IS NOT NULL));

-- Supabase exposes the public schema through its REST API with the public
-- anon key: Row Level Security without any policy closes that door. The API
-- connects as the table owner through Prisma and is not affected.
ALTER TABLE "ExpenseReport" ENABLE ROW LEVEL SECURITY;

-- Private bucket holding the receipts. Supabase Storage itself refuses a file
-- above 10 MB or of a media type other than PDF, JPEG and PNG.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'expense-report-proofs',
  'expense-report-proofs',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
