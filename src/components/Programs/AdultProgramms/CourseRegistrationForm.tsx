import { useId, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";

import type { LangKey } from "../../../types/types";

export interface CourseRegistrationData {
  courseId: string;
  courseTitle: string;
  fullName: string;
  email: string;
  phone: string;
  acceptedPrivacy: boolean;
}

interface CourseRegistrationFormProps {
  courseId: string;
  courseTitle: string;
  onSubmit: (data: CourseRegistrationData) => void | Promise<void>;
}

const FORM_TEXT = {
  eyebrow: {
    ua: "Реєстрація на курс",
    de: "Kursanmeldung",
    en: "Course registration",
  },
  title: {
    ua: "Зробіть перший крок",
    de: "Machen Sie den ersten Schritt",
    en: "Take the first step",
  },
  description: {
    ua: "Залиште контактні дані — ми зв’яжемося з вами та розповімо про наступні кроки.",
    de: "Hinterlassen Sie Ihre Kontaktdaten – wir melden uns bei Ihnen und erklären die nächsten Schritte.",
    en: "Leave your contact details and we will contact you with the next steps.",
  },
  selectedCourse: {
    ua: "Обраний курс",
    de: "Ausgewählter Kurs",
    en: "Selected course",
  },
  fullName: {
    ua: "Ім’я та прізвище",
    de: "Vor- und Nachname",
    en: "Full name",
  },
  fullNamePlaceholder: {
    ua: "Наприклад, Олена Іваненко",
    de: "Zum Beispiel Anna Schmidt",
    en: "For example, Anna Smith",
  },
  email: { ua: "Email", de: "E-Mail", en: "Email" },
  emailPlaceholder: {
    ua: "name@example.com",
    de: "name@beispiel.de",
    en: "name@example.com",
  },
  phone: { ua: "Телефон", de: "Telefon", en: "Phone" },
  phonePlaceholder: {
    ua: "+49 123 4567890",
    de: "+49 123 4567890",
    en: "+49 123 4567890",
  },
  privacy: {
    ua: "Я погоджуюся на обробку моїх даних для зв’язку щодо цього курсу.",
    de: "Ich stimme der Verarbeitung meiner Daten zur Kontaktaufnahme bezüglich dieses Kurses zu.",
    en: "I agree to the processing of my data for contact regarding this course.",
  },
  privacyRequired: {
    ua: "Щоб надіслати заявку, підтвердьте згоду на обробку даних.",
    de: "Bitte stimmen Sie der Datenverarbeitung zu, um die Anmeldung zu senden.",
    en: "Please agree to data processing before sending the registration.",
  },
  submit: {
    ua: "Записатися на курс",
    de: "Zum Kurs anmelden",
    en: "Register for the course",
  },
  submitting: {
    ua: "Надсилаємо...",
    de: "Wird gesendet...",
    en: "Sending...",
  },
  successTitle: {
    ua: "Заявку надіслано",
    de: "Anmeldung gesendet",
    en: "Registration sent",
  },
  successText: {
    ua: "Дякуємо! Ми зв’яжемося з вами найближчим часом.",
    de: "Vielen Dank! Wir melden uns in Kürze bei Ihnen.",
    en: "Thank you! We will contact you shortly.",
  },
  submitError: {
    ua: "Не вдалося надіслати заявку. Спробуйте ще раз.",
    de: "Die Anmeldung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    en: "Registration could not be sent. Please try again.",
  },
};

export const CourseRegistrationForm = ({
  courseId,
  courseTitle,
  onSubmit,
}: CourseRegistrationFormProps) => {
  const { i18n } = useTranslation();
  const fieldId = useId();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [privacyError, setPrivacyError] = useState("");

  const detectedLanguage = (
    i18n.resolvedLanguage || i18n.language
  ).split("-")[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!acceptedPrivacy) {
      setPrivacyError(FORM_TEXT.privacyRequired[currentLang]);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setPrivacyError("");

    try {
      await onSubmit({
        courseId,
        courseTitle,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        acceptedPrivacy,
      });

      setIsSubmitted(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setAcceptedPrivacy(false);
    } catch (error) {
      console.error("Course registration error:", error);
      setSubmitError(FORM_TEXT.submitError[currentLang]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        role="status"
        className="font-nunito flex w-full flex-col items-center rounded-4xl border border-emerald-100 bg-emerald-50/70 px-6 py-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10"
      >
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
          <CheckCircle2 size={34} aria-hidden="true" />
        </div>

        <h3 className="text-2xl font-black text-slate-950">
          {FORM_TEXT.successTitle[currentLang]}
        </h3>
        <p className="mt-3 max-w-md leading-7 text-slate-700">
          {FORM_TEXT.successText[currentLang]}
        </p>
      </div>
    );
  }

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  return (
    <section
      aria-labelledby={`${fieldId}-title`}
      className="font-nunito relative w-full overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-8 lg:p-10"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-blue-600 via-blue-500 to-yellow-400"
      />

      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black tracking-[0.14em] text-blue-700 uppercase">
          <ShieldCheck size={16} aria-hidden="true" />
          {FORM_TEXT.eyebrow[currentLang]}
        </div>

        <h2
          id={`${fieldId}-title`}
          className="text-3xl leading-tight font-black text-slate-950 sm:text-4xl"
        >
          {FORM_TEXT.title[currentLang]}
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-slate-700">
          {FORM_TEXT.description[currentLang]}
        </p>
      </div>

      <div className="mb-7 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4">
        <span className="block text-xs font-black tracking-[0.14em] text-blue-700 uppercase">
          {FORM_TEXT.selectedCourse[currentLang]}
        </span>
        <span className="mt-1 block text-lg font-bold text-slate-950">
          {courseTitle}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor={`${fieldId}-name`}
            className="mb-2 block text-sm font-bold text-slate-800"
          >
            {FORM_TEXT.fullName[currentLang]}
          </label>
          <div className="relative">
            <User
              size={19}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
            />
            <input
              id={`${fieldId}-name`}
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              required
              minLength={2}
              placeholder={FORM_TEXT.fullNamePlaceholder[currentLang]}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor={`${fieldId}-email`}
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              {FORM_TEXT.email[currentLang]}
            </label>
            <div className="relative">
              <Mail
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
              />
              <input
                id={`${fieldId}-email`}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                inputMode="email"
                required
                placeholder={FORM_TEXT.emailPlaceholder[currentLang]}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={`${fieldId}-phone`}
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              {FORM_TEXT.phone[currentLang]}
            </label>
            <div className="relative">
              <Phone
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
              />
              <input
                id={`${fieldId}-phone`}
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                required
                minLength={6}
                placeholder={FORM_TEXT.phonePlaceholder[currentLang]}
                className={inputClassName}
              />
            </div>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(event) => {
              setAcceptedPrivacy(event.target.checked);
              if (event.target.checked) setPrivacyError("");
            }}
            aria-invalid={Boolean(privacyError)}
            aria-describedby={privacyError ? `${fieldId}-privacy-error` : undefined}
            className="mt-1 size-4 shrink-0 cursor-pointer accent-blue-600"
          />
          <span>{FORM_TEXT.privacy[currentLang]}</span>
        </label>

        {privacyError && (
          <p
            id={`${fieldId}-privacy-error`}
            role="alert"
            className="text-sm font-bold text-red-700"
          >
            {privacyError}
          </p>
        )}

        {submitError && (
          <p role="alert" className="text-sm font-bold text-red-700">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting || !acceptedPrivacy}
          className={`flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-base font-black text-white shadow-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${
            acceptedPrivacy
              ? "cursor-pointer hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
              : "cursor-not-allowed opacity-60"
          }`}
        >
          <Send size={19} aria-hidden="true" />
          {isSubmitting
            ? FORM_TEXT.submitting[currentLang]
            : FORM_TEXT.submit[currentLang]}
        </button>
      </form>
    </section>
  );
};
