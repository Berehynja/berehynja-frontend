import { useId, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";

import type { LangKey } from "../../types/types";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  acceptedPrivacy: boolean;
  submittedAt: string;
  source: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
}

const CONTACT_TEXT = {
  eyebrow: {
    ua: "Зв’язатися з нами",
    de: "Kontaktieren Sie uns",
    en: "Contact us",
  },
  title: { ua: "Напишіть нам", de: "Schreiben Sie uns", en: "Write to us" },
  description: {
    ua: "Маєте запитання або ідею? Залиште повідомлення, і ми зв’яжемося з вами.",
    de: "Haben Sie eine Frage oder eine Idee? Hinterlassen Sie uns eine Nachricht und wir melden uns bei Ihnen.",
    en: "Have a question or an idea? Leave us a message and we will contact you.",
  },
  name: { ua: "Повне ім’я *", de: "Vollständiger Name *", en: "Full name *" },
  namePlaceholder: {
    ua: "Ваше ім’я та прізвище",
    de: "Ihr Vor- und Nachname",
    en: "Your full name",
  },
  email: {
    ua: "Електронна адреса *",
    de: "E-Mail-Adresse *",
    en: "Email address *",
  },
  phone: { ua: "Телефон", de: "Telefon", en: "Phone" },
  optional: { ua: "(необов’язково)", de: "(optional)", en: "(optional)" },
  message: {
    ua: "Ваше повідомлення *",
    de: "Ihre Nachricht *",
    en: "Your message *",
  },
  messagePlaceholder: {
    ua: "Напишіть ваше повідомлення...",
    de: "Schreiben Sie Ihre Nachricht...",
    en: "Write your message...",
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
    ua: "Щоб надіслати повідомлення, підтвердьте згоду на обробку даних.",
    de: "Bitte stimmen Sie der Datenverarbeitung zu, um die Nachricht zu senden.",
    en: "Please agree to data processing before sending the message.",
  },
  submit: {
    ua: "Відправити повідомлення",
    de: "Nachricht senden",
    en: "Send message",
  },
  submitting: {
    ua: "Відправляємо...",
    de: "Wird gesendet...",
    en: "Sending...",
  },
  submitError: {
    ua: "Не вдалося надіслати повідомлення. Спробуйте ще раз.",
    de: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    en: "The message could not be sent. Please try again.",
  },
  successTitle: {
    ua: "Повідомлення надіслано",
    de: "Nachricht gesendet",
    en: "Message sent",
  },
  successText: {
    ua: "Дякуємо! Ми зв’яжемося з вами найближчим часом.",
    de: "Vielen Dank! Wir melden uns in Kürze bei Ihnen.",
    en: "Thank you! We will contact you shortly.",
  },
  sendAnother: {
    ua: "Надіслати ще одне",
    de: "Weitere Nachricht senden",
    en: "Send another message",
  },
};

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const { i18n } = useTranslation();
  const fieldId = useId();
  const [name, setName] = useState("");
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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setAcceptedPrivacy(false);
    setPrivacyError(false);
    setSubmitError(false);
    setIsSubmitted(false);
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
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
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        acceptedPrivacy,
        submittedAt: new Date().toISOString(),
        source: "Berehynja Website",
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 font-semibold text-slate-950 shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  if (isSubmitted) {
    return (
      <div
        role="status"
        className="font-nunito flex w-full flex-col items-center rounded-4xl border border-emerald-100 bg-emerald-50/70 px-6 py-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:px-10"
      >
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
          <CheckCircle2 size={34} aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-black text-slate-950">
          {CONTACT_TEXT.successTitle[currentLang]}
        </h2>
        <p className="mt-3 max-w-md leading-7 text-slate-700">
          {CONTACT_TEXT.successText[currentLang]}
        </p>

        <button
          type="button"
          onClick={resetForm}
          className="mt-7 cursor-pointer rounded-2xl border border-emerald-200 bg-white px-6 py-3 font-bold text-emerald-700 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
        >
          {CONTACT_TEXT.sendAnother[currentLang]}
        </button>
      </div>
    );
  }

  return (
    <section
      aria-labelledby={`${fieldId}-title`}
      className="font-nunito relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] md:p-10 lg:p-12"
    >
      <header className="mb-9">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black tracking-[0.14em] text-blue-700 uppercase">
          <MessageSquare size={16} aria-hidden="true" />
          {CONTACT_TEXT.eyebrow[currentLang]}
        </div>

        <h2
          id={`${fieldId}-title`}
              className="text-3xl leading-tight font-black text-slate-950 md:text-4xl"
        >
          {CONTACT_TEXT.title[currentLang]}
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-700">
          {CONTACT_TEXT.description[currentLang]}
        </p>
      </header>

      <form className="relative flex flex-col gap-6" name="contact_form" onSubmit={submitHandler}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor={`${fieldId}-name`}
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              {CONTACT_TEXT.name[currentLang]}
            </label>
            <div className="relative">
              <User
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
              />
              <input
                id={`${fieldId}-name`}
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                minLength={2}
                placeholder={CONTACT_TEXT.namePlaceholder[currentLang]}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={`${fieldId}-email`}
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              {CONTACT_TEXT.email[currentLang]}
            </label>
            <div className="relative">
              <Mail
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
              />
              <input
                id={`${fieldId}-email`}
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                inputMode="email"
                required
                placeholder="your@email.com"
                className={inputClassName}
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor={`${fieldId}-phone`}
            className="mb-2 block text-sm font-bold text-slate-800"
          >
            {CONTACT_TEXT.phone[currentLang]}{" "}
            <span className="font-normal text-slate-500">
              {CONTACT_TEXT.optional[currentLang]}
            </span>
          </label>
          <div className="relative">
            <Phone
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
            />
            <input
              id={`${fieldId}-phone`}
              type="tel"
              name="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              inputMode="tel"
              placeholder="+49..."
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`${fieldId}-message`}
            className="mb-2 block text-sm font-bold text-slate-800"
          >
            {CONTACT_TEXT.message[currentLang]}
          </label>
          <div className="relative">
            <MessageSquare
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-4 left-4 text-slate-500"
            />
            <textarea
              id={`${fieldId}-message`}
              name="message"
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              minLength={5}
              placeholder={CONTACT_TEXT.messagePlaceholder[currentLang]}
              className="min-h-40 w-full resize-none rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 font-semibold text-slate-950 shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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
            aria-invalid={privacyError}
            aria-describedby={privacyError ? `${fieldId}-privacy-error` : undefined}
            className="mt-1 size-4 shrink-0 cursor-pointer accent-blue-600"
          />
          <span>
            {CONTACT_TEXT.privacyBefore[currentLang]}{" "}
            <Link
              to="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline transition-colors hover:text-blue-600"
              onClick={(event) => event.stopPropagation()}
            >
              {CONTACT_TEXT.privacyLink[currentLang]}
            </Link>
            .
          </span>
        </label>

        {privacyError && (
          <p
            id={`${fieldId}-privacy-error`}
            role="alert"
            className="text-sm font-bold text-red-700"
          >
            {CONTACT_TEXT.privacyRequired[currentLang]}
          </p>
        )}

        {submitError && (
          <p role="alert" className="text-sm font-bold text-red-700">
            {CONTACT_TEXT.submitError[currentLang]}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting || !acceptedPrivacy}
          className={`group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-950 px-6 py-4 text-base font-black text-white shadow-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${
            acceptedPrivacy
              ? "cursor-pointer hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
              : "cursor-not-allowed opacity-60"
          }`}
        >
          <span className="relative z-10">
            {isSubmitting
              ? CONTACT_TEXT.submitting[currentLang]
              : CONTACT_TEXT.submit[currentLang]}
          </span>
          <Send
            size={20}
            aria-hidden="true"
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
          />
        </button>
      </form>
    </section>
  );
};
