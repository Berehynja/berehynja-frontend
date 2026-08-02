import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ContactData } from "../../types/contactData";
import type { LangKey } from "../../types/types";

interface ContactMapProps {
  contacts: ContactData | null;
}

const MAP_TEXT = {
  title: {
    ua: "Наше розташування",
    de: "Unser Standort",
    en: "Our location",
  },
  description: {
    ua: "Карта завантажиться після вашого підтвердження та підключить зовнішній сервіс Google Maps.",
    de: "Die Karte wird nach Ihrer Bestätigung geladen und stellt eine Verbindung zu Google Maps her.",
    en: "The map will load after your confirmation and connect to the external Google Maps service.",
  },
  loadMap: {
    ua: "Показати карту",
    de: "Karte anzeigen",
    en: "Show map",
  },
  openMap: {
    ua: "Відкрити в Google Maps",
    de: "In Google Maps öffnen",
    en: "Open in Google Maps",
  },
  unavailable: {
    ua: "Адресу для карти ще не налаштовано",
    de: "Die Adresse für die Karte ist noch nicht eingerichtet",
    en: "The map address has not been configured yet",
  },
};

const isSafeHttpsUrl = (value?: string) => {
  if (!value) return false;

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeCoordinates = (value: string) => {
  const match = value.match(
    /^\s*(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/,
  );

  if (!match) return "";

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  const coordinatesAreValid =
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  return coordinatesAreValid ? `${latitude},${longitude}` : "";
};

const extractCoordinates = (value: string) => {
  const directCoordinates = normalizeCoordinates(value);
  if (directCoordinates) return directCoordinates;

  try {
    const url = new URL(value);
    const pathCoordinates = url.pathname.match(
      /@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
    );

    if (pathCoordinates) {
      return normalizeCoordinates(`${pathCoordinates[1]},${pathCoordinates[2]}`);
    }

    for (const parameter of ["q", "query", "ll", "destination"]) {
      const parameterCoordinates = normalizeCoordinates(
        url.searchParams.get(parameter) || "",
      );

      if (parameterCoordinates) return parameterCoordinates;
    }
  } catch {
    return "";
  }

  return "";
};

export const ContactMap = ({ contacts }: ContactMapProps) => {
  const { i18n } = useTranslation();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split("-")[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const addressQuery = [contacts?.address, contacts?.city].filter(Boolean).join(", ");
  const savedMapValue = contacts?.mapUrl?.trim() || "";
  const coordinates = extractCoordinates(savedMapValue);
  const mapQuery = coordinates || addressQuery;

  const generatedMapUrl = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
    : "";

  const savedMapUrl = isSafeHttpsUrl(savedMapValue) ? savedMapValue : "";
  const savedUrlIsEmbed =
    savedMapUrl.includes("/embed") || savedMapUrl.includes("output=embed");

  const mapEmbedUrl = savedUrlIsEmbed ? savedMapUrl : generatedMapUrl;
  const externalMapUrl =
    savedMapUrl ||
    (mapQuery
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
      : "");

  return (
    <section
      aria-label={MAP_TEXT.title[currentLang]}
      className="relative min-h-80 overflow-hidden rounded-4xl border border-slate-200 bg-slate-50 shadow-[0_18px_50px_rgba(15,23,42,0.12)] md:min-h-96"
    >
      {mapEmbedUrl && isMapLoaded ? (
        <>
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={mapEmbedUrl}
            loading="lazy"
            title={MAP_TEXT.title[currentLang]}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          {externalMapUrl && (
            <a
              href={externalMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/90 px-4 py-2.5 text-sm font-bold text-slate-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {MAP_TEXT.openMap[currentLang]}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow-sm">
            <MapPin size={30} aria-hidden="true" />
          </div>

          <h2 className="text-xl font-black text-slate-950">
            {MAP_TEXT.title[currentLang]}
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            {mapEmbedUrl
              ? MAP_TEXT.description[currentLang]
              : MAP_TEXT.unavailable[currentLang]}
          </p>

          {mapEmbedUrl && (
            <button
              type="button"
              onClick={() => setIsMapLoaded(true)}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <MapPin size={18} aria-hidden="true" />
              {MAP_TEXT.loadMap[currentLang]}
            </button>
          )}
        </div>
      )}
    </section>
  );
};
