import { formatTime } from "@/shared/utils/formatTime";

// ✅ Feed 목록 조회 시
export const parseFeedsResponse = (data) => {
  if (!data || !Array.isArray(data.feeds)) return [];

  return data.feeds.map((feed) => ({
    id: feed.feedId,
    author: {
      userId: feed.author.userId,
      nickname: feed.author.nickname,
      profileImgUrl: feed.author.profileImgUrl,
    },
    title: feed.title,
    content: feed.content,
    imageUrls: feed.imageUrls,
    location: feed.location,
    badgeRequest: feed.badgeRequest,
    viewCount: feed.viewCount,
    createdAt: feed.createdAt,
  }));
};

// ✅ 상세 피드 응답 파싱
export const parseFeedDetailResponse = (data) => {
  if (!data) return null;

  return {
    id: data.feedId,
    author: {
      userId: data.author.userId,
      nickname: data.author.nickname,
      profileImgUrl: data.author.profileImgUrl,
    },
    title: data.title,
    content: data.content,
    location: data.location,
    imageUrls: data.imageUrls,
    createdAt: formatTime(data.created_at),
    comments: (data.comments || []).map((comment) => ({
      id: comment.commentId,
      author: comment.author.nickname,
      profileImgUrl: comment.author.profileImgUrl,
      content: comment.content,
      timestamp: formatTime(comment.createdAt), // "방금 전", "2시간 전" 같은 포맷 함수 사용
      isMyComment: comment.isMyComment || false,
    })),
  };
};
