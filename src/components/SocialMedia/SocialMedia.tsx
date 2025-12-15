import { InstagramIcon, TelegramIcon } from "../icons/SocialIcons";

export const SocialMedia = () => {
  return (
    <div
      className=" flex justify-start items-center px-7 gap-10 mt-8 
         md:mt-0 md:gap-10 md:py-2.5 md:px-0 "
    >
      <a
        className=" block "
        href="https://www.instagram.com/berehynja.de?igsh=MWRtdWpscm1vNW8yZw=="
        target="_blank"
        aria-label="Instagram"
      >
        <InstagramIcon />
      </a>

      <a
        className=" block "
        href="https://t.me/bereginia_de"
        target="_blank"
        aria-label="Telegram"
      >
        <TelegramIcon />
      </a>
    </div>
  );
};
