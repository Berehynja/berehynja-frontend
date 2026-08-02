import {
  Check,
  CheckCircle2,
  ImageIcon,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../components/AuthProvider/useAuth";
import { PageLoader } from "../../../components/ui/PageLoader";
import { uploadMedia } from "../../../services/cloudinaryService";
import {
  fetchAboutContent,
  updateAboutContent,
} from "../../../services/ourStoryService";
import type { AboutContent } from "../../../types/aboutContent";
import type { LangKey } from "../../../types/types";

export const OurStory = () => {
  const { isAdmin } = useAuth();
  const { t, i18n } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editLang, setEditLang] = useState<LangKey>("ua");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<AboutContent>({
    story: { ua: "", en: "", de: "" },
    bannerImage: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAboutContent();

        setContent(
          data ?? {
            story: {
              ua: t("about.storyContent", { lng: "ua" }),
              en: t("about.storyContent", { lng: "en" }),
              de: t("about.storyContent", { lng: "de" }),
            },
            bannerImage: "",
          },
        );
        setEditLang(i18n.language as LangKey);
      } catch (error) {
        console.error("Error loading About content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [i18n.language, t]);

  const handleSaveText = async () => {
    try {
      await updateAboutContent({ story: content.story });
      setIsEditing(false);
    } catch (error) {
      alert(`Помилка збереження: ${String(error)}`);
    }
  };

  const handlePhotoUpdate = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadMedia(file, "banners", "about_us_banner");
      await updateAboutContent({ bannerImage: result.url });
      setContent((previous) => ({ ...previous, bannerImage: result.url }));
    } catch (error) {
      console.error("Error uploading About banner:", error);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handlePhotoDelete = async () => {
    if (!window.confirm("Видалити фото банера?")) return;

    try {
      await updateAboutContent({ bannerImage: "" });
      setContent((previous) => ({ ...previous, bannerImage: "" }));
    } catch (error) {
      console.error("Error deleting About banner:", error);
    }
  };

  if (isLoading) return <PageLoader visible />;

  return (
    <>
      <PageLoader visible={isUploading} />

      <div className="order-2 lg:order-1">
        <div className="mb-6 flex items-center gap-4">
          <h2 className="font-nunito border-l-4 border-blue-500 pl-4 text-3xl text-gray-900">
            {t("about.storyTitle")}
          </h2>

          {isAdmin && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label="Редагувати текст"
              className="cursor-pointer rounded-full bg-slate-100 p-2 text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 flex gap-2 rounded-xl border border-slate-100 bg-white p-1">
              {(["ua", "en", "de"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setEditLang(lang)}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold uppercase transition-all ${
                    editLang === lang
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {lang}
                  {content.story[lang] && (
                    <CheckCircle2
                      size={12}
                      className={
                        editLang === lang ? "text-white" : "text-green-500"
                      }
                    />
                  )}
                </button>
              ))}
            </div>

            <textarea
              value={content.story[editLang]}
              onChange={(event) =>
                setContent((previous) => ({
                  ...previous,
                  story: {
                    ...previous.story,
                    [editLang]: event.target.value,
                  },
                }))
              }
              className="min-h-55 w-full resize-none rounded-xl border-none bg-white p-4 text-lg shadow-inner outline-none focus:ring-0"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveText}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-blue-700"
              >
                <Check size={18} /> Зберегти
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-slate-100 bg-white px-6 py-3 font-bold text-slate-500 transition-colors hover:text-slate-700"
              >
                <X size={18} /> Скасувати
              </button>
            </div>
          </div>
        ) : (
          <p className="font-montserratRegular text-lg leading-relaxed whitespace-pre-wrap text-gray-700">
            {content.story[i18n.language as LangKey] || content.story.ua}
          </p>
        )}
      </div>

      <div className="group relative order-1 h-112.5 overflow-hidden rounded-[3rem] bg-slate-100 shadow-2xl lg:order-2">
        {content.bannerImage ? (
          <img
            src={content.bannerImage}
            alt={t("about.storyTitle")}
            className={`h-full w-full object-cover transition-all duration-700 ${
              isUploading ? "opacity-50 blur-sm" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-linear-to-br from-slate-50 to-slate-200 text-slate-400">
            <ImageIcon size={52} strokeWidth={1.5} />
            {isAdmin && <span className="text-sm font-semibold">Додайте банер</span>}
          </div>
        )}

        {isAdmin && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 transition-opacity">
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold shadow-xl transition-all hover:bg-blue-600 hover:text-white">
              <ImageIcon size={18} />
              {isUploading ? "Завантаження..." : "Змінити банер"}
              <input
                type="file"
                className="hidden"
                onChange={handlePhotoUpdate}
                accept="image/*"
                disabled={isUploading}
              />
            </label>

            {content.bannerImage && (
              <button
                type="button"
                onClick={handlePhotoDelete}
                className="flex cursor-pointer items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:bg-red-700"
              >
                <Trash2 size={18} /> Видалити
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};
