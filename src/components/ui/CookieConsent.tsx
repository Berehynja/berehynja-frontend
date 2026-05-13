import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, X, ShieldCheck, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CookieConsent = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      const consent = localStorage.getItem('cookie-consent-v10');
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [i18n.isInitialized]);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent-v10', 'true');
    setIsVisible(false);
  };

  if (!i18n.isInitialized) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ФОНОВИЙ ОВЕРЛЕЙ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9998 bg-slate-900/15 backdrop-blur-md"
          />

          {/* КОНТЕЙНЕР (Центрування) */}
          <div className="fixed inset-0 z-10000 flex items-center justify-center p-4 pointer-events-none font-nunito">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="pointer-events-auto relative w-full max-w-[620px] overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/95 p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] backdrop-blur-2xl md:p-10"
            >
              {/* КНОПКА ЗАКРИТТЯ */}
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute right-8 top-8 text-slate-300 transition-colors hover:text-slate-500"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col gap-8">
                {/* ЗАГОЛОВОК */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                    <ShieldCheck size={28} />
                  </div>
                  <h4 className="text-2xl font-extrabold uppercase tracking-tight text-slate-800">
                    {t('cookie.title')}
                  </h4>
                </div>

                {/* ОСНОВНИЙ ТЕКСТ — ТЕПЕР БІЛЬШИЙ (text-base) */}
                <p className="text-base leading-relaxed text-slate-600 font-semibold">
                  {t('cookie.description')}
                </p>

                {/* ТЕХНІЧНА КАРТКА */}
                <div className="flex items-center justify-between gap-6 rounded-[2.2rem] border border-slate-100 bg-slate-50/70 p-6 md:p-8">
                  <div className="flex gap-5 items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm border border-slate-50">
                      <Cookie size={28} />
                    </div>
                    <div className="flex flex-col gap-1">
                      {/* ЗАГОЛОВОК БЛОКУ — ТЕПЕР text-[15px] */}
                      <span className="text-[15px] font-extrabold text-slate-800">
                        {t('cookie.necessary_title')}
                      </span>
                      {/* ОПИС ДАНИХ — ТЕПЕР text-[13px] */}
                      <span className="text-[13px] text-slate-500 font-bold leading-normal max-w-[320px]">
                        {t('cookie.necessary_desc')}
                      </span>
                    </div>
                  </div>

                  {/* Включений та заблокований повзунок */}
                  <div className="relative inline-flex h-7 w-12 shrink-0 cursor-not-allowed items-center rounded-full bg-blue-600/40">
                    <span className="translate-x-6 inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform" />
                  </div>
                </div>

                {/* ФУТЕР */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                    <Settings size={16} className="animate-spin-slow" />
                    <span>{t('cookie.only_essential')}</span>
                  </div>
                  
                  <button
                    onClick={handleAccept}
                    className="rounded-2xl bg-slate-900 px-9 py-4 text-[12px] font-black uppercase tracking-wider text-white transition-all hover:bg-blue-600 active:scale-95 shadow-sm"
                  >
                    {t('cookie.button')}
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