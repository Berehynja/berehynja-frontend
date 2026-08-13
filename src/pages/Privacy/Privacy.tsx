import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { ChevronDown, Loader2, Mail, Pencil, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import toast from "react-hot-toast";

import { useAuth } from "../../components/AuthProvider/useAuth";
import { subscribeToContacts } from "../../services/contactService";
import { savePrivacy, subscribeToPrivacy } from "../../services/privacyService";
import type { ContactData } from "../../types/contactData";
import type {
  EditablePrivacySection,
  LocalizedPrivacyText,
  PrivacyData,
  PrivacyLanguage,
} from "../../types/privacyData";
import type { LangKey } from "../../types/types";

const PRIVACY_SECTIONS = [
  { key: "controller", titleKey: "privacy.sections.controller.title" },
  {
    key: "generalProcessing",
    titleKey: "privacy.sections.generalProcessing.title",
  },
  { key: "contactForms", titleKey: "privacy.sections.contactForms.title" },
  { key: "automation", titleKey: "privacy.sections.automation.title" },
  { key: "vpsHosting", titleKey: "privacy.sections.vpsHosting.title" },
  {
    key: "googleWorkspace",
    titleKey: "privacy.sections.googleWorkspace.title",
  },
  { key: "cloudinary", titleKey: "privacy.sections.cloudinary.title" },
  { key: "youtube", titleKey: "privacy.sections.youtube.title" },
  { key: "cookies", titleKey: "privacy.sections.cookies.title" },
  { key: "retention", titleKey: "privacy.sections.retention.title" },
  { key: "userRights", titleKey: "privacy.sections.userRights.title" },
  { key: "complaint", titleKey: "privacy.sections.complaint.title" },
] as const satisfies ReadonlyArray<{
  key: EditablePrivacySection;
  titleKey: string;
}>;

const LOCALIZED_FIELDS = [
  "summary",
  ...PRIVACY_SECTIONS.map(({ key }) => key),
] as const satisfies readonly EditablePrivacySection[];

const LANGUAGES: PrivacyLanguage[] = ["ua", "de", "en"];

const localizedFromTranslation = (t: TFunction, key: string): LocalizedPrivacyText => ({
  ua: t(key, { lng: "ua" }),
  de: t(key, { lng: "de" }),
  en: t(key, { lng: "en" }),
});

const createFallbackData = (t: TFunction): PrivacyData => ({
  summary: localizedFromTranslation(t, "privacy.subtitle"),
  controller: localizedFromTranslation(t, "privacy.controller.desc"),
  generalProcessing: localizedFromTranslation(t, "privacy.sections.generalProcessing.default"),
  contactForms: localizedFromTranslation(t, "privacy.sections.contactForms.default"),
  automation: localizedFromTranslation(t, "privacy.sections.automation.default"),
  vpsHosting: localizedFromTranslation(t, "privacy.sections.vpsHosting.default"),
  googleWorkspace: localizedFromTranslation(t, "privacy.sections.googleWorkspace.default"),
  cloudinary: localizedFromTranslation(t, "privacy.media.cloudinaryDesc"),
  youtube: localizedFromTranslation(t, "privacy.media.youtubeDesc"),
  cookies: localizedFromTranslation(t, "privacy.cookies.desc"),
  retention: localizedFromTranslation(t, "privacy.sections.retention.default"),
  userRights: localizedFromTranslation(t, "privacy.sections.userRights.default"),
  complaint: localizedFromTranslation(t, "privacy.complaint.desc"),
  vpsProviderName: "",
  vpsProviderAddress: "",
  serverLocation: "",
  retentionMonths: 12,
  updatedAt: null,
});

const normalizePrivacyData = (value: PrivacyData | null, fallback: PrivacyData): PrivacyData => {
  if (!value) return fallback;

  const normalized: PrivacyData = {
    ...fallback,
    ...value,
  };

  LOCALIZED_FIELDS.forEach((field) => {
    normalized[field] = {
      ...fallback[field],
      ...(value[field] ?? {}),
    };
  });

  return normalized;
};

const getCurrentLanguage = (language: string): LangKey => {
  const normalized = language.split("-")[0].toLowerCase();
  return ["ua", "de", "en"].includes(normalized) ? (normalized as LangKey) : "ua";
};

export const Privacy = () => {
  const { isAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const fallbackData = useMemo(() => createFallbackData(t), [t]);

  const [privacyData, setPrivacyData] = useState<PrivacyData>(fallbackData);
  const [draftData, setDraftData] = useState<PrivacyData>(fallbackData);
  const [contacts, setContacts] = useState<ContactData | null>(null);
  const [editingSection, setEditingSection] = useState<EditablePrivacySection | null>(null);
  const [editingLanguage, setEditingLanguage] = useState<PrivacyLanguage>("de");
  const [isSaving, setIsSaving] = useState(false);

  const currentLang = getCurrentLanguage(i18n.resolvedLanguage || i18n.language);

  useEffect(() => {
    const unsubscribePrivacy = subscribeToPrivacy(
      (data) => {
        const normalized = normalizePrivacyData(data, fallbackData);
        setPrivacyData(normalized);
        setDraftData(normalized);
      },
      () => {
        toast.error(
          t("privacy.admin.loadError", {
            defaultValue: "Privacy information could not be loaded.",
          })
        );
      }
    );

    const unsubscribeContacts = subscribeToContacts(setContacts);

    return () => {
      unsubscribePrivacy();
      unsubscribeContacts();
    };
  }, [fallbackData, t]);

  const handleStartEditing = (section: EditablePrivacySection) => {
    setDraftData(privacyData);
    setEditingLanguage(currentLang);
    setEditingSection(section);
  };

  const handleCancelEditing = () => {
    if (isSaving) return;
    setDraftData(privacyData);
    setEditingSection(null);
  };

  const handleLocalizedChange = (
    section: EditablePrivacySection,
    language: PrivacyLanguage,
    value: string
  ) => {
    setDraftData((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [language]: value,
      },
    }));
  };

  const handleMetadataChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setDraftData((previous) => ({
      ...previous,
      [name]: name === "retentionMonths" ? Math.max(1, Number(value) || 1) : value,
    }));
  };

  const handleSave = async () => {
    if (!editingSection || isSaving) return;

    if (!draftData[editingSection].de.trim()) {
      toast.error(
        t("privacy.admin.germanRequired", {
          defaultValue: "The German version must not be empty.",
        })
      );
      setEditingLanguage("de");
      return;
    }

    setIsSaving(true);

    try {
      await savePrivacy(draftData);
      setPrivacyData(draftData);
      setEditingSection(null);
      toast.success(
        t("privacy.admin.saved", {
          defaultValue: "Privacy information has been saved.",
        })
      );
    } catch (error) {
      console.error("Privacy save error:", error);
      toast.error(
        t("privacy.admin.saveError", {
          defaultValue: "Privacy information could not be saved.",
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  const updatedAt = privacyData.updatedAt?.toDate();
  const dateLocale = currentLang === "de" ? "de-DE" : currentLang === "en" ? "en-GB" : "uk-UA";

  return (
    <div className="font-nunito mx-auto w-full max-w-7xl px-3 pb-16 md:px-6 md:pb-24">
      <header className="flex flex-col items-center justify-center gap-6 border-b border-slate-200 py-8 md:flex-row md:gap-10 md:py-12">
        <div className="flex max-w-full shrink-0 flex-col items-center justify-center">
          <h1 className="pb-4 text-center text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {t("privacy.title")}
          </h1>

          <div
            aria-hidden="true"
            className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
          />
        </div>

        <div className="w-full max-w-4xl px-2 md:px-0">
          <p className="text-center text-base leading-7 font-medium whitespace-pre-line text-slate-600 md:text-left md:text-lg md:leading-8">
            {privacyData.summary[currentLang]}
          </p>

          {updatedAt && (
            <p className="mt-3 text-center text-sm font-semibold tracking-wide text-slate-500 md:text-left">
              {t("privacy.lastUpdated", {
                defaultValue: "Last updated",
              })}
              : {updatedAt.toLocaleDateString(dateLocale)}
            </p>
          )}
        </div>
      </header>

      <MobileContents currentLang={currentLang} />

      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:mt-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        <aside className="sticky top-28 hidden rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:block">
          <h2 className="text-sm font-bold tracking-wider text-slate-800 uppercase">
            {t("privacy.contents", { defaultValue: "Contents" })}
          </h2>

          <nav aria-label={t("privacy.contents", { defaultValue: "Contents" })}>
            <ol className="mt-4 space-y-1">
              {PRIVACY_SECTIONS.map((section, index) => (
                <li key={section.key}>
                  <a
                    href={`#privacy-${section.key}`}
                    className="flex rounded-xl px-3 py-2.5 text-sm leading-5 font-medium text-slate-600 transition hover:bg-white hover:text-blue-700 hover:shadow-sm"
                  >
                    <span className="mr-3 text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {t(section.titleKey)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <main className="min-w-0 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] md:px-8 lg:px-10">
          {PRIVACY_SECTIONS.map((section, index) => {
            const isEditing = editingSection === section.key;

            return (
              <PrivacySection
                key={section.key}
                id={`privacy-${section.key}`}
                number={index + 1}
                title={t(section.titleKey)}
                action={
                  isAdmin ? (
                    <EditActions
                      isEditing={isEditing}
                      disabled={isSaving || (editingSection !== null && !isEditing)}
                      isSaving={isSaving}
                      editLabel={t("privacy.admin.edit", {
                        defaultValue: "Edit section",
                      })}
                      saveLabel={t("privacy.admin.save", {
                        defaultValue: "Save",
                      })}
                      cancelLabel={t("privacy.admin.cancel", {
                        defaultValue: "Cancel",
                      })}
                      onEdit={() => handleStartEditing(section.key)}
                      onCancel={handleCancelEditing}
                      onSave={() => void handleSave()}
                    />
                  ) : null
                }
              >
                {isEditing ? (
                  <SectionEditor
                    section={section.key}
                    data={draftData}
                    language={editingLanguage}
                    onLanguageChange={setEditingLanguage}
                    onTextChange={handleLocalizedChange}
                    onMetadataChange={handleMetadataChange}
                    t={t}
                  />
                ) : (
                  <SectionContent
                    section={section.key}
                    data={privacyData}
                    currentLang={currentLang}
                    email={contacts?.email || "info@berehynja.de"}
                    emptyLabel={t("privacy.empty", {
                      defaultValue: "Information is being updated.",
                    })}
                    t={t}
                  />
                )}
              </PrivacySection>
            );
          })}
        </main>
      </div>
    </div>
  );
};

interface MobileContentsProps {
  currentLang: LangKey;
}

const MobileContents = ({ currentLang }: MobileContentsProps) => {
  const { t } = useTranslation();

  return (
    <details className="group mt-7 rounded-2xl border border-slate-200 bg-slate-50 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
        {t("privacy.contents", { defaultValue: "Contents" })}
        <ChevronDown
          size={19}
          className="transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <nav className="border-t border-slate-200 px-3 py-3">
        <ol className="space-y-1">
          {PRIVACY_SECTIONS.map((section, index) => (
            <li key={`${section.key}-${currentLang}`}>
              <a
                href={`#privacy-${section.key}`}
                className="flex rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:text-blue-700"
              >
                <span className="mr-3 text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                {t(section.titleKey)}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
};

interface PrivacySectionProps {
  id: string;
  number: number;
  title: string;
  action: ReactNode;
  children: ReactNode;
}

const PrivacySection = ({ id, number, title, action, children }: PrivacySectionProps) => (
  <section id={id} className="scroll-mt-28 py-8 md:py-10">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-4">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="text-xl leading-tight font-semibold tracking-tight text-slate-950 md:text-2xl">
          {title}
        </h2>
      </div>
      {action}
    </div>

    <div className="text-base leading-7 text-slate-600 md:pl-13 md:text-lg md:leading-8">
      {children}
    </div>
  </section>
);

interface EditActionsProps {
  isEditing: boolean;
  disabled: boolean;
  isSaving: boolean;
  editLabel: string;
  saveLabel: string;
  cancelLabel: string;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const EditActions = ({
  isEditing,
  disabled,
  isSaving,
  editLabel,
  saveLabel,
  cancelLabel,
  onEdit,
  onCancel,
  onSave,
}: EditActionsProps) => {
  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        aria-label={editLabel}
        title={editLabel}
        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Pencil size={17} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        aria-label={cancelLabel}
        title={cancelLabel}
        className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X size={18} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        aria-label={saveLabel}
        title={saveLabel}
        className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-wait disabled:opacity-60"
      >
        {isSaving ? (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        ) : (
          <Save size={18} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

interface SectionEditorProps {
  section: EditablePrivacySection;
  data: PrivacyData;
  language: PrivacyLanguage;
  onLanguageChange: (language: PrivacyLanguage) => void;
  onTextChange: (section: EditablePrivacySection, language: PrivacyLanguage, value: string) => void;
  onMetadataChange: (event: ChangeEvent<HTMLInputElement>) => void;
  t: TFunction;
}

const SectionEditor = ({
  section,
  data,
  language,
  onLanguageChange,
  onTextChange,
  onMetadataChange,
  t,
}: SectionEditorProps) => (
  <div className="space-y-5">
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
      {LANGUAGES.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onLanguageChange(item)}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-bold uppercase transition ${
            language === item
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-white hover:text-slate-900"
          }`}
        >
          {item}
        </button>
      ))}
    </div>

    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {t("privacy.admin.sectionText", {
          defaultValue: "Section text",
        })}
      </span>
      <textarea
        value={data[section][language]}
        onChange={(event) => onTextChange(section, language, event.target.value)}
        rows={10}
        className="min-h-56 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base leading-7 font-medium text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />
    </label>

    {section === "vpsHosting" && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MetadataInput
          name="vpsProviderName"
          value={data.vpsProviderName}
          label={t("privacy.admin.vpsProvider", {
            defaultValue: "VPS provider",
          })}
          onChange={onMetadataChange}
        />
        <MetadataInput
          name="serverLocation"
          value={data.serverLocation}
          label={t("privacy.admin.serverLocation", {
            defaultValue: "Server location",
          })}
          onChange={onMetadataChange}
        />
        <div className="md:col-span-2">
          <MetadataInput
            name="vpsProviderAddress"
            value={data.vpsProviderAddress}
            label={t("privacy.admin.vpsAddress", {
              defaultValue: "Provider address",
            })}
            onChange={onMetadataChange}
          />
        </div>
      </div>
    )}

    {section === "retention" && (
      <MetadataInput
        name="retentionMonths"
        value={String(data.retentionMonths)}
        type="number"
        min={1}
        label={t("privacy.admin.retentionMonths", {
          defaultValue: "Retention period in months",
        })}
        onChange={onMetadataChange}
      />
    )}
  </div>
);

interface MetadataInputProps {
  name: string;
  value: string;
  label: string;
  type?: "text" | "number";
  min?: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const MetadataInput = ({
  name,
  value,
  label,
  type = "text",
  min,
  onChange,
}: MetadataInputProps) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
    <input
      name={name}
      value={value}
      type={type}
      min={min}
      onChange={onChange}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
    />
  </label>
);

interface SectionContentProps {
  section: EditablePrivacySection;
  data: PrivacyData;
  currentLang: LangKey;
  email: string;
  emptyLabel: string;
  t: TFunction;
}

const SectionContent = ({
  section,
  data,
  currentLang,
  email,
  emptyLabel,
  t,
}: SectionContentProps) => {
  const content = data[section][currentLang].trim();

  return (
    <div>
      <p className="whitespace-pre-line">
        {content || <span className="text-slate-400 italic">{emptyLabel}</span>}
      </p>

      {section === "controller" && (
        <a
          href={`mailto:${email}`}
          className="mt-5 inline-flex items-center gap-2 font-semibold break-all text-blue-700 transition hover:underline"
        >
          <Mail size={18} aria-hidden="true" />
          {email}
        </a>
      )}

      {section === "vpsHosting" &&
        (data.vpsProviderName || data.vpsProviderAddress || data.serverLocation) && (
          <dl className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
            <DataItem
              label={t("privacy.vps.provider", {
                defaultValue: "Provider",
              })}
              value={data.vpsProviderName}
            />
            <DataItem
              label={t("privacy.vps.location", {
                defaultValue: "Server location",
              })}
              value={data.serverLocation}
            />
            <div className="sm:col-span-2">
              <DataItem
                label={t("privacy.vps.address", {
                  defaultValue: "Address",
                })}
                value={data.vpsProviderAddress}
              />
            </div>
          </dl>
        )}

      {section === "retention" && (
        <p className="mt-5 inline-flex rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">
          {t("privacy.retentionPeriod", {
            count: data.retentionMonths,
            defaultValue: `${data.retentionMonths} months`,
          })}
        </p>
      )}
    </div>
  );
};

const DataItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs font-bold tracking-wider text-slate-500 uppercase">{label}</dt>
    <dd className="mt-1 font-semibold whitespace-pre-line text-slate-800">{value || "—"}</dd>
  </div>
);

// import { useEffect, useId, useState, type ReactNode } from "react";
// import {
//   AlertCircle,
//   ArrowRight,
//   Database,
//   Eye,
//   FileLock2,
//   FileText,
//   Fingerprint,
//   ImageIcon,
//   Lock,
//   Mail,
//   Server,
//   ShieldAlert,
//   ShieldCheck,
//   UserCheck,
//   X,
//   Youtube,
//   type LucideIcon,
// } from "lucide-react";
// import { useTranslation } from "react-i18next";

// import { PageLoader } from "../../components/ui/PageLoader";
// import { subscribeToContacts } from "../../services/contactService";
// import type { ContactData } from "../../types/contactData";

// interface ActiveRight {
//   title: string;
//   text: string;
// }

// interface RightItem extends ActiveRight {
//   key: string;
//   article: string;
//   icon: LucideIcon;
// }

// export const Privacy = () => {
//   const { t } = useTranslation();
//   const [activeRight, setActiveRight] = useState<ActiveRight | null>(null);
//   const [contacts, setContacts] = useState<ContactData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = subscribeToContacts((data) => {
//       setContacts(data);
//       setIsLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!activeRight) return;

//     const previousOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") setActiveRight(null);
//     };

//     document.addEventListener("keydown", handleEscape);

//     return () => {
//       document.body.style.overflow = previousOverflow;
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, [activeRight]);

//   const rights: RightItem[] = [
//     {
//       key: "information",
//       title: t("privacy.rights.info.label"),
//       icon: Eye,
//       article: "Art. 15 DSGVO",
//       text: t("privacy.rights.info.desc"),
//     },
//     {
//       key: "correction",
//       title: t("privacy.rights.correction.label"),
//       icon: ShieldCheck,
//       article: "Art. 16 DSGVO",
//       text: t("privacy.rights.correction.desc"),
//     },
//     {
//       key: "deletion",
//       title: t("privacy.rights.deletion.label"),
//       icon: AlertCircle,
//       article: "Art. 17 DSGVO",
//       text: t("privacy.rights.deletion.desc"),
//     },
//     {
//       key: "objection",
//       title: t("privacy.rights.objection.label"),
//       icon: ShieldAlert,
//       article: "Art. 21 DSGVO",
//       text: t("privacy.rights.objection.desc"),
//     },
//   ];

//   return (
//     <div className="font-nunito mx-auto w-full max-w-6xl px-3 pb-14 md:px-6 md:pb-20">
//       <PageLoader visible={isLoading} />

//       <header className="border-b border-slate-200 py-8 md:py-12">
//         <div className="flex w-fit max-w-full flex-col items-center gap-3">
//           <h1 className="text-preset-2 font-semibold tracking-tight text-slate-950">
//             {t("privacy.title")}
//           </h1>

//           <div
//             aria-hidden="true"
//             className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
//           />
//         </div>

//         <p className="text-preset-4 mt-7 max-w-4xl font-medium text-slate-600">
//           {t("privacy.subtitle")}
//         </p>
//       </header>

//       <main className="mt-10 grid grid-cols-1 items-stretch gap-6 md:mt-12 md:grid-cols-2 md:gap-8">
//         <PrivacyCard
//           icon={UserCheck}
//           title={t("privacy.controller.title")}
//           accent="blue"
//         >
//           <p className="text-lg font-semibold text-slate-950">Berehynja e.V.</p>
//           <p className="mt-3 text-base leading-7 text-slate-600 md:text-lg md:leading-8">
//             {t("privacy.controller.desc")}
//           </p>
//           <div className="mt-5 flex items-start gap-3 border-t border-slate-100 pt-4">
//             <Mail size={18} className="mt-0.5 shrink-0 text-slate-400" />
//             <a
//               href={`mailto:${contacts?.email || "info@berehynja.de"}`}
//               className="break-all font-medium text-blue-700 transition hover:underline"
//             >
//               {contacts?.email || "info@berehynja.de"}
//             </a>
//           </div>
//         </PrivacyCard>

//         <PrivacyCard
//           icon={FileLock2}
//           title={t("privacy.rights.title")}
//           accent="blue"
//         >
//           <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
//             {rights.map(({ key, title, text, article, icon: Icon }) => (
//               <button
//                 key={key}
//                 type="button"
//                 onClick={() => setActiveRight({ title, text })}
//                 className="group flex min-h-24 cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
//               >
//                 <span className="flex w-full items-start justify-between gap-3">
//                   <span className="flex min-w-0 items-start gap-3">
//                     <Icon size={18} className="mt-0.5 shrink-0 text-blue-600" />
//                     <span className="text-base font-semibold text-slate-800 transition group-hover:text-blue-800">
//                       {title}
//                     </span>
//                   </span>
//                   <ArrowRight
//                     size={15}
//                     className="mt-0.5 shrink-0 text-blue-500 transition-transform group-hover:translate-x-1"
//                   />
//                 </span>
//                 <span className="mt-3 pl-7 text-sm font-semibold tracking-wide text-slate-600 uppercase">
//                   {article}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </PrivacyCard>

//         <PrivacyCard
//           icon={Server}
//           title={t("privacy.infrastructure.title")}
//           accent="blue"
//         >
//           <p className="text-base leading-7 text-slate-600 md:text-lg md:leading-8">
//             {t("privacy.infrastructure.desc")}
//           </p>
//           <p className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
//             <Lock size={15} />
//             {t("privacy.infrastructure.encryption")}
//           </p>
//         </PrivacyCard>

//         <PrivacyCard
//           icon={Database}
//           title={t("privacy.media.title")}
//           accent="blue"
//         >
//           <div className="space-y-6">
//             <MediaItem icon={ImageIcon} title="Cloudinary" tone="blue">
//               {t("privacy.media.cloudinaryDesc")}
//             </MediaItem>

//             <MediaItem icon={Youtube} title="YouTube (Google)" tone="red">
//               {t("privacy.media.youtubeDesc")}
//             </MediaItem>
//           </div>
//         </PrivacyCard>

//         <PrivacyCard
//           icon={Fingerprint}
//           title={t("privacy.cookies.title")}
//           accent="yellow"
//         >
//           <p className="text-base leading-7 text-slate-600 md:text-lg md:leading-8">
//             {t("privacy.cookies.desc")}
//           </p>
//         </PrivacyCard>

//         <PrivacyCard
//           icon={ShieldAlert}
//           title={t("privacy.complaint.title")}
//           accent="neutral"
//         >
//           <p className="text-base leading-7 text-slate-600 md:text-lg md:leading-8">
//             {t("privacy.complaint.desc")}
//           </p>
//         </PrivacyCard>
//       </main>

//       <PrivacyRightModal
//         value={activeRight}
//         onClose={() => setActiveRight(null)}
//         closeLabel={t("privacy.modal.close")}
//       />
//     </div>
//   );
// };

// interface PrivacyCardProps {
//   icon: LucideIcon;
//   title: string;
//   accent: "blue" | "yellow" | "neutral";
//   children: ReactNode;
// }

// const PrivacyCard = ({
//   icon: Icon,
//   title,
//   accent,
//   children,
// }: PrivacyCardProps) => {
//   const borderClass =
//     accent === "yellow"
//       ? "border-t-yellow-400"
//       : accent === "blue"
//         ? "border-t-blue-600"
//         : "border-t-slate-400";
//   const iconClass =
//     accent === "yellow"
//       ? "bg-yellow-50 text-amber-600"
//       : accent === "blue"
//         ? "bg-blue-50 text-blue-600"
//         : "bg-slate-100 text-slate-600";

//   return (
//     <section
//       className={`h-full rounded-3xl border border-slate-200 border-t-4 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-7 ${borderClass}`}
//     >
//       <div className="mb-6 flex items-center gap-3">
//         <div
//           className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
//         >
//           <Icon size={20} />
//         </div>
//         <h2 className="text-base font-semibold tracking-wide text-slate-700 uppercase md:text-lg">
//           {title}
//         </h2>
//       </div>

//       <div className="text-base leading-7 md:pl-14 md:text-lg md:leading-8">
//         {children}
//       </div>
//     </section>
//   );
// };

// interface MediaItemProps {
//   icon: LucideIcon;
//   title: string;
//   tone: "blue" | "red";
//   children: ReactNode;
// }

// const MediaItem = ({ icon: Icon, title, tone, children }: MediaItemProps) => (
//   <article className="flex items-start gap-4">
//     <div
//       className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${
//         tone === "red" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"
//       }`}
//     >
//       <Icon size={16} />
//     </div>
//     <div>
//       <h3 className="text-base font-semibold text-slate-900 md:text-lg">
//         {title}
//       </h3>
//       <p className="mt-1 text-base leading-7 text-slate-600 md:text-lg md:leading-8">
//         {children}
//       </p>
//     </div>
//   </article>
// );

// interface PrivacyRightModalProps {
//   value: ActiveRight | null;
//   onClose: () => void;
//   closeLabel: string;
// }

// const PrivacyRightModal = ({
//   value,
//   onClose,
//   closeLabel,
// }: PrivacyRightModalProps) => {
//   const titleId = useId();
//   const descriptionId = useId();

//   if (!value) return null;

//   return (
//     <div className="font-nunito fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-6">
//       <button
//         type="button"
//         aria-label={closeLabel}
//         onClick={onClose}
//         className="absolute inset-0 cursor-default bg-slate-950/65 backdrop-blur-sm"
//       />

//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby={titleId}
//         aria-describedby={descriptionId}
//         className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.4)]"
//       >
//         <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 md:px-7">
//           <div className="flex min-w-0 items-start gap-4">
//             <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
//               <FileText size={22} />
//             </div>
//             <h2
//               id={titleId}
//               className="pt-1 text-xl font-semibold tracking-tight text-slate-950"
//             >
//               {value.title}
//             </h2>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label={closeLabel}
//             className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
//           >
//             <X size={19} />
//           </button>
//         </header>

//         <div className="px-5 py-6 md:px-7">
//           <p
//             id={descriptionId}
//             className="text-base leading-7 text-slate-600 md:text-lg md:leading-8"
//           >
//             {value.text}
//           </p>
//         </div>

//         <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 md:px-7">
//           <button
//             type="button"
//             onClick={onClose}
//             className="w-full cursor-pointer rounded-2xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
//           >
//             {closeLabel}
//           </button>
//         </footer>
//       </div>
//     </div>
//   );
// };





 // "privacy": {
  //   "title": "Datenschutz",
  //   "subtitle": "Захист ваших даних — наш пріоритет. Ми обробляємо інформацію конфіденційно та лише у відповідності до вимог європейських стандартів DSGVO та BDSG.",
  //   "controller": {
  //     "title": "Verantwortlicher",
  //     "desc": "Відповідальною особою за обробку даних на цьому сайті є Berehynja Детальні контактні дані вказані в нашому Impressum."
  //   },
  //   "infrastructure": {
  //     "title": "Infrastruktur & Hosting",
  //     "desc": "Весь текстовий контент, посилання та логіка сайту обробляються через Firebase (Google Ireland Ltd). Дані зберігаються виключно на серверах у межах ЄС відповідно до найвищих стандартів безпеки.",
  //     "encryption": "End-to-End Encryption"
  //   },
  //   "cookies": {
  //     "title": "Cookies & Tracking",
  //     "desc": "Ми використовуємо лише технічно необхідні Cookies (Session Storage) для збереження вашого вибору мови. Жодних маркетингових чи аналітичних трекерів на цьому сайті не застосовується."
  //   },
  //   "rights": {
  //     "title": "Ihre Rechte (Ваші права)",
  //     "info": {
  //       "label": "Auskunft",
  //       "desc": "Ви маєте право отримати інформацію про те, чи обробляються ваші дані, які саме дані зберігаються та мету їх обробки."
  //     },
  //     "correction": {
  //       "label": "Berichtigung",
  //       "desc": "Ви маєте право вимагати негайного виправлення будь-яких неточних або неповних персональних даних."
  //     },
  //     "deletion": {
  //       "label": "Löschung",
  //       "desc": "Ви маєте право вимагати видалення ваших даних, якщо вони більше не потрібні для цілей, для яких збиралися."
  //     },
  //     "objection": {
  //       "label": "Widerspruch",
  //       "desc": "Ви маєте право заперечити проти обробки ваших даних, якщо ми використовуємо їх на основі законних інтересів."
  //     }
  //   },
  //   "media": {
  //     "title": "Externe Medien",
  //     "cloudinaryDesc": "Використовується як CDN виключно для безпечного зберігання та швидкої доставки зображень.",
  //     "youtubeDesc": "Відео з каналів транслюються в режимі підвищеної приватності (erweiterter Datenschutzmodus)."
  //   },
  //   "complaint": {
  //     "title": "Beschwerderecht (Art. 77 DSGVO)",
  //     "desc": "Ви маєте право подати скаргу до компетентного органу нагляду за захистом даних."
  //   },
  //   "modal": {
  //     "close": "Зрозуміло"
  //   }
  // }