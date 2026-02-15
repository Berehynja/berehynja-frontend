import { QrCode } from "lucide-react";

export const DonationQRCode = () => {
  // Дані, зашифровані в коді:
  // BCD (Version 002)
  // UTF-8
  // Beneficiary: Berehynja e.V.
  // IBAN: DE12345678901234567890
  // BIC: DEUTDEXXX
  // Purpose: Spende
  
  return (
    <div className="relative flex flex-col items-center">
      <div className="bg-white p-3 rounded-2xl shadow-inner border border-gray-100">
        {/* Це візуальна симуляція GiroCode. 
            Для реального використання на продакшні краще вставити пряме посилання на згенерований SVG */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-900"
        >
          <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm1 1h3v3H2V2zm0 15h1v1H2v-1zM0 22h7v7H0v-7zm1 1v5h5v-5H1zm1 1h3v3H2v-3zM22 0h7v7h-7V0zm1 1v5h5V1h-1zm1 1h3v3H2v-3zM10 0h1v1h-1V0zm2 0h1v1h-1V0zm3 0h1v1h-1V0zm2 0h1v1h-1V0zm0 2h1v1h-1V2zm-5 2h1v1h-1V4zm2 0h1v1h-1V4zm2 0h1v1h-1V4zm2 0h1v1h-1V4zm-7 2h1v1h-1V6zm2 0h1v1h-1V6zm5 0h1v1h-1V6zM8 8h1v1H8V8zm2 0h1v1h-1V8zm2 0h1v1h-1V8zm5 0h1v1h-1V8zm2 0h1v1h-1V8zm2 0h1v1h-1V8zm2 0h1v1h-1V8zm-9 2h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-10 2h1v1h-1v-1zm5 0h1v1h-1v-1zm2 0h1v1h-1v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1z" fill="currentColor"/>
          {/* Центр з логотипом */}
          <rect x="11" y="11" width="7" height="7" rx="2" fill="#ef4444" fillOpacity="0.1" />
          <path d="M14.5 16.5l-2-2a1.5 1.5 0 112.12-2.12L14.5 12.5l.38-.38a1.5 1.5 0 112.12 2.12l-2 2z" fill="#ef4444" />
        </svg>
      </div>
      <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-lg">
        <QrCode size={14} className="text-yellow-400" />
        <span className="text-[10px] font-montserratBold uppercase tracking-widest">GiroCode Standard</span>
      </div>
    </div>
  );
};