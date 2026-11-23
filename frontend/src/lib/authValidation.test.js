import {
  getInitials,
  getPasswordChecks,
  normalizeEmail,
  normalizeName,
  validateEmail,
  validateLoginForm,
  validateName,
  validatePassword,
  validateSignupForm,
} from "./authValidation";

describe("authValidation", () => {
  test("normalizes names and emails", () => {
    expect(normalizeName("  Ada   Lovelace ")).toBe("Ada Lovelace");
    expect(normalizeEmail("  ADA@Example.COM ")).toBe("ada@example.com");
  });

  test("validates names and emails", () => {
    expect(validateName("A")).toMatch(/at least 2 characters/);
    expect(validateName("Ada Lovelace")).toBeNull();
    expect(validateEmail("not-an-email")).toMatch(/valid email/);
    expect(validateEmail("ada@example.com")).toBeNull();
  });

  test("enforces the password policy", () => {
    expect(validatePassword("short1")).toMatch(/at least 8 characters/);
    expect(validatePassword("onlyletters")).toMatch(/letter and one number/);
    expect(validatePassword("12345678")).toMatch(/letter and one number/);
    expect(validatePassword("counter2026")).toBeNull();
  });

  test("validates login fields without signup password rules", () => {
    expect(validateLoginForm({ email: "ada@example.com", password: "x" })).toEqual(
      {}
    );
    expect(validateLoginForm({ email: "bad", password: "" })).toEqual({
      email: "Enter a valid email address.",
      password: "Enter your password.",
    });
  });

  test("validates signup confirmation", () => {
    expect(
      validateSignupForm({
        name: "Ada Lovelace",
        email: "ada@example.com",
        password: "counter2026",
        confirmPassword: "different1",
      })
    ).toEqual({ confirmPassword: "Passwords do not match." });

    expect(
      validateSignupForm({
        name: "Ada Lovelace",
        email: "ada@example.com",
        password: "counter2026",
        confirmPassword: "counter2026",
      })
    ).toEqual({});
  });

  test("reports password requirements", () => {
    const checks = getPasswordChecks("counter2026");
    expect(checks.every((check) => check.met)).toBe(true);

    const missingNumber = getPasswordChecks("onlyletters");
    expect(missingNumber.find((check) => check.id === "number").met).toBe(false);
  });

  test("builds initials for the account avatar", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
    expect(getInitials("", "ada@example.com")).toBe("AD");
    expect(getInitials("")).toBe("?");
  });
});
