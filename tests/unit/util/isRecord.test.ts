import assert from "node:assert/strict";
import { describe, test } from "node:test";

import isRecord from "@util/isRecord.js";

describe("isRecord", () => {
  test("given an object returns true", () => {
    assert.equal(isRecord({ key: "value" }), true);
  });

  test("given an empty object returns true", () => {
    assert.equal(isRecord({}), true);
  });

  test("given null returns false", () => {
    assert.equal(isRecord(null), false);
  });

  test("given an array returns false", () => {
    assert.equal(isRecord([]), false);
  });

  test("given a string returns false", () => {
    assert.equal(isRecord("string"), false);
  });

  test("given a number returns false", () => {
    assert.equal(isRecord(123), false);
  });

  test("given NaN returns false", () => {
    assert.equal(isRecord(Number.NaN), false);
  });

  test("given a boolean returns false", () => {
    assert.equal(isRecord(true), false);
  });

  test("given undefined returns false", () => {
    assert.equal(isRecord(undefined), false);
  });

  test("given a function returns false", () => {
    assert.equal(
      isRecord(() => {}),
      false,
    );
  });
});
