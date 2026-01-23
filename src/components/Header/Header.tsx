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
    <header className="sticky top-0 z-50 max-w-full bg-white shadow-2xs">
      <div className="mx-auto flex h-20 max-w-360 items-center justify-between px-5 sm:px-8 lg:px-8 xl:px-10">
        <NavLink className="flex justify-center decoration-0" to="/" end>
          <div className="flex items-center justify-center">
            <LogoSvg />
          </div>
          <div className="font-interMedium ml-3 flex flex-col items-center justify-center text-2xl whitespace-nowrap sm:ml-4">
            BEREHYNJA
            <span className="font-caveatMedium -mt-2 text-xl font-medium">український простір</span>
          </div>
        </NavLink>
        {isAdmin && <AdminLogout />}
        {screenWidth >= 1024 ? (
          <div className="relative flex items-center justify-center">
            <HeaderNav />
            <LanguageSwitcher />
          </div>
        ) : (
          <>
            <button
              onClick={ToggleMobMenu}
              aria-label="Mobile menu button"
              className="flex h-13 w-13 items-center justify-center"
            >
              <Menu className="h-8 w-8" />
            </button>
            <MobileMenu mobMenuIsOpen={mobMenuIsOpen} setMobMenuIsOpen={setMobMenuIsOpen} />
          </>
        )}
      </div>
    </header>
  );
}
