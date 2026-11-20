import { ArrowRight, ReceiptText } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import {
  formatCurrency,
  formatDate,
  formatTime,
  invoiceNumber,
} from "../../lib/format";

function itemCount(bill) {
  return (bill.items || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
}

export default function RecentBills({ bills = [], loading, onViewAll, onStartSale }) {
  const recent = bills.slice(0, 6);

  return (
    <section
      aria-labelledby="recent-bills-title"
      className="rounded-2xl border border-slate-200 bg-white shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2
            id="recent-bills-title"
            className="text-base font-semibold text-slate-900"
          >
            Recent transactions
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Latest invoices recorded at the counter
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {loading && recent.length === 0 ? (
        <div className="space-y-3 p-5 sm:p-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="No transactions yet"
          description="Your first invoice will show up here as soon as you complete a sale."
          action={
            <button
              type="button"
              onClick={onStartSale}
              className="cursor-pointer rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Start a sale
            </button>
          }
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-6 py-3">Invoice</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Items</th>
                  <th scope="col" className="px-4 py-3 text-right">Amount</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((bill) => (
                  <tr
                    key={bill._id}
                    className="text-sm transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-3.5">
                      <span className="rounded-md bg-brand-50 px-2 py-1 font-mono text-xs font-semibold text-brand-700">
                        {invoiceNumber(bill._id)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-700">
                        {formatDate(bill.createdAt)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatTime(bill.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {itemCount(bill)}{" "}
                      {itemCount(bill) === 1 ? "item" : "items"}
                    </td>
                    <td className="tabular px-4 py-3.5 text-right font-semibold text-slate-900">
                      {formatCurrency(bill.totalAmount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Recorded
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-slate-100 md:hidden">
            {recent.map((bill) => (
              <li key={bill._id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md bg-brand-50 px-2 py-1 font-mono text-xs font-semibold text-brand-700">
                    {invoiceNumber(bill._id)}
                  </span>
                  <span className="tabular text-sm font-semibold text-slate-900">
                    {formatCurrency(bill.totalAmount)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {formatDate(bill.createdAt)} · {formatTime(bill.createdAt)}
                  </span>
                  <span>{itemCount(bill)} items</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
