const TOKEN_KEY = "barcode-suite-token";

export function getStoredToken() {
  try {
    return (
      window.localStorage.getItem(TOKEN_KEY) ||
      window.sessionStorage.getItem(TOKEN_KEY)
    );
  } catch (error) {
    return null;
  }
}

export function storeToken(token, remember) {
  try {
    if (remember) {
      window.localStorage.setItem(TOKEN_KEY, token);
      window.sessionStorage.removeItem(TOKEN_KEY);
    } else {
      window.sessionStorage.setItem(TOKEN_KEY, token);
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    // Storage can be unavailable in private or embedded browsing contexts.
  }
}

export function clearStoredToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    // Storage can be unavailable in private or embedded browsing contexts.
  }
}
