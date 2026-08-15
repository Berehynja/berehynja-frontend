import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ContactData } from "../../types/contactData";

interface ContactMapProps {
  contacts: ContactData | null;
}


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
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;

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
      return normalizeCoordinates(
        `${pathCoordinates[1]},${pathCoordinates[2]}`,
      );
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
  const { t } = useTranslation();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const addressQuery = [contacts?.address, contacts?.city]
    .filter(Boolean)
    .join(", ");
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
      aria-label={t("contact.map.title")}
      className="font-nunito relative min-h-80 overflow-hidden rounded-4xl border border-slate-200 bg-slate-50 shadow-[0_18px_50px_rgba(15,23,42,0.12)] md:min-h-96"
    >
      {mapEmbedUrl && isMapLoaded ? (
        <>
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={mapEmbedUrl}
            loading="lazy"
            title={t("contact.map.title")}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          {externalMapUrl && (
            <a
              href={externalMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-4 bottom-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/50 bg-white/90 px-4 py-2.5 text-base font-semibold text-slate-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {t("contact.map.openMap")}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow-sm">
            <MapPin size={30} aria-hidden="true" />
          </div>

          <h2 className="text-preset-3 font-semibold tracking-tight text-slate-950">
            {t("contact.map.title")}
          </h2>

          <p className="text-preset-4 mt-3 max-w-md leading-7 font-medium text-slate-600 md:leading-8">
            {mapEmbedUrl
              ? t("contact.map.description")
              : t("contact.map.unavailable")}
          </p>

          {mapEmbedUrl && (
            <button
              type="button"
              onClick={() => setIsMapLoaded(true)}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <MapPin size={18} aria-hidden="true" />
              {t("contact.map.loadMap")}
            </button>
          )}
        </div>
      )}
    </section>
  );
};
