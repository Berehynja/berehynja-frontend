import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export type MenuTheme = "light" | "dark";

interface HeaderNavProps {
  mobileTheme?: MenuTheme;
}

export const HeaderNav = ({ mobileTheme = "light" }: HeaderNavProps) => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDark = mobileTheme === "dark";

  const handleProgramsToggle = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;

    setIsMobileMenuOpen((isOpen) => !isOpen);
  };

  const closeProgramsMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const linkStyles = `relative before:absolute before:-bottom-2 before:left-1/2 before:h-0.5 before:w-0 before:-translate-x-1/2 before:transition-all hover:before:w-full hover:before:duration-300 [.active>&]:before:w-full [.active>&]:before:transition-none lg:before:bg-blue-700 lg:hover:text-blue-700 lg:[.active>&]:text-blue-700 ${
    isDark
      ? "before:bg-linear-to-r before:from-blue-400 before:to-yellow-300 hover:text-blue-200 [.active>&]:text-blue-200"
      : "before:bg-blue-700 hover:text-blue-700 [.active>&]:text-blue-700"
  }`;

  return (
    <nav className="font-nunito mb-10 flex w-full flex-col items-center justify-center gap-7 text-xl whitespace-nowrap text-stone-600 lg:mb-0 lg:w-auto lg:shrink-0 lg:flex-row lg:justify-end lg:gap-5 lg:px-1 lg:text-5 lg:text-black xl:gap-8 xl:px-5 xl:text-xl">
      <NavLink to="/" end onClick={closeProgramsMenu}>
        <span className={linkStyles}>{t("header.home")}</span>
      </NavLink>

      <NavLink to="/about" onClick={closeProgramsMenu}>
        <span className={linkStyles}>{t("header.about")}</span>
      </NavLink>

      <div className="group relative flex h-full cursor-pointer flex-col items-center lg:block">
        <button
          type="button"
          onClick={handleProgramsToggle}
          aria-expanded={isMobileMenuOpen}
          aria-controls="programs-submenu"
          className={`flex cursor-pointer items-center gap-1 py-2 transition-colors lg:group-hover:text-blue-700 ${
            isDark ? "group-hover:text-blue-200" : "group-hover:text-blue-700"
          }`}
        >
          <span>{t("header.programs.title")}</span>
          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`transition-transform duration-500 lg:group-hover:rotate-180 ${
              isMobileMenuOpen
                ? `rotate-180 lg:text-blue-700 ${isDark ? "text-blue-200" : "text-blue-700"}`
                : ""
            }`}
          />
        </button>

        <div
          id="programs-submenu"
          className={`w-full overflow-hidden transition-all duration-500 lg:invisible lg:absolute lg:top-full lg:left-1/2 lg:z-50 lg:mt-0 lg:max-h-none lg:w-auto lg:-translate-x-1/2 lg:translate-y-2 lg:overflow-visible lg:pt-4 lg:opacity-0 lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${
            isMobileMenuOpen
              ? "mt-2 max-h-96 translate-y-0 opacity-100"
              : "pointer-events-none mt-0 max-h-0 -translate-y-1 opacity-0 lg:pointer-events-auto"
          }`}
        >
          <div className="min-h-0 overflow-hidden lg:overflow-visible">
            <div
              className={`flex w-full min-w-48 flex-col rounded-2xl border p-3 lg:w-60 lg:border-slate-200 lg:bg-white lg:p-4 lg:shadow-[0_10px_30px_rgba(0,0,0,0.1)] ${
                isDark
                  ? "border-white/20 bg-[#10213a]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <NavLink
                to="/programs/kids"
                onClick={closeProgramsMenu}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3.5 text-base font-bold lg:py-3 lg:text-sm ${
                    isActive
                      ? isDark
                        ? "bg-blue-500/20 text-blue-200 ring-1 ring-blue-300/25 ring-inset"
                        : "bg-blue-50 text-blue-700"
                      : isDark
                        ? "text-slate-200 hover:bg-white/10 hover:text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                  }`
                }
              >
                <span className="w-full text-center lg:text-left">
                  {t("header.programs.kids")}
                </span>
              </NavLink>

              <div
                className={`mx-2 my-1 h-px ${
                  isDark ? "bg-white/15" : "bg-slate-100"
                }`}
              />

              <NavLink
                to="/programs/adults"
                onClick={closeProgramsMenu}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3.5 text-base font-bold lg:py-3 lg:text-sm ${
                    isActive
                      ? isDark
                        ? "bg-blue-500/20 text-blue-200 ring-1 ring-blue-300/25 ring-inset"
                        : "bg-blue-50 text-blue-700"
                      : isDark
                        ? "text-slate-200 hover:bg-white/10 hover:text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                  }`
                }
              >
                <span className="w-full text-center lg:text-left">
                  {t("header.programs.adults")}
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <NavLink to="/events" onClick={closeProgramsMenu}>
        <span className={linkStyles}>{t("header.events")}</span>
      </NavLink>

      <NavLink to="/contact" onClick={closeProgramsMenu}>
        <span className={linkStyles}>{t("header.contact")}</span>
      </NavLink>
    </nav>
  );
};
