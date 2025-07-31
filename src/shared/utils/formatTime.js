// ✅ ISO 문자열 → 상대 시간 or YYYY-MM-DD 포맷
export const formatTime = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // 초 단위 차이
  const diffInDays = Math.floor(diff / 86400); // 일 단위 차이
  const diffInMonths =
    now.getMonth() -
    date.getMonth() +
    12 * (now.getFullYear() - date.getFullYear()); // 월 차이
  const diffInYears = now.getFullYear() - date.getFullYear(); // 년 차이

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diffInDays < 7) return `${diffInDays}일 전`;

  // 일주일 이상 → 1주, 2주, 3주 등
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;

  // 한 달 이상 → 1개월, 2개월
  if (diffInMonths < 12) return `${diffInMonths}개월 전`;

  // 1년 이상 → 1년, 2년
  if (diffInYears < 2) return `1년 전`;
  if (diffInYears < 3) return `2년 전`;

  // 3년 이상 → YYYY-MM-DD
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};
