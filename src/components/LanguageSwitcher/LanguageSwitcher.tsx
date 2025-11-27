import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Flag,
  LangDefault,
  LangItem,
  LangList,
  LangugeBox,
} from "./LanguageSwitcher.styled";
import { CaretDown } from "../icons/CaretDown";

const languagesArr = ["UA", "EN", "DE"];


export const LanguageSwitcher = () => {

  const [isClickBurger, setIsClickBurger] = useState(false);

  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const {pathname} = useLocation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const onClickHandler = () => setIsClickBurger(!isClickBurger);

  const onBlurHandler = () => {
    setIsClickBurger(false);
  };

  const indicatorHandler = (lng: string) => {
     const searchParams = new URLSearchParams();
     searchParams.set("lng", lng.toLowerCase());
   
   navigate({ pathname, search: searchParams.toString() });
    i18n.changeLanguage(lng.toLowerCase());
  };

  return (
    <LangugeBox
      tabIndex={0}
      onBlur={onBlurHandler}
      onClick={onClickHandler}
    >
      <LangDefault isClickBurger={isClickBurger}>
        <Flag
          countryCode={i18n.language === "en" ? "gb" : i18n.language}
          svg
        />
        <span>{i18n.language.toUpperCase()}</span>
        <CaretDown />
      </LangDefault>
      {isClickBurger && (
        <LangList>
          {languagesArr
            .filter((lng) => lng !== i18n.language.toUpperCase())
            .map((lng) => (
              <LangItem key={lng} onClick={() => indicatorHandler(lng)}>
                <Flag
                  countryCode={lng === "EN" ? "gb" : lng}
                  svg
                />
                <span>{lng}</span>
              </LangItem>
            ))}
        </LangList>
      )}
    </LangugeBox>
  );
};
