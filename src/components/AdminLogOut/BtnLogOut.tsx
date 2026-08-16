import { useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { logout } from "./AdminLogOut";
import { ConfirmModal } from "../Modals/ConfirmModal";

export default function AdminLogout() {
  const { t } = useTranslation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleCloseConfirm = () => {
    if (isLoggingOut) return;
    setIsConfirmOpen(false);
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      setIsConfirmOpen(false);
      toast.success(t("adminLogout.success"));
    } catch {
      toast.error(t("adminLogout.error"));
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isLoggingOut}
        aria-label={t("adminLogout.ariaLabel")}
        title={t("adminLogout.ariaLabel")}
        className="group inline-flex h-13 w-22 shrink-0 cursor-pointer flex-col items-stretch justify-center gap-1 rounded-lg border border-slate-200 bg-white/95 px-2 py-1.5 text-[10px] leading-tight font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:shadow-md active:scale-[0.97] focus-visible:ring-3 focus-visible:ring-blue-500/25 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
      >
        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          <ShieldCheck
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="size-3.5 shrink-0 text-blue-600"
          />
          <span>{t("adminLogout.adminShort")}</span>
        </span>

        <span
          aria-hidden="true"
          className="h-px w-full bg-slate-200 transition-colors group-hover:bg-red-200"
        />

        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-red-600 group-hover:text-red-700">
          <LogOut
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          />
          <span>{t("adminLogout.exitShort")}</span>
        </span>
      </button>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
        title={t("adminLogout.confirmTitle")}
        message={t("adminLogout.confirmMessage")}
        cancelLabel={t("adminLogout.cancel")}
        confirmLabel={t("adminLogout.confirm")}
        loadingLabel={t("adminLogout.loggingOut")}
        confirmIcon={<LogOut size={18} aria-hidden="true" />}
      />
    </>
  );
}
