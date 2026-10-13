import { ErrorCode } from '../errors/error-code';
import { ReceiptDetails } from './receipt-details';

const bytes = new Uint8Array([1, 2, 3]);

describe('ReceiptDetails', () => {
  it.each(['application/pdf', 'image/jpeg', 'image/png'])(
    'accepts a %s file',
    (mimeType) => {
      const details = ReceiptDetails.parse({
        fileName: 'ticket',
        mimeType,
        content: bytes,
        expenseId: null,
      });

      expect(details.mimeType).toBe(mimeType);
      expect(details.content).toEqual(bytes);
    },
  );

  it('keeps the name of the file and the expense it proves', () => {
    const details = ReceiptDetails.parse({
      fileName: ' ticket.pdf ',
      mimeType: 'application/pdf',
      content: bytes,
      expenseId: 'x1',
    });

    expect(details.fileName).toBe('ticket.pdf');
    expect(details.expenseId).toBe('x1');
  });

  it('proves the report as a whole when no expense is given', () => {
    expect(
      ReceiptDetails.parse({
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        content: bytes,
        expenseId: null,
      }).expenseId,
    ).toBeNull();
  });

  it.each(['text/plain', 'application/zip', 'image/gif', ''])(
    'refuses a %s file',
    (mimeType) => {
      expect(() =>
        ReceiptDetails.parse({
          fileName: 'ticket',
          mimeType,
          content: bytes,
          expenseId: null,
        }),
      ).toThrow(ErrorCode.INVALID_FILE);
    },
  );

  it('can be detached from the expense it proved', () => {
    const details = ReceiptDetails.parse({
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: bytes,
      expenseId: 'x1',
    });

    const detached = details.detachedFromExpense();

    expect(detached.expenseId).toBeNull();
    expect(detached.fileName).toBe('ticket.pdf');
    expect(detached.content).toEqual(bytes);
  });

  it('refuses an empty file', () => {
    expect(() =>
      ReceiptDetails.parse({
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        content: new Uint8Array(),
        expenseId: null,
      }),
    ).toThrow(ErrorCode.INVALID_FILE);
  });

  it('refuses a file without a name', () => {
    expect(() =>
      ReceiptDetails.parse({
        fileName: '  ',
        mimeType: 'application/pdf',
        content: bytes,
        expenseId: null,
      }),
    ).toThrow(ErrorCode.INVALID_FILE);
  });
});
