import { BaseKompatError } from './base-kompat-error';

export class InternalError extends BaseKompatError {
  constructor(message: string) {
    super(message, 1);
  }
}
