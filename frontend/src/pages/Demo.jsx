import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ─── API CONFIG (matches your docker-compose) ───────────────────────────────
const API = {
  gateway: "http://localhost:5000",
  auth:    "http://localhost:5001/auth",
  users:   "http://localhost:5002",
  products:"http://localhost:5003",
};

const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Request failed");
  return res.json();
};

// ─── AUTH CONTEXT ────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const CartCtx = createContext(null);

function useAuth() { return useContext(AuthCtx); }
function useCart() { return useContext(CartCtx); }

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = async (email, password) => {
    const data = await apiFetch(`${API.gateway}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiFetch(`${API.gateway}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, token, login, register, logout, isAuth: !!token }}>
      {children}
    </AuthCtx.Provider>
  );
}

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const add = useCallback((product, qty = 1) => {
    setItems(prev => {
      const ex = prev.find(i => i._id === product._id);
      if (ex) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(i => i._id !== id));
  }, []);

  const update = useCallback((id, qty) => {
    if (qty < 1) { remove(id); return; }
    setItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, update, clear, total, count }}>
      {children}
    </CartCtx.Provider>
  );
}

// ─── MOCK DATA (fallback when backend is offline) ────────────────────────────
const MOCK_PRODUCTS = [
  { _id: "1", name: "Arc Desk Lamp", price: 129, category: "Home", rating: 4.8, reviews: 312, stock: 15, image: null, description: "Sculptural aluminum arc lamp with touch dimming and warm-to-cool color temperature control." },
  { _id: "2", name: "Merino Wool Hoodie", price: 198, category: "Fashion", rating: 4.9, reviews: 891, stock: 8, image: null, description: "Ultra-soft 100% merino wool hoodie. Temperature-regulating and naturally odor-resistant." },
  { _id: "3", name: "Ceramic Pour-Over Set", price: 74, category: "Kitchen", rating: 4.7, reviews: 456, stock: 22, image: null, description: "Hand-thrown ceramic dripper and carafe. Each piece unique with subtle glaze variations." },
  { _id: "4", name: "Wireless Earbuds Pro", price: 249, category: "Electronics", rating: 4.6, reviews: 1203, stock: 30, image: null, description: "40hr battery, adaptive ANC, spatial audio. Titanium driver for crisp, detailed sound." },
  { _id: "5", name: "Leather Notebook", price: 58, category: "Stationery", rating: 4.9, reviews: 672, stock: 40, image: null, description: "Full-grain vegetable-tanned leather cover. Fountain pen-friendly 100gsm ivory paper." },
  { _id: "6", name: "Oak Serving Board", price: 89, category: "Kitchen", rating: 4.8, reviews: 234, stock: 12, image: null, description: "Live-edge white oak serving board. Food-safe beeswax finish. Each board one-of-a-kind." },
  { _id: "7", name: "Modular Backpack", price: 165, category: "Fashion", rating: 4.7, reviews: 543, stock: 18, image: null, description: "Removable compartments, waterproof 500D Cordura. Fits 16\" laptop. Lifetime warranty." },
  { _id: "8", name: "Smart Air Purifier", price: 299, category: "Home", rating: 4.5, reviews: 389, stock: 9, image: null, description: "HEPA + activated carbon filter. Whisper-quiet 20dB at low speed. Auto mode via app." },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Kitchen", "Stationery"];

// ─── CATEGORY COLORS / ICONS ─────────────────────────────────────────────────
const CAT_META = {
  Electronics: { color: "#3B82F6", bg: "#EFF6FF", icon: "⚡" },
  Fashion:     { color: "#EC4899", bg: "#FDF2F8", icon: "✦" },
  Home:        { color: "#8B5CF6", bg: "#F5F3FF", icon: "⬡" },
  Kitchen:     { color: "#F59E0B", bg: "#FFFBEB", icon: "◈" },
  Stationery:  { color: "#10B981", bg: "#ECFDF5", icon: "◉" },
  All:         { color: "#6B7280", bg: "#F9FAFB", icon: "◎" },
};

// ─── PRODUCT PLACEHOLDER IMAGE ───────────────────────────────────────────────
const ProductVisual = ({ product, size = 200 }) => {
  const meta = CAT_META[product.category] || CAT_META.All;
  const shapes = {
    Electronics: <><circle cx="100" cy="90" r="40" fill={meta.color} opacity=".15"/><rect x="70" y="60" width="60" height="40" rx="8" fill={meta.color} opacity=".9"/><rect x="85" y="105" width="30" height="6" rx="3" fill={meta.color} opacity=".5"/><circle cx="100" cy="80" r="8" fill="white" opacity=".8"/></>,
    Fashion:     <><ellipse cx="100" cy="95" rx="45" ry="55" fill={meta.color} opacity=".15"/><path d="M70 70 Q100 50 130 70 L120 130 Q100 140 80 130 Z" fill={meta.color} opacity=".85"/><path d="M85 70 Q100 80 115 70" stroke="white" strokeWidth="3" fill="none" opacity=".7"/></>,
    Home:        <><rect x="55" y="80" width="90" height="60" rx="4" fill={meta.color} opacity=".15"/><rect x="60" y="85" width="80" height="50" rx="3" fill={meta.color} opacity=".8"/><rect x="80" y="100" width="20" height="30" rx="2" fill="white" opacity=".6"/><circle cx="120" cy="115" r="12" fill="white" opacity=".5"/></>,
    Kitchen:     <><circle cx="100" cy="95" r="48" fill={meta.color} opacity=".12"/><ellipse cx="100" cy="95" rx="35" ry="30" fill={meta.color} opacity=".8"/><rect x="95" y="55" width="10" height="25" rx="5" fill={meta.color} opacity=".7"/><ellipse cx="100" cy="95" rx="20" ry="16" fill="white" opacity=".3"/></>,
    Stationery:  <><rect x="65" y="55" width="70" height="90" rx="6" fill={meta.color} opacity=".15"/><rect x="70" y="60" width="60" height="80" rx="4" fill={meta.color} opacity=".8"/><line x1="82" y1="80" x2="118" y2="80" stroke="white" strokeWidth="2" opacity=".6"/><line x1="82" y1="92" x2="118" y2="92" stroke="white" strokeWidth="2" opacity=".6"/><line x1="82" y1="104" x2="105" y2="104" stroke="white" strokeWidth="2" opacity=".6"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ display:"block" }}>
      <rect width="200" height="200" fill={meta.bg}/>
      {shapes[product.category] || <circle cx="100" cy="100" r="50" fill={meta.color} opacity=".3"/>}
    </svg>
  );
};

// ─── STAR RATING ─────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 14 }) => (
  <span style={{ fontSize: size, letterSpacing: 1 }}>
    {[1,2,3,4,5].map(n => (
      <span key={n} style={{ color: n <= Math.round(rating) ? "#F59E0B" : "#E5E7EB" }}>★</span>
    ))}
  </span>
);

// ─── TOAST ───────────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === "error" ? "#FEF2F2" : t.type === "info" ? "#EFF6FF" : "#F0FDF4",
            border: `1px solid ${t.type === "error" ? "#FECACA" : t.type === "info" ? "#BFDBFE" : "#BBF7D0"}`,
            color: t.type === "error" ? "#DC2626" : t.type === "info" ? "#2563EB" : "#16A34A",
            borderRadius: 12, padding: "12px 18px", fontSize: 14, fontWeight: 500,
            boxShadow: "0 4px 20px rgba(0,0,0,.08)", minWidth: 240,
            animation: "slideIn .3s ease",
          }}>
            {t.type === "success" ? "✓ " : t.type === "error" ? "✕ " : "ℹ "}{t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToast() { return useContext(ToastCtx); }

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  const { user, logout, isAuth } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100,
      background:"rgba(255,255,255,.92)", backdropFilter:"blur(16px)",
      borderBottom:"1px solid #F1F5F9",
      padding:"0 5%", height:68,
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      {/* Logo */}
      <button onClick={() => setPage("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:36, height:36, background:"#0F172A", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ color:"white", fontSize:18, fontWeight:800, fontFamily:"Georgia, serif" }}>A</span>
        </div>
        <span style={{ fontFamily:"'Georgia', serif", fontSize:20, fontWeight:700, color:"#0F172A", letterSpacing:"-.5px" }}>Arche</span>
      </button>

      {/* Nav links */}
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        {["home","products"].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{
            background: page === p ? "#0F172A" : "transparent",
            color: page === p ? "white" : "#475569",
            border:"none", borderRadius:8, padding:"7px 16px",
            fontSize:14, fontWeight:500, cursor:"pointer", textTransform:"capitalize",
            transition:"all .2s",
          }}>{p === "home" ? "Home" : "Shop"}</button>
        ))}
        {isAuth && (
          <button onClick={() => setPage("orders")} style={{
            background: page === "orders" ? "#0F172A" : "transparent",
            color: page === "orders" ? "white" : "#475569",
            border:"none", borderRadius:8, padding:"7px 16px",
            fontSize:14, fontWeight:500, cursor:"pointer",
          }}>Orders</button>
        )}
      </div>

      {/* Right side */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {/* Cart */}
        <button onClick={() => setPage("cart")} style={{
          position:"relative", background: page === "cart" ? "#F1F5F9" : "transparent",
          border:"none", borderRadius:10, padding:"8px 10px", cursor:"pointer",
          display:"flex", alignItems:"center", gap:6, color:"#0F172A",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {count > 0 && (
            <span style={{
              position:"absolute", top:4, right:4,
              background:"#0F172A", color:"white",
              borderRadius:"50%", width:18, height:18,
              fontSize:10, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>{count}</span>
          )}
        </button>

        {/* Auth */}
        {isAuth ? (
          <div style={{ position:"relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              display:"flex", alignItems:"center", gap:8,
              background:"#F8FAFC", border:"1px solid #E2E8F0",
              borderRadius:10, padding:"6px 12px", cursor:"pointer",
            }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"#0F172A", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span style={{ fontSize:14, fontWeight:500, color:"#0F172A" }}>{user?.name?.split(" ")[0]}</span>
            </button>
            {menuOpen && (
              <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"white", border:"1px solid #E2E8F0", borderRadius:12, padding:8, boxShadow:"0 10px 40px rgba(0,0,0,.1)", minWidth:160, zIndex:200 }}>
                <button onClick={() => { setPage("profile"); setMenuOpen(false); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", border:"none", background:"none", borderRadius:8, fontSize:14, cursor:"pointer", color:"#374151" }}>Profile</button>
                <button onClick={() => { logout(); setMenuOpen(false); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", border:"none", background:"none", borderRadius:8, fontSize:14, cursor:"pointer", color:"#EF4444" }}>Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setPage("auth")} style={{
            background:"#0F172A", color:"white",
            border:"none", borderRadius:10, padding:"8px 20px",
            fontSize:14, fontWeight:600, cursor:"pointer",
          }}>Sign in</button>
        )}
      </div>
    </nav>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ setPage, setFilter }) {
  const features = [
    { icon: "⚡", title: "Express Delivery", desc: "Same-day shipping on orders before 2PM" },
    { icon: "↩", title: "Easy Returns", desc: "30-day hassle-free return policy" },
    { icon: "🔒", title: "Secure Payments", desc: "256-bit SSL encrypted checkout" },
    { icon: "✦", title: "Curated Quality", desc: "Every product hand-selected by experts" },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        background:"#0F172A", color:"white",
        padding:"100px 5% 80px", position:"relative", overflow:"hidden",
        minHeight: 500, display:"flex", alignItems:"center",
      }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", right:"-5%", top:"-10%", width:600, height:600, borderRadius:"50%", background:"rgba(99,102,241,.06)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", right:"8%", top:"10%", width:300, height:300, borderRadius:"50%", background:"rgba(99,102,241,.08)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:680, position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:20, padding:"6px 14px", marginBottom:28 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ADE80", display:"inline-block" }}/>
            <span style={{ fontSize:13, color:"rgba(255,255,255,.7)", fontWeight:500 }}>New collection just dropped</span>
          </div>
          <h1 style={{ fontFamily:"Georgia, serif", fontSize:"clamp(40px, 6vw, 72px)", lineHeight:1.1, margin:"0 0 24px", fontWeight:400 }}>
            Thoughtfully<br/>
            <em style={{ fontStyle:"italic", color:"rgba(255,255,255,.55)" }}>crafted</em> goods.
          </h1>
          <p style={{ fontSize:18, color:"rgba(255,255,255,.6)", lineHeight:1.7, margin:"0 0 40px", maxWidth:480 }}>
            Discover objects that live beautifully in everyday life. Curated from independent makers and heritage brands.
          </p>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <button onClick={() => setPage("products")} style={{
              background:"white", color:"#0F172A",
              border:"none", borderRadius:12, padding:"14px 32px",
              fontSize:15, fontWeight:700, cursor:"pointer", letterSpacing:"-.2px",
            }}>Shop Collection →</button>
            <button onClick={() => { setFilter("Electronics"); setPage("products"); }} style={{
              background:"transparent", color:"white",
              border:"1px solid rgba(255,255,255,.25)", borderRadius:12, padding:"14px 28px",
              fontSize:15, fontWeight:500, cursor:"pointer",
            }}>View Electronics</button>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section style={{ padding:"60px 5%", background:"#F8FAFC" }}>
        <p style={{ fontSize:12, fontWeight:600, letterSpacing:3, color:"#94A3B8", textTransform:"uppercase", marginBottom:24 }}>Shop by Category</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:14 }}>
          {CATEGORIES.filter(c => c !== "All").map(cat => {
            const meta = CAT_META[cat];
            return (
              <button key={cat} onClick={() => { setFilter(cat); setPage("products"); }} style={{
                background:"white", border:`1px solid #E2E8F0`,
                borderRadius:14, padding:"20px 16px",
                cursor:"pointer", textAlign:"center",
                transition:"all .2s", boxShadow:"0 1px 4px rgba(0,0,0,.04)",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = meta.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize:28, marginBottom:8 }}>{meta.icon}</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#1E293B" }}>{cat}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:"60px 5%", borderTop:"1px solid #F1F5F9" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:32 }}>
          {features.map(f => (
            <div key={f.title} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ fontSize:24, lineHeight:1 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:"#0F172A", marginBottom:4 }}>{f.title}</div>
                <div style={{ fontSize:13, color:"#64748B", lineHeight:1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onView }) {
  const { add } = useCart();
  const toast = useToast();
  const [adding, setAdding] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true);
    add(product);
    toast(`${product.name} added to cart`);
    setTimeout(() => setAdding(false), 600);
  };

  const meta = CAT_META[product.category] || CAT_META.All;

  return (
    <div onClick={() => onView(product)} style={{
      background:"white", borderRadius:20,
      border:"1px solid #F1F5F9", overflow:"hidden",
      cursor:"pointer", transition:"all .25s",
      boxShadow:"0 2px 8px rgba(0,0,0,.04)",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.10)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      <div style={{ position:"relative", overflow:"hidden" }}>
        <ProductVisual product={product} size={300} />
        {product.stock <= 5 && product.stock > 0 && (
          <div style={{ position:"absolute", top:14, left:14, background:"#FEF3C7", color:"#92400E", fontSize:11, fontWeight:600, borderRadius:6, padding:"3px 8px" }}>
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,.7)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ background:"#0F172A", color:"white", padding:"6px 14px", borderRadius:8, fontSize:13, fontWeight:600 }}>Out of Stock</span>
          </div>
        )}
        {/* Category badge */}
        <div style={{ position:"absolute", bottom:12, right:12, background:meta.bg, color:meta.color, fontSize:11, fontWeight:600, borderRadius:6, padding:"3px 9px", border:`1px solid ${meta.color}22` }}>
          {product.category}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:"16px 18px 18px" }}>
        <h3 style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:400, margin:"0 0 6px", color:"#0F172A", letterSpacing:"-.3px" }}>{product.name}</h3>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize:12, color:"#94A3B8" }}>({product.reviews})</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:20, fontWeight:800, color:"#0F172A", fontFamily:"Georgia, serif" }}>${product.price}</span>
          <button onClick={handleAdd} disabled={product.stock === 0 || adding} style={{
            background: adding ? "#4ADE80" : "#0F172A",
            color:"white", border:"none", borderRadius:10,
            padding:"8px 16px", fontSize:13, fontWeight:600,
            cursor: product.stock === 0 ? "not-allowed" : "pointer",
            transition:"all .2s", opacity: product.stock === 0 ? .4 : 1,
            transform: adding ? "scale(.96)" : "scale(1)",
          }}>
            {adding ? "✓" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL MODAL ────────────────────────────────────────────────────
function ProductModal({ product, onClose }) {
  const { add } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    add(product, qty);
    toast(`${qty}× ${product.name} added to cart`);
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"white", borderRadius:24, maxWidth:700, width:"100%",
        overflow:"hidden", boxShadow:"0 30px 80px rgba(0,0,0,.2)",
        display:"grid", gridTemplateColumns:"1fr 1fr",
      }}>
        <ProductVisual product={product} size={350} />
        <div style={{ padding:32, display:"flex", flexDirection:"column" }}>
          <button onClick={onClose} style={{ alignSelf:"flex-end", background:"#F1F5F9", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:18, color:"#64748B", marginBottom:20 }}>×</button>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:2, color:"#94A3B8", textTransform:"uppercase", marginBottom:8 }}>{product.category}</div>
          <h2 style={{ fontFamily:"Georgia, serif", fontSize:26, fontWeight:400, margin:"0 0 12px", color:"#0F172A", lineHeight:1.2 }}>{product.name}</h2>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <Stars rating={product.rating} size={16} />
            <span style={{ fontSize:13, color:"#64748B" }}>{product.rating} · {product.reviews} reviews</span>
          </div>
          <p style={{ fontSize:14, color:"#475569", lineHeight:1.7, margin:"0 0 24px", flex:1 }}>{product.description}</p>
          <div style={{ fontSize:30, fontWeight:800, color:"#0F172A", fontFamily:"Georgia, serif", marginBottom:20 }}>${product.price}</div>

          {/* Qty selector */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#64748B" }}>Qty</span>
            <div style={{ display:"flex", alignItems:"center", gap:0, border:"1px solid #E2E8F0", borderRadius:10, overflow:"hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding:"8px 14px", border:"none", background:"#F8FAFC", cursor:"pointer", fontSize:16, color:"#0F172A" }}>−</button>
              <span style={{ padding:"8px 16px", fontSize:15, fontWeight:600, color:"#0F172A", minWidth:40, textAlign:"center" }}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ padding:"8px 14px", border:"none", background:"#F8FAFC", cursor:"pointer", fontSize:16, color:"#0F172A" }}>+</button>
            </div>
            <span style={{ fontSize:12, color:"#94A3B8" }}>{product.stock} available</span>
          </div>

          <button onClick={handleAdd} disabled={product.stock === 0} style={{
            background:"#0F172A", color:"white", border:"none",
            borderRadius:12, padding:"14px", fontSize:15, fontWeight:700,
            cursor: product.stock === 0 ? "not-allowed" : "pointer",
            opacity: product.stock === 0 ? .5 : 1,
          }}>
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
function ProductsPage({ filter, setFilter }) {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiFetch(`${API.gateway}/products`)
      .then(data => setProducts(data.products || data))
      .catch(() => {}) // fallback to mock
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => filter === "All" || p.category === filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div style={{ padding:"40px 5% 80px" }}>
      {/* Header */}
      <div style={{ marginBottom:36 }}>
        <p style={{ fontSize:12, fontWeight:600, letterSpacing:3, color:"#94A3B8", textTransform:"uppercase", marginBottom:6 }}>Catalog</p>
        <h1 style={{ fontFamily:"Georgia, serif", fontSize:36, fontWeight:400, margin:0, color:"#0F172A" }}>All Products</h1>
      </div>

      {/* Filters row */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:32, alignItems:"center" }}>
        {/* Search */}
        <div style={{ position:"relative", flex:"1 1 260px", maxWidth:340 }}>
          <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94A3B8" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{
            width:"100%", paddingLeft:38, paddingRight:14, paddingTop:10, paddingBottom:10,
            border:"1px solid #E2E8F0", borderRadius:12, fontSize:14, color:"#0F172A",
            outline:"none", boxSizing:"border-box", background:"white",
          }}/>
        </div>

        {/* Category pills */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              background: filter === c ? "#0F172A" : "white",
              color: filter === c ? "white" : "#475569",
              border:`1px solid ${filter === c ? "#0F172A" : "#E2E8F0"}`,
              borderRadius:20, padding:"7px 16px", fontSize:13,
              fontWeight:500, cursor:"pointer", transition:"all .15s",
            }}>{c}</button>
          ))}
        </div>

        {/* Sort */}
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          border:"1px solid #E2E8F0", borderRadius:12, padding:"8px 14px",
          fontSize:13, color:"#475569", background:"white", cursor:"pointer", outline:"none",
        }}>
          <option value="default">Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Count */}
      <p style={{ fontSize:13, color:"#94A3B8", marginBottom:24 }}>{filtered.length} products</p>

      {/* Grid */}
      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:24 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ background:"#F1F5F9", borderRadius:20, height:360, animation:"pulse 1.5s infinite" }}/>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", color:"#94A3B8" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>◎</div>
          <p style={{ fontSize:16 }}>No products found</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:24 }}>
          {filtered.map(p => <ProductCard key={p._id} product={p} onView={setSelected} />)}
        </div>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// ─── CART PAGE ───────────────────────────────────────────────────────────────
function CartPage({ setPage }) {
  const { items, remove, update, total, clear } = useCart();
  const { isAuth } = useAuth();
  const toast = useToast();

  const handleCheckout = () => {
    if (!isAuth) { toast("Please sign in to checkout", "info"); setPage("auth"); return; }
    toast("Order placed successfully! 🎉");
    clear();
    setPage("orders");
  };

  if (items.length === 0) return (
    <div style={{ padding:"80px 5%", textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:20 }}>◎</div>
      <h2 style={{ fontFamily:"Georgia, serif", fontWeight:400, color:"#0F172A", marginBottom:10 }}>Your cart is empty</h2>
      <p style={{ color:"#64748B", marginBottom:28 }}>Add some beautiful things to get started.</p>
      <button onClick={() => setPage("products")} style={{ background:"#0F172A", color:"white", border:"none", borderRadius:12, padding:"12px 28px", fontSize:15, fontWeight:600, cursor:"pointer" }}>
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div style={{ padding:"40px 5% 80px", maxWidth:900, margin:"0 auto" }}>
      <h1 style={{ fontFamily:"Georgia, serif", fontSize:36, fontWeight:400, margin:"0 0 32px", color:"#0F172A" }}>Cart ({items.length})</h1>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:32, alignItems:"start" }}>
        {/* Items */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {items.map(item => (
            <div key={item._id} style={{ background:"white", border:"1px solid #F1F5F9", borderRadius:16, padding:16, display:"flex", gap:16, alignItems:"center" }}>
              <div style={{ borderRadius:12, overflow:"hidden", flexShrink:0 }}>
                <ProductVisual product={item} size={80} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:400, color:"#0F172A", marginBottom:4 }}>{item.name}</div>
                <div style={{ fontSize:13, color:"#64748B" }}>{item.category}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={() => update(item._id, item.qty - 1)} style={{ width:28, height:28, borderRadius:8, border:"1px solid #E2E8F0", background:"#F8FAFC", cursor:"pointer", fontSize:14 }}>−</button>
                <span style={{ fontSize:15, fontWeight:600, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                <button onClick={() => update(item._id, item.qty + 1)} style={{ width:28, height:28, borderRadius:8, border:"1px solid #E2E8F0", background:"#F8FAFC", cursor:"pointer", fontSize:14 }}>+</button>
              </div>
              <div style={{ fontWeight:700, fontSize:16, color:"#0F172A", minWidth:72, textAlign:"right" }}>${(item.price * item.qty).toFixed(2)}</div>
              <button onClick={() => remove(item._id)} style={{ width:32, height:32, borderRadius:8, border:"none", background:"#FEF2F2", color:"#EF4444", cursor:"pointer", fontSize:16 }}>×</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background:"white", border:"1px solid #F1F5F9", borderRadius:20, padding:24, position:"sticky", top:88 }}>
          <h3 style={{ fontFamily:"Georgia, serif", fontWeight:400, fontSize:20, margin:"0 0 20px", color:"#0F172A" }}>Order Summary</h3>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:14, color:"#64748B" }}>
            <span>Subtotal</span><span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:14, color:"#64748B" }}>
            <span>Shipping</span><span style={{ color:"#4ADE80", fontWeight:600 }}>Free</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:14, color:"#64748B" }}>
            <span>Tax (8%)</span><span>${(total * .08).toFixed(2)}</span>
          </div>
          <div style={{ borderTop:"1px solid #F1F5F9", margin:"16px 0", paddingTop:16, display:"flex", justifyContent:"space-between", fontSize:18, fontWeight:800, color:"#0F172A" }}>
            <span>Total</span><span>${(total * 1.08).toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} style={{
            width:"100%", background:"#0F172A", color:"white",
            border:"none", borderRadius:12, padding:14, fontSize:15,
            fontWeight:700, cursor:"pointer", marginBottom:10,
          }}>Checkout →</button>
          <button onClick={() => setPage("products")} style={{ width:"100%", background:"transparent", color:"#64748B", border:"1px solid #E2E8F0", borderRadius:12, padding:12, fontSize:14, cursor:"pointer" }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ───────────────────────────────────────────────────────────────
function AuthPage({ setPage }) {
  const { login, register } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast("Welcome back!");
      } else {
        await register(form.name, form.email, form.password);
        toast("Account created!");
      }
      setPage("home");
    } catch (e) {
      setError(e.message);
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };
const field = (label, key, type = "text") => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>{label}</label>
      <input
        type={type} value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        style={{
          width:"100%", padding:"11px 14px", border:"1px solid #E2E8F0",
          borderRadius:10, fontSize:14, color:"#0F172A", outline:"none",
          boxSizing:"border-box", transition:"border .15s",
        }}
        onFocus={e => e.target.style.borderColor = "#0F172A"}
        onBlur={e => e.target.style.borderColor = "#E2E8F0"}
      />
    </div>
  );
  

  return (
    <div style={{ minHeight:"calc(100vh - 68px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, background:"#F8FAFC" }}>
      <div style={{ background:"white", borderRadius:24, padding:"40px 36px", maxWidth:420, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,.08)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:48, height:48, background:"#0F172A", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
            <span style={{ color:"white", fontSize:22, fontFamily:"Georgia, serif", fontWeight:800 }}>A</span>
          </div>
          <h2 style={{ fontFamily:"Georgia, serif", fontWeight:400, fontSize:26, margin:"0 0 6px", color:"#0F172A" }}>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p style={{ fontSize:14, color:"#64748B", margin:0 }}>{mode === "login" ? "Sign in to your account" : "Join Arche today"}</p>
        </div>

        {mode === "register" && field("Full Name", "name")}
        {field("Email", "email", "email")}
        {field("Password", "password", "password")}

        {error && <div style={{ background:"#FEF2F2", color:"#DC2626", borderRadius:8, padding:"10px 12px", fontSize:13, marginBottom:16 }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width:"100%", background:"#0F172A", color:"white",
          border:"none", borderRadius:12, padding:14, fontSize:15,
          fontWeight:700, cursor: loading ? "wait" : "pointer",
          opacity: loading ? .7 : 1, marginBottom:16,
        }}>
          {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>

        <p style={{ textAlign:"center", fontSize:14, color:"#64748B", margin:0 }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background:"none", border:"none", color:"#0F172A", fontWeight:700, cursor:"pointer", fontSize:14 }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── ORDERS PAGE ─────────────────────────────────────────────────────────────
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) return;
    apiFetch(`${API.gateway}/orders`)
      .then(data => setOrders(data.orders || data))
      .catch(() => {
        // Mock orders
        setOrders([
          { _id: "ORD-001", createdAt: new Date(Date.now() - 86400000*2).toISOString(), status:"Delivered", total:327, items:[{ name:"Arc Desk Lamp", qty:1, price:129 },{ name:"Ceramic Pour-Over Set", qty:2, price:74 }] },
          { _id: "ORD-002", createdAt: new Date(Date.now() - 86400000*5).toISOString(), status:"Processing", total:249, items:[{ name:"Wireless Earbuds Pro", qty:1, price:249 }] },
        ]);
      })
      .finally(() => setLoading(false));
  }, [isAuth]);

  if (!isAuth) return (
    <div style={{ padding:"80px 5%", textAlign:"center" }}>
      <p style={{ color:"#64748B" }}>Please sign in to view your orders.</p>
    </div>
  );

  const statusColor = s => ({ Delivered:"#4ADE80", Processing:"#F59E0B", Cancelled:"#EF4444" }[s] || "#94A3B8");

  return (
    <div style={{ padding:"40px 5% 80px", maxWidth:780, margin:"0 auto" }}>
      <h1 style={{ fontFamily:"Georgia, serif", fontSize:36, fontWeight:400, margin:"0 0 32px", color:"#0F172A" }}>Your Orders</h1>
      {loading ? (
        <div style={{ color:"#64748B" }}>Loading…</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#94A3B8" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>◎</div>
          <p>No orders yet</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {orders.map(order => (
            <div key={order._id} style={{ background:"white", border:"1px solid #F1F5F9", borderRadius:20, padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:"#0F172A" }}>{order._id}</div>
                  <div style={{ fontSize:13, color:"#94A3B8", marginTop:2 }}>{new Date(order.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })}</div>
                </div>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ background: statusColor(order.status) + "22", color: statusColor(order.status), fontSize:12, fontWeight:700, borderRadius:20, padding:"4px 12px" }}>{order.status}</div>
                  <div style={{ fontWeight:800, fontSize:18, color:"#0F172A" }}>${order.total}</div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:14, color:"#475569" }}>
                    <span>{item.qty}× {item.name}</span>
                    <span>${item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiFetch(`${API.gateway}/users/profile`)
      .then(setProfile)
      .catch(() => setProfile(user));
  }, [user]);

  const info = profile || user;

  return (
    <div style={{ padding:"40px 5% 80px", maxWidth:600, margin:"0 auto" }}>
      <h1 style={{ fontFamily:"Georgia, serif", fontSize:36, fontWeight:400, margin:"0 0 32px", color:"#0F172A" }}>Profile</h1>
      <div style={{ background:"white", border:"1px solid #F1F5F9", borderRadius:24, padding:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:32 }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"#0F172A", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700, fontFamily:"Georgia, serif" }}>
            {info?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:700, color:"#0F172A", marginBottom:4 }}>{info?.name}</div>
            <div style={{ fontSize:14, color:"#64748B" }}>{info?.email}</div>
          </div>
        </div>

        {[["Member since", new Date().getFullYear()], ["Role", info?.role || "Customer"], ["Account", "Active"]].map(([label, val]) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"14px 0", borderBottom:"1px solid #F8FAFC", fontSize:14 }}>
            <span style={{ color:"#64748B" }}>{label}</span>
            <span style={{ fontWeight:600, color:"#0F172A" }}>{val}</span>
          </div>
        ))}

        <button onClick={logout} style={{ marginTop:24, width:"100%", background:"#FEF2F2", color:"#EF4444", border:"1px solid #FECACA", borderRadius:12, padding:13, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function Demo() {
  const [page, setPage] = useState("home");
  const [filter, setFilter] = useState("All");

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <div style={{ minHeight:"100vh", background:"#FAFAFA", fontFamily:"system-ui, -apple-system, sans-serif" }}>
            <style>{`
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

            <Navbar page={page} setPage={setPage} />

            {page === "home"     && <HomePage setPage={setPage} setFilter={setFilter} />}
            {page === "products" && <ProductsPage filter={filter} setFilter={setFilter} />}
            {page === "cart"     && <CartPage setPage={setPage} />}
            {page === "auth"     && <AuthPage setPage={setPage} />}
            {page === "orders"   && <OrdersPage />}
            {page === "profile"  && <ProfilePage />}

            {/* Footer */}
            <footer style={{ background:"#0F172A", color:"rgba(255,255,255,.4)", padding:"40px 5%", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:28, height:28, background:"white", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:"#0F172A", fontSize:14, fontWeight:800, fontFamily:"Georgia, serif" }}>A</span>
                </div>
                <span style={{ color:"rgba(255,255,255,.7)", fontFamily:"Georgia, serif", fontSize:16 }}>Arche</span>
              </div>
              <div style={{ fontSize:12 }}>
                Services: Auth :5001 · Users :5002 · Products :5003 · Gateway :5000
              </div>
              <div style={{ fontSize:12 }}>© 2026 Arche. All rights reserved.</div>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}