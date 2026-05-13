import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, X, ShieldCheck, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent-v4');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent-v4', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[10000] mx-auto max-w-[650px]"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-8">
            
            {/* Кнопка закриття */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute right-6 top-6 text-slate-300 transition-colors hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col gap-6">
              {/* Заголовок */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                  <ShieldCheck size={22} />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight text-slate-800">
                  {t('cookie.title')}
                </h4>
              </div>

              <p className="text-sm font-medium text-slate-500 px-1">
                {t('cookie.description')}
              </p>

              {/* Блок з повзунком (Necessary Cookies) */}
              <div className="flex items-start justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 transition-all hover:bg-slate-100/50">
                <div className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
                    <Cookie size={22} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">{t('cookie.necessary_title')}</p>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {t('cookie.necessary_desc')}
                    </p>
                  </div>
                </div>

                {/* Повзунок (Заблокований/Включений) */}
                <div className="flex items-center pt-1">
                  <div className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed items-center rounded-full bg-blue-600 opacity-50">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </div>
                </div>
              </div>

              {/* Кнопка підтвердження */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <Settings size={14} className="animate-spin-slow" />
                  <span>Only essential</span>
                </div>
                
                <button
                  onClick={handleAccept}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-600 active:scale-95 sm:w-auto"
                >
                  <span className="relative z-10">{t('cookie.button')}</span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-blue-600 to-blue-400 transition-transform duration-300 group-hover:translate-x-0" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};