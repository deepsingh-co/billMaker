const test = require("node:test");
const assert = require("node:assert/strict");
const { signAuthToken, verifyAuthToken } = require("./auth");

test("signs and verifies an auth token", () => {
  const token = signAuthToken("user-123", false);
  const payload = verifyAuthToken(token);
  assert.equal(payload.sub, "user-123");
});

test("rejects a tampered token", () => {
  const token = signAuthToken("user-123", true);
  assert.throws(() => verifyAuthToken(`${token}tampered`));
});
