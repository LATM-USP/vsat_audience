"use client";

import { Magic } from "magic-sdk";

import authenticateWithServer from "./authenticateWithServer.js";

// https://magic.link/docs/api/client-side-sdks/web#loginwithcredential
async function authenticateWithServerUsingCredential(
  publicKey: string,
  credential?: string,
) {
  const magic = new Magic(publicKey);
  const token = credential
    ? await magic.auth.loginWithCredential({
        credentialOrQueryString: credential,
      })
    : await magic.auth.loginWithCredential();

  if (!token) {
    throw new Error("No token received from login-with-credential");
  }

  return authenticateWithServer(token);
}

export default authenticateWithServerUsingCredential;
