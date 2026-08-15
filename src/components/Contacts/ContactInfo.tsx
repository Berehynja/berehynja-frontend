import { useEffect, useState, type ChangeEvent } from "react";
import { Edit2, Loader2, Mail, MapPin, Phone, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useAuth } from "../AuthProvider/useAuth";
import { SocialMedia } from "../SocialMedia/SocialMedia";
import {
  saveContacts,
  subscribeToContacts,
} from "../../services/contactService";
import type { ContactData } from "../../types/contactData";

interface ContactInfoProps {
  onContactsChange?: (contacts: ContactData) => void;
}


export const ContactInfo = ({ onContactsChange }: ContactInfoProps) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setContacts((currentContacts) =>
      currentContacts ? { ...currentContacts, [name]: value } : currentContacts,
    );
  };

  const handleSave = async () => {
    if (!contacts || isSaving) return;

    setIsSaving(true);

    try {
      await saveContacts(contacts);
      setIsEditing(false);
      toast.success(t("contact.info.saved"));
    } catch (error) {
      console.error("Contact save error:", error);
      toast.error(t("contact.info.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!contacts) return null;

  const actionLabel = isEditing
    ? t("contact.info.saveContacts")
    : t("contact.info.editContacts");

  return (
    <section
      aria-labelledby="contact-info-title"
      className="font-nunito relative flex h-full flex-col rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.1)] md:p-8 lg:p-10"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2
          id="contact-info-title"
          className="text-preset-3 font-semibold tracking-tight text-slate-950"
        >
          {t("contact.info.title")}
        </h2>

        {isAdmin && (
          <button
            type="button"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isSaving}
            aria-label={actionLabel}
            title={
              isEditing
                ? t("contact.info.save")
                : t("contact.info.edit")
            }
            className={`flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
              isEditing
                ? "border-green-500 bg-green-500 text-white shadow-green-100 hover:bg-green-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {isSaving ? (
              <Loader2 size={20} className="animate-spin" aria-hidden="true" />
            ) : isEditing ? (
              <Save size={20} aria-hidden="true" />
            ) : (
              <Edit2 size={20} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <ul className="flex flex-1 flex-col gap-4">
        <li className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-md md:gap-5 md:p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-blue-700 md:size-14">
            <Mail size={24} aria-hidden="true" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <p className="mb-1 text-base font-semibold text-slate-700 transition-colors group-hover:text-blue-700">
              {t("contact.info.email")}
            </p>

            {isEditing ? (
              <input
                type="email"
                name="email"
                value={contacts.email}
                onChange={handleChange}
                aria-label={t("contact.info.email")}
                placeholder={t("contact.info.emailPlaceholder")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            ) : (
              <a
                href={`mailto:${contacts.email}`}
                className="text-preset-4 block w-full truncate font-semibold text-slate-900 transition-colors group-hover:text-blue-600"
              >
                {contacts.email}
              </a>
            )}
          </div>
        </li>

        <li className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-yellow-200 hover:bg-white hover:shadow-md md:gap-5 md:p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-500 text-white shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-yellow-400 md:size-14">
            <Phone size={24} aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-1 text-base font-semibold text-slate-700 transition-colors group-hover:text-blue-700">
              {t("contact.info.phone")}
            </p>

            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={contacts.phone}
                onChange={handleChange}
                aria-label={t("contact.info.phone")}
                placeholder={t("contact.info.phonePlaceholder")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            ) : (
              <a
                href={`tel:${contacts.phone}`}
                className="text-preset-4 block truncate font-semibold text-slate-900 transition-colors group-hover:text-blue-600"
              >
                {contacts.phone}
              </a>
            )}
          </div>
        </li>

        <li className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-md md:items-center md:gap-5 md:p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-blue-900 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:bg-blue-50 md:size-14">
            <MapPin size={24} aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-1 text-base font-semibold text-slate-700 transition-colors group-hover:text-blue-700">
              {t("contact.info.address")}
            </p>

            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                  name="address"
                  value={contacts.address}
                  onChange={handleChange}
                  aria-label={t("contact.info.addressPlaceholder")}
                  placeholder={t("contact.info.addressPlaceholder")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <input
                  name="city"
                  value={contacts.city}
                  onChange={handleChange}
                  aria-label={t("contact.info.cityPlaceholder")}
                  placeholder={t("contact.info.cityPlaceholder")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-blue-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <input
                  name="mapUrl"
                  value={contacts.mapUrl || ""}
                  onChange={handleChange}
                  aria-label={t("contact.info.mapPlaceholder")}
                  placeholder={t("contact.info.mapPlaceholder")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            ) : (
              <p className="text-preset-4 font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                {contacts.address}
                {contacts.address && contacts.city ? ", " : ""}
                <span className="text-blue-600">{contacts.city}</span>
              </p>
            )}
          </div>
        </li>

        <li className="mt-auto flex flex-col items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 md:items-start">
          <span className="text-base font-semibold text-slate-700">
            {t("contact.info.socials")}
          </span>

          <div className="transition-transform duration-300 hover:scale-105">
            <SocialMedia />
          </div>
        </li>
      </ul>
    </section>
  );
};
