// ✅ Feed 목록 조회 시
export const parseFeedsResponse = (data) => {
  if (!data || !Array.isArray(data.feeds)) return [];

  return data.feeds.map((feed) => ({
    id: feed.feed_id,
    userId: feed.user_id,
    title: feed.title,
    content: feed.content,
    image: feed.image_url,
    region: feed.location,
    badgeRequest: feed.badge_request === "Y",
    views: feed.view_count,
    likes: feed.like_count,
    createdAt: feed.created_at,
    updatedAt: feed.modified_at,
  }));
};

// ✅ 상세 피드 응답 파싱
export const parseFeedDetailResponse = (data) => {
  if (!data) return null;

  return {
    id: data.feedId,
    title: data.title,
    content: data.content,
    region: data.location, // 서버는 location, UI는 region
    images: data.imageUrls || [], // 기존 FeedDetailModal에서 images 사용
    date: formatTime(data.created_at),
    author: {
      nickname: data.author.nickname,
      profileImage: data.author.profileImage,
    },
    comments: (data.comments || []).map((comment) => ({
      id: comment.commentId,
      author: comment.author.nickname,
      profileImage: comment.author.profileImage,
      content: comment.content,
      timestamp: formatTime(comment.createdAt), // "방금 전", "2시간 전" 같은 포맷 함수 필요
      isMyComment: comment.isMyComment || false,
    })),
  };
};

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
