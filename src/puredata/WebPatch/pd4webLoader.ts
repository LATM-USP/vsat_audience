/// <reference path="./pd4web.d.ts" />

type Pd4WebModuleFactory = pd4web.Pd4WebModule;

/**
 * Compiled pd4web assets are served from /puredata/WebPatch/ so they bypass
 * Vite transforms (Emscripten pthread workers require the raw script bytes).
 *
 * @see vite/sharedArrayBufferDev.mjs (dev) and scripts/copyPd4web.mjs (prod)
 */
const PD4WEB_BASE = "/puredata/WebPatch";
const SW_CLEANUP_KEY = "pd4webSwCleanupDone";

export const pd4WebAssetUrls = {
  data: `${PD4WEB_BASE}/pd4web.data`,
  wasm: `${PD4WEB_BASE}/pd4web.wasm`,
  script: `${PD4WEB_BASE}/pd4web.js`,
  threads: `${PD4WEB_BASE}/pd4web.threads.js`,
} as const;

/** Blob URL passed to Emscripten as mainScriptUrlOrBlob so pthread workers skip COEP network checks. */
export let pd4WebMainScriptUrlOrBlob: string | undefined;

/**
 * A stale coi-serviceworker (from pd4web.threads.js) intercepts /puredata/WebPatch/*
 * and attaches document COEP headers to script responses. Unregister and reload once.
 */
async function ensureNoCoiServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  const coiRegistrations = registrations.filter((registration) =>
    registration.scope.includes("/puredata/WebPatch"),
  );
  const hasController = Boolean(navigator.serviceWorker.controller);

  if (coiRegistrations.length === 0 && !hasController) {
    return;
  }

  await Promise.all(coiRegistrations.map((registration) => registration.unregister()));

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "deregister" });
  }

  if (!sessionStorage.getItem(SW_CLEANUP_KEY)) {
    sessionStorage.setItem(SW_CLEANUP_KEY, "1");
    window.location.reload();
    await new Promise<void>(() => {
      // Reload in progress.
    });
  }
}

/**
 * Fetch pd4web.js, run it from a blob URL, and keep that URL for pthread workers.
 * Loading the network URL directly in workers is blocked under COEP (Chrome/Firefox).
 */
async function loadPd4WebScriptFromBlob(): Promise<string> {
  if (pd4WebMainScriptUrlOrBlob) {
    return pd4WebMainScriptUrlOrBlob;
  }

  const response = await fetch(pd4WebAssetUrls.script, { credentials: "same-origin" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${pd4WebAssetUrls.script}: ${response.status}`);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  pd4WebMainScriptUrlOrBlob = blobUrl;

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[data-pd4web-src="${blobUrl}"]`,
    );
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = blobUrl;
    script.async = false;
    script.dataset.pd4webSrc = blobUrl;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to execute pd4web.js from blob URL"));
    document.head.appendChild(script);
  });

  return blobUrl;
}

let loadPromise: Promise<Pd4WebModuleFactory> | undefined;

export default function loadPd4WebModuleFactory(): Promise<Pd4WebModuleFactory> {
  loadPromise ??= (async () => {
    await ensureNoCoiServiceWorker();
    await loadPd4WebScriptFromBlob();

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
