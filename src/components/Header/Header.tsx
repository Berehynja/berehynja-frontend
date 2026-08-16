import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

import logo from "../../images/logo3.2.jpg";
import { useWindowSize } from "../../hooks/useWindowSize";
import { HeaderNav } from "./HeaderNav";
import { MobileMenu } from "../MobileMenu/MobileMenu";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { useAuth } from "../AuthProvider/useAuth";
import AdminLogout from "../AdminLogOut/BtnLogOut";

export function Header() {
  const [mobMenuIsOpen, setMobMenuIsOpen] = useState(false);
  const screenWidth = useWindowSize();
  const { isAdmin } = useAuth();

  const toggleMobileMenu = () => {
    setMobMenuIsOpen((isOpen) => !isOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-2xs">
      <div className="mx-auto flex min-h-16 w-full max-w-360 items-center justify-between px-4 md:min-h-18 md:px-6 lg:min-h-20 lg:px-8 xl:px-10">
        <NavLink
          to="/"
          end
          aria-label="Berehynja — home"
          className="flex shrink-0 items-center justify-center"
        >
          <img
            src={logo}
            alt="Berehynja"
            width={1536}
            height={1024}
            className="h-14 w-auto object-contain md:h-16 lg:h-18"
          />
        </NavLink>

        {isAdmin && <AdminLogout />}

        {screenWidth >= 1024 ? (
          <div className="relative flex min-w-0 items-center justify-end">
            <HeaderNav />
            <LanguageSwitcher />
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Open mobile menu"
              aria-expanded={mobMenuIsOpen}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:size-12"
            >
              <Menu className="size-7 md:size-8" aria-hidden="true" />
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
