// import { useCart } from "../context/CartContext";

import { useState } from "react";
import { CAT_META } from "../constants/categories";

export default function ProductCard({ product, onView }) {
  const { add } = {};
  const toast = {}
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