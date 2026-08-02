import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
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
  ua: {
    title: "Напишіть нам",
    description:
      "Маєте запитання або ідею? Залиште повідомлення, і ми зв’яжемося з вами.",
    name: "Повне ім’я",
    namePlaceholder: "Ваше ім’я та прізвище",
    email: "Електронна адреса",
    phone: "Телефон",
    optional: "необов’язково",
    message: "Ваше повідомлення",
    messagePlaceholder: "Напишіть ваше повідомлення...",
    required: "обов’язково",
    privacyBefore: "Я погоджуюся з обробкою моїх даних відповідно до",
    privacyLink: "Політики конфіденційності",
    privacyRequired:
      "Щоб надіслати повідомлення, підтвердьте згоду на обробку даних.",
    submit: "Відправити повідомлення",
    submitting: "Відправляємо...",
    submitError: "Не вдалося надіслати повідомлення. Спробуйте ще раз.",
    successTitle: "Повідомлення надіслано",
    successText: "Дякуємо! Ми зв’яжемося з вами найближчим часом.",
    sendAnother: "Надіслати ще одне",
  },
  de: {
    title: "Schreiben Sie uns",
    description:
      "Haben Sie eine Frage oder eine Idee? Hinterlassen Sie uns eine Nachricht und wir melden uns bei Ihnen.",
    name: "Vollständiger Name",
    namePlaceholder: "Ihr Vor- und Nachname",
    email: "E-Mail-Adresse",
    phone: "Telefon",
    optional: "optional",
    message: "Ihre Nachricht",
    messagePlaceholder: "Schreiben Sie Ihre Nachricht...",
    required: "erforderlich",
    privacyBefore: "Ich stimme der Verarbeitung meiner Daten gemäß der",
    privacyLink: "Datenschutzerklärung",
    privacyRequired:
      "Bitte stimmen Sie der Datenverarbeitung zu, um die Nachricht zu senden.",
    submit: "Nachricht senden",
    submitting: "Wird gesendet...",
    submitError:
      "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    successTitle: "Nachricht gesendet",
    successText: "Vielen Dank! Wir melden uns in Kürze bei Ihnen.",
    sendAnother: "Weitere Nachricht senden",
  },
  en: {
    title: "Write to us",
    description:
      "Have a question or an idea? Leave us a message and we will contact you.",
    name: "Full name",
    namePlaceholder: "Your full name",
    email: "Email address",
    phone: "Phone",
    optional: "optional",
    message: "Your message",
    messagePlaceholder: "Write your message...",
    required: "required",
    privacyBefore: "I agree to the processing of my data according to the",
    privacyLink: "Privacy Policy",
    privacyRequired:
      "Please agree to data processing before sending the message.",
    submit: "Send message",
    submitting: "Sending...",
    submitError: "The message could not be sent. Please try again.",
    successTitle: "Message sent",
    successText: "Thank you! We will contact you shortly.",
    sendAnother: "Send another message",
  },
} as const;

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

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toLowerCase();
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";
  const text = CONTACT_TEXT[currentLang];

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
    "w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 font-medium text-slate-950 shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  if (isSubmitted) {
    return (
      <section
        role="status"
        aria-labelledby={`${fieldId}-success-title`}
        className="font-nunito flex h-full w-full flex-col items-center justify-center rounded-4xl border border-emerald-100 bg-emerald-50/70 px-6 py-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:px-10"
      >
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
          <CheckCircle2 size={34} aria-hidden="true" />
        </div>

        <h2
          id={`${fieldId}-success-title`}
          className="text-preset-3 font-semibold tracking-tight text-slate-950"
        >
          {text.successTitle}
        </h2>
        <p className="mt-3 max-w-md text-slate-700">{text.successText}</p>

        <button
          type="button"
          onClick={resetForm}
          className="mt-7 cursor-pointer rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          {text.sendAnother}
        </button>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={`${fieldId}-title`}
      className="font-nunito relative h-full overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] md:p-10 lg:p-12"
    >
      <header className="mb-8">
        <h2
          id={`${fieldId}-title`}
          className="text-preset-3 font-semibold tracking-tight text-slate-950"
        >
          {text.title}
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">{text.description}</p>
      </header>

      <form
        name="contact_form"
        onSubmit={submitHandler}
        className="relative flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormFieldLabel
            htmlFor={`${fieldId}-name`}
            label={text.name}
            requiredLabel={text.required}
          >
            <User
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
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
              placeholder={text.namePlaceholder}
              className={inputClassName}
            />
          </FormFieldLabel>

          <FormFieldLabel
            htmlFor={`${fieldId}-email`}
            label={text.email}
            requiredLabel={text.required}
          >
            <Mail
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
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
          </FormFieldLabel>
        </div>

        <FormFieldLabel
          htmlFor={`${fieldId}-phone`}
          label={text.phone}
          optionalLabel={text.optional}
        >
          <Phone
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
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
        </FormFieldLabel>

        <div>
          <label
            htmlFor={`${fieldId}-message`}
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            {text.message}
            <span className="ml-1 text-xs text-blue-600">{text.required}</span>
          </label>
          <div className="relative">
            <MessageSquare
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-4 left-4 text-slate-400"
            />
            <textarea
              id={`${fieldId}-message`}
              name="message"
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              minLength={5}
              placeholder={text.messagePlaceholder}
              className="min-h-40 w-full resize-y rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 font-medium text-slate-950 shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        <label
          className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm leading-6 text-slate-700 transition ${
            privacyError
              ? "border-red-300 bg-red-50"
              : "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/50"
          }`}
        >
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(event) => {
              setAcceptedPrivacy(event.target.checked);
              if (event.target.checked) setPrivacyError(false);
            }}
            aria-invalid={privacyError}
            aria-describedby={
              privacyError ? `${fieldId}-privacy-error` : undefined
            }
            className="mt-1 size-4 shrink-0 cursor-pointer accent-blue-600"
          />
          <span>
            {text.privacyBefore}{" "}
            <Link
              to="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="font-semibold text-blue-700 underline transition hover:text-blue-800"
            >
              {text.privacyLink}
            </Link>
            .
          </span>
        </label>

        {privacyError && (
          <p
            id={`${fieldId}-privacy-error`}
            role="alert"
            className="text-sm font-semibold text-red-700"
          >
            {text.privacyRequired}
          </p>
        )}

        {submitError && (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {text.submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className={`group inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60 ${
            acceptedPrivacy
              ? "bg-blue-600 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
              : "bg-slate-600 hover:bg-slate-700"
          }`}
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          ) : (
            <Send
              size={20}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          )}
          {isSubmitting ? text.submitting : text.submit}
        </button>
      </form>
    </section>
  );
};

interface FormFieldLabelProps {
  htmlFor: string;
  label: string;
  requiredLabel?: string;
  optionalLabel?: string;
  children: ReactNode;
}

const FormFieldLabel = ({
  htmlFor,
  label,
  requiredLabel,
  optionalLabel,
  children,
}: FormFieldLabelProps) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-semibold text-slate-800"
    >
      {label}
      {requiredLabel && (
        <span className="ml-1 text-xs text-blue-600">{requiredLabel}</span>
      )}
      {optionalLabel && (
        <span className="ml-1 font-normal text-slate-500">
          ({optionalLabel})
        </span>
      )}
    </label>
    <div className="relative">{children}</div>
  </div>
);
