import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/apiRequest";
import { API_ENDPOINTS } from "../utils/endpoints";
import { getCurrentUser, isLoggedIn } from "../utils/helper";
import { CAT_META } from "../constants/categories";

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
export default function Cart({ setPage }) {
    const isAuth = isLoggedIn();
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentUser = getCurrentUser()
    // Fetch cart items
    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const response = await apiRequest({
                    url: API_ENDPOINTS.CART,
                    method: "GET",
                });
                setItems(response.item || []);
            } catch (err) {
                toast("Failed to load cart", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = async () => { 
        if (!isAuth) {
            toast("Please sign in to checkout", "info"); 
            return;
        }
        const payload = {
                    userId: currentUser.id,
                    items,
                    total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
                }
        try {
            console.log(payload,'payloadpayloadpayloadpayloadpayload')
            if (!currentUser) throw new Error("User info missing");
            const response = await apiRequest({
                url: API_ENDPOINTS.ORDERS,
                method: "POST",
                data:payload ,
            });

            await apiRequest({
                url: API_ENDPOINTS.REMOVE_ALL_CART,
                method: "DELETE",
                data: {},
            });
            toast("Order placed successfully! 🎉");
            setItems([]);
            setPage("orders");
        } catch (err) {
            console.error(err);
            const message = err?.response?.data?.message || "Failed to place order";
            toast(message, "error");
        }
    };

    if (loading) return <p style={{ padding: 40 }}>Loading cart...</p>;
    if (items.length === 0)
        return (
            <div style={{ padding: "80px 5%", textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>◎</div>
                <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, color: "#0F172A", marginBottom: 10 }}>
                    Your cart is empty
                </h2>
                <p style={{ color: "#64748B", marginBottom: 28 }}>Add some beautiful things to get started.</p>
                <button
                    onClick={() => setPage("products")}
                    style={{
                        background: "#0F172A",
                        color: "white",
                        border: "none",
                        borderRadius: 12,
                        padding: "12px 28px",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Continue Shopping
                </button>
            </div>
        );

    return (
        <div style={{ padding: "40px 5% 80px", maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 400, margin: "0 0 32px", color: "#0F172A" }}>
                Cart ({items.length})
            </h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                background: "white",
                                border: "1px solid #F1F5F9",
                                borderRadius: 16,
                                padding: 16,
                                display: "flex",
                                gap: 16,
                                alignItems: "center",
                            }}
                        >
                            <div style={{ borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                                <ProductVisual product={item} size={80} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 400, color: "#0F172A", marginBottom: 4 }}>
                                    {item.name}
                                </div>
                                <div style={{ fontSize: 13, color: "#64748B" }}>{item.category}</div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", minWidth: 72, textAlign: "right" }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div
                    style={{
                        background: "white",
                        border: "1px solid #F1F5F9",
                        borderRadius: 20,
                        padding: 24,
                        position: "sticky",
                        top: 88,
                    }}
                >
                    <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 20px", color: "#0F172A" }}>
                        Order Summary
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, color: "#64748B" }}>
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, color: "#64748B" }}>
                        <span>Shipping</span>
                        <span style={{ color: "#4ADE80", fontWeight: 600 }}>Free</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, color: "#64748B" }}>
                        <span>Tax (8%)</span>
                        <span>${(total * 0.08).toFixed(2)}</span>
                    </div>
                    <div
                        style={{
                            borderTop: "1px solid #F1F5F9",
                            margin: "16px 0",
                            paddingTop: 16,
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#0F172A",
                        }}
                    >
                        <span>Total</span>
                        <span>${(total * 1.08).toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        style={{
                            width: "100%",
                            background: "#0F172A",
                            color: "white",
                            border: "none",
                            borderRadius: 12,
                            padding: 14,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: 10,
                        }}
                    >
                        Checkout →
                    </button>
                    <button
                        onClick={() => setPage("products")}
                        style={{
                            width: "100%",
                            background: "transparent",
                            color: "#64748B",
                            border: "1px solid #E2E8F0",
                            borderRadius: 12,
                            padding: 12,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}