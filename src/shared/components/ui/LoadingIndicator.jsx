"use client";

const LoadingIndicator = ({ text = "로딩 중..." }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        color: "#555",
        fontSize: "14px",
        gap: "8px",
      }}
    >
      <div className="spinner" />
      <span>{text}</span>
      <style jsx>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ccc;
          border-top: 2px solid #4cafef;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;
