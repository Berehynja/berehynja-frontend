import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Cookie, X, ShieldCheck, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CookieConsent = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      const consent = localStorage.getItem("cookie-consent-v14");
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [i18n.isInitialized]);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent-v14", "true");
    setIsVisible(false);
  };

  if (!i18n.isInitialized) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ФОНОВИЙ ОВЕРЛЕЙ З РОЗМИТТЯМ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9998 bg-slate-900/20 backdrop-blur-md"
          />

          {/* КОНТЕЙНЕР (Центрування) */}
          <div className="font-nunito pointer-events-none fixed inset-0 z-10000 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="pointer-events-auto relative w-full max-w-[480px] overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/95 p-7 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
            >
              {/* КНОПКА ЗАКРИТТЯ */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-6 right-6 z-10 p-2 text-slate-300 transition-colors hover:text-slate-500"
              >
                <X size={24} />
              </button>

              <div className="font-nunito flex flex-col gap-6">
                {/* 1. ГОЛОВНИЙ ЗАГОЛОВОК (Іконка + Текст) */}
                <div className="font-nunito flex items-center gap-3 pr-12">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="font-nunito text-[19px] leading-tight font-extrabold tracking-tight text-slate-800 uppercase">
                    {t("cookie.title")}
                  </h4>
                </div>

                {/* 2. ОСНОВНИЙ ТЕКСТ */}
                <p className="font-nunito px-1 text-[16px] leading-relaxed font-bold text-slate-600">
                  {t("cookie.description")}
                </p>

                {/* 3. ТЕХНІЧНИЙ БЛОК (Іконка + Підзаголовок в один ряд) */}
                <div className="font-nunito flex flex-col gap-4 rounded-4xl border border-slate-100 bg-slate-50/70 p-6">
                  {/* Ряд: Іконка + Назва + Повзунок */}
                  <div className="font-nunito flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-50 bg-white text-amber-600 shadow-sm">
                      <Cookie size={24} />
                    </div>
                    <span className="font-nunito text-[16px] font-extrabold tracking-tight text-slate-800">
                      {t("cookie.necessary_title")}
                    </span>

                    {/* Toggle Switch */}
                    <div className="relative ml-auto inline-flex h-6 w-11 shrink-0 cursor-not-allowed items-center rounded-full bg-blue-600/30">
                      <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white shadow-sm" />
                    </div>
                  </div>

                  {/* Опис технічних даних */}
                  <p className="font-nunito px-1 text-[14px] leading-normal font-bold text-slate-500">
                    {t("cookie.necessary_desc")}
                  </p>
                </div>

                {/* 4. ФУТЕР (Кнопка та Статус) */}
                <div className="font-nunito flex flex-col gap-5 border-t border-slate-100 pt-4">
                  <div className="font-nunito flex items-center justify-center gap-2 text-[11px] font-black tracking-[0.12em] text-slate-400 uppercase">
                    {/* Іконка залишається на місці */}
                    <Settings size={15} className="animate-spin-slow shrink-0" />

                    {/* 
      Додаємо translate-y-[1px], щоб візуально "осадити" Nunito на центральну вісь.
      leading-none прибирає зайвий простір зверху/знизу.
  */}
                    <span className="translate-y-[1px] leading-none">
                      {t("cookie.only_essential")}
                    </span>
                  </div>

                  <button
                    onClick={handleAccept}
                    className="font-nunito w-full rounded-2xl bg-slate-900 py-4 text-[10px] tracking-widest text-white uppercase shadow-md transition-all hover:bg-blue-600 active:scale-[0.98]"
                  >
                    {t("cookie.button")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
