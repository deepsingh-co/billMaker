import { useState } from "react";
import { createBill } from "../lib/api";
import {
  formatCurrency,
  getErrorMessage,
  invoiceNumber,
} from "../lib/format";
import { useToast } from "../components/ui/ToastProvider";
import ScannerPanel from "../components/pos/ScannerPanel";
import CartPanel from "../components/pos/CartPanel";

export default function PointOfSale() {
  const { toast } = useToast();
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const selectedQuantity = selectedProduct
    ? cart.find((item) => item.barcode === selectedProduct.barcode)?.quantity || 0
    : 0;

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.barcode === product.barcode
      );
      if (existing) {
        return current.map((item) =>
          item.barcode === product.barcode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setSelectedProduct(product);
  };

  const incrementItem = (product) => {
    setCart((current) =>
      current.map((item) =>
        item.barcode === product.barcode
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementItem = (product) => {
    setCart((current) =>
      current.map((item) =>
        item.barcode === product.barcode
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (product) => {
    setCart((current) =>
      current.filter((item) => item.barcode !== product.barcode)
    );
    if (selectedProduct?.barcode === product.barcode) {
      setSelectedProduct(null);
    }
    toast(`${product.name} removed from cart`, "info");
  };

  const clearCart = () => {
    setCart([]);
    setSelectedProduct(null);
    toast("Cart cleared", "info");
  };

  const checkout = async () => {
    if (cart.length === 0 || saving) return;
    setSaving(true);
    try {
      const bill = await createBill({
        items: cart.map(({ name, barcode, price, quantity }) => ({
          name,
          barcode,
          price,
          quantity,
        })),
        totalAmount: total,
      });
      toast(
        `Invoice ${invoiceNumber(bill._id)} recorded for ${formatCurrency(total)}`,
        "success"
      );
      setCart([]);
      setSelectedProduct(null);
    } catch (error) {
      toast(getErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
          Checkout
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Point of sale
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Scan products, adjust quantities and generate an invoice in seconds.
          Manual barcode entry is available if a camera is not connected.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ScannerPanel
            onDetected={addToCart}
            selectedProduct={selectedProduct}
            cartQuantity={selectedQuantity}
          />
        </div>
        <div className="xl:col-span-2">
          <div className="xl:sticky xl:top-24">
            <CartPanel
              cart={cart}
              total={total}
              onIncrement={incrementItem}
              onDecrement={decrementItem}
              onRemove={removeItem}
              onClear={clearCart}
              onCheckout={checkout}
              saving={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
