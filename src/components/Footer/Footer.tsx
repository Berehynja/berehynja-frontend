import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useAuth } from "../AuthProvider/useAuth";
import { Heart, Phone, Mail, MapPin, ChevronUp, ExternalLink, ShieldCheck, FileText } from "lucide-react";
import { SocialMedia } from "../SocialMedia/SocialMedia";
import { NavLink, useNavigate } from "react-router-dom";

// --- Універсальна секція для мобільної та десктопної версії ---
const FooterSection = ({ title, isOpen, toggle, children, isMobile }: { title: string; isOpen: boolean; toggle: () => void; children: React.ReactNode; isMobile: boolean }) => (
  <div className="flex flex-col">
    <button 
      onClick={() => isMobile && toggle()}
      className="flex w-full items-center justify-between border-b border-white/10 py-5 md:cursor-default md:border-0 md:py-0"
    >
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">{title}</h2>
      {isMobile && (
        <ChevronUp className={`transition-transform duration-500 ${isOpen ? "" : "rotate-180"}`} size={20} />
      )}
    </button>
    <div className={`overflow-hidden transition-all duration-500 ${
      isMobile ? (isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0") : "max-h-none opacity-100 mt-6"
    }`}>
      <div className="flex flex-col gap-4 text-[15px] font-medium text-gray-200">
        {children}
      </div>
    </div>
  </div>
);

export const Footer = () => {
  const [isOpenContacts, setIsOpenContacts] = useState(false);
  const [isOpenAdress, setIsOpenAdress] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  const screenWidth = useWindowSize();
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = screenWidth < 768;

  const handleHeartClick = () => {
    if (isAdmin) return;
    setClickCount(prev => prev + 1);
  };

  useEffect(() => {
    if (clickCount === 5) {
      navigate('/login');
      setClickCount(0);
    }
    const timer = setTimeout(() => setClickCount(0), 3000);
    return () => clearTimeout(timer);
  }, [clickCount, navigate]);

  return (
    <footer className="relative w-full overflow-hidden bg-[#0a192f] font-nunito text-white">
      {/* Декоративні градієнти на фоні */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-yellow-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-20">
          
          {/* Блок 1: Бренд та Соцмережі */}

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500 to-yellow-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a192f]">
                  <span className="text-xl font-black italic">B</span>
                </div>
              </div>
              <h1 className="text-2xl font-black tracking-tighter">BEREHYNJA</h1>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Ми створюємо простір для розвитку, підтримки та єднання української громади в Бад-Ейнгаузені. Разом ми сильніші.
            </p>
            {!isMobile && <SocialMedia />}
          </div>

          {/* <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-yellow-400 font-black italic shadow-lg">
                B
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">Berehynja</h1>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              Ми створюємо простір для розвитку, підтримки та єднання української громади в Бад-Ейнгаузені. Разом ми сильніші.
              Культурно-освітній центр для українців у Бад-Ейнгаузені. Підтримка, навчання та єднання.
            </p>
            {!isMobile && <SocialMedia />}
          </div> */}

          {/* Блок 2: Контакти */}
          <FooterSection 
            title={t("footer.contacts")} 
            isOpen={isOpenContacts} 
            toggle={() => setIsOpenContacts(!isOpenContacts)} 
            isMobile={isMobile}
          >
            <a href="tel:+4915128161383" className="group flex items-center gap-4 transition-all hover:text-blue-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-blue-500/20">
                <Phone size={18} className="text-blue-400" />
              </div>
              <span>+49 151 28161383</span>
            </a>
            <a href="mailto:bereginia.badoeynhausen@gmail.com" className="group flex items-center gap-4 transition-all hover:text-blue-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-blue-500/20">
                <Mail size={18} className="text-blue-400" />
              </div>
              <span className="truncate">bereginia.badoeynhausen@gmail.com</span>
            </a>
          </FooterSection>

          {/* Блок 3: Адреса та Місто */}
          <FooterSection 
            title={t("footer.adress")} 
            isOpen={isOpenAdress} 
            toggle={() => setIsOpenAdress(!isOpenAdress)} 
            isMobile={isMobile}
          >
            <a 
              href="https://www.badoeynhausen.de/startseite" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center gap-4 transition-all hover:text-yellow-400"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 group-hover:bg-yellow-500/10">
                <ExternalLink size={18} className="text-yellow-500" />
              </div>
              <span className="font-bold">Bad-Oeynhausen, Germany</span>
            </a>

            <a 
              href="https://www.google.com/maps/search/?api=1&query=Weserstraße+24+32545+Bad+Oeynhausen" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-start gap-4 transition-all hover:text-blue-400"
            >
              {/* Однотипна іконка SVG (MapPin) */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 group-hover:bg-blue-500/20">
                <MapPin size={18} className="text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight">32545 Weserstraße 24</span>
                <span className="text-[13px] text-blue-400 ">{t("footer.location")}</span>
              </div>
            </a>
          </FooterSection>
        </div>

        {/* Соцмережі для мобілки */}
        {isMobile && (
          <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
            <SocialMedia />
          </div>
        )}

        {/* Нижня панель: Копірайт та Юридичні посилання */}
        <div className="mt-12 flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-8 md:flex-row">
          <p className="flex items-center gap-2 text-[13px] text-yellow-200">
            {t("footer.madeWith")} 
            <Heart 
              size={18} 
              onClick={handleHeartClick} 
              className="text-red-600"
              fill={clickCount > 0 ? "currentColor" : "none"}
            /> 
            for the Ukrainian community
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <div className="flex gap-6 text-[12px] font-black uppercase tracking-widest text-gray-400">
              <NavLink to="/impressum" className="flex items-center gap-2 transition-colors hover:text-white">
                <FileText size={14} className="text-blue-500" /> Impressum
              </NavLink>
              <NavLink to="/privacy" className="flex items-center gap-2 transition-colors hover:text-white">
                <ShieldCheck size={14} className="text-yellow-500" /> Datenschutz
              </NavLink>
            </div>
            <span className="text-[12px] font-bold text-gray-600">© 2026 Berehynja</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
