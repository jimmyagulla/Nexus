-- Database-side guards of the documents feature that a Prisma schema cannot
-- express, so `prisma db pull` never brings them back: CHECK constraints,
-- Row Level Security and the Storage bucket (storage schema, owned by
-- Supabase). Idempotent; `pnpm prisma:push` runs it right after the push,
-- `pnpm prisma:sql` runs it alone.
-- Limits mirror libs/domain/src/value-objects/document-limits.ts and
-- document-file-format.ts; change both together.

-- Metadata limits (the VARCHAR lengths already cap name and comment).
ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_sizeBytes_check";
ALTER TABLE "Document"
  ADD CONSTRAINT "Document_sizeBytes_check"
  CHECK ("sizeBytes" > 0 AND "sizeBytes" <= 10485760);

ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_name_check";
ALTER TABLE "Document"
  ADD CONSTRAINT "Document_name_check"
  CHECK (char_length(btrim("name")) BETWEEN 1 AND 50);

ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_comment_check";
ALTER TABLE "Document"
  ADD CONSTRAINT "Document_comment_check"
  CHECK ("comment" IS NULL OR char_length("comment") <= 250);

-- Supabase exposes the public schema through its REST API with the public
-- anon key: Row Level Security without any policy closes that door. The API
-- connects as the table owner through Prisma and is not affected.
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;

-- Private bucket holding the files. Supabase Storage itself refuses a file
-- above 10 MB or of a media type outside the accepted formats.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
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
