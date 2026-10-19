import { Controller, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ActorContext,
  PayslipFileLink,
  PayslipList,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IDownloadPayslip,
  IExportPayslips,
  IListPayslips,
  IViewPayslip,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { ListPayslipsQueryDto } from './dto/list-payslips-query.dto';
import { PayslipFileLinkResponseDto } from './dto/payslip-file-link-response.dto';
import { PayslipListResponseDto } from './dto/payslip-list-response.dto';

/** The payslips of the signed-in employee: theirs only, in their company. */
@ApiTags('payslips')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(CompanyScopeGuard)
export class PayslipsController {
  constructor(
    @Inject(IListPayslips)
    private readonly listPayslips: IListPayslips,
    @Inject(IViewPayslip)
    private readonly viewPayslip: IViewPayslip,
    @Inject(IDownloadPayslip)
    private readonly downloadPayslip: IDownloadPayslip,
    @Inject(IExportPayslips)
    private readonly exportPayslips: IExportPayslips,
  ) {}

  @Get(API_ROUTES.companies.payslips)
  @ApiOperation({ summary: 'List my payslips of a year, January to December (metadata only)' })
  @ApiOkResponse({ type: PayslipListResponseDto })
  list(
    @Actor() actor: ActorContext,
    @Query() query: ListPayslipsQueryDto,
  ): Promise<PayslipList> {
    return this.listPayslips.execute({ actor, criteria: this.toCriteria(query) });
  }

  @Get(API_ROUTES.companies.payslipExport)
  @ApiOperation({ summary: 'Download links of every payslip of a year' })
  @ApiOkResponse({ type: [PayslipFileLinkResponseDto] })
  export(
    @Actor() actor: ActorContext,
    @Query() query: ListPayslipsQueryDto,
  ): Promise<PayslipFileLink[]> {
    return this.exportPayslips.execute({ actor, criteria: this.toCriteria(query) });
  }

  @Get(API_ROUTES.companies.payslipView)
  @ApiOperation({ summary: 'Open a payslip' })
  @ApiOkResponse({ type: PayslipFileLinkResponseDto })
  view(
    @Actor() actor: ActorContext,
    @Param('payslipId') payslipId: string,
  ): Promise<PayslipFileLink> {
    return this.viewPayslip.execute({ actor, payslipId });
  }

  @Get(API_ROUTES.companies.payslipDownload)
  @ApiOperation({ summary: 'Download a payslip' })
  @ApiOkResponse({ type: PayslipFileLinkResponseDto })
  download(
    @Actor() actor: ActorContext,
    @Param('payslipId') payslipId: string,
  ): Promise<PayslipFileLink> {
    return this.downloadPayslip.execute({ actor, payslipId });
  }

  private toCriteria(query: ListPayslipsQueryDto): PayslipListCriteria {
    return { year: query.year ?? null };
  }
}
