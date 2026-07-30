import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const pd4WebSourceDir = path.join(projectRoot, "src/puredata/WebPatch");

const coepHeaders = {
  // credentialless keeps crossOriginIsolated enabled while still allowing
  // cross-origin Cloudinary media loaded by the A-Frame asset system.
  "Cross-Origin-Embedder-Policy": "credentialless",
  "Cross-Origin-Opener-Policy": "same-origin",
};

const coepDisabled =
  process.env.DEV_DISABLE_COEP === "1" ||
  process.env.DEV_DISABLE_COEP === "true";

/** @type {Record<string, string>} */
const pd4WebContentTypes = {
  "pd4web.js": "text/javascript",
  "pd4web.threads.js": "text/javascript",
  "pd4web.wasm": "application/wasm",
  "pd4web.data": "application/octet-stream",
};

function needsCoepHeaders(pathname) {
  if (coepDisabled) {
    return false;
  }

  return pathname.startsWith("/story") || pathname.endsWith("/preview");
}

function isDocumentRequest(pathname) {
  return !/\.[a-z0-9]+$/i.test(pathname);
}

function applySharedArrayBufferHeaders(req, res) {
  const pathname = req.url?.split("?")[0] ?? "";
  const isDocument = isDocumentRequest(pathname);

  // COEP document headers belong on HTML only — never on scripts, wasm, or workers.
  if (needsCoepHeaders(pathname) && isDocument) {
    for (const [name, value] of Object.entries(coepHeaders)) {
      res.setHeader(name, value);
    }
    return;
  }

  // Subresources on COEP pages must opt in via CORP (+ CORS for fetch()).
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
}

/**
 * Emscripten pthread workers must load the compiled pd4web.js byte-for-byte.
 * Vite dev transforms anything under /src, so serve the raw build output here.
 */
function serveRawPd4WebAssets() {
  return (req, res, next) => {
    const pathname = req.url?.split("?")[0] ?? "";
    if (!pathname.startsWith("/puredata/WebPatch/")) {
      next();
      return;
    }

    const fileName = path.basename(pathname);
    const contentType = pd4WebContentTypes[fileName];
    if (!contentType) {
      next();
      return;
    }

    const filePath = path.join(pd4WebSourceDir, fileName);
    if (!fs.existsSync(filePath)) {
      next();
      return;
    }

    applySharedArrayBufferHeaders(req, res);
    res.setHeader("Content-Type", contentType);
    fs.createReadStream(filePath).pipe(res);
  };
}

/** @returns {import("vite").Plugin} */
export default function sharedArrayBufferDev() {
  return {
    name: "shared-array-buffer-dev",
    configureServer(server) {
      server.middlewares.use(serveRawPd4WebAssets());
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
