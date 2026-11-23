export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export function normalizeName(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function validateName(value) {
  const name = normalizeName(value);
  if (!name) return "Enter your full name.";
  if (name.length < 2) return "Your name must be at least 2 characters.";
  if (name.length > 60) return "Your name must be 60 characters or fewer.";
  return null;
}

export function validateEmail(value) {
  const email = normalizeEmail(value);
  if (!email) return "Enter your email address.";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validatePassword(value) {
  if (typeof value !== "string" || value.length === 0) {
    return "Enter a password.";
  }
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  }
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}

export function validateLoginForm({ email, password }) {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (typeof password !== "string" || password.length === 0) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateSignupForm({
  name,
  email,
  password,
  confirmPassword,
}) {
  const errors = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  if (!confirmPassword) {
    errors.confirmPassword = "Re-enter your password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function getPasswordChecks(password = "") {
  return [
    {
      id: "length",
      label: `At least ${PASSWORD_MIN_LENGTH} characters`,
      met: password.length >= PASSWORD_MIN_LENGTH,
    },
    {
      id: "letter",
      label: "One letter",
      met: /[A-Za-z]/.test(password),
    },
    {
      id: "number",
      label: "One number",
      met: /[0-9]/.test(password),
    },
  ];
}

export function getInitials(name, email = "") {
  const source = (name || email || "").trim();
  if (!source) return "?";

  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}
