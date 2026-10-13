import { Module } from '@nestjs/common';
import { ConfirmSecondFactorEnrollmentUseCase } from '@hexagonal-monorepo-template/application';
import {
  IAccountRepository,
  IClock,
  IConfirmSecondFactorEnrollment,
  IEmployeeRepository,
  ISecondFactorCodes,
  ISecondFactorEnrollmentRepository,
  ISignInSession,
} from '@hexagonal-monorepo-template/ports';
import { SecondFactorEnrollmentController } from '../../adapters/http/second-factor/second-factor-enrollment.controller';
import { AccountModule } from '../account/account.module';
import { EmployeeModule } from '../employee/employee.module';
import { SecondFactorModule } from '../second-factor/second-factor.module';

@Module({
  imports: [AccountModule, EmployeeModule, SecondFactorModule],
  controllers: [SecondFactorEnrollmentController],
  providers: [
    {
      provide: IConfirmSecondFactorEnrollment,
      useFactory: (
        enrollments: ISecondFactorEnrollmentRepository,
        accounts: IAccountRepository,
        employees: IEmployeeRepository,
        codes: ISecondFactorCodes,
        sessions: ISignInSession,
        clock: IClock,
      ) =>
        new ConfirmSecondFactorEnrollmentUseCase(
          enrollments,
          accounts,
          employees,
          codes,
          sessions,
          clock,
        ),
      inject: [
        ISecondFactorEnrollmentRepository,
        IAccountRepository,
        IEmployeeRepository,
        ISecondFactorCodes,
        ISignInSession,
        IClock,
      ],
    },
  ],
})
export class SecondFactorEnrollmentModule {}
