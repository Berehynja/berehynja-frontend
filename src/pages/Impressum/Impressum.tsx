import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import {
  Building2,
  Copyright,
  FileText,
  Globe,
  Info,
  Link as LinkIcon,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useAuth } from "../../components/AuthProvider/useAuth";
import { PageLoader } from "../../components/ui/PageLoader";
import { subscribeToContacts } from "../../services/contactService";
import {
  saveImpressum,
  subscribeToImpressum,
} from "../../services/impressumService";
import type { ContactData } from "../../types/contactData";
import type { ImpressumData } from "../../types/impressumData";
import type { LangKey } from "../../types/types";

const INITIAL_DATA: ImpressumData = {
  representative: "",
  position: "",
  registerCourt: "",
  registerNumber: "",
  responsiblePerson: "",
  headerDescription: "",
  website: "",
};

type EditableBlock =
  "header" | "representative" | "contact" | "register" | "responsible";

const UI_TEXT = {
  ua: {
    edit: "Редагувати Impressum",
    save: "Зберегти",
    saving: "Збереження...",
    cancel: "Скасувати",
    saved: "Дані Impressum збережено.",
    saveError: "Не вдалося зберегти дані Impressum.",
    headerPlaceholder: "Вступний текст (необов’язково)...",
    representativePlaceholder: "Ім’я представника",
    positionPlaceholder: "Посада, наприклад Vorstand",
    responsiblePlaceholder: "Ім’я та адреса відповідальної особи...",
  },
  de: {
    edit: "Impressum bearbeiten",
    save: "Speichern",
    saving: "Wird gespeichert...",
    cancel: "Abbrechen",
    saved: "Die Impressum-Daten wurden gespeichert.",
    saveError: "Die Impressum-Daten konnten nicht gespeichert werden.",
    headerPlaceholder: "Einleitungstext (optional)...",
    representativePlaceholder: "Name der vertretungsberechtigten Person",
    positionPlaceholder: "Position, zum Beispiel Vorstand",
    responsiblePlaceholder: "Name und Anschrift der verantwortlichen Person...",
  },
  en: {
    edit: "Edit legal notice",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    saved: "The legal notice data has been saved.",
    saveError: "The legal notice data could not be saved.",
    headerPlaceholder: "Introductory text (optional)...",
    representativePlaceholder: "Representative’s name",
    positionPlaceholder: "Position, for example Vorstand",
    responsiblePlaceholder: "Name and address of the responsible person...",
  },
} as const;

export const Impressum = () => {
  const { isAdmin } = useAuth();
  const { i18n } = useTranslation();
  const [editingBlock, setEditingBlock] = useState<EditableBlock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [legalData, setLegalData] = useState<ImpressumData>(INITIAL_DATA);
  const [savedLegalData, setSavedLegalData] =
    useState<ImpressumData>(INITIAL_DATA);
  const [contacts, setContacts] = useState<ContactData | null>(null);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toLowerCase();
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";
  const text = UI_TEXT[currentLang];

  useEffect(() => {
    const unsubscribeImpressum = subscribeToImpressum((data) => {
      const normalizedData = { ...INITIAL_DATA, ...data };
      setLegalData(normalizedData);
      setSavedLegalData(normalizedData);
    });

    const unsubscribeContacts = subscribeToContacts((data) => {
      setContacts(data);
      setIsLoading(false);
    });

    return () => {
      unsubscribeImpressum();
      unsubscribeContacts();
    };
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setLegalData((previous) => ({ ...previous, [name]: value }));
  };

  const handleStartEditing = (block: EditableBlock) => {
    setSavedLegalData({ ...legalData });
    setEditingBlock(block);
  };

  const handleCancelEditing = () => {
    if (isSaving) return;
    setLegalData({ ...savedLegalData });
    setEditingBlock(null);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      await saveImpressum(legalData);
      setSavedLegalData({ ...legalData });
      setEditingBlock(null);
      toast.success(text.saved);
    } catch (error) {
      console.error("Impressum save error:", error);
      toast.error(text.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  const renderEditActions = (block: EditableBlock) => {
    if (!isAdmin) return null;

    const isCurrentBlock = editingBlock === block;
    const isAnotherBlockOpen = editingBlock !== null && !isCurrentBlock;

    if (!isCurrentBlock) {
      return (
        <button
          type="button"
          onClick={() => handleStartEditing(block)}
          disabled={isSaving || isAnotherBlockOpen}
          aria-label={text.edit}
          title={text.edit}
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
          onClick={handleCancelEditing}
          disabled={isSaving}
          aria-label={text.cancel}
          title={text.cancel}
          className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          aria-label={text.save}
          title={text.save}
          className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-wait disabled:opacity-60"
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

  return (
    <div className="font-nunito mx-auto w-full max-w-6xl px-3 pb-14 md:px-6 md:pb-20">
      <PageLoader visible={isLoading} />

      <header className="py-8 md:py-12">
        <div className="flex items-start justify-between gap-4">
          <div className="flex w-fit max-w-full flex-col items-center gap-3">
            <h1 className="text-preset-2 font-semibold tracking-tight text-slate-950">
              Impressum
            </h1>

            <div
              aria-hidden="true"
              className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
            />
          </div>

          {renderEditActions("header")}
        </div>

        {editingBlock === "header" ? (
          <textarea
            name="headerDescription"
            value={legalData.headerDescription}
            onChange={handleChange}
            rows={3}
            className={`${inputClassName} mt-7 resize-y`}
            placeholder={text.headerPlaceholder}
          />
        ) : (
          legalData.headerDescription && (
            <p className="text-preset-4 mt-7 max-w-4xl font-medium text-slate-600">
              {legalData.headerDescription}
            </p>
          )
        )}
      </header>

      <main className="space-y-10 md:space-y-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <LegalCard
            icon={Building2}
            title="Angaben gemäß § 5 TMG"
            accent="blue"
          >
            <p className="text-lg font-semibold text-slate-950 md:text-xl">
              Berehynja e.V.
            </p>
            <div className="mt-4 flex items-start gap-3 text-slate-600">
              <MapPin size={18} className="mt-0.5 shrink-0 text-slate-400" />
              <address className="text-base leading-7 not-italic md:text-lg md:leading-8">
                {contacts?.address || "Weserstraße 24"}
                <br />
                {contacts?.city || "32545 Bad Oeynhausen, Germany"}
              </address>
            </div>
          </LegalCard>

          <LegalCard
            icon={UserCircle}
            title="Vertreten durch"
            accent="blue"
            action={renderEditActions("representative")}
          >
            {editingBlock === "representative" ? (
              <div className="space-y-3">
                <input
                  name="representative"
                  value={legalData.representative}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder={text.representativePlaceholder}
                />
                <input
                  name="position"
                  value={legalData.position}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder={text.positionPlaceholder}
                />
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-slate-950 md:text-xl">
                  {legalData.representative || "Nicht angegeben"}
                </p>
                <p className="mt-2 inline-flex rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-semibold tracking-wide text-slate-600 uppercase">
                  {legalData.position || "Nicht angegeben"}
                </p>
              </div>
            )}
          </LegalCard>

          <LegalCard
            icon={Mail}
            title="Kontakt"
            accent="yellow"
            action={renderEditActions("contact")}
          >
            <div className="space-y-4 text-base text-slate-700 md:text-lg">
              <div className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-slate-400" />
                <a
                  href={`tel:${contacts?.phone || "+4915128161383"}`}
                  className="font-medium transition hover:text-blue-700"
                >
                  {contacts?.phone || "+49 151 28161383"}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-slate-400" />
                <a
                  href={`mailto:${contacts?.email || "bereginia.badoeynhausen@gmail.com"}`}
                  className="break-all font-medium transition hover:text-blue-700"
                >
                  {contacts?.email || "bereginia.badoeynhausen@gmail.com"}
                </a>
              </div>

              <div className="flex items-start gap-3 border-t border-slate-100 pt-4">
                <Globe size={18} className="mt-3 shrink-0 text-slate-400" />
                {editingBlock === "contact" ? (
                  <input
                    name="website"
                    type="url"
                    value={legalData.website}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="https://..."
                  />
                ) : legalData.website ? (
                  <a
                    href={legalData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all pt-3 font-medium text-blue-700 transition hover:underline"
                  >
                    {legalData.website}
                  </a>
                ) : (
                  <span className="pt-3 text-slate-500">Nicht angegeben</span>
                )}
              </div>
            </div>
          </LegalCard>

          <LegalCard
            icon={FileText}
            title="Registereintrag"
            accent="blue"
            action={renderEditActions("register")}
          >
            <p className="mb-5 text-base leading-7 text-slate-600 md:text-lg md:leading-8">
              Eintragung im Vereinsregister.
            </p>

            <div className="space-y-4">
              <LegalValue
                label="Registergericht"
                value={legalData.registerCourt || "\u2014"}
                isEditing={editingBlock === "register"}
              >
                <input
                  name="registerCourt"
                  value={legalData.registerCourt}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Amtsgericht..."
                />
              </LegalValue>

              <LegalValue
                label="Registernummer"
                value={legalData.registerNumber || "\u2014"}
                isEditing={editingBlock === "register"}
              >
                <input
                  name="registerNumber"
                  value={legalData.registerNumber}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="VR 12345"
                />
              </LegalValue>
            </div>
          </LegalCard>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-7">
          <Info
            size={130}
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 -right-4 text-slate-900/[0.03]"
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <h2 className="flex items-start gap-3 text-base font-semibold tracking-wide text-slate-700 uppercase md:text-lg">
                <Info size={20} className="mt-0.5 shrink-0 text-slate-500" />
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>

              {renderEditActions("responsible")}
            </div>

            {editingBlock === "responsible" ? (
              <textarea
                name="responsiblePerson"
                value={legalData.responsiblePerson}
                onChange={handleChange}
                rows={3}
                className={`${inputClassName} mt-5 resize-y bg-white`}
                placeholder={text.responsiblePlaceholder}
              />
            ) : (
              <p className="mt-5 inline-block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 font-medium text-slate-800 shadow-sm md:text-lg md:leading-8">
                {legalData.responsiblePerson || "Nicht angegeben"}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-8">
          <h2 className="text-preset-3 border-b border-slate-100 pb-5 font-semibold tracking-tight text-slate-950">
            Haftungsausschluss (Disclaimer)
          </h2>

          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <DisclaimerItem icon={ShieldCheck} title="Haftung für Inhalte">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen.
            </DisclaimerItem>

            <DisclaimerItem icon={LinkIcon} title="Haftung für Links">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              verantwortlich.
            </DisclaimerItem>

            <DisclaimerItem icon={Copyright} title="Urheberrecht">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung.
            </DisclaimerItem>
          </div>
        </section>
      </main>
    </div>
  );
};

interface LegalCardProps {
  icon: typeof Building2;
  title: string;
  accent: "blue" | "yellow";
  action?: ReactNode;
  children: ReactNode;
}

const LegalCard = ({
  icon: Icon,
  title,
  accent,
  action,
  children,
}: LegalCardProps) => {
  const isYellow = accent === "yellow";

  return (
    <section
      className={`h-full rounded-3xl border border-slate-200 border-t-4 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-7 ${
        isYellow ? "border-t-yellow-400" : "border-t-blue-600"
      }`}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
              isYellow
                ? "bg-yellow-50 text-amber-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <Icon size={20} />
          </div>

          <h2 className="text-base font-semibold tracking-wide text-slate-700 uppercase md:text-lg">
            {title}
          </h2>
        </div>

        {action}
      </div>

      <div className="text-base leading-7 md:pl-14 md:text-lg md:leading-8">
        {children}
      </div>
    </section>
  );
};

interface LegalValueProps {
  label: string;
  value: string;
  isEditing: boolean;
  children: ReactNode;
}

const LegalValue = ({ label, value, isEditing, children }: LegalValueProps) => (
  <div className="grid gap-2 border-b border-slate-100 pb-4 last:border-0 last:pb-0 md:grid-cols-[140px_1fr] md:items-center">
    <span className="text-sm font-semibold tracking-wide text-slate-600 uppercase md:text-base">
      {label}
    </span>
    {isEditing ? (
      children
    ) : (
      <span className="text-base font-semibold text-slate-800 md:text-right md:text-lg">
        {value || "—"}
      </span>
    )}
  </div>
);

interface DisclaimerItemProps {
  icon: typeof ShieldCheck;
  title: string;
  children: ReactNode;
}

const DisclaimerItem = ({
  icon: Icon,
  title,
  children,
}: DisclaimerItemProps) => (
  <article>
    <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900 md:text-lg">
      <Icon size={19} className="shrink-0 text-blue-600" />
      {title}
    </h3>
    <p className="text-base leading-7 text-slate-600 md:text-lg md:leading-8">
      {children}
    </p>
  </article>
);
