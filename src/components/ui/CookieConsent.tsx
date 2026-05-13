import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, X, ShieldCheck, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CookieConsent = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Чекаємо ініціалізації мови перед показом
    if (i18n.isInitialized) {
      const consent = localStorage.getItem('cookie-consent-v7');
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [i18n.isInitialized]);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent-v7', 'true');
    setIsVisible(false);
  };

  // Не рендеримо нічого, поки i18n не визначить мову користувача
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

          {/* КОНТЕЙНЕР МОДАЛКИ (Центрування без sm:) */}
          <div className="fixed inset-0 z-10000 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="pointer-events-auto relative w-full max-w-[580px] overflow-hidden rounded-4xl border border-white/50 bg-white/95 p-8 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              {/* КНОПКА ЗАКРИТТЯ */}
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute right-6 top-6 text-slate-300 transition-colors hover:text-slate-500"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col gap-6">
                {/* ЗАГОЛОВОК */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="text-lg font-extrabold uppercase tracking-tight text-slate-800">
                    {t('cookie.title')}
                  </h4>
                </div>

                {/* ОПИС */}
                <p className="text-sm leading-relaxed text-slate-500">
                  {t('cookie.description')}
                </p>

                {/* ТЕХНІЧНИЙ БЛОК (Disabled Toggle) */}
                <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="flex gap-4 items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
                      <Cookie size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">
                        {t('cookie.necessary_title')}
                      </span>
                      <span className="text-[11px] text-slate-400 leading-tight">
                        {t('cookie.necessary_desc')}
                      </span>
                    </div>
                  </div>

                  <div className="relative inline-flex h-6 w-10 shrink-0 cursor-not-allowed items-center rounded-full bg-blue-600/40">
                    <span className="translate-x-5 inline-block h-4 w-4 transform rounded-full bg-white shadow-sm" />
                  </div>
                </div>

                {/* НИЖНЯ ПАНЕЛЬ: ТЕКСТ + ЛАКОНІЧНА КНОПКА */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    <Settings size={14} className="animate-spin-slow" />
                    <span>{t('cookie.only_essential')}</span>
                  </div>
                  
                  <button
                    onClick={handleAccept}
                    className="rounded-xl bg-slate-900 px-7 py-3 text-[11px] font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-600 active:scale-95 shadow-sm"
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