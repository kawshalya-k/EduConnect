// client/src/components/Gamification/CoinAwardToast.jsx

import { useState, useEffect } from "react";

export default function CoinAwardToast({ amount, reason, onClose }) {
  const [visible,   setVisible]   = useState(true);
  const [animating, setAnimating] = useState(true);

  // Auto close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(false);
      setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 9999,
      transform: animating ? "translateY(0)" : "translateY(120%)",
      transition: "transform 0.3s ease",
    }}>
      <div style={{
        background: "#0F2D27",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        minWidth: "300px",
        maxWidth: "380px",
        color: "#fff",
      }}>
        {/* Coin animation icon */}
        <div style={{
          width: "48px", height: "48px",
          borderRadius: "50%",
          background: "#1D9E75",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "22px",
          flexShrink: 0,
          animation: "bounce 0.5s ease",
        }}>🪙</div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <p style={{
            margin: "0 0 2px",
            fontSize: "11px", fontWeight: "600",
            color: "#1D9E75", textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>Coins Earned!</p>
          <p style={{
            margin: "0 0 4px",
            fontWeight: "700", fontSize: "20px",
            color: "#F9A825",
          }}>+{amount} Skill Coins</p>
          <p style={{
            margin: 0, fontSize: "12px",
            color: "#aaa",
          }}>{reason}</p>
        </div>

        {/* Close */}
        <button
          onClick={() => {
            setAnimating(false);
            setTimeout(() => setVisible(false), 300);
          }}
          style={{
            background: "none", border: "none",
            cursor: "pointer", color: "#aaa",
            fontSize: "18px", flexShrink: 0,
            padding: "0",
          }}
        >×</button>
      </div>

      {/* Progress bar */}
      <div style={{
        height: "3px", background: "rgba(255,255,255,0.1)",
        borderRadius: "0 0 16px 16px", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", background: "#1D9E75",
          animation: "shrink 5s linear forwards",
        }} />
      </div>

      <style>{`
        @keyframes bounce {
          0%   { transform: scale(0.8); }
          50%  { transform: scale(1.2); }
          100% { transform: scale(1);   }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>
    </div>
  );
}
