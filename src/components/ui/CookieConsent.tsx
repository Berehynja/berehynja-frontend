import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Cookie, ShieldCheck, X } from "lucide-react";

const NOTICE_STORAGE_KEY = "privacy-notice-v15";
const NOTICE_VERSION = 1;
const PRIVACY_PATH = "/privacy";

interface StoredPrivacyNotice {
  version: number;
  acknowledged: true;
  acknowledgedAt: string;
}

const hasAcknowledgedNotice = () => {
  if (typeof window === "undefined") return true;

  try {
    const storedValue = localStorage.getItem(NOTICE_STORAGE_KEY);

    if (!storedValue) return false;

    const notice = JSON.parse(storedValue) as StoredPrivacyNotice;

    return (
      notice.version === NOTICE_VERSION &&
      notice.acknowledged === true
    );
  } catch {
    return false;
  }
};

export const CookieConsent = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleDismiss = useCallback(() => {
    const notice: StoredPrivacyNotice = {
      version: NOTICE_VERSION,
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(notice));
    } catch (error) {
      console.error("Could not save the privacy notice status:", error);
    }

    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!i18n.isInitialized) return;

    const shouldShowNotice =
      !hasAcknowledgedNotice() &&
      location.pathname !== PRIVACY_PATH;

    setIsVisible(shouldShowNotice);
  }, [i18n.isInitialized, location.pathname]);

  useEffect(() => {
    if (!isVisible) return;

    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleDismiss();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === NOTICE_STORAGE_KEY &&
        hasAcknowledgedNotice()
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("storage", handleStorage);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("storage", handleStorage);
      previouslyFocusedElement.current?.focus();
    };
  }, [handleDismiss, isVisible]);

  if (!i18n.isInitialized) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="font-nunito fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-6">
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-md"
          />

          <motion.section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={{ scale: 0.96, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 18 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.4)]"
          >
            <div className="flex items-start gap-3 px-4 pt-4 md:gap-4 md:px-6 md:pt-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-200">
                <ShieldCheck size={22} aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <h2
                  id={titleId}
                  className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl"
                >
                  {t("cookie.title")}
                </h2>

                <p
                  id={descriptionId}
                  className="mt-2 text-sm leading-6 text-slate-600 md:text-base md:leading-7"
                >
                  {t("cookie.description")}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleDismiss}
                aria-label={t("common.close", {
                  defaultValue: "Close",
                })}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>

            <div className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:mx-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-amber-600 shadow-sm">
                <Cookie size={20} aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-950 md:text-base">
                    {t("cookie.necessary_title")}
                  </h3>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                    {t("cookie.only_essential")}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t("cookie.necessary_desc")}
                </p>
              </div>
            </div>

            <footer className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
              <Link
                to={PRIVACY_PATH}
                className="w-fit rounded-md text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {t("privacy.title")}
              </Link>

              <button
                type="button"
                onClick={handleDismiss}
                className="min-h-11 cursor-pointer rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:min-w-40"
              >
                {t("cookie.acknowledge_button")}
              </button>
            </footer>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
};
