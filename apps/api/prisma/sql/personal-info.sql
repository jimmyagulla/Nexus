-- Database-side guards of the personal information feature that a Prisma
-- schema cannot express, so `prisma db pull` never brings them back: CHECK
-- constraints and Row Level Security. Idempotent; `pnpm prisma:push` runs it
-- right after the push, `pnpm prisma:sql` runs it alone.
-- Rules mirror libs/domain/src/value-objects/personal-contact-limits.ts;
-- change both together.

-- Contact details (the VARCHAR lengths already cap the texts).
ALTER TABLE "PersonalInfo" DROP CONSTRAINT IF EXISTS "PersonalInfo_address_check";
ALTER TABLE "PersonalInfo"
  ADD CONSTRAINT "PersonalInfo_address_check"
  CHECK (char_length(btrim("address")) BETWEEN 1 AND 150);

ALTER TABLE "PersonalInfo" DROP CONSTRAINT IF EXISTS "PersonalInfo_postalCodeAndCity_check";
ALTER TABLE "PersonalInfo"
  ADD CONSTRAINT "PersonalInfo_postalCodeAndCity_check"
  CHECK ("postalCodeAndCity" ~ '^\d{5}\s+\S.*$');

ALTER TABLE "PersonalInfo" DROP CONSTRAINT IF EXISTS "PersonalInfo_phone_check";
ALTER TABLE "PersonalInfo"
  ADD CONSTRAINT "PersonalInfo_phone_check"
  CHECK ("phone" ~ '^(\+33\s?[1-9]|0[1-9])([\s.-]?\d{2}){4}$');

ALTER TABLE "PersonalInfo" DROP CONSTRAINT IF EXISTS "PersonalInfo_email_check";
ALTER TABLE "PersonalInfo"
  ADD CONSTRAINT "PersonalInfo_email_check"
  CHECK ("email" ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$');

-- What the employer records: never blank.
ALTER TABLE "PersonalInfo" DROP CONSTRAINT IF EXISTS "PersonalInfo_employment_check";
ALTER TABLE "PersonalInfo"
  ADD CONSTRAINT "PersonalInfo_employment_check"
  CHECK (
    btrim("lastName") <> '' AND btrim("firstName") <> ''
    AND btrim("jobTitle") <> '' AND btrim("department") <> ''
    AND btrim("socialSecurityNumber") <> '' AND btrim("iban") <> ''
  );

-- Supabase exposes the public schema through its REST API with the public
-- anon key: Row Level Security without any policy closes that door. The API
-- connects as the table owner through Prisma and is not affected.
ALTER TABLE "PersonalInfo" ENABLE ROW LEVEL SECURITY;
