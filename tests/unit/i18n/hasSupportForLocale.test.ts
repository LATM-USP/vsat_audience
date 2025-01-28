import assert from "node:assert/strict";
import { describe, test } from "node:test";

import i18next from "i18next";

import hasSupportForLocale from "@i18n/hasSupportForLocale.js";

describe("hasSupportForLocale", () => {
  test("given existing translations for 'af'" +
    " when we ask whether the we have support for 'af'" +
    " then it returns true", () => {
    const i18n = i18next.createInstance(
      {
        lng: "en",
        resources: {
          af: {
            translation: {
              title: "Fiela se kind",
            },
          },
        },
      },
      (err) => {
        if (err) {
          assert.fail(err);
        }
      },
    );

    const hasSupport = hasSupportForLocale(i18n)("af");

    assert.equal(hasSupport, true);
  });

  test("given no existing translations for 'af'" +
    " when we ask whether the we have support for 'af'" +
    " then it returns false", () => {
    const i18n = i18next.createInstance(
      {
        lng: "en",
        resources: {
          ne: {
            translation: {
              title: "Fiela's child",
            },
          },
        },
      },
      (err) => {
        if (err) {
          assert.fail(err);
        }
      },
    );

    const hasSupport = hasSupportForLocale(i18n)("af");

    assert.equal(hasSupport, false);
  });
});
