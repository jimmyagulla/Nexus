import {
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';
import { CabinetExchangeResponseDto } from './dto/cabinet-exchange-response.dto';
import { ExchangeFileRequestDto } from './dto/exchange-file-request.dto';

export function toCabinetExchangeResponse(
  snapshot: CabinetExchangeSnapshot,
): CabinetExchangeResponseDto {
  return {
    id: snapshot.id,
    direction: snapshot.direction,
    status: snapshot.status,
    category: snapshot.category,
    document: snapshot.document === null ? null : { ...snapshot.document },
    senderId: snapshot.senderId,
    date: snapshot.date,
  };
}

export function toExchangeFileInput(
  file: ExchangeFileRequestDto | null | undefined,
): ExchangeFileInput | null {
  if (file === undefined || file === null) {
    return null;
  }
  return {
    fileName: file.fileName,
    mimeType: file.mimeType,
    content: new Uint8Array(Buffer.from(file.contentBase64, 'base64')),
  };
}
