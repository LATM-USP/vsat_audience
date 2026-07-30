import type { RequestHandler } from "express";

const headersToEnableSharedArrayBuffer = new Map([
  // credentialless keeps crossOriginIsolated enabled while still allowing
  // cross-origin Cloudinary media loaded by the A-Frame asset system.
  ["Cross-Origin-Embedder-Policy", "credentialless"],
  ["Cross-Origin-Opener-Policy", "same-origin"],
]);

/**
 * Middleware that adds headers to the response so that `SharedArrayBuffer`s
 * can be used.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated}
 */
function enableSharedArrayBufferMiddleware(): RequestHandler {
  return (req, res, next) => {
    const isDocument =
      !/\.[a-z0-9]+$/i.test(req.path) && !req.path.startsWith("/api");

    if (isDocument && (req.path.startsWith("/story") || req.path.endsWith("/preview"))) {
      res.setHeaders(headersToEnableSharedArrayBuffer);
    } else if (!isDocument) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
    }

    return next();
  };
}

export default enableSharedArrayBufferMiddleware;
