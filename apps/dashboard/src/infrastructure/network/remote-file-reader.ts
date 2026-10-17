import { IHttpClient } from '@hexagonal-monorepo-template/ports';

/** Reads a file behind a short-lived link, through the HTTP client of the app. */
export class RemoteFileReader {
  constructor(private readonly httpClient: IHttpClient) {}

  /** The file, typed with its known media type. */
  async read(url: string, contentType: string): Promise<Blob> {
    const content = await this.httpClient.getBytes(url);
    return new Blob([content as Uint8Array<ArrayBuffer>], { type: contentType });
  }
}
