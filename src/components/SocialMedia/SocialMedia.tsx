import { useEffect, useState, type ChangeEvent } from "react";
import { Edit2, Save } from "lucide-react";

import { InstagramIcon, TelegramIcon } from "../icons/SocialIcons";
import {
  subscribeToContacts,
  saveContacts,
} from "../../services/contactService";
import { useAuth } from "../AuthProvider/useAuth";
import type { ContactData } from "../../types/contactData";

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (contacts) {
      setContacts({ ...contacts, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!contacts) return;

    await saveContacts(contacts);
    setIsEditing(false);
    alert("Соцмережі оновлено!");
  };

  if (!contacts) return null;

  const socialLinkStyles =
    "group flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-slate-900";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={contacts.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Berehynia on Instagram (opens in a new tab)"
          title="Instagram"
          className={`${socialLinkStyles} bg-[#E1306C] hover:rotate-3`}
        >
          <div
            aria-hidden="true"
            className="scale-110 transition-transform group-hover:scale-125"
          >
            <InstagramIcon />
          </div>
        </a>

        <a
          href={contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Berehynia on Telegram (opens in a new tab)"
          title="Telegram"
          className={`${socialLinkStyles} bg-[#0088cc] hover:-rotate-3`}
        >
          <div
            aria-hidden="true"
            className="scale-110 transition-transform group-hover:scale-125"
          >
            <TelegramIcon />
          </div>
        </a>

        <a
          href={contacts.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Berehynia on Facebook (opens in a new tab)"
          title="Facebook"
          className={`${socialLinkStyles} bg-[#1877F2] hover:rotate-3`}
        >
          <div
            aria-hidden="true"
            className="scale-110 transition-transform group-hover:scale-125"
          >
            <FacebookIcon />
          </div>
        </a>

        <a
          href={contacts.youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Berehynia on YouTube (opens in a new tab)"
          title="YouTube"
          className={`${socialLinkStyles} bg-[#FF0000] hover:-rotate-3`}
        >
          <div
            aria-hidden="true"
            className="scale-110 transition-transform group-hover:scale-125"
          >
            <YoutubeIcon />
          </div>
        </a>

        {isAdmin && (
          <button
            type="button"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            aria-label={
              isEditing ? "Save social media links" : "Edit social media links"
            }
            title={isEditing ? "Save" : "Edit"}
            className={`ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-all focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-slate-900 ${
              isEditing
                ? "bg-green-700 text-white hover:bg-green-800"
                : "bg-gray-100 text-gray-700 hover:bg-blue-700 hover:text-white"
            }`}
          >
            {isEditing ? (
              <Save size={18} aria-hidden="true" />
            ) : (
              <Edit2 size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {isEditing && (
        <div className="font-nunito animate-fade-in flex flex-col gap-3 rounded-xl border border-blue-50 bg-gray-50 p-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="social-instagram"
              className="ml-1 text-xs font-bold tracking-wider text-gray-600 uppercase"
            >
              Instagram
            </label>
            <input
              id="social-instagram"
              type="url"
              name="instagram"
              value={contacts.instagram}
              onChange={handleChange}
              placeholder="Instagram link"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-pink-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="social-telegram"
              className="ml-1 text-xs font-bold tracking-wider text-gray-600 uppercase"
            >
              Telegram
            </label>
            <input
              id="social-telegram"
              type="url"
              name="telegram"
              value={contacts.telegram}
              onChange={handleChange}
              placeholder="Telegram link"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-blue-700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="social-facebook"
              className="ml-1 text-xs font-bold tracking-wider text-gray-600 uppercase"
            >
              Facebook
            </label>
            <input
              id="social-facebook"
              type="url"
              name="facebook"
              value={contacts.facebook}
              onChange={handleChange}
              placeholder="Facebook link"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-blue-700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="social-youtube"
              className="ml-1 text-xs font-bold tracking-wider text-gray-600 uppercase"
            >
              YouTube
            </label>
            <input
              id="social-youtube"
              type="url"
              name="youtube"
              value={contacts.youtube}
              onChange={handleChange}
              placeholder="YouTube link"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-red-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};
