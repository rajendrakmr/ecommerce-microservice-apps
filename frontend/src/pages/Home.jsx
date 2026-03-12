import { useState } from "react";
import { CAT_META, CATEGORIES } from "../constants/categories";

export default function Home() { 
      const [pages, setPage] = useState("All");
      const [filter, setFilter] = useState("All");
    
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
