import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Copy, Check, Landmark, CreditCard, Heart, ShieldCheck, Pencil, Save, Loader2 } from "lucide-react";

import { DonationQRCode } from "./DonationQRCode";
import { subscribeToBankDetails, saveBankDetails, type BankDetails } from "../../../services/bankService"; // Перевір свої шляхи!
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
    subtitle: { ua: "Ваша допомога важлива для нашої громади", de: "Ihre Hilfe ist wichtig für unsere Gemeinschaft", en: "Your help is important for our community" },
    bankLabel: { ua: "Банк / Отримувач", de: "Bank / Empfänger", en: "Bank / Recipient" },
    bankPlaceholder: { ua: "Назва банку", de: "Bankname", en: "Bank Name" },
    namePlaceholder: { ua: "Отримувач", de: "Empfänger", en: "Recipient" },
    purposeLabel: { ua: "Призначення платежу", de: "Verwendungszweck", en: "Purpose of Payment" },
    secureBadge: { ua: "Безпечно та напряму через банк", de: "Sicher & Direkt per Banküberweisung", en: "Secure & Direct via Bank Transfer" },
    qrInstruction: { ua: "Відскануйте цей код у вашому банківському додатку, щоб автоматично заповнити всі реквізити.", de: "Scannen Sie diesen Code in Ihrer Banking-App, um alle Details automatisch auszufüllen.", en: "Scan this code in your banking app to automatically fill in all details." },
    qrEditInstruction: { ua: "QR-код автоматично оновлюється при зміні реквізитів зліва.", de: "Der QR-Code wird bei Änderung der Daten links automatisch aktualisiert.", en: "The QR code updates automatically when you change the details on the left." },
    btnSave: { ua: "Зберегти", de: "Speichern", en: "Save" },
    btnEdit: { ua: "Змінити", de: "Bearbeiten", en: "Edit" },
    copyTitle: { ua: "Копіювати IBAN", de: "IBAN kopieren", en: "Copy IBAN" }
  };

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Стан для крутилки при збереженні
  const [loadingInitial, setLoadingInitial] = useState(true); // Стан завантаження з Firebase

  // Дані за замовчуванням (вони заміняться даними з Firebase)
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    name: "",
    bank: "",
    iban: "",
    bic: "",
    purpose: "",
  });

  // 1. ПІДПИСКА НА FIREBASE
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToBankDetails((data) => {
      if (data) {
        // Якщо дані є в базі — ставимо їх
        setBankDetails(data);
      } else {
        // Якщо бази ще немає (перший запуск) — ставимо красиві дефолтні дані, 
        // щоб ти міг їх відредагувати і зберегти
        setBankDetails({
          name: "Berehynja e.V.",
          bank: "Deutsche Bank",
          iban: "DE12 3456 7890 1234 5678 90",
          bic: "DEUTDEXXX",
          purpose: "Spende / Благодійність",
        });
      }
      // Обов'язково вимикаємо завантаження в обох випадках!
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

  // 2. ЗБЕРЕЖЕННЯ В FIREBASE
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveBankDetails(bankDetails);
      setIsEditing(false); // Вимикаємо режим редагування після успішного збереження
    } catch (error) {
      console.error("Помилка збереження реквізитів:", error);
      alert("Не вдалося зберегти дані. Перевірте з'єднання.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="animate-in fade-in absolute inset-0 bg-gray-950/60 backdrop-blur-sm duration-300" onClick={onClose} />

      <div className="animate-in zoom-in-95 relative flex w-full max-w-3xl max-h-[95dvh] flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl duration-300">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center justify-center rounded-full bg-black/10 p-2 text-white/80 transition-colors hover:bg-black/20 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Екран завантаження, поки чекаємо перші дані з Firebase */}
        {loadingInitial ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-700 to-blue-600 p-6 sm:p-8 text-white shrink-0">
              <div className="flex items-center gap-4 pr-12 sm:pr-16">
                <div className="shrink-0 rounded-2xl bg-white/20 p-3">
                  <Heart size={28} className="fill-yellow-400 text-yellow-400 sm:h-8 sm:w-8" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <h2 className="font-nunito text-xl sm:text-2xl font-bold tracking-tight uppercase leading-tight">
                      {texts.title[currentLang]}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-blue-100 italic">
                      {texts.subtitle[currentLang]}
                    </p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                      disabled={isSaving}
                      className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-70 ${
                        isEditing 
                          ? "bg-green-500 text-white hover:bg-green-400" 
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {isSaving ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : isEditing ? (
                        <><Save size={16} /> {texts.btnSave[currentLang]}</>
                      ) : (
                        <><Pencil size={16} /> {texts.btnEdit[currentLang]}</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 items-start gap-8 p-6 sm:p-8 md:grid-cols-2">
              
              {/* Ліва колонка */}
              <div className="flex flex-col gap-6">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-gray-500">
                    <Landmark size={14} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{texts.bankLabel[currentLang]}</span>
                  </div>
                  
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={bankDetails.bank}
                        onChange={(e) => setBankDetails({ ...bankDetails, bank: e.target.value })}
                        placeholder={texts.bankPlaceholder[currentLang]}
                        className="w-full rounded-lg border-2 border-blue-400 bg-blue-50/50 px-3 py-1.5 font-nunito text-lg font-semibold text-gray-900 outline-none transition-colors focus:bg-white"
                      />
                      <input
                        value={bankDetails.name}
                        onChange={(e) => setBankDetails({ ...bankDetails, name: e.target.value })}
                        placeholder={texts.namePlaceholder[currentLang]}
                        className="w-full rounded-lg border-2 border-blue-400 bg-blue-50/50 px-3 py-1.5 text-sm font-medium text-gray-700 outline-none transition-colors focus:bg-white"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="font-nunito text-lg font-semibold text-gray-900">{bankDetails.bank || "Не вказано"}</p>
                      <p className="text-sm font-medium text-gray-500">{bankDetails.name}</p>
                    </>
                  )}
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-2 text-gray-500">
                    <CreditCard size={14} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">IBAN</span>
                  </div>
                  
                  <div className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4 transition-colors hover:border-blue-200">
                    {isEditing ? (
                      <input
                        value={bankDetails.iban}
                        onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value })}
                        className="w-full rounded-md border-2 border-blue-400 bg-blue-50/50 px-2 py-1 font-mono text-sm sm:text-base font-bold text-gray-800 outline-none focus:bg-white"
                      />
                    ) : (
                      <code className="break-all font-mono text-sm sm:text-base font-bold text-gray-800">
                        {bankDetails.iban || "Не вказано"}
                      </code>
                    )}
                    
                    {!isEditing && (
                      <button
                        onClick={handleCopy}
                        className="shrink-0 flex items-center justify-center rounded-xl bg-white p-2.5 text-blue-600 shadow-sm transition-all hover:scale-105 hover:bg-blue-50 hover:shadow active:scale-95"
                        title={texts.copyTitle[currentLang]}
                      >
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      </button>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-4">
                    <div>
                      <span className="mb-1 block text-[10px] font-bold text-gray-500 tracking-widest uppercase">BIC (SWIFT)</span>
                      <input
                        value={bankDetails.bic}
                        onChange={(e) => setBankDetails({ ...bankDetails, bic: e.target.value })}
                        className="w-full rounded-md border-2 border-blue-400 bg-blue-50/50 px-2 py-1 font-mono text-sm outline-none focus:bg-white"
                      />
                    </div>
                    <div>
                      <span className="mb-1 block text-[10px] font-bold text-gray-500 tracking-widest uppercase">{texts.purposeLabel[currentLang]}</span>
                      <input
                        value={bankDetails.purpose}
                        onChange={(e) => setBankDetails({ ...bankDetails, purpose: e.target.value })}
                        className="w-full rounded-md border-2 border-blue-400 bg-blue-50/50 px-2 py-1 text-sm outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/80 p-4 text-blue-700">
                    <ShieldCheck size={20} className="shrink-0" />
                    <p className="font-nunito text-xs sm:text-[13px] font-bold uppercase tracking-tight leading-snug">
                      {texts.secureBadge[currentLang]}
                    </p>
                  </div>
                )}

              </div>

              {/* Права колонка */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8">
                <DonationQRCode details={bankDetails} />
                <p className="font-nunito mt-6 max-w-xs text-center text-xs sm:text-[13px] leading-relaxed text-gray-600 italic">
                  {isEditing ? texts.qrEditInstruction[currentLang] : texts.qrInstruction[currentLang]}
                </p>
              </div>

            </div>
          </div>
        )}

        <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-8 sm:py-5 text-center">
          <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            Berehynja e.V. • Bad Oeynhausen • Deutschland
          </p>
        </div>

      </div>
    </div>
  );
};