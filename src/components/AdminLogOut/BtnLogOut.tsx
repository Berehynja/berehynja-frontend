import { logout } from "../AdminLogOut/AdminLogOut";

export default function AdminLogout() {
  return (
    <button
      onClick={logout}
      className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
    >
      Выйти
    </button>
  );
}
