import type { ErrorCode } from "./errorCode.js";

export class ErrorCodedError extends Error {
  public readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string, options?: ErrorOptions) {
    super(message, options);

    this.errorCode = errorCode;
  }
}
