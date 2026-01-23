import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronUp } from "lucide-react";
import Flag from "react-country-flag";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const languagesArr = ["UA", "EN", "DE"];

export const LanguageSwitcher = () => {
  const [isOpenBurger, setIsOpenBurger] = useState(false);

  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const onClickHandler = () => setIsOpenBurger(!isOpenBurger);

  const onBlurHandler = () => setIsOpenBurger(false);

  const indicatorHandler = (lng: string) => {
    setIsOpenBurger(false);
    const newLang = lng.toLowerCase();
    i18n.changeLanguage(newLang);

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams?.set("lang", lng.toLowerCase());

    navigate({ pathname, search: newSearchParams.toString() });
  };

  return (
    <div
      className={`font-interMedium ease flex w-22 flex-col gap-3 overflow-hidden rounded-sm bg-white px-2.5 py-1.5 transition-all duration-400 lg:absolute lg:top-0 lg:right-0 lg:w-23 ${isOpenBurger ? "max-h-45" : "max-h-7.5"}`}
      tabIndex={0}
      onBlur={onBlurHandler}
    >
      <button
        className="group flex w-full cursor-pointer items-center justify-center"
        onClick={onClickHandler}
      >
        <Flag
          className="mr-1.5 h-3.5 w-5 rounded-xs"
          countryCode={i18n.language === "en" ? "gb" : i18n.language}
          svg
          alt="flag"
          aria-label="current language"
        />
        <span className="transition-colors duration-200 group-hover:text-blue-600">
          {i18n.language.toUpperCase()}
        </span>
        <ChevronUp
          className={`ease ml-auto h-5 w-5 transition-transform duration-200 ${isOpenBurger ? "rotate-x-0" : "rotate-x-180"} transition-colors duration-200 group-hover:stroke-blue-600`}
        />
      </button>
      {languagesArr
        .filter((lng) => lng !== i18n.language.toUpperCase())
        .map((lng) => (
          <button
            className="group flex w-full cursor-pointer items-center justify-start transition-colors duration-200"
            key={lng}
            onClick={() => indicatorHandler(lng)}
            aria-label="change language"
          >
            <Flag
              className="mr-1.5 h-3.5 w-5 rounded-xs"
              countryCode={lng === "EN" ? "gb" : lng}
              svg
              alt="flag"
            />
            <span className="group-hover:text-blue-600">{lng}</span>
          </button>
        ))}
    </div>
  );
};
