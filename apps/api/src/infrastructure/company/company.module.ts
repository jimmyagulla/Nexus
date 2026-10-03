import { Module } from '@nestjs/common';
import { CreateCompanyUseCase } from '@hexagonal-monorepo-template/application';
import {
  ICompanyRepository,
  ICreateCompanyInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { CompanyController } from '../../adapters/http/company/company.controller';
import { PrismaCompanyRepository } from '../../adapters/out/company/prisma-company.repository';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  controllers: [CompanyController],
  providers: [
    {
      provide: ICompanyRepository,
      useFactory: (prisma: PrismaDb) => new PrismaCompanyRepository(prisma),
      inject: [IPrismaDb],
    },
    {
      provide: ICreateCompanyInboundPort,
      useFactory: (companies: ICompanyRepository) =>
        new CreateCompanyUseCase(companies),
      inject: [ICompanyRepository],
    },
  ],
  exports: [ICompanyRepository],
})
export class CompanyModule {}
