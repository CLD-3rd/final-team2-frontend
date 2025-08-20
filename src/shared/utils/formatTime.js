export const formatTime = (isoDate) => {
  // UTC 기준 Date 객체 생성
  const utcDate = new Date(isoDate);

  // KST 기준으로 9시간 더함
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(utcDate.getTime() + kstOffset);
  const now = new Date(Date.now());

  const diff = Math.floor((now - kstDate) / 1000); // 초 차이
  const diffInDays = Math.floor(diff / 86400);
  const diffInMonths =
    now.getMonth() -
    kstDate.getMonth() +
    12 * (now.getFullYear() - kstDate.getFullYear());
  const diffInYears = now.getFullYear() - kstDate.getFullYear();

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diffInDays < 7) return `${diffInDays}일 전`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
  if (diffInMonths < 12) return `${diffInMonths}개월 전`;
  if (diffInYears < 2) return `1년 전`;
  if (diffInYears < 3) return `2년 전`;

  return `${kstDate.getFullYear()}-${String(kstDate.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(kstDate.getDate()).padStart(2, "0")}`;
};
