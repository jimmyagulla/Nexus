import { Module } from '@nestjs/common';
import { GetCompanySettingsUseCase } from '@hexagonal-monorepo-template/application';
import {
  ICompanyRepository,
  IGetCompanySettingsInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { CompanySettingsController } from '../../adapters/http/company-settings/company-settings.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [CompanyModule],
  controllers: [CompanySettingsController],
  providers: [
    {
      provide: IGetCompanySettingsInboundPort,
      useFactory: (companies: ICompanyRepository) =>
        new GetCompanySettingsUseCase(companies),
      inject: [ICompanyRepository],
    },
  ],
})
export class CompanySettingsModule {}
