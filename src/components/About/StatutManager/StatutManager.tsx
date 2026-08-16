import { useEffect, useState, type ChangeEvent } from "react";
import { FileDown, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../AuthProvider/useAuth";
import { uploadMedia } from "../../../services/cloudinaryService";
import {
  subscribeToStatute,
  updateStatuteDoc,
} from "../../../services/statuteService";

export const StatuteManager = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [statuteUrl, setStatuteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToStatute((data) => {
      setStatuteUrl(data?.url || null);
    });

    return () => unsubscribe();
  }, []);

  const getDownloadUrl = (url: string) => {
    if (url.includes("/raw/upload/")) {
      return url.replace(
        "/raw/upload/",
        "/raw/upload/fl_attachment/",
      );
    }

    return url;
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const renamedFile = new File(
        [file],
        `official_statute_${Date.now()}.pdf`,
        { type: "application/pdf" },
      );

      const result = await uploadMedia(
        renamedFile,
        "documents",
        "",
        "raw",
      );

      await updateStatuteDoc({
        url: result.url,
        publicId: result.public_id,
      });

      setStatuteUrl(result.url);
    } catch (error) {
      console.error(t("about.statute.errorLog"), error);
      window.alert(t("about.statute.uploadError"));
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t("about.statute.confirmDelete"))) return;

    setLoading(true);

    try {
      await updateStatuteDoc({ url: null, publicId: null });
      setStatuteUrl(null);
    } catch (error) {
      console.error(t("about.statute.errorLog"), error);
      window.alert(t("about.statute.deleteError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-white transition-all hover:border-blue-300 lg:flex lg:items-center lg:justify-between">
      <div className="flex items-center gap-4 p-5 md:p-6 lg:min-w-0 lg:flex-1">
        <div className="flex size-15 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <FileText size={30} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-slate-900 md:text-xl">
            {t("about.statute.title")}
          </h2>

          {statuteUrl ? (
            <button
              type="button"
              onClick={() =>
                window.open(
                  getDownloadUrl(statuteUrl),
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="mt-1 inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800 hover:underline md:text-base"
            >
              {t("about.statute.download")}
              <FileDown size={16} aria-hidden="true" />
            </button>
          ) : (
            <p className="mt-1 text-sm font-medium text-slate-500 italic md:text-base">
              {t("about.statute.notUploaded")}
            </p>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="border-t border-dashed border-slate-200 bg-slate-50/70 px-5 py-4 md:px-6 lg:shrink-0 lg:border-t-0 lg:bg-transparent lg:py-0 lg:pl-0">
          {loading ? (
            <div
              role="status"
              className="flex min-h-11 w-full items-center justify-center"
            >
              <Loader2
                className="animate-spin text-blue-600"
                size={24}
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center lg:justify-end">
              <label className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md sm:w-auto">
                <Upload size={17} aria-hidden="true" />
                {statuteUrl
                  ? t("about.statute.change")
                  : t("about.statute.upload")}

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleUpload}
                  className="sr-only"
                />
              </label>

              {statuteUrl && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:shadow-md sm:w-auto"
                >
                  <Trash2 size={17} aria-hidden="true" />
                  {t("about.statute.delete")}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
