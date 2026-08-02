import {
  CheckCircle2,
  MessageSquare,
  Phone,
  Send,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useCallback,
  useState,
  type FormEvent,
} from "react";
import { useTranslation } from "react-i18next";

import type { LangKey } from "../../types/types";

export interface JoinFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  acceptedPrivacy: boolean;
}

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: JoinFormData) => void | Promise<void>;
}

const JOIN_TEXT = {
  dialogLabel: {
    ua: "Форма приєднання",
    de: "Beitrittsformular",
    en: "Join form",
  },
  close: { ua: "Закрити форму", de: "Formular schließen", en: "Close form" },
  title: { ua: "Приєднатися", de: "Mitmachen", en: "Join us" },
  subtitle: {
    ua: "Станьте частиною Berehynja",
    de: "Werden Sie Teil von Berehynja",
    en: "Become part of Berehynja",
  },
  fullName: { ua: "Повне ім’я *", de: "Vollständiger Name *", en: "Full name *" },
  fullNamePlaceholder: {
    ua: "Ваше прізвище та ім’я",
    de: "Ihr Vor- und Nachname",
    en: "Your full name",
  },
  email: { ua: "E-mail *", de: "E-Mail *", en: "Email *" },
  phone: { ua: "Телефон", de: "Telefon", en: "Phone" },
  optional: { ua: "(за бажанням)", de: "(optional)", en: "(optional)" },
  message: {
    ua: "Чим ви хотіли б допомогти?",
    de: "Wie möchten Sie helfen?",
    en: "How would you like to help?",
  },
  messagePlaceholder: {
    ua: "Напишіть трохи про себе або ваші ідеї...",
    de: "Erzählen Sie uns etwas über sich oder Ihre Ideen...",
    en: "Tell us a little about yourself or your ideas...",
  },
  privacyBefore: {
    ua: "Я погоджуюся з обробкою моїх даних відповідно до",
    de: "Ich stimme der Verarbeitung meiner Daten gemäß der",
    en: "I agree to the processing of my data according to the",
  },
  privacyLink: {
    ua: "Політики конфіденційності",
    de: "Datenschutzerklärung",
    en: "Privacy Policy",
  },
  privacyRequired: {
    ua: "Щоб надіслати заявку, підтвердьте згоду на обробку даних.",
    de: "Bitte stimmen Sie der Datenverarbeitung zu, um die Anfrage zu senden.",
    en: "Please agree to data processing before sending the application.",
  },
  submitError: {
    ua: "Не вдалося надіслати заявку. Спробуйте ще раз.",
    de: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    en: "The application could not be sent. Please try again.",
  },
  submit: { ua: "Надіслати заявку", de: "Anfrage senden", en: "Send application" },
  submitting: { ua: "Надсилаємо...", de: "Wird gesendet...", en: "Sending..." },
  successTitle: { ua: "Дякуємо!", de: "Vielen Dank!", en: "Thank you!" },
  successText: {
    ua: "Ми отримали вашу заявку. Наш координатор зв’яжеться з вами найближчим часом.",
    de: "Wir haben Ihre Anfrage erhalten. Unser Koordinator wird sich in Kürze bei Ihnen melden.",
    en: "We received your application. Our coordinator will contact you shortly.",
  },
};

export const JoinModal = ({
  isOpen,
  onClose,
  onSubmit,
}: JoinModalProps) => {
  const { i18n } = useTranslation();
  const fieldId = useId();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const detectedLanguage = (
    i18n.resolvedLanguage || i18n.language
  ).split("-")[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const resetForm = useCallback(() => {
    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setAcceptedPrivacy(false);
    setPrivacyError(false);
    setSubmitError(false);
    setIsSubmitting(false);
    setIsSubmitted(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [handleClose, isOpen]);

  useEffect(() => {
    if (!isSubmitted) return;

    const closeTimer = window.setTimeout(handleClose, 3500);
    return () => window.clearTimeout(closeTimer);
  }, [handleClose, isSubmitted]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!acceptedPrivacy) {
      setPrivacyError(true);
      return;
    }

    setIsSubmitting(true);
    setPrivacyError(false);
    setSubmitError(false);

    try {
      await onSubmit?.({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        acceptedPrivacy,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Join form submission error:", error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={JOIN_TEXT.dialogLabel[currentLang]}
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
    >
      <div
        aria-hidden="true"
        className="animate-in fade-in absolute inset-0 bg-slate-950/65 backdrop-blur-sm duration-300"
        onMouseDown={handleClose}
      />

      <div className="animate-in zoom-in-95 font-nunito relative max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)] duration-300 sm:p-8 lg:p-10">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-blue-600 via-blue-500 to-yellow-400"
        />
        <button
          type="button"
          onClick={handleClose}
          aria-label={JOIN_TEXT.close[currentLang]}
          title={JOIN_TEXT.close[currentLang]}
          className="absolute top-5 right-5 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:top-7 sm:right-7"
        >
          <X size={22} aria-hidden="true" />
        </button>

        {!isSubmitted ? (
          <div className="text-left">
            <div className="mb-8 flex items-center gap-4 pr-12">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100">
                <UserPlus size={28} aria-hidden="true" />
              </div>
              <div>
                <h3
                  id={`${fieldId}-title`}
                  className="font-nunito text-3xl leading-tight font-black text-slate-950"
                >
                  {JOIN_TEXT.title[currentLang]}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {JOIN_TEXT.subtitle[currentLang]}
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor={`${fieldId}-name`}
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  {JOIN_TEXT.fullName[currentLang]}
                </label>
                <div className="relative">
                  <User
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    id={`${fieldId}-name`}
                    required
                    minLength={2}
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    autoComplete="name"
                    placeholder={JOIN_TEXT.fullNamePlaceholder[currentLang]}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${fieldId}-email`}
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    {JOIN_TEXT.email[currentLang]}
                  </label>
                  <input
                    id={`${fieldId}-email`}
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    placeholder="mail@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${fieldId}-phone`}
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    {JOIN_TEXT.phone[currentLang]}{" "}
                    <span className="font-normal text-slate-500 lowercase">
                      {JOIN_TEXT.optional[currentLang]}
                    </span>
                  </label>
                  <div className="relative">
                    <Phone
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
                      size={16}
                    />
                    <input
                      id={`${fieldId}-phone`}
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+49..."
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`${fieldId}-message`}
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  {JOIN_TEXT.message[currentLang]}
                </label>
                <div className="relative">
                  <MessageSquare
                    aria-hidden="true"
                    className="pointer-events-none absolute top-4 left-4 text-slate-500"
                    size={18}
                  />
                  <textarea
                    id={`${fieldId}-message`}
                    rows={3}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={JOIN_TEXT.messagePlaceholder[currentLang]}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50/50">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(event) => {
                    setAcceptedPrivacy(event.target.checked);
                    if (event.target.checked) setPrivacyError(false);
                  }}
                  aria-invalid={Boolean(privacyError)}
                  aria-describedby={
                    privacyError ? `${fieldId}-privacy-error` : undefined
                  }
                  className="mt-1 size-4 shrink-0 cursor-pointer accent-blue-600"
                />
                <span>
                  {JOIN_TEXT.privacyBefore[currentLang]}{" "}
                  <a
                    href="privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline transition-colors hover:text-blue-600"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {JOIN_TEXT.privacyLink[currentLang]}
                  </a>
                  .
                </span>
              </label>

              {privacyError && (
                <p
                  id={`${fieldId}-privacy-error`}
                  role="alert"
                  className="text-sm font-bold text-red-700"
                >
                  {JOIN_TEXT.privacyRequired[currentLang]}
                </p>
              )}

              {submitError && (
                <p role="alert" className="text-sm font-bold text-red-700">
                  {JOIN_TEXT.submitError[currentLang]}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting || !acceptedPrivacy}
                className={`group font-nunito flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 font-black text-white shadow-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                  acceptedPrivacy
                    ? "cursor-pointer hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                    : "cursor-not-allowed opacity-60"
                }`}
              >
                <span>
                  {isSubmitting
                    ? JOIN_TEXT.submitting[currentLang]
                    : JOIN_TEXT.submit[currentLang]}
                </span>
                <Send
                  size={18}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in py-10 text-center duration-500">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm ring-1 ring-emerald-100">
              <CheckCircle2 size={44} aria-hidden="true" />
            </div>
            <h3 className="font-nunito mb-4 text-3xl font-black text-slate-950">
              {JOIN_TEXT.successTitle[currentLang]}
            </h3>
            <p className="font-nunito mx-auto max-w-sm leading-7 text-slate-600">
              {JOIN_TEXT.successText[currentLang]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
