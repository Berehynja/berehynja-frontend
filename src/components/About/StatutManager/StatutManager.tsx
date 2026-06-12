import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FileText, FileDown, Upload, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "../../AuthProvider/useAuth";
import { uploadMedia } from "../../../services/cloudinaryService";
import { subscribeToStatute, updateStatuteDoc } from "../../../services/statuteService";

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
    return url.replace("/raw/upload/", "/raw/upload/fl_attachment/");
  }

  return url;
};

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const uniqueFileName = `official_statute_${Date.now()}.pdf`;

      const renamedFile = new File([file], uniqueFileName, {
        type: "application/pdf",
      });

      // ВАЖНО: PDF загружаем как raw, а не image
      const result = await uploadMedia(renamedFile, "documents", "", "raw");

      await updateStatuteDoc({
        url: result.url,
        publicId: result.public_id,
      });

      setStatuteUrl(result.url);
    } catch (err) {
      console.error(t("about.statute.errorLog"), err);
      alert(t("about.statute.uploadError"));
    } finally {
      setLoading(false);

      // Чтобы можно было загрузить тот же файл повторно
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t("about.statute.confirmDelete"))) return;

    setLoading(true);

    try {
      await updateStatuteDoc({
        url: null,
        publicId: null,
      });

      setStatuteUrl(null);
    } catch (err) {
      console.error(t("about.statute.errorLog"), err);
      alert(t("about.statute.deleteError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-6 transition-all hover:border-blue-300">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-2xl bg-blue-50 p-4 text-blue-600">
            <FileText size={32} />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-lg font-bold text-slate-900">
              {t("about.statute.title")}
            </h4>

            {statuteUrl ? (
              <button
                type="button"
                onClick={() => {
                  window.open(getDownloadUrl(statuteUrl), "_blank", "noopener,noreferrer");
                }}
                className="mt-1 flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-sm font-medium text-blue-600 hover:underline"
              >
                {t("about.statute.download")} <FileDown size={14} />
              </button>
            ) : (
              <p className="mt-1 text-sm text-slate-400 italic">{t("about.statute.notUploaded")}</p>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="mt-2 w-full shrink-0 sm:mt-0 sm:w-auto">
            {loading ? (
              <div className="flex w-full justify-center p-2 sm:justify-end">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 sm:w-auto sm:py-2">
                  <Upload size={18} className="sm:h-4 sm:w-4" />
                  {statuteUrl ? t("about.statute.change") : t("about.statute.upload")}

                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>

                {statuteUrl && (
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-sm transition-all hover:bg-red-100 sm:w-auto sm:py-2"
                  >
                    <Trash2 size={18} className="sm:h-4 sm:w-4" />
                    {t("about.statute.delete")}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
