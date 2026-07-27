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

function waitForCrossOriginIsolation(timeoutMs = 5000): Promise<void> {
  if (globalThis.crossOriginIsolated) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;
    const tick = () => {
      if (globalThis.crossOriginIsolated || Date.now() >= deadline) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

async function ensureCrossOriginIsolation(): Promise<void> {
  if (globalThis.crossOriginIsolated) {
    return;
  }

  // pd4web.threads.js installs a COI service worker when the page is not yet
  // cross-origin isolated. That helper only controls its own directory scope,
  // so preview/story pages must already send COEP/COOP headers from the server.
  await loadClassicScript(pd4webThreadsScriptUrl);
  await waitForCrossOriginIsolation();
}

let loadPromise: Promise<Pd4WebModuleFactory> | undefined;

export default function loadPd4WebModuleFactory(): Promise<Pd4WebModuleFactory> {
  loadPromise ??= (async () => {
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
