import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { isNonEmptyArray } from "@util/nonEmptyArray.js";

describe("isNonEmptyArray", () => {
  test("given an empty array returns false", () => {
    assert.equal(isNonEmptyArray([]), false);
  });

  test("given a singleton array returns true", () => {
    assert.equal(isNonEmptyArray([1]), true);
  });

  test("given the array [0,1,2] returns true", () => {
    assert.equal(isNonEmptyArray([0, 1, 2]), true);
  });

  test("given the array [null] returns true", () => {
    assert.equal(isNonEmptyArray([null]), true);
  });

  test("given the array [undefined] returns true", () => {
    assert.equal(isNonEmptyArray([undefined]), true);
  });
});
