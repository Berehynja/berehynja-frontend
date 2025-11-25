import { useEffect, useState, type FocusEvent } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  LangDefault,
  LangItem,
  LangList,
  LangugeBox,
} from "./LanguageSwitcher.styled";
import { CaretDown } from "../icons/CaretDown";

const languages = ["UA", "GB", "DE"];

export const LanguageSwitcher = () => {
  const [langIndicator, setLangIndicator] = useState("");
  console.log("🚀 ~ langIndicator:", langIndicator);
  const [isClickBurger, setIsClickBurger] = useState(false);

  useEffect(() => {
    if (!langIndicator) {
      setLangIndicator("UA");
    }
  }, [langIndicator]);

  const onClickHandler = () => setIsClickBurger(!isClickBurger);

  const onBlurHandler = (e: FocusEvent<HTMLDivElement>) => {
    console.log("🚀 ~ e:", e.target);
    setIsClickBurger(false);
  };

  const indicatorHandler = (language: string) => {
    setLangIndicator(language);
  };

  return (
    <LangugeBox tabIndex={0} onBlur={(e) => {console.log('click onblur'); onBlurHandler(e)}} onClick={onClickHandler}>
      <LangDefault isClickBurger = {isClickBurger}>
        <ReactCountryFlag
          countryCode={langIndicator}
          svg
          style={{
            width: "20px",
            height: "14px",
            borderRadius: "2px",
            marginRight: "5px",
          }}
          // title="UA"
        />
        <span>{langIndicator === "GB" ? "EN" : langIndicator}</span>
        <CaretDown />
      </LangDefault>
      {isClickBurger && (
        <LangList>
          {languages
            .filter((lang) => lang !== langIndicator)
            .map((lang) => (
              <LangItem key={lang} onClick={() => indicatorHandler(lang)}>
                <ReactCountryFlag
                  countryCode={lang}
                  svg
                  style={{
                    width: "20px",
                    height: "14px",
                    borderRadius: "2px",
                    marginRight: "5px",
                  }}
                  // title="UA"
                />
                <span>{lang === "GB" ? "EN" : lang}</span>
              </LangItem>
            ))}
        </LangList>
      )}
    </LangugeBox>
  );
};
