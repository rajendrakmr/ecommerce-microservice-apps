import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { isLoggedIn } from "../utils/helper";
import { apiRequest } from "../utils/apiRequest";
import { API_ENDPOINTS } from "../utils/endpoints";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const isAuth = isLoggedIn();

  useEffect(() => {
    if (!isAuth) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await apiRequest({
          url: API_ENDPOINTS.ORDERS, // should be something like "/orders"
          method: "GET",
        });
        setOrders(response.orders || []);
      } catch (err) {
        toast("Failed to fetch orders", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuth]);

  if (!isAuth) {
    return (
      <div style={{ padding: "80px 5%", textAlign: "center" }}>
        <p style={{ color: "#64748B" }}>Please sign in to view your orders.</p>
      </div>
    );
  }

  const statusColor = (status) =>
    ({ Delivered: "#4ADE80", Processing: "#F59E0B", Cancelled: "#EF4444" }[status] || "#94A3B8");

  return (
    <div style={{ padding: "40px 5% 80px", maxWidth: 780, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 400, margin: "0 0 32px", color: "#0F172A" }}>
        Your Orders
      </h1>

      {loading ? (
        <div style={{ color: "#64748B" }}>Loading…</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>◎</div>
          <p>No orders yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => (
            <div key={order._id} style={{ background: "white", border: "1px solid #F1F5F9", borderRadius: 20, padding: 24 }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{order._id}</div>
                  <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      background: statusColor(order.status) + "22",
                      color: statusColor(order.status),
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 20,
                      padding: "4px 12px",
                    }}
                  >
                    {order.status}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#0F172A" }}>${order.total}</div>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475569" }}>
                    <span>
                      {item.quantity || item.qty}× {item.name}
                    </span>
                    <span>${((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(2)}</span>
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