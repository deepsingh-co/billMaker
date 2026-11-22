import { Fragment, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Filter,
  ReceiptText,
  RefreshCw,
  Search,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import useBills from "../hooks/useBills";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatTime,
  invoiceNumber,
} from "../lib/format";

const RANGE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];

function getRangeStart(range) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "today") return start;
  if (range === "7") {
    start.setDate(start.getDate() - 6);
    return start;
  }
  if (range === "30") {
    start.setDate(start.getDate() - 29);
    return start;
  }
  return null;
}

function billItemCount(bill) {
  return (bill.items || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
}

function BillDetails({ bill }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Invoice detail</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Generated {formatDate(bill.createdAt)} at {formatTime(bill.createdAt)}
        </p>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {(bill.items || []).map((item) => (
          <li
            key={`${bill._id}-${item.barcode || item.name}`}
            className="flex items-center justify-between gap-4 py-2.5 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-700 dark:text-slate-300">{item.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {item.barcode || "No barcode"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-6 text-slate-600 dark:text-slate-300">
              <span className="tabular text-xs">
                {item.quantity} × {formatCurrency(item.price)}
              </span>
              <span className="tabular w-20 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Transactions({ onNavigate }) {
  const { bills, loading, error, reload } = useBills();
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    const rangeStart = getRangeStart(range);
    const search = query.trim().toLowerCase();

    return bills.filter((bill) => {
      const createdAt = new Date(bill.createdAt);
      if (rangeStart && createdAt < rangeStart) return false;
      if (!search) return true;

      if (invoiceNumber(bill._id).toLowerCase().includes(search)) return true;
      return (bill.items || []).some(
        (item) =>
          (item.name || "").toLowerCase().includes(search) ||
          (item.barcode || "").toLowerCase().includes(search)
      );
    });
  }, [bills, query, range]);

  const summary = useMemo(
    () =>
      filtered.reduce(
        (totals, bill) => ({
          revenue: totals.revenue + (Number(bill.totalAmount) || 0),
          bills: totals.bills + 1,
          items: totals.items + billItemCount(bill),
        }),
        { revenue: 0, bills: 0, items: 0 }
      ),
    [filtered]
  );

  const toggleBill = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
            Records
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Search every recorded invoice, filter by date and open a bill to see
            its line items.
          </p>
        </div>
        <button
          type="button"
          onClick={reload}
          aria-label="Refresh transactions"
          className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:self-auto"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          Refresh
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
          <button
            type="button"
            onClick={reload}
            className="cursor-pointer self-start rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700 sm:self-auto"
          >
            Retry
          </button>
        </div>
      ) : null}

      <section aria-label="Filtered transaction summary">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              <Wallet className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Revenue in view</p>
              <p className="tabular mt-0.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(summary.revenue)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <ReceiptText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Bills in view</p>
              <p className="tabular mt-0.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {formatNumber(summary.bills)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Items sold</p>
              <p className="tabular mt-0.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {formatNumber(summary.items)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="transaction-list-title"
        className="rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2
              id="transaction-list-title"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              All invoices
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {filtered.length} of {bills.length} records
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              <label htmlFor="transaction-search" className="sr-only">
                Search invoices
              </label>
              <input
                id="transaction-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search invoice, product or barcode"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-900/60 sm:w-72"
              />
            </div>

            <div className="relative">
              <Filter
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              <label htmlFor="transaction-range" className="sr-only">
                Filter by date
              </label>
              <select
                id="transaction-range"
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-brand-500 dark:focus:ring-brand-900/60 sm:w-40"
              >
                {RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {loading && bills.length === 0 ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title={bills.length === 0 ? "No invoices recorded" : "No matching invoices"}
            description={
              bills.length === 0
                ? "Complete a sale at the point of sale and it will appear here."
                : "Try a different search term or date range."
            }
            action={
              bills.length === 0 ? (
                <button
                  type="button"
                  onClick={() => onNavigate("pos")}
                  className="cursor-pointer rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500"
                >
                  Start a sale
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setRange("all");
                  }}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Clear filters
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    <th scope="col" className="px-5 py-3">Invoice</th>
                    <th scope="col" className="px-4 py-3">Date</th>
                    <th scope="col" className="px-4 py-3">Items</th>
                    <th scope="col" className="px-4 py-3 text-right">Amount</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-5 py-3 text-right">
                      <span className="sr-only">Expand</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((bill) => {
                    const isOpen = expandedId === bill._id;
                    const itemCount = billItemCount(bill);
                    return (
                      <Fragment key={bill._id}>
                        <tr className="text-sm transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="px-5 py-3.5">
                            <span className="rounded-md bg-brand-50 px-2 py-1 font-mono text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                              {invoiceNumber(bill._id)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-medium text-slate-700 dark:text-slate-300">
                              {formatDate(bill.createdAt)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {formatTime(bill.createdAt)}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </td>
                          <td className="tabular px-4 py-3.5 text-right font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(bill.totalAmount)}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Recorded
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => toggleBill(bill._id)}
                              aria-expanded={isOpen}
                              aria-controls={`bill-details-${bill._id}`}
                              aria-label={`${isOpen ? "Hide" : "Show"} details for ${invoiceNumber(bill._id)}`}
                              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                aria-hidden="true"
                              />
                            </button>
                          </td>
                        </tr>
                        {isOpen ? (
                          <tr id={`bill-details-${bill._id}`}>
                            <td colSpan={6} className="bg-slate-50/70 px-5 py-4 dark:bg-slate-950/60">
                              <BillDetails bill={bill} />
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
              {filtered.map((bill) => {
                const isOpen = expandedId === bill._id;
                return (
                  <li key={bill._id}>
                    <button
                      type="button"
                      onClick={() => toggleBill(bill._id)}
                      aria-expanded={isOpen}
                      aria-controls={`bill-details-mobile-${bill._id}`}
                      className="w-full cursor-pointer p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-md bg-brand-50 px-2 py-1 font-mono text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                          {invoiceNumber(bill._id)}
                        </span>
                        <span className="tabular text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(bill.totalAmount)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          {formatDate(bill.createdAt)} · {formatTime(bill.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          {billItemCount(bill)} items
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </button>
                    {isOpen ? (
                      <div
                        id={`bill-details-mobile-${bill._id}`}
                        className="px-4 pb-4"
                      >
                        <BillDetails bill={bill} />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
