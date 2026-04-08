import { useState, useEffect, type ChangeEvent } from "react";
import { InstagramIcon, TelegramIcon } from "../icons/SocialIcons";
import { Edit2, Save } from "lucide-react";
import { subscribeToContacts, saveContacts } from "../../services/contactService";
import { useAuth } from "../AuthProvider/useAuth";
import type { ContactData } from "../../types/contactData";

export const SocialMedia = () => {
  const { isAdmin } = useAuth();
  const [contacts, setContacts] = useState<ContactData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToContacts((data) => setContacts(data));
    return () => unsubscribe();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (contacts) setContacts({ ...contacts, [name]: value });
  };

  const handleSave = async () => {
    if (contacts) {
      await saveContacts(contacts);
      setIsEditing(false);
      alert("Соцмережі оновлено!");
    }
  };

  if (!contacts) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {/* Instagram */}
        <a
          href={contacts.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1306C] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-3"
        >
          <div className="scale-110 transition-transform group-hover:scale-125">
            <InstagramIcon />
          </div>
        </a>

        {/* Telegram */}
        <a
          href={contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-12 w-12 items-center justify-center rounded-xl bg-[#0088cc] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-rotate-3"
        >
          <div className="scale-110 transition-transform group-hover:scale-125">
            <TelegramIcon />
          </div>
        </a>

        {/* Admin Edit Socials */}
        {isAdmin && (
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={`ml-2 flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              isEditing ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
          </button>
        )}
      </div>

      {isEditing && (
        <div className="flex flex-col gap-2 rounded-xl border border-blue-50 bg-gray-50 p-3 animate-fade-in">
          <input
            name="instagram"
            value={contacts.instagram}
            onChange={handleChange}
            placeholder="Instagram Link"
            className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-bold outline-none focus:border-pink-500"
          />
          <input
            name="telegram"
            value={contacts.telegram}
            onChange={handleChange}
            placeholder="Telegram Link"
            className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-bold outline-none focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
};