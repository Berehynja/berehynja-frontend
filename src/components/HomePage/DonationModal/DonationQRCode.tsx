import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export interface BankDetails {
  name: string;
  bank: string;
  iban: string;
  bic: string;
  purpose: string;
}

interface DonationQRCodeProps {
  details: BankDetails;
}

export const DonationQRCode = ({ details }: DonationQRCodeProps) => {
  const generateGiroCodeString = () => {
    const { name, iban, bic, purpose } = details;
    
    // Твоя логіка генерації залишилася без змін
    const cleanIban = iban.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const cleanBic = bic.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const cleanPurpose = purpose.replace(/[^A-Za-z0-9\s]/g, "").substring(0, 70);

    const fields = [
      "BCD",
      "002",
      "1",
      "SCT",
      cleanBic,
      name.substring(0, 70),
      cleanIban,
      "",
      "",
      "",
      cleanPurpose
    ];

    return fields.join("\r\n");
  };

  const qrString = generateGiroCodeString();

  return (
    // Додано w-full та max-w-[280px], щоб він не був зашироким на мобільних
    <div className="relative flex flex-col items-center w-full max-w-[280px] mx-auto">
      <div className="w-full aspect-square rounded-2xl border border-gray-100 bg-white p-4 shadow-inner flex items-center justify-center">
        <QRCodeSVG
          value={qrString}
          size={160}
          level="M"
          includeMargin={false}
          className="w-full h-full text-gray-900"
          style={{ backgroundColor: "white" }}
        />
      </div>
      
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1 text-white shadow-sm shrink-0">
        <QrCode size={14} className="text-yellow-400" />
        <span className="font-nunito text-[10px] tracking-widest uppercase">GiroCode Standard</span>
      </div>
    </div>
  );
};