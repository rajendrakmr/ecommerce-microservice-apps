// import { useCart } from "../context/CartContext";

import { useState } from "react";
import { CAT_META } from "../constants/categories";
import { useToast } from "../context/ToastContext";
import { API_ENDPOINTS } from "../utils/endpoints";
import { apiRequest } from "../utils/apiRequest";

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

const Stars = ({ rating, size = 14 }) => (
  <span style={{ fontSize: size, letterSpacing: 1 }}>
    {[1, 2, 3, 4, 5].map(n => (
      <span key={n} style={{ color: n <= Math.round(rating) ? "#F59E0B" : "#E5E7EB" }}>★</span>
    ))}
  </span>
);



function ProductModal({ product, onClose }) {
  const toast = useToast();
  const [qty, setQty] = useState(1);
  // const toast = useToast(); 
  if (!product) return null;

  const handleAdd = async () => {
    if (product.stock === 0 || adding) return;

    setAdding(true);
    try {
      const response = await apiRequest({
        url: API_ENDPOINTS.ADD_TO_CART,
        method: "POST",
        data: product
      });
      toast(`${qty}× ${product.name} added to cart`);
      onClose();
    } catch (err) {
      console.log(err, 'errerr')
      const message = err?.response?.data?.message || "Something went wrong";
      toast(message, "error");
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

}
export default function ProductCard({ product, onView }) {
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
    <div
      onClick={() => onView(product)}
      style={{
        background: "white",
        borderRadius: 20,
        border: "1px solid #F1F5F9",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all .25s",
        boxShadow: "0 2px 8px rgba(0,0,0,.04)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.10)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <ProductVisual product={product} size={300} />
        {product.stock > 0 && product.stock <= 5 && (
          <div style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "#FEF3C7",
            color: "#92400E",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 6,
            padding: "3px 8px"
          }}>
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{
              background: "#0F172A",
              color: "white",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600
            }}>
              Out of Stock
            </span>
          </div>
        )}

        {/* Category badge */}
        <div style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          background: meta.bg,
          color: meta.color,
          fontSize: 11,
          fontWeight: 600,
          borderRadius: 6,
          padding: "3px 9px",
          border: `1px solid ${meta.color}22`
        }}>
          {product.category}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 18px" }}>
        <h3 style={{
          fontFamily: "Georgia, serif",
          fontSize: 16,
          fontWeight: 400,
          margin: "0 0 6px",
          color: "#0F172A",
          letterSpacing: "-.3px"
        }}>{product.name}</h3>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 12, color: "#94A3B8" }}>({product.reviews})</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#0F172A",
            fontFamily: "Georgia, serif"
          }}>${product.price}</span>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0 || adding}
            style={{
              background: adding ? "#4ADE80" : "#0F172A",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
              transition: "all .2s",
              opacity: product.stock === 0 ? 0.4 : 1,
              transform: adding ? "scale(.96)" : "scale(1)"
            }}
          >
            {adding ? "✓" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}