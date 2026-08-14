import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronUp,
  ExternalLink,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import { useAuth } from "../AuthProvider/useAuth";
import { SocialMedia } from "../SocialMedia/SocialMedia";
import type { LangKey } from "../../types/types";

interface FooterSectionProps {
  title: string;
  isOpen: boolean;
  toggle: () => void;
  children: ReactNode;
  isMobile: boolean;
}

const FooterSection = ({
  title,
  isOpen,
  toggle,
  children,
  isMobile,
}: FooterSectionProps) => (
  <section className="flex flex-col">
    <button
      type="button"
      onClick={() => isMobile && toggle()}
      aria-expanded={isMobile ? isOpen : true}
      className={`flex w-full items-center justify-between border-b border-white/10 py-5 text-left md:cursor-default md:border-0 md:py-0 ${
        isMobile ? "cursor-pointer" : ""
      }`}
    >
      <h2 className="text-base font-semibold tracking-wide text-blue-200 uppercase md:text-lg">
        {title}
      </h2>

      {isMobile && (
        <ChevronUp
          size={20}
          aria-hidden="true"
          className={`transition-transform duration-500 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      )}
    </button>

    <div
      className={`overflow-hidden transition-all duration-500 ${
        isMobile
          ? isOpen
            ? "mt-4 max-h-96 opacity-100"
            : "max-h-0 opacity-0"
          : "mt-6 max-h-none opacity-100"
      }`}
    >
      <div className="flex flex-col gap-4 text-base leading-7 font-medium text-gray-200 md:text-lg">
        {children}
      </div>
    </div>
  </section>
);

const FOOTER_STATIC_TEXT = {
  description: {
    ua: "Ми створюємо простір для розвитку, підтримки та єднання української громади. Разом ми сильніші.",
    de: "Wir schaffen einen Raum für Entwicklung, Unterstützung und Zusammenhalt der ukrainischen Gemeinschaft. Gemeinsam sind wir stärker.",
    en: "We create a space for growth, support and unity for the Ukrainian community. Together we are stronger.",
  },
  cityCountry: {
    ua: "Бад-Ейнгаузен, Німеччина",
    de: "Bad Oeynhausen, Deutschland",
    en: "Bad Oeynhausen, Germany",
  },
  community: {
    ua: "для української громади",
    de: "für die ukrainische Gemeinschaft",
    en: "for the Ukrainian community",
  },
} satisfies Record<string, Record<LangKey, string>>;

export const Footer = () => {
  const [isOpenContacts, setIsOpenContacts] = useState(false);
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const screenWidth = useWindowSize();
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = screenWidth < 768;

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toLowerCase();
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const handleHeartClick = () => {
    if (isAdmin) return;
    setClickCount((previousCount) => previousCount + 1);
  };

  useEffect(() => {
    if (clickCount === 5) {
      navigate("/login");
      setClickCount(0);
    }

    const timer = setTimeout(() => setClickCount(0), 3000);
    return () => clearTimeout(timer);
  }, [clickCount, navigate]);

  return (
    <footer className="font-nunito relative w-full overflow-hidden bg-[#0a192f] text-white">
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-yellow-500/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500 to-yellow-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a192f]">
                  <span className="text-xl font-semibold italic">B</span>
                </div>
              </div>

              <p className="text-2xl font-semibold tracking-tight">BEREHYNJA</p>
            </div>

            <p className="max-w-md text-base leading-7 font-medium text-gray-300 md:text-lg md:leading-8">
              {FOOTER_STATIC_TEXT.description[currentLang]}
            </p>

            {!isMobile && <SocialMedia />}
          </div>

          <FooterSection
            title={t("footer.contacts")}
            isOpen={isOpenContacts}
            toggle={() => setIsOpenContacts((isOpen) => !isOpen)}
            isMobile={isMobile}
          >
            <a
              href="tel:+4915128161383"
              className="group flex cursor-pointer items-center gap-4 transition-all hover:text-blue-300"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-blue-500/20">
                <Phone size={18} className="text-blue-300" aria-hidden="true" />
              </div>
              <span>+49 151 28161383</span>
            </a>

            <a
              href="mailto:bereginia.badoeynhausen@gmail.com"
              className="group flex cursor-pointer items-center gap-4 transition-all hover:text-blue-300"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-blue-500/20">
                <Mail size={18} className="text-blue-300" aria-hidden="true" />
              </div>
              <span className="min-w-0 truncate">
                bereginia.badoeynhausen@gmail.com
              </span>
            </a>
          </FooterSection>

          <FooterSection
            title={t("footer.adress")}
            isOpen={isOpenAddress}
            toggle={() => setIsOpenAddress((isOpen) => !isOpen)}
            isMobile={isMobile}
          >
            <a
              href="https://www.badoeynhausen.de/startseite"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex cursor-pointer items-center gap-4 transition-all hover:text-yellow-300"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-yellow-500/10">
                <ExternalLink
                  size={18}
                  className="text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <span className="font-semibold">
                {FOOTER_STATIC_TEXT.cityCountry[currentLang]}
              </span>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Weserstraße+24+32545+Bad+Oeynhausen"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex cursor-pointer items-start gap-4 transition-all hover:text-blue-300"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-blue-500/20">
                <MapPin
                  size={18}
                  className="text-blue-300"
                  aria-hidden="true"
                />
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="text-base font-semibold tracking-tight md:text-lg">
                  Weserstraße 24, 32545
                </span>
                <span className="text-sm leading-6 font-medium text-blue-300 md:text-base">
                  {t("footer.location")}
                </span>
              </div>
            </a>
          </FooterSection>
        </div>

        {isMobile && (
          <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
            <SocialMedia />
          </div>
        )}

        <div className="mt-12 flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-8 md:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-2 text-sm leading-6 font-medium text-yellow-100 md:justify-start md:text-base">
            {t("footer.madeWith")}
            <Heart
              size={18}
              onClick={handleHeartClick}
              aria-hidden="true"
              className={
                isAdmin ? "text-red-500" : "cursor-pointer text-red-500"
              }
              fill={clickCount > 0 ? "currentColor" : "none"}
            />
            {FOOTER_STATIC_TEXT.community[currentLang]}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <nav
              aria-label="Legal"
              className="flex gap-6 text-sm font-semibold tracking-wide text-gray-300 uppercase md:text-base"
            >
              <NavLink
                to="/impressum"
                className="flex cursor-pointer items-center gap-2 transition-colors hover:text-white"
              >
                <FileText
                  size={16}
                  className="text-blue-400"
                  aria-hidden="true"
                />
                Impressum
              </NavLink>

              <NavLink
                to="/privacy"
                className="flex cursor-pointer items-center gap-2 transition-colors hover:text-white"
              >
                <ShieldCheck
                  size={16}
                  className="text-yellow-400"
                  aria-hidden="true"
                />
                Datenschutz
              </NavLink>
            </nav>

            <span className="text-sm font-medium text-gray-400 md:text-base">
              © 2026 Berehynja
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
