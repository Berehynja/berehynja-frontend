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
    <footer className="font-montserratMedium w-full bg-blue-800 text-white">
      <div className="footerOverlay">
        <div className="mx-auto w-full max-w-120 min-w-80 gap-1 bg-blue-800 py-4 md:flex md:max-w-5xl md:items-center md:justify-center md:gap-8 md:px-4 lg:max-w-7xl lg:gap-30 lg:px-8 xl:max-w-360 xl:gap-40 xl:px-10">
          <div
            className={`ease flex max-w-120 flex-col justify-start overflow-hidden border-b border-white px-7 pb-3.5 transition-all duration-700 ${
              isOpenContacts ? "max-h-70" : "max-h-17"
            } md:max-h-none md:max-w-none md:overflow-visible md:border-0 md:px-0 md:py-0 md:transition-none`}
            onClick={() => toggleList("КОНТАКТИ")}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-montserratMedium py-5 text-xl">{t("footer.contacts")}</h2>
              <ChevronUp
                className={`${isOpenContacts ? "rotate-x-0" : "rotate-x-180"} md:hidden`}
              />
            </div>

            <div className="mt-2 flex flex-col flex-nowrap text-lg md:mt-0">
              <a
                className="flex min-h-13 cursor-pointer items-center gap-3 transition-colors duration-300 hover:text-amber-200"
                href="tel:+4915128161383"
              >
                <span className="w-6">
                  <Phone />
                </span>
                <span>+49 151 28161383</span>
              </a>

              <a
                className="flex min-h-13 cursor-pointer items-center gap-3 overflow-hidden transition-colors duration-300 hover:text-amber-200"
                href="mailto:bereginia.badoeynhausen@gmail.com"
                target="_blank"
              >
                <span className="w-6">
                  <Mail />
                </span>
                <span>bereginia.badoeynhausen@gmail.com</span>
              </a>

              {screenWidth > 767 && <SocialMedia />}
            </div>
          </div>

          <div
            className={`ease flex max-w-120 flex-col justify-start overflow-hidden border-b border-white px-7 pb-3.5 transition-all duration-700 ${
              isOpenAdress ? "max-h-70" : "max-h-17"
            } md:max-h-none md:max-w-none md:overflow-visible md:border-0 md:px-0 md:py-0 md:transition-none`}
            onClick={() => toggleList("АДРЕСА")}
          >
            <div className="flex items-center justify-between">
              <h2 className="py-5 text-xl">{t("footer.adress")}</h2>
              <ChevronUp className={`${isOpenAdress ? "rotate-x-0" : "rotate-x-180"} md:hidden`} />
            </div>

            <div className="mt-2 flex flex-col flex-nowrap text-lg md:mt-0">
              <a
                className="flex min-h-13 cursor-pointer items-center gap-3 transition-colors duration-300 hover:text-amber-200"
                href="https://www.badoeynhausen.de/startseite"
                target="_blank"
                aria-label="City website"
              >
                Bad-Oeynhausen, Germany
              </a>

              <p className="flex min-h-13 items-center" aria-label="Adress location">
                32545 Weserstraße 24
              </p>
              <a
                className="flex min-h-13 cursor-pointer items-center gap-3 transition-colors duration-300 hover:text-amber-200"
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

        <div className="text-Green flex w-full flex-col items-center justify-between gap-2.5 border-t border-gray-700 py-4 text-sm">
          <p className="flex flex-wrap items-center justify-center">
            {t("footer.madeWith")} <Heart size={16} className="mx-2 text-red-500" /> for the
            Ukrainian community
          </p>
          <p className="">Berehynja 2025</p>
        </div>
      </div>
    </footer>
  );
};
