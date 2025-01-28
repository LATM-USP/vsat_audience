import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { isAudioName } from "@domain/audio/types.js";

describe("isAudioName", () => {
  test("given the audio name", async (t) => {
    const validNames = ["0-0", "1-1", "100-0", "0-100", "00-00"];
    for (const validName of validNames) {
      await t.test(`'${validName}' is valid`, () => {
        assert.equal(isAudioName(validName), true);
      });
    }
  });

  test("given the audio name", async (t) => {
    const validNames = ["-0", "1-", "a-0", "0-b", "-", "", " ", "0--0"];
    for (const validName of validNames) {
      await t.test(`'${validName}' is invalid`, () => {
        assert.equal(isAudioName(validName), false);
      });
    }
  });
});
