import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

const TURNSTILE_SITE_KEY = "0x4AAAAAAEhJ_SCswzuK0T4-";

type TurnstileSize = "normal" | "compact";

interface TurnstileWidgetProps {
  action: string;
  onVerify: (token: string) => void;
}

const getTurnstileLanguage = (language?: string) => {
  const languageCode = (language ?? "en")
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];

  if (languageCode === "ua") {
    return "uk";
  }

  if (
    languageCode === "uk" ||
    languageCode === "en" ||
    languageCode === "de"
  ) {
    return languageCode;
  }

  return "en";
};

export const TurnstileWidget = ({
  action,
  onVerify,
}: TurnstileWidgetProps) => {
  const { i18n } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [widgetSize, setWidgetSize] =
    useState<TurnstileSize>("normal");

  const turnstileLanguage =
    getTurnstileLanguage(
      i18n.resolvedLanguage ?? i18n.language,
    );

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const updateWidgetSize = () => {
      const nextSize =
        wrapper.clientWidth < 300
          ? "compact"
          : "normal";

      setWidgetSize((currentSize) =>
        currentSize === nextSize
          ? currentSize
          : nextSize,
      );
    };

    updateWidgetSize();

    const resizeObserver =
      new ResizeObserver(updateWidgetSize);

    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    let intervalId:
      | ReturnType<typeof setInterval>
      | undefined;

    const container = containerRef.current;

    onVerify("");

    const renderWidget = () => {
      if (
        !container ||
        !window.turnstile ||
        widgetIdRef.current
      ) {
        return false;
      }

      widgetIdRef.current =
        window.turnstile.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          action,
          language: turnstileLanguage,
          size: widgetSize,
          callback: onVerify,
          "expired-callback": () => onVerify(""),
          "error-callback": () => onVerify(""),
        });

      return true;
    };

    if (!renderWidget()) {
      intervalId = setInterval(() => {
        if (renderWidget() && intervalId) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      const widgetId = widgetIdRef.current;
      widgetIdRef.current = null;

      if (
        widgetId &&
        window.turnstile &&
        container?.hasChildNodes()
      ) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [
    action,
    onVerify,
    turnstileLanguage,
    widgetSize,
  ]);

  return (
    <div ref={wrapperRef} className="w-full">
      <div
        className={
          widgetSize === "compact"
            ? "mx-auto w-37.5"
            : "w-75 max-w-full"
        }
      >
        <div ref={containerRef} />
      </div>
    </div>
  );
};

interface TurnstileOptions {
  sitekey: string;
  action: string;
  language: string;
  size: TurnstileSize;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
}

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: TurnstileOptions,
  ) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}
