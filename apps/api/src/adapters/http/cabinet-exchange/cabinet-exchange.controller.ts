import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  ICreateCabinetExchangeDraft,
  IListCabinetExchanges,
  IMarkCabinetExchangeToTransmit,
  ITransmitCabinetExchanges,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import {
  toCabinetExchangeResponse,
  toExchangeFileInput,
} from './cabinet-exchange.mapper';
import { CabinetExchangeResponseDto } from './dto/cabinet-exchange-response.dto';
import { CreateCabinetExchangeDraftRequestDto } from './dto/create-cabinet-exchange-draft-request.dto';
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
  @ApiOperation({ summary: 'List the exchanges of the company' })
  async listAll(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
  ): Promise<CabinetExchangeResponseDto[]> {
    const snapshots = await this.list.execute({ actor, companyId });
    return snapshots.map(toCabinetExchangeResponse);
  }
}
