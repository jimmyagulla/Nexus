import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ActorContext,
  ExpenseReportList,
  ExpenseReportSummary,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IChangeExpenseReportStatus,
  IListEmployeeExpenseReports,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { ChangeExpenseReportStatusRequestDto } from './dto/change-expense-report-status-request.dto';
import { ExpenseReportListResponseDto } from './dto/expense-report-list-response.dto';
import { ExpenseReportSummaryResponseDto } from './dto/expense-report-summary-response.dto';
import { ListExpenseReportsQueryDto } from './dto/list-expense-reports-query.dto';
import { toExpenseReportListCriteria } from './to-expense-report-list-criteria';

/** The employer reads the expense reports of the company's employees, and alone moves them along. */
@ApiTags('expense-reports')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
@Roles(UserRole.EMPLOYER)
export class EmployerExpenseReportsController {
  constructor(
    @Inject(IListEmployeeExpenseReports)
    private readonly listEmployeeExpenseReports: IListEmployeeExpenseReports,
    @Inject(IChangeExpenseReportStatus)
    private readonly changeExpenseReportStatus: IChangeExpenseReportStatus,
  ) {}

  @Get(API_ROUTES.companies.employeeExpenseReports)
  @ApiOperation({ summary: 'List the expense reports of an employee of the company' })
  @ApiOkResponse({ type: ExpenseReportListResponseDto })
  list(
    @Actor() actor: ActorContext,
    @Param('employeeId') employeeId: string,
    @Query() query: ListExpenseReportsQueryDto,
  ): Promise<ExpenseReportList> {
    return this.listEmployeeExpenseReports.execute({
      actor,
      employeeId,
      criteria: toExpenseReportListCriteria(query),
    });
  }

  @Put(API_ROUTES.companies.expenseReportStatus)
  @ApiOperation({ summary: 'Move an expense report along; a refund or a refusal dates its processing' })
  @ApiOkResponse({ type: ExpenseReportSummaryResponseDto })
  changeStatus(
    @Actor() actor: ActorContext,
    @Param('expenseReportId') expenseReportId: string,
    @Body() body: ChangeExpenseReportStatusRequestDto,
  ): Promise<ExpenseReportSummary> {
    return this.changeExpenseReportStatus.execute({ actor, expenseReportId, status: body.status });
  }
}
