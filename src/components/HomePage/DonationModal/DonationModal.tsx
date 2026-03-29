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
    purpose: "Spende / Благодійність"
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bankDetails.iban.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-white rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 to-blue-600 p-8 text-white">
          <button onClick={onClose} className="absolute right-8 top-8 text-white/50 hover:text-white transition-colors">
            <X size={28} />
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Heart size={32} className="fill-yellow-400 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-montserratBold uppercase tracking-tight">Unterstützen Sie uns</h2>
              <p className="text-blue-100 text-sm italic">Ваша допомога важлива для нашої громади</p>
            </div>
          </div>
        </div>

        <div className="p-8  grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Реквізити */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Landmark size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Bank / Банк</span>
              </div>
              <p className="font-montserratBold text-gray-800 text-lg">{bankDetails.bank}</p>
              <p className="text-sm text-gray-500">{bankDetails.name}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <CreditCard size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">IBAN</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 group">
                <code className="text-sm font-bold text-gray-700">{bankDetails.iban}</code>
                <button onClick={handleCopy} className="text-blue-600 hover:scale-110 transition-transform">
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-blue-700 border border-blue-100">
              <ShieldCheck size={18} />
              <p className="text-[13px] font-montserratBold uppercase tracking-tight">Sicher & Direkt per Banküberweisung</p>
            </div>
          </div>

          {/* QR-Код Секція */}
          <div className="flex flex-col items-center">
            <DonationQRCode />
            <p className="mt-4 text-[13px] text-gray-900 text-center leading-relaxed font-montserratRegular italic">
              Відскануйте цей код у вашому банківському додатку, щоб автоматично заповнити всі реквізити.
            </p>
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-center">
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold">
            Berehynja e.V. • Bad Oeynhausen • Deutschland
          </p>
        </div>
      </div>
    </div>
  );
};