import { useState } from "react";
import { LogOut } from "lucide-react";
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
        className="group inline-flex h-13 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 whitespace-nowrap rounded-xl border border-red-200 bg-red-50 px-3 text-red-600 shadow-sm backdrop-blur-md transition-[color,background-color,border-color,box-shadow,transform] duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-md active:scale-95 focus-visible:ring-3 focus-visible:ring-red-500/25 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
      >
        <span className="text-[9px] leading-none font-bold tracking-[0.12em] text-red-500/70 uppercase group-hover:text-red-100">
          {t("adminLogout.adminMode")}
        </span>

        <span className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold">
          <LogOut
            size={18}
            strokeWidth={2}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
          />
          <span>Log out</span>
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
