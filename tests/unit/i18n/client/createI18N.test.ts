import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { createI18N } from "@i18n/client/useI18N.js";

describe("createI18N", () => {
  test("given existing translations for 'af' only" +
    " when we apply createI18N" +
    " then the created I18N contains those translations under 'af/translation'", () => {
    const i18n = createI18N({
      af: {
        title: "Fiela se kind",
      },
    });

    assert.deepStrictEqual(i18n.getResourceBundle("af", "translation"), {
      title: "Fiela se kind",
    });
  });

  test("given existing translations for 'af' and 'pt'" +
    " when we apply createI18N" +
    " then the created I18N contains those translations under 'af/translation'" +
    " and it does not contain the 'pt' translations", () => {
    const i18n = createI18N({
      af: {
        title: "Fiela se kind",
      },
      pt: {
        title: "Filho de Fiela",
      },
    });

    assert.deepStrictEqual(i18n.getResourceBundle("af", "translation"), {
      title: "Fiela se kind",
    });

    assert.equal(i18n.hasResourceBundle("t", "translation"), false);
  });

  test("given existing translations for 'af' and 'pt'" +
    " when we apply createI18N" +
    " then the created I18N contains those translations under 'af/translation'" +
    " and 'pt/translation'", () => {
    const i18n = createI18N({
      af: {
        title: "Fiela se kind",
      },
      pt: {
        title: "Filho de Fiela",
      },
    });

    assert.deepStrictEqual(i18n.getResourceBundle("af", "translation"), {
      title: "Fiela se kind",
    });

    assert.deepStrictEqual(i18n.getResourceBundle("pt", "translation"), {
      title: "Filho de Fiela",
    });
  });
});
