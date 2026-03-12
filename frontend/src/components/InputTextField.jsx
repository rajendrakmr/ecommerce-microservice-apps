const InputTextField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error
}) => {
  return (
    <div style={{ marginBottom: 16 }}> 
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          display: "block",
          marginBottom: 6
        }}
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "11px 14px",
          border: error ? "1px solid #EF4444" : "1px solid #E2E8F0",
          borderRadius: 10,
          fontSize: 14,
          color: "#0F172A",
          outline: "none",
          boxSizing: "border-box",
          transition: "border .15s"
        }}
      />

      {error && (
        <p
          style={{
            color: "#EF4444",
            fontSize: 12,
            marginTop: 4
          }}
        >
          {error}
        </p>
      )}

    </div>
  );
};

export default InputTextField;