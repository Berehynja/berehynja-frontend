import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { PageLoader } from "./PageLoader";
import { LoaderContext } from "./loaderContext";
import { usePageLoading } from "./usePageLoading";

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [activeLoaders, setActiveLoaders] = useState<Set<string>>(
    () => new Set(),
  );

  const startLoading = useCallback((key: string) => {
    setActiveLoaders((current) => {
      if (current.has(key)) return current;

      const next = new Set(current);
      next.add(key);
      return next;
    });
  }, []);

  const stopLoading = useCallback((key: string) => {
    setActiveLoaders((current) => {
      if (!current.has(key)) return current;

      const next = new Set(current);
      next.delete(key);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ startLoading, stopLoading }),
    [startLoading, stopLoading],
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
      <PageLoader visible={activeLoaders.size > 0} />
    </LoaderContext.Provider>
  );
};

export const SuspenseLoader = ({ loaderKey }: { loaderKey: string }) => {
  usePageLoading(loaderKey, true);
  return null;
};
