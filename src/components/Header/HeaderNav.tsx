import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export const HeaderNav = () => {
  const { t } = useTranslation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkStyles =
    "relative before:absolute before:-bottom-2 before:left-1/2 before:h-0.5 before:w-0 before:-translate-x-1/2 before:bg-blue-500 before:transition-all hover:text-blue-500 hover:before:w-full hover:before:transition-all hover:before:duration-300 [.active>&]:text-blue-500 [.active>&]:before:w-full [.active>&]:before:transition-none [.active>&]:before:duration-300";

  return (
    <nav className="font-nunito mb-10 flex w-full flex-col items-center justify-center gap-7 text-xl text-stone-600 lg:mr-23 lg:mb-0 lg:flex-row lg:justify-end lg:gap-8 lg:px-8 lg:text-black">
      {/* Головна */}
      <NavLink to="/" end>
        <span className={linkStyles}>{t("header.home")}</span>
      </NavLink>

      {/* Про нас */}
      <NavLink to="/about">
        <span className={linkStyles}>{t("header.about")}</span>
      </NavLink>

      {/* --- ВИПАДАЮЧЕ МЕНЮ ПРОГРАМИ --- */}
      <div
        className="group relative flex h-full cursor-pointer flex-col items-center lg:block"
        // На десктопі працює hover, на мобілці — клік
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onMouseLeave={() => setIsMobileMenuOpen(false)}
      >
        <div className="flex items-center gap-1 py-2 transition-colors group-hover:text-blue-500">
          <span className="relative">{t("header.programs.title")}</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 lg:group-hover:rotate-180 ${isMobileMenuOpen ? "rotate-180 text-blue-500" : ""}`}
          />
        </div>

        {/* Контейнер підменю */}
        <div
          className={`w-full transition-all duration-300 lg:invisible lg:absolute lg:top-full lg:left-1/2 lg:z-50 lg:w-auto lg:-translate-x-1/2 lg:translate-y-2 lg:pt-4 lg:opacity-0 lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${isMobileMenuOpen ? "visible mt-2 flex h-auto translate-y-0 opacity-100" : "hidden h-0 overflow-hidden lg:flex lg:h-auto"} `}
        >
          <div className="flex w-full min-w-40 flex-col rounded-2xl border border-stone-100 bg-white p-4 shadow-xl lg:w-60 lg:shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            <NavLink
              to="/programs/kids"
              onClick={(e) => e.stopPropagation()} // Щоб клік по лінку не закривав меню миттєво до переходу
              className={({ isActive }) =>
                `flex items-center rounded-xl py-4 transition-all lg:px-4 lg:py-3 ${isActive ? "bg-blue-50 font-bold text-blue-600" : "text-stone-600 hover:bg-slate-50 hover:text-blue-500"} `
              }
            >
              <div className="flex w-full flex-col items-center lg:items-start">
                <span className="text-base font-bold lg:text-sm">{t("header.programs.kids")}</span>
              </div>
            </NavLink>

            <div className="mx-4 my-1 h-px bg-slate-50 lg:mx-2"></div>

            <NavLink
              to="/programs/adults"
              onClick={(e) => e.stopPropagation()}
              className={({ isActive }) =>
                `flex items-center rounded-xl py-4 transition-all lg:px-4 lg:py-3 ${isActive ? "bg-blue-50 font-bold text-blue-600" : "text-stone-600 hover:bg-slate-50 hover:text-blue-500"} `
              }
            >
              <div className="flex w-full flex-col items-center lg:items-start">
                <span className="text-base font-bold lg:text-sm">
                  {t("header.programs.adults")}
                </span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
      {/* --- КІНЕЦЬ ВИПАДАЮЧОГО МЕНЮ --- */}

      <NavLink to="/events">
        <span className={linkStyles}>{t("header.events")}</span>
      </NavLink>

      <NavLink to="/contact">
        <span className={linkStyles}>{t("header.contact")}</span>
      </NavLink>
    </nav>
  );
};
