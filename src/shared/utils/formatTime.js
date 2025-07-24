// ✅ ISO 문자열 → 상대 시간 or YYYY-MM-DD 포맷
export const formatTime = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // 초 단위 차이

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

  // 일주일 이상 → YYYY-MM-DD
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};
