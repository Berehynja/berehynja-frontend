import { InstagramIcon, TelegramIcon } from "../icons/SocialIcons";

export const SocialMedia = () => {
  return (
    <div className="mt-8 flex items-center justify-center gap-8 px-7 md:mt-0 md:gap-8 md:px-0 md:py-2.5">
      <a
        className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-blue-300 transition-transform duration-250 hover:scale-110"
        href="https://www.instagram.com/berehynja.de?igsh=MWRtdWpscm1vNW8yZw=="
        target="_blank"
        aria-label="Instagram"
      >
        <InstagramIcon />
      </a>

      <a
        className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-blue-300 transition-transform duration-250 hover:scale-110"
        href="https://t.me/bereginia_de"
        target="_blank"
        aria-label="Telegram"
      >
        <TelegramIcon />
      </a>
    </div>
  );
};
