import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { isImageName } from "@domain/image/types.js";

describe("isImageName", () => {
  test("given the image name", async (t) => {
    const validNames = ["0-0", "1-1", "100-0", "0-100", "00-00"];
    for (const validName of validNames) {
      await t.test(`'${validName}' is valid`, () => {
        assert.equal(isImageName(validName), true);
      });
    }
  });

  test("given the image name", async (t) => {
    const validNames = ["-0", "1-", "a-0", "0-b", "-", "", " ", "0--0"];
    for (const validName of validNames) {
      await t.test(`'${validName}' is invalid`, () => {
        assert.equal(isImageName(validName), false);
      });
    }
  });
});
