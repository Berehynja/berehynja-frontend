import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Handshake, Pencil, Check, X, ImageIcon, Trash2, CheckCircle2 } from "lucide-react";
import { MembersList } from "../../components/Team/MembersList";
import { useAuth } from "../../components/AuthProvider/useAuth";
import { uploadMedia } from "../../services/cloudinaryService";
import { fetchAboutContent, updateAboutContent } from "../../services/ourStoryService";
import type { AboutContent } from "../../types/aboutContent";
import type { LangKey } from '../../types/types';

import aboutPlaceholder from "../../images/about.png";
import partner from "../../images/icons8-penguin-color/icons8-penguin-48.png";



export const About = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editLang, setEditLang] = useState<LangKey>('ua'); 
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [content, setContent] = useState<AboutContent>({
    story: { ua: "", en: "", de: "" },
    bannerImage: ""
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAboutContent();
      if (data) {
        setContent(data);
      } else {
        setContent({
          story: { 
            ua: t("about.storyContent", { lng: 'ua' }), 
            en: t("about.storyContent", { lng: 'en' }), 
            de: t("about.storyContent", { lng: 'de' }) 
          },
          bannerImage: aboutPlaceholder
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
    } catch (e) {
      alert("Помилка збереження");
    }
  };

  const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadMedia(file, 'banners', 'about_us_banner');
      await updateAboutContent({ bannerImage: result.url });
      setContent(prev => ({ ...prev, bannerImage: result.url }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="py-20 text-center font-bold">Завантаження...</div>;

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex justify-center pb-4 text-4xl md:text-5xl uppercase">
            {t("about.aboutUs")}
          </h1>
          <div className="mx-auto mb-4 h-1.5 w-24 rounded-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>
        <p className="text-preset-4 flex max-w-5xl items-center justify-center px-4 leading-8 text-gray-600 italic md:px-0 md:text-left text-lg">
          {t("about.missionDescription")}
        </p>
      </div>

      {/* STORY & BANNER SECTION */}
      <section className="my-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-montserratBold border-l-4 border-blue-500 pl-4 text-3xl text-gray-900 uppercase">
              {t("about.storyTitle")}
            </h2>
            {isAdmin && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="p-2 text-blue-600 bg-slate-100 rounded-full hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
              {/* ПЕРЕМИКАЧ МОВ */}
              <div className="flex gap-2 p-1 bg-white rounded-xl border border-slate-100 mb-4">
                {(['ua', 'en', 'de'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setEditLang(lang)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                      editLang === lang ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {lang} {content.story[lang] && <CheckCircle2 size={12} className={editLang === lang ? "text-white" : "text-green-500"} />}
                  </button>
                ))}
              </div>
              
              <textarea
                value={content.story[editLang]}
                onChange={(e) => setContent({
                  ...content,
                  story: { ...content.story, [editLang]: e.target.value }
                })}
                className="w-full min-h-[250px] p-4 text-lg border-none rounded-xl focus:ring-0 outline-none bg-white shadow-inner resize-none"
              />
              
              <div className="flex gap-3">
                <button onClick={handleSaveText} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition-all shadow-lg">
                  <Check size={18}/> Зберегти все
                </button>
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-white text-slate-400 rounded-xl font-bold cursor-pointer hover:text-slate-600 border border-slate-100">
                  <X size={18}/> Скасувати
                </button>
              </div>
            </div>
          ) : (
            <p className="font-montserratRegular text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
              {content.story[i18n.language as LangKey] || content.story['ua']}
            </p>
          )}
        </div>

        {/* BANNER */}
        <div className="group relative order-1 h-[450px] overflow-hidden rounded-[3rem] shadow-2xl lg:order-2 bg-slate-100">
          <img 
            src={content.bannerImage || aboutPlaceholder} 
            alt="About Banner" 
            className={`h-full w-full object-cover transition-all duration-700 ${isUploading ? 'opacity-50 blur-sm' : ''}`} 
          />
          {isAdmin && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 transition-opacity">
              <label className="bg-white px-6 py-3 rounded-2xl font-bold text-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 shadow-xl">
                <ImageIcon size={18}/> {isUploading ? "Завантаження..." : "Змінити банер"}
                <input type="file" className="hidden" onChange={handlePhotoUpdate} accept="image/*" disabled={isUploading} />
              </label>
              <button 
                onClick={async () => {
                  if(confirm("Видалити фото банера?")) {
                    await updateAboutContent({ bannerImage: "" });
                    setContent({...content, bannerImage: ""});
                  }
                }}
                className="bg-red-500 px-6 py-3 rounded-2xl font-bold text-sm text-white hover:bg-red-700 transition-all cursor-pointer flex items-center gap-2 shadow-xl"
              >
                <Trash2 size={18}/> Видалити
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MEMBERS SECTION */}
      <section className="py-16">
        <MembersList />
      </section>

      {/* PARTNERS SECTION */}
      <section className="py-20">
        <div className="mb-12 text-center">
          <h2 className="font-montserratBold mb-4 flex items-center justify-center gap-3 text-3xl uppercase">
            <Handshake className="text-yellow-500" size={32} /> {t("about.ourPartners")}
          </h2>
          <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-linear-to-r from-yellow-400 to-blue-500"></div>
        </div>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <li key={id} className="flex flex-col items-center group">
              <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-4xl border border-gray-100 bg-white shadow-sm group-hover:-translate-y-2 transition-all duration-300">
                <img src={partner} alt="partner" className="h-16 w-16 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>

            </li>
          ))}
        </ul>
      </section>

      {/* STATUT */}
      <div className="mt-20 flex justify-center pb-20">
        <a href="#" className="group flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-white shadow-xl hover:bg-blue-600 transition-all">
          <FileText size={24} />
          <span className="font-bold uppercase text-sm tracking-wider">Статут Організації (PDF)</span>
        </a>
      </div>
    </div>
  );
};
