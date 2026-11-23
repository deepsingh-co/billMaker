import { useState } from "react";
import { AlertCircle, ArrowRight, Loader2, Mail } from "lucide-react";
import AuthField from "../components/auth/AuthField";
import AuthLayout from "../components/auth/AuthLayout";
import PasswordField from "../components/auth/PasswordField";
import { useAuth } from "../components/auth/AuthProvider";
import { normalizeEmail, validateLoginForm } from "../lib/authValidation";
import { getErrorMessage } from "../lib/format";

const EMPTY_VALUES = { email: "", password: "", remember: true };

export default function Login({ onNavigate, onSuccess, next }) {
  const { login } = useAuth();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    const value =
      field === "remember" ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
    if (formError) setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const payload = {
      email: normalizeEmail(values.email),
      password: values.password,
    };
    const nextErrors = validateLoginForm(payload);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError("");
      return;
    }

    setErrors({});
    setFormError("");
    setSubmitting(true);

    try {
      await login({ ...payload, remember: values.remember });
      setSubmitting(false);
      onSuccess?.();
    } catch (error) {
      setSubmitting(false);
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      badge="Welcome back"
      title="Sign in to your workspace"
      subtitle="Open the dashboard, start a sale and review every bill from one secure account."
      onNavigate={onNavigate}
      footer={
        <>
          New to Barcode Suite?{" "}
          <button
            type="button"
            onClick={() => onNavigate("signup", { next })}
            className="cursor-pointer font-semibold text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
          >
            Create an account
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError ? (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <p className="min-w-0 flex-1">{formError}</p>
          </div>
        ) : null}

        <AuthField
          id="login-email"
          label="Email address"
          icon={Mail}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@store.com"
          value={values.email}
          onChange={handleChange("email")}
          error={errors.email}
        />

        <PasswordField
          id="login-password"
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange("password")}
          error={errors.password}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              name="remember"
              checked={values.remember}
              onChange={handleChange("remember")}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-brand-600 dark:border-slate-600 dark:bg-slate-950"
            />
            Keep me signed in
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            30-day session
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-brand-600 dark:hover:bg-brand-500"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          {submitting ? "Signing in…" : "Sign in"}
          {!submitting ? (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          ) : null}
        </button>
      </form>
    </AuthLayout>
  );
}
