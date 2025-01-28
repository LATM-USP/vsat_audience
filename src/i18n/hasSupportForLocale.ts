import type { i18n } from "i18next";

const NAMESPACE_DEFAULT = "translation";

export type HasSupportForLocale = (
  locale?: string | undefined,
  namespace?: string | undefined,
) => boolean;

export default function hasSupportForLocale(i18n: i18n): HasSupportForLocale {
  return (locale, namespace = NAMESPACE_DEFAULT) => {
    if (locale === undefined) {
      return false;
    }

    return !!i18n.getResourceBundle(locale, namespace ?? NAMESPACE_DEFAULT);
  };
}
