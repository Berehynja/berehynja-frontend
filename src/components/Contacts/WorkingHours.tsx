import { useEffect, useState, type ChangeEvent } from "react";
import { Ban, CheckCircle2, Clock, Plus, Save, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useAuth } from "../AuthProvider/useAuth";
import {
  saveSchedule,
  subscribeToSchedule,
} from "../../services/workingSheduleService";
import type { WorkingSchedule } from "../../types/workingSchedule";
import type { LangKey } from "../../types/types";

export const WorkingHours = () => {
  const { isAdmin } = useAuth();
  const { i18n, t } = useTranslation();
  const [items, setItems] = useState<WorkingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editLang, setEditLang] = useState<LangKey>("ua");

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split(
    "-",
  )[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  useEffect(() => {
    const unsubscribe = subscribeToSchedule((data) => {
      setItems(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = (
    id: string,
    updates: Partial<WorkingSchedule>,
  ): void => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const handleLangUpdate = (
    id: string,
    field: "days" | "label",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: { ...item[field], [editLang]: value },
            }
          : item,
      ),
    );
  };

  const addItem = (): void => {
    const newItem: WorkingSchedule = {
      id: crypto.randomUUID(),
      days: { ua: "Новий період", en: "New period", de: "Neuer Zeitraum" },
      label: { ua: "Опис", en: "Description", de: "Beschreibung" },
      time: "09:00 - 18:00",
      isClosed: false,
    };

    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string): void => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onSave = async (): Promise<void> => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      await saveSchedule(items);
      toast.success(t("contact.workingHours.saved"));
    } catch (error) {
      console.error("Schedule save error:", error);
      toast.error(t("contact.workingHours.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="min-h-80 w-full animate-pulse rounded-4xl bg-[#041560]"
      />
    );
  }

  return (
    <section
      aria-labelledby="working-hours-title"
      className="font-nunito relative overflow-hidden rounded-4xl border border-white/10 bg-[#041560] p-5 text-white shadow-[0_24px_70px_rgba(4,21,96,0.28)] md:p-6 lg:p-8"
    >
      <header className="mb-7 flex flex-col items-center gap-5 text-center lg:flex-row lg:justify-between lg:text-left">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-950/30">
            <Clock size={21} aria-hidden="true" />
          </div>

          <h2
            id="working-hours-title"
            className="text-[clamp(1.35rem,2.4vw,1.75rem)] leading-tight font-semibold tracking-tight whitespace-nowrap text-white"
          >
            {t("contact.workingHours.title")}
          </h2>
        </div>

        {isAdmin && (
          <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row md:flex-wrap md:justify-center">
            <div className="flex rounded-xl border border-white/15 bg-white/5 p-1 shadow-inner">
              {(["ua", "en", "de"] as const).map((lang) => {
                const isFilled = items.every(
                  (item) => item.days[lang]?.trim() && item.label[lang]?.trim(),
                );

                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setEditLang(lang)}
                    aria-pressed={editLang === lang}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold uppercase transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${
                      editLang === lang
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {lang}
                    {isFilled && (
                      <CheckCircle2
                        size={14}
                        aria-hidden="true"
                        className={
                          editLang === lang ? "text-blue-100" : "text-green-400"
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={addItem}
                aria-label={t("contact.workingHours.add")}
                title={t("contact.workingHours.add")}
                className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/15 text-blue-300 transition-all hover:border-blue-300 hover:bg-blue-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
              >
                <Plus size={20} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                aria-label={t("contact.workingHours.save")}
                title={t("contact.workingHours.save")}
                className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-green-400/30 bg-green-500/15 text-green-300 transition-all hover:border-green-300 hover:bg-green-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save
                  size={20}
                  aria-hidden="true"
                  className={isSaving ? "animate-pulse" : ""}
                />
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-base font-medium text-white/75">
            {t("contact.workingHours.empty")}
          </p>
        )}

        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/7 md:p-5"
          >
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              {isAdmin && (
                <div className="order-2 flex shrink-0 gap-2 md:order-1 md:flex-col">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdate(item.id, { isClosed: !item.isClosed })
                    }
                    aria-label={t("contact.workingHours.toggleClosed")}
                    title={t("contact.workingHours.toggleClosed")}
                    className={`flex size-9 cursor-pointer items-center justify-center rounded-xl border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 ${
                      item.isClosed
                        ? "border-red-400 bg-red-500 text-white"
                        : "border-white/10 bg-white/5 text-white/65 hover:border-red-400/50 hover:text-red-300"
                    }`}
                  >
                    <Ban size={16} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={t("contact.workingHours.remove")}
                    title={t("contact.workingHours.remove")}
                    className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/65 transition-all hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              )}

              <div className="order-1 min-w-0 flex-1 md:order-2">
                {isAdmin ? (
                  <div className="mx-auto flex max-w-xl flex-col gap-2 md:mx-0">
                    <input
                      aria-label={`${t("contact.workingHours.periodPlaceholder")} ${editLang}`}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-base font-semibold tracking-wide text-blue-200 uppercase outline-none transition-all placeholder:text-white/45 focus:border-blue-400 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 md:text-left"
                      value={item.days[editLang]}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleLangUpdate(item.id, "days", event.target.value)
                      }
                      placeholder={
                        t("contact.workingHours.periodPlaceholder")
                      }
                    />

                    <input
                      aria-label={`${t("contact.workingHours.labelPlaceholder")} ${editLang}`}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-base font-medium text-white outline-none transition-all placeholder:text-white/45 focus:border-blue-400 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 md:text-left"
                      value={item.label[editLang]}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleLangUpdate(item.id, "label", event.target.value)
                      }
                      placeholder={
                        t("contact.workingHours.labelPlaceholder")
                      }
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 md:items-start">
                    <span
                      className={`text-base font-semibold tracking-wide uppercase ${
                        item.isClosed ? "text-white/65" : "text-blue-200"
                      }`}
                    >
                      {item.days[currentLang] || item.days.ua}
                    </span>

                    <span
                      className={`text-preset-4 font-medium ${
                        item.isClosed ? "text-white/65" : "text-white"
                      }`}
                    >
                      {item.label[currentLang] || item.label.ua}
                    </span>
                  </div>
                )}
              </div>

              <div className="order-3 flex min-w-32 shrink-0 items-center justify-center md:justify-end">
                {item.isClosed ? (
                  <span className="inline-flex min-h-8 min-w-25 items-center justify-center rounded-full border border-red-400/50 bg-red-500/20 px-4 text-sm font-semibold tracking-wide text-red-200 uppercase">
                    {t("contact.workingHours.closed")}
                  </span>
                ) : isAdmin ? (
                  <input
                    aria-label={t("contact.workingHours.timePlaceholder")}
                    className="w-36 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-center text-base font-semibold text-white outline-none transition-all focus:border-blue-400 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10"
                    value={item.time}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleUpdate(item.id, { time: event.target.value })
                    }
                    placeholder={t("contact.workingHours.timePlaceholder")}
                  />
                ) : (
                  <span className="rounded-xl bg-white/5 px-4 py-2 text-base font-semibold tracking-tight whitespace-nowrap text-white">
                    {item.time}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-7 text-center text-sm leading-6 font-medium text-white/70 italic">
        * {t("contact.workingHours.disclaimer") || "Графік може змінюватися у святкові дні"}
      </p>
    </section>
  );
};
