import { useState } from "react";
import InputTextField from "../../components/InputTextField";
import { useToast } from "../../context/ToastContext";
import { apiRequest } from "../../utils/apiRequest";
import { API_ENDPOINTS } from "../../utils/endpoints";

export default function Login() {
    const toast = useToast();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await apiRequest({
                url: API_ENDPOINTS.LOGIN,
                method: "POST",
                data: formData
            });
            localStorage.setItem(
                "auth_data",
                JSON.stringify({
                    token: response.token,
                     userInfo: response.user
                })
            );
             console.log('response',response)
            toast("Login successful", "success");
            window.location.href = "/";

        } catch (err) { 
            err?.data?.errors?setErrors(err?.data?.errors):setErrors({})
            const message = err?.response?.data?.message || "Invalid email or password";
            toast(message, "error");
        } finally {
            setLoading(false);
        }
    };
    return (

        <div style={{
            minHeight: "calc(100vh - 68px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "#F8FAFC"
        }}>

            <form
                onSubmit={submit}
                style={{
                    background: "white",
                    borderRadius: 24,
                    padding: "40px 36px",
                    maxWidth: 420,
                    width: "100%",
                    boxShadow: "0 20px 60px rgba(0,0,0,.08)"
                }}
            >

                <div style={{ textAlign: "center", marginBottom: 32 }}>

                    <h2 style={{
                        fontFamily: "Georgia, serif",
                        fontWeight: 400,
                        fontSize: 26,
                        margin: "0 0 6px",
                        color: "#0F172A"
                    }}>
                        Welcome back
                    </h2>

                    <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
                        Sign in to your account
                    </p>

                </div>

                <InputTextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    error={errors.email}
                    onChange={handleChange}
                />

                <InputTextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    error={errors.password}
                    onChange={handleChange}
                />

                {error && (
                    <div style={{
                        background: "#FEF2F2",
                        color: "#DC2626",
                        borderRadius: 8,
                        padding: "10px 12px",
                        fontSize: 13,
                        marginBottom: 16
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: "#0F172A",
                        color: "white",
                        border: "none",
                        borderRadius: 12,
                        padding: 14,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: loading ? "wait" : "pointer",
                        opacity: loading ? .7 : 1,
                        marginBottom: 16
                    }}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
                <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", margin: 0 }}>
                    Don't have an account?
                    <button style={{ background: "none", border: "none", color: "#0F172A", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                        Sign up
                    </button>
                </p>

            </form>

        </div>
    );
}