import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ActorContext,
  DEFAULT_DOCUMENT_SORT,
  DEFAULT_DOCUMENT_SORT_DIRECTION,
  DOCUMENT_MAX_FILES_PER_DEPOSIT,
  DocumentDepositRequest,
  DocumentFileLink,
  DocumentList,
  DocumentListCriteria,
  DocumentSummary,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IDepositDocuments,
  IDownloadDocument,
  IListDocuments,
  IViewDocument,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import {
  DOCUMENT_FILES_FIELD,
  DOCUMENT_UPLOAD_OPTIONS,
} from './document-upload.options';
import { DepositDocumentsRequestDto } from './dto/deposit-documents-request.dto';
import { DocumentFileLinkResponseDto } from './dto/document-file-link-response.dto';
import { DocumentListResponseDto } from './dto/document-list-response.dto';
import { DocumentSummaryResponseDto } from './dto/document-summary-response.dto';
import { ListDocumentsQueryDto } from './dto/list-documents-query.dto';
import { UploadedDocumentFile } from './uploaded-document-file';

/** The documents of the signed-in employee: theirs only, in their company. */
@ApiTags('documents')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(CompanyScopeGuard)
export class DocumentsController {
  constructor(
    @Inject(IListDocuments)
    private readonly listDocuments: IListDocuments,
    @Inject(IDepositDocuments)
    private readonly depositDocuments: IDepositDocuments,
    @Inject(IViewDocument)
    private readonly viewDocument: IViewDocument,
    @Inject(IDownloadDocument)
    private readonly downloadDocument: IDownloadDocument,
  ) {}

  @Get(API_ROUTES.companies.documents)
  @ApiOperation({ summary: 'List my documents (metadata only)' })
  @ApiOkResponse({ type: DocumentListResponseDto })
  list(
    @Actor() actor: ActorContext,
    @Query() query: ListDocumentsQueryDto,
  ): Promise<DocumentList> {
    return this.listDocuments.execute({ actor, criteria: this.toCriteria(query) });
  }

  @Post(API_ROUTES.companies.documents)
  @ApiOperation({ summary: 'Deposit one document per file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['category', 'names', DOCUMENT_FILES_FIELD],
      properties: {
        category: { type: 'string' },
        comment: { type: 'string' },
        names: { type: 'array', items: { type: 'string' } },
        [DOCUMENT_FILES_FIELD]: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiOkResponse({ type: [DocumentSummaryResponseDto] })
  @UseInterceptors(
    FilesInterceptor(
      DOCUMENT_FILES_FIELD,
      DOCUMENT_MAX_FILES_PER_DEPOSIT,
      DOCUMENT_UPLOAD_OPTIONS,
    ),
  )
  deposit(
    @Actor() actor: ActorContext,
    @Body() body: DepositDocumentsRequestDto,
    @UploadedFiles() files: UploadedDocumentFile[] | undefined,
  ): Promise<DocumentSummary[]> {
    return this.depositDocuments.execute({
      actor,
      request: this.toDepositRequest(body, files ?? []),
    });
  }

  @Post(API_ROUTES.companies.documentView)
  @ApiOperation({ summary: 'Open a document; marks it as seen' })
  @ApiOkResponse({ type: DocumentFileLinkResponseDto })
  view(
    @Actor() actor: ActorContext,
    @Param('documentId') documentId: string,
  ): Promise<DocumentFileLink> {
    return this.viewDocument.execute({ actor, documentId });
  }

  @Get(API_ROUTES.companies.documentDownload)
  @ApiOperation({ summary: 'Download a document' })
  @ApiOkResponse({ type: DocumentFileLinkResponseDto })
  download(
    @Actor() actor: ActorContext,
    @Param('documentId') documentId: string,
  ): Promise<DocumentFileLink> {
    return this.downloadDocument.execute({ actor, documentId });
  }

  private toCriteria(query: ListDocumentsQueryDto): DocumentListCriteria {
    return {
      search: query.search ?? '',
      searchCategories: query.searchCategories ?? [],
      searchEmitters: query.searchEmitters ?? [],
      categories: query.categories ?? [],
      statuses: query.statuses ?? [],
      emitters: query.emitters ?? [],
      from: query.from ?? null,
      to: query.to ?? null,
      sort: query.sort ?? DEFAULT_DOCUMENT_SORT,
      direction: query.direction ?? DEFAULT_DOCUMENT_SORT_DIRECTION,
    };
  }

  /** Pairs each file with the name given at the same position. */
  private toDepositRequest(
    body: DepositDocumentsRequestDto,
    files: readonly UploadedDocumentFile[],
  ): DocumentDepositRequest {
    if (body.names.length !== files.length) {
      throw new BadRequestException(ErrorCode.REQUIRED_INFORMATION);
    }
    return {
      category: body.category,
      comment: body.comment ?? null,
      files: files.map((file, index) => ({
        name: body.names[index],
        fileName: file.originalname,
        content: file.buffer,
      })),
    };
  }
}
