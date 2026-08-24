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

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const { t } = useTranslation();
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
          {t("contact.form.successTitle")}
        </h2>
        <p className="mt-3 max-w-md text-slate-700">{t("contact.form.successText")}</p>

        <button
          type="button"
          onClick={resetForm}
          className="mt-7 cursor-pointer rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          {t("contact.form.sendAnother")}
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
          {t("contact.form.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">{t("contact.form.description")}</p>
      </header>

      <form
        name="contact_form"
        onSubmit={submitHandler}
        className="relative flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormFieldLabel
            htmlFor={`${fieldId}-name`}
            label={t("contact.form.name")}
            requiredLabel={t("contact.form.required")}
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
              placeholder={t("contact.form.namePlaceholder")}
              className={inputClassName}
            />
          </FormFieldLabel>

          <FormFieldLabel
            htmlFor={`${fieldId}-email`}
            label={t("contact.form.email")}
            requiredLabel={t("contact.form.required")}
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
              placeholder={t("contact.form.emailPlaceholder")}
              className={inputClassName}
            />
          </FormFieldLabel>
        </div>

        <FormFieldLabel
          htmlFor={`${fieldId}-phone`}
          label={t("contact.form.phone")}
          optionalLabel={t("contact.form.optional")}
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
            placeholder={t("contact.form.phonePlaceholder")}
            className={inputClassName}
          />
        </FormFieldLabel>

        <div>
          <label
            htmlFor={`${fieldId}-message`}
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            {t("contact.form.message")}
            <span className="ml-1 text-xs text-blue-600">{t("contact.form.required")}</span>
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
              placeholder={t("contact.form.messagePlaceholder")}
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
            {t("contact.form.privacyBefore")}{" "}
            <Link
              to="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="font-semibold text-blue-700 underline transition hover:text-blue-800"
            >
              {t("contact.form.privacyLink")}
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
            {t("contact.form.privacyRequired")}
          </p>
        )}

        {submitError && (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {t("contact.form.submitError")}
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
          {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
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
