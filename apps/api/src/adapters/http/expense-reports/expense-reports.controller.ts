import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  ActorContext,
  ExpenseReportList,
  ExpenseReportProofLink,
  ExpenseReportProofUpload,
  ExpenseReportRequest,
  ExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IListExpenseReports,
  IReviseExpenseReport,
  ISubmitExpenseReport,
  IViewExpenseReportProof,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { ExpenseReportListResponseDto } from './dto/expense-report-list-response.dto';
import { ExpenseReportProofLinkResponseDto } from './dto/expense-report-proof-link-response.dto';
import { ExpenseReportSummaryResponseDto } from './dto/expense-report-summary-response.dto';
import { ListExpenseReportsQueryDto } from './dto/list-expense-reports-query.dto';
import { ReviseExpenseReportRequestDto } from './dto/revise-expense-report-request.dto';
import { SubmitExpenseReportRequestDto } from './dto/submit-expense-report-request.dto';
import {
  EXPENSE_REPORT_PROOF_FIELD,
  EXPENSE_REPORT_UPLOAD_OPTIONS,
} from './expense-report-upload.options';
import { toExpenseReportListCriteria } from './to-expense-report-list-criteria';
import { UploadedExpenseReportProof } from './uploaded-expense-report-proof';

/** Multipart body of an expense report form; a change adds `keepProof`. */
function formSchema(withKeepProof: boolean): SchemaObject {
  return {
    type: 'object',
    required: ['date', 'category', 'paymentMethod', 'amount', 'description', ...(withKeepProof ? ['keepProof'] : [])],
    properties: {
      date: { type: 'string', format: 'date' },
      category: { type: 'string' },
      paymentMethod: { type: 'string' },
      amount: { type: 'string' },
      vatRate: { type: 'string' },
      description: { type: 'string' },
      project: { type: 'string' },
      ...(withKeepProof ? { keepProof: { type: 'string', enum: ['true', 'false'] } } : {}),
      [EXPENSE_REPORT_PROOF_FIELD]: { type: 'string', format: 'binary' },
    },
  };
}

/**
 * The expense reports of the signed-in employee: theirs only, in their
 * company. The receipt is also open to an employer of that company.
 */
@ApiTags('expense-reports')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(CompanyScopeGuard)
export class ExpenseReportsController {
  constructor(
    @Inject(IListExpenseReports)
    private readonly listExpenseReports: IListExpenseReports,
    @Inject(ISubmitExpenseReport)
    private readonly submitExpenseReport: ISubmitExpenseReport,
    @Inject(IReviseExpenseReport)
    private readonly reviseExpenseReport: IReviseExpenseReport,
    @Inject(IViewExpenseReportProof)
    private readonly viewExpenseReportProof: IViewExpenseReportProof,
  ) {}

  @Get(API_ROUTES.companies.expenseReports)
  @ApiOperation({ summary: 'List my expense reports, with the filter counts and the key figures' })
  @ApiOkResponse({ type: ExpenseReportListResponseDto })
  list(
    @Actor() actor: ActorContext,
    @Query() query: ListExpenseReportsQueryDto,
  ): Promise<ExpenseReportList> {
    return this.listExpenseReports.execute({ actor, criteria: toExpenseReportListCriteria(query) });
  }

  @Post(API_ROUTES.companies.expenseReports)
  @ApiOperation({ summary: 'Submit an expense report for refund, with its receipt if any' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: formSchema(false) })
  @ApiOkResponse({ type: ExpenseReportSummaryResponseDto })
  @UseInterceptors(FileInterceptor(EXPENSE_REPORT_PROOF_FIELD, EXPENSE_REPORT_UPLOAD_OPTIONS))
  submit(
    @Actor() actor: ActorContext,
    @Body() body: SubmitExpenseReportRequestDto,
    @UploadedFile() proof: UploadedExpenseReportProof | undefined,
  ): Promise<ExpenseReportSummary> {
    return this.submitExpenseReport.execute({
      actor,
      submission: { details: this.toRequest(body), proof: this.toUpload(proof) },
    });
  }

  @Put(API_ROUTES.companies.expenseReport)
  @ApiOperation({ summary: 'Correct one of my expense reports while it is submitted' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: formSchema(true) })
  @ApiOkResponse({ type: ExpenseReportSummaryResponseDto })
  @UseInterceptors(FileInterceptor(EXPENSE_REPORT_PROOF_FIELD, EXPENSE_REPORT_UPLOAD_OPTIONS))
  revise(
    @Actor() actor: ActorContext,
    @Param('expenseReportId') expenseReportId: string,
    @Body() body: ReviseExpenseReportRequestDto,
    @UploadedFile() proof: UploadedExpenseReportProof | undefined,
  ): Promise<ExpenseReportSummary> {
    return this.reviseExpenseReport.execute({
      actor,
      expenseReportId,
      revision: {
        details: this.toRequest(body),
        proof: this.toUpload(proof),
        keepProof: body.keepProof === 'true',
      },
    });
  }

  @Get(API_ROUTES.companies.expenseReportProof)
  @ApiOperation({ summary: 'Open the receipt of an expense report (its owner, or an employer of the company)' })
  @ApiOkResponse({ type: ExpenseReportProofLinkResponseDto })
  viewProof(
    @Actor() actor: ActorContext,
    @Param('expenseReportId') expenseReportId: string,
  ): Promise<ExpenseReportProofLink> {
    return this.viewExpenseReportProof.execute({ actor, expenseReportId });
  }

  private toRequest(body: SubmitExpenseReportRequestDto): ExpenseReportRequest {
    return {
      date: body.date,
      category: body.category,
      paymentMethod: body.paymentMethod,
      amount: body.amount,
      vatRate: body.vatRate ?? null,
      description: body.description,
      project: body.project ?? null,
    };
  }

  private toUpload(proof: UploadedExpenseReportProof | undefined): ExpenseReportProofUpload | null {
    return proof === undefined ? null : { fileName: proof.originalname, content: proof.buffer };
  }
}
