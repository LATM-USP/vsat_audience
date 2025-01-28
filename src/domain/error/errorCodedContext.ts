import type { ErrorCode, ErrorCodedContext } from "./errorCode.js";

export function errorCodedContext<CONTEXT extends Record<string, unknown>>(
  errorCode: ErrorCode,
  context?: CONTEXT,
): ErrorCodedContext<CONTEXT> {
  return {
    errorCode,
    context,
  };
}
