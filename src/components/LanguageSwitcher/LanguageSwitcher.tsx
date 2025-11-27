import { useState, type FocusEvent } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import {
  LangDefault,
  LangItem,
  LangList,
  LangugeBox,
} from "./LanguageSwitcher.styled";
import { CaretDown } from "../icons/CaretDown";

const languagesArr = ["UA", "EN", "DE"];

export const LanguageSwitcher = () => {
//   const [langIndicator, setLangIndicator] = useState("");
//   console.log("🚀 ~ langIndicator:", langIndicator);
  const [isClickBurger, setIsClickBurger] = useState(false);
    const { i18n } = useTranslation();

//   useEffect(() => {
//     if (!langIndicator) {
//       setLangIndicator("UA");
//     }
//   }, [langIndicator]);
  const onClickHandler = () => setIsClickBurger(!isClickBurger);

  const onBlurHandler = (e: FocusEvent<HTMLDivElement>) => {
    console.log("🚀 ~ e:", e.target);
    setIsClickBurger(false);
  };

  const indicatorHandler = (lang: string) => {
    // setLangIndicator(lang);
    i18n.changeLanguage(lang.toLowerCase());
  };

  return (
    <LangugeBox tabIndex={0} onBlur={(e) => {console.log('click onblur'); onBlurHandler(e)}} onClick={onClickHandler}>
      <LangDefault isClickBurger = {isClickBurger}>
        <ReactCountryFlag
          countryCode={i18n.language === "en" ? "gb" : i18n.language}
          svg
          style={{
            width: "20px",
            height: "14px",
            borderRadius: "2px",
            marginRight: "5px",
          }}
          // title="UA"
        />
        <span>{i18n.language.toUpperCase()}</span>
        <CaretDown />
      </LangDefault>
      {isClickBurger && (
        <LangList>
          {languagesArr
            .filter((lang) => lang !== i18n.language.toUpperCase())
            .map((lang) => (
              <LangItem key={lang} onClick={() => indicatorHandler(lang)}>
                <ReactCountryFlag
                  countryCode={lang === "EN" ? "GB" : lang}
                  svg
                  style={{
                    width: "20px",
                    height: "14px",
                    borderRadius: "2px",
                    marginRight: "5px",
                  }}
                  // title="UA"
                />
                <span>{lang}</span>
              </LangItem>
            ))}
        </LangList>
      )}
    </LangugeBox>
  );
};
