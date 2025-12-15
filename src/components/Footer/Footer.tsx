import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../hooks/useWindowSize";

import { Heart, Phone, Mail, MapPin, ChevronUp } from "lucide-react";
import { SocialMedia } from "../SocialMedia/SocialMedia";

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
    <footer className="bg-blue-800 text-white font-interRegular">
      <div className=" footerOverlay ">
        <div
          className="min-w-80 max-w-120 mx-auto py-4 gap-1
           md:px-4 md:max-w-5xl md:flex md:justify-center md:items-center md:gap-8 
           lg:px-8 lg:max-w-7xl lg:gap-30
           xl:gap-40 xl:px-10 xl:max-w-360 
      "
        >
          <div
            className={`flex flex-col pb-3.5 px-7 justify-start  overflow-hidden max-w-120 border-b border-white 
            transition-all duration-700 ease ${
              isOpenContacts ? " max-h-70" : " max-h-17 "
            } 
            md:py-0 md:px-0 md:border-0 md:max-w-none md:max-h-none md:overflow-visible md:transition-none`}
            onClick={() => toggleList("КОНТАКТИ")}
          >
            <div className=" flex justify-between items-center">
              <h2 className=" text-xl font-montserratMedium py-5">
                {t("footer.contacts")}
              </h2>
              <ChevronUp
                className={`${
                  isOpenContacts ? "rotate-x-0" : "rotate-x-180"
                } md:hidden`}
              />
            </div>

            <div className=" flex flex-col flex-nowrap mt-2 text-lg md:mt-0 ">
              <a
                className=" flex items-center min-h-13 gap-3 transition-colors duration-300 cursor-pointer hover:text-amber-200"
                href="tel:+4915128161383"
              >
                <Phone />
                <span>+49 151 28161383</span>
              </a>

              <a
                className=" flex items-center min-h-13 gap-3 transition-colors duration-300 cursor-pointer hover:text-amber-200"
                href="mailto:bereginia.badoeynhausen@gmail.com"
                target="_blank"
              >
                <Mail />
                <span>bereginia.badoeynhausen@gmail.com</span>
              </a>

              {screenWidth > 767 && <SocialMedia />}
            </div>
          </div>

          <div
            className={` flex flex-col pb-3.5 px-7 justify-start overflow-hidden max-w-120 border-b border-white 
            transition-all duration-700 ease ${
              isOpenAdress ? " max-h-70" : " max-h-17 "
            } 
            md:py-0 md:px-0 md:border-0 md:max-w-none md:max-h-none md:overflow-visible md:transition-none`}
            onClick={() => toggleList("АДРЕСА")}
          >
            <div className=" flex justify-between items-center">
              <h2 className=" text-xl font-montserratMedium py-5">
                {t("footer.adress")}
              </h2>
              <ChevronUp
                className={`${
                  isOpenAdress ? "rotate-x-0" : "rotate-x-180"
                } md:hidden `}
              />
            </div>

            <div className=" flex flex-col flex-nowrap mt-2 text-lg md:mt-0 ">
              <a
                className=" flex items-center min-h-13 gap-3 transition-colors duration-300 cursor-pointer hover:text-amber-200 "
                href="https://www.badoeynhausen.de/startseite"
                target="_blank"
                aria-label="City website"
              >
                Bad-Oeynhausen, Germany
              </a>

              <p
                className=" flex items-center min-h-13  "
                aria-label="Adress location"
              >
                32545 Weserstraße 24
              </p>
              <a
                className=" flex items-center min-h-13 gap-3 transition-colors duration-300 cursor-pointer hover:text-amber-200"
                href="https://www.google.com/maps/place/Johanniter-Mehrgenerationenhaus+Bad+Oeynhausen/@52.1979902,8.8037727,314m/data=!3m1!1e3!4m6!3m5!1s0x47ba72a07b459829:0x19fbe41cee571634!8m2!3d52.1978688!4d8.8039899!16s%2Fg%2F11c6q9n5kc?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                aria-label="Google Maps location"
              >
                <MapPin />
                {t("footer.location")}
              </a>
            </div>
          </div>

          {screenWidth < 768 && <SocialMedia />}
        </div>
        <div
          className=" flex flex-col justify-between items-center border-t border-gray-700 py-4 text-sm text-Green gap-2.5
       "
        >
          <p className=" flex flex-wrap items-center justify-center">
            {t("footer.madeWith")}{" "}
            <Heart size={16} className="mx-2 text-red-500" /> for the Ukrainian
            community
          </p>
          <p className="">Berehynja 2025</p>
        </div>
      </div>
    </footer>
  );
};
