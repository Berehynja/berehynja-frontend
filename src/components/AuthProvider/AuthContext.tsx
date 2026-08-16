import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthLoading: true,
});
