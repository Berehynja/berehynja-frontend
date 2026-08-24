import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { Moon, Sun, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { HeaderNav, type MenuTheme } from "../Header/HeaderNav";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

interface MobileMenuProps {
  mobMenuIsOpen: boolean;
  setMobMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const MENU_THEME_STORAGE_KEY = "berehynja-mobile-menu-theme";

export const MobileMenu = ({
  mobMenuIsOpen,
  setMobMenuIsOpen,
}: MobileMenuProps) => {
  const { t } = useTranslation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const [menuTheme, setMenuTheme] = useState<MenuTheme>(() => {
    if (typeof window === "undefined") return "dark";

    return window.localStorage.getItem(MENU_THEME_STORAGE_KEY) === "light"
      ? "light"
      : "dark";
  });
  const isDark = menuTheme === "dark";

  const closeMenu = useCallback(
    () => setMobMenuIsOpen(false),
    [setMobMenuIsOpen],
  );

  const toggleTheme = () => {
    setMenuTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  };

  useEffect(() => {
    window.localStorage.setItem(MENU_THEME_STORAGE_KEY, menuTheme);
  }, [menuTheme]);

  useEffect(() => {
    if (!mobMenuIsOpen) return;

    const previousOverflow = document.body.style.overflow;
    previouslyFocusedElement.current =
      document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(
      () => closeButtonRef.current?.focus(),
      100,
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [closeMenu, mobMenuIsOpen]);

  const handleNavigationClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) closeMenu();
  };

  return (
    <>
      <button
        type="button"
        aria-label={t("common.close", { defaultValue: "Close menu" })}
        tabIndex={mobMenuIsOpen ? 0 : -1}
        onClick={closeMenu}
        className={`fixed inset-0 z-60 cursor-default bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ${
          mobMenuIsOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("header.navigation", { defaultValue: "Main navigation" })}
        aria-hidden={!mobMenuIsOpen}
        inert={!mobMenuIsOpen}
        className={`fixed inset-y-0 right-0 z-70 flex h-dvh w-[75vw] flex-col overflow-hidden border-l shadow-[-24px_0_70px_rgba(2,6,23,0.35)] transition-transform duration-300 ease-out ${
          isDark
            ? "border-white/10 bg-[#0a192f] text-white"
            : "border-slate-200 bg-linear-to-br from-blue-50 via-white to-yellow-50 text-slate-900"
        } ${mobMenuIsOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-1 shrink-0 bg-linear-to-r from-blue-500 to-yellow-400" />

        <header
          className={`relative flex shrink-0 items-center justify-between border-b px-5 py-4 ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="size-10 shrink-0 rounded-xl bg-linear-to-br from-blue-500 to-yellow-400 p-0.5">
              <div className="flex size-full items-center justify-center rounded-[10px] bg-[#0a192f] text-white">
                <span className="text-xl font-semibold italic">B</span>
              </div>
            </div>

            <p
              className={`truncate text-lg font-bold tracking-wide uppercase ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Berehynja
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMenu}
            aria-label={t("common.close", { defaultValue: "Close menu" })}
            className={`flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
              isDark
                ? "border-white/10 bg-white/5 text-slate-300 hover:border-blue-400/40 hover:bg-blue-500/15 hover:text-white"
                : "border-slate-200 bg-white/80 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        <div
          onClick={handleNavigationClick}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 pt-8 pb-6"
        >
          <HeaderNav mobileTheme={menuTheme} />

          <div
            className={`flex flex-col items-center gap-5 border-t pt-6 ${
              isDark ? "border-white/10" : "border-slate-200"
            }`}
          >
            <LanguageSwitcher variant={menuTheme} />

            <div
              className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 ${
                isDark
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white/75 shadow-sm"
              }`}
            >
              <Sun
                size={19}
                aria-hidden="true"
                className={isDark ? "text-slate-500" : "text-yellow-500"}
              />

              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label={t("common.themeToggle", {
                  defaultValue: "Switch menu theme",
                })}
                onClick={toggleTheme}
                className={`relative h-7 w-13 cursor-pointer rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                  isDark
                    ? "border-blue-400/40 bg-blue-500/30"
                    : "border-slate-300 bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-5.5 rounded-full shadow-md transition-transform duration-200 ease-out ${
                    isDark
                      ? "translate-x-6.5 bg-blue-300"
                      : "translate-x-0 bg-white"
                  }`}
                />
              </button>

              <Moon
                size={19}
                aria-hidden="true"
                className={isDark ? "text-blue-300" : "text-slate-400"}
              />
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 size-44 translate-x-1/3 translate-y-1/3 rounded-full bg-yellow-300/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-24 left-0 size-36 -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl"
        />
      </div>
    </>
  );
};
