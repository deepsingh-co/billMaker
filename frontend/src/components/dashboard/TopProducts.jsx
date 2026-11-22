import { PackageSearch } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { formatCurrency, formatNumber } from "../../lib/format";

export default function TopProducts({ products = [], loading }) {
  const list = Array.isArray(products) ? products.slice(0, 5) : [];
  const maxQuantity = Math.max(...list.map((item) => item.quantity || 0), 1);

  return (
    <section
      aria-labelledby="top-products-title"
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div>
        <h2
          id="top-products-title"
          className="text-base font-semibold text-slate-900 dark:text-slate-100"
        >
          Top products
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Ranked by units sold in this period
        </p>
      </div>

      {loading && list.length === 0 ? (
        <div className="mt-6 space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="mt-3 h-1.5 w-full" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-1 items-center">
          <div className="w-full">
            <EmptyState
              icon={PackageSearch}
              title="No product data yet"
              description="Sold products will be ranked here once you record a sale."
            />
          </div>
        </div>
      ) : (
        <ol className="mt-5 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {list.map((product, index) => {
            const quantity = Number(product.quantity) || 0;
            const width = Math.max((quantity / maxQuantity) * 100, 4);
            return (
              <li key={product.barcode || product.name} className="py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-5 shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {formatNumber(quantity)}{" "}
                        {quantity === 1 ? "unit" : "units"} sold
                      </p>
                    </div>
                  </div>
                  <p className="tabular shrink-0 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
                <div className="ml-8 mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-[width] duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
