import type { RequestHandler } from "express";

const headersToEnableSharedArrayBuffer = new Map([
  // credentialless keeps crossOriginIsolated enabled while still allowing
  // cross-origin Cloudinary media loaded by the A-Frame asset system.
  ["Cross-Origin-Embedder-Policy", "credentialless"],
  ["Cross-Origin-Opener-Policy", "same-origin"],
]);

const isSameOriginStaticAsset = (path: string) =>
  /\.(js|mjs|wasm|data|css)$/i.test(path);

/**
 * Middleware that adds headers to the response so that `SharedArrayBuffer`s
 * can be used.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated}
 */
function enableSharedArrayBufferMiddleware(): RequestHandler {
  return (req, res, next) => {
    const isPd4WebAsset =
      req.path.startsWith("/puredata/WebPatch/") ||
      /\/_astro\/pd4web\./.test(req.path);

    if (isPd4WebAsset || isSameOriginStaticAsset(req.path)) {
      res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    }

    /*
     * We only want to enable SharedArayBuffer support
     * on the subset of pages that actually need it.
     */
    if (req.path.startsWith("/story") || req.path.endsWith("/preview")) {
      res.setHeaders(headersToEnableSharedArrayBuffer);
    }

    return next();
  };
}

export default enableSharedArrayBufferMiddleware;
