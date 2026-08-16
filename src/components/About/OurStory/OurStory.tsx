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

import { useAuth } from "../../AuthProvider/useAuth";
import { PageLoader } from "../../ui/PageLoader";
import { uploadMedia } from "../../../services/cloudinaryService";
import {
  fetchAboutContent,
  updateAboutContent,
} from "../../../services/ourStoryService";
import type { AboutContent } from "../../../types/aboutContent";
import type { LangKey } from "../../../types/types";

const EMPTY_STORY: AboutContent["story"] = {
  ua: "",
  en: "",
  de: "",
};

export const OurStory = () => {
  const { isAdmin } = useAuth();
  const { t, i18n } = useTranslation();

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toLowerCase();
  const currentLang: LangKey = ["ua", "en", "de"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const [content, setContent] = useState<AboutContent>({
    story: EMPTY_STORY,
    bannerImage: "",
  });
  const [draftStory, setDraftStory] =
    useState<AboutContent["story"]>(EMPTY_STORY);
  const [editLang, setEditLang] = useState<LangKey>(currentLang);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAboutContent();

        if (data) {
          const normalizedData: AboutContent = {
            story: {
              ua: data.story?.ua ?? "",
              en: data.story?.en ?? "",
              de: data.story?.de ?? "",
            },
            bannerImage: data.bannerImage ?? "",
          };

          setContent(normalizedData);
          setDraftStory(normalizedData.story);
        }
      } catch (error) {
        console.error("Error loading About content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  useEffect(() => {
    if (!isEditing) setEditLang(currentLang);
  }, [currentLang, isEditing]);

  const openEditor = () => {
    setDraftStory({ ...content.story });
    setEditLang(currentLang);
    setIsEditing(true);
  };

  const closeEditor = () => {
    if (isSaving) return;

    setDraftStory({ ...content.story });
    setIsEditing(false);
  };

  const handleSaveText = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      await updateAboutContent({ story: draftStory });
      setContent((previous) => ({ ...previous, story: draftStory }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving About story:", error);
      window.alert(
        t("common.editTextModal.saveError", {
          defaultValue: "The changes could not be saved.",
        }),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpdate = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isUploading) return;

    setIsUploading(true);

    try {
      const result = await uploadMedia(file, "banners", "about_us_banner");
      await updateAboutContent({ bannerImage: result.url });
      setContent((previous) => ({
        ...previous,
        bannerImage: result.url,
      }));
    } catch (error) {
      console.error("Error uploading About banner:", error);
      window.alert(
        t("common.editTextModal.uploadError", {
          defaultValue: "The image could not be uploaded.",
        }),
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handlePhotoDelete = async () => {
    if (isUploading || !content.bannerImage) return;

    const shouldDelete = window.confirm(
      t("about.statute.confirmDelete", {
        defaultValue: "Are you sure you want to delete this file?",
      }),
    );

    if (!shouldDelete) return;

    setIsUploading(true);

    try {
      await updateAboutContent({ bannerImage: "" });
      setContent((previous) => ({ ...previous, bannerImage: "" }));
    } catch (error) {
      console.error("Error deleting About banner:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <PageLoader visible />;

  const displayedStory = content.story[currentLang];

  return (
    <section
      aria-labelledby="our-story-title"
      className="font-nunito relative isolate overflow-hidden rounded-4xl border border-slate-800/80 bg-[#07162f] shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
    >
      <PageLoader visible={isUploading || isSaving} />

      <div className="relative h-72 overflow-hidden md:h-88 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[62%]">
        {content.bannerImage ? (
          <img
            src={content.bannerImage}
            alt={t("about.storyTitle")}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-linear-to-br from-blue-950 via-slate-800 to-blue-900 text-blue-100/60">
            <ImageIcon size={54} strokeWidth={1.4} aria-hidden="true" />
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-transparent via-[#07162f]/15 to-[#07162f] lg:bg-linear-to-r lg:from-[#07162f] lg:via-[#07162f]/65 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-slate-950/30 via-transparent to-transparent"
        />

        {isAdmin && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-white/60 bg-white/90 px-3 py-2 text-sm font-bold text-slate-700 shadow-lg backdrop-blur-md hover:bg-blue-600 hover:text-white">
              <ImageIcon size={17} aria-hidden="true" />
              <span className="hidden md:inline">
                {t("common.editTextModal.replaceImage")}
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={handlePhotoUpdate}
                className="hidden"
              />
            </label>

            {content.bannerImage && (
              <button
                type="button"
                onClick={handlePhotoDelete}
                disabled={isUploading}
                aria-label={t("common.editTextModal.removeImage")}
                className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-red-100 bg-white/90 text-red-600 shadow-lg backdrop-blur-md hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-wait disabled:opacity-60"
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 -mt-12 px-5 pb-8 md:-mt-16 md:px-8 md:pb-10 lg:mt-0 lg:flex lg:min-h-145 lg:w-[60%] lg:flex-col lg:justify-center lg:px-12 lg:py-14 xl:px-16">
        <div className="mb-7 flex items-start gap-8">
          <div className="w-fit max-w-full">
            <h2
              id="our-story-title"
              className="text-3xl font-semibold tracking-tight text-white md:text-4xl"
            >
              {t("about.storyTitle")}
            </h2>
            <div
              aria-hidden="true"
              className="mt-4 h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
            />
          </div>

          {isAdmin && !isEditing && (
            <button
              type="button"
              onClick={openEditor}
              aria-label={t("common.editTextModal.defaultTitle")}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 text-blue-100 backdrop-blur-md hover:border-blue-300/60 hover:bg-blue-500/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              <Pencil size={18} aria-hidden="true" />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="rounded-3xl border border-white/15 bg-white/95 p-4 shadow-2xl md:p-6">
            <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
              {(["ua", "en", "de"] as const).map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => setEditLang(language)}
                  className={`flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-xs font-bold uppercase ${
                    editLang === language
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-blue-700"
                  }`}
                >
                  {language}
                  {draftStory[language].trim() && (
                    <CheckCircle2
                      size={13}
                      aria-hidden="true"
                      className={
                        editLang === language
                          ? "text-blue-100"
                          : "text-emerald-500"
                      }
                    />
                  )}
                </button>
              ))}
            </div>

            <textarea
              value={draftStory[editLang]}
              onChange={(event) =>
                setDraftStory((previous) => ({
                  ...previous,
                  [editLang]: event.target.value,
                }))
              }
              rows={9}
              className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-800 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
            />

            <div className="mt-4 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={closeEditor}
                disabled={isSaving}
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
              >
                <X size={18} aria-hidden="true" />
                {t("common.editTextModal.cancel")}
              </button>

              <button
                type="button"
                onClick={handleSaveText}
                disabled={isSaving}
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
              >
                <Check size={18} aria-hidden="true" />
                {isSaving
                  ? t("common.editTextModal.saving")
                  : t("common.editTextModal.save")}
              </button>
            </div>
          </div>
        ) : (
          <p className="max-w-2xl text-base leading-8 font-medium whitespace-pre-wrap text-slate-200 md:text-lg md:leading-9">
            {displayedStory || "—"}
          </p>
        )}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 size-64 rounded-full bg-blue-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/3 size-52 rounded-full bg-yellow-300/10 blur-3xl"
      />
    </section>
  );
};
