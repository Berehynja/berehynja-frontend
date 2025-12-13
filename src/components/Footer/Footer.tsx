import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowWraperAdress,
  ArrowWraperContacts, 
  FooterBoxAdress,
  FooterBoxContact,
  FooterH2Styled,
  FooterLinkStyled,
  FooterLinkWrapper,
  
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
// import { GoogleMapIcon } from "../icons/GoogleMapIcon";
// import { Phone } from "../icons/Phone";
// import { GmailIcon } from "../icons/GmailIcon";
import { Heart, Phone, Mail, MapPin,  } from "lucide-react";


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
    <footer className="bg-blue-800">
      <div className=" footerOverlay  py-5  
          
          
          
      ">
      
      <div className="min-w-80 max-w-120 mx-auto border-b pb-4 border-gray-700 text-white  gap-1
           md:px-4 md:max-w-5xl md:flex md:justify-center md:items-center md:gap-8 
           lg:px-8 lg:max-w-7xl lg:gap-30
           xl:gap-40 xl:px-10 xl:max-w-360 
      ">

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
              <Mail />
              <span>bereginia.badoeynhausen@gmail.com</span>
            </FooterLinkStyled>

            {screenWidth > 767 && (<SocialStyled>
              <SocialLinkStyled
                href="https://www.instagram.com/berehynja.de?igsh=MWRtdWpscm1vNW8yZw=="
                target="_blank"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </SocialLinkStyled>

              <SocialLinkStyled
                href="https://t.me/bereginia_de"
                target="_blank"
                aria-label="Telegram"
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
            <FooterLinkStyled 
            href="https://www.badoeynhausen.de/startseite" 
            target="_blank" 
            aria-label="City website">
              Bad-Oeynhausen, Germany
            </FooterLinkStyled>

            <FooterLinkStyled
              href=""
              target="_blank"
              aria-label="Adress location"
            >
              32545 Weserstraße 24
            </FooterLinkStyled>
            <FooterLinkStyled
              href="https://www.google.com/maps/place/Johanniter-Mehrgenerationenhaus+Bad+Oeynhausen/@52.1979902,8.8037727,314m/data=!3m1!1e3!4m6!3m5!1s0x47ba72a07b459829:0x19fbe41cee571634!8m2!3d52.1978688!4d8.8039899!16s%2Fg%2F11c6q9n5kc?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              aria-label="Google Maps location"
            >
              <MapPin />
              {t("footer.location")}
            </FooterLinkStyled>
          </FooterLinkWrapper>
        </FooterBoxAdress>

           { screenWidth < 768 && ( <SocialStyled>
              <SocialLinkStyled
                href="https://www.instagram.com/berehynja.de?igsh=MWRtdWpscm1vNW8yZw=="
                target="_blank"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </SocialLinkStyled>

              <SocialLinkStyled
                href="https://t.me/bereginia_de"
                target="_blank"
                aria-label="Telegram"
              >
                <TelegramIcon />
              </SocialLinkStyled>
            </SocialStyled>)}
      </div>
      <License className="  border-t border-blue-800 mt-3  py-4  flex flex-col md:flex-row md:justify-between md:items-center ">
         <p className="text-sm flex items-center justify-center">
            {t("footer.madeWith")} <Heart size={16} className="mx-2 text-red-500" /> for the Ukrainian community
          </p>
        <p className="">Berehynja 2025</p>
      </License>
      </div>
    </footer>
  );
};

