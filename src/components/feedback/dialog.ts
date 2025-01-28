import type { i18n } from "i18next";
import SweetAlert, { type SweetAlertResult } from "sweetalert2";

export type Dialog = {
  yesNo: (
    key: string,
    context?: Record<string, unknown>,
  ) => Promise<SweetAlertResult>;
};

export function dialogUsingSweetAlert(i18n: i18n): Dialog {
  const cancelButtonText = i18n.t("common.no");
  const confirmButtonText = i18n.t("common.yes");

  return {
    yesNo(key, context) {
      return SweetAlert.fire({
        text: context ? i18n.t(key, context) : i18n.t(key),
        icon: "question",
        showConfirmButton: true,
        confirmButtonText,
        showCancelButton: true,
        cancelButtonText,
        reverseButtons: true,
        focusConfirm: false,
      });
    },
  };
}
