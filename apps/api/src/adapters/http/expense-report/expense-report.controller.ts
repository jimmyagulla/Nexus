import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IAddExpense,
  IAttachReceipt,
  ICreateExpenseReport,
  IGetExpenseReport,
  IGetReceipt,
  IListExpenseReports,
  IRemoveExpense,
  ISubmitExpenseReport,
  IUpdateExpense,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { AttachReceiptRequestDto } from './dto/attach-receipt-request.dto';
import { CreateExpenseReportRequestDto } from './dto/create-expense-report-request.dto';
import { ExpenseReportListResponseDto } from './dto/expense-report-list-response.dto';
import { ExpenseReportResponseDto } from './dto/expense-report-response.dto';
import { ExpenseRequestDto } from './dto/expense-request.dto';
import { ReceiptFileResponseDto } from './dto/receipt-file-response.dto';
import { toExpenseReportResponse } from './expense-report.mapper';

@ApiTags('expense-reports')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
export class ExpenseReportController {
  constructor(
    @Inject(ICreateExpenseReport)
    private readonly createReport: ICreateExpenseReport,
    @Inject(IAddExpense)
    private readonly addExpense: IAddExpense,
    @Inject(IGetExpenseReport)
    private readonly getReport: IGetExpenseReport,
    @Inject(IListExpenseReports)
    private readonly listReports: IListExpenseReports,
    @Inject(IUpdateExpense)
    private readonly updateExpense: IUpdateExpense,
    @Inject(IRemoveExpense)
    private readonly removeExpense: IRemoveExpense,
    @Inject(IAttachReceipt)
    private readonly attachReceipt: IAttachReceipt,
    @Inject(IGetReceipt)
    private readonly getReceipt: IGetReceipt,
    @Inject(ISubmitExpenseReport)
    private readonly submitReport: ISubmitExpenseReport,
  ) {}

  @Post(API_ROUTES.companies.expenseReports)
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Open a draft expense report' })
  async create(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Body() body: CreateExpenseReportRequestDto,
  ): Promise<ExpenseReportResponseDto> {
    const report = await this.createReport.execute({
      actor,
      companyId,
      label: body.label,
    });
    return toExpenseReportResponse(report);
  }

  @Get(API_ROUTES.companies.expenseReports)
  @Roles(UserRole.EMPLOYER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'List the expense reports the actor can see' })
  async list(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
  ): Promise<ExpenseReportListResponseDto> {
    const list = await this.listReports.execute({ actor, companyId });
    return {
      canCreate: list.canCreate,
      reports: list.reports.map(toExpenseReportResponse),
    };
  }

  @Get(API_ROUTES.companies.expenseReport)
  @Roles(UserRole.EMPLOYER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get an expense report' })
  async get(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('expenseReportId') reportId: string,
  ): Promise<ExpenseReportResponseDto> {
    const report = await this.getReport.execute({
      actor,
      companyId,
      reportId,
    });
    return toExpenseReportResponse(report);
  }

  @Patch(API_ROUTES.companies.expenseReportExpense)
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Modify an expense of a draft expense report' })
  async modify(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('expenseReportId') reportId: string,
    @Param('expenseId') expenseId: string,
    @Body() body: ExpenseRequestDto,
  ): Promise<ExpenseReportResponseDto> {
    const report = await this.updateExpense.execute({
      actor,
      companyId,
      reportId,
      expenseId,
      expense: { ...body, vat: body.vat ?? null },
    });
    return toExpenseReportResponse(report);
  }

  @Delete(API_ROUTES.companies.expenseReportExpense)
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Remove an expense from a draft expense report' })
  async remove(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('expenseReportId') reportId: string,
    @Param('expenseId') expenseId: string,
  ): Promise<ExpenseReportResponseDto> {
    const report = await this.removeExpense.execute({
      actor,
      companyId,
      reportId,
      expenseId,
    });
    return toExpenseReportResponse(report);
  }

  @Get(API_ROUTES.companies.expenseReportReceipt)
  @Roles(UserRole.EMPLOYER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Download a receipt of an expense report' })
  async downloadReceipt(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('expenseReportId') reportId: string,
    @Param('receiptId') receiptId: string,
  ): Promise<ReceiptFileResponseDto> {
    const file = await this.getReceipt.execute({
      actor,
      companyId,
      reportId,
      receiptId,
    });
    return {
      id: file.id,
      fileName: file.fileName,
      mimeType: file.mimeType,
      contentBase64: Buffer.from(file.content).toString('base64'),
    };
  }

  @Post(API_ROUTES.companies.expenseReportReceipts)
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Attach a receipt to a draft expense report' })
  async attach(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('expenseReportId') reportId: string,
    @Body() body: AttachReceiptRequestDto,
  ): Promise<ExpenseReportResponseDto> {
    const report = await this.attachReceipt.execute({
      actor,
      companyId,
      reportId,
      receipt: {
        fileName: body.fileName,
        mimeType: body.mimeType,
        content: new Uint8Array(Buffer.from(body.contentBase64, 'base64')),
        expenseId: body.expenseId ?? null,
      },
    });
    return toExpenseReportResponse(report);
  }

  @Post(API_ROUTES.companies.expenseReportSubmission)
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Submit an expense report' })
  async submit(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('expenseReportId') reportId: string,
  ): Promise<ExpenseReportResponseDto> {
    const report = await this.submitReport.execute({
      actor,
      companyId,
      reportId,
    });
    return toExpenseReportResponse(report);
  }

  @Post(API_ROUTES.companies.expenseReportExpenses)
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Add an expense to a draft expense report' })
  async add(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('expenseReportId') reportId: string,
    @Body() body: ExpenseRequestDto,
  ): Promise<ExpenseReportResponseDto> {
    const report = await this.addExpense.execute({
      actor,
      companyId,
      reportId,
      expense: { ...body, vat: body.vat ?? null },
    });
    return toExpenseReportResponse(report);
  }
}
