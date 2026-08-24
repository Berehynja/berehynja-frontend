import {
  CheckCircle2,
  CircleAlert,
  MessageSquare,
  Phone,
  Send,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useState,
  type FormEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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

export const JoinModal = ({ isOpen, onClose, onSubmit }: JoinModalProps) => {
  const { t } = useTranslation();
  const fieldId = useId();
  const titleId = `${fieldId}-title`;
  const privacyErrorId = `${fieldId}-privacy-error`;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isNameValid = fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormComplete = isNameValid && isEmailValid && acceptedPrivacy;
  const nameInvalid = showValidationErrors && !isNameValid;
  const emailInvalid = showValidationErrors && !isEmailValid;
  const privacyInvalid = showValidationErrors && !acceptedPrivacy;

  const resetForm = useCallback(() => {
    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setAcceptedPrivacy(false);
    setShowValidationErrors(false);
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

    if (!isFormComplete) {
      setShowValidationErrors(true);

      const firstInvalidFieldId = !isNameValid
        ? `${fieldId}-name`
        : !isEmailValid
          ? `${fieldId}-email`
          : `${fieldId}-privacy`;

      document.getElementById(firstInvalidFieldId)?.focus();
      return;
    }

    setIsSubmitting(true);
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
      aria-labelledby={titleId}
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
    >
      <div
        aria-hidden="true"
        className="animate-in fade-in absolute inset-0 bg-slate-950/65 backdrop-blur-sm duration-300"
        onMouseDown={handleClose}
      />

      <div className="animate-in zoom-in-95 font-nunito relative flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.3)] duration-300">
        <header className="flex shrink-0 items-center justify-between gap-4 bg-linear-to-br from-blue-600 to-blue-900 px-5 py-5 text-white md:px-8 md:py-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-yellow-300 shadow-inner backdrop-blur-md">
              <UserPlus size={25} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2
                id={titleId}
                className="truncate text-xl font-semibold tracking-tight text-white md:text-2xl"
              >
                {t("joinModal.title")}
              </h2>
              <p className="mt-1 text-sm leading-6 font-medium text-blue-100">
                {t("joinModal.subtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label={t("joinModal.close")}
            title={t("joinModal.close")}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/15 bg-black/10 text-white shadow-sm backdrop-blur-md transition hover:bg-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50/60 p-5 md:p-8">

        {!isSubmitted ? (
          <div className="text-left">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor={`${fieldId}-name`}
                  className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800 md:text-base"
                >
                  {t("joinModal.fullName").replace(/\s*\*+\s*$/, "")}
                  <RequiredIndicator label={t("joinModal.required")} />
                </label>

                {nameInvalid && (
                  <p
                    id={`${fieldId}-name-error`}
                    role="alert"
                    className="mb-2 text-sm font-semibold text-red-700"
                  >
                    {t("joinModal.fullNameRequired")}
                  </p>
                )}

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
                    aria-invalid={nameInvalid}
                    aria-describedby={
                      nameInvalid ? `${fieldId}-name-error` : undefined
                    }
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    autoComplete="name"
                    placeholder={t("joinModal.fullNamePlaceholder")}
                    className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-base text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 ${nameInvalid ? "border-red-400 focus:border-red-600 focus:ring-red-100" : ""}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${fieldId}-email`}
                    className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800 md:text-base"
                  >
                    {t("joinModal.email").replace(/\s*\*+\s*$/, "")}
                    <RequiredIndicator label={t("joinModal.required")} />
                  </label>
                  {showValidationErrors && (
                    <div className="mb-2 min-h-10">
                      {emailInvalid && (
                        <p
                          id={`${fieldId}-email-error`}
                          role="alert"
                          className="text-sm leading-5 font-semibold text-red-700"
                        >
                          {t("joinModal.emailInvalid")}
                        </p>
                      )}
                    </div>
                  )}
                  <input
                    id={`${fieldId}-email`}
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={emailInvalid}
                    aria-describedby={
                      emailInvalid ? `${fieldId}-email-error` : undefined
                    }
                    placeholder={t("joinModal.emailPlaceholder")}
                    className={`w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-base text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 ${emailInvalid ? "border-red-400 focus:border-red-600 focus:ring-red-100" : ""}`}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${fieldId}-phone`}
                    className="mb-2 block text-sm font-semibold text-slate-800 md:text-base"
                  >
                    {t("joinModal.phone")} {" "}
                    <span className="font-normal text-slate-500 lowercase">
                      {t("joinModal.optional")}
                    </span>
                  </label>

                  {showValidationErrors && (
                    <div aria-hidden="true" className="mb-2 min-h-10" />
                  )}

                  <div className="relative">
                    <Phone
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
                      size={18}
                    />
                    <input
                      id={`${fieldId}-phone`}
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder={t("joinModal.phonePlaceholder")}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-base text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`${fieldId}-message`}
                  className="mb-2 block text-sm font-semibold text-slate-800 md:text-base"
                >
                  {t("joinModal.message")}
                  <span className="ml-1 font-normal text-slate-500 lowercase">
                    {t("joinModal.optional")}
                  </span>
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
                    placeholder={t("joinModal.messagePlaceholder")}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-base text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm leading-6 font-medium text-slate-700 transition-colors md:text-base md:leading-7 ${
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
                  aria-describedby={privacyInvalid ? privacyErrorId : undefined}
                  className="size-4 shrink-0 cursor-pointer accent-blue-600"
                />
                <span>
                  {t("joinModal.privacyBefore")} {" "}
                  <Link
                    to="/privacy"
                    className="font-semibold text-blue-700 underline underline-offset-2 transition-colors hover:text-blue-800"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t("joinModal.privacyLink")}
                  </Link>
                  .
                </span>
              </label>

              {privacyInvalid && (
                <p
                  id={privacyErrorId}
                  role="alert"
                  className="text-sm leading-6 font-semibold text-red-700 md:text-base"
                >
                  {t("joinModal.privacyRequired")}
                </p>
              )}

              {submitError && (
                <p
                  role="alert"
                  className="text-sm leading-6 font-semibold text-red-700 md:text-base"
                >
                  {t("joinModal.submitError")}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting || !isFormComplete}
                aria-describedby={privacyInvalid ? privacyErrorId : undefined}
                className={`group flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-semibold shadow-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60 ${
                  isSubmitting
                    ? "cursor-wait bg-blue-600 text-white"
                    : isFormComplete
                      ? "cursor-pointer bg-blue-600 text-white hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                      : "cursor-pointer bg-slate-300 text-slate-600 hover:bg-slate-400"
                }`}
              >
                <span>
                  {isSubmitting
                    ? t("joinModal.submitting")
                    : t("joinModal.submit")}
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
          <div
            aria-live="polite"
            className="animate-in fade-in zoom-in py-10 text-center duration-500"
          >
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm ring-1 ring-emerald-100">
              <CheckCircle2 size={44} aria-hidden="true" />
            </div>
            <h3 className="mb-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {t("joinModal.successTitle")}
            </h3>
            <p className="mx-auto max-w-md text-base leading-7 font-medium text-slate-600 md:text-lg md:leading-8">
              {t("joinModal.successText")}
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

const RequiredIndicator = ({ label }: { label: string }) => (
  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-red-600">
    {label}
    <CircleAlert size={15} strokeWidth={2} aria-hidden="true" />
  </span>
);
