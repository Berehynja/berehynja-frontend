import { useState, useEffect, type ChangeEvent } from "react";
import { Clock, Trash2, Plus, Save, Ban, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../AuthProvider/useAuth";
import { subscribeToSchedule, saveSchedule } from "../../services/SheduleService";
import type { WorkingSchedule } from "../../types/workingSchedule";
import type { LangKey } from "../../types/types";

export const WorkingHours = () => {
  const { isAdmin } = useAuth();
  const { i18n, t } = useTranslation();

  const [items, setItems] = useState<WorkingSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editLang, setEditLang] = useState<LangKey>("ua");

  const currentLang = i18n.language as LangKey;

  useEffect(() => {
    const unsubscribe = subscribeToSchedule((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Оновлення простих полів (time, isClosed)
  const handleUpdate = (id: string, updates: Partial<WorkingSchedule>): void => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  // Оновлення перекладів (days, label)
  const handleLangUpdate = (id: string, field: "days" | "label", value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: { ...item[field], [editLang]: value },
          };
        }
        return item;
      })
    );
  };

  const addItem = (): void => {
    const newItem: WorkingSchedule = {
      id: crypto.randomUUID(),
      days: { ua: "Новий період", en: "New period", de: "Zeitraum" },
      label: { ua: "Опис", en: "Description", de: "Beschreibung" },
      time: "09:00 — 18:00",
      isClosed: false,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string): void => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const onSave = async (): Promise<void> => {
    try {
      await saveSchedule(items);
      alert("Успішно збережено!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Помилка при збереженні");
    }
  };

  const statusLabels: Record<LangKey, string> = {
    ua: "Зачинено",
    en: "Closed",
    de: "Geschlossen",
  };

  if (loading) return null;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#041560] p-6 text-white shadow-xl">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/20">
            <Clock size={20} />
          </div>
          <h3 className="font-nunito text-xl font-black tracking-tight">Робочі години</h3>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            {/* Language Tabs */}
            <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
              {(["ua", "en", "de"] as const).map((l) => {
                const isFilled = items.every((i) => i.days[l]?.trim() && i.label[l]?.trim());
                return (
                  <button
                    key={l}
                    onClick={() => setEditLang(l)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-all ${
                      editLang === l
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {l}
                    {isFilled && (
                      <CheckCircle2
                        size={12}
                        className={editLang === l ? "text-blue-200" : "text-green-500"}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="ml-2 flex gap-1">
              <button
                onClick={addItem}
                className="rounded-xl p-2.5 text-blue-400 transition-all hover:bg-white/10 active:scale-90"
              >
                <Plus size={22} />
              </button>
              <button
                onClick={onSave}
                className="rounded-xl p-2.5 text-green-400 transition-all hover:bg-white/10 active:scale-90"
              >
                <Save size={22} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SCHEDULE LIST */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start gap-4 pb-4 ${
              index !== items.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            {/* Admin Actions (Left side - logic) */}
            {isAdmin && (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => handleUpdate(item.id, { isClosed: !item.isClosed })}
                  className={`rounded-lg p-2 transition-all ${
                    item.isClosed
                      ? "bg-red-500 text-white"
                      : "bg-white/5 text-white/30 hover:bg-white/10"
                  }`}
                >
                  <Ban size={16} />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded-lg bg-white/5 p-2 text-white/30 transition-all hover:bg-red-400/10 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* Main Info (Center - editable) */}
            <div className="min-w-0 flex-1 space-y-2">
              {isAdmin ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black tracking-widest text-blue-400 uppercase transition-all outline-none focus:border-blue-500"
                    value={item.days[editLang]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleLangUpdate(item.id, "days", e.target.value)
                    }
                    placeholder="Період..."
                  />
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-all outline-none focus:border-blue-500"
                    value={item.label[editLang]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleLangUpdate(item.id, "label", e.target.value)
                    }
                    placeholder="Опис..."
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <span
                    className={`text-[11px] font-black tracking-widest uppercase ${item.isClosed ? "text-white/30" : "text-blue-400"}`}
                  >
                    {item.days[currentLang] || item.days["ua"]}
                  </span>
                  <span
                    className={`text-sm font-bold ${item.isClosed ? "text-white/40" : "text-white"}`}
                  >
                    {item.label[currentLang] || item.label["ua"]}
                  </span>
                </div>
              )}
            </div>

            {/* Time / Status (Right side) */}
            <div className="flex min-h-9.5 items-center ">
              {/* min-h-[44px] відповідає висоті інпуту, щоб рядок не "стрибав" за висотою */}
              {item.isClosed ? (
                <span className="inline-flex h-[26px] min-w-[100px] items-center justify-center rounded-full border border-red-400/50 bg-red-500/20 px-3 pb-[1px] text-[10px] leading-none font-black tracking-widest text-red-400 uppercase">
                  {statusLabels[currentLang]}
                </span>
              ) : isAdmin ? (
                <input
                  className="w-32 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right text-base font-black text-white transition-all outline-none focus:border-blue-500 focus:bg-white/10"
                  value={item.time}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleUpdate(item.id, { time: e.target.value })
                  }
                  placeholder="00:00 - 00:00"
                />
              ) : (
                <span className="text-base font-black tracking-tight whitespace-nowrap text-white">
                  {item.time}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <p className="mt-8 text-center text-[10px] font-medium text-white/30 italic">
        * {t("schedule.disclaimer") || "Графік може змінюватися у святкові дні"}
      </p>
    </div>
  );
};
