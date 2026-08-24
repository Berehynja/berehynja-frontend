import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

import logo from "../../images/logo3.2.jpg";
import { HeaderNav } from "./HeaderNav";
import { MobileMenu } from "../MobileMenu/MobileMenu";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { useAuth } from "../AuthProvider/useAuth";
import AdminLogout from "../AdminLogOut/BtnLogOut";

export function Header() {
  const [mobMenuIsOpen, setMobMenuIsOpen] = useState(false);
  const { isAdmin } = useAuth();

  const toggleMobileMenu = () => {
    setMobMenuIsOpen((isOpen) => !isOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-2xs">
      <div className="relative mx-auto flex h-20 max-w-360 items-center gap-2 px-3 sm:px-5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4 lg:px-4 xl:gap-6 xl:px-10">
        <NavLink
          className="flex shrink-0 items-center justify-center decoration-0 lg:col-start-1 lg:row-start-1"
          to="/"
          end
          aria-label="Berehynia"
        >
          <img
            src={logo}
            alt="Berehynia"
            width={1536}
            height={1024}
            className="h-18 w-auto object-contain"
          />
        </NavLink>

        {isAdmin && (
          <div className="absolute left-1/2 shrink-0 -translate-x-1/2 lg:static lg:col-start-2 lg:row-start-1 lg:justify-self-center lg:translate-x-0">
            <AdminLogout />
          </div>
        )}

        <div className="ml-auto hidden min-w-0 items-center gap-3 lg:col-start-3 lg:row-start-1 lg:ml-0 lg:flex lg:justify-self-end xl:gap-5">
          <HeaderNav />
          <LanguageSwitcher />
        </div>

        <div className="ml-auto shrink-0 lg:hidden">
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Open navigation menu"
            aria-expanded={mobMenuIsOpen}
            aria-controls="mobile-navigation"
            className="flex size-12 cursor-pointer items-center justify-center rounded-xl text-slate-800 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Menu className="size-7" aria-hidden="true" />
          </button>

          <div id="mobile-navigation">
            <MobileMenu
              mobMenuIsOpen={mobMenuIsOpen}
              setMobMenuIsOpen={setMobMenuIsOpen}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
