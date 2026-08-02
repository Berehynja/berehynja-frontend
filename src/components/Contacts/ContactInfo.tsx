import { useState, useEffect, type ChangeEvent } from "react";
import { Phone, Mail, MapPin, Save, Edit2 } from "lucide-react";
import { useAuth } from "../AuthProvider/useAuth";
import { SocialMedia } from "../../components/SocialMedia/SocialMedia";
import { subscribeToContacts, saveContacts } from "../../services/contactService";
import type { ContactData } from "../../types/contactData";
import toast from "react-hot-toast";

interface ContactInfoProps {
  onContactsChange?: (contacts: ContactData) => void;
}

export const ContactInfo = ({ onContactsChange }: ContactInfoProps) => {
  const { isAdmin } = useAuth();
  const [contacts, setContacts] = useState<ContactData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToContacts((data) => {
      setContacts(data);
      onContactsChange?.(data);
    });

    return () => unsubscribe();
  }, [onContactsChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (contacts) {
      setContacts({ ...contacts, [name]: value });
    }
  };

  const onSave = async () => {
    if (contacts && !isSaving) {
      setIsSaving(true);

      try {
        await saveContacts(contacts);
        setIsEditing(false);
        toast.success("Контакти оновлено!");
      } catch (error) {
        console.error("Помилка збереження контактів:", error);
        toast.error("Не вдалося оновити контакти.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!contacts) return null;

  return (
    <div className="flex h-full flex-col gap-8">
      <section
        aria-labelledby="contact-info-title"
      className="relative flex h-full flex-col rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.1)] md:p-8 lg:p-10"
      >
        {/* Header з кнопкою редагування */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2
            id="contact-info-title"
          className="font-nunito text-3xl leading-tight font-black text-gray-900 md:text-4xl"
          >
            Контакти
          </h2>
          {isAdmin && (
            <button
              type="button"
              onClick={isEditing ? onSave : () => setIsEditing(true)}
              disabled={isSaving}
              aria-label={isEditing ? "Зберегти контакти" : "Редагувати контакти"}
              title={isEditing ? "Зберегти" : "Редагувати"}
              className={`flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                isEditing
                  ? "border-green-500 bg-green-500 text-white shadow-green-100 hover:bg-green-600"
                  : "border-gray-200 bg-white text-gray-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {isEditing ? (
                <Save size={20} aria-hidden="true" />
              ) : (
                <Edit2 size={20} aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        <ul className="flex flex-1 flex-col gap-4">
          {/* EMAIL */}
          <li className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-md md:gap-5 md:p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-blue-700 md:size-14">
              <Mail size={24} aria-hidden="true" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="mb-1 text-xs font-black tracking-widest text-slate-600 uppercase transition-colors group-hover:text-blue-700">
                Напишіть нам
              </p>
              {isEditing ? (
                <input
                  name="email"
                  value={contacts.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              ) : (
                <a
                  href={`mailto:${contacts.email}`}
                  className="block w-full truncate text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600"
                >
                  {contacts.email}
                </a>
              )}
            </div>
          </li>

          {/* PHONE */}
          <li className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-yellow-200 hover:bg-white hover:shadow-md md:gap-5 md:p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-500 text-white shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-yellow-400 md:size-14">
              <Phone size={24} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs font-black tracking-widest text-slate-600 uppercase transition-colors group-hover:text-blue-700">
                Зателефонуйте
              </p>
              {isEditing ? (
                <input
                  name="phone"
                  value={contacts.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              ) : (
                <a
                  href={`tel:${contacts.phone}`}
                  className="text-xl font-black text-gray-800 transition-colors group-hover:text-blue-600"
                >
                  {contacts.phone}
                </a>
              )}
            </div>
          </li>

          {/* ADDRESS */}
          <li className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-md md:items-center md:gap-5 md:p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-blue-900 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:bg-blue-50 md:size-14">
              <MapPin size={24} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs font-black tracking-widest text-slate-600 uppercase transition-colors group-hover:text-blue-700">
                Наша адреса
              </p>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    name="address"
                    value={contacts.address}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                  <input
                    name="city"
                    value={contacts.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-600 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                  <input
                    name="mapUrl"
                    value={contacts.mapUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    placeholder="Посилання або координати: 50.1109, 8.6821"
                  />
                </div>
              ) : (
                <p className="text-lg leading-tight font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                  {contacts.address}, <span className="text-blue-600">{contacts.city}</span>
                </p>
              )}
            </div>
          </li>

          {/* SOCIALS */}
          <li className="mt-auto flex flex-col items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 md:items-start">
            <span className="text-xs font-black tracking-widest text-slate-600 uppercase">
              Ми в мережах:
            </span>
            <div className="transition-transform duration-300 hover:scale-105">
              <SocialMedia />
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};
