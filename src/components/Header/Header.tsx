import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

import { LogoSvg } from "../icons/Logo";
import { useWindowSize } from "../../hooks/useWindowSize";
import { HeaderNav } from "../HeaderNav/HeaderNav";

import { MobileMenu } from "../MobileMenu/MobileMenu";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { useAuth } from "../../components/AuthProvider/useAuth.tsx";
import AdminLogout from "../AdminLogOut/BtnLogOut";

export function Header() {
  const [mobMenuIsOpen, setMobMenuIsOpen] = useState(false);
  const screenWidth = useWindowSize();
  const { isAdmin } = useAuth();

  const ToggleMobMenu = () => {
    setMobMenuIsOpen(!mobMenuIsOpen);
  };

  return (
    <header className=" sticky top-0 max-w-full z-50 bg-white shadow-2xs">
      <div className=" flex justify-between items-center mx-auto px-5 max-w-360 h-20 sm:px-8 lg:px-8 xl:px-10 ">
        <NavLink className=" flex justify-center decoration-0" to="/" end>
          <div className=" flex justify-center items-center ">
            <LogoSvg />
          </div>
          <div className=" flex flex-col whitespace-nowrap justify-center items-center ml-3 sm:ml-4 text-2xl font-interMedium ">
            BEREHYNJA
            <span className=" -mt-2 font-caveatMedium font-medium text-xl ">
              український простір
            </span>
          </div>
        </NavLink>
        {isAdmin && <AdminLogout />}
        {screenWidth >= 1024 ? (
          <div className=" relative flex justify-center items-center  ">
            <HeaderNav />
            <LanguageSwitcher />
          </div>
        ) : (
          <>
            <button
              onClick={ToggleMobMenu}
              aria-label="Mobile menu button"
              className=" flex justify-center items-center w-13 h-13 "
            >
              <Menu className=" w-8 h-8" />
            </button>
            <MobileMenu
              mobMenuIsOpen={mobMenuIsOpen}
              setMobMenuIsOpen={setMobMenuIsOpen}
            />
          </>
        )}
      </div>
    </header>
  );
}
