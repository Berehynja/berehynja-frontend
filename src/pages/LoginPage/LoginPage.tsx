import { useEffect, useId, useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { auth } from "../../firebase";
import { useAuth } from "../../components/AuthProvider/useAuth";

export default function AdminLogin() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, navigate]);

  const getLoginErrorMessage = (error: unknown): string => {
    if (!(error instanceof FirebaseError)) {
      return t("adminLogin.errors.default");
    }

    switch (error.code) {
      case "auth/invalid-email":
        return t("adminLogin.errors.invalidEmail");
      case "auth/too-many-requests":
        return t("adminLogin.errors.tooManyRequests");
      case "auth/network-request-failed":
        return t("adminLogin.errors.network");
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return t("adminLogin.errors.invalidCredentials");
      default:
        return t("adminLogin.errors.default");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      const message = t("adminLogin.errors.required");
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      toast.success(t("adminLogin.success"));
      navigate("/", { replace: true });
    } catch (error: unknown) {
      const message = getLoginErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="font-nunito relative flex min-h-[calc(100svh-8rem)] w-full items-center justify-center overflow-hidden px-3 py-10 md:px-6 md:py-16">
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 size-80 rounded-full bg-blue-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 -bottom-32 size-80 rounded-full bg-yellow-400/15 blur-3xl"
      />

      <section className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-[#0a192f] p-10 text-white md:flex md:flex-col md:justify-between">
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 size-56 rounded-full bg-blue-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-20 size-56 rounded-full bg-yellow-400/15 blur-3xl"
          />

          <div className="relative">
            <div className="mb-8 h-12 w-12 rounded-2xl bg-linear-to-br from-blue-500 to-yellow-400 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0a192f]">
                <span className="text-2xl font-semibold italic">B</span>
              </div>
            </div>

            <p className="text-sm font-bold tracking-[0.18em] text-blue-200 uppercase">
              Berehynja
            </p>
            <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight">
              {t("adminLogin.panelTitle")}
            </h1>
            <p className="mt-5 text-base leading-7 font-medium text-slate-300">
              {t("adminLogin.panelDescription")}
            </p>
          </div>

          <div className="relative mt-12 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <ShieldCheck
              size={21}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-yellow-300"
            />
            <p className="text-sm leading-6 font-medium text-slate-300">
              {t("adminLogin.securityNote")}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 md:hidden">
                <LockKeyhole size={21} aria-hidden="true" />
              </div>

              <p className="text-sm font-bold tracking-[0.14em] text-blue-600 uppercase">
                {t("adminLogin.eyebrow")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {t("adminLogin.title")}
              </h2>
              <p className="mt-3 max-w-md text-base leading-7 font-medium text-slate-600">
                {t("adminLogin.description")}
              </p>
            </div>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor={emailId}
                className="mb-2 block text-base font-semibold text-slate-800"
              >
                {t("adminLogin.email")}
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  id={emailId}
                  type="email"
                  inputMode="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder={t("adminLogin.emailPlaceholder")}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errorMessage)}
                  className="h-13 w-full rounded-xl border border-slate-300 bg-white pr-4 pl-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={passwordId}
                className="mb-2 block text-base font-semibold text-slate-800"
              >
                {t("adminLogin.password")}
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder={t("adminLogin.passwordPlaceholder")}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? "admin-login-error" : undefined}
                  className="h-13 w-full rounded-xl border border-slate-300 bg-white pr-12 pl-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={isSubmitting}
                  aria-label={
                    showPassword
                      ? t("adminLogin.hidePassword")
                      : t("adminLogin.showPassword")
                  }
                  className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff size={19} aria-hidden="true" />
                  ) : (
                    <Eye size={19} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p
                id="admin-login-error"
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 font-semibold text-red-700"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl active:translate-y-0 disabled:cursor-wait disabled:translate-y-0 disabled:bg-slate-400 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} aria-hidden="true" className="animate-spin" />
                  <span>{t("adminLogin.submitting")}</span>
                </>
              ) : (
                <>
                  <LockKeyhole size={19} aria-hidden="true" />
                  <span>{t("adminLogin.submit")}</span>
                </>
              )}
            </button>
          </form>

          <Link
            to="/"
            className="mt-7 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            {t("adminLogin.backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}
