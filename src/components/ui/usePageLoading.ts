import { useContext, useLayoutEffect } from "react";

import { LoaderContext } from "./loaderContext";

export const usePageLoading = (key: string, active: boolean) => {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("usePageLoading must be used inside LoaderProvider");
  }

  const { startLoading, stopLoading } = context;

  useLayoutEffect(() => {
    if (!active) {
      stopLoading(key);
      return undefined;
    }

    startLoading(key);
    return () => stopLoading(key);
  }, [active, key, startLoading, stopLoading]);
};
