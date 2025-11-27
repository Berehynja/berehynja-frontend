import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowWraperAdress,
  ArrowWraperContacts, 
  FooterBoxAdress,
  FooterBoxContact,
  FooterContainer,
  FooterH2Styled,
  FooterLinkStyled,
  FooterLinkWrapper,
  FooterStyled,
  License,
  SocialLinkStyled,
  SocialStyled,
} from "./Footer.styled";
import { useWindowSize } from "../../hooks/useWindowSize";
import { CaretDown } from "../icons/CaretDown";
import {
  
  InstagramIcon,
  TelegramIcon,
} from "../icons/SocialIcons";
import { GoogleMapIcon } from "../icons/GoogleMapIcon";
import { Phone } from "../icons/Phone";
import { GmailIcon } from "../icons/GmailIcon";


export const Footer = () => {
  const [isOpenContacts, setIsOpenContacts] = useState(false);
  const [isOpenAdress, setIsOpenAdress] = useState(false);
  const screenWidth = useWindowSize();
  const { t } = useTranslation();
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

        <FooterBoxContact
          className="footerBox"
          isOpenContacts={isOpenContacts}
          onClick={() => toggleList("КОНТАКТИ")}
        >
          
          
          <ArrowWraperContacts isOpenContacts={isOpenContacts}>
            <FooterH2Styled>{t("footer.contacts")}</FooterH2Styled>
            <CaretDown />
          </ArrowWraperContacts>
          <FooterLinkWrapper>
            <FooterLinkStyled href="tel:+4915128161383">
              <Phone />
              <span>+49 151 28161383</span>
            </FooterLinkStyled>

            <FooterLinkStyled
              href="mailto:bereginia.badoeynhausen@gmail.com"
              target="_blank"
            >
              <GmailIcon />
              <span>bereginia.badoeynhausen@gmail.com</span>
            </FooterLinkStyled>

            {screenWidth > 767 && (<SocialStyled>
              <SocialLinkStyled
                href="https://www.instagram.com/berehynja.de?igsh=MWRtdWpscm1vNW8yZw=="
                target="_blank"
              >
                <InstagramIcon />
              </SocialLinkStyled>

              <SocialLinkStyled
                href="https://t.me/bereginia_de"
                target="_blank"
              >
                <TelegramIcon />
              </SocialLinkStyled>
            </SocialStyled>)}

          </FooterLinkWrapper>
        </FooterBoxContact>

        <FooterBoxAdress
          onClick={() => toggleList("АДРЕСА")}
          isOpenAdress={isOpenAdress}
        >
          
          <ArrowWraperAdress isOpenAdress={isOpenAdress}>
            <FooterH2Styled>{t("footer.adress")}</FooterH2Styled>
            <CaretDown />
          </ArrowWraperAdress>
          <FooterLinkWrapper >
            <FooterLinkStyled href="tel:+380486752312">
              Bad-Oeynhausen, Germany
            </FooterLinkStyled>

            <FooterLinkStyled
              href="https://www.google.com/maps"
              target="_blank"
            >
              32545 Weserstraße 24
            </FooterLinkStyled>
            <FooterLinkStyled
              href="https://www.google.com/maps/place/Johanniter-Mehrgenerationenhaus+Bad+Oeynhausen/@52.1979902,8.8037727,314m/data=!3m1!1e3!4m6!3m5!1s0x47ba72a07b459829:0x19fbe41cee571634!8m2!3d52.1978688!4d8.8039899!16s%2Fg%2F11c6q9n5kc?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
            >
              <GoogleMapIcon />
              {t("footer.location")}
            </FooterLinkStyled>
          </FooterLinkWrapper>
        </FooterBoxAdress>

           { screenWidth < 768 && ( <SocialStyled>
              <SocialLinkStyled
                href="https://www.instagram.com/berehynja.de?igsh=MWRtdWpscm1vNW8yZw=="
                target="_blank"
              >
                <InstagramIcon />
              </SocialLinkStyled>

              <SocialLinkStyled
                href="https://t.me/bereginia_de"
                target="_blank"
              >
                <TelegramIcon />
              </SocialLinkStyled>
            </SocialStyled>)}
           
            <License >Berehynja 2025</License>
        {/* )} */}
      </FooterContainer>
      
    </FooterStyled>
  );
};

 {/* <ContactsList> */}
              {/* <FooterLinkStyled href="mailto:bereginia.badoeynhausen@gmail.com" target="_blank">
                <EmailIcon />
                Напишіть нам
              </FooterLinkStyled> */}
            {/* </ContactsList> */}