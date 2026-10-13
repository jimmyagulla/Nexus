import {
  ApiCabinetExchangeGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { DownloadCabinetExchangeFileFromSessionUseCase } from './download-cabinet-exchange-file-from-session.use-case';

const actor: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};

const payload = {
  fileName: 'a.pdf',
  mimeType: 'application/pdf',
  contentBase64: 'SGk=',
};

function useCaseFor(session: InMemorySessionGateway): DownloadCabinetExchangeFileFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/cabinet-exchanges/ex-1/file', {
    status: 200,
    data: payload,
  });
  return new DownloadCabinetExchangeFileFromSessionUseCase(session, new ApiCabinetExchangeGateway(http));
}

describe('DownloadCabinetExchangeFileFromSessionUseCase', () => {
  it('downloads the file of the exchange on the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute('ex-1')).resolves.toEqual({
      fileName: 'a.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([72, 105]),
    });
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute('ex-1')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute('ex-1')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
