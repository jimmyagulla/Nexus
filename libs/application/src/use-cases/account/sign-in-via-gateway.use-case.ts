import { SignedInSession } from '@hexagonal-monorepo-template/domain';
import { IAccountGateway, ISignIn } from '@hexagonal-monorepo-template/ports';

export class SignInViaGatewayUseCase implements ISignIn {
  constructor(private readonly accounts: IAccountGateway) {}

  execute(input: {
    identifier: string;
    secret: string;
  }): Promise<SignedInSession> {
    return this.accounts.signIn(input);
  }
}
