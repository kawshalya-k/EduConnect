// client/src/components/Dashboard/CoinBalance.jsx

export default function CoinBalance({ balance = 100 }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "#E1F5EE",
      padding: "6px 14px",
      borderRadius: "20px",
      cursor: "pointer",
      transition: "background 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "#C8EFE0"}
    onMouseLeave={e => e.currentTarget.style.background = "#E1F5EE"}
    >
      <span style={{ fontSize: "16px" }}>🪙</span>
      <span style={{
        fontSize: "13px",
        fontWeight: "600",
        color: "#0F6E56",
      }}>
        {balance.toLocaleString()} Skill Wallet
      </span>
    </div>
  );
}
