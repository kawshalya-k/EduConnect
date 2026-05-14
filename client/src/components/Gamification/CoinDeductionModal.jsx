// client/src/components/Gamification/CoinDeductionModal.jsx

export default function CoinDeductionModal({
  mentorName,
  skill,
  cost,
  currentBalance,
  onConfirm,
  onCancel,
}) {
  const remaining    = currentBalance - cost;
  const canAfford    = currentBalance >= cost;

  return (
    /* ── Backdrop ── */
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 9999,
      fontFamily: "Arial, sans-serif",
    }}>
      {/* ── Modal Box ── */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "32px",
        width: "400px",
        maxWidth: "90vw",
        boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
      }}>

        {/* Icon */}
        <div style={{
          width: "56px", height: "56px",
          borderRadius: "16px",
          background: canAfford ? "#E1F5EE" : "#FEE2E2",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "28px",
          marginBottom: "16px",
        }}>
          {canAfford ? "🪙" : "⚠️"}
        </div>

        {/* Title */}
        <p style={{ margin: "0 0 6px", fontWeight: "700", fontSize: "20px" }}>
          {canAfford ? "Confirm Booking" : "Insufficient Coins"}
        </p>

        {/* Description */}
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#888", lineHeight: "1.6" }}>
          {canAfford
            ? `You are about to book a session with ${mentorName} for ${skill}.`
            : `You don't have enough coins to book this session.`
          }
        </p>

        {/* Session details card */}
        <div style={{
          background: "#F9F9F9",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: "10px",
          }}>
            <span style={{ fontSize: "13px", color: "#888" }}>Session with</span>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>{mentorName}</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: "10px",
          }}>
            <span style={{ fontSize: "13px", color: "#888" }}>Skill</span>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>{skill}</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: "10px",
            borderTop: "1px dashed #E0E0E0", paddingTop: "10px",
          }}>
            <span style={{ fontSize: "13px", color: "#888" }}>Session Cost</span>
            <span style={{
              fontSize: "13px", fontWeight: "700",
              color: "#E24B4A",
            }}>- {cost} Coins</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "13px", color: "#888" }}>Your Balance</span>
            <span style={{
              fontSize: "13px", fontWeight: "600",
            }}>{currentBalance.toLocaleString()} Coins</span>
          </div>
          {canAfford && (
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: "10px",
              borderTop: "1px solid #E0E0E0", paddingTop: "10px",
            }}>
              <span style={{ fontSize: "13px", color: "#888" }}>Remaining Balance</span>
              <span style={{
                fontSize: "13px", fontWeight: "700",
                color: "#1D9E75",
              }}>{remaining.toLocaleString()} Coins</span>
            </div>
          )}
        </div>

        {/* Not enough coins tips */}
        {!canAfford && (
          <div style={{
            background: "#FEF3C7", borderRadius: "12px",
            padding: "14px", marginBottom: "20px",
          }}>
            <p style={{ margin: "0 0 8px", fontWeight: "600", fontSize: "13px", color: "#92400E" }}>
              Ways to earn more coins:
            </p>
            {[
              "Complete a weekly challenge (+50 coins)",
              "Help peers in the community (+10 per answer)",
              "Maintain a 7-day learning streak (+100 coins)",
            ].map((tip, i) => (
              <p key={i} style={{ margin: "4px 0", fontSize: "12px", color: "#78350F" }}>
                • {tip}
              </p>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "12px",
              border: "1px solid #E0E0E0",
              borderRadius: "10px", background: "#fff",
              color: "#555", fontWeight: "600",
              fontSize: "14px", cursor: "pointer",
            }}
          >
            Cancel
          </button>

          {canAfford ? (
            <button
              onClick={onConfirm}
              style={{
                flex: 1, padding: "12px",
                border: "none", borderRadius: "10px",
                background: "#1D9E75", color: "#fff",
                fontWeight: "600", fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Confirm Booking
            </button>
          ) : (
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: "12px",
                border: "none", borderRadius: "10px",
                background: "#1D9E75", color: "#fff",
                fontWeight: "600", fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Earn Coins
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
