const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeName,
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
  validateLoginInput,
  validateRegistrationInput,
} = require("./validation");

test("normalizes names and emails", () => {
  assert.equal(normalizeName("  Ada   Lovelace  "), "Ada Lovelace");
  assert.equal(normalizeEmail("  ADA@Example.COM "), "ada@example.com");
});

test("accepts a valid registration payload", () => {
  const errors = validateRegistrationInput({
    name: "Ada Lovelace",
    email: "ada@example.com",
    password: "counter2026",
  });
  assert.deepEqual(errors, {});
});

test("rejects short names and malformed emails", () => {
  assert.equal(validateName("A"), "Your name must be at least 2 characters.");
  assert.equal(validateEmail("not-an-email"), "Enter a valid email address.");
  assert.equal(validateEmail(""), "Enter your email address.");
});

test("enforces the password policy", () => {
  assert.match(validatePassword("short1"), /at least 8 characters/);
  assert.match(validatePassword("onlyletters"), /letter and one number/);
  assert.match(validatePassword("12345678"), /letter and one number/);
  assert.match(validatePassword("a".repeat(73)), /72 characters or fewer/);
  assert.equal(validatePassword("counter2026"), null);
});

test("validates login fields without enforcing signup password rules", () => {
  assert.deepEqual(validateLoginInput({ email: "ada@example.com", password: "x" }), {});
  assert.deepEqual(validateLoginInput({ email: "bad", password: "" }), {
    email: "Enter a valid email address.",
    password: "Enter your password.",
  });
});
