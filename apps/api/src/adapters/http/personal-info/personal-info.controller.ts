import { Body, Controller, Get, Inject, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ActorContext,
  PersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IGetPersonalInfo,
  IUpdatePersonalContact,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { PersonalInfoResponseDto } from './dto/personal-info-response.dto';
import { UpdatePersonalContactRequestDto } from './dto/update-personal-contact-request.dto';

/**
 * The personal information of an employee, inside the company of the actor.
 * Reading: the employee themselves, or an employer of the company. Changing
 * the contact details: the employee themselves only.
 */
@ApiTags('personal-info')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(CompanyScopeGuard)
export class PersonalInfoController {
  constructor(
    @Inject(IGetPersonalInfo)
    private readonly getPersonalInfo: IGetPersonalInfo,
    @Inject(IUpdatePersonalContact)
    private readonly updatePersonalContact: IUpdatePersonalContact,
  ) {}

  @Get(API_ROUTES.companies.employeePersonalInfo)
  @ApiOperation({ summary: 'Read the personal information of an employee (self or employer)' })
  @ApiOkResponse({ type: PersonalInfoResponseDto })
  @ApiForbiddenResponse({ description: 'Neither the employee nor an employer of the company' })
  get(
    @Actor() actor: ActorContext,
    @Param('employeeId') employeeId: string,
  ): Promise<PersonalInfoSnapshot> {
    return this.getPersonalInfo.execute({ actor, employeeId });
  }

  @Patch(API_ROUTES.companies.employeePersonalInfo)
  @ApiOperation({ summary: 'Change my contact details (the employee only)' })
  @ApiOkResponse({ type: PersonalInfoResponseDto })
  @ApiForbiddenResponse({ description: 'Not the employee themselves' })
  updateContact(
    @Actor() actor: ActorContext,
    @Param('employeeId') employeeId: string,
    @Body() body: UpdatePersonalContactRequestDto,
  ): Promise<PersonalInfoSnapshot> {
    return this.updatePersonalContact.execute({ actor, employeeId, contact: { ...body } });
  }
}
