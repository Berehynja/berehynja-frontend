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
  FileText,
  Scale,
  ShieldCheck,
  Link as LinkIcon,
  Copyright
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

  // Строгий і чистий стиль для інпутів
  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium";

  return (
    <div className="font-nunito mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      
      {/* КНОПКА АДМІНА */}
      {isAdmin && (
        <button
          onClick={isEditing ? onSave : () => setIsEditing(true)}
          className={`fixed right-8 bottom-8 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
            isEditing ? "bg-green-600 text-white hover:bg-green-700" : "bg-blue-600 text-white hover:scale-105 hover:bg-blue-700"
          }`}
          title={isEditing ? "Зберегти" : "Редагувати Impressum"}
        >
          {isEditing ? <Save size={24} /> : <Edit2 size={24} />}
        </button>
      )}

      {/* HEADER SECTION */}
      <div className="mb-12 pb-8">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-sm border border-slate-200/60">
              <Scale size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase">
              Impressum
            </h1>
          </div>
          {/* Акуратний синьо-жовтий акцент */}
          <div className="h-1 w-67 rounded-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>
        
        {isEditing ? (
          <textarea
            name="headerDescription"
            value={legalData.headerDescription}
            onChange={handleChange}
            className={`${inputStyles} h-24 mt-4`}
            placeholder="Вступний текст (опціонально)..."
          />
        ) : (
          legalData.headerDescription && (
            <p className="text-lg text-slate-500 leading-relaxed max-w-3xl">
              {legalData.headerDescription}
            </p>
          )
        )}
      </div>

      {/* MAIN LEGAL INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Angaben gemäß § 5 TMG - Синій акцент */}
        <section className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Building2 size={20} />
            </div>
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Angaben gemäß § 5 TMG</h2>
          </div>
          <div className="space-y-4 text-slate-700 pl-14">
            <p className="text-xl font-bold text-slate-900">Berehynja e.V.</p>
            <div className="flex gap-3 items-start">
              <MapPin className="shrink-0 text-slate-400 mt-1" size={18} />
              <p className="leading-relaxed">
                {contacts?.address || "32545 Weserstraße 24"} <br />
                {contacts?.city || "Bad-Oeynhausen, Germany"}
              </p>
            </div>
          </div>
        </section>

        {/* Vertreten durch - Синій акцент */}
        <section className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <UserCircle size={20} />
            </div>
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Vertreten durch</h2>
          </div>
          <div className="space-y-4 pl-14">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  name="representative"
                  value={legalData.representative}
                  onChange={handleChange}
                  className={inputStyles}
                  placeholder="Ім'я представника"
                />
                <input
                  name="position"
                  value={legalData.position}
                  onChange={handleChange}
                  className={inputStyles}
                  placeholder="Посада (напр. Vorstand)"
                />
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold text-slate-900 mb-2">
                  {legalData.representative || "Не вказано"}
                </p>
                <p className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-md border border-slate-200/60">
                  {legalData.position || "Не вказано"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Kontakt - Жовтий акцент */}
        <section className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-yellow-400 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(250,204,21,0.1)] transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
              <Mail size={20} />
            </div>
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Kontakt</h2>
          </div>
          <div className="space-y-4 text-slate-700 pl-14">
            <div className="flex items-center gap-3">
              <Phone className="text-slate-400 shrink-0" size={18} />
              <p className="font-medium">{contacts?.phone || "+49 151 28161383"}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-slate-400 shrink-0" size={18} />
              <p className="font-medium break-all">{contacts?.email || "bereginia.badoeynhausen@gmail.com"}</p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-2">
              <Globe className="text-slate-400 shrink-0" size={18} />
              {isEditing ? (
                <input
                  name="website"
                  value={legalData.website}
                  onChange={handleChange}
                  className={inputStyles}
                  placeholder="https://..."
                />
              ) : (
                <a href={legalData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:text-blue-700 hover:underline break-all transition-colors">
                  {legalData.website || "Не вказано"}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Registereintrag - Синій акцент */}
        <section className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText size={20} />
            </div>
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Registereintrag</h2>
          </div>
          <div className="space-y-5 pl-14">
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Eintragung im Vereinsregister.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Registergericht</span>
                {isEditing ? (
                  <input
                    name="registerCourt"
                    value={legalData.registerCourt}
                    onChange={handleChange}
                    className={`${inputStyles} sm:max-w-[200px] py-1.5`}
                    placeholder="Amtsgericht..."
                  />
                ) : (
                  <span className="font-semibold text-slate-800">{legalData.registerCourt || "—"}</span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Registernummer</span>
                {isEditing ? (
                  <input
                    name="registerNumber"
                    value={legalData.registerNumber}
                    onChange={handleChange}
                    className={`${inputStyles} sm:max-w-[200px] py-1.5`}
                    placeholder="VR 12345"
                  />
                ) : (
                  <span className="font-semibold text-slate-800">{legalData.registerNumber || "—"}</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Verantwortlich für den Inhalt (V.i.S.d.P) */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 mb-12 relative overflow-hidden">
        {/* Декоративний елемент фону */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Info size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-slate-500" size={20} />
            <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
          </div>
          {isEditing ? (
            <textarea
              name="responsiblePerson"
              value={legalData.responsiblePerson}
              onChange={handleChange}
              className={`${inputStyles} h-24`}
              placeholder="Ім'я та адреса відповідальної особи..."
            />
          ) : (
            <p className="text-slate-800 font-medium leading-relaxed bg-white inline-block px-4 py-2.5 rounded-lg border border-slate-200/60 shadow-sm">
              {legalData.responsiblePerson || "Не вказано"}
            </p>
          )}
        </div>
      </section>

      {/* Haftungsausschluss (Disclaimer) - Стандартні юридичні тексти */}
      <section className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Haftungsausschluss (Disclaimer)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-3">
              <ShieldCheck size={18} className="text-blue-600" />
              <h3>Haftung für Inhalte</h3>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed text-justify">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-3">
              <LinkIcon size={18} className="text-blue-600" />
              <h3>Haftung für Links</h3>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed text-justify">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-3">
              <Copyright size={18} className="text-blue-600" />
              <h3>Urheberrecht</h3>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed text-justify">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};