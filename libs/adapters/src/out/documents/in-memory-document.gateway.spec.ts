import { describe, expect, it } from 'vitest';
import {
  DocumentCategory,
  DocumentListCriteria,
  DocumentSort,
  DocumentSortDirection,
  DocumentStatus,
  ErrorCode,
  prepareDocumentDeposit,
} from '@hexagonal-monorepo-template/domain';
import { FixedClock } from '../clock/fixed-clock';
import { RandomUuidGenerator } from '../id/random-uuid-generator';
import { InMemoryDocumentGateway } from './in-memory-document.gateway';

const pdf = Uint8Array.from([...'%PDF-1.7\n'].map((c) => c.charCodeAt(0)));
const everything: DocumentListCriteria = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE, direction: DocumentSortDirection.DESC,
};
const scan = prepareDocumentDeposit({
  category: DocumentCategory.OTHER,
  comment: null,
  files: [{ name: 'Scan', fileName: 'scan.pdf', content: pdf }],
});

function gateway(): InMemoryDocumentGateway {
  return new InMemoryDocumentGateway(
    new RandomUuidGenerator(),
    new FixedClock(new Date('2026-10-03T10:24:00.000Z')),
  );
}

describe('InMemoryDocumentGateway', () => {
  it('lists the deposits of the person behind the token, waiting for HR', async () => {
    const documents = gateway();

    const [deposited] = await documents.deposit('c1', scan, 'token-1');

    await expect(documents.list('c1', everything, 'token-1')).resolves.toMatchObject({
      items: [{ id: deposited.id, name: 'Scan', status: DocumentStatus.PENDING, createdAt: '2026-10-03T10:24:00.000Z' }],
      total: 1,
    });
  });

  it('keeps the documents of one person away from another', async () => {
    const documents = gateway();
    const [deposited] = await documents.deposit('c1', scan, 'token-1');

    await expect(documents.list('c1', everything, 'token-2')).resolves.toMatchObject({ items: [], total: 0 });
    await expect(documents.download('c1', deposited.id, 'token-2')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('marks a viewed document as seen and links to its file', async () => {
    const documents = gateway();
    const [deposited] = await documents.deposit('c1', scan, 'token-1');

    await expect(documents.view('c1', deposited.id, 'token-1')).resolves.toEqual({
      url: 'data:application/pdf;base64,JVBERi0xLjcK',
      fileName: 'Scan.pdf',
      contentType: 'application/pdf',
    });
    await expect(documents.list('c1', everything, 'token-1')).resolves.toMatchObject({
      items: [{ status: DocumentStatus.SEEN }],
    });
  });

  it('downloads without changing the status', async () => {
    const documents = gateway();
    const [deposited] = await documents.deposit('c1', scan, 'token-1');

    await documents.download('c1', deposited.id, 'token-1');

    await expect(documents.list('c1', everything, 'token-1')).resolves.toMatchObject({
      items: [{ status: DocumentStatus.PENDING }],
    });
  });
});
