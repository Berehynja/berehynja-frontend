import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";


export const HeaderNav = () => {
  const { t } = useTranslation();

  const links = [
    { to: "/", label: t("header.home") },
    { to: "/about", label: t("header.about") },
    { to: "/programs", label: t("header.programs") },
    { to: "/events", label: t("header.events") },
  ];

  return (
    <nav className=" flex flex-col gap-7 justify-center items-center font-interRegular text-xl w-full mb-10 text-stone-600
     lg:flex-row lg:gap-8 lg:mb-0 lg:mr-23 lg:justify-end lg:px-8 lg:text-black
    "> 
      {links.map((link) => {
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"} 
          >
            <span
              className=" relative 
              before:absolute before:left-1/2 before:-bottom-2 before:h-0.5 before:w-0
              before:-translate-x-1/2 before:bg-blue-500 before:transition-all
              
              hover:text-blue-500 hover:before:w-full hover:before:transition-all hover:before:duration-300

              [.active>&]:text-blue-500 [.active>&]:before:w-full [.active>&]:before:transition-none [.active>&]:before:duration-300 
              ">
              {link.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};
