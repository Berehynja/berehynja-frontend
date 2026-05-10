import { useState, useEffect } from "react";
import {
  Building2,
  UserCircle,
  Mail,
  Phone,
  Save,
  Edit2,
  Info,
  MapPin,
  Globe,
  FileBadge,
  CheckCircle2,
  ShieldAlert,
  Copyright,
  ExternalLink,
  Globe2,
  Scale,
} from "lucide-react";
import { useAuth } from "../../components/AuthProvider/useAuth";
import { subscribeToContacts } from "../../services/contactService";
import { subscribeToImpressum, saveImpressum } from "../../services/impressumService";
import type { ContactData } from "../../types/contactData";
import type { ImpressumData } from "../../types/impressumData";

const initialData: ImpressumData = {
  representative: "",
  position: "",
  registerCourt: "",
  registerNumber: "",
  responsiblePerson: "",
  headerDescription: "",
  website: "",
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

    return () => {
      unsubImpressum();
      unsubContacts();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLegalData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    await saveImpressum(legalData);
    setIsEditing(false);
  };

  // Однотипный стиль для всех инпутов
  const inputStyles =
    "w-full p-2 bg-white/90 border border-gray-300 rounded-xl text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-sans italic text-sm";

  return (
    <div className="font-montserrat relative mx-auto w-full max-w-7xl px-4 py-8">
      {/* КНОПКА АДМИНА */}
      {isAdmin && (
        <button
          onClick={isEditing ? onSave : () => setIsEditing(true)}
          className={`fixed right-10 bottom-10 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all ${
            isEditing ? "bg-green-500 text-white" : "bg-blue-900 text-white hover:scale-110"
          }`}
        >
          {isEditing ? <Save size={24} /> : <Edit2 size={24} />}
        </button>
      )}

      {/* HEADER SECTION */}
      <div className="font-nunito flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <div className="flex items-center gap-3 pb-2">
            <Scale className="text-blue-600" size={32} />
            <h1 className="text-preset-2 font-nunito text-4xl text-gray-900 uppercase md:text-5xl">
              Impressum
            </h1>
          </div>
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <div className="flex w-full max-w-3xl items-start gap-4">
          <Info className="mt-1 shrink-0 text-blue-500" size={24} />
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

      <section className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="flex flex-col gap-8">
          {/* Organization Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm md:p-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/50 text-blue-600">
                <Building2 size={28} />
              </div>
              <h2 className="font-nunito text-2xl tracking-tight text-gray-800 uppercase">
                Anbieter
              </h2>
            </div>

            <div className="space-y-4">
              <p className="font-nunito text-2xl tracking-tighter text-gray-900 uppercase">
                Berehynja
              </p>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="mt-1 shrink-0 text-yellow-500" size={20} />
                <p className="text-lg leading-relaxed italic">
                  {contacts?.address || "32545 Weserstraße 24"} <br />
                  {contacts?.city || "Bad-Oeynhausen, Germany"}
                </p>
              </div>
            </div>
          </div>

          {/* Representation Card */}
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm md:p-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100/50 text-yellow-600">
                <UserCircle size={28} />
              </div>
              <h2 className="font-nunito text-2xl tracking-tight text-gray-800 uppercase">
                Vertretung
              </h2>
            </div>
            <div className="space-y-4">
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <input
                    name="representative"
                    value={legalData.representative}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="Name"
                  />
                  <input
                    name="position"
                    value={legalData.position}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="Position"
                  />
                </div>
              ) : (
                <>
                  <p className="font-nunito text-2xl tracking-tighter text-gray-900 uppercase">
                    {legalData.representative}
                  </p>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-green-600" />
                    <p className="text-lg font-medium text-gray-500 italic underline decoration-yellow-400 decoration-2 underline-offset-8">
                      {legalData.position}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Register Card */}
          <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-blue-500 to-blue-700 p-8 text-white shadow-xl">
            <FileBadge size={140} className="absolute -right-5 -bottom-5 rotate-12 opacity-10" />
            <div className="relative z-10 mb-6 flex items-center gap-3">
              <FileBadge size={28} className="text-yellow-400" />
              <h3 className="font-nunito text-xl tracking-widest uppercase">Registereintrag</h3>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <p className="mb-1 text-[10px] font-bold text-blue-200 uppercase">Gericht</p>
                {isEditing ? (
                  <input
                    name="registerCourt"
                    value={legalData.registerCourt}
                    onChange={handleChange}
                    className={inputStyles}
                  />
                ) : (
                  <p className="font-bold">{legalData.registerCourt}</p>
                )}
              </div>
              <div className="flex flex-col">
                <p className="mb-1 text-[10px] font-bold text-blue-200 uppercase">Nummer</p>
                {isEditing ? (
                  <input
                    name="registerNumber"
                    value={legalData.registerNumber}
                    onChange={handleChange}
                    className={inputStyles}
                  />
                ) : (
                  <p className="font-bold">{legalData.registerNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="flex flex-col gap-8">
          {/* Contact Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-gray-200 to-gray-400 p-8 text-black shadow-2xl">
            <Globe2 size={150} className="absolute -top-10 -right-10 opacity-5" />
            <h2 className="font-nunito relative z-10 mb-8 text-xl tracking-widest text-yellow-600 uppercase">
              Kontakt
            </h2>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-blue-400" size={24} />
                <p className="truncate font-medium">
                  {contacts?.email || "bereginia.badoeynhausen@gmail.com"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-green-400" size={24} />
                <p className="font-medium">{contacts?.phone || "+49 151 28161383"}</p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/10">
                <Globe className="text-yellow-400" size={24} />
                {isEditing ? (
                  <input
                    name="website"
                    value={legalData.website}
                    onChange={handleChange}
                    className={inputStyles}
                  />
                ) : (
                  <p className="font-medium tracking-tighter uppercase">{legalData.website}</p>
                )}
              </div>
            </div>
          </div>

          {/* Haftung & Legal - ТЕКСТЫ ВОССТАНОВЛЕНЫ */}
          <div className="flex flex-col gap-6 rounded-[2.5rem] border border-gray-100 bg-gray-50 p-8 text-sm text-gray-500 italic">
            <div className="flex gap-4">
              <ShieldAlert className="shrink-0 text-red-400" size={20} />
              <p>
                <strong>Haftung для Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs.1
                TMG für eigene Inhalte verantwortlich.
              </p>
            </div>
            <div className="flex gap-4">
              <ExternalLink className="shrink-0 text-blue-400" size={20} />
              <p>
                <strong>Haftung для Links:</strong> Wir haben keinen Einfluss auf die Inhalte
                externer Webseiten Dritter.
              </p>
            </div>
            <div className="flex gap-4">
              <Copyright className="shrink-0 text-orange-400" size={20} />
              <p>
                <strong>Urheberrecht:</strong> Die Inhalte auf diesen Seiten unterliegen dem
                deutschen Urheberrecht.
              </p>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-6">
              <div className="mb-3 flex items-start gap-3">
                <Info className="shrink-0 text-blue-600" size={18} />
                <p className="text-xs font-bold tracking-tighter text-gray-400 uppercase not-italic">
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
                <p className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-3 text-xs font-bold tracking-tighter text-gray-400 uppercase not-italic">
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
