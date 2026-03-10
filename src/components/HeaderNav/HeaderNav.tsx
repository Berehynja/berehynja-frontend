import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export const HeaderNav = () => {
  const { t } = useTranslation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkStyles = "relative before:absolute before:-bottom-2 before:left-1/2 before:h-0.5 before:w-0 before:-translate-x-1/2 before:bg-blue-500 before:transition-all hover:text-blue-500 hover:before:w-full hover:before:transition-all hover:before:duration-300 [.active>&]:text-blue-500 [.active>&]:before:w-full [.active>&]:before:transition-none [.active>&]:before:duration-300";

  return (
    <nav className="font-interRegular mb-10 flex w-full flex-col items-center justify-center gap-7 text-xl text-stone-600 lg:mr-23 lg:mb-0 lg:flex-row lg:justify-end lg:gap-8 lg:px-8 lg:text-black">
      
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
        className="relative group flex flex-col items-center lg:block h-full cursor-pointer"
        // На десктопі працює hover, на мобілці — клік
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onMouseLeave={() => setIsMobileMenuOpen(false)}
      >
        <div className="flex items-center gap-1 py-2 group-hover:text-blue-500 transition-colors">
          <span className="relative">{t("header.programs.title")}</span>
          <ChevronDown 
            size={18} 
            className={`transition-transform duration-300 lg:group-hover:rotate-180 ${isMobileMenuOpen ? 'rotate-180 text-blue-500' : ''}`} 
          />
        </div>

        {/* Контейнер підменю */}
        <div className={`
          lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-full lg:pt-4 lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0 lg:translate-y-2 lg:z-50
          transition-all duration-300 w-full lg:w-auto
          ${isMobileMenuOpen ? 'flex opacity-100 visible translate-y-0 h-auto mt-2' : 'hidden lg:flex h-0 lg:h-auto overflow-hidden'}
        `}>
          <div className="bg-white border border-stone-100 shadow-xl lg:shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-3xl p-3 flex flex-col min-w-40 w-full lg:w-60">
            
            <NavLink 
              to="/programs/kids" 
              onClick={(e) => e.stopPropagation()} // Щоб клік по лінку не закривав меню миттєво до переходу
              className={({ isActive }) => `
                flex items-center px-6 lg:px-4 py-4 lg:py-3 rounded-xl transition-all
                ${isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-stone-600 hover:text-blue-500'}
              `}
            >
              <div className="flex flex-col items-center lg:items-start w-full">
                <span className="text-base lg:text-sm font-bold">{t("header.programs.kids")}</span>
              </div>
            </NavLink>

            <div className="h-px bg-slate-50 my-1 mx-4 lg:mx-2"></div>

            <NavLink 
              to="/programs/adults" 
              onClick={(e) => e.stopPropagation()}
              className={({ isActive }) => `
                flex items-center px-6 lg:px-4 py-4 lg:py-3 rounded-xl transition-all
                ${isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-stone-600 hover:text-blue-500'}
              `}
            >
              <div className="flex flex-col items-center lg:items-start w-full">
                <span className="text-base lg:text-sm font-bold">{t("header.programs.adults")}</span>
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