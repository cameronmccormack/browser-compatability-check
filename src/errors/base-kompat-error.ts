export class BaseKompatError extends Error {
  exitCode: 1 | 2;
  message: string;

  constructor(message: string, exitCode: 1 | 2) {
    super(message);
    this.exitCode = exitCode;
    this.message = message;
  }
}
