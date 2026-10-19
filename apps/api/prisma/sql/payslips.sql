-- Database-side guards of the payslips feature that a Prisma schema cannot
-- express, so `prisma db pull` never brings them back: CHECK constraints,
-- Row Level Security and the Storage bucket (storage schema, owned by
-- Supabase). Idempotent; `pnpm prisma:push` runs it right after the push,
-- `pnpm prisma:sql` runs it alone.
-- Limits mirror libs/domain/src/value-objects/payslip-limits.ts and
-- document-file-format.ts; change both together.

-- Metadata limits (the VARCHAR lengths already cap the texts).
ALTER TABLE "Payslip" DROP CONSTRAINT IF EXISTS "Payslip_period_check";
ALTER TABLE "Payslip"
  ADD CONSTRAINT "Payslip_period_check"
  CHECK ("year" BETWEEN 2000 AND 2100 AND "month" BETWEEN 1 AND 12);

ALTER TABLE "Payslip" DROP CONSTRAINT IF EXISTS "Payslip_sizeBytes_check";
ALTER TABLE "Payslip"
  ADD CONSTRAINT "Payslip_sizeBytes_check"
  CHECK ("sizeBytes" > 0 AND "sizeBytes" <= 10485760);

ALTER TABLE "Payslip" DROP CONSTRAINT IF EXISTS "Payslip_fileName_check";
ALTER TABLE "Payslip"
  ADD CONSTRAINT "Payslip_fileName_check"
  CHECK (char_length(btrim("fileName")) BETWEEN 1 AND 50);

ALTER TABLE "Payslip" DROP CONSTRAINT IF EXISTS "Payslip_employerName_check";
ALTER TABLE "Payslip"
  ADD CONSTRAINT "Payslip_employerName_check"
  CHECK (char_length(btrim("employerName")) BETWEEN 1 AND 100);

-- Supabase exposes the public schema through its REST API with the public
-- anon key: Row Level Security without any policy closes that door. The API
-- connects as the table owner through Prisma and is not affected.
ALTER TABLE "Payslip" ENABLE ROW LEVEL SECURITY;

-- Private bucket holding the files. Supabase Storage itself refuses a file
-- above 10 MB or of a media type outside the accepted formats.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payslips',
  'payslips',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
