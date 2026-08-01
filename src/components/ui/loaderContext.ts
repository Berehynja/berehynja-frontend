import { createContext } from "react";

export interface LoaderContextValue {
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
}

export const LoaderContext = createContext<LoaderContextValue | null>(null);
