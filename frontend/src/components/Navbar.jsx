import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../utils/apiRequest";
import { API_ENDPOINTS } from "../utils/endpoints";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);

  const isAuth = !!user;

  // Current page derived from URL
  const page = location.pathname.replace("/", "") || "home";

  // Load user from localStorage on mount
  useEffect(() => {
    const authData = localStorage.getItem("auth_data");
    if (authData) {
      const { userInfo } = JSON.parse(authData);
      setUser(userInfo);
    }
  }, []);

  // Fetch cart count when auth or page changes
  useEffect(() => {
    if (!isAuth) return;
    const fetchCartCount = async () => {
      try {
        const response = await apiRequest({
          url: API_ENDPOINTS.CART,
          method: "GET",
        });
        setCount(response.item?.length || 0);
      } catch (err) {
        console.error("Failed to fetch cart count", err);
      }
    };
    fetchCartCount();
  }, [isAuth, page]);

  // Logout function
  const logout = () => {
    localStorage.removeItem("auth_data");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,.92)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid #F1F5F9", padding: "0 5%", height: 68,
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      {/* Logo */}
      <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, background: "#0F172A", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: 18, fontWeight: 800, fontFamily: "Georgia, serif" }}>A</span>
        </div>
        <span style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#0F172A", letterSpacing: "-.5px" }}>Arche</span>
      </button>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button onClick={() => navigate("/products")} style={{
          background: page === "products" ? "#0F172A" : "transparent",
          color: page === "products" ? "white" : "#475569",
          border: "none", borderRadius: 8, padding: "7px 16px",
          fontSize: 14, fontWeight: 500, cursor: "pointer"
        }}>Shop</button>

        {isAuth && (
          <button onClick={() => navigate("/orders")} style={{
            background: page === "orders" ? "#0F172A" : "transparent",
            color: page === "orders" ? "white" : "#475569",
            border: "none", borderRadius: 8, padding: "7px 16px",
            fontSize: 14, fontWeight: 500, cursor: "pointer"
          }}>Orders</button>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Cart */}
        <button onClick={() => navigate("/cart")} style={{
          position: "relative", background: page === "cart" ? "#F1F5F9" : "transparent",
          border: "none", borderRadius: 10, padding: "8px 10px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, color: "#0F172A"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {count > 0 && (
            <span style={{
              position: "absolute", top: 4, right: 4,
              background: "#0F172A", color: "white",
              borderRadius: "50%", width: 18, height: 18,
              fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>{count}</span>
          )}
        </button>

        {/* Auth */}
        {isAuth ? (
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#F8FAFC", border: "1px solid #E2E8F0",
              borderRadius: 10, padding: "6px 12px", cursor: "pointer"
            }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#0F172A", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#0F172A" }}>{user?.name?.split(" ")[0]}</span>
            </button>

            {menuOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 8, boxShadow: "0 10px 40px rgba(0,0,0,.1)", minWidth: 160, zIndex: 200 }}>
                <button onClick={() => { navigate("/profile"); setMenuOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#374151" }}>Profile</button>
                <button onClick={() => { logout(); setMenuOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#EF4444" }}>Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate("/login")} style={{
            background: "#0F172A", color: "white",
            border: "none", borderRadius: 10, padding: "8px 20px",
            fontSize: 14, fontWeight: 600, cursor: "pointer"
          }}>Sign in</button>
        )}
      </div>
    </nav>
  );
}