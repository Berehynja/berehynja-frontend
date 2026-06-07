import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FileText, FileDown, Upload, Loader2, Trash2 } from "lucide-react"; // Добавили Trash2
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Добавили .pdf для корректного отображения в браузере!
      const uniqueFileName = `official_statute_${Date.now()}.pdf`;
      const result = await uploadMedia(file, "documents", "", "raw", uniqueFileName);

      await updateStatuteDoc({ url: result.url, publicId: result.public_id });
      setStatuteUrl(result.url);
      
    } catch (err) {
      console.error(t("about.statute.errorLog"), err);
      alert(t("about.statute.uploadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t("about.statute.confirmDelete"))) return;

    setLoading(true);
    try {
      // Просто затираем данные в Firebase
      await updateStatuteDoc({ url: null, publicId: null });
      setStatuteUrl(null);
    } catch (err) {
      console.error(t("about.statute.errorLog"), err);
      alert(t("about.statute.deleteError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-white transition-all hover:border-blue-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        
        <div className="flex items-center gap-4">
          <div className="shrink-0 p-4 bg-blue-50 rounded-2xl text-blue-600">
            <FileText size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-lg text-slate-900 truncate">
              {t("about.statute.title")}
            </h4>
            {statuteUrl ? (
              <a 
                href={statuteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                download="Statute_Berehynja.pdf"
                className="text-blue-600 flex items-center gap-1 hover:underline text-sm font-medium mt-1"
              >
                {t("about.statute.download")} <FileDown size={14} />
              </a>
            ) : (
              <p className="text-sm text-slate-400 italic mt-1">
                {t("about.statute.notUploaded")}
              </p>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
            {loading ? (
              <div className="flex justify-center sm:justify-end w-full p-2">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm w-full sm:w-auto">
                  <Upload size={18} className="sm:w-4 sm:h-4" />
                  {statuteUrl ? t("about.statute.change") : t("about.statute.upload")}
                  <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
                </label>
                
                {statuteUrl && (
                  <button 
                    onClick={handleDelete}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 sm:py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm w-full sm:w-auto"
                  >
                    <Trash2 size={18} className="sm:w-4 sm:h-4" />
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