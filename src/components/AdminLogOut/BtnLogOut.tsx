import { logout } from "../AdminLogOut/AdminLogOut";

export default function AdminLogout() {
  return (
    <button
      onClick={logout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Выйти
    </button>
  );
}