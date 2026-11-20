import { useState } from "react";
import {
  AlertCircle,
  IndianRupee,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import RecentBills from "../components/dashboard/RecentBills";
import RevenueChart from "../components/dashboard/RevenueChart";
import TopProducts from "../components/dashboard/TopProducts";
import useAnalytics from "../hooks/useAnalytics";
import useBills from "../hooks/useBills";
import { formatCurrency, percentChange } from "../lib/format";

const RANGE_OPTIONS = [7, 30];

export default function Dashboard({ onNavigate }) {
  const [days, setDays] = useState(7);
  const {
    data,
    loading,
    error,
    reload: reloadAnalytics,
  } = useAnalytics(days);
  const {
    bills,
    loading: billsLoading,
    error: billsError,
    reload: reloadBills,
  } = useBills();

  const refreshing = loading || billsLoading;
  const today = data?.today || { revenue: 0, bills: 0, itemsSold: 0, avgBill: 0 };
  const yesterday = data?.yesterday || {
    revenue: 0,
    bills: 0,
    itemsSold: 0,
    avgBill: 0,
  };
  const hasData = Boolean(data);

  const refresh = () => {
    reloadAnalytics();
    reloadBills();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            Overview
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Sales dashboard
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
            Monitor today&apos;s counter activity, revenue trends and the
            products moving fastest.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Analytics date range"
            className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
          >
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDays(option)}
                aria-pressed={days === option}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  days === option
                    ? "bg-brand-800 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {option} days
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={refresh}
            aria-label="Refresh dashboard"
            title="Refresh dashboard"
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {error || billsError ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{error || billsError}</p>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="cursor-pointer self-start rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700 sm:self-auto"
          >
            Retry
          </button>
        </div>
      ) : null}

      <section aria-label="Today's key metrics">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Revenue today"
            value={hasData ? formatCurrency(today.revenue) : "—"}
            icon={IndianRupee}
            tone="brand"
            delta={
              hasData
                ? percentChange(today.revenue, yesterday.revenue)
                : undefined
            }
            hint="vs yesterday"
            loading={loading && !hasData}
          />
          <StatCard
            label="Bills today"
            value={hasData ? today.bills : "—"}
            icon={ReceiptText}
            tone="violet"
            delta={
              hasData ? percentChange(today.bills, yesterday.bills) : undefined
            }
            hint="vs yesterday"
            loading={loading && !hasData}
          />
          <StatCard
            label="Items sold today"
            value={hasData ? today.itemsSold : "—"}
            icon={ShoppingBag}
            tone="amber"
            delta={
              hasData
                ? percentChange(today.itemsSold, yesterday.itemsSold)
                : undefined
            }
            hint="vs yesterday"
            loading={loading && !hasData}
          />
          <StatCard
            label="Average bill"
            value={hasData ? formatCurrency(today.avgBill) : "—"}
            icon={Wallet}
            tone="emerald"
            delta={
              hasData
                ? percentChange(today.avgBill, yesterday.avgBill)
                : undefined
            }
            hint="vs yesterday"
            loading={loading && !hasData}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart
            daily={data?.daily || []}
            days={days}
            loading={loading}
            summary={data?.current}
          />
        </div>
        <TopProducts products={data?.topProducts || []} loading={loading} />
      </div>

      <RecentBills
        bills={bills}
        loading={billsLoading}
        onViewAll={() => onNavigate("transactions")}
        onStartSale={() => onNavigate("pos")}
      />
    </div>
  );
}
