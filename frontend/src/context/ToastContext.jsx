import { createContext, useState, useCallback, useContext } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);

  }, []);

  return (
    <ToastCtx.Provider value={showToast}>

      {children}

      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
        {toasts.map(t => (
          <Toast key={t.id} toast={t} />
        ))}
      </div>

    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}

function Toast({ toast }) {
  const { msg, type } = toast;

  const bg =
    type === "error"
      ? "#FEF2F2"
      : type === "info"
        ? "#EFF6FF"
        : "#F0FDF4";

  const border =
    type === "error"
      ? "#FECACA"
      : type === "info"
        ? "#BFDBFE"
        : "#BBF7D0";

  const color =
    type === "error"
      ? "#DC2626"
      : type === "info"
        ? "#2563EB"
        : "#16A34A";

  const icon =
    type === "success"
      ? "✓"
      : type === "error"
        ? "✕"
        : "ℹ";

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color: color,
        borderRadius: 12,
        padding: "12px 18px",
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,.08)",
        minWidth: 240,
        animation: "slideIn .3s ease"
      }}
    >
      {icon} {msg}
    </div>
  );
}