// client/src/components/Gamification/BadgeToast.jsx

import { useState, useEffect } from "react";

export default function BadgeToast({ badge, message, onClose }) {
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(true);

  // Auto close after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(false);
      setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      top: "24px",
      right: "24px",
      zIndex: 9999,
      transform: animating ? "translateX(0)" : "translateX(120%)",
      transition: "transform 0.3s ease",
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid #B8E6D4",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow: "0 8px 24px rgba(29,158,117,0.15)",
        minWidth: "320px",
        maxWidth: "400px",
      }}>
        {/* Badge icon */}
        <div style={{
          width: "48px", height: "48px",
          borderRadius: "12px",
          background: "#E1F5EE",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "24px",
          flexShrink: 0,
        }}>🏅</div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <p style={{
            margin: "0 0 2px",
            fontSize: "11px", fontWeight: "600",
            color: "#1D9E75", textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>Badge Unlocked!</p>
          <p style={{
            margin: "0 0 4px",
            fontWeight: "700", fontSize: "15px", color: "#1a1a1a",
          }}>{badge}</p>
          <p style={{
            margin: 0, fontSize: "12px", color: "#888",
          }}>{message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={() => { setAnimating(false); setTimeout(() => setVisible(false), 300); }}
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
        height: "3px", background: "#E8E8E8",
        borderRadius: "0 0 16px 16px", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", background: "#1D9E75",
          width: "100%",
          animation: "shrink 4s linear forwards",
        }} />
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>
    </div>
  );
}
