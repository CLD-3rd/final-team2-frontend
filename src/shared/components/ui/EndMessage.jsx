"use client";

const EndMessage = ({ text = "✅ 모든 콘텐츠를 확인했어요!" }) => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "16px",
        color: "#28a745", // ✅ 녹색 강조
        fontWeight: "600",
        fontSize: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span className="check-icon">✅</span>
      <span>{text}</span>
    </div>
  );
};

export default EndMessage;
