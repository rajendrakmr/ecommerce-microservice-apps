import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Demo from "./pages/Demo";

// Lazy pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Products = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const Order = lazy(() => import("./pages/Order"));

export default function App() {
  return (
    <Router basename="/apps">

      <div style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <style>
          {`
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { background: #FAFAFA; }
              @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
              @keyframes slideIn { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
              button { font-family: inherit; }
              input, select { font-family: inherit; }
              ::-webkit-scrollbar { width: 6px; }
              ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
            `}</style>
        <Navbar />
        <Suspense fallback={<h2 style={{ textAlign: "center" }}>Loading...</h2>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/demo" element={<Demo />} />
          </Routes>
        </Suspense>


        {/* Footer */}
        <footer style={{ background: "#0F172A", color: "rgba(255,255,255,.4)", padding: "40px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#0F172A", fontSize: 14, fontWeight: 800, fontFamily: "Georgia, serif" }}>A</span>
            </div>
            <span style={{ color: "rgba(255,255,255,.7)", fontFamily: "Georgia, serif", fontSize: 16 }}>Arche</span>
          </div>
          <div style={{ fontSize: 12 }}>
            Services: Auth :5001 · Users :5002 · Products :5003 · Gateway :5000
          </div>
          <div style={{ fontSize: 12 }}>© 2026 Arche. All rights reserved.</div>
        </footer>
      </div >
    </Router>
  );
}
