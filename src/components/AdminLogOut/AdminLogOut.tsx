import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Выход выполнен");
  } catch (error) {
    console.error("Ошибка при выходе:", error);
  }
};
