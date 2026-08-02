import { useEffect, useId, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  Database,
  Eye,
  FileLock2,
  FileText,
  Fingerprint,
  ImageIcon,
  Lock,
  Mail,
  Server,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  X,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageLoader } from "../../components/ui/PageLoader";
import { subscribeToContacts } from "../../services/contactService";
import type { ContactData } from "../../types/contactData";

interface ActiveRight {
  title: string;
  text: string;
}

interface RightItem extends ActiveRight {
  key: string;
  article: string;
  icon: LucideIcon;
}

export const Privacy = () => {
  const { t } = useTranslation();
  const [activeRight, setActiveRight] = useState<ActiveRight | null>(null);
  const [contacts, setContacts] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToContacts((data) => {
      setContacts(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeRight) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveRight(null);
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeRight]);

  const rights: RightItem[] = [
    {
      key: "information",
      title: t("privacy.rights.info.label"),
      icon: Eye,
      article: "Art. 15 DSGVO",
      text: t("privacy.rights.info.desc"),
    },
    {
      key: "correction",
      title: t("privacy.rights.correction.label"),
      icon: ShieldCheck,
      article: "Art. 16 DSGVO",
      text: t("privacy.rights.correction.desc"),
    },
    {
      key: "deletion",
      title: t("privacy.rights.deletion.label"),
      icon: AlertCircle,
      article: "Art. 17 DSGVO",
      text: t("privacy.rights.deletion.desc"),
    },
    {
      key: "objection",
      title: t("privacy.rights.objection.label"),
      icon: ShieldAlert,
      article: "Art. 21 DSGVO",
      text: t("privacy.rights.objection.desc"),
    },
  ];

  return (
    <div className="font-nunito mx-auto w-full max-w-6xl px-3 pb-14 md:px-6 md:pb-20">
      <PageLoader visible={isLoading} />

      <header className="border-b border-slate-200 py-8 md:py-12">
        <div className="flex w-fit max-w-full flex-col items-center gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm md:size-12">
              <ShieldCheck size={23} />
            </div>
            <h1 className="text-preset-2 font-semibold tracking-tight text-slate-950">
              {t("privacy.title")}
            </h1>
          </div>

          <div
            aria-hidden="true"
            className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
          />
        </div>

        <p className="text-preset-4 mt-7 max-w-4xl font-medium text-slate-600">
          {t("privacy.subtitle")}
        </p>
      </header>

      <main className="mt-10 grid grid-cols-1 items-stretch gap-6 md:mt-12 md:grid-cols-2 md:gap-8">
        <PrivacyCard
          icon={UserCheck}
          title={t("privacy.controller.title")}
          accent="blue"
        >
          <p className="text-lg font-semibold text-slate-950">Berehynja e.V.</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {t("privacy.controller.desc")}
          </p>
          <div className="mt-5 flex items-start gap-3 border-t border-slate-100 pt-4">
            <Mail size={18} className="mt-0.5 shrink-0 text-slate-400" />
            <a
              href={`mailto:${contacts?.email || "info@berehynja.de"}`}
              className="break-all font-medium text-blue-700 transition hover:underline"
            >
              {contacts?.email || "info@berehynja.de"}
            </a>
          </div>
        </PrivacyCard>

        <PrivacyCard
          icon={FileLock2}
          title={t("privacy.rights.title")}
          accent="blue"
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {rights.map(({ key, title, text, article, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveRight({ title, text })}
                className="group flex min-h-24 cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
              >
                <span className="flex w-full items-start justify-between gap-3">
                  <span className="flex min-w-0 items-start gap-3">
                    <Icon size={18} className="mt-0.5 shrink-0 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-800 transition group-hover:text-blue-800">
                      {title}
                    </span>
                  </span>
                  <ArrowRight
                    size={15}
                    className="mt-0.5 shrink-0 text-blue-500 transition-transform group-hover:translate-x-1"
                  />
                </span>
                <span className="mt-3 pl-7 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                  {article}
                </span>
              </button>
            ))}
          </div>
        </PrivacyCard>

        <PrivacyCard
          icon={Server}
          title={t("privacy.infrastructure.title")}
          accent="blue"
        >
          <p className="text-sm leading-6 text-slate-600">
            {t("privacy.infrastructure.desc")}
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold tracking-wide text-emerald-700 uppercase">
            <Lock size={15} />
            {t("privacy.infrastructure.encryption")}
          </p>
        </PrivacyCard>

        <PrivacyCard
          icon={Database}
          title={t("privacy.media.title")}
          accent="blue"
        >
          <div className="space-y-6">
            <MediaItem icon={ImageIcon} title="Cloudinary" tone="blue">
              {t("privacy.media.cloudinaryDesc")}
            </MediaItem>

            <MediaItem icon={Youtube} title="YouTube (Google)" tone="red">
              {t("privacy.media.youtubeDesc")}
            </MediaItem>
          </div>
        </PrivacyCard>

        <PrivacyCard
          icon={Fingerprint}
          title={t("privacy.cookies.title")}
          accent="yellow"
        >
          <p className="text-sm leading-6 text-slate-600">
            {t("privacy.cookies.desc")}
          </p>
        </PrivacyCard>

        <PrivacyCard
          icon={ShieldAlert}
          title={t("privacy.complaint.title")}
          accent="neutral"
        >
          <p className="text-sm leading-6 text-slate-600">
            {t("privacy.complaint.desc")}
          </p>
        </PrivacyCard>
      </main>

      <PrivacyRightModal
        value={activeRight}
        onClose={() => setActiveRight(null)}
        closeLabel={t("privacy.modal.close")}
      />
    </div>
  );
};

interface PrivacyCardProps {
  icon: LucideIcon;
  title: string;
  accent: "blue" | "yellow" | "neutral";
  children: ReactNode;
}

const PrivacyCard = ({
  icon: Icon,
  title,
  accent,
  children,
}: PrivacyCardProps) => {
  const borderClass =
    accent === "yellow"
      ? "border-t-yellow-400"
      : accent === "blue"
        ? "border-t-blue-600"
        : "border-t-slate-400";
  const iconClass =
    accent === "yellow"
      ? "bg-yellow-50 text-amber-600"
      : accent === "blue"
        ? "bg-blue-50 text-blue-600"
        : "bg-slate-100 text-slate-600";

  return (
    <section
      className={`h-full rounded-3xl border border-slate-200 border-t-4 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-7 ${borderClass}`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>
        <h2 className="text-preset-5 font-bold tracking-wide text-slate-600 uppercase">
          {title}
        </h2>
      </div>

      <div className="md:pl-14">{children}</div>
    </section>
  );
};

interface MediaItemProps {
  icon: LucideIcon;
  title: string;
  tone: "blue" | "red";
  children: ReactNode;
}

const MediaItem = ({ icon: Icon, title, tone, children }: MediaItemProps) => (
  <article className="flex items-start gap-4">
    <div
      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${
        tone === "red" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"
      }`}
    >
      <Icon size={16} />
    </div>
    <div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  </article>
);

interface PrivacyRightModalProps {
  value: ActiveRight | null;
  onClose: () => void;
  closeLabel: string;
}

const PrivacyRightModal = ({
  value,
  onClose,
  closeLabel,
}: PrivacyRightModalProps) => {
  const titleId = useId();
  const descriptionId = useId();

  if (!value) return null;

  return (
    <div className="font-nunito fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/65 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.4)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 md:px-7">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FileText size={22} />
            </div>
            <h2
              id={titleId}
              className="pt-1 text-xl font-semibold tracking-tight text-slate-950"
            >
              {value.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={19} />
          </button>
        </header>

        <div className="px-5 py-6 md:px-7">
          <p id={descriptionId} className="leading-7 text-slate-600">
            {value.text}
          </p>
        </div>

        <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 md:px-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            {closeLabel}
          </button>
        </footer>
      </div>
    </div>
  );
};
