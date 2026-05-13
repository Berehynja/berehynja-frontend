import { useState, useEffect, type ChangeEvent } from "react";
import { InstagramIcon, TelegramIcon } from "../icons/SocialIcons";
import { Edit2, Save } from "lucide-react"; // Використовуємо Lucide для нових іконок або вставлені SVG
import { subscribeToContacts, saveContacts } from "../../services/contactService";
import { useAuth } from "../AuthProvider/useAuth";
import type { ContactData } from "../../types/contactData";

// SVG для Facebook та YouTube (якщо немає в SocialIcons)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

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
      <div className="flex flex-wrap items-center gap-4">
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

        {/* Facebook */}
        <a
          href={contacts.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-12 w-12 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-3"
        >
          <div className="scale-110 transition-transform group-hover:scale-125">
            <FacebookIcon />
          </div>
        </a>

        {/* YouTube */}
        <a
          href={contacts.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF0000] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-rotate-3"
        >
          <div className="scale-110 transition-transform group-hover:scale-125">
            <YoutubeIcon />
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
        <div className="flex flex-col gap-2 rounded-xl border border-blue-50 bg-gray-50 p-3 animate-fade-in font-nunito">
          <div className="flex flex-col gap-1">
             <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-wider">Instagram</span>
             <input
                name="instagram"
                value={contacts.instagram}
                onChange={handleChange}
                placeholder="Instagram Link"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-pink-500"
              />
          </div>

          <div className="flex flex-col gap-1">
             <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-wider">Telegram</span>
             <input
                name="telegram"
                value={contacts.telegram}
                onChange={handleChange}
                placeholder="Telegram Link"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-blue-500"
              />
          </div>

          <div className="flex flex-col gap-1">
             <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-wider">Facebook</span>
             <input
                name="facebook"
                value={contacts.facebook}
                onChange={handleChange}
                placeholder="Facebook Link"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-blue-700"
              />
          </div>

          <div className="flex flex-col gap-1">
             <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-wider">YouTube</span>
             <input
                name="youtube"
                value={contacts.youtube}
                onChange={handleChange}
                placeholder="YouTube Link"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-red-600"
              />
          </div>
        </div>
      )}
    </div>
  );
};