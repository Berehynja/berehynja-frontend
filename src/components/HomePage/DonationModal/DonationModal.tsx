import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Copy, Check, Landmark, CreditCard, Heart, ShieldCheck, Pencil, Save, Loader2 } from "lucide-react";
import { DonationQRCode } from "./DonationQRCode";
import { subscribeToBankDetails, saveBankDetails, type BankDetails } from "../../../services/bankService";
import type { LangKey } from "../../../types/types";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export const DonationModal = ({ isOpen, onClose, isAdmin = true }: DonationModalProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as LangKey;

  const texts = {
    title: { ua: "Підтримайте нас", de: "Unterstützen Sie uns", en: "Support Us" },
    subtitle: { ua: "Ваша допомога важлива", de: "Ihre Hilfe ist wichtig", en: "Your help is important" },
    bankLabel: { ua: "Банк та Отримувач", de: "Bank & Empfänger", en: "Bank & Recipient" },
    bankPlaceholder: { ua: "Назва банку", de: "Bankname", en: "Bank Name" },
    namePlaceholder: { ua: "Отримувач", de: "Empfänger", en: "Recipient" },
    purposeLabel: { ua: "Призначення платежу", de: "Verwendungszweck", en: "Purpose of Payment" },
    secureBadge: { ua: "Безпечний переказ", de: "Sichere Überweisung", en: "Secure Transfer" },
    btnSave: { ua: "Зберегти", de: "Speichern", en: "Save" },
    btnEdit: { ua: "Змінити", de: "Bearbeiten", en: "Edit" },
    copyTitle: { ua: "Копіювати IBAN", de: "IBAN kopieren", en: "Copy IBAN" },
    copiedText: { ua: "Скопійовано!", de: "Kopiert!", en: "Copied!" }
  };

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [bankDetails, setBankDetails] = useState<BankDetails>({ name: "", bank: "", iban: "", bic: "", purpose: "" });

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToBankDetails((data) => {
      setBankDetails(data || { name: "Berehynja e.V.", bank: "Deutsche Bank", iban: "DE12 3456 7890 1234 5678 90", bic: "DEUTDEXXX", purpose: "Spende" });
      setLoadingInitial(false);
    });
    return () => unsubscribe();
  }, [isOpen]);

  const handleCopy = () => {
    if (!bankDetails.iban) return;
    navigator.clipboard.writeText(bankDetails.iban.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveBankDetails(bankDetails);
    setIsEditing(false);
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      {/* Затемнений фон з розмиттям */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex w-full max-w-[420px] max-h-[90vh] flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        
        {/* Шапка */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-6 text-white shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 shadow-inner backdrop-blur-md">
                <Heart size={24} className="fill-yellow-400 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">{texts.title[currentLang]}</h2>
                <p className="text-blue-100 text-sm font-medium mt-0.5 opacity-90">{texts.subtitle[currentLang]}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button 
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={isSaving}
                  // Динамічна зміна кольору кнопки на зелений при редагуванні
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all backdrop-blur-md shadow-sm ${
                    isEditing 
                      ? "bg-green-500 hover:bg-green-400 text-white shadow-green-900/20 scale-105" 
                      : "bg-white/15 hover:bg-white/25 text-white"
                  }`}
                  title={isEditing ? texts.btnSave[currentLang] : texts.btnEdit[currentLang]}
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : isEditing ? <Save size={18} /> : <Pencil size={18} />}
                </button>
              )}
              <button onClick={onClose} className="flex items-center justify-center w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 transition-colors backdrop-blur-md text-white">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Тіло */}
        {loadingInitial ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50/50 p-6">
            <div className="flex flex-col gap-6">
              
              {/* Картка реквізитів */}
              <div className="flex flex-col rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
                
                {/* Банк і Отримувач */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2 text-gray-400">
                    <Landmark size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{texts.bankLabel[currentLang]}</span>
                  </div>
                  
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input value={bankDetails.bank} onChange={(e) => setBankDetails({...bankDetails, bank: e.target.value})} placeholder={texts.bankPlaceholder[currentLang]} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                      <input value={bankDetails.name} onChange={(e) => setBankDetails({...bankDetails, name: e.target.value})} placeholder={texts.namePlaceholder[currentLang]} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                    </div>
                  ) : (
                    <div>
                      <p className="text-base font-bold text-gray-900 leading-tight">{bankDetails.bank || "Не вказано"}</p>
                      <p className="text-sm font-medium text-gray-500 mt-0.5">{bankDetails.name}</p>
                    </div>
                  )}
                </div>

                <div className="h-px w-full bg-gray-100 mb-4" />

                {/* IBAN Секція */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-gray-400">
                    <CreditCard size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">IBAN</span>
                  </div>
                  
                  {isEditing ? (
                    <input value={bankDetails.iban} onChange={(e) => setBankDetails({...bankDetails, iban: e.target.value})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-[13px] font-bold text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex w-full items-center justify-center rounded-xl bg-gray-50 border border-gray-100 px-2 py-3 overflow-hidden">
                        <code className="font-mono text-[12px] font-bold tracking-tight text-blue-950 whitespace-nowrap">
                          {bankDetails.iban}
                        </code>
                      </div>
                      <button 
                        onClick={handleCopy} 
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50/80 py-2.5 text-xs font-bold uppercase tracking-wider text-blue-600 transition-colors hover:bg-blue-100 active:scale-95"
                      >
                        {copied ? (
                          <><Check size={16} className="text-green-600" /> <span className="text-green-600">{texts.copiedText[currentLang]}</span></>
                        ) : (
                          <><Copy size={16} /> {texts.copyTitle[currentLang]}</>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Додаткові поля */}
                {isEditing && (
                  <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-blue-50/50 p-4 border border-blue-100/50">
                    <div>
                      <span className="mb-1 block text-[10px] font-bold text-gray-500 uppercase tracking-widest">BIC (SWIFT)</span>
                      <input value={bankDetails.bic} onChange={(e) => setBankDetails({...bankDetails, bic: e.target.value})} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-mono text-sm outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <span className="mb-1 block text-[10px] font-bold text-gray-500 uppercase tracking-widest">{texts.purposeLabel[currentLang]}</span>
                      <input value={bankDetails.purpose} onChange={(e) => setBankDetails({...bankDetails, purpose: e.target.value})} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* QR-код */}
              <div className="flex flex-col items-center">
                <DonationQRCode details={bankDetails} />
                
                {!isEditing && (
                  <div className="mt-6 flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <ShieldCheck size={14} />
                    <span className="text-xs font-bold uppercase tracking-wide">{texts.secureBadge[currentLang]}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
      
      {/* Приховування скролу */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};