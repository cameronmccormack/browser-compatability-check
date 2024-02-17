import { BaseKompatError } from './base-kompat-error';

export class ClientError extends BaseKompatError {
  constructor(message: string) {
    super(message, 2);
  }
}
