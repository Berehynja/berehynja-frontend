import { useState } from "react";
import { X, Copy, Check, Landmark, CreditCard, Heart, ShieldCheck } from "lucide-react";
import { DonationQRCode } from "./DonationQRCode";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
  const [copied, setCopied] = useState(false);

  const bankDetails = {
    name: "Berehynja",
    bank: "Deutsche Bank",
    iban: "DE12 3456 7890 1234 5678 90", // Заміни на свій реальний
    bic: "DEUTDEXXX",
    purpose: "Spende / Благодійність",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bankDetails.iban.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-gray-950/60 backdrop-blur-md duration-300"
        onClick={onClose}
      />

      <div className="animate-in zoom-in-95 relative w-full max-w-3xl overflow-hidden rounded-4xl bg-white shadow-2xl duration-300">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 to-blue-600 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-white/50 transition-colors hover:text-white"
          >
            <X size={28} />
          </button>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-3">
              <Heart size={32} className="fill-yellow-400 text-yellow-400" />
            </div>
            <div>
              <h2 className="font-nunito text-2xl tracking-tight uppercase">
                Unterstützen Sie uns
              </h2>
              <p className="text-sm text-blue-100 italic">
                Ваша допомога важлива для нашої громади
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 p-8 md:grid-cols-2">
          {/* Реквізити */}
          <div className="space-y-6">
            <div>
              <div className="mb-1 flex items-center gap-2 text-gray-500">
                <Landmark size={14} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Bank / Банк</span>
              </div>
              <p className="font-nunito text-lg text-gray-800">{bankDetails.bank}</p>
              <p className="text-sm text-gray-500">{bankDetails.name}</p>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2 text-gray-500">
                <CreditCard size={14} />
                <span className="text-[10px] font-bold tracking-widest uppercase">IBAN</span>
              </div>
              <div className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <code className="text-sm font-bold text-gray-700">{bankDetails.iban}</code>
                <button
                  onClick={handleCopy}
                  className="text-blue-600 transition-transform hover:scale-110"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-blue-700">
              <ShieldCheck size={18} />
              <p className="font-nunito text-[13px] tracking-tight uppercase">
                Sicher & Direkt per Banküberweisung
              </p>
            </div>
          </div>

          {/* QR-Код Секція */}
          <div className="flex flex-col items-center">
            <DonationQRCode />
            <p className="font-nunito mt-4 text-center text-[13px] leading-relaxed text-gray-900 italic">
              Відскануйте цей код у вашому банківському додатку, щоб автоматично заповнити всі
              реквізити.
            </p>
          </div>
        </div>

        <div className="flex justify-center border-t border-gray-100 bg-gray-50 px-8 py-6">
          <p className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            Berehynja e.V. • Bad Oeynhausen • Deutschland
          </p>
        </div>
      </div>
    </div>
  );
};
