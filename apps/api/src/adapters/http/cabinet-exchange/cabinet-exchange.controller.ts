import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  ICreateCabinetExchangeDraft,
  IDepositCabinetExchange,
  IDownloadCabinetExchangeFile,
  IGetCabinetIndicators,
  IListCabinetExchangeHistory,
  IListCabinetExchanges,
  IMarkCabinetExchangeToTransmit,
  IOpenCabinetExchange,
  ITransmitCabinetExchanges,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import {
  toCabinetExchangeResponse,
  toExchangeFileInput,
  toExchangeFileResponse,
} from './cabinet-exchange.mapper';
import { CabinetIndicatorsResponseDto } from './dto/cabinet-indicators-response.dto';
import { CabinetExchangeResponseDto } from './dto/cabinet-exchange-response.dto';
import { CreateCabinetExchangeDraftRequestDto } from './dto/create-cabinet-exchange-draft-request.dto';
import { DepositCabinetExchangeRequestDto } from './dto/deposit-cabinet-exchange-request.dto';
import { ExchangeFileResponseDto } from './dto/exchange-file-response.dto';
import { ExchangeHistoryEntryResponseDto } from './dto/exchange-history-entry-response.dto';
import { ListCabinetExchangesQueryDto } from './dto/list-cabinet-exchanges-query.dto';
import { MarkCabinetExchangeToTransmitRequestDto } from './dto/mark-cabinet-exchange-to-transmit-request.dto';
import { TransmitCabinetExchangesRequestDto } from './dto/transmit-cabinet-exchanges-request.dto';

@ApiTags('cabinet-exchanges')
@ApiBearerAuth()
@Controller(API_ROUTES.cabinetExchanges.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
@Roles(UserRole.EMPLOYER)
export class CabinetExchangeController {
  constructor(
    @Inject(ICreateCabinetExchangeDraft)
    private readonly createDraft: ICreateCabinetExchangeDraft,
    @Inject(IMarkCabinetExchangeToTransmit)
    private readonly markToTransmit: IMarkCabinetExchangeToTransmit,
    @Inject(ITransmitCabinetExchanges)
    private readonly transmit: ITransmitCabinetExchanges,
    @Inject(IListCabinetExchanges)
    private readonly list: IListCabinetExchanges,
    @Inject(IOpenCabinetExchange)
    private readonly open: IOpenCabinetExchange,
    @Inject(IDownloadCabinetExchangeFile)
    private readonly download: IDownloadCabinetExchangeFile,
    @Inject(IDepositCabinetExchange)
    private readonly deposit: IDepositCabinetExchange,
    @Inject(IListCabinetExchangeHistory)
    private readonly history: IListCabinetExchangeHistory,
    @Inject(IGetCabinetIndicators)
    private readonly indicators: IGetCabinetIndicators,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an exchange draft for the cabinet' })
  async create(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Body() body: CreateCabinetExchangeDraftRequestDto,
  ): Promise<CabinetExchangeResponseDto> {
    const snapshot = await this.createDraft.execute({
      actor,
      companyId,
      category: body.category ?? null,
      file: toExchangeFileInput(body.file),
    });
    return toCabinetExchangeResponse(snapshot);
  }

  @Post(API_ROUTES.cabinetExchanges.toTransmit)
  @ApiOperation({ summary: 'Mark an exchange draft as ready to transmit' })
  async markReady(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('exchangeId') exchangeId: string,
    @Body() body: MarkCabinetExchangeToTransmitRequestDto,
  ): Promise<CabinetExchangeResponseDto> {
    const snapshot = await this.markToTransmit.execute({
      actor,
      companyId,
      exchangeId,
      category: body.category ?? null,
      file: toExchangeFileInput(body.file),
    });
    return toCabinetExchangeResponse(snapshot);
  }

  @Post(API_ROUTES.cabinetExchanges.transmission)
  @ApiOperation({ summary: 'Transmit ready exchanges to the cabinet' })
  async send(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Body() body: TransmitCabinetExchangesRequestDto,
  ): Promise<CabinetExchangeResponseDto[]> {
    const snapshots = await this.transmit.execute({
      actor,
      companyId,
      exchangeIds: body.exchangeIds,
    });
    return snapshots.map(toCabinetExchangeResponse);
  }

  @Get()
  @Roles(UserRole.EMPLOYER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'List the exchanges the actor may see' })
  async listAll(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Query() query: ListCabinetExchangesQueryDto,
  ): Promise<CabinetExchangeResponseDto[]> {
    const snapshots = await this.list.execute({
      actor,
      companyId,
      filters: { ...query },
    });
    return snapshots.map(toCabinetExchangeResponse);
  }

  @Get(API_ROUTES.cabinetExchanges.indicators)
  @ApiOperation({ summary: 'Publish the indicators of the cabinet exchanges' })
  async publishIndicators(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
  ): Promise<CabinetIndicatorsResponseDto> {
    return this.indicators.execute({ actor, companyId });
  }

  @Get(API_ROUTES.cabinetExchanges.history)
  @Roles(UserRole.EMPLOYER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Tell the history of all the exchanges' })
  async allHistory(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
  ): Promise<ExchangeHistoryEntryResponseDto[]> {
    const entries = await this.history.execute({
      actor,
      companyId,
      exchangeId: null,
    });
    return entries.map((entry) => ({ ...entry }));
  }

  @Get(API_ROUTES.cabinetExchanges.exchangeHistory)
  @Roles(UserRole.EMPLOYER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Tell the history of one exchange' })
  async exchangeHistory(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('exchangeId') exchangeId: string,
  ): Promise<ExchangeHistoryEntryResponseDto[]> {
    const entries = await this.history.execute({
      actor,
      companyId,
      exchangeId,
    });
    return entries.map((entry) => ({ ...entry }));
  }

  @Post(API_ROUTES.cabinetExchanges.deposit)
  @Roles(UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Deposit a document from the cabinet to the company' })
  async depositDocument(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Body() body: DepositCabinetExchangeRequestDto,
  ): Promise<CabinetExchangeResponseDto> {
    const snapshot = await this.deposit.execute({
      actor,
      companyId,
      category: body.category,
      file: toExchangeFileInput(body.file),
    });
    return toCabinetExchangeResponse(snapshot);
  }

  @Post(API_ROUTES.cabinetExchanges.consultation)
  @Roles(UserRole.EMPLOYER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Open an exchange, which consults it' })
  async consult(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('exchangeId') exchangeId: string,
  ): Promise<CabinetExchangeResponseDto> {
    const snapshot = await this.open.execute({ actor, companyId, exchangeId });
    return toCabinetExchangeResponse(snapshot);
  }

  @Get(API_ROUTES.cabinetExchanges.file)
  @Roles(UserRole.EMPLOYER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Download the file of an exchange' })
  async downloadFile(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Param('exchangeId') exchangeId: string,
  ): Promise<ExchangeFileResponseDto> {
    const file = await this.download.execute({ actor, companyId, exchangeId });
    return toExchangeFileResponse(file);
  }
}
