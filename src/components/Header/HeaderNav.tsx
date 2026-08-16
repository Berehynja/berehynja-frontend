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

  const linkStyles = `relative before:absolute before:-bottom-2 before:left-1/2 before:h-0.5 before:w-0 before:-translate-x-1/2 before:transition-all hover:before:w-full hover:before:duration-300 [.active>&]:before:w-full [.active>&]:before:transition-none lg:before:bg-none lg:before:bg-blue-700 lg:hover:text-blue-700 lg:[.active>&]:text-blue-700 ${
    isDark
      ? "before:bg-linear-to-r before:from-blue-400 before:to-yellow-300 hover:text-blue-200 [.active>&]:text-blue-200"
      : "before:bg-blue-700 hover:text-blue-700 [.active>&]:text-blue-700"
  }`;

  return (
    <nav
      className={`font-nunito mb-8 flex w-full flex-col items-center justify-center gap-7 text-2xl font-medium lg:mr-23 lg:mb-0 lg:flex-row lg:justify-end lg:gap-8 lg:px-8 lg:text-xl lg:font-normal lg:text-black ${
        isDark ? "text-slate-100" : "text-slate-700"
      }`}
    >
      <NavLink to="/" end>
        <span className={linkStyles}>{t("header.home")}</span>
      </NavLink>

      <NavLink to="/about">
        <span className={linkStyles}>{t("header.about")}</span>
      </NavLink>

      <div
        className="group relative flex h-full cursor-pointer flex-col items-center lg:block"
        onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        onMouseLeave={() => setIsMobileMenuOpen(false)}
      >
        <button
          type="button"
          aria-expanded={isMobileMenuOpen}
          className={`flex cursor-pointer items-center gap-1 py-2 transition-colors lg:group-hover:text-blue-700 ${
            isDark ? "group-hover:text-blue-200" : "group-hover:text-blue-700"
          }`}
        >
          <span>{t("header.programs.title")}</span>
          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`transition-transform duration-300 lg:group-hover:rotate-180 ${
              isMobileMenuOpen
                ? `rotate-180 lg:text-blue-700 ${
                    isDark ? "text-blue-200" : "text-blue-700"
                  }`
                : ""
            }`}
          />
        </button>

        <div
          className={`w-full transition-all duration-300 lg:invisible lg:absolute lg:top-full lg:left-1/2 lg:z-50 lg:w-auto lg:-translate-x-1/2 lg:translate-y-2 lg:pt-4 lg:opacity-0 lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${
            isMobileMenuOpen
              ? "visible mt-2 flex h-auto translate-y-0 opacity-100"
              : "hidden h-0 overflow-hidden lg:flex lg:h-auto"
          }`}
        >
          <div className="flex w-full min-w-48 flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-xl lg:w-60 lg:p-4 lg:shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            <NavLink
              to="/programs/kids"
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3.5 text-base font-bold transition-all lg:py-3 lg:text-sm ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                }`
              }
            >
              <span className="w-full text-center lg:text-left">
                {t("header.programs.kids")}
              </span>
            </NavLink>

            <div className="mx-2 my-1 h-px bg-slate-100" />

            <NavLink
              to="/programs/adults"
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3.5 text-base font-bold transition-all lg:py-3 lg:text-sm ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
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

      <NavLink to="/events">
        <span className={linkStyles}>{t("header.events")}</span>
      </NavLink>

      <NavLink to="/contact">
        <span className={linkStyles}>{t("header.contact")}</span>
      </NavLink>
    </nav>
  );
};
