import { InstagramIcon, TelegramIcon } from "../icons/SocialIcons";

export const SocialMedia = () => {
  return (
    <div
      className=" flex justify-center items-center px-7 gap-8 mt-8 
         md:mt-0 md:gap-8 md:py-2.5 md:px-0 "
    >
      <a
        className="flex flex-col justify-center items-center w-12 h-12 rounded-full bg-blue-300 hover:scale-110 transition-transform duration-250"
        href="https://www.instagram.com/berehynja.de?igsh=MWRtdWpscm1vNW8yZw=="
        target="_blank"
        aria-label="Instagram"
      >
        <InstagramIcon />
      </a>

      <a
         className="flex flex-col justify-center items-center w-12 h-12 rounded-full bg-blue-300 hover:scale-110 transition-transform duration-250"
        href="https://t.me/bereginia_de"
        target="_blank"
        aria-label="Telegram"
      >
        <TelegramIcon />
      </a>
    </div>
  );
};
