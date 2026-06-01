import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  Lock,
  Eye,
  Server,
  Database,
  UserCheck,
  FileLock2,
  Fingerprint,
  AlertCircle,
  Mail,
  ShieldAlert,
  X,
  Youtube,
  ImageIcon,
  ArrowRight,
  FileText,
} from "lucide-react";
import { subscribeToContacts } from "../../services/contactService";
import type { ContactData } from "../../types/contactData";

export const Privacy = () => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<{ title: string; text: string } | null>(null);
  const [contacts, setContacts] = useState<ContactData | null>(null);

  // Підтягуємо контакти з бази даних для відображення актуального email
  useEffect(() => {
    const unsubContacts = subscribeToContacts((data) => {
      if (data) setContacts(data);
    });

    return () => {
      unsubContacts();
    };
  }, []);

  const rights = [
    {
      label: t("privacy.rights.info.label"),
      icon: <Eye size={18} />,
      desc: "Art. 15 DSGVO",
      content: t("privacy.rights.info.desc"),
    },
    {
      label: t("privacy.rights.correction.label"),
      icon: <ShieldCheck size={18} />,
      desc: "Art. 16 DSGVO",
      content: t("privacy.rights.correction.desc"),
    },
    {
      label: t("privacy.rights.deletion.label"),
      icon: <AlertCircle size={18} />,
      desc: "Art. 17 DSGVO",
      content: t("privacy.rights.deletion.desc"),
    },
    {
      label: t("privacy.rights.objection.label"),
      icon: <ShieldAlert size={18} />,
      desc: "Art. 21 DSGVO",
      content: t("privacy.rights.objection.desc"),
    },
  ];

  return (
    <div className="font-nunito mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      
      {/* HEADER SECTION */}
      <div className="mb-12 pb-8 border-b border-slate-200">
        <div className="flex flex-col w-fit gap-3 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-sm border border-slate-200/60">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase">
              {t("privacy.title")}
            </h1>
          </div>
          <div className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>
        <p className="text-lg text-slate-500 leading-relaxed max-w-3xl">
          {t("privacy.subtitle")}
        </p>
      </div>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-12">
        {/* ЛІВА КОЛОНКА */}
        <div className="flex flex-col gap-8">
          
          {/* 1. Verantwortlicher */}
          <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <UserCheck size={20} />
              </div>
              <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                {t("privacy.controller.title")}
              </h2>
            </div>
            <div className="space-y-4 text-slate-700 pl-14">
              <p className="text-xl font-bold text-slate-900">Berehynja e.V.</p>
              <p className="text-sm leading-relaxed text-slate-500">
                {t("privacy.controller.desc")}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Mail size={18} className="text-slate-400 shrink-0" />
                <a 
                  href={`mailto:${contacts?.email || "info@berehynja.de"}`} 
                  className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors break-all"
                >
                  {contacts?.email || "info@berehynja.de"}
                </a>
              </div>
            </div>
          </div>

          {/* 2. Infrastructure */}
          <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Server size={20} />
              </div>
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                {t("privacy.infrastructure.title")}
              </h3>
            </div>
            <div className="space-y-4 pl-14">
              <p className="text-sm leading-relaxed text-slate-500">
                {t("privacy.infrastructure.desc")}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-600 uppercase tracking-wider mt-2">
                <Lock size={14} className="text-green-600" /> {t("privacy.infrastructure.encryption")}
              </div>
            </div>
          </div>

          {/* 3. Cookies */}
          <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-yellow-400 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(250,204,21,0.1)] transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
                <Fingerprint size={20} />
              </div>
              <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                {t("privacy.cookies.title")}
              </h2>
            </div>
            <div className="pl-14">
              <p className="text-sm leading-relaxed text-slate-500">
                {t("privacy.cookies.desc")}
              </p>
            </div>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА */}
        <div className="flex flex-col gap-8">
          
          {/* 4. Rights */}
          <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileLock2 size={20} />
              </div>
              <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                {t("privacy.rights.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rights.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModal({ title: item.label, text: item.content })}
                  className="group flex cursor-pointer flex-col justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-500 transition-colors group-hover:text-blue-700">
                        {item.icon}
                      </div>
                      <p className="font-bold text-sm text-slate-800 transition-colors group-hover:text-blue-700">{item.label}</p>
                    </div>
                    <ArrowRight size={14} className="text-blue-400 opacity-0 -translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase ml-8">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 5. External Media */}
          <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Database size={20} />
              </div>
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                {t("privacy.media.title")}
              </h3>
            </div>
            <div className="space-y-6 pl-14">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  <ImageIcon size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Cloudinary</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t("privacy.media.cloudinaryDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <Youtube size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">YouTube (Google)</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t("privacy.media.youtubeDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Complaint Right */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1">
                {t("privacy.complaint.title")}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t("privacy.complaint.desc")}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- MODAL WINDOW --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="animate-in fade-in absolute inset-0 bg-slate-900/40 backdrop-blur-sm duration-300"
            onClick={() => setActiveModal(null)}
          />

          <div className="animate-in zoom-in-95 relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl duration-300">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-slate-400 transition-colors hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full p-2"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <FileText size={32} />
              </div>
              
              <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">
                {activeModal.title}
              </h3>
              
              <div className="mb-6 h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-yellow-400"></div>

              <p className="text-base leading-relaxed text-slate-600 mb-8 px-2">
                {activeModal.text}
              </p>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full rounded-xl bg-slate-900 py-3.5 font-bold tracking-widest text-white uppercase transition-all hover:bg-blue-600 active:scale-[0.98] shadow-md"
              >
                {t("privacy.modal.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};