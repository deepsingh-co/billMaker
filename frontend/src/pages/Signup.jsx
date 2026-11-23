import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Mail,
  UserRound,
} from "lucide-react";
import AuthField from "../components/auth/AuthField";
import AuthLayout from "../components/auth/AuthLayout";
import PasswordChecklist from "../components/auth/PasswordChecklist";
import PasswordField from "../components/auth/PasswordField";
import { useAuth } from "../components/auth/AuthProvider";
import {
  getPasswordChecks,
  normalizeEmail,
  normalizeName,
  validateSignupForm,
} from "../lib/authValidation";
import { getErrorMessage } from "../lib/format";

const EMPTY_VALUES = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Signup({ onNavigate, onSuccess, next }) {
  const { register } = useAuth();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordChecks = getPasswordChecks(values.password);
  const showPasswordChecks =
    values.password.length > 0 || Boolean(errors.password);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[field];
      if (field === "password") delete nextErrors.confirmPassword;
      return nextErrors;
    });
    if (formError) setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const payload = {
      name: normalizeName(values.name),
      email: normalizeEmail(values.email),
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    const nextErrors = validateSignupForm(payload);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError("");
      return;
    }

    setErrors({});
    setFormError("");
    setSubmitting(true);

    try {
      await register({
        name: payload.name,
        email: payload.email,
        password: payload.password,
      });
      setSubmitting(false);
      onSuccess?.();
    } catch (error) {
      setSubmitting(false);
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      badge="Get started"
      title="Create your store account"
      subtitle="One account unlocks the dashboard, barcode checkout and full transaction history."
      onNavigate={onNavigate}
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate("login", { next })}
            className="cursor-pointer font-semibold text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
          >
            Sign in
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
          id="signup-name"
          label="Full name"
          icon={UserRound}
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={values.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <AuthField
          id="signup-email"
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

        <div>
          <PasswordField
            id="signup-password"
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            onChange={handleChange("password")}
            error={errors.password}
          />
          {showPasswordChecks ? (
            <PasswordChecklist checks={passwordChecks} />
          ) : null}
        </div>

        <PasswordField
          id="signup-confirm-password"
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-brand-600 dark:hover:bg-brand-500"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          {submitting ? "Creating account…" : "Create account"}
          {!submitting ? (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          ) : null}
        </button>

        <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Your password is hashed with bcrypt and never stored in plain text.
        </p>
      </form>
    </AuthLayout>
  );
}
