import { describe, expect, it } from 'vitest';
import {
  DocumentCategory,
  DocumentComment,
  DocumentEmitter,
  DocumentFileFormat,
  DocumentListCriteria,
  DocumentName,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryHttpClient } from '../../infrastructure/network/in-memory-http-client';
import { ApiDocumentGateway } from './api-document.gateway';

const authorized = { headers: { Authorization: 'Bearer token' } };
const everything: DocumentListCriteria = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE, direction: 'DESC' as const,
};

describe('ApiDocumentGateway', () => {
  it('asks for the list with the default ordering only when nothing is chosen', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/documents?sort=DATE&direction=DESC', { status: 200, data: { items: [] } });

    await expect(new ApiDocumentGateway(http).list('c1', everything, 'token')).resolves.toEqual({ items: [] });
    expect(http.calls[0].config).toEqual(authorized);
  });

  it('flattens every criterion into the query string', async () => {
    const http = new InMemoryHttpClient();
    const url =
      'companies/c1/documents?search=arr%C3%AAt&searchCategories=SICK_LEAVE&searchEmitters=SELF' +
      '&categories=SICK_LEAVE%2CPROOF&statuses=NEW&emitters=HR&from=2026-10-01&to=2026-10-31&sort=SIZE&direction=DESC';
    http.reply('get', url, { status: 200, data: { items: [] } });

    await new ApiDocumentGateway(http).list(
      'c1',
      {
        search: ' arrêt ',
        searchCategories: [DocumentCategory.SICK_LEAVE],
        searchEmitters: [DocumentEmitter.SELF],
        categories: [DocumentCategory.SICK_LEAVE, DocumentCategory.PROOF],
        statuses: [DocumentStatus.NEW],
        emitters: [DocumentEmitter.HR],
        from: '2026-10-01',
        to: '2026-10-31',
        sort: DocumentSort.SIZE, direction: 'DESC' as const,
      },
      'token',
    );

    expect(http.calls.map((call) => call.url)).toEqual([url]);
  });

  it('posts a deposit as a form: type, comment, one name and one file per document', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/documents', { status: 201, data: [] });
    const content = Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d]);

    await new ApiDocumentGateway(http).deposit(
      'c1',
      {
        category: DocumentCategory.PROOF,
        comment: DocumentComment.parse('Justificatif de domicile'),
        files: [{ name: DocumentName.parse('Facture EDF'), fileName: 'edf.pdf', format: DocumentFileFormat.PDF, sizeBytes: 5, content }],
      },
      'token',
    );

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/documents',
        data: {
          fields: [
            { name: 'category', value: 'PROOF' },
            { name: 'comment', value: 'Justificatif de domicile' },
            { name: 'names', value: 'Facture EDF' },
          ],
          files: [{ field: 'files', fileName: 'edf.pdf', contentType: 'application/pdf', content }],
        },
        config: authorized,
      },
    ]);
  });

  it('views with a post and downloads with a get', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/documents/d1/view', { status: 201, data: { url: 'v' } });
    http.reply('get', 'companies/c1/documents/d1/download', { status: 200, data: { url: 'd' } });
    const gateway = new ApiDocumentGateway(http);

    await expect(gateway.view('c1', 'd1', 'token')).resolves.toEqual({ url: 'v' });
    await expect(gateway.download('c1', 'd1', 'token')).resolves.toEqual({ url: 'd' });
  });
});
