import ReactCountryFlag from 'react-country-flag';
import { LangugeIcon } from "../icons/LangugeIcon";
import { LangugeBox } from "./LanguageSwitcher.styled";

export const LanguageSwitcher = () => {
  return (
    <LangugeBox>
        <span>
              <ReactCountryFlag
                countryCode="ua"
                svg
                style={{
                  width: '20px',
                  height: '14px',
                  borderRadius: '2px',
                  marginRight: '15px'
                }}
                title="UA"
              />
            </span>
      <span>UA</span>
      <LangugeIcon />
    </LangugeBox>
  );
};
