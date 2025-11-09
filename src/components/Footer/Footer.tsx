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
  LicenseLink,
  SocialLinkStyled,
  SocialListStyled,
} from "./Footer.styled";
import { useWindowSize } from "../../hooks/useWindowSize";
import { CaretDown } from "../icons/CaretDown";
import { EmailIcon } from "../icons/EmailIcon";
import { MdiYoutube } from "../icons/MdiYoutube";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon
} from "../icons/SocialIcons";
import { GoogleMapIcon } from "../icons/GoogleMapIcon";

export const Footer = () => {
  const [isOpenContacts, setIsOpenContacts] = useState(false);
  const [isOpenAdress, setIsOpenAdress] = useState(false);
  const screenWidth = useWindowSize();

  const toggleList = (value: string) => {
    if (value === "КОНТАКТИ") {
      setIsOpenContacts(!isOpenContacts);
    }
    if (value === "АДРЕСА") {
      setIsOpenAdress(!isOpenAdress);
    }
  };

  return (
    <FooterStyled>
      <FooterContainer>
        <FooterBox isOpenContacts={isOpenContacts}
          onClick={() => toggleList("КОНТАКТИ")}
          
          
        >
          <FooterH2Styled>КОНТАКТИ</FooterH2Styled>
          <ArrowWraper isOpenContacts={isOpenContacts}>
            <CaretDown />
          </ArrowWraper>
          <FooterList id="contacts">
            <li>
              <FooterLinkStyled href="tel:+380486752312">
                tel: +491750000000
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
                <SocialLinkStyled href="https://www.instagram.com/berehynja.de?igsh=MWRtdWpscm1vNW8yZw==" target="_blank">
                  <InstagramIcon />
                </SocialLinkStyled>
              </li>
              <li>
                <SocialLinkStyled href="http://youtube.com" target="_blank">
                  <MdiYoutube />
                </SocialLinkStyled>
              </li>
              <li>
                <SocialLinkStyled href="https://t.me/bereginia_de" target="_blank">
                  <TelegramIcon />
                </SocialLinkStyled>
              </li>
            </SocialListStyled>

            <ContactsList>
              <li>
                <FooterLinkStyled
                  href="mailto:bereginia.badoeynhausen@gmail.com"
                  target="_blank"
                >
                  <EmailIcon />
                  Напишіть нам
                </FooterLinkStyled>
              </li>
              <li>
                <FooterLinkStyled
                  href="https://www.google.com/maps/place/Johanniter-Mehrgenerationenhaus+Bad+Oeynhausen/@52.1979902,8.8037727,314m/data=!3m1!1e3!4m6!3m5!1s0x47ba72a07b459829:0x19fbe41cee571634!8m2!3d52.1978688!4d8.8039899!16s%2Fg%2F11c6q9n5kc?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                >
                  <GoogleMapIcon />
                  Наші координати
                </FooterLinkStyled>
              </li>
            </ContactsList>
            <LicenseLink>Усі права захищені 2025</LicenseLink>
          </>
        ) : (
          <FooterBox>
            <FooterH2Styled>Соціальні мережі</FooterH2Styled>
            <SocialListStyled>
              <li>
                <SocialLinkStyled href="https://www.instagram.com/berehynja.de?igsh=MWRtdWpscm1vNW8yZw==" target="_blank">
                  <InstagramIcon />
                </SocialLinkStyled>
              </li>
              <li>
                <SocialLinkStyled href="http://facebook.com" target="_blank">
                  <FacebookIcon />
                </SocialLinkStyled>
              </li>
              <li>
                <SocialLinkStyled href="https://t.me/bereginia_de" target="_blank">
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
