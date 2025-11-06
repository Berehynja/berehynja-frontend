import { useState } from "react";
import {
  ArrowWraper,
  ContactsList,
  FooterBox,
  FooterContainer,
  FooterH2Styled,
  FooterLinkStyled,
  FooterList,
  FooterStyled,
  InfoLink,
  InfoList,
  LicenseLink,
  SocialLinkStyled,
  SocialListStyled,
} from "./Footer.styled";
import { useWindowSize } from "../../hooks/useWindowSize";
import { CaretDown } from "../icons/CaretDown";
import { EmailIcon } from "../icons/EmailIcon";
import { FacebookSquare } from "../icons/FacebookSquare";
import { MdiYoutube } from "../icons/MdiYoutube";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from "../icons/SocialIcons";
import { PersonArmsSpread } from "../icons/PersonArmsSpread";

export const Footer = () => {
  const [isOpenContacts, setIsOpenContacts] = useState(false);
  const [isOpenAdress, setIsOpenAdress] = useState(false);
  const screenWidth = useWindowSize();

  const toggleList = (value: string) => {
    if (value === "КОНТАКТИ") {
      // setIsOpenCatalog(false);
      // setIsOpenForClients(false);
      setIsOpenContacts(!isOpenContacts);
      // setIsOpenAboutUs(false);
    }
    if (value === "АДРЕСА") {
      // setIsOpenCatalog(false);
      // setIsOpenForClients(false);
      // setIsOpenContacts(false);
      setIsOpenAdress(!isOpenAdress);
    }
  };

  return (
    <FooterStyled>
      <FooterContainer>
        <FooterBox
          onClick={() => toggleList("КОНТАКТИ")}
          isOpenContacts={isOpenContacts}
          
        >
          <FooterH2Styled>КОНТАКТИ</FooterH2Styled>
          <ArrowWraper
            isOpenContacts={isOpenContacts}
        
          >
            <CaretDown />
          </ArrowWraper>
          <FooterList id="contacts">
            <li>
              <FooterLinkStyled href="tel:+380486752312">
                tel: +380486752312
              </FooterLinkStyled>
            </li>
            <li>
              <FooterLinkStyled
                href="mailto:bereginia.badoeynhausen@gmail.com"
                target="_blank"
              >
                email: bereginia.badoeynhausen@gmail.com
              </FooterLinkStyled>
            </li>
          </FooterList>
        </FooterBox>

        <FooterBox
          onClick={() => toggleList("АДРЕСА")}
          isOpenAdress={isOpenAdress}
        >
          <FooterH2Styled>АДРЕСА</FooterH2Styled>
          <ArrowWraper
            isOpenAdress={isOpenAdress}
          >
            <CaretDown />
          </ArrowWraper>
          <FooterList id="adress">
            <li>
              <FooterLinkStyled href="tel:+380486752312">
                Bad-Oeynhause, Germany
              </FooterLinkStyled>
            </li>
            <li>
              <FooterLinkStyled
                href="https://www.google.com/maps"
                target="_blank"
              >
                32545 Weserstraße 24
              </FooterLinkStyled>
            </li>
          </FooterList>
        </FooterBox>
        {screenWidth <= 767 ? (
          <>
            <SocialListStyled>
              <li>
                <SocialLinkStyled href="http://instagram.com" target="_blank">
                  <InstagramIcon />
                </SocialLinkStyled>
              </li>
              <li>
                <SocialLinkStyled href="http://youtube.com" target="_blank">
                  <MdiYoutube />
                </SocialLinkStyled>
              </li>
              <li>
                <SocialLinkStyled href="http://facebook.com" target="_blank">
                  <FacebookSquare />
                </SocialLinkStyled>
              </li>
            </SocialListStyled>

            <ContactsList>
              <li>
                <FooterLinkStyled
                  href="mailto:bereginia.badoeynhausen@gmail.com"
                  target="_blank"
                >
                  {" "}
                  <EmailIcon />
                  Напишіть нам
                </FooterLinkStyled>
              </li>
              <li>
                <FooterLinkStyled
                  href="https://www.google.com/maps"
                  target="_blank"
                >
                  {" "}
                  <PersonArmsSpread />
                  Доступність
                </FooterLinkStyled>
              </li>
            </ContactsList>

            <InfoList>
              <li>
                <InfoLink>Умови обслуговування</InfoLink>
              </li>
              <li>
                <InfoLink>Політика конфіденційност</InfoLink>
              </li>
              <li>
                <InfoLink>Доступність</InfoLink>
              </li>
            </InfoList>
            <LicenseLink>Усі права захищені 2025</LicenseLink>
          </>
        ) : (
          <FooterBox>
            <FooterH2Styled>Соціальні мережі</FooterH2Styled>
            <SocialListStyled>
              <li>
                <SocialLinkStyled href="http://instagram.com" target="_blank">
                  <InstagramIcon />
                </SocialLinkStyled>
              </li>
              <li>
                <SocialLinkStyled href="http://facebook.com" target="_blank">
                  <FacebookIcon />
                </SocialLinkStyled>
              </li>
              <li>
                <SocialLinkStyled href="http://t.me" target="_blank">
                  <TelegramIcon />
                </SocialLinkStyled>
              </li>
            </SocialListStyled>
          </FooterBox>
        )}
      </FooterContainer>
    </FooterStyled>
  );
};
