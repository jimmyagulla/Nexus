import {
  DOCUMENT_MAX_FILE_SIZE_BYTES,
  DocumentCategory,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { documentUploadSchema } from './document-upload.schema';

const pdf = () => new File(['%PDF-1.7\n'], 'arret.pdf', { type: 'application/pdf' });

function issues(values: unknown) {
  return documentUploadSchema
    .safeParseAsync(values)
    .then((result) => (result.success ? [] : result.error.issues.map((issue) => [issue.path.join('.'), issue.message])));
}

describe('documentUploadSchema', () => {
  it('accepts a type, a real PDF with a name and an empty comment', async () => {
    await expect(issues({ category: DocumentCategory.SICK_LEAVE, files: [{ file: pdf(), name: 'Arrêt' }], comment: '' })).resolves.toEqual([]);
  });

  it('requires at least one file', async () => {
    await expect(issues({ category: DocumentCategory.OTHER, files: [], comment: '' })).resolves.toEqual([
      ['files', ErrorCode.REQUIRED_INFORMATION],
    ]);
  });

  it('refuses a file whose content is not what its extension says', async () => {
    const fake = new File(['not a pdf'], 'faux.pdf', { type: 'application/pdf' });

    await expect(issues({ category: DocumentCategory.OTHER, files: [{ file: fake, name: 'Faux' }], comment: '' })).resolves.toEqual([
      ['files.0.file', ErrorCode.UNSUPPORTED_FILE_FORMAT],
    ]);
  });

  it('refuses a file above the largest size', async () => {
    const huge = new File([new Uint8Array(DOCUMENT_MAX_FILE_SIZE_BYTES + 1)], 'enorme.pdf');

    await expect(issues({ category: DocumentCategory.OTHER, files: [{ file: huge, name: 'Énorme' }], comment: '' })).resolves.toEqual([
      ['files.0.file', ErrorCode.FILE_TOO_LARGE],
    ]);
  });

  it('refuses a name above 50 characters and a comment above 250', async () => {
    await expect(
      issues({ category: DocumentCategory.OTHER, files: [{ file: pdf(), name: 'n'.repeat(51) }], comment: 'c'.repeat(251) }),
    ).resolves.toEqual(
      expect.arrayContaining([
        ['files.0.name', ErrorCode.INVALID_INFORMATION],
        ['comment', ErrorCode.INVALID_INFORMATION],
      ]),
    );
  });

  it('refuses a blank name', async () => {
    await expect(issues({ category: DocumentCategory.OTHER, files: [{ file: pdf(), name: '  ' }], comment: '' })).resolves.toEqual([
      ['files.0.name', ErrorCode.REQUIRED_INFORMATION],
    ]);
  });
});
