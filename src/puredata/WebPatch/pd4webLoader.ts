/// <reference path="./pd4web.d.ts" />

import pd4webDataUrl from "./pd4web.data?url";
import pd4webScriptUrl from "./pd4web.js?url";
import pd4webThreadsScriptUrl from "./pd4web.threads.js?url";
import pd4webWasmUrl from "./pd4web.wasm?url";

type Pd4WebModuleFactory = pd4web.Pd4WebModule;

export const pd4WebAssetUrls = {
  data: pd4webDataUrl,
  wasm: pd4webWasmUrl,
  script: pd4webScriptUrl,
  threads: pd4webThreadsScriptUrl,
} as const;

function loadClassicScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[data-pd4web-src="${src}"]`,
    );
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.pd4webSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function waitForCrossOriginIsolation(timeoutMs: number): Promise<boolean> {
  if (globalThis.crossOriginIsolated) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;
    const tick = () => {
      if (globalThis.crossOriginIsolated) {
        resolve(true);
        return;
      }
      if (Date.now() >= deadline) {
        resolve(false);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function crossOriginIsolationError(): Error {
  const { origin, pathname } = globalThis.location;
  return new Error(
    [
      "Pd4Web requires crossOriginIsolated (COEP/COOP headers on this page).",
      `Current page: ${origin}${pathname}`,
      "Checks:",
      "- Use http://localhost:4321/story/... when running npm run dev:hot (not port 3000).",
      "- Remove DEV_DISABLE_COEP=1 from .env if present.",
      "- Use Chrome or Edge (not private/incognito).",
      "- Hard-refresh after changing .env (Ctrl+Shift+R).",
    ].join("\n"),
  );
}

async function ensureCrossOriginIsolation(): Promise<void> {
  if (globalThis.crossOriginIsolated) {
    return;
  }

  // Story/preview pages must send COEP/COOP from the server (Vite dev plugin or
  // Express middleware). pd4web.threads.js registers a service worker scoped to
  // /_astro/ only, so it cannot isolate /story/ documents and may cause extra
  // reloads on Windows without fixing isolation.
  const isolated = await waitForCrossOriginIsolation(3000);
  if (!isolated) {
    throw crossOriginIsolationError();
  }
}

let loadPromise: Promise<Pd4WebModuleFactory> | undefined;

export default function loadPd4WebModuleFactory(): Promise<Pd4WebModuleFactory> {
  loadPromise ??= (async () => {
    console.info("[Pd4Web] loading assets", pd4WebAssetUrls);

    await ensureCrossOriginIsolation();
    await loadClassicScript(pd4webScriptUrl);

    const factory = (
      globalThis as typeof globalThis & {
        Pd4WebModule?: Pd4WebModuleFactory;
      }
    ).Pd4WebModule;
    if (!factory) {
      throw new Error("Pd4WebModule was not registered after loading pd4web.js");
    }

    return factory;
  })();

  return loadPromise;
}
