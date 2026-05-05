import { Pencil, Check, X, ImageIcon, Trash2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../components/AuthProvider/useAuth";
import { uploadMedia } from "../../../services/cloudinaryService";
import { fetchAboutContent, updateAboutContent } from "../../../services/ourStoryService";
import { useEffect, useState } from "react";
import type { LangKey } from "../../../types/types";
import { useTranslation } from "react-i18next";
import type { AboutContent } from "../../../types/aboutContent";
import aboutPlaceholder from "../../../images/about.png";

export const OurStory = () => {
  const { isAdmin } = useAuth();
  const { t, i18n } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editLang, setEditLang] = useState<LangKey>("ua");
  const [isUploading, setIsUploading] = useState(false);

  const [content, setContent] = useState<AboutContent>({
    story: { ua: "", en: "", de: "" },
    bannerImage: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAboutContent();
      if (data) {
        setContent(data);
      } else {
        setContent({
          story: {
            ua: t("about.storyContent", { lng: "ua" }),
            en: t("about.storyContent", { lng: "en" }),
            de: t("about.storyContent", { lng: "de" }),
          },
          bannerImage: aboutPlaceholder,
        });
      }
      setIsLoading(false);
      setEditLang(i18n.language as LangKey);
    };
    loadData();
  }, [t, i18n.language]);

  const handleSaveText = async () => {
    try {
      await updateAboutContent({ story: content.story });
      setIsEditing(false);
    } catch (error) {
      alert("Помилка збереження: " + error);
    }
  };

  const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadMedia(file, "banners", "about_us_banner");
      await updateAboutContent({ bannerImage: result.url });
      setContent((prev) => ({ ...prev, bannerImage: result.url }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="py-20 text-center font-bold">Завантаження...</div>;

  return (
    <>
      <div className="order-2 lg:order-1">
        <div className="mb-6 flex items-center gap-4">
          <h2 className="font-nunito border-l-4 border-blue-500 pl-4 text-3xl text-gray-900">
            {t("about.storyTitle")}
          </h2>
          {isAdmin && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer rounded-full bg-slate-100 p-2 text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            {/* ПЕРЕМИКАЧ МОВ */}
            <div className="mb-4 flex gap-2 rounded-xl border border-slate-100 bg-white p-1">
              {(["ua", "en", "de"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setEditLang(lang)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold uppercase transition-all ${
                    editLang === lang
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {lang}{" "}
                  {content.story[lang] && (
                    <CheckCircle2
                      size={12}
                      className={editLang === lang ? "text-white" : "text-green-500"}
                    />
                  )}
                </button>
              ))}
            </div>

            <textarea
              value={content.story[editLang]}
              onChange={(e) =>
                setContent({
                  ...content,
                  story: { ...content.story, [editLang]: e.target.value },
                })
              }
              className="min-h-[250px] w-full resize-none rounded-xl border-none bg-white p-4 text-lg shadow-inner outline-none focus:ring-0"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSaveText}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-blue-700"
              >
                <Check size={18} /> Зберегти
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-slate-100 bg-white px-6 py-3 font-bold md:text-slate-400 md:hover:text-slate-600"
              >
                <X size={18} /> Скасувати
              </button>
            </div>
          </div>
        ) : (
          <p className="font-montserratRegular text-lg leading-relaxed whitespace-pre-wrap text-gray-700">
            {content.story[i18n.language as LangKey] || content.story["ua"]}
          </p>
        )}
      </div>

      {/* BANNER */}

      <div className="group relative order-1 h-[450px] overflow-hidden rounded-[3rem] bg-slate-100 shadow-2xl lg:order-2">
        <img
          src={content.bannerImage || aboutPlaceholder}
          alt="About Banner"
          className={`h-full w-full object-cover transition-all duration-700 ${isUploading ? "opacity-50 blur-sm" : ""}`}
        />
        {isAdmin && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 transition-opacity">
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold shadow-xl transition-all hover:bg-blue-600 hover:text-white">
              <ImageIcon size={18} /> {isUploading ? "Завантаження..." : "Змінити банер"}
              <input
                type="file"
                className="hidden"
                onChange={handlePhotoUpdate}
                accept="image/*"
                disabled={isUploading}
              />
            </label>
            <button
              onClick={async () => {
                if (confirm("Видалити фото банера?")) {
                  await updateAboutContent({ bannerImage: "" });
                  setContent({ ...content, bannerImage: "" });
                }
              }}
              className="flex cursor-pointer items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:bg-red-700"
            >
              <Trash2 size={18} /> Видалити
            </button>
          </div>
        )}
      </div>
    </>
  );
};
