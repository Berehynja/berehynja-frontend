import { useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";

import { logout } from "../AdminLogOut/AdminLogOut";
import { PageLoader } from "../ui/PageLoader";

export default function AdminLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <PageLoader visible={isLoggingOut} />

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-label={isLoggingOut ? "Logging out" : "Log out of admin mode"}
        title="Log out of admin mode"
        className="group inline-flex cursor-pointer flex-col items-stretch justify-center gap-1 rounded-md border border-slate-200 bg-white/95 px-2 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:shadow-md active:scale-[0.97] focus-visible:ring-3 focus-visible:ring-blue-500/25 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70 sm:gap-1.5 sm:rounded-lg sm:px-3 sm:py-2 sm:text-xs"
      >
        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          <ShieldCheck
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="size-3.5 shrink-0 text-blue-600 sm:size-4"
          />
          <span className="sm:hidden">Admin</span>
          <span className="hidden sm:inline">Admin mode</span>
        </span>

        <span
          aria-hidden="true"
          className="h-px w-full bg-slate-200 transition-colors group-hover:bg-red-200"
        />

        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-red-600 group-hover:text-red-700">
          <LogOut
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 sm:size-4"
          />
          <span className="sm:hidden">Exit</span>
          <span className="hidden sm:inline">Log out</span>
        </span>
      </button>
    </>
  );
}
