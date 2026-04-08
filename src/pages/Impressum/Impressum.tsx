import { useState, useEffect } from "react";
import { 
  Building2, UserCircle, Mail, Phone, Save, Edit2,
  Info, MapPin, Globe, FileBadge, CheckCircle2,
  ShieldAlert, Copyright, ExternalLink, Globe2, Scale
} from "lucide-react";
import { useAuth } from "../../components/AuthProvider/useAuth";
import { subscribeToContacts } from "../../services/contactService";
import { subscribeToImpressum, saveImpressum } from "../../services/impressumService";
import type { ContactData } from "../../types/contactData";
import type { ImpressumData } from "../../types/impressumData";

const initialData: ImpressumData = {
  representative: "Olena Ivanenko",
  position: "1. Vorsitzende",
  registerCourt: "Bad Oeynhausen",
  registerNumber: "VR 12345",
  responsiblePerson: "Olena Ivanenko, 32545 Weserstraße 24, Bad-Oeynhausen.",
  headerDescription: "Юридична інформація про організацію Berehynja e.V. відповідно до параграфа § 5 TMG. Тут ви знайдете наші реєстраційні дані та офіційних представників.",
  website: "www.berehynja.de"
};

export const Impressum = () => {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [legalData, setLegalData] = useState<ImpressumData>(initialData);
  const [contacts, setContacts] = useState<ContactData | null>(null);

  useEffect(() => {
    const unsubImpressum = subscribeToImpressum((data) => {
      if (data) setLegalData(data as ImpressumData);
    });
    const unsubContacts = subscribeToContacts((data) => {
      if (data) setContacts(data);
    });
    return () => { unsubImpressum(); unsubContacts(); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLegalData(prev => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    await saveImpressum(legalData);
    setIsEditing(false);
  };

  // Однотипный стиль для всех инпутов
  const inputStyles = "w-full p-2 bg-white/90 border border-gray-300 rounded-xl text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-sans italic text-sm";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 relative font-montserrat">
      
      {/* КНОПКА АДМИНА */}
      {isAdmin && (
        <button
          onClick={isEditing ? onSave : () => setIsEditing(true)}
          className={`fixed bottom-10 right-10 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all ${
            isEditing ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:scale-110"
          }`}
        >
          {isEditing ? <Save size={24} /> : <Edit2 size={24} />}
        </button>
      )}

      {/* HEADER SECTION */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <div className="flex items-center gap-3 pb-2">
            <Scale className="text-blue-600" size={32} />
            <h1 className="text-preset-2 font-montserratBold text-4xl md:text-5xl text-gray-900 uppercase">
              Impressum
            </h1>
          </div>
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <div className="w-full max-w-3xl flex items-start gap-4">
          <Info className="text-blue-500 shrink-0 mt-1" size={24} />
          {isEditing ? (
            <textarea 
              name="headerDescription"
              value={legalData.headerDescription}
              onChange={handleChange}
              className={`${inputStyles} h-24`}
            />
          ) : (
            <p className="text-preset-4 px-4 leading-8 text-gray-600 md:px-0 md:text-left">
              {legalData.headerDescription}
            </p>
          )}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 mt-8">
        
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="flex flex-col gap-8">
          {/* Organization Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-100 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/50 text-blue-600">
                <Building2 size={28} />
              </div>
              <h2 className="font-montserratBold text-2xl text-gray-800 uppercase tracking-tight">Anbieter</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-2xl font-montserratBold text-gray-900 uppercase tracking-tighter">Berehynja e.V.</p>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="text-yellow-500 mt-1 shrink-0" size={20} />
                <p className="text-lg leading-relaxed italic">
                  {contacts?.address || "32545 Weserstraße 24"} <br /> 
                  {contacts?.city || "Bad-Oeynhausen, Germany"}
                </p>
              </div>
            </div>
          </div>

          {/* Representation Card */}
          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-100 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100/50 text-yellow-600">
                <UserCircle size={28} />
              </div>
              <h2 className="font-montserratBold text-2xl text-gray-800 uppercase tracking-tight">Vertretung</h2>
            </div>
            <div className="space-y-4">
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <input name="representative" value={legalData.representative} onChange={handleChange} className={inputStyles} placeholder="Name" />
                  <input name="position" value={legalData.position} onChange={handleChange} className={inputStyles} placeholder="Position" />
                </div>
              ) : (
                <>
                  <p className="text-2xl font-montserratBold text-gray-900 uppercase tracking-tighter">{legalData.representative}</p>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-green-600" />
                    <p className="text-lg font-medium italic text-gray-500 underline decoration-yellow-400 decoration-2 underline-offset-8">
                      {legalData.position}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Register Card */}
          <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
            <FileBadge size={140} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <FileBadge size={28} className="text-yellow-400" />
              <h3 className="font-montserratBold text-xl uppercase tracking-widest">Registereintrag</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="flex flex-col">
                <p className="text-[10px] uppercase font-bold text-blue-200 mb-1">Gericht</p>
                {isEditing ? <input name="registerCourt" value={legalData.registerCourt} onChange={handleChange} className={inputStyles} /> : <p className="font-bold">{legalData.registerCourt}</p>}
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] uppercase font-bold text-blue-200 mb-1">Nummer</p>
                {isEditing ? <input name="registerNumber" value={legalData.registerNumber} onChange={handleChange} className={inputStyles} /> : <p className="font-bold">{legalData.registerNumber}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="flex flex-col gap-8">
          {/* Contact Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 p-8 shadow-2xl text-white">
            <Globe2 size={150} className="absolute -right-20 -top-20 opacity-5" />
            <h2 className="font-montserratBold text-xl mb-8 text-yellow-400 uppercase tracking-widest relative z-10">Kontakt</h2>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <Mail className="text-blue-400" size={24} />
                <p className="font-medium truncate">{contacts?.email || "bereginia.badoeynhausen@gmail.com"}</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-green-400" size={24} />
                <p className="font-medium">{contacts?.phone || "+49 151 28161383"}</p>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <Globe className="text-yellow-400" size={24} />
                {isEditing ? (
                  <input name="website" value={legalData.website} onChange={handleChange} className={inputStyles} />
                ) : (
                  <p className="font-medium uppercase tracking-tighter">{legalData.website}</p>
                )}
              </div>
            </div>
          </div>

          {/* Haftung & Legal - ТЕКСТЫ ВОССТАНОВЛЕНЫ */}
          <div className="rounded-[2.5rem] bg-gray-50 p-8 border border-gray-100 flex flex-col gap-6 text-gray-500 text-sm italic">
            <div className="flex gap-4">
              <ShieldAlert className="text-red-400 shrink-0" size={20} />
              <p><strong>Haftung для Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte verantwortlich.</p>
            </div>
            <div className="flex gap-4">
              <ExternalLink className="text-blue-400 shrink-0" size={20} />
              <p><strong>Haftung для Links:</strong> Wir haben keinen Einfluss auf die Inhalte externer Webseiten Dritter.</p>
            </div>
            <div className="flex gap-4">
              <Copyright className="text-orange-400 shrink-0" size={20} />
              <p><strong>Urheberrecht:</strong> Die Inhalte auf diesen Seiten unterliegen dem deutschen Urheberrecht.</p>
            </div>
            
            <div className="mt-4 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <Info className="text-blue-600 shrink-0" size={18} />
                <p className="text-xs font-bold not-italic text-gray-400 uppercase tracking-tighter">
                  Verantwortlich для Inhalt:
                </p>
              </div>
              {isEditing ? (
                <textarea 
                  name="responsiblePerson"
                  value={legalData.responsiblePerson}
                  onChange={handleChange}
                  className={`${inputStyles} h-20`}
                />
              ) : (
                <p className="text-xs font-bold not-italic text-gray-400 uppercase tracking-tighter bg-white/50 p-3 rounded-xl border border-dashed border-gray-300">
                  {legalData.responsiblePerson}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};