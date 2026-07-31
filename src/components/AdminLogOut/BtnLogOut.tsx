
import { LogOut, ShieldCheck } from "lucide-react";

import { logout } from "../AdminLogOut/AdminLogOut";

export default function AdminLogout() {
  return (
    <button
      type="button"
      onClick={logout}
      aria-label="Log out of admin mode"
      title="Log out of admin mode"
      className="group inline-flex flex-col items-stretch justify-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:shadow-md active:scale-[0.97] focus-visible:ring-3 focus-visible:ring-blue-500/25 focus-visible:outline-none"
    >
      <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
        <ShieldCheck
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className="shrink-0 text-blue-600"
        />
        <span>Admin mode</span>
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
          className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        />
        <span>Log out</span>
      </span>
    </button>
  );
}
