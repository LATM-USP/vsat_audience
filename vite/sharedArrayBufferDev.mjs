const coepHeaders = {
  // credentialless keeps crossOriginIsolated enabled while still allowing
  // cross-origin Cloudinary media loaded by the A-Frame asset system.
  "Cross-Origin-Embedder-Policy": "credentialless",
  "Cross-Origin-Opener-Policy": "same-origin",
};

const coepDisabled =
  process.env.DEV_DISABLE_COEP === "1" ||
  process.env.DEV_DISABLE_COEP === "true";

function needsCoepHeaders(pathname) {
  if (coepDisabled) {
    return false;
  }

  return pathname.startsWith("/story") || pathname.endsWith("/preview");
}

function isPd4WebAsset(pathname) {
  return (
    pathname.startsWith("/puredata/WebPatch/") ||
    pathname.startsWith("/src/puredata/WebPatch/") ||
    /\/_astro\/pd4web\./.test(pathname)
  );
}

function isSameOriginStaticAsset(pathname) {
  return /\.(js|mjs|wasm|data|css)$/i.test(pathname);
}

function isDocumentRequest(pathname) {
  return !/\.[a-z0-9]+$/i.test(pathname);
}

function applySharedArrayBufferHeaders(req, res) {
  const pathname = req.url?.split("?")[0] ?? "";

  if (isPd4WebAsset(pathname) || isSameOriginStaticAsset(pathname)) {
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  }

  if (needsCoepHeaders(pathname) && isDocumentRequest(pathname)) {
    for (const [name, value] of Object.entries(coepHeaders)) {
      res.setHeader(name, value);
    }
  }
}

/** @returns {import("vite").Plugin} */
export default function sharedArrayBufferDev() {
  return {
    name: "shared-array-buffer-dev",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        applySharedArrayBufferHeaders(req, res);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        applySharedArrayBufferHeaders(req, res);
        next();
      });
    },
  };
}
