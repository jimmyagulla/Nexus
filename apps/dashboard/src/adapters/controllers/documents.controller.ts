import {
  CalendarDate,
  DEFAULT_DOCUMENT_SORT,
  DEFAULT_DOCUMENT_SORT_DIRECTION,
  DOCUMENT_CATEGORIES,
  DOCUMENT_EMITTERS,
  DocumentCategory,
  DocumentEmitter,
  DocumentList,
  DocumentListCriteria,
  DocumentFileLink,
  DocumentSort,
  DocumentSortDirection,
  DocumentStatus,
  DocumentSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IDepositDocumentsFromSession,
  IDownloadDocumentFromSession,
  IListDocumentsFromSession,
  IViewDocumentFromSession,
} from '@hexagonal-monorepo-template/ports';

/** What the documents screen shows, as the person sets it. */
export interface DocumentsListState {
  search: string;
  categories: DocumentCategory[];
  statuses: DocumentStatus[];
  /** null: every emitter. */
  emitter: DocumentEmitter | null;
  /** Calendar days `aaaa-mm-jj`, or '' when none is chosen. */
  from: string;
  to: string;
  /** Column the list is ordered by; null keeps the default order. */
  sort: DocumentSort | null;
  direction: DocumentSortDirection;
}

/** Labels the search also matches, so that "maladie" finds the sick leaves. */
export interface DocumentSearchVocabulary {
  categories: Readonly<Record<DocumentCategory, string>>;
  emitters: Readonly<Record<DocumentEmitter, string>>;
}

export interface DocumentDepositForm {
  category: DocumentCategory;
  comment: string;
  files: { file: File; name: string }[];
}

export class DocumentsController {
  constructor(
    private readonly listFromSession: IListDocumentsFromSession,
    private readonly depositFromSession: IDepositDocumentsFromSession,
    private readonly viewFromSession: IViewDocumentFromSession,
    private readonly downloadFromSession: IDownloadDocumentFromSession,
    private readonly vocabulary: DocumentSearchVocabulary,
  ) {}

  /** The criteria a state asks for; also the cache key of the list. */
  criteriaFor(state: DocumentsListState): DocumentListCriteria {
    const search = state.search.trim();
    return {
      search,
      searchCategories: this.matching(DOCUMENT_CATEGORIES, this.vocabulary.categories, search),
      searchEmitters: this.matching(DOCUMENT_EMITTERS, this.vocabulary.emitters, search),
      categories: [...state.categories].sort(),
      statuses: [...state.statuses].sort(),
      emitters: state.emitter === null ? [] : [state.emitter],
      from: this.calendarDayOf(state.from),
      to: this.calendarDayOf(state.to),
      sort: state.sort ?? DEFAULT_DOCUMENT_SORT,
      direction: state.sort === null ? DEFAULT_DOCUMENT_SORT_DIRECTION : state.direction,
    };
  }

  listDocuments(criteria: DocumentListCriteria): Promise<DocumentList> {
    return this.listFromSession.execute(criteria);
  }

  async depositDocuments(form: DocumentDepositForm): Promise<DocumentSummary[]> {
    return this.depositFromSession.execute({
      category: form.category,
      comment: form.comment,
      files: await Promise.all(
        form.files.map(async ({ file, name }) => ({
          name,
          fileName: file.name,
          content: new Uint8Array(await file.arrayBuffer()),
        })),
      ),
    });
  }

  /** Opens a document: its link, and it is marked as seen. */
  viewDocument(documentId: string): Promise<DocumentFileLink> {
    return this.viewFromSession.execute(documentId);
  }

  downloadDocument(documentId: string): Promise<DocumentFileLink> {
    return this.downloadFromSession.execute(documentId);
  }

  /** The day when it is a real one, null otherwise. */
  private calendarDayOf(day: string): string | null {
    try {
      return day === '' ? null : CalendarDate.parse(day).value;
    } catch {
      return null;
    }
  }

  private matching<T extends string>(
    values: readonly T[],
    labels: Readonly<Record<T, string>>,
    search: string,
  ): T[] {
    const term = this.comparable(search);
    if (term === '') {
      return [];
    }
    return values.filter((value) => this.comparable(labels[value]).includes(term));
  }

  /** Case and accents never prevent a match. */
  private comparable(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
  }
}
