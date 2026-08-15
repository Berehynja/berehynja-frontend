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

export const CourseRegistrationForm = ({
  courseId,
  courseTitle,
  onSubmit,
}: CourseRegistrationFormProps) => {
  const { t } = useTranslation();
  const fieldId = useId();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [privacyError, setPrivacyError] = useState("");


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!acceptedPrivacy) {
      setPrivacyError(t("courseRegistration.privacyRequired"));
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
      setSubmitError(t("courseRegistration.submitError"));
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
          {t("courseRegistration.successTitle")}
        </h3>
        <p className="mt-3 max-w-md leading-7 text-slate-700">
          {t("courseRegistration.successText")}
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
          {t("courseRegistration.eyebrow")}
        </div>

        <h2
          id={`${fieldId}-title`}
          className="text-3xl leading-tight font-black text-slate-950 sm:text-4xl"
        >
          {t("courseRegistration.title")}
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-slate-700">
          {t("courseRegistration.description")}
        </p>
      </div>

      <div className="mb-7 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4">
        <span className="block text-xs font-black tracking-[0.14em] text-blue-700 uppercase">
          {t("courseRegistration.selectedCourse")}
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
            {t("courseRegistration.fullName")}
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
              placeholder={t("courseRegistration.fullNamePlaceholder")}
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
              {t("courseRegistration.email")}
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
                placeholder={t("courseRegistration.emailPlaceholder")}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={`${fieldId}-phone`}
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              {t("courseRegistration.phone")}
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
                placeholder={t("courseRegistration.phonePlaceholder")}
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
          <span>{t("courseRegistration.privacy")}</span>
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
            ? t("courseRegistration.submitting")
            : t("courseRegistration.submit")}
        </button>
      </form>
    </section>
  );
};
