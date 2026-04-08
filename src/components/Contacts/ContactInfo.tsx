import { useState, useEffect, type ChangeEvent } from "react";
import { Phone, Mail, MapPin, Save, Edit2 } from "lucide-react";
import { useAuth } from "../AuthProvider/useAuth";
import { SocialMedia } from "../../components/SocialMedia/SocialMedia";
import { subscribeToContacts, saveContacts} from "../../services/contactService";
import type { ContactData } from "../../types/contactData";

export const ContactInfo = () => {
  const { isAdmin } = useAuth();
  const [contacts, setContacts] = useState<ContactData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToContacts((data) => setContacts(data));
    return () => unsubscribe();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (contacts) {
      setContacts({ ...contacts, [name]: value });
    }
  };

  const onSave = async () => {
    if (contacts) {
      await saveContacts(contacts);
      setIsEditing(false);
      alert("Контакти оновлено!");
    }
  };

  if (!contacts) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="relative rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-nunito border-l-4 border-blue-600 pl-4 text-3xl font-black text-gray-900">
            Контакти
          </h2>
          {isAdmin && (
            <button
              onClick={isEditing ? onSave : () => setIsEditing(true)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                isEditing ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
            </button>
          )}
        </div>

        <ul className="flex flex-col gap-8">
          {/* EMAIL */}
          <li className="group flex items-center gap-6 overflow-hidden">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-white shadow-lg transition-all duration-300 group-hover:scale-110">
              <Mail size={24} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase">Напишіть нам</p>
              {isEditing ? (
                <input
                  name="email"
                  value={contacts.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-bold outline-none focus:border-blue-500"
                />
              ) : (
                <a
                  href={`mailto:${contacts.email}`}
                  className="block w-full truncate text-lg font-bold text-gray-800 transition-colors hover:text-blue-600"
                >
                  {contacts.email}
                </a>
              )}
            </div>
          </li>

          {/* PHONE */}
          <li className="group flex items-center gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-yellow-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110">
              <Phone size={24} />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase">Зателефонуйте</p>
              {isEditing ? (
                <input
                  name="phone"
                  value={contacts.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-bold outline-none focus:border-blue-500"
                />
              ) : (
                <a
                  href={`tel:${contacts.phone}`}
                  className="text-xl font-black text-gray-800 transition-colors hover:text-blue-600"
                >
                  {contacts.phone}
                </a>
              )}
            </div>
          </li>

          {/* ADDRESS */}
          <li className="group flex items-center gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-blue-900 transition-all duration-300 group-hover:scale-110">
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase">Наша адреса</p>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    name="address"
                    value={contacts.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-bold outline-none focus:border-blue-500"
                    placeholder="Вулиця..."
                  />
                  <input
                    name="city"
                    value={contacts.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-bold outline-none focus:border-blue-500 text-blue-600"
                    placeholder="Місто..."
                  />
                </div>
              ) : (
                <p className="text-lg leading-tight font-bold text-gray-800">
                  {contacts.address}, <span className="text-blue-600">{contacts.city}</span>
                </p>
              )}
            </div>
          </li>

          {/* SOCIALS */}
          <li className="mt-4 flex flex-col items-center gap-6 border-t border-gray-100 pt-6 md:items-start">
            <span className="text-xs font-black tracking-widest text-gray-400 uppercase">Ми в мережах:</span>
            <SocialMedia />
          </li>
        </ul>
      </div>
    </div>
  );
};
