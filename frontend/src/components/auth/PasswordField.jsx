import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import AuthField from "./AuthField";

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  autoComplete,
  placeholder,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField
      id={id}
      label={label}
      icon={Lock}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      error={error}
      hint={hint}
      autoComplete={autoComplete}
      placeholder={placeholder}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
          className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      }
    />
  );
}
