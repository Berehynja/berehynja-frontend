import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TurnstileWidget } from "./../TurnstileWidget/TurnstileWidget";
import {
  CheckCircle2,
  CircleAlert,
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
  timezone: string;
  formName: string;
  turnstileToken: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
}

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const { t, i18n } = useTranslation();
  const fieldId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileVersion, setTurnstileVersion] = useState(0);

  const isNameValid = name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isMessageValid = message.trim().length >= 5;
  const isFormFieldsComplete =
    isNameValid && isEmailValid && isMessageValid && acceptedPrivacy;
  const isTurnstileValid = turnstileToken.trim().length > 0;
  const isFormComplete = isFormFieldsComplete && isTurnstileValid;
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language ?? "uk")
    .toLowerCase()
    .split(/[-_]/)[0];
  const rateLimitMessage =
    currentLanguage === "de"
      ? "Das Sendelimit wurde überschritten. Bitte warten Sie 5 Minuten und versuchen Sie es erneut."
      : currentLanguage === "en"
        ? "Submission limit exceeded. Please wait 5 minutes and try again."
        : "Ліміт відправлень перевищено. Зачекайте 5 хвилин і спробуйте ще раз.";

  const nameInvalid = showValidationErrors && !isNameValid;
  const emailInvalid = showValidationErrors && !isEmailValid;
  const messageInvalid = showValidationErrors && !isMessageValid;
  const privacyInvalid = showValidationErrors && !acceptedPrivacy;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setAcceptedPrivacy(false);
    setShowValidationErrors(false);
    setSubmitError(false);
    setRateLimitError(false);
    setIsSubmitted(false);
    setTurnstileToken("");
    setTurnstileVersion((value) => value + 1);
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setSubmitError(false);
    setRateLimitError(false);

    if (!isFormFieldsComplete) {
      setShowValidationErrors(true);

      const firstInvalidFieldId = !isNameValid
        ? `${fieldId}-name`
        : !isEmailValid
          ? `${fieldId}-email`
          : !isMessageValid
            ? `${fieldId}-message`
            : `${fieldId}-privacy`;

      document.getElementById(firstInvalidFieldId)?.focus();
      return;
    }

    if (!isTurnstileValid) {
      setSubmitError(true);
      setTurnstileVersion((value) => value + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(false);
    setRateLimitError(false);

    try {
      const formData: ContactFormData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        acceptedPrivacy,
        submittedAt: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        formName: "contact_form",
        turnstileToken,
      };

      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 429) {
        setRateLimitError(true);
        setTurnstileToken("");
        setTurnstileVersion((value) => value + 1);
        return;
      }

      if (!response.ok) {
        throw new Error(`Form submission error: ${response.status}`);
      }

      await onSubmit?.(formData);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitError(true);

      setTurnstileToken("");
      setTurnstileVersion((value) => value + 1);
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
        noValidate
        className="relative flex flex-col gap-4 md:gap-5"
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <FormFieldLabel
            htmlFor={`${fieldId}-name`}
            label={t("contact.form.name")}
            requiredLabel={t("contact.form.required")}
            error={nameInvalid ? t("contact.form.nameRequired") : undefined}
            errorId={`${fieldId}-name-error`}
            reserveErrorSpace={showValidationErrors}
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
              aria-invalid={nameInvalid}
              aria-describedby={nameInvalid ? `${fieldId}-name-error` : undefined}
              placeholder={t("contact.form.namePlaceholder")}
              className={`${inputClassName} ${
                nameInvalid ? "border-red-400 focus:border-red-600 focus:ring-red-100" : ""
              }`}
            />
          </FormFieldLabel>

          <FormFieldLabel
            htmlFor={`${fieldId}-email`}
            label={t("contact.form.email")}
            requiredLabel={t("contact.form.required")}
            error={emailInvalid ? t("contact.form.emailInvalid") : undefined}
            errorId={`${fieldId}-email-error`}
            reserveErrorSpace={showValidationErrors}
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
              aria-invalid={emailInvalid}
              aria-describedby={emailInvalid ? `${fieldId}-email-error` : undefined}
              placeholder={t("contact.form.emailPlaceholder")}
              className={`${inputClassName} ${
                emailInvalid ? "border-red-400 focus:border-red-600 focus:ring-red-100" : ""
              }`}
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
            className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800"
          >
            {t("contact.form.message")}
            <RequiredIndicator label={t("contact.form.required")} />
          </label>

          {messageInvalid && (
            <p
              id={`${fieldId}-message-error`}
              role="alert"
              className="mb-2 text-sm font-semibold text-red-700"
            >
              {t("contact.form.messageRequired")}
            </p>
          )}

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
              aria-invalid={messageInvalid}
              aria-describedby={messageInvalid ? `${fieldId}-message-error` : undefined}
              placeholder={t("contact.form.messagePlaceholder")}
              className={`min-h-40 w-full resize-y rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 font-medium text-slate-950 shadow-sm transition outline-none placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
                messageInvalid ? "border-red-400 focus:border-red-600 focus:ring-red-100" : ""
              }`}
            />
          </div>
        </div>

        <label
          className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm leading-6 text-slate-700 transition ${
            privacyInvalid
              ? "border-red-300 bg-red-50"
              : "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/50"
          }`}
        >
          <input
            id={`${fieldId}-privacy`}
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(event) => {
              setAcceptedPrivacy(event.target.checked);
            }}
            aria-invalid={privacyInvalid}
            aria-describedby={privacyInvalid ? `${fieldId}-privacy-error` : undefined}
            className="size-4 shrink-0 cursor-pointer accent-blue-600"
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

        {privacyInvalid && (
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
        {rateLimitError && (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {rateLimitMessage}
          </p>
        )}
        <TurnstileWidget
          key={turnstileVersion}
          action="contact_form"
          onVerify={setTurnstileToken}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting || !isFormComplete}
          className={`group inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-semibold shadow-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60 ${
            isSubmitting
              ? "cursor-wait bg-blue-600 text-white"
              : isFormComplete
                ? "cursor-pointer bg-blue-600 text-white hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                : "cursor-pointer bg-slate-300 text-slate-600 hover:bg-slate-400"
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
  error?: string;
  errorId?: string;
  reserveErrorSpace?: boolean;
  children: ReactNode;
}

const FormFieldLabel = ({
  htmlFor,
  label,
  requiredLabel,
  optionalLabel,
  error,
  errorId,
  reserveErrorSpace = false,
  children,
}: FormFieldLabelProps) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800"
    >
      {label}

      {requiredLabel && <RequiredIndicator label={requiredLabel} />}

      {optionalLabel && <span className="ml-1 font-normal text-slate-500">({optionalLabel})</span>}
    </label>

    {reserveErrorSpace ? (
      <div className="mb-2 min-h-10">
        {error && (
          <p id={errorId} role="alert" className="text-sm leading-5 font-semibold text-red-700">
            {error}
          </p>
        )}
      </div>
    ) : (
      error && (
        <p id={errorId} role="alert" className="mb-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      )
    )}

    <div className="relative">{children}</div>
  </div>
);

const RequiredIndicator = ({ label }: { label: string }) => (
  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-red-600">
    {label}
    <CircleAlert size={15} strokeWidth={2} aria-hidden="true" />
  </span>
);
