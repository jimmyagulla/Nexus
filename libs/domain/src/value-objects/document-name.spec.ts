import { ErrorCode } from '../errors/error-code';
import { DOCUMENT_NAME_MAX_LENGTH } from './document-limits';
import { DocumentName } from './document-name';

describe('DocumentName', () => {
  it('keeps a name without its surrounding spaces', () => {
    expect(DocumentName.parse('  Arrêt  ').value).toBe('Arrêt');
  });

  it('accepts a name of exactly the longest length', () => {
    const name = 'n'.repeat(DOCUMENT_NAME_MAX_LENGTH);

    expect(DocumentName.parse(name).value).toBe(name);
  });

  it('refuses a longer name', () => {
    expect(() => DocumentName.parse('n'.repeat(DOCUMENT_NAME_MAX_LENGTH + 1))).toThrow(
      ErrorCode.INVALID_INFORMATION,
    );
  });

  it('refuses a blank name', () => {
    expect(() => DocumentName.parse('   ')).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('proposes the file name, cut to the longest length', () => {
    expect(DocumentName.proposedFor('arret.pdf')).toBe('arret.pdf');
    expect(DocumentName.proposedFor(`${'n'.repeat(60)}.pdf`)).toHaveLength(DOCUMENT_NAME_MAX_LENGTH);
  });
});
