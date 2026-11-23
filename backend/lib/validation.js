const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

function normalizeName(value) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ")
    : "";
}

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function validateName(name) {
  if (!name) return "Enter your full name.";
  if (name.length < 2) return "Your name must be at least 2 characters.";
  if (name.length > 60) return "Your name must be 60 characters or fewer.";
  return null;
}

function validateEmail(email) {
  if (!email) return "Enter your email address.";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }
  return null;
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    return "Enter a password.";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}

function validateLoginInput({ email, password } = {}) {
  const errors = {};
  const emailError = validateEmail(normalizeEmail(email));
  if (emailError) errors.email = emailError;

  if (typeof password !== "string" || password.length === 0) {
    errors.password = "Enter your password.";
  }

  return errors;
}

function validateRegistrationInput({ name, email, password } = {}) {
  const errors = {};
  const nameError = validateName(normalizeName(name));
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(normalizeEmail(email));
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

module.exports = {
  EMAIL_PATTERN,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  normalizeName,
  normalizeEmail,
  validateName,
  validateEmail,
  validatePassword,
  validateLoginInput,
  validateRegistrationInput,
};
