import {
  CheckCircle2,
  CircleAlert,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TurnstileWidget } from "./../../TurnstileWidget/TurnstileWidget";

export interface CourseRegistrationData {
  courseId: string;
  courseTitle: string;
  courseIsActive: boolean;
  fullName: string;
  email: string;
  phone: string;
  acceptedPrivacy: boolean;
  submittedAt: string;
  timezone: string;
  formName: string;
  turnstileToken: string;
}

interface CourseRegistrationFormProps {
  courseId: string;
  courseTitle: string;
  courseIsActive: boolean;
  onSubmit?: (data: CourseRegistrationData) => void | Promise<void>;
}

interface RequiredIndicatorProps {
  label: string;
}

const RequiredIndicator = ({ label }: RequiredIndicatorProps) => (
  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-red-600">
    {label}
    <CircleAlert size={15} strokeWidth={2} aria-hidden="true" />
  </span>
);

export const CourseRegistrationForm = ({
  courseId,
  courseTitle,
  courseIsActive,
  onSubmit,
}: CourseRegistrationFormProps) => {
  const { t, i18n } = useTranslation();
  const fieldId = useId();
  const titleId = `${fieldId}-title`;
  const nameErrorId = `${fieldId}-name-error`;
  const emailErrorId = `${fieldId}-email-error`;
  const phoneErrorId = `${fieldId}-phone-error`;
  const privacyErrorId = `${fieldId}-privacy-error`;
  const requiredLabel = t("common.editTextModal.required");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileVersion, setTurnstileVersion] = useState(0);

  const isNameValid = fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = phone.replace(/\D/g, "").length >= 6;
  const isFormFieldsComplete =
    isNameValid && isEmailValid && isPhoneValid && acceptedPrivacy;
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
  const phoneInvalid = showValidationErrors && !isPhoneValid;
  const privacyInvalid = showValidationErrors && !acceptedPrivacy;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
          : !isPhoneValid
            ? `${fieldId}-phone`
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
      const formData: CourseRegistrationData = {
        courseId,
        courseTitle,
        courseIsActive,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        acceptedPrivacy,
        submittedAt: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        formName: "course_registration",
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
        throw new Error(
          `Course registration error: ${response.status}`,
        );
      }

      await onSubmit?.(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Course registration error:", error);
      setSubmitError(true);
      setTurnstileToken("");
      setTurnstileVersion((value) => value + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-base text-slate-950 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 md:py-3.5 md:pl-12";

  if (isSubmitted) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="font-nunito w-full overflow-hidden rounded-4xl border border-emerald-100 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.24)]"
      >
        <div className="bg-linear-to-br from-emerald-500 to-emerald-700 px-6 py-8 text-center text-white md:px-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25">
            <CheckCircle2 size={34} aria-hidden="true" />
          </div>
        </div>
        <div className="px-6 py-10 text-center md:px-10 md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            {t("courseRegistration.successTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 font-medium text-slate-600 md:text-lg md:leading-8">
            {t("courseRegistration.successText")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={titleId}
      className="font-nunito w-full overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.3)]"
    >
      <header className="bg-linear-to-br from-blue-600 to-blue-900 px-5 py-4 pr-16 text-white md:px-8 md:py-6 md:pr-20">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.14em] text-blue-100 uppercase md:text-xs">
            {t("courseRegistration.eyebrow")}
          </p>

          <div className="mt-1 flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-yellow-300 shadow-inner ring-1 ring-white/15 backdrop-blur-md md:size-12 md:rounded-2xl">
              <ShieldCheck size={23} aria-hidden="true" />
            </div>

            <h2
              id={titleId}
              className="min-w-0 text-xl leading-tight font-semibold tracking-tight text-white md:text-3xl"
            >
              {t("courseRegistration.title")}
            </h2>
          </div>

          <p className="mt-2 max-w-xl text-sm leading-5 font-medium text-blue-100 md:text-base md:leading-7">
            {t("courseRegistration.description")}
          </p>
        </div>

        <div className="mt-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm md:mt-4 md:py-3">
          <span className="block text-[11px] font-bold tracking-[0.12em] text-blue-100 uppercase">
            {t("courseRegistration.selectedCourse")}
          </span>
          <span className="mt-1 block text-base leading-6 font-semibold wrap-break-word text-white md:text-lg">
            {courseTitle}
          </span>
        </div>
      </header>

      <div className="bg-slate-50/60 p-4 md:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-4 md:space-y-5">
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <label
                htmlFor={`${fieldId}-name`}
                className="text-sm font-semibold text-slate-800 md:text-base"
              >
                {t("courseRegistration.fullName")}
              </label>
              <RequiredIndicator label={requiredLabel} />
            </div>
            {nameInvalid && (
              <p
                id={nameErrorId}
                role="alert"
                className="mb-2 text-sm font-semibold text-red-700"
              >
                {t("courseRegistration.fullNameRequired", {
                  defaultValue: "Вкажіть ім’я та прізвище.",
                })}
              </p>
            )}
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
                aria-invalid={nameInvalid}
                aria-describedby={nameInvalid ? nameErrorId : undefined}
                placeholder={t("courseRegistration.fullNamePlaceholder")}
                className={`${inputClassName} ${nameInvalid ? "border-red-400 focus:border-red-600 focus:ring-red-100" : ""}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <label
                  htmlFor={`${fieldId}-email`}
                  className="text-sm font-semibold text-slate-800 md:text-base"
                >
                  {t("courseRegistration.email")}
                </label>
                <RequiredIndicator label={requiredLabel} />
              </div>
              {emailInvalid && (
                <p
                  id={emailErrorId}
                  role="alert"
                  className="mb-2 text-sm font-semibold text-red-700"
                >
                  {t("courseRegistration.emailInvalid", {
                    defaultValue: "Вкажіть коректну електронну адресу.",
                  })}
                </p>
              )}
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
                  aria-invalid={emailInvalid}
                  aria-describedby={emailInvalid ? emailErrorId : undefined}
                  placeholder={t("courseRegistration.emailPlaceholder")}
                  className={`${inputClassName} ${emailInvalid ? "border-red-400 focus:border-red-600 focus:ring-red-100" : ""}`}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <label
                  htmlFor={`${fieldId}-phone`}
                  className="text-sm font-semibold text-slate-800 md:text-base"
                >
                  {t("courseRegistration.phone")}
                </label>
                <RequiredIndicator label={requiredLabel} />
              </div>
              {phoneInvalid && (
                <p
                  id={phoneErrorId}
                  role="alert"
                  className="mb-2 text-sm font-semibold text-red-700"
                >
                  {t("courseRegistration.phoneInvalid", {
                    defaultValue: "Вкажіть коректний номер телефону.",
                  })}
                </p>
              )}
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
                  aria-invalid={phoneInvalid}
                  aria-describedby={phoneInvalid ? phoneErrorId : undefined}
                  placeholder={t("courseRegistration.phonePlaceholder")}
                  className={`${inputClassName} ${phoneInvalid ? "border-red-400 focus:border-red-600 focus:ring-red-100" : ""}`}
                />
              </div>
            </div>
          </div>

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm leading-6 font-medium transition-colors md:p-4 md:text-base md:leading-7 ${
              privacyInvalid
                ? "border-red-300 bg-red-50 text-red-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
            }`}
          >
            <input
              type="checkbox"
              id={`${fieldId}-privacy`}
              checked={acceptedPrivacy}
              onChange={(event) => {
                setAcceptedPrivacy(event.target.checked);
              }}
              aria-invalid={privacyInvalid}
              aria-describedby={privacyInvalid ? privacyErrorId : undefined}
              className="size-4 shrink-0 cursor-pointer accent-blue-600"
            />
            <span>
              <span className="block">{t("courseRegistration.privacy")}</span>
              <Link
                to="/privacy"
                onClick={(event) => event.stopPropagation()}
                className="mt-1 inline-flex font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                {t("privacy.title")}
              </Link>
            </span>
          </label>

          {privacyInvalid && (
            <p
              id={privacyErrorId}
              role="alert"
              className="text-sm leading-6 font-semibold text-red-700 md:text-base"
            >
              {t("courseRegistration.privacyRequired")}
            </p>
          )}

          {submitError && (
            <p
              role="alert"
              className="text-sm leading-6 font-semibold text-red-700 md:text-base"
            >
              {t("courseRegistration.submitError")}
            </p>
          )}

          {rateLimitError && (
            <p
              role="alert"
              className="text-sm leading-6 font-semibold text-red-700 md:text-base"
            >
              {rateLimitMessage}
            </p>
          )}

          <TurnstileWidget
            key={turnstileVersion}
            action="course_registration"
            onVerify={setTurnstileToken}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting || !isFormComplete}
            aria-describedby={privacyInvalid ? privacyErrorId : undefined}
            className={`group flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-3.5 text-base font-semibold shadow-lg transition-[color,background-color,box-shadow,transform] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60 md:py-4 ${
              isSubmitting
                ? "cursor-wait bg-blue-600 text-white"
                : isFormComplete
                  ? "cursor-pointer bg-blue-600 text-white hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                  : "cursor-pointer bg-slate-300 text-slate-600 hover:bg-slate-400"
            }`}
          >
            <span>
              {isSubmitting
                ? t("courseRegistration.submitting")
                : t("courseRegistration.submit")}
            </span>
            <Send
              size={19}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5"
            />
          </button>
        </form>
      </div>
    </section>
  );
};
