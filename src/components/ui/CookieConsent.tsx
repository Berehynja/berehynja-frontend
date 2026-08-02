import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Cookie, Settings, ShieldCheck, X } from "lucide-react";

const CONSENT_STORAGE_KEY = "cookie-consent-v14";

export const CookieConsent = () => {
  const { t, i18n } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!i18n.isInitialized) return;

    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!storedConsent) setIsVisible(true);
  }, [i18n.isInitialized]);

  useEffect(() => {
    if (!isVisible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleDismiss();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleDismiss, isVisible]);

  if (!i18n.isInitialized) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="font-nunito fixed inset-0 z-10000 flex items-center justify-center p-4 md:p-6">
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={{ scale: 0.96, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 18 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.4)]"
          >
            <header className="flex items-start gap-4 border-b border-slate-200 px-5 py-5 md:px-7">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-200">
                <ShieldCheck size={22} aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <h2
                  id={titleId}
                  className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl"
                >
                  {t("cookie.title")}
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleDismiss}
                aria-label={t("common.close", { defaultValue: "Close" })}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-6 px-5 py-6 md:px-7">
              <p
                id={descriptionId}
                className="text-base leading-7 font-normal text-slate-600"
              >
                {t("cookie.description")}
              </p>

              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-amber-600 shadow-sm">
                    <Cookie size={22} aria-hidden="true" />
                  </div>

                  <h3 className="text-base font-semibold text-slate-900">
                    {t("cookie.necessary_title")}
                  </h3>

                  <span
                    role="switch"
                    aria-checked="true"
                    aria-disabled="true"
                    aria-label={t("cookie.necessary_title")}
                    className="relative ml-auto inline-flex h-7 w-12 shrink-0 cursor-not-allowed items-center rounded-full bg-blue-600"
                  >
                    <span className="flex size-5 translate-x-6 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                      <Check size={13} strokeWidth={3} aria-hidden="true" />
                    </span>
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 font-normal text-slate-600">
                  {t("cookie.necessary_desc")}
                </p>
              </section>
            </div>

            <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 md:px-7">
              <div className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <Settings size={15} aria-hidden="true" />
                <span>{t("cookie.only_essential")}</span>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full cursor-pointer rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {t("cookie.button")}
              </button>
            </footer>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
};
