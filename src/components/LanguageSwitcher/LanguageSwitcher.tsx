import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import Flag from "react-country-flag";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import type { MenuTheme } from "../Header/HeaderNav";

interface LanguageSwitcherProps {
  variant?: MenuTheme;
}

const LANGUAGES = ["UA", "EN", "DE"];

export const LanguageSwitcher = ({
  variant = "light",
}: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const isDark = variant === "dark";

  const currentLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toUpperCase();

  useEffect(() => {
    document.documentElement.lang =
      currentLanguage === "UA" ? "uk" : currentLanguage.toLowerCase();
  }, [currentLanguage]);

  const changeLanguage = (language: string) => {
    setIsOpen(false);

    const nextLanguage = language.toLowerCase();
    void i18n.changeLanguage(nextLanguage);

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("lang", nextLanguage);

    navigate({ pathname, search: nextSearchParams.toString() });
  };

  const getCountryCode = (language: string) =>
    language === "EN" ? "GB" : language;

  return (
    <div
      tabIndex={0}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsOpen(false);
      }}
      className={`font-nunito flex w-26 flex-col gap-3 overflow-hidden rounded-xl border px-3 py-2 shadow-sm transition-[max-height] duration-300 lg:absolute lg:top-0 lg:right-0 lg:w-23 lg:rounded-sm lg:border-transparent lg:bg-white lg:px-2.5 lg:py-1.5 lg:text-slate-900 lg:shadow-none ${
        isOpen ? "max-h-40 lg:max-h-45" : "max-h-10 lg:max-h-7.5"
      } ${
        isDark
          ? "border-white/15 bg-white/10 text-white"
          : "border-slate-200 bg-white/90 text-slate-800"
      }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={t("common.selectLanguage", {
          defaultValue: "Select language",
        })}
        onClick={() => setIsOpen((open) => !open)}
        className="group flex min-h-6 w-full cursor-pointer items-center justify-center font-semibold"
      >
        <Flag
          className="mr-2 h-3.5 w-5 shrink-0 -translate-y-px rounded-xs"
          countryCode={getCountryCode(currentLanguage)}
          svg
          alt=""
          aria-hidden="true"
        />
        <span className="group-hover:text-blue-400 lg:group-hover:text-blue-700">
          {currentLanguage}
        </span>
        <ChevronUp
          size={19}
          aria-hidden="true"
          className={`ml-auto transition-transform duration-200 group-hover:text-blue-400 lg:group-hover:text-blue-700 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {LANGUAGES.filter((language) => language !== currentLanguage).map(
        (language) => (
          <button
            type="button"
            key={language}
            onClick={() => changeLanguage(language)}
            aria-label={t("common.changeLanguage", {
              defaultValue: `Change language to ${language}`,
            })}
            className={`group flex min-h-7 w-full cursor-pointer items-center rounded-lg font-semibold ${
              isDark
                ? "hover:bg-white/10 hover:text-blue-200"
                : "hover:bg-blue-50 hover:text-blue-700"
            } lg:hover:bg-blue-50 lg:hover:text-blue-700`}
          >
            <Flag
              className="mr-2 h-3.5 w-5 shrink-0 -translate-y-px rounded-xs"
              countryCode={getCountryCode(language)}
              svg
              alt=""
              aria-hidden="true"
            />
            <span>{language}</span>
          </button>
        ),
      )}
    </div>
  );
};
