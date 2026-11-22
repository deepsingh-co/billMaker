import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  Hash,
  Loader2,
  ScanBarcode,
  Tag,
} from "lucide-react";
import { getProductByBarcode } from "../../lib/api";
import { formatCurrency, getErrorMessage } from "../../lib/format";
import { useToast } from "../ui/ToastProvider";

const SCANNER_ELEMENT_ID = "barcode-scanner-view";

export default function ScannerPanel({
  onDetected,
  selectedProduct,
  cartQuantity,
}) {
  const { toast } = useToast();
  const scannerRef = useRef(null);
  const busyRef = useRef(false);
  const [active, setActive] = useState(false);
  const [starting, setStarting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const [error, setError] = useState("");

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    setActive(false);
    if (scanner) {
      try {
        await scanner.stop();
        scanner.clear();
      } catch (err) {
        // The camera may already be stopped when the component unmounts.
      }
    }
  }, []);

  useEffect(
    () => () => {
      const scanner = scannerRef.current;
      if (scanner) {
        scanner.stop().catch(() => {});
        try {
          scanner.clear();
        } catch (err) {
          // No-op: the DOM node may already be gone.
        }
      }
    },
    []
  );

  const handleDecoded = useCallback(
    async (decodedText) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setError("");
      try {
        const product = await getProductByBarcode(decodedText.trim());
        onDetected(product);
        toast(`${product.name} added to cart`, "success");
        await stopScanner();
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast(message, "error");
        await stopScanner();
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [onDetected, stopScanner, toast]
  );

  const startScanner = async () => {
    if (scannerRef.current || starting) return;
    setStarting(true);
    setError("");
    try {
      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          aspectRatio: 1.3333,
          qrbox: (viewfinderWidth) => ({
            width: Math.floor(viewfinderWidth * 0.8),
            height: Math.floor(viewfinderWidth * 0.32),
          }),
        },
        handleDecoded,
        () => {}
      );
      setActive(true);
    } catch (err) {
      scannerRef.current = null;
      const message =
        "Camera could not start. Grant camera access, then try again or use manual entry below.";
      setError(message);
      toast(message, "error");
    } finally {
      setStarting(false);
    }
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    const barcode = manualValue.trim();
    if (!barcode || busy) return;

    setBusy(true);
    setError("");
    try {
      const product = await getProductByBarcode(barcode);
      onDetected(product);
      setManualValue("");
      toast(`${product.name} added to cart`, "success");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast(message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      aria-labelledby="scanner-title"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            <ScanBarcode className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="scanner-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Barcode scanner
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Point the camera at a product barcode, or type the code manually.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {active ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
          ) : null}
          <button
            type="button"
            onClick={active ? stopScanner : startScanner}
            disabled={starting}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              active
                ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                : "bg-brand-800 text-white hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500"
            }`}
          >
            {starting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : active ? (
              <CameraOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Camera className="h-4 w-4" aria-hidden="true" />
            )}
            {active ? "Stop camera" : starting ? "Starting…" : "Scan with camera"}
          </button>
        </div>
      </div>

      <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <div
          id={SCANNER_ELEMENT_ID}
          className={active || starting ? "h-full w-full" : "hidden"}
        />

        {!active && !starting ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-brand-300">
              <ScanBarcode className="h-8 w-8" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-medium text-slate-200">
              Camera preview is off
            </p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
              Start the scanner to detect EAN and UPC barcodes. Camera access is
              only requested while the scanner is running.
            </p>
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-slate-950/80 to-transparent px-4 pb-4 pt-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-200">
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              )}
              {busy ? "Looking up barcode…" : "Hold the barcode steady inside the frame"}
            </p>
          </div>
        )}
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {error}
        </p>
      ) : null}

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          or enter manually
        </span>
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-2">
        <label
          htmlFor="manual-barcode"
          className="block text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          Product barcode
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Hash
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
            <input
              id="manual-barcode"
              name="barcode"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={manualValue}
              onChange={(event) => setManualValue(event.target.value)}
              placeholder="e.g. 8901234567890"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 font-mono text-sm text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-900/60"
            />
          </div>
          <button
            type="submit"
            disabled={!manualValue.trim() || busy}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ScanBarcode className="h-4 w-4" aria-hidden="true" />
            )}
            Add item
          </button>
        </div>
      </form>

      {selectedProduct ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                {selectedProduct.name}
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-xs text-emerald-700 dark:text-emerald-300">
                <Tag className="h-3 w-3" aria-hidden="true" />
                {selectedProduct.barcode}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="tabular text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              {formatCurrency(selectedProduct.price)}
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              {cartQuantity} in cart
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
