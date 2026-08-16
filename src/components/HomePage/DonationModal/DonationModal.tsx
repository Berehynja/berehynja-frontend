import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Check,
  Copy,
  CreditCard,
  Heart,
  Landmark,
  Loader2,
  Pencil,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { DonationQRCode } from "./DonationQRCode";
import { useAuth } from "../../AuthProvider/useAuth";
import {
  saveBankDetails,
  subscribeToBankDetails,
  type BankDetails,
} from "../../../services/bankService";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_BANK_DETAILS: BankDetails = {
  name: "",
  bank: "",
  iban: "",
  bic: "",
  purpose: "",
};

export const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const tr = (key: string) => t(`donationModal.${key}`);
  const titleId = useId();
  const copiedTimeoutRef = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bankDetails, setBankDetails] =
    useState<BankDetails>(EMPTY_BANK_DETAILS);


  const handleClose = useCallback(() => {
    if (isSaving) return;

    setIsEditing(false);
    setCopied(false);
    setIsLoading(true);
    onClose();
  }, [isSaving, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToBankDetails((data) => {
      setBankDetails(data || EMPTY_BANK_DETAILS);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [handleClose, isOpen]);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const updateBankDetails = (field: keyof BankDetails, value: string) => {
    setBankDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));
  };

  const handleCopy = async () => {
    const cleanIban = bankDetails.iban.replace(/\s/g, "");
    if (!cleanIban) return;

    try {
      await navigator.clipboard.writeText(cleanIban);
      setCopied(true);

      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current);
      }

      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        copiedTimeoutRef.current = null;
      }, 2000);
    } catch (error) {
      console.error("IBAN copy error:", error);
      toast.error(tr("copyError"));
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      await saveBankDetails(bankDetails);
      setIsEditing(false);
      toast.success(tr("saved"));
    } catch (error) {
      console.error("Bank details save error:", error);
      toast.error(tr("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const hasBankDetails = Boolean(bankDetails.iban.trim());

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={tr("dialogLabel")}
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
        onMouseDown={handleClose}
      />

      <div className="font-nunito relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.3)]">
        <header className="shrink-0 bg-linear-to-br from-blue-600 to-blue-900 px-5 py-5 text-white md:px-6 md:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-md">
                <Heart
                  size={24}
                  className="fill-yellow-400 text-yellow-400"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <h2 id={titleId} className="text-xl font-semibold tracking-tight">
                  {tr("title")}
                </h2>
                <p className="mt-0.5 text-sm font-medium text-blue-100">
                  {tr("subtitle")}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {isAdmin && !isLoading && (
                <button
                  type="button"
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={isSaving}
                  aria-label={
                    isEditing
                      ? tr("save")
                      : tr("edit")
                  }
                  title={
                    isEditing
                      ? tr("save")
                      : tr("edit")
                  }
                  className={`flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/20 text-white shadow-sm backdrop-blur-md transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    isEditing
                      ? "bg-emerald-500 hover:bg-emerald-400"
                      : "bg-white/15 hover:bg-white/25"
                  }`}
                >
                  {isSaving ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : isEditing ? (
                    <Save size={18} aria-hidden="true" />
                  ) : (
                    <Pencil size={18} aria-hidden="true" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                aria-label={tr("close")}
                title={tr("close")}
                className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-black/10 text-white backdrop-blur-md transition-colors hover:bg-black/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div
            role="status"
            aria-label="Loading"
            className="flex min-h-72 items-center justify-center"
          >
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto bg-slate-50/70 p-5 md:p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Landmark size={15} aria-hidden="true" />
                    <span className="text-xs font-semibold tracking-widest uppercase">
                      {tr("bankLabel")}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={bankDetails.bank}
                        onChange={(event) =>
                          updateBankDetails("bank", event.target.value)
                        }
                        aria-label={tr("bankPlaceholder")}
                        placeholder={tr("bankPlaceholder")}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                      />
                      <input
                        value={bankDetails.name}
                        onChange={(event) =>
                          updateBankDetails("name", event.target.value)
                        }
                        aria-label={tr("namePlaceholder")}
                        placeholder={tr("namePlaceholder")}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-base leading-tight font-bold text-slate-950">
                        {bankDetails.bank ||
                          tr("notSpecified")}
                      </p>
                      {bankDetails.name && (
                        <p className="mt-1 text-sm font-medium text-slate-600">
                          {bankDetails.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div
                  aria-hidden="true"
                  className="mb-4 h-px w-full bg-slate-100"
                />

                <div>
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <CreditCard size={15} aria-hidden="true" />
                    <span className="text-xs font-semibold tracking-widest uppercase">
                      IBAN
                    </span>
                  </div>

                  {isEditing ? (
                    <input
                      value={bankDetails.iban}
                      onChange={(event) =>
                        updateBankDetails("iban", event.target.value)
                      }
                      aria-label="IBAN"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm font-bold text-slate-800 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  ) : hasBankDetails ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex w-full items-center justify-center overflow-x-auto rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                        <code className="font-mono text-xs font-bold tracking-tight whitespace-nowrap text-blue-950">
                          {bankDetails.iban}
                        </code>
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleCopy()}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-xs font-bold tracking-wider text-blue-700 uppercase transition-all hover:bg-blue-100 active:scale-[0.98]"
                      >
                        {copied ? (
                          <>
                            <Check
                              size={16}
                              className="text-emerald-600"
                              aria-hidden="true"
                            />
                            <span className="text-emerald-700">
                              {tr("copied")}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} aria-hidden="true" />
                            {tr("copyIban")}
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      {tr("noDetails")}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold tracking-widest text-slate-600 uppercase">
                        BIC (SWIFT)
                      </span>
                      <input
                        value={bankDetails.bic}
                        onChange={(event) =>
                          updateBankDetails("bic", event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-blue-500"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold tracking-widest text-slate-600 uppercase">
                        {tr("purposeLabel")}
                      </span>
                      <input
                        value={bankDetails.purpose}
                        onChange={(event) =>
                          updateBankDetails("purpose", event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>
                )}
              </div>

              {hasBankDetails && (
                <div className="flex flex-col items-center">
                  <DonationQRCode details={bankDetails} />

                  {!isEditing && (
                    <div className="mt-5 flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-emerald-800">
                      <ShieldCheck size={14} aria-hidden="true" />
                      <span className="text-xs font-bold tracking-wide uppercase">
                        {tr("secureBadge")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
