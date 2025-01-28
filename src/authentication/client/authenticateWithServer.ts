"use client";

import { isUser } from "../types.js";

async function authenticateWithServer(token: string) {
  const response = await fetch("/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    const user = await response.json();

    if (isUser(user)) {
      return user;
    }

    throw new Error("Invalid user returned from successful authentication");
  }

  throw new Error(`Authentication failed: "${response.status}"`);
}

export default authenticateWithServer;
