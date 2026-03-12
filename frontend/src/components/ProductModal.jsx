import { useState } from "react";

export default function ProductModal({ product, onClose }) {
    const { add } = {}
    const toast = {};
    const [qty, setQty] = useState(1);

    if (!product) return null;

    const handleAdd = () => {
        // add(product, qty);
        // toast(`${qty}× ${product.name} added to cart`);
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