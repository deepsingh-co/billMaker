const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

export function formatCurrency(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? currencyFormatter.format(amount) : "₹0";
}

export function formatCompactCurrency(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `₹${compactFormatter.format(amount)}` : "₹0";
}

export function formatNumber(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? numberFormatter.format(amount) : "0";
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function invoiceNumber(id) {
  return `INV-${String(id || "").slice(-6).toUpperCase()}`;
}

export function percentChange(current, previous) {
  const next = Number(current) || 0;
  const prior = Number(previous) || 0;
  if (prior === 0) return next > 0 ? 100 : 0;
  return ((next - prior) / prior) * 100;
}

export function todayLabel() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getErrorMessage(error) {
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach the billing server. Make sure the backend is running on port 5000.";
  }
  return error?.message || "Something went wrong. Please try again.";
}
