import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Box, ScanLine, ShoppingCart, Receipt, PackageSearch, History, Clock, CheckCircle2, Tag } from "lucide-react";

function App() {
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("pos"); // "pos" or "history"
  const [billsHistory, setBillsHistory] = useState([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 3D scrolling effects
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, -40]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-20, 60]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const translateZ = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Main content scaling
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.9, 0.5]);

  const lastScannedQuantity = product
    ? cart.find((item) => item.barcode === product.barcode)?.quantity ?? 1
    : null;

  const startScanner = () => {
    if (scannerInstance) return;
    const scanner = new Html5QrcodeScanner("scanner", { fps: 10, qrbox: 250 }, false);
    setScannerInstance(scanner);

    let isRequesting = false;

    scanner.render(
      async (decodedText) => {
        if (isRequesting) return;
        isRequesting = true;
        try {
          const res = await axios.get(
            `http://localhost:5000/api/products/${decodedText}`
          );
          setProduct(res.data);
          addToCart(res.data);
          await scanner.clear();
          setScannerInstance(null);
        } catch (err) {
          alert("Product not found ❌");
          await scanner.clear();
          setScannerInstance(null);
        }
      },
      (error) => {}
    );
  };

  const addToCart = (prod) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.barcode === prod.barcode);
      if (existing) {
        return prevCart.map((item) =>
          item.barcode === prod.barcode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...prod, quantity: 1 }];
      }
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const saveBill = async () => {
    if (cart.length === 0) {
      alert("Cart is empty, cannot generate bill ❌");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/bills/add", {
        items: cart,
        totalAmount,
      });
      alert(`Bill Generated: ₹${totalAmount}`);
      setCart([]);
      setProduct(null);
    } catch (err) {
      alert("Error saving bill ❌");
    }
  };

  const fetchBillsHistory = async () => {
    setLoadingBills(true);
    try {
        const res = await axios.get("http://localhost:5000/api/bills");
        setBillsHistory(res.data);
    } catch (err) {
        console.error("Error fetching bills", err);
    }
    setLoadingBills(false);
  };

  useEffect(() => {
    if (activeTab === "history") {
        fetchBillsHistory();
    }
  }, [activeTab]);

  return (
    <div 
      className="min-h-[200vh] bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 w-full overflow-x-hidden relative" 
      ref={containerRef}
    >
      {/* 3D Floating Background Element */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: 1000 }}>
        <motion.div
          style={{
            rotateX,
            rotateY,
            rotateZ,
            z: translateZ,
          }}
          className="relative w-96 h-96 transform-gpu"
        >
          <div className="absolute inset-0 border-2 border-indigo-500/20 bg-indigo-500/5 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_0_80px_rgba(99,102,241,0.2)]" style={{ transform: "translateZ(100px)" }} />
          <div className="absolute inset-4 border border-violet-500/30 bg-violet-500/10 backdrop-blur-2xl rounded-3xl" style={{ transform: "translateZ(50px) rotate(15deg)" }} />
          <div className="absolute inset-12 border border-fuchsia-500/40 bg-gradient-to-tr from-indigo-600/30 to-fuchsia-600/30 backdrop-blur-xl rounded-2xl flex items-center justify-center" style={{ transform: "translateZ(0px) rotate(-10deg)" }}>
            <Box className="w-20 h-20 text-white/50" strokeWidth={1} />
          </div>
        </motion.div>
      </div>

      <motion.main 
        style={{ scale, opacity }} 
        className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12 origin-top"
      >
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-white/5">
              BB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-300 font-semibold mb-1">Next-Gen Billing</p>
              <h1 className="text-3xl font-bold tracking-tight text-white">Barcode Suite</h1>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center bg-black/20 p-1.5 rounded-2xl border border-white/5">
            <button
               onClick={() => setActiveTab("pos")}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                 activeTab === "pos" 
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
               }`}
            >
              <ScanLine className="w-4 h-4" /> Point of Sale
            </button>
            <button
               onClick={() => setActiveTab("history")}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                 activeTab === "history" 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
               }`}
            >
              <History className="w-4 h-4" /> History
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
        {activeTab === "pos" ? (
          <motion.div 
            key="pos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <section className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] p-8 flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-all duration-700 group-hover:bg-indigo-500/20" />
              
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <ScanLine className="w-5 h-5 text-indigo-400" /> Scanner Module
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Initialize optical recognition to detect product barcodes.</p>
                </div>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  onClick={startScanner}
                  disabled={scannerInstance !== null}
                >
                  <ScanLine className="w-4 h-4" /> 
                  {scannerInstance ? "Scanner Active" : "Launch Scanner"}
                </button>
              </div>

              <div className="mt-2 min-h-[300px] w-full rounded-2xl border-2 border-dashed border-white/10 bg-black/20 relative z-10 overflow-hidden flex flex-col items-center justify-center">
                {!scannerInstance && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-slate-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent animate-pulse" />
                    <ScanLine className="w-10 h-10 mb-3 opacity-20" />
                    <p>Scanner feed will initialize here</p>
                  </div>
                )}
                <div id="scanner" className="w-full h-full relative z-20"></div>
              </div>

              {product && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex flex-col rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-5 relative z-10 mt-6 shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400 ring-1 ring-emerald-500/30">
                         <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-emerald-300 drop-shadow-sm">{product.name}</p>
                        <p className="text-xs font-semibold text-emerald-500/80 mt-0.5 uppercase tracking-wider">Successfully Added to Registry</p>
                      </div>
                    </div>
                    <div className="bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-inner">
                      <span className="text-xs font-bold text-emerald-200">
                        Qty: {lastScannedQuantity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-emerald-500/10 text-emerald-300 relative z-10">
                     <Tag className="w-4 h-4 opacity-80" />
                     <span className="font-semibold tracking-wide text-lg">₹{product.price.toLocaleString()}</span>
                  </div>
                </motion.div>
              )}
            </section>

            <section className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] p-8 flex flex-col h-full relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] -ml-32 -mb-32 transition-all duration-700 group-hover:bg-fuchsia-500/20" />
              
              <div className="flex items-center justify-between relative z-10 mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <ShoppingCart className="w-5 h-5 text-fuchsia-400" /> Active Registry
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Review items before final billing</p>
                </div>
                <span className="text-sm font-bold text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/20 px-4 py-1.5 rounded-full shadow-inner">
                  {cart.length} {cart.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="flex-1 flex flex-col relative z-10">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 min-h-[300px]">
                    <PackageSearch className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">Awaiting first scan...</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                      {cart.map((item, i) => (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={item.barcode}
                          className="group/item flex items-center justify-between rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-5 py-4 transition-colors"
                        >
                          <div>
                            <p className="font-bold text-white text-lg">{item.name}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {item.quantity} x ₹{item.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-indigo-300 text-lg">₹{item.price * item.quantity}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-1">{item.barcode}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="flex items-end justify-between mb-6">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Gross Total Amount</p>
                          <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            ₹{totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-4 text-lg font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        onClick={saveBill}
                      >
                        <Receipt className="w-5 h-5" /> Generate Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] p-8 flex flex-col relative overflow-hidden group w-full min-h-[600px]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-700 group-hover:bg-cyan-500/20" />
              
              <div className="flex items-center justify-between relative z-10 mb-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                    <History className="w-6 h-6 text-cyan-400" /> Transaction History
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Review past bills and transactions</p>
                </div>
                <div className="bg-black/30 border border-white/10 px-4 py-2 rounded-xl">
                    <span className="text-cyan-400 font-bold">{billsHistory.length}</span> <span className="text-slate-400 text-sm ml-1">Records Found</span>
                </div>
              </div>

              <div className="relative z-10 flex-1">
                {loadingBills ? (
                  <div className="flex flex-col items-center justify-center py-32 text-cyan-500 animate-pulse">
                    <Clock className="w-12 h-12 mb-4 opacity-50 animate-spin" />
                    <p className="text-sm font-medium">Loading History...</p>
                  </div>
                ) : billsHistory.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                     <Clock className="w-16 h-16 mb-4 opacity-20" />
                     <p>No transaction history found.</p>
                   </div>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {billsHistory.map((bill, i) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          key={bill._id}
                          className="bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-2xl p-6 transition-all hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col h-64"
                        >
                          <div className="flex justify-between items-start mb-4">
                             <div>
                               <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-lg border border-cyan-400/20">#{bill._id.slice(-6).toUpperCase()}</span>
                             </div>
                             <div className="text-right">
                                <p className="text-xs text-slate-300 font-medium">{new Date(bill.createdAt).toLocaleDateString()}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{new Date(bill.createdAt).toLocaleTimeString()}</p>
                             </div>
                          </div>
                          
                          <div className="space-y-3 mb-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                             {bill.items.map(item => (
                               <div key={item.barcode} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                 <span className="text-slate-200 truncate pr-2">
                                     {item.name} 
                                     <span className="text-slate-500 text-xs ml-2 bg-black/30 px-1.5 py-0.5 rounded-md">x{item.quantity}</span>
                                 </span>
                                 <span className="text-slate-300 font-bold">₹{item.price * item.quantity}</span>
                               </div>
                             ))}
                          </div>

                          <div className="pt-4 border-t border-white/10 flex justify-between items-end mt-auto">
                            <span className="text-cyan-500/80 text-xs font-medium uppercase tracking-wider">Total</span>
                            <span className="text-2xl font-bold text-white">₹{bill.totalAmount.toLocaleString()}</span>
                          </div>
                        </motion.div>
                     ))}
                   </div>
                )}
              </div>
            </section>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.main>
      
      {/* Spacer to allow scrolling to trigger 3D effects */}
      <div className="h-[20vh] flex items-center justify-center relative z-10 text-slate-600 font-medium my-12">
        <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          Scroll down to see the 3D depth effect in action
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-black/40 backdrop-blur-2xl py-16 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center font-bold text-xl shadow-[0_0_30px_rgba(99,102,241,0.3)] ring-2 ring-white/10">
                BB
              </div>
              <div>
                 <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold mb-0.5">Next-Gen</p>
                 <h3 className="text-2xl font-extrabold text-white tracking-tight">Barcode Suite</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Empowering your business with lightning-fast scanning, modern aesthetics, and seamless billing experiences.
            </p>
          </div>
          <div className="md:px-8">
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li>
                <button onClick={() => setActiveTab("pos")} className="hover:text-indigo-400 hover:translate-x-1 transition-all flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></span> Point of Sale
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("history")} className="hover:text-cyan-400 hover:translate-x-1 transition-all flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></span> Transaction History
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">System Metrics</h4>
            <div className="space-y-4 text-sm text-slate-400">
               <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-4">
                  <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 border border-emerald-500/30">
                     <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">API Status</p>
                    <p className="text-emerald-400 font-bold">Online & Optimal</p>
                  </div>
               </div>
               <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-4">
                  <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400 border border-indigo-500/30">
                     <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">System Time</p>
                    <p className="text-slate-300 font-bold">{new Date().toLocaleTimeString()}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Barcode Suite Platform. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;