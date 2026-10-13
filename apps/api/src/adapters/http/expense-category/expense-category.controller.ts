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
import {
  ActorContext,
  ExpenseCategorySnapshot,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  IAddExpenseCategory,
  IListExpenseCategories,
} from '@hexagonal-monorepo-template/ports';
import { Actor } from '../common/guards/auth/actor.decorator';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { Roles } from '../common/guards/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { ExpenseCategoryRequestDto } from './dto/expense-category-request.dto';
import { ExpenseCategoryResponseDto } from './dto/expense-category-response.dto';

@ApiTags('expense-categories')
@ApiBearerAuth()
@Controller(API_ROUTES.companies.base)
@UseGuards(RolesGuard, CompanyScopeGuard)
export class ExpenseCategoryController {
  constructor(
    @Inject(IListExpenseCategories)
    private readonly listCategories: IListExpenseCategories,
    @Inject(IAddExpenseCategory)
    private readonly addCategory: IAddExpenseCategory,
  ) {}

  @Get(API_ROUTES.companies.expenseCategories)
  @Roles(UserRole.EMPLOYER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'List the expense categories of the company' })
  async list(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
  ): Promise<ExpenseCategoryResponseDto[]> {
    const categories = await this.listCategories.execute({ actor, companyId });
    return categories.map(toResponse);
  }

  @Post(API_ROUTES.companies.expenseCategories)
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Add an expense category to the company' })
  async add(
    @Actor() actor: ActorContext,
    @Param('companyId') companyId: string,
    @Body() body: ExpenseCategoryRequestDto,
  ): Promise<ExpenseCategoryResponseDto[]> {
    const categories = await this.addCategory.execute({
      actor,
      companyId,
      label: body.label,
    });
    return categories.map(toResponse);
  }
}

function toResponse(category: ExpenseCategorySnapshot): ExpenseCategoryResponseDto {
  return { id: category.id, label: category.label };
}
