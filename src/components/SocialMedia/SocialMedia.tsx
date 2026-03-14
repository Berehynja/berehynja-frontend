import { InstagramIcon, TelegramIcon } from "../icons/SocialIcons";

export const SocialMedia = () => {
  return (
    <div className="flex items-center gap-4">
      {/* Instagram - Яскравий та контрастний */}
      <a
        href="https://www.instagram.com/berehynja.de"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1306C] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-3"
        aria-label="Instagram"
      >
        <div className="scale-110 group-hover:scale-125 transition-transform">
          <InstagramIcon />
        </div>
      </a>

      {/* Telegram - Насичений синій */}
      <a
        href="https://t.me/bereginia_de"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-xl bg-[#0088cc] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-rotate-3"
        aria-label="Telegram"
      >
        <div className="scale-110 group-hover:scale-125 transition-transform">
          <TelegramIcon />
        </div>
      </a>
    </div>
  );
};