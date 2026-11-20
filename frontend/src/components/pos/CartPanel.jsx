import {
  Loader2,
  Minus,
  Plus,
  ReceiptText,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import EmptyState from "../ui/EmptyState";
import { formatCurrency } from "../../lib/format";

export default function CartPanel({
  cart,
  total,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onCheckout,
  saving,
}) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section
      aria-labelledby="cart-title"
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-card"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 id="cart-title" className="text-base font-semibold text-slate-900">
            Current cart
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {itemCount} {itemCount === 1 ? "item" : "items"} ready to bill
          </p>
        </div>
        <div className="flex items-center gap-2">
          {cart.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              Clear
            </button>
          ) : null}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-1 items-center">
          <div className="w-full">
            <EmptyState
              icon={ShoppingCart}
              title="Cart is empty"
              description="Scan a barcode or enter one manually to start a new bill."
            />
          </div>
        </div>
      ) : (
        <>
          <ul className="custom-scrollbar max-h-[420px] flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
            {cart.map((item) => (
              <li key={item.barcode} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {item.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                      {item.barcode}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() => onDecrement(item)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="cursor-pointer rounded-l-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <span className="tabular w-8 text-center font-mono text-xs font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncrement(item)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="cursor-pointer rounded-r-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Line total
                  </span>
                  <span className="tabular text-sm font-semibold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-500">Amount payable</p>
                <p className="text-xs text-slate-500">Inclusive of all taxes</p>
              </div>
              <p className="tabular text-3xl font-semibold tracking-tight text-slate-900">
                {formatCurrency(total)}
              </p>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              disabled={saving || cart.length === 0}
              className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ReceiptText className="h-4 w-4" aria-hidden="true" />
              )}
              {saving ? "Generating invoice…" : "Generate invoice"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
