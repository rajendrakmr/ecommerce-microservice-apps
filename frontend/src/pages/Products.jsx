import { useEffect, useState } from "react";
import { CAT_META, CATEGORIES } from "../constants/categories";
import { apiRequest } from "../utils/apiRequest";
import { API_ENDPOINTS } from "../utils/endpoints";
import { useToast } from "../context/ToastContext";

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onView }) {
    const toast = useToast();
    const [adding, setAdding] = useState(false);
    const handleAdd = async (e) => {
        e.stopPropagation();
        if (product.stock === 0 || adding) return;

        setAdding(true);
        try {
            const response = await apiRequest({
                url: API_ENDPOINTS.ADD_TO_CART,
                method: "POST",
                data: product
            });

            // Success toast
            toast(`${product.name} added to cart`, "success");
        } catch (err) {
            console.log(err, 'errerr')
            const message = err?.response?.data?.message || "Something went wrong";
            toast(message, "error");
        } finally {
            setTimeout(() => setAdding(false), 600);
        }
    };
    const meta = CAT_META[product.category] || CAT_META.All;

    return (
        <div onClick={() => onView(product)} style={{
            background: "white", borderRadius: 20,
            border: "1px solid #F1F5F9", overflow: "hidden",
            cursor: "pointer", transition: "all .25s",
            boxShadow: "0 2px 8px rgba(0,0,0,.04)",
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.10)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
            {/* Image */}
            <div style={{ position: "relative", overflow: "hidden" }}>
                <ProductVisual product={product} size={300} />
                {product.stock <= 5 && product.stock > 0 && (
                    <div style={{ position: "absolute", top: 14, left: 14, background: "#FEF3C7", color: "#92400E", fontSize: 11, fontWeight: 600, borderRadius: 6, padding: "3px 8px" }}>
                        Only {product.stock} left
                    </div>
                )}
                {product.stock === 0 && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ background: "#0F172A", color: "white", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Out of Stock</span>
                    </div>
                )}
                {/* Category badge */}
                <div style={{ position: "absolute", bottom: 12, right: 12, background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 600, borderRadius: 6, padding: "3px 9px", border: `1px solid ${meta.color}22` }}>
                    {product.category}
                </div>
            </div>

            {/* Info */}
            <div style={{ padding: "16px 18px 18px" }}>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 400, margin: "0 0 6px", color: "#0F172A", letterSpacing: "-.3px" }}>{product.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <Stars rating={product.rating} />
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>({product.reviews})</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "Georgia, serif" }}>${product.price}</span>
                    <button onClick={handleAdd} disabled={product.stock === 0 || adding} style={{
                        background: adding ? "#4ADE80" : "#0F172A",
                        color: "white", border: "none", borderRadius: 10,
                        padding: "8px 16px", fontSize: 13, fontWeight: 600,
                        cursor: product.stock === 0 ? "not-allowed" : "pointer",
                        transition: "all .2s", opacity: product.stock === 0 ? .4 : 1,
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
    const toast = useToast();
    const [qty, setQty] = useState(1);

    if (!product) return null;
    const handleAdd = async () => {
        const response = await apiRequest({
            url: API_ENDPOINTS.ADD_TO_CART,
            method: "POST",
            data: product
        });

        // Success toast
        //   toast(`${product.name} added to cart`, "success");
        toast(`${qty}× ${product.name} added to cart`);
        onClose();
    };

    return (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: "white", borderRadius: 24, maxWidth: 700, width: "100%",
                overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.2)",
                display: "grid", gridTemplateColumns: "1fr 1fr",
            }}>
                <ProductVisual product={product} size={350} />
                <div style={{ padding: 32, display: "flex", flexDirection: "column" }}>
                    <button onClick={onClose} style={{ alignSelf: "flex-end", background: "#F1F5F9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: "#64748B", marginBottom: 20 }}>×</button>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "#94A3B8", textTransform: "uppercase", marginBottom: 8 }}>{product.category}</div>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 400, margin: "0 0 12px", color: "#0F172A", lineHeight: 1.2 }}>{product.name}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <Stars rating={product.rating} size={16} />
                        <span style={{ fontSize: 13, color: "#64748B" }}>{product.rating} · {product.reviews} reviews</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 24px", flex: 1 }}>{product.description}</p>
                    <div style={{ fontSize: 30, fontWeight: 800, color: "#0F172A", fontFamily: "Georgia, serif", marginBottom: 20 }}>${product.price}</div>

                    {/* Qty selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>Qty</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
                            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "8px 14px", border: "none", background: "#F8FAFC", cursor: "pointer", fontSize: 16, color: "#0F172A" }}>−</button>
                            <span style={{ padding: "8px 16px", fontSize: 15, fontWeight: 600, color: "#0F172A", minWidth: 40, textAlign: "center" }}>{qty}</span>
                            <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ padding: "8px 14px", border: "none", background: "#F8FAFC", cursor: "pointer", fontSize: 16, color: "#0F172A" }}>+</button>
                        </div>
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>{product.stock} available</span>
                    </div>

                    <button onClick={handleAdd} disabled={product.stock === 0} style={{
                        background: "#0F172A", color: "white", border: "none",
                        borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700,
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
const ProductVisual = ({ product, size = 200 }) => {
    const meta = CAT_META[product.category] || CAT_META.All;
    const shapes = {
        Electronics: <><circle cx="100" cy="90" r="40" fill={meta.color} opacity=".15" /><rect x="70" y="60" width="60" height="40" rx="8" fill={meta.color} opacity=".9" /><rect x="85" y="105" width="30" height="6" rx="3" fill={meta.color} opacity=".5" /><circle cx="100" cy="80" r="8" fill="white" opacity=".8" /></>,
        Fashion: <><ellipse cx="100" cy="95" rx="45" ry="55" fill={meta.color} opacity=".15" /><path d="M70 70 Q100 50 130 70 L120 130 Q100 140 80 130 Z" fill={meta.color} opacity=".85" /><path d="M85 70 Q100 80 115 70" stroke="white" strokeWidth="3" fill="none" opacity=".7" /></>,
        Home: <><rect x="55" y="80" width="90" height="60" rx="4" fill={meta.color} opacity=".15" /><rect x="60" y="85" width="80" height="50" rx="3" fill={meta.color} opacity=".8" /><rect x="80" y="100" width="20" height="30" rx="2" fill="white" opacity=".6" /><circle cx="120" cy="115" r="12" fill="white" opacity=".5" /></>,
        Kitchen: <><circle cx="100" cy="95" r="48" fill={meta.color} opacity=".12" /><ellipse cx="100" cy="95" rx="35" ry="30" fill={meta.color} opacity=".8" /><rect x="95" y="55" width="10" height="25" rx="5" fill={meta.color} opacity=".7" /><ellipse cx="100" cy="95" rx="20" ry="16" fill="white" opacity=".3" /></>,
        Stationery: <><rect x="65" y="55" width="70" height="90" rx="6" fill={meta.color} opacity=".15" /><rect x="70" y="60" width="60" height="80" rx="4" fill={meta.color} opacity=".8" /><line x1="82" y1="80" x2="118" y2="80" stroke="white" strokeWidth="2" opacity=".6" /><line x1="82" y1="92" x2="118" y2="92" stroke="white" strokeWidth="2" opacity=".6" /><line x1="82" y1="104" x2="105" y2="104" stroke="white" strokeWidth="2" opacity=".6" /></>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: "block" }}>
            <rect width="200" height="200" fill={meta.bg} />
            {shapes[product.category] || <circle cx="100" cy="100" r="50" fill={meta.color} opacity=".3" />}
        </svg>
    );
};

// ─── STAR RATING ─────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 14 }) => (
    <span style={{ fontSize: size, letterSpacing: 1 }}>
        {[1, 2, 3, 4, 5].map(n => (
            <span key={n} style={{ color: n <= Math.round(rating) ? "#F59E0B" : "#E5E7EB" }}>★</span>
        ))}
    </span>
);
export default function Products() {
    const [filter, setFilter] = useState("All");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiRequest({
                    url: API_ENDPOINTS.PRODUCTS,
                    method: "GET",
                });
                setProducts(response.products || []);
            } catch (err) {
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
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
        <div style={{ padding: "40px 5% 80px" }}>
            {/* Header */}
            <div style={{ marginBottom: 36 }}>
                <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 3, color: "#94A3B8", textTransform: "uppercase", marginBottom: 6 }}>Catalog</p>
                <h1 style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 400, margin: 0, color: "#0F172A" }}>All Products</h1>
            </div>

            {/* Filters row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32, alignItems: "center" }}>
                {/* Search */}
                <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 340 }}>
                    <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search products…"
                        style={{
                            width: "100%", paddingLeft: 38, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
                            border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 14, color: "#0F172A",
                            outline: "none", boxSizing: "border-box", background: "white",
                        }}
                    />
                </div>

                {/* Category pills */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setFilter(c)} style={{
                            background: filter === c ? "#0F172A" : "white",
                            color: filter === c ? "white" : "#475569",
                            border: `1px solid ${filter === c ? "#0F172A" : "#E2E8F0"}`,
                            borderRadius: 20, padding: "7px 16px", fontSize: 13,
                            fontWeight: 500, cursor: "pointer", transition: "all .15s",
                        }}>{c}</button>
                    ))}
                </div>

                {/* Sort */}
                <select value={sort} onChange={e => setSort(e.target.value)} style={{
                    border: "1px solid #E2E8F0", borderRadius: 12, padding: "8px 14px",
                    fontSize: 13, color: "#475569", background: "white", cursor: "pointer", outline: "none",
                }}>
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                </select>
            </div>

            {/* Error */}
            {error && <p style={{ color: "#EF4444", marginBottom: 24 }}>{error}</p>}

            {/* Count */}
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>{filtered.length} products</p>

            {/* Grid */}
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{ background: "#F1F5F9", borderRadius: 20, height: 360, animation: "pulse 1.5s infinite" }} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "#94A3B8" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>◎</div>
                    <p style={{ fontSize: 16 }}>No products found</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
                    {filtered.map(p => <ProductCard key={p._id} product={p} onView={setSelected} />)}
                </div>
            )}

            <ProductModal product={selected} onClose={() => setSelected(null)} />
        </div>
    );
}